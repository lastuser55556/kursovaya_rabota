// Локальная проверка кода Apps Script в VM, без обращения к Google.
const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const rows=[];let locked=false;
const sheet={getLastRow:()=>rows.length+1,getRange:()=>({getValues:()=>rows}),appendRow:row=>rows.push(row)};
const ctx={console,Date,JSON,Object,String,Array,Number,RegExp,ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this;}})},PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'educational-sheet'})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),flush(){}},LockService:{getScriptLock:()=>({tryLock(){locked=true;return true;},hasLock:()=>locked,releaseLock(){locked=false;}})}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('apps-script/Code.gs','utf8'),ctx);
const next=new Date(Date.now()+86400000);const date=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Moscow'}).format(next);
const payload={request_id:'REQ-12345678-1234-4123-8123-123456789012',name:'Тест',phone:'+79001212121',email:'test@example.test',car_type:'crossover',rim_size:'r16_17',slot:date+'T10:00:00+03:00',utm_source:'instagram',utm_medium:'social',utm_campaign:'winter_tires_2026',utm_content:'reel_tread_01',consent:true,status:'visited'};
const post=data=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(data)}}).text);
assert.equal(post(payload).ok,true);assert.equal(rows.length,1);assert.equal(rows[0][12],'new');assert.equal(rows[0][8],'instagram');assert.equal(rows[0][3],"'+79001212121");
assert.equal(post(payload).error,'duplicate');assert.equal(rows.length,1);assert.equal(locked,false);
for (const [field,value] of [['phone','123'],['name','x'],['email','invalid'],['car_type','bus'],['rim_size','r0'],['slot','2020-01-01T10:00:00+03:00'],['consent',false],['utm_source','=IMPORTXML()']]){const result=post({...payload,[field]:value});assert.equal(result.ok,false,field);assert.equal(result.field,field);}
assert.equal(ctx.doPost({postData:{contents:'bad json'}}).text.includes('invalid_json'),true);
for(let i=3;i<=5;i++)assert.equal(post({...payload,request_id:`REQ-12345678-1234-4123-8123-12345678901${i}`}).ok,true);
assert.equal(post({...payload,request_id:'REQ-12345678-1234-4123-8123-123456789016'}).error,'slot_full');
rows[0][12]='no_show';assert.equal(post({...payload,request_id:'REQ-12345678-1234-4123-8123-123456789016'}).ok,true);
assert.equal(rows.length,5);assert.equal(locked,false);
console.log('PASS: valid write, server status, UTM, text phone, duplicate, eight validation cases, invalid JSON, capacity and no_show release. Local VM only, not Google integration.');
const fixedNow = new Date('2026-11-06T23:30:00-08:00'); // Москва уже 7 ноября.
assert.equal(!!ctx.validatePayload({...payload,slot:'2026-11-20T21:00:00+03:00'},fixedNow).data,true);
assert.equal(ctx.validatePayload({...payload,slot:'2026-11-21T08:00:00+03:00'},fixedNow).error,'invalid_slot');
assert.equal(ctx.validatePayload({...payload,slot:'2026-11-07T08:00:00+03:00'},fixedNow).error,'invalid_slot');
assert.equal(ctx.validatePayload({...payload,slot:'2026-11-08T10:00:00-08:00'},fixedNow).error,'invalid_slot');
assert.equal(ctx.validatePayload({...payload,slot:'2026-11-08T10:30:00+03:00'},fixedNow).error,'invalid_slot');
assert.equal(ctx.validatePayload({...payload,name:'a'.repeat(61)},fixedNow).error,'invalid_name');
assert.equal(ctx.validatePayload({...payload,email:'a'.repeat(201)},fixedNow).error,'too_long');
console.log('PASS: Moscow date boundary, 14-day limit, past slot, timezone, non-hour slot, name/email lengths.');
