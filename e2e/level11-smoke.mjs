import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=process.cwd();
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url,'http://localhost'),file=resolve(root,'.'+u.pathname.replace(/\/$/,'/index.html'));
 if(!file.startsWith(root+'/'))throw Error('Outside repo');
 const data=await readFile(file);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json'})[extname(file)]||'application/octet-stream');res.end(data);
}catch{res.writeHead(404).end()}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port;
const engine=process.env.E2E_BROWSER==='webkit'?webkit:chromium;
let browser;
try{
 browser=await engine.launch(engine===webkit?{}:{args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 for(const width of [390,1180]){
  const page=await browser.newPage({viewport:{width,height:820}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>window.__CompanionBridge?.read);
  const initial=await page.evaluate(()=>{const s=window.__CompanionBridge.read();return{hp:s.hp,max:s.maxHp,attacks:s.attacksLeft,hitDice:s.hitDice}});
  assert.deepEqual(initial,{hp:114,max:114,attacks:3,hitDice:11});
  // Regression: three attacks are spent, and the standard Action cell must restore all three.
  await page.waitForFunction(()=>!!document.querySelector('#cc-turnbar-standard .cc-turn-action'));
  await page.evaluate(()=>{
    document.getElementById('manualRoll').value='1'; // Natural miss: no hit/target confirmation needed.
    for(let i=0;i<3;i++)startAttack();
  });
  const spent=await page.evaluate(()=>{const s=window.__CompanionBridge.read();return{attacks:s.attacksLeft,used:s.used.action}});
  assert.deepEqual(spent,{attacks:0,used:true},'three weapon attacks must consume the action');
  const actionCell=page.locator(width>=700?'#cc-turnbar-standard .cc-turn-action':'#ecoAction');
  await actionCell.click();
  const restored=await page.evaluate(()=>{const s=window.__CompanionBridge.read();return{attacks:s.attacksLeft,max:s.attacksMax,used:s.used.action}});
  assert.deepEqual(restored,{attacks:3,max:3,used:false},'click Action must restore all 3 attacks');
  await actionCell.click();
  const manuallySpent=await page.evaluate(()=>{const s=window.__CompanionBridge.read();return{attacks:s.attacksLeft,used:s.used.action}});
  assert.deepEqual(manuallySpent,{attacks:0,used:true},'click Action again must mark it spent');
  await actionCell.click();
  assert.equal(await page.evaluate(()=>window.__CompanionBridge.read().attacksLeft),3);
  await page.evaluate(()=>{const s=window.__CompanionBridge.read();for(let i=0;i<3;i++)startAttack();actionSurge();startAttack()});
  const surged=await page.evaluate(()=>{const s=window.__CompanionBridge.read();return{attacks:s.attacksLeft,extra:s.extraAction,surge:s.surge,max:s.attacksMax}});
  assert.deepEqual(surged,{attacks:2,extra:false,surge:0,max:6},'Fougue grants a separate action of 3 attacks');
  await page.evaluate(()=>window.__CompanionBridge.commands.nextTurn());
  assert.equal(await page.evaluate(()=>window.__CompanionBridge.read().attacksLeft),3);

  await page.evaluate(()=>{const s=structuredClone(window.__CompanionBridge.read());s.hp=54;s.maxHp=104;s.hitDice=0;s.attacksLeft=0;s.attacksMax=2;localStorage.setItem('brackmard-v2',JSON.stringify(s))});
  await page.reload();await page.waitForFunction(()=>window.__CompanionBridge?.read);
  const migrated=await page.evaluate(()=>{const s=window.__CompanionBridge.read();return{hp:s.hp,max:s.maxHp,attacks:s.attacksLeft,maxAttacks:s.attacksMax,hitDice:s.hitDice}});
  assert.deepEqual(migrated,{hp:64,max:114,attacks:1,maxAttacks:3,hitDice:1});
  assert.deepEqual(errors,[],'no browser runtime errors');
  await page.close();
 }
 console.log('Level 11 browser smoke passed:',process.env.E2E_BROWSER||'chromium');
}finally{await browser?.close();await new Promise(ok=>server.close(ok))}
