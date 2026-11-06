# События GA4

Статус live-проверки: **PENDING**. Учебный ресурс создан: property `563008174`, stream `16289622996`, Measurement ID `G-YEMK5T27NW`. DebugView пока показывает **0 received**: получение событий ещё не подтверждено, идёт диагностика. Таблица задаёт контракт ТЗ, а не утверждает получение событий в GA4. Строки проверены по текущим файлам JavaScript 06.11.2026; после правок сверить их повторно. Все ручные вызовы `gtag('event', …)` должны находиться только в `js/analytics.js`; код формы и калькулятора вызывает общий интерфейс `K21.track`.

| Событие | Тип | Где / условие | Параметры, пример | Доказательство |
|---|---|---|---|---|
| page_view | авто | Все страницы; js/analytics.js:31 — gtag config; автоматическая обработка Google tag | `page_location=https://…/tires.html; page_title=Шиномонтаж` | screens/ga4/page_view.png — ожидает |
| scroll | авто | 90% страницы; js/analytics.js:19–31 — подключение Google tag; Enhanced measurement в ресурсе | `percent_scrolled=90` | screens/ga4/scroll.png — ожидает |
| click | авто | Внешняя ссылка; js/analytics.js:19–31 — подключение Google tag; Enhanced measurement, внешняя ссылка contacts.html:1 | `link_url=https://…; outbound=true` | screens/ga4/click.png — ожидает |
| file_download | авто | PDF договора storage.html; js/analytics.js:19–31 — Enhanced measurement; ссылка PDF storage.html:1 | `file_name=storage-contract.pdf; file_extension=pdf` | screens/ga4/file_download.png — ожидает |
| form_start | авто | Первое взаимодействие с формой; js/analytics.js:19–31 — Enhanced measurement Forms; форма js/form.js:8 | `form_id=booking-form` | screens/ga4/form_start.png — ожидает |
| form_submit | авто | Отправка формы; js/analytics.js:19–31 — Enhanced measurement Forms; submit js/form.js:51 | `form_id=booking-form` | screens/ga4/form_submit.png — ожидает |
| generate_lead | ключевое | Только после ответа ok:true; js/form.js:86; общий транспорт js/analytics.js:37 | `lead_rim_size=r16_17; lead_car_type=crossover; lead_source=instagram` | screens/ga4/generate_lead.png — ожидает |
| cta_click | своё | Кнопки записи; index.html:1, tires.html:1, services.html:1, winter-tips.html:1; делегирование js/analytics.js:40–43 | `button_name=hero_booking; page_section=hero` | screens/ga4/cta_click.png — ожидает |
| service_view | своё | Клик карточки услуги; index.html:1, services.html:1; делегирование js/analytics.js:40–43 | `service_name=tire_fitting` | screens/ga4/service_view.png — ожидает |
| tire_calc | своё | Расчёт цены; js/main.js:7 (вызов), js/main.js:9 (submit); транспорт js/analytics.js:37 | `rim_size=r16_17; car_type=crossover; total_price=2420` | screens/ga4/tire_calc.png — ожидает |
| storage_select | своё | Выбрать хранение; storage.html:1, data-event; делегирование js/analytics.js:40–43 | `storage_type=season; rim_group=r13_17` | screens/ga4/storage_select.png — ожидает |
| slot_select | своё | Выбор даты/времени; js/booking.js:38; общий транспорт js/analytics.js:37 | `slot_date=2026-11-07; slot_time=09:00; weekday=saturday` | screens/ga4/slot_select.png — ожидает |
| tread_check | своё | Проверка протектора; js/main.js:12; общий транспорт js/analytics.js:37 | `tread_mm=3; tread_result=replace` | screens/ga4/tread_check.png — ожидает |
| promo_copy | своё | Успешное копирование; js/main.js:13, только после Clipboard writeText; транспорт js/analytics.js:37 | `promo_code=WINTER10` | screens/ga4/promo_copy.png — ожидает |
| contact_click | ключевое | Телефон или email; телефон в шапках *.html:1 и contacts.html:1; делегирование js/analytics.js:40–43 | `contact_type=phone` | screens/ga4/contact_click.png — ожидает |
| messenger_click | ключевое | Telegram/WhatsApp; событие разрешено js/analytics.js:4, транспорт :37; живые кнопки не подключены, учебные контакты отсутствуют | `messenger=telegram` | screens/ga4/messenger_click.png — ожидает |
| social_click | своё | Подвал/thanks; событие разрешено js/analytics.js:4, транспорт :37; живые ссылки footer/thanks не подключены, учебные соцсети отсутствуют | `network=vk; page_section=footer` | screens/ga4/social_click.png — ожидает |
| form_error | своё | Ошибка формы/сервера; js/form.js:47,69,80,90; общий транспорт js/analytics.js:37 | `field_name=phone; error_type=format` | screens/ga4/form_error.png — ожидает |
| map_open | дополнительное | Схема проезда; contacts.html:1, data-map-service=yandex; делегирование js/analytics.js:40–43 | `map_service=yandex` | screens/ga4/map_open.png — ожидает |
| faq_open | дополнительное | Раскрытие FAQ; storage.html:1, details; js/analytics.js:45 (toggle) | `question_id=storage_1` | screens/ga4/faq_open.png — ожидает |

