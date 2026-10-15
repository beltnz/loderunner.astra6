import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Machine,CLOCK,pixels} from './machine.mjs';
const results=[];
function test(name,fn){fn();results.push({name,result:'pass'});console.log('PASS',name);}
function ready(n=1){const m=new Machine({testLimit:10});m.reset(n);m.run(CLOCK*9);return m;}
function call(m,pc){const s=m.cpu.getState();m.mem[0x1fe]=0xff;m.mem[0x1ff]=0x02;m.cpu.setState({...s,sp:0xfd,pc});let n=0;while(m.cpu.getPC()!==0x300){if(++n>2000000)throw Error('Subroutine timeout '+pc.toString(16));if(!m.hook())m.cpu.step();}}
const tile=(m,x,y,bg=false)=>m.mem[(bg?0xa00:0x800)+28*y+x];
function put(m,x,y,v,bg=true){m.mem[0x800+28*y+x]=v;if(bg)m.mem[0xa00+28*y+x]=v;}
function place(m,x,y){for(let i=0;i<448;i++)if(m.mem[0x800+i]===9)m.mem[0x800+i]=m.mem[0xa00+i];m.mem[0]=x;m.mem[1]=y;m.mem[2]=m.mem[3]=2;put(m,x,y,9,false);}
function fixture(){const m=ready();m.mem.fill(0,0x800,0xbC0);m.mem[0x8d]=0;m.mem[0x9c]=0;m.mem[0x9e]=m.mem[0x9f]=0;m.mem.fill(0,0xca0,0xd00);place(m,10,10);return m;}
for(let level=1;level<=10;level++)test(`Level ${level}: original map, live controls, guards, 45-second playability smoke`,()=>{
  const m=ready(level),s=m.status();assert.equal(s.map,level);assert(s.col<28&&s.row<16);assert(s.guards>0);assert(s.gold>0&&s.gold<100);
  const initial=pixels(m),positions=new Set();
  const inputs=[76,74,73,75,85,79,32,74,73,76,79,75];
  for(let i=0;i<90;i++){m.press(inputs[i%inputs.length]);m.run(CLOCK/2);positions.add(`${m.mem[0]},${m.mem[1]},${m.mem[2]},${m.mem[3]}`);assert(m.loads.every(l=>l<=10));}
  assert(positions.size>2,'player must respond or fall');assert.notDeepEqual(pixels(m),initial);
});
test('Gold pickup awards 250 and cannot be collected twice',()=>{const m=fixture();m.mem[0xa00+10*28+10]=7;m.mem[0x93]=1;call(m,0x6b9d);assert.equal(m.mem[0x93],0);assert.equal(m.mem[0x8e],0x50);assert.equal(m.mem[0x8f],2);call(m,0x6b9d);assert.equal(m.mem[0x8f],2);});
test('Horizontal travel is blocked by stone',()=>{const m=fixture();put(m,10,11,2);put(m,11,10,2);m.mem[0x9e]=m.mem[0x9f]=0xcc;for(let i=0;i<12;i++)call(m,0x64bd);assert.equal(m.mem[0],10);});
test('Gravity, rope support, ladder climbing and trap doors',()=>{
  let m=fixture();for(let i=0;i<5;i++)call(m,0x64bd);assert(m.mem[1]>10);
  m=fixture();m.mem[0xa00+10*28+10]=4;for(let i=0;i<10;i++)call(m,0x64bd);assert.equal(m.mem[1],10);
  m=fixture();put(m,10,9,3);m.mem[0xa00+10*28+10]=3;m.mem[0x9e]=0xc9;for(let i=0;i<5;i++)call(m,0x64bd);assert(m.mem[1]<10);
  m=fixture();put(m,10,11,5);for(let i=0;i<7;i++)call(m,0x64bd);assert(m.mem[1]>10);
});
test('Dig opens only eligible brick and starts a refill timer',()=>{
  const m=fixture();put(m,10,11,1);put(m,9,11,1);m.mem[0x9e]=0xd5;
  for(let i=0;i<14;i++)call(m,0x64bd);
  assert.equal(tile(m,9,11),0);assert(Array.from(m.mem.slice(0xce0,0xcff)).some(v=>v>0));
  for(let i=0;i<185;i++)call(m,0x75f4);assert.equal(tile(m,9,11),1);
  const s=fixture();put(s,10,11,1);put(s,9,11,2);s.mem[0x9e]=0xd5;for(let i=0;i<14;i++)call(s,0x64bd);assert.equal(tile(s,9,11),2);
});
test('Occupied space above a brick prevents digging',()=>{const m=fixture();put(m,10,11,1);put(m,9,11,1);put(m,9,10,3);m.mem[0x9e]=0xd5;for(let i=0;i<15;i++)call(m,0x64bd);assert.equal(tile(m,9,11),1);assert.equal(m.mem[0x9c],0);});
test('Refilling hole kills the player',()=>{const m=fixture();m.mem[0xa00+10*28+10]=1;m.mem[0xca0]=10;m.mem[0xcc0]=10;m.mem[0xce0]=1;call(m,0x75f4);assert.equal(m.mem[0x9a],0);});
test('Buried guard receives resurrection timer and 75 points',()=>{const m=fixture();m.mem[0x8d]=1;put(m,8,10,8,false);m.mem[0xa00+10*28+8]=1;m.mem[0xc61]=8;m.mem[0xc69]=10;m.mem[0xc79]=m.mem[0xc81]=2;m.mem[0xc71]=0;m.mem[0xca0]=8;m.mem[0xcc0]=10;m.mem[0xce0]=1;call(m,0x75f4);assert.equal(m.mem[0xc99],20);assert.equal(m.mem[0x8e],0x75);assert.equal(tile(m,8,10),1);});
test('Guards fall into holes, award trap points, and climb out',()=>{const m=fixture();for(let x=0;x<28;x++)put(m,x,11,1);put(m,12,11,0,false);put(m,12,10,8,false);m.mem[0x8d]=1;m.mem[0xc61]=12;m.mem[0xc69]=10;m.mem[0xc79]=m.mem[0xc81]=2;m.mem[0xc71]=0;m.mem[0xc99]=0;m.mem[0x19]=0;m.mem[0x60]=m.mem[0x61]=m.mem[0x62]=1;m.mem[0x5f]=38;
  let trapped=false,escaped=false;for(let i=0;i<80;i++){call(m,0x6c82);if(m.mem[0xc69]===11&&m.mem[0xc71]>0)trapped=true;if(trapped&&m.mem[0xc69]===10)escaped=true;}assert(trapped);assert(escaped);assert.equal(m.mem[0x8e],0x75);});
