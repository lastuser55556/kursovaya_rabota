// LOCAL VM MOCKS ONLY: these assertions do not prove GA4 delivery or DebugView.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('js/analytics.js','utf8');
function run({id='G-YEMK5T27NW',path='winter-tips.html',query='',referrer='https://example.test/source?email=private%40example.test#phone',storage=new Map()}={}) {
 const dispatched=[],scripts=[],listeners={};
 const element=()=>({dataset:{},addEventListener(name,fn){this[name]=fn;}});
 const existing=element();
 const document={referrer,querySelector:()=>existing,createElement:element,head:{append:node=>scripts.push(node)},addEventListener:(name,fn)=>listeners[name]=fn,dispatchEvent:event=>dispatched.push(event)};
 const location={href:`https://example.test/${path}${query}`,search:new URL(`https://example.test/${path}${query}`).search};
 const window={K21_CONFIG:{ga4Id:id}};
 const ctx={window,document,location,URL,URLSearchParams,Date,Set,Object,String,CustomEvent:class{constructor(name,options){this.name=name;this.detail=options.detail;}},sessionStorage:{getItem:key=>storage.get(key)||null,setItem:(key,val)=>storage.set(key,val)}};
 vm.createContext(ctx);vm.runInContext(source,ctx);
 return {window,document,existing,scripts,dispatched,storage,calls:()=>window.dataLayer.map(x=>Array.from(x))};
}
const query='?utm_source=instagram&utm_medium=social&utm_campaign=winter_tires_2026&utm_content=reel_01&utm_term=tire&email=private%40example.test&phone=79001212121&debug_mode=1#private';
const active=run({query});
assert.equal(typeof active.window.gtag,'function');
const config=active.calls().find(x=>x[0]==='config');assert.equal(config[1],'G-YEMK5T27NW');
const page=new URL(config[2].page_location);assert.equal(page.hash,'');assert.equal(page.searchParams.size,5);
assert.deepEqual([...page.searchParams.keys()],['utm_source','utm_medium','utm_campaign','utm_content','utm_term']);
assert.equal(config[2].page_referrer,'https://example.test/source');assert.equal(config[2].debug_mode,true);
assert.equal(active.existing.dataset.debug,'true');active.existing.load();assert.equal(active.existing.dataset.status,'loaded');active.existing.error();assert.equal(active.existing.dataset.status,'failed');
const cold=run();assert.equal('debug_mode' in cold.calls().find(x=>x[0]==='config')[2],false);
const persisted=run({storage:active.storage});assert.equal(persisted.calls().find(x=>x[0]==='config')[2].debug_mode,true);
const off=run({query:'?debug_mode=0',storage:active.storage});assert.equal('debug_mode' in off.calls().find(x=>x[0]==='config')[2],false);
active.window.K21.track('tire_calc',{rim_size:'r16_17',car_type:'crossover',total_price:2420,name:'private',phone:'+79001212121',email:'private@example.test',arbitrary:'x'});
let event=active.calls().filter(x=>x[0]==='event').at(-1);assert.deepEqual(Object.keys(event[2]).sort(),['car_type','rim_size','total_price']);assert.equal(event[2].total_price,2420);
active.window.K21.track('cta_click',{button_name:'x'.repeat(150),page_section:'hero'});event=active.calls().filter(x=>x[0]==='event').at(-1);assert.equal(event[2].button_name.length,100);
const before=active.calls().length;active.window.K21.track('unknown_event',{phone:'private'});assert.equal(active.calls().length,before);
const disabled=run({id:''});disabled.window.K21.track('cta_click',{button_name:'hero'});assert.equal(disabled.calls().length,0);assert.equal(disabled.dispatched.at(-1).detail.sent,false);
for(const path of ['index.html','tires.html','storage.html','services.html','winter-tips.html','contacts.html','thanks.html','privacy.html','404.html']){
 const landing=run({path,query:'?utm_source=telegram&utm_medium=social&utm_campaign=winter_tires_2026&utm_content=post_01'});
 assert.equal(JSON.parse(landing.storage.get('k21_utm')).utm_source,'telegram',path);
}
const sanitized=run({query:'?utm_source=PRIVATE%40EMAIL.TEST&utm_campaign=bad-value'});
assert.equal(JSON.parse(sanitized.storage.get('k21_utm')).utm_source,'direct');assert.equal(JSON.parse(sanitized.storage.get('k21_utm')).utm_campaign,'not_set');
console.log('PASS: local analytics contract: GA4 bootstrap, 5-UTM URL allowlist, referrer stripping, debug opt-in/reset, disabled ID, parameter allowlist, length cap, event whitelist, all 9 landing paths and UTM sanitization. NOT a GA4 delivery test.');