## Настройки ресурса

Название «КОЛЕСО 21 — сайт», часовой пояс Москва GMT+03:00, валюта RUB. Веб-поток использует окончательный GitHub Pages URL. Enhanced measurement, включая Forms, включено; экран `screens/ga4/enhanced-measurement.png`. Поток: `screens/ga4/stream.png`. Не дублировать шесть автоматических событий ручными вызовами: это исказит данные.

Созданы 7 пользовательских параметров уровня Event (`screens/ga4/custom-definitions.png`): `button_name`, `page_section`, `rim_size`, `car_type`, `weekday`, `tread_result`, `messenger`. Назначение: кнопка, блок, размер, автомобиль, день недели, результат проверки, канал связи. Созданы key events `generate_lead`, `contact_click`, `messenger_click`; стандартные `close_convert_lead` и `qualify_lead` сняты с отметки. Встроенный `purchase` остался disabled: интерфейс не разрешает снять отметку. Это отклонение от требования «других ключевых событий нет», а не четвертое реализованное событие проекта. Экран настроек: `screens/ga4/key-events.png`.

Имена событий/параметров snake_case ≤40 знаков, текстовые значения ≤100. Имя, телефон, email и данные заявки не передавать в GA4 и не помещать в URL. Для page_location не должны сохраняться произвольные query-параметры с персональными данными. request_id не нужен аналитике.

## Протокол DebugView

Для временной отладки открыть страницу с `?debug_mode=1`; режим хранится в sessionStorage (`js/analytics.js:8`) и передаётся в config (:31). Чтобы выключить — `?debug_mode=0` либо очистить sessionStorage. В обычной новой сессии отладка выключена. Затем открыть чистую сессию и поочерёдно выполнить все 20 действий. Для каждого раскрыть параметры и снять реальный экран с названием события, временем и параметрами. Тест generate_lead требует реального `ok:true` Google Sheets, сетевой мок этим доказательством не является. form_submit может возникать и при неуспешной бизнес-обработке: конверсия только generate_lead. После проверки выключить debug_mode и проверить production config. Не выдавать локальную очередь событий за DebugView.

## Фактические ограничения реализации

`messenger_click` и `social_click` поддержаны общим обработчиком, но соответствующие живые кнопки не созданы без подтверждённых учебных контактов. Эти два пользовательских сценария ещё не выполнены. GA4 ID установлен в `js/config.js:2`, Forms и остальные параметры Enhanced measurement настроены; автособытия 1–6 не имеют собственных ручных вызовов в JS. Эти настройки пока не доказывают фактического приёма событий. Есть реальные снимки настроек, но ни одного подтверждённого снимка полученного события с раскрытыми параметрами нет. Статическая проверка строки кода не означает live-доставку события.

## Технический источник

[Google Analytics: Set up events](https://developers.google.com/analytics/devguides/collection/ga4/events) — официальный контракт gtag event и проверка Realtime/DebugView (проверено 06.11.2026).

## Реальная заявка и граница доказательства

Apps Script уже авторизован и опубликован. Контрольная заявка с Pages `REQ-f40316cd-8792-4fbf-91c3-d6c5a5b988d0` записана в Sheets (строка 3) с instagram/social/winter_tires_2026/reel_tread_01. Подтверждённая запись разрешает вызов generate_lead в клиентском коде, но **не доказывает получение события GA4**: DebugView пока 0 received. Реальный экран этой диагностики — `screens/ga4/debugview-pending.png`. Индивидуальные скриншоты received событий по таблице выше всё ещё отсутствуют.