test('Guard gold pickup and drop preserve the outstanding gold count',()=>{const m=fixture();m.mem[0x12]=8;m.mem[0x13]=10;m.mem[0x17]=m.mem[0x18]=2;m.mem[0x16]=0;m.mem[0x53]=0;m.mem[0x93]=1;put(m,8,10,7);call(m,0x74f7);assert.equal(m.mem[0x16],255);assert.equal(tile(m,8,10,true),0);assert.equal(m.mem[0x93],1);call(m,0x753e);assert.equal(tile(m,8,10,true),7);assert.equal(m.mem[0x93],1);});
test('A guard falling onto the player kills the player',()=>{const m=fixture();put(m,10,11,1);put(m,10,9,8,false);m.mem[0x8d]=1;m.mem[0xc61]=10;m.mem[0xc69]=9;m.mem[0xc79]=m.mem[0xc81]=2;m.mem[0xc71]=0;m.mem[0xc99]=0;m.mem[0x19]=0;m.mem[0x60]=m.mem[0x61]=m.mem[0x62]=1;for(let i=0;i<8;i++)call(m,0x6c82);assert.equal(m.mem[0x9a],0);});
test('Hidden ladders reveal after gold is exhausted',()=>{const m=ready();const hidden=[];for(let i=1;i<=m.mem[0xa3];i++)hidden.push([m.mem[0xc00+i],m.mem[0xc30+i]]);assert(hidden.length);m.mem[0x93]=0;call(m,0x8631);for(const [x,y]of hidden)assert.equal(tile(m,x,y,true),3);});
test('Death resets the same level and consumes one life',()=>{const m=ready(2);m.press(32);m.run(CLOCK/2);const lives=m.mem[0x98];m.press(1);m.run(CLOCK*12);assert.equal(m.mem[0x96],1);assert.equal(m.mem[0x98],lives-1);});
test('Level completion grants 1,500 points, one life, and advances 1 to 2',()=>{const m=ready();m.press(32);m.run(CLOCK/2);m.mem[0x93]=0xff;m.mem[0]=0;m.mem[1]=0;m.mem[2]=m.mem[3]=2;m.mem[0xa00]=3;m.mem[0x800]=9;m.press(32);m.run(CLOCK*14);assert.equal(m.mem[0x96],1);assert.equal(m.mem[0x98],6);assert.equal(m.mem[0x8f],0x15);});
test('Snapshot restores deterministic CPU and game state',()=>{const m=ready(3);m.press(76);m.run(CLOCK);const s=m.snapshot();m.run(CLOCK);const expected=m.snapshot();m.restore(s);m.run(CLOCK);assert.deepEqual(m.snapshot(),expected);});
test('QA gate refuses level 11 before loading or running it',()=>{const m=ready();assert.throws(()=>m.reset(11),/allowed range/);m.mem[0x96]=10;m.cpu.setPC(0x630e);assert.throws(()=>m.hook(),/boundary/);assert(!m.loads.includes(11));});
fs.writeFileSync('tests/results.json',JSON.stringify({scope:'Only original levels 1–10 and isolated mechanics fixtures based on level 1. No full solution walkthrough claimed.',results},null,2));
