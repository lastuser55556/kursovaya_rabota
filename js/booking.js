(() => {
  'use strict';
  const calendar = document.querySelector('#booking-calendar');
  if (!calendar) return;
  const moscowParts = date => new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
  const dateKey = date => { const p = Object.fromEntries(moscowParts(date).map(x => [x.type,x.value])); return `${p.year}-${p.month}-${p.day}`; };
  const now = new Date();
  const today = dateKey(now);
  // Учебная занятость из ТЗ: один полностью занятый слот и частично занятые.
  const occupancy = [{date:today,time:'10:00',occupied:4},{date:today,time:'11:00',occupied:2},{date:today,time:'15:00',occupied:1}];
  window.K21_OCCUPANCY = occupancy;
  calendar.innerHTML = '<label for="booking-date">Дата визита</label><select id="booking-date" aria-describedby="calendar-note"></select><p id="calendar-note">Время московское. Слот длится 60 минут, работают 4 поста. Занятость учебная; запись подтверждает администратор.</p><div id="booking-slots" class="slots" role="group" aria-label="Время визита"></div><p id="slot-summary" aria-live="polite">Выберите время визита</p>';
  const select = calendar.querySelector('select');
  for (let i=0;i<14;i++) {
    const day = new Date(now.getTime()+i*86400000);
    const option = new Option(new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',weekday:'short',day:'numeric',month:'long'}).format(day),dateKey(day));
    select.add(option);
  }
  function renderSlots() {
    const slots = calendar.querySelector('#booking-slots');
    slots.replaceChildren();
    document.dispatchEvent(new CustomEvent('k21:slot',{detail:{slot:''}}));
    calendar.querySelector('#slot-summary').textContent = 'Выберите время визита';
    for (let h=8;h<=21;h++) {
      const time = `${String(h).padStart(2,'0')}:00`;
      const value = `${select.value}T${time}:00+03:00`;
      const used = occupancy.find(item => item.date===select.value && item.time===time)?.occupied || 0;
      const button = document.createElement('button');
      button.type='button'; button.className='slot'; button.textContent=time;
      button.disabled=used>=4 || new Date(value)<=new Date();
      button.setAttribute('aria-pressed','false');
      button.setAttribute('aria-label',`${time}, ${used>=4?'все посты заняты':`свободно постов: ${4-used}`}`);
      button.addEventListener('click',() => {
        slots.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed','false'));
        button.setAttribute('aria-pressed','true');
        calendar.querySelector('#slot-summary').textContent=`Выбрано: ${select.options[select.selectedIndex].text}, ${time} (Москва)`;
        document.dispatchEvent(new CustomEvent('k21:slot',{detail:{slot:value}}));
        window.K21?.track('slot_select',{slot_date:select.value,slot_time:time,weekday:['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date(`${select.value}T12:00:00+03:00`).getUTCDay()]});
      });
      slots.append(button);
    }
  }
  select.addEventListener('change',renderSlots);
  renderSlots();
})();
