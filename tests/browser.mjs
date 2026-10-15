import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const browsers=[['Chrome','C:/Program Files/Google/Chrome/Application/chrome.exe'],['Edge','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']];
const results=[];
for(const [name,executablePath]of browsers){
 const browser=await chromium.launch({executablePath,headless:true});
 try{
 const context=await browser.newContext({viewport:{width:1200,height:1000},offline:true,acceptDownloads:true});
 const page=await context.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
 await page.goto(pathToFileURL(path.resolve('dist/Lode Runner.html')).href+'?qa');
 await page.screenshot({path:`tests/${name.toLowerCase()}-title.png`,fullPage:true});
 await page.click('#start');await page.keyboard.press('ArrowRight');await page.waitForTimeout(650);await page.keyboard.press('Space');
 assert((await page.evaluate(()=>lodeQA.status())).col>14,'keyboard must move runner');
 await page.keyboard.press('Escape');const paused=await page.evaluate(()=>lodeQA.machine.cpu.getCycles());await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>lodeQA.machine.cpu.getCycles()),paused);
 await page.click('#save');assert.match(await page.locator('#save-status').innerText(),/SAVED/);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('lr-save')));
 const downloadEvent=page.waitForEvent('download');await page.click('#export');const download=await downloadEvent;await download.saveAs(`tests/${name.toLowerCase()}-save.json`);
 await page.click('#new');await page.click('#resume');assert.deepEqual(await page.evaluate(()=>lodeQA.machine.snapshot()),saved);
 await page.setInputFiles('#import',`tests/${name.toLowerCase()}-save.json`);await page.waitForFunction(()=>document.getElementById('save-status').textContent==='SAVE IMPORTED');
 await page.setInputFiles('#import',{name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});await page.waitForFunction(()=>document.getElementById('save-status').textContent==='INVALID SAVE FILE');
 await page.click('#display');assert.equal(await page.locator('#display').innerText(),'Green');await page.click('#display');
 await page.click('#sound');assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
 await page.click('#help');assert(await page.locator('#instructions').evaluate(e=>e.open));await page.click('#close-help');
 for(let level=1;level<=10;level++){
   await page.evaluate(n=>{lodeQA.pause();lodeQA.prepare(n);lodeQA.machine.press(76);lodeQA.machine.run(510242);lodeQA.draw();document.getElementById('overlay').hidden=true;},level);
   const status=await page.evaluate(()=>lodeQA.status());assert.equal(status.map,level);assert(status.guards>0&&status.lives>0);
   await page.screenshot({path:`tests/${name.toLowerCase()}-level-${String(level).padStart(2,'0')}.png`,fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:`tests/${name.toLowerCase()}-mobile.png`,fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile must not overflow');
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 results.push({browser:name,version:browser.version(),offline:true,levels:'1–10 only',checks:'Keyboard, pause, local save, export/import, invalid import, color, audio activation, help, mobile layout, original maps rendered; no browser errors or network requests',result:'pass'});
 console.log('PASS',name,browser.version());
 }finally{await browser.close();}
}
fs.writeFileSync('tests/browser-results.json',JSON.stringify(results,null,2));
