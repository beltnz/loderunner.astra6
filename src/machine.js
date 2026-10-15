// SPDX-License-Identifier: MIT
import { CPU6502 } from '../vendor/cpu6502-runtime/js/cpu6502.ts';
import { program, levelData } from './data.js';
const decode = s => Uint8Array.from(atob(s), c=>c.charCodeAt(0));
const image = decode(program), levels = decode(levelData);
export const CLOCK = 1020484;
export class Machine {
  constructor({testLimit=150,onSpeaker=()=>{},onScores=()=>{}}={}) {
    this.testLimit=testLimit; this.onSpeaker=onSpeaker; this.onScores=onScores;
    this.mem=new Uint8Array(65536); this.cpu=new CPU6502(); this.page=0x2000;
    this.key=0; this.loads=[]; this.highScores=null;
    this.cpu.addPageHandler({start:()=>0,end:()=>255,read:(p,o)=>this.read((p<<8)|o),write:(p,o,v)=>this.write((p<<8)|o,v)});
    this.reset();
  }
  reset(level=1) {
    if(!Number.isInteger(level)||level<1||level>this.testLimit) throw Error('Level outside allowed range');
    this.mem.fill(0);this.mem.set(image);this.cpu.reset();this.key=0;this.page=0x2000;this.textEntry=false;
    this.mem[0x95]=0xcb;this.mem[0x99]=1;this.mem[0x8c]=6;
    this.mem[0xa7]=2;this.mem[0xa6]=level;this.mem[0x96]=level-1;this.mem[0x9d]=1;
    this.mem[0x1f]=0x20;this.mem[0x87]=0x20;
    this.cpu.setPC(0x6056);
  }
  read(a) {
    if(a===0xc000)return this.key;
    if(a===0xc010){this.key&=127;return this.key;}
    if(a===0xc030)this.onSpeaker(this.cpu.getCycles());
    if(a===0xc054)this.page=0x2000;
    if(a===0xc055)this.page=0x4000;
    if(a>=0xc000)return 0;
    return this.mem[a];
  }
  write(a,v){if(a>=0xc000)this.read(a);else this.mem[a]=v;}
  press(code){this.key=code|128;}
  ret(a,clearCarry=true){
    const s=this.cpu.getState();let sp=s.sp;
    const lo=this.mem[0x100|(++sp&255)],hi=this.mem[0x100|(++sp&255)];
    this.cpu.setState({...s,a:a??s.a,s:clearCarry?s.s&254:s.s,sp:sp&255,pc:((hi<<8|lo)+1)&65535});
  }
  hook(){
    const pc=this.cpu.getPC();
    if(pc===0x85f3)this.textEntry=true;
    if(pc===0x630e){
      this.textEntry=false;
      const index=this.mem[0x96];
      if(this.testLimit<150&&index>=this.testLimit)throw Error(`Testing boundary: level ${index+1} blocked`);
      if(this.cpu.getState().a!==1)throw Error('Original disk editing is unavailable');
      this.mem.fill(0,0xd00,0xe00);
      if(this.mem[0xa7]<2){const addr=0x9e00+this.mem[0xa6]*256;this.mem.set(this.mem.slice(addr,addr+256),0xd00);}
      else if(index<150)this.mem.set(levels.subarray(index*256,index*256+256),0xd00);
      this.loads.push(index+1);this.ret();return true;
    }
    if(pc===0x6359){
      if(this.cpu.getState().a===2){this.highScores=Array.from(this.mem.slice(0x1f00,0x2000));this.onScores(this.highScores);}
      else if(this.highScores)this.mem.set(this.highScores,0x1f00);
      this.ret(1);return true;
    }
    return false;
  }
  run(cycles){
    const end=this.cpu.getCycles()+cycles;
    while(this.cpu.getCycles()<end){if(!this.hook())this.cpu.step();}
  }
  snapshot(){return {version:1,cpu:this.cpu.getState(),memory:Array.from(this.mem),page:this.page,key:this.key,textEntry:this.textEntry,highScores:this.highScores};}
  restore(s){
    if(s?.version!==1||s.memory?.length!==65536||!s.memory.every(v=>Number.isInteger(v)&&v>=0&&v<256)||![0x2000,0x4000].includes(s.page))throw Error('Invalid save file');
    for(const k of ['a','x','y','s','sp'])if(!Number.isInteger(s.cpu?.[k])||s.cpu[k]<0||s.cpu[k]>255)throw Error('Invalid CPU state');
    if(!Number.isInteger(s.cpu.pc)||s.cpu.pc<0||s.cpu.pc>65535||!Number.isSafeInteger(s.cpu.cycles)||s.cpu.cycles<0)throw Error('Invalid CPU state');
    if(s.memory[0x96]>=this.testLimit)throw Error('Save exceeds allowed level range');
    if(!Number.isInteger(s.key)||s.key<0||s.key>255)throw Error('Invalid keyboard state');
    if(s.highScores!==null&&(!Array.isArray(s.highScores)||s.highScores.length!==256||!s.highScores.every(v=>Number.isInteger(v)&&v>=0&&v<=255)))throw Error('Invalid score data');
    this.mem.set(s.memory);this.cpu.setState(s.cpu);this.page=s.page;this.highScores=s.highScores;this.key=s.key;this.textEntry=!!s.textEntry;
  }
  status(){return {level:this.mem[0xa6],map:this.mem[0x96]+1,lives:this.mem[0x98],gold:this.mem[0x93],col:this.mem[0],row:this.mem[1],guards:this.mem[0x8d],pc:this.cpu.getPC()};}
}
export function pixels(machine,mono=false){
  const out=new Uint8ClampedArray(280*192*4),bits=new Uint8Array(282),phase=new Uint8Array(280);
  const palette=[[184,66,255],[65,222,57],[43,147,255],[255,146,48]];
  for(let y=0;y<192;y++){
    const addr=machine.page+((y&7)<<10)+((y&56)<<4)+((y>>6)*40);
    bits.fill(0);
    for(let b=0;b<40;b++){const v=machine.mem[addr+b];for(let n=0;n<7;n++){const x=b*7+n;bits[x+1]=(v>>n)&1;phase[x]=v>>7;}}
    for(let x=0;x<280;x++){
      let color=[0,0,0];
      if(bits[x+1])color=mono?[111,255,146]:(bits[x]||bits[x+2]?[245,245,236]:palette[phase[x]*2+(x&1)]);
      // Alternating HGR bits form a continuous chroma run on a color monitor.
      // Fill its interstitial sample; do not add this artifact in monochrome.
      else if(!mono&&bits[x]&&bits[x+2]&&phase[x-1]===phase[x+1])color=palette[phase[x-1]*2+((x-1)&1)];
      const i=(y*280+x)*4;out[i]=color[0];out[i+1]=color[1];out[i+2]=color[2];out[i+3]=255;
    }
  }
  return out;
}
