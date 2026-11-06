/* One analytics entry point. Personal data are never accepted as event parameters. */
(() => {
  const allowed = new Set('button_name page_section service_name rim_size car_type total_price storage_type rim_group slot_date slot_time weekday tread_mm tread_result promo_code contact_type messenger network field_name error_type map_service question_id lead_rim_size lead_car_type lead_source'.split(' '));
  const events = new Set('generate_lead cta_click service_view tire_calc storage_select slot_select tread_check promo_copy contact_click messenger_click social_click form_error map_open faq_open'.split(' '));
  const config = window.K21_CONFIG || {};
  // Capture campaign on every landing page, before navigation to the form.
  const incoming = new URLSearchParams(location.search);
  let debug=false; try{if(incoming.has('debug_mode'))sessionStorage.setItem('k21_debug',incoming.get('debug_mode')==='1'?'1':'0');debug=sessionStorage.getItem('k21_debug')==='1';}catch{}
  const defaults={utm_source:'direct',utm_medium:'none',utm_campaign:'not_set',utm_content:'not_set'};
  if(Object.keys(defaults).some(key=>incoming.has(key))) {
    const utm={}; for(const [key,fallback] of Object.entries(defaults)) {const v=incoming.get(key)||fallback;utm[key]=/^[a-z0-9_]{1,100}$/.test(v)?v:fallback;}
    try{sessionStorage.setItem('k21_utm',JSON.stringify(utm));}catch{}
  }
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag=gtag;
  const enabled = /^G-[A-Z0-9]+$/.test(config.ga4Id || '');
  if (enabled) {
    const tag = document.createElement('script'); tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.ga4Id);
    const external=document.querySelector('script[data-ga4]')||tag;
    external.dataset.debug=String(debug); external.addEventListener('load',()=>external.dataset.status='loaded'); external.addEventListener('error',()=>external.dataset.status='failed');
    if(external===tag) document.head.append(tag); gtag('js', new Date());
    // Strip all arbitrary URL parameters to prevent accidental PII in page_location.
    const safe = new URL(location.href); const params = new URLSearchParams();
    for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
      const value=safe.searchParams.get(key); if(value && /^[a-z0-9_]{1,100}$/.test(value)) params.set(key,value);
    }
    safe.search=params.toString(); safe.hash='';
    let referrer=''; try{const r=new URL(document.referrer);r.search='';r.hash='';referrer=r.href;}catch{}
    const tagConfig={page_location:safe.href, page_referrer:referrer};
    if(debug) tagConfig.debug_mode=true;
    gtag('config', config.ga4Id, tagConfig);
  }
  window.K21 = {track(name, values = {}) {
    if (!events.has(name)) return;
    const clean = {};
    for(const [key,value] of Object.entries(values)) if(allowed.has(key)) clean[key] = typeof value === 'number' ? value : String(value).slice(0,100);
    if(enabled) gtag('event',name,clean);
    document.dispatchEvent(new CustomEvent('k21:analytics',{detail:{name,params:clean,sent:enabled}}));
  }};
  document.addEventListener('click', event => {
    const node=event.target.closest('[data-event]'); if(!node) return;
    const params={}; for(const [key,value] of Object.entries(node.dataset)) if(key!=='event') params[key.replace(/[A-Z]/g,c=>'_'+c.toLowerCase())]=value;
    window.K21.track(node.dataset.event,params);
  });
  document.addEventListener('toggle',event=>{if(event.target.matches('details[data-question-id]') && event.target.open) window.K21.track('faq_open',{question_id:event.target.dataset.questionId});},true);
})();
