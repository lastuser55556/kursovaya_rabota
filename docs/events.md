# События GA4

Статус live-проверки: **BLOCKED**, ресурс/Measurement ID ещё не предоставлен. Таблица задаёт контракт ТЗ, а не утверждает получение событий в GA4. Точные строки реализации дополняются после окончания разработки. Все ручные вызовы `gtag('event', …)` должны находиться только в `js/analytics.js`; код формы и калькулятора вызывает общий интерфейс `K21.track`.

| Событие | Тип | Где / условие | Параметры, пример | Доказательство |
|---|---|---|---|---|
| page_view | авто | Все страницы; реализация: js/analytics.js, строка ожидает финальной проверки | `page_location=https://…/tires.html; page_title=Шиномонтаж` | screens/ga4/page_view.png — ожидает |
| scroll | авто | 90% страницы; реализация: js/analytics.js, строка ожидает финальной проверки | `percent_scrolled=90` | screens/ga4/scroll.png — ожидает |
| click | авто | Внешняя ссылка; реализация: js/analytics.js, строка ожидает финальной проверки | `link_url=https://…; outbound=true` | screens/ga4/click.png — ожидает |
| file_download | авто | PDF договора storage.html; реализация: js/analytics.js, строка ожидает финальной проверки | `file_name=storage-contract.pdf; file_extension=pdf` | screens/ga4/file_download.png — ожидает |
| form_start | авто | Первое взаимодействие с формой; реализация: js/analytics.js, строка ожидает финальной проверки | `form_id=booking-form` | screens/ga4/form_start.png — ожидает |
| form_submit | авто | Отправка формы; реализация: js/analytics.js, строка ожидает финальной проверки | `form_id=booking-form` | screens/ga4/form_submit.png — ожидает |
| generate_lead | ключевое | Только после ответа ok:true; реализация: js/analytics.js, строка ожидает финальной проверки | `lead_rim_size=r16_17; lead_car_type=crossover; lead_source=instagram` | screens/ga4/generate_lead.png — ожидает |
| cta_click | своё | Кнопки записи; реализация: js/analytics.js, строка ожидает финальной проверки | `button_name=hero_booking; page_section=hero` | screens/ga4/cta_click.png — ожидает |
| service_view | своё | Клик карточки услуги; реализация: js/analytics.js, строка ожидает финальной проверки | `service_name=tires` | screens/ga4/service_view.png — ожидает |
| tire_calc | своё | Расчёт цены; реализация: js/analytics.js, строка ожидает финальной проверки | `rim_size=r16_17; car_type=crossover; total_price=2420` | screens/ga4/tire_calc.png — ожидает |
| storage_select | своё | Выбрать хранение; реализация: js/analytics.js, строка ожидает финальной проверки | `storage_type=season; rim_group=r13_17` | screens/ga4/storage_select.png — ожидает |
| slot_select | своё | Выбор даты/времени; реализация: js/analytics.js, строка ожидает финальной проверки | `slot_date=2026-11-07; slot_time=09:00; weekday=saturday` | screens/ga4/slot_select.png — ожидает |
| tread_check | своё | Проверка протектора; реализация: js/analytics.js, строка ожидает финальной проверки | `tread_mm=3; tread_result=replace` | screens/ga4/tread_check.png — ожидает |
| promo_copy | своё | Успешное копирование; реализация: js/analytics.js, строка ожидает финальной проверки | `promo_code=WINTER10` | screens/ga4/promo_copy.png — ожидает |
| contact_click | ключевое | Телефон или email; реализация: js/analytics.js, строка ожидает финальной проверки | `contact_type=phone` | screens/ga4/contact_click.png — ожидает |
| messenger_click | ключевое | Telegram/WhatsApp; реализация: js/analytics.js, строка ожидает финальной проверки | `messenger=telegram` | screens/ga4/messenger_click.png — ожидает |
| social_click | своё | Подвал/thanks; реализация: js/analytics.js, строка ожидает финальной проверки | `network=vk; page_section=footer` | screens/ga4/social_click.png — ожидает |
| form_error | своё | Ошибка формы/сервера; реализация: js/analytics.js, строка ожидает финальной проверки | `field_name=phone; error_type=format` | screens/ga4/form_error.png — ожидает |
| map_open | дополнительное | Схема проезда; реализация: js/analytics.js, строка ожидает финальной проверки | `map_service=yandex` | screens/ga4/map_open.png — ожидает |
| faq_open | дополнительное | Раскрытие FAQ; реализация: js/analytics.js, строка ожидает финальной проверки | `question_id=storage_1` | screens/ga4/faq_open.png — ожидает |

## Настройки ресурса

Название «КОЛЕСО 21 — сайт», часовой пояс Москва GMT+03:00, валюта RUB. Веб-поток использует окончательный GitHub Pages URL. Включить Enhanced measurement, включая Forms. Не дублировать шесть автоматических событий ручными вызовами: это исказит данные.

Создать ровно 7 пользовательских параметров уровня Event: `button_name`, `page_section`, `rim_size`, `car_type`, `weekday`, `tread_result`, `messenger`. Назначение: кнопка, блок, размер, автомобиль, день недели, результат проверки, канал связи. В key events оставить только `generate_lead`, `contact_click`, `messenger_click`.

Имена событий/параметров snake_case ≤40 знаков, текстовые значения ≤100. Имя, телефон, email и данные заявки не передавать в GA4 и не помещать в URL. Для page_location не должны сохраняться произвольные query-параметры с персональными данными. request_id не нужен аналитике.

## Протокол DebugView

Включить отладку временно, открыть чистую сессию и поочерёдно выполнить все 20 действий. Для каждого раскрыть параметры и снять реальный экран с названием события, временем и параметрами. Тест generate_lead требует реального `ok:true` Google Sheets, сетевой мок этим доказательством не является. form_submit может возникать и при неуспешной бизнес-обработке: конверсия только generate_lead. После проверки выключить debug_mode и проверить production config. Не выдавать локальную очередь событий за DebugView.
