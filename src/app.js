// SPDX-License-Identifier: MIT
import {Machine,CLOCK,pixels} from './machine.js';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d',{alpha:false});
let running=false,started=false,mono=false,sound=false,last=0,audio=null,audioTime=0,speakerLevel=.16,speakerCycle=0,audioEvents=[];
const storage={get(k){try{return localStorage.getItem(k);}catch{return null;}},set(k,v){try{localStorage.setItem(k,v);return true;}catch{return false;}}};
const machine=new Machine({onSpeaker(c){audioEvents.push(c);},onScores(s){storage.set('lr-scores',JSON.stringify(s));}});
try{const scores=JSON.parse(storage.get('lr-scores'));if(Array.isArray(scores)&&scores.length===256)machine.highScores=scores;}catch{}
function prepare(level=1){machine.reset(level);machine.run(CLOCK*9);audioEvents=[];draw();}
function draw(){ctx.putImageData(new ImageData(pixels(machine,mono),280,192),0,0);const s=machine.status();$('status').textContent=`LEVEL ${String(s.map).padStart(3,'0')} / 150 · ${s.lives} LIVES`;}
function note(s){$('save-status').textContent=s;}
function overlay(title,copy,label){$('overlay-title').innerHTML=title;$('overlay-copy').textContent=copy;$('start').textContent=label;$('overlay').hidden=false;}
function pause(){if(!started)return;running=false;$('pause').textContent='Resume';overlay('Take a breather.','Your run is paused.','Resume →');audioTime=0;}
function play(){if(!started)machine.press(32);started=true;running=true;$('overlay').hidden=true;$('pause').textContent='Pause';canvas.focus();last=performance.now();}
function soundFrame(start,end){
  if(!audio||!sound){audioEvents=[];return;}
  if(audioTime<audio.currentTime||audioTime>audio.currentTime+.15)audioTime=audio.currentTime+.025;
  const count=Math.max(1,Math.round((end-start)/CLOCK*audio.sampleRate)),buffer=audio.createBuffer(1,count,audio.sampleRate),data=buffer.getChannelData(0);
  let j=0;for(let i=0;i<count;i++){const c=start+i*CLOCK/audio.sampleRate;while(j<audioEvents.length&&audioEvents[j]<=c){speakerLevel=-speakerLevel;speakerCycle=audioEvents[j++];}data[i]=speakerLevel*Math.max(0,1-(c-speakerCycle)/(CLOCK*.025));}
  audioEvents=[];const source=audio.createBufferSource();source.buffer=buffer;source.connect(audio.destination);source.start(audioTime);audioTime+=count/audio.sampleRate;
}
function frame(now){
  if(running){const dt=Math.min((now-last)/1000,.05),start=machine.cpu.getCycles();try{machine.run(Math.round(dt*CLOCK));soundFrame(start,machine.cpu.getCycles());draw();}catch(e){pause();note(e.message);}}
  last=now;requestAnimationFrame(frame);
}
$('start').onclick=play;$('pause').onclick=()=>running?pause():play();
$('new').onclick=()=>{prepare();started=false;play();note('NEW GAME');};
$('practice').onclick=()=>{const n=Number($('level').value);if(!Number.isInteger(n)||n<1||n>150){note('CHOOSE LEVEL 1–150');return;}prepare(n);started=false;play();note('PRACTICE RUN');};
$('display').onclick=()=>{mono=!mono;$('display').textContent=mono?'Green':'Color';draw();};
$('sound').onclick=async()=>{if(!audio)audio=new AudioContext();await audio.resume();sound=!sound;audioTime=0;$('sound').textContent=sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(sound));};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('screen').requestFullscreen();}catch{note('FULLSCREEN UNAVAILABLE');}};
$('help').onclick=()=>{pause();$('instructions').showModal();};$('close-help').onclick=()=>$('instructions').close();
function save(){if(!started){note('START A GAME FIRST');return;}note(storage.set('lr-save',JSON.stringify(machine.snapshot()))?'GAME SAVED':'STORAGE UNAVAILABLE · USE EXPORT');}
$('save').onclick=save;
$('resume').onclick=()=>{try{const s=storage.get('lr-save');if(!s){note('NO SAVED GAME');return;}machine.restore(JSON.parse(s));started=true;draw();pause();note('SAVE LOADED');}catch{note('COULD NOT LOAD SAVE');}};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(machine.snapshot())],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='lode-runner-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);note('SAVE EXPORTED');};
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error();machine.restore(JSON.parse(await file.text()));started=true;draw();pause();note('SAVE IMPORTED');}catch{note('INVALID SAVE FILE');}e.target.value='';};
const keys={ArrowLeft:'J',ArrowRight:'L',ArrowUp:'I',ArrowDown:'K',z:'U',x:'O',i:'I',j:'J',k:'K',l:'L',u:'U',o:'O',' ':' '};
document.addEventListener('keydown',e=>{
  if($('instructions').open||['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;
  if(e.key==='Escape'){e.preventDefault();if(started)running?pause():play();return;}
  if(!running)return;
  if(e.ctrlKey&&e.key.toLowerCase()==='a'){e.preventDefault();machine.press(1);return;}
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(machine.textEntry){const code=({Enter:13,Backspace:8,ArrowLeft:8,ArrowRight:21})[e.key]??(e.key.length===1?e.key.toUpperCase().charCodeAt(0):null);if(code!==null){e.preventDefault();machine.press(code);}return;}
  const key=keys[e.key]||keys[e.key.toLowerCase()];
  if(key){e.preventDefault();machine.press(key.charCodeAt(0));}
  else if(e.key==='Enter'){e.preventDefault();machine.press(13);}
  else if(e.key.length===1&&/[a-z]/i.test(e.key)){machine.press(e.key.toUpperCase().charCodeAt(0));}
});
for(const b of document.querySelectorAll('[data-key]')){b.onpointerdown=e=>{e.preventDefault();if(!running)return;b.setPointerCapture(e.pointerId);machine.press(b.dataset.key.charCodeAt(0));};b.onpointerup=()=>machine.press(32);b.onpointercancel=()=>machine.press(32);}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.addEventListener('blur',()=>{if(running)pause();});
prepare();requestAnimationFrame(frame);
// QA is opt-in and strictly refuses execution outside the first ten levels.
if(new URLSearchParams(location.search).has('qa')){machine.testLimit=10;window.lodeQA={machine,prepare,play,pause,draw,status:()=>machine.status()};}
