(() => {
  'use strict';
  const container = document.querySelector('#booking-form-container');
  if (!container) return;
  const track = (name,params) => window.K21?.track(name,params);
  const read = key => { try { return JSON.parse(sessionStorage.getItem(key)||'null'); } catch (_) { return null; } };
  const calc = read('k21_calc') || {};
  container.innerHTML = `<form id="booking-form" novalidate>
    <div class="form-grid">
    <label>Имя<input name="name" autocomplete="given-name" minlength="2" maxlength="60" required aria-describedby="error-name"><span id="error-name" class="field-error"></span></label>
    <label>Телефон<input name="phone" type="tel" autocomplete="tel" placeholder="+79001212121" required aria-describedby="error-phone"><span id="error-phone" class="field-error"></span></label>
    <label>E-mail (необязательно)<input name="email" type="email" autocomplete="email" maxlength="200" aria-describedby="error-email"><span id="error-email" class="field-error"></span></label>
    <label>Тип автомобиля<select name="car_type" aria-describedby="error-car_type"><option value="car">Легковой</option><option value="crossover">Кроссовер (+10%)</option><option value="suv">Внедорожник / микроавтобус (+20%)</option></select><span id="error-car_type" class="field-error"></span></label>
    <label>Диаметр колёс<select name="rim_size" aria-describedby="error-rim_size"><option value="r13_15">R13–R15</option><option value="r16_17">R16–R17</option><option value="r18_19">R18–R19</option><option value="r20_plus">R20 и больше</option></select><span id="error-rim_size" class="field-error"></span></label>
    </div>
    <p id="booking-price" aria-live="polite"></p>
    <input type="hidden" name="slot"><span id="error-slot" class="field-error" aria-live="polite"></span>
    <input type="hidden" name="request_id">
    <input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_content">
    <label class="consent"><input type="checkbox" name="consent" required aria-describedby="error-consent"><span>Согласен на обработку данных по <a href="privacy.html">политике конфиденциальности</a>. Учебный проект: используйте тестовые данные.</span></label><span id="error-consent" class="field-error"></span>
    <button type="submit" class="button">Отправить заявку</button><p id="form-status" role="status" aria-live="polite"></p>
    </form>`;
  const form=container.querySelector('form');
  const field = name => form.elements.namedItem(name);
  if (['car','crossover','suv'].includes(calc.car_type)) field('car_type').value=calc.car_type;
  if (['r13_15','r16_17','r18_19','r20_plus'].includes(calc.rim_size)) field('rim_size').value=calc.rim_size;
  const newId = () => 'REQ-'+crypto.randomUUID();
  field('request_id').value=newId();
  const defaults={utm_source:'direct',utm_medium:'none',utm_campaign:'not_set',utm_content:'not_set'};
  const query=new URLSearchParams(location.search);
  let utm=read('k21_utm')||{};
  if (Object.keys(defaults).some(key=>query.has(key))) {
    utm={};
    for (const [key,fallback] of Object.entries(defaults)) { const value=query.get(key)||fallback; utm[key]=/^[a-z0-9_]{1,100}$/.test(value)?value:fallback; }
    try { sessionStorage.setItem('k21_utm',JSON.stringify(utm)); } catch (_) {}
  }
  for (const [key,fallback] of Object.entries(defaults)) field(key).value=utm[key]||fallback;
  function price() {
    const base={r13_15:1600,r16_17:2200,r18_19:2900,r20_plus:3600}[field('rim_size').value];
    const tire=Math.round(base*{car:1,crossover:1.1,suv:1.2}[field('car_type').value]);
    const storage=calc.storage?(['r13_15','r16_17'].includes(field('rim_size').value)?3000:3800):0;
    container.querySelector('#booking-price').textContent=`Шиномонтаж комплекта: ${tire.toLocaleString('ru-RU')} ₽${storage?`. Хранение: ${storage.toLocaleString('ru-RU')} ₽. Итого: ${(tire+storage).toLocaleString('ru-RU')} ₽`:''}.`;
  }
  ['rim_size','car_type'].forEach(name=>field(name).addEventListener('change',price)); price();
  document.addEventListener('k21:slot',event=>{field('slot').value=event.detail.slot; clearError('slot');});
  function clearError(name) { const el=field(name); el?.removeAttribute('aria-invalid'); const target=document.getElementById('error-'+name); if(target)target.textContent=''; }
  function error(name,message,type='invalid') { const el=field(name); el?.setAttribute('aria-invalid','true'); const target=document.getElementById('error-'+name); if(target)target.textContent=message; track('form_error',{field_name:name,error_type:type}); }
  form.addEventListener('input',event=>clearError(event.target.name));
  let sending=false;
  let completed=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault(); if(sending || completed)return;
    form.querySelectorAll('.field-error').forEach(el=>el.textContent='');
    form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
    const data=Object.fromEntries(new FormData(form));
    data.name=data.name.trim(); data.phone=data.phone.replace(/[\s()\-]/g,''); data.email=data.email.trim(); data.consent=field('consent').checked;
    let invalid=false;
    const fail=(name,message,type)=>{error(name,message,type);invalid=true;};
    if(data.name.length<2||data.name.length>60)fail('name','Введите имя: от 2 до 60 символов.',data.name?'length':'required');
    if(!/^\+7\d{10}$/.test(data.phone))fail('phone','Введите +7 и 10 цифр телефона.',data.phone?'format':'required');
    if(data.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))fail('email','Проверьте адрес e-mail.','format');
    if(!data.slot||new Date(data.slot)<=new Date())fail('slot','Выберите будущее время в календаре.','required');
    if(!data.consent)fail('consent','Для отправки необходимо ваше согласие.','required');
    if(invalid){form.querySelector('[aria-invalid="true"]:not([type="hidden"])')?.focus();return;}
    const status=container.querySelector('#form-status');
    const endpoint=window.K21_CONFIG?.appsScriptUrl;
    if(!endpoint||!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(endpoint)) {
      status.textContent='Онлайн-приём заявок ещё не подключён. Заявка не отправлена. Для учебной проверки подключите Apps Script.';
      track('form_error',{field_name:'form',error_type:'server'}); return;
    }
    sending=true; const button=form.querySelector('[type="submit"]');button.disabled=true;status.textContent='Отправляем заявку…';
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25000);
    try {
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(data),redirect:'follow',signal:controller.signal});
      if(!response.ok)throw new Error('http');
      const result=await response.json();
      if(result.ok!==true){
        const messages={duplicate:'Заявка с этим номером уже существует. Не отправляйте повторно; обратитесь к администратору.',slot_full:'Все посты на это время заняты. Выберите другое время.',invalid_slot:'Выберите будущее время в календаре.',busy:'Сервис занят. Повторите отправку позже.'};
        status.textContent=messages[result.error]||'Заявка не принята. Проверьте данные или повторите позже.';
        track('form_error',{field_name:result.field||'form',error_type:'server'});return;
      }
      const booking={request_id:data.request_id,slot:data.slot};
      completed=true;
      let stored=true;
      try { sessionStorage.setItem('k21_booking',JSON.stringify(booking)); } catch (_) { stored=false; }
      track('generate_lead',{lead_rim_size:data.rim_size,lead_car_type:data.car_type,lead_source:data.utm_source});
      // Небольшая пауза позволяет тегу поставить событие в транспорт до перехода.
      if (stored) setTimeout(()=>location.assign('thanks.html'),350);
      else status.textContent=`Заявка ${data.request_id} принята на ${data.slot}. Сохраните номер: браузер запретил сохранение подтверждения.`;
    } catch (_) { status.textContent='Не удалось получить подтверждение сервера. Проверьте соединение и повторите с тем же номером заявки. При повторной записи сервер защитит от дубля.';track('form_error',{field_name:'form',error_type:'server'}); }
    finally{clearTimeout(timer);sending=false;button.disabled=completed;}
  });
})();
