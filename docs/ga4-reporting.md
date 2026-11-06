# GA4 Reports и Explore: воспроизводимый план

Статус отчётности **PENDING**: учебный GA4 создан и настроен — property 563008174, stream 16289622996, Measurement G-YEMK5T27NW, Москва/RUB; Forms Enhanced measurement и семь Custom definitions включены, три проектных key events созданы. DebugView пока 0 received, диагностика доставки продолжается. Планы ниже относятся к Reports/Explore по §8 ТЗ и не выданы за уже созданные отчёты с данными. Фактические настройки перечислены в events.md; встроенный disabled purchase остаётся отдельным отклонением. Период Custom: первая фактическая проверка — день сдачи. После реальных проверок ждать 24–48 часов обработки; непоступившие данные отмечать PENDING. Во всех снимках показывать период и параметры. Не публиковать данные посетителей.

## Reports

| Имя снимка в screens/reports | Настройка |
|---|---|
| snapshot.png | Reports snapshot, Custom и Compare → Preceding period |
| user-acquisition.png | First user source / medium |
| traffic-campaign.png | Traffic acquisition: Session source / medium + Session campaign |
| traffic-content.png | Traffic acquisition: Session source / medium + Session manual ad content |
| landing-source.png | Landing page + Session source |
| pages.png | Pages and screens: Views, Active users, Average engagement time |
| events.png | Event count и Total users: generate_lead, cta_click, service_view, tire_calc, storage_select |
| key-events.png | Key events по Session source / medium |
| tech.png | Tech details: Device category |
| comparison.png | Traffic acquisition, сравнения Session source exactly matches instagram и (direct) |
| library.png | Опубликованная Library collection «КОЛЕСО 21», отчёт «Кампания winter_tires_2026» |
| custom-insight.png | Ежедневный Custom insight, Session source=instagram, Sessions уменьшились >50%, email исполнителя |

Для собственного отчёта: dimensions Session source / medium, Session campaign, Session manual ad content; metrics Sessions, Engagement rate, Key events. Traffic acquisition выгрузить штатным Share → Download file в docs/reports/traffic-acquisition.csv, не переименовывать шаблон схемы в реальную выгрузку.

## Explore

Создать session segments Instagram Sessions (Session source=instagram) и Direct Sessions (Session source=(direct)). Имена исследований начинаются «КОЛЕСО 21 ·». На каждом снимке должен быть виден Data quality indicator; при порогах/семплировании указать их в записке.

1. **Свободная форма**. Rows: Session source / medium, Session campaign, Session manual ad content. Values: Sessions, Engaged sessions, Key events. Filter: winter_tires_2026. На второй вкладке применить оба сегмента рядом. Экспортировать реальную таблицу в docs/reports/free-form.csv.
2. **Воронка**. page_view → service_view → cta_click → form_start → generate_lead. Вкладка Open, копия Closed, Breakdown Session source, оба сегмента. Третья вкладка Device category. Снять funnel-open.png, funnel-closed.png, funnel-device.png.
3. **Воронка со временем**. Копия, form_start должен следовать за cta_click в течение 10 минут. Снимок funnel-time.png. Ограничение относится к переходу этих шагов.
4. **Путь**. Starting point winter-tips.html, 3 следующих шага по Page title, раскрыть один узел. Снимок path.png.
5. **Обратный путь**. Ending point generate_lead, 3 предыдущих шага по Event name. Снимок reverse-path.png.

Открытая воронка допускает вход на промежуточный шаг. Закрытая требует начать с первого. Показатели не обязаны различаться на маленькой выборке; если совпали, не создавать фиктивную разницу.

## Атрибуция

Записать фактически выбранные модель и окно из Admin → Attribution settings. Не подставлять предполагаемый default. Раздел Advertising/пути Google Ads не используется по учебному ТЗ. Путь до заявки анализируется через reverse path Explore. GA4 и таблица могут расходиться из-за согласия, блокировщиков, потери связи, отличий scope и даты/часового пояса, но конкретную причину устанавливать по данным.

## Граница готовности

Наличие тега GA4 подтверждено на всех 27 проверках опубликованных страниц (`screens/site/live-responsive.json`), но received события ещё не подтверждены. До появления валидной доставки и обработки данных нельзя заполнять free-form.csv, проценты потерь, показатели каналов или DataLens числами. Apps Script опубликован, реальная заявка с Pages получена в Sheets; получение соответствующего generate_lead в GA4 пока не подтверждено. Нативная Sheets уже создана; пустые листы ga4_traffic/ga4_leads не являются экспортами GA4.
