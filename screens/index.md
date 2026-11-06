# Индекс реальных доказательств

Перечень существующих файлов на 06.11.2026. Настройки GA4 не равны полученным событиям: DebugView пока 0 received, диагностика PENDING. Контрольная тестовая заявка с Pages в Sheets подтверждена; GA4 received по-прежнему не подтверждён. Скриншоты сайта и настроек не заменяют эти доказательства.

| Файл | Значение |
|---|---|
| [ga4/custom-definitions.png](ga4/custom-definitions.png) | Семь custom definitions GA4. |
| [ga4/debugview-pending.png](ga4/debugview-pending.png) | Реальный DebugView: 0 received, получение событий не подтверждено. |
| [ga4/enhanced-measurement.png](ga4/enhanced-measurement.png) | Настройки Enhanced measurement, включая Forms. |
| [ga4/key-events.png](ga4/key-events.png) | Настройки key events; ограничение purchase описано в docs/events.md. |
| [ga4/stream.png](ga4/stream.png) | Настройки веб-потока GA4 и Measurement ID. |
| [lighthouse/mobile.png](lighthouse/mobile.png) | Реальный mobile Lighthouse: Performance 93, Accessibility 100, SEO 100, Best Practices 100. |
| [sheets/deployed.png](sheets/deployed.png) | Опубликованный Apps Script Web app. |
| [sheets/deployment-ready.png](sheets/deployment-ready.png) | Подготовка Apps Script deployment; OAuth и работающий /exec этим не подтверждены. |
| [sheets/leads.png](sheets/leads.png) | Две реальные учебные тестовые записи в нативной Sheets. |
| [sheets/live-thanks.png](sheets/live-thanks.png) | Подтверждение заявки с опубликованного Pages. |
| [sheets/statuses.png](sheets/statuses.png) | Финальные учебные статусы no_show и visited; не реальные клиентские визиты. |
| [site/calculator-375.png](site/calculator-375.png) | Калькулятор на 375 px. |
| [site/contacts-1280.png](site/contacts-1280.png) | Страница contacts.html на 1280 px в ходе браузерной QA. |
| [site/contacts-375.png](site/contacts-375.png) | Страница contacts.html на 375 px в ходе браузерной QA. |
| [site/contacts-768.png](site/contacts-768.png) | Страница contacts.html на 768 px в ходе браузерной QA. |
| [site/form-validation-375.png](site/form-validation-375.png) | Ошибки формы на 375 px; это не DebugView. |
| [site/index-1280.png](site/index-1280.png) | Страница index.html на 1280 px в ходе браузерной QA. |
| [site/index-375.png](site/index-375.png) | Страница index.html на 375 px в ходе браузерной QA. |
| [site/index-768.png](site/index-768.png) | Страница index.html на 768 px в ходе браузерной QA. |
| [site/live-calculator.png](site/live-calculator.png) | Калькулятор опубликованного сайта. |
| [site/live-contacts-1280.png](site/live-contacts-1280.png) | Страница contacts.html на 1280 px опубликованного сайта. |
| [site/live-contacts-375.png](site/live-contacts-375.png) | Страница contacts.html на 375 px опубликованного сайта. |
| [site/live-contacts-768.png](site/live-contacts-768.png) | Страница contacts.html на 768 px опубликованного сайта. |
| [site/live-index-1280.png](site/live-index-1280.png) | Страница index.html на 1280 px опубликованного сайта. |
| [site/live-index-375.png](site/live-index-375.png) | Страница index.html на 375 px опубликованного сайта. |
| [site/live-index-768.png](site/live-index-768.png) | Страница index.html на 768 px опубликованного сайта. |
| [utm/U-05-redirect.png](utm/U-05-redirect.png) | Конечный URL редиректа U-05 с сохранёнными пятью UTM. |
| [utm/U-06-redirect.png](utm/U-06-redirect.png) | Конечный URL редиректа U-06 с сохранёнными пятью UTM. |
| [utm/U-07-redirect.png](utm/U-07-redirect.png) | Конечный URL редиректа U-07 с сохранёнными пятью UTM. |
| [utm/U-08-redirect.png](utm/U-08-redirect.png) | Конечный URL редиректа U-08 с сохранёнными пятью UTM. |
| [utm/shortener-created.png](utm/shortener-created.png) | Создание реальных коротких ссылок. |

## Машиночитаемые протоколы

| Файл | Значение |
|---|---|
| [site/responsive.json](site/responsive.json) | Браузерные замеры 9 страниц ×3 ширины; не Lighthouse. |
| [site/live-responsive.json](site/live-responsive.json) | Браузерные замеры опубликованного сайта; не Lighthouse. |
| [utm/redirects.json](utm/redirects.json) | 4 реальные короткие ссылки и конечные URL, включая clckid. |
| [lighthouse/api-error.json](lighthouse/api-error.json) | Ранняя API ошибка 429; позже получен успешный реальный mobile отчёт. |
| [lighthouse/summary.json](lighthouse/summary.json) | Итог реального mobile PSI: 93/100/100/100 и URL отчёта. |
| [sheets/duplicate-response.json](sheets/duplicate-response.json) | Реальный повторный POST вернул duplicate/request_id; число тестовых строк осталось 2. |
| [sheets/status-transitions.json](sheets/status-transitions.json) | Фактические учебные переходы контрольной записи до visited и второй записи в no_show. |
| [sheets/lead-evidence.tsv](sheets/lead-evidence.tsv) | Фактические две учебные строки с REQ-ID и UTM; timestamp в Москве. |
| [sheets/statuses.tsv](sheets/statuses.tsv) | Выгруженные проверенные финальные тестовые статусы по источникам. |

## Отсутствующие доказательства

Нет подтверждённых снимков принятых событий с раскрытыми параметрами DebugView. Контрольная строка Sheets и повтор request_id через /exec уже проверены, см. доказательства выше. Нет реальных публикаций/DM ManyChat, GA4 Reports/Explore и DataLens. Новые доказательства добавляются только после их фактического получения.
