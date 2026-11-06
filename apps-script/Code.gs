/* Учебный приёмник. SPREADSHEET_ID задайте в Script properties, не в браузере. */
const HEADERS = ['request_id','created_at','name','phone','email','car_type','rim_size','slot','utm_source','utm_medium','utm_campaign','utm_content','status'];
const STATUSES = ['new','confirmed','reminded','visited','no_show'];
function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function getSheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('not_configured');
  const sheet = SpreadsheetApp.openById(id).getSheetByName('leads');
  if (!sheet) throw new Error('not_configured');
  return sheet;
}
function validatePayload(input, now) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {error:'invalid_payload',field:'form'};
  const d = {};
  for (const key of HEADERS.filter(k => k !== 'created_at' && k !== 'status')) {
    if (input[key] !== undefined && typeof input[key] !== 'string') return {error:'invalid_type',field:key};
    d[key] = String(input[key] || '').trim();
    if (d[key].length > 200) return {error:'too_long',field:key};
  }
  if (!/^REQ-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(d.request_id)) return {error:'invalid_request_id',field:'request_id'};
  if (d.name.length < 2 || d.name.length > 60) return {error:'invalid_name',field:'name'};
  if (!/^\+7\d{10}$/.test(d.phone)) return {error:'invalid_phone',field:'phone'};
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return {error:'invalid_email',field:'email'};
  if (!['car','crossover','suv'].includes(d.car_type)) return {error:'invalid_car_type',field:'car_type'};
  if (!['r13_15','r16_17','r18_19','r20_plus'].includes(d.rim_size)) return {error:'invalid_rim_size',field:'rim_size'};
  // Слот имеет явный часовой пояс Москвы. Никакого толкования в часовом поясе сервера.
  if (!/^\d{4}-\d{2}-\d{2}T(?:0[8-9]|1\d|2[01]):00:00\+03:00$/.test(d.slot)) return {error:'invalid_slot',field:'slot'};
  const slotDate = new Date(d.slot);
  const today = new Date(now);
  const maxDay = new Date(today.getTime() + 14 * 86400000);
  if (!Number.isFinite(slotDate.getTime()) || slotDate <= today || slotDate > maxDay) return {error:'invalid_slot',field:'slot'};
  // Проверяем реальные компоненты даты (31 февраля не должен превратиться в март).
  const normalized = new Date(slotDate.getTime()+3*3600000).toISOString().slice(0,16);
  if (normalized !== d.slot.slice(0,16)) return {error:'invalid_slot',field:'slot'};
  if (input.consent !== true) return {error:'consent_required',field:'consent'};
  const defaults = {utm_source:'direct',utm_medium:'none',utm_campaign:'not_set',utm_content:'not_set'};
  for (const key of Object.keys(defaults)) {
    d[key] = d[key] || defaults[key];
    if (!/^[a-z0-9_]{1,100}$/.test(d[key])) return {error:'invalid_utm',field:key};
  }
  return {data:d};
}
function doPost(e) {
  let lock;
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 8000) return jsonResponse({ok:false,error:'invalid_payload',field:'form'});
    let payload;
    try { payload = JSON.parse(raw); } catch (_) { return jsonResponse({ok:false,error:'invalid_json',field:'form'}); }
    const result = validatePayload(payload, new Date());
    if (result.error) return jsonResponse(Object.assign({ok:false}, result));
    const d = result.data;
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return jsonResponse({ok:false,error:'busy',field:'form'});
    const sheet = getSheet();
    const rows = sheet.getLastRow() > 1 ? sheet.getRange(2,1,sheet.getLastRow()-1,13).getValues() : [];
    if (rows.some(row => String(row[0]) === d.request_id)) return jsonResponse({ok:false,error:'duplicate',field:'request_id'});
    // Четыре поста; отменённые записи не занимают место. Проверка под тем же lock.
    const taken = rows.filter(row => {
      const slot = row[7] instanceof Date ? row[7].getTime() : new Date(row[7]).getTime();
      return slot === new Date(d.slot).getTime() && row[12] !== 'no_show';
    }).length;
    if (taken >= 4) return jsonResponse({ok:false,error:'slot_full',field:'slot'});
    const safeCell = value => /^[=+@\-\t\r]/.test(String(value)) ? "'" + value : value;
    sheet.appendRow([d.request_id,new Date(),safeCell(d.name),safeCell(d.phone),safeCell(d.email),d.car_type,d.rim_size,new Date(d.slot),d.utm_source,d.utm_medium,d.utm_campaign,d.utm_content,'new']);
    SpreadsheetApp.flush();
    return jsonResponse({ok:true,request_id:d.request_id,slot:d.slot});
  } catch (_) {
    // Не возвращаем адреса таблиц, персональные данные или внутренние исключения.
    return jsonResponse({ok:false,error:'server',field:'form'});
  } finally { if (lock && lock.hasLock()) lock.releaseLock(); }
}
function doGet() { return jsonResponse({ok:true,service:'koleso21-bookings',version:1}); }
function setupSheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Задайте SPREADSHEET_ID в Script properties учебного проекта.');
  const book = SpreadsheetApp.openById(id);
  book.setSpreadsheetTimeZone('Europe/Moscow');
  let sheet = book.getSheetByName('leads') || book.insertSheet('leads');
  if (sheet.getLastRow() && sheet.getRange(1,1,1,13).getValues()[0].join(',') !== HEADERS.join(',')) throw new Error('Лист leads содержит другие заголовки; данные не изменены.');
  sheet.getRange(1,1,1,13).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.getRange('A:A').setNumberFormat('@');
  sheet.getRange('C:G').setNumberFormat('@');
  sheet.getRange('I:M').setNumberFormat('@');
  sheet.getRange('B:B').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sheet.getRange('H:H').setNumberFormat('yyyy-mm-dd hh:mm');
  const listRule = list => SpreadsheetApp.newDataValidation().requireValueInList(list,true).setAllowInvalid(false).build();
  sheet.getRange('M2:M').setDataValidation(listRule(STATUSES));
  sheet.getRange('F2:F').setDataValidation(listRule(['car','crossover','suv']));
  sheet.getRange('G2:G').setDataValidation(listRule(['r13_15','r16_17','r18_19','r20_plus']));
  const range = sheet.getRange('A2:M');
  const duplicate = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND($A2<>"",COUNTIF($A$2:$A,$A2)>1)').setBackground('#ffc7ce').setRanges([range]).build();
  const missing = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=AND(COUNTA($A2:$M2)>0,OR($A2="",$B2="",$C2="",$D2="",$F2="",$G2="",$H2="",$I2="",$J2="",$K2="",$L2="",$M2=""))').setBackground('#fff2cc').setRanges([range]).build();
  sheet.setConditionalFormatRules([duplicate,missing]);
  sheet.autoResizeColumns(1,13);
  for (const name of ['utm','ga4_traffic','ga4_leads']) if (!book.getSheetByName(name)) book.insertSheet(name);
}
