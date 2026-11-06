# Учебные подключения: фактическое состояние

Состояние 06.11.2026. Только учебные ресурсы. Пароли, OAuth-токены и секреты в Git и чат не передаются. Наличие созданного ресурса не подтверждает доставку заявки или события.

| Ресурс | Подтверждено | Оставшаяся зависимость |
|---|---|---|
| GitHub Pages | lastuser55556/kursovaya_rabota; [сайт](https://lastuser55556.github.io/kursovaya_rabota/) отвечает HTTP 200; [успешный Actions run 42307399987](https://github.com/lastuser55556/kursovaya_rabota/actions/runs/42307399987) | Публикация выполнена, повторный деплой после новых правок проверять отдельно |
| GA4 | Ресурс 563008174; поток 16289622996; Measurement ID G-YEMK5T27NW; Москва/RUB; Enhanced measurement Forms включено; 7 custom definitions | DebugView пока показывает 0 received; диагностика доставки PENDING, получение событий не подтверждено |
| GA4 key events | generate_lead, contact_click, messenger_click созданы; close_convert_lead и qualify_lead сняты с key events | Встроенный purchase остаётся disabled, интерфейс не разрешает снять отметку; отклонение от «только 3» зафиксировано |
| Google Sheets | [Koleso21 — Bookings](https://docs.google.com/spreadsheets/d/1wplyIpkCAh8myS5_qHFk4SZn8-v5e6nKiOvdXOPn2dA/edit); нативная таблица создана, 4 листа импортированы из проверенного XLSX с явным согласием пользователя на альтернативный процесс | Контрольная запись с Pages подтверждена (строка 3), проверены duplicate и учебные статусы; Viewer заказчику требует реальный email |
| Apps Script | Проект 12i4wdSwuDjEF8a6WO3yP0Fg60H0owIs2hC3wJzTHef3epdXm-0yCnIgj; код сохранён, свойство таблицы задано | OAuth завершён, initializeProject успешна, Web app опубликован; реальная заявка с Pages и duplicate проверены |
| DataLens | Пользователь сообщил, что учебного аккаунта нет; подготовлены спецификация и материалы | Live-настройка не выполняется; требуется создать/подключить учебный аккаунт, если она будет нужна |
| Instagram / ManyChat | Пользователь сообщил об отсутствии аккаунтов; подготовлены две ветки и тексты | Только подготовка материалов; Live и публикации не выполнены |
| Соцсети | Черновики для Instagram/VK/Telegram/YouTube, реестр UTM, 4 короткие ссылки с проверенными редиректами | Учебные страницы/каналы и подтверждение конкретных публикаций отсутствуют; не публиковать автоматически |
| Партнёры | Нужны реальные ники двух студентов | pending_partner_1/2 нельзя публиковать как готовые ники |
| Заказчик | Для Viewer GA4/Sheets/DataLens нужен реальный учебный email преподавателя | admin@koleso21.example в ТЗ вымышленный |

Авторизация выполнена безопасно в учебном аккаунте, приёмник опубликован. Контрольная тестовая заявка с UTM подтверждена в Sheets; получение GA4 события остаётся PENDING. Реальные снимки перечислены в `screens/index.md`.

## Завершённые живые проверки, 06.11.2026

Apps Script авторизован и опубликован, `initializeProject` выполнена успешно. Реальный endpoint: https://script.google.com/macros/s/AKfycbwNocgF2l0I-4CL3fbV2EGgmy2J01z2CQByNiPMGsa7bILGPjk2ZgoHzpODO4Hpr-De/exec . В нативной Sheets две **учебные тестовые** записи, не реальные клиентские обращения:

- Строка 2: `REQ-cc05728f-edfc-4216-886d-70ba434bc74f`, интеграционный запрос с localhost; итоговый учебный статус `no_show`.
- Строка 3: `REQ-f40316cd-8792-4fbf-91c3-d6c5a5b988d0`, «Приёмка ТЗ-21/2026» с опубликованного Pages, UTM `instagram / social / winter_tires_2026 / reel_tread_01`. Проведена `new → confirmed → reminded → visited`.
- Повторный реальный POST ID строки 2 вернул `{"ok":false,"error":"duplicate","field":"request_id"}`; число тестовых записей осталось 2. Это живая серверная проверка, не mock.

Доказательства: `screens/sheets/lead-evidence.tsv`, `duplicate-response.json`, `status-transitions.json`, `statuses.tsv`, а также PNG в `screens/index.md`. Время в Sheets отображается по Москве: 07.11.2026 02:24–02:25, что соответствует вечеру 06.11.2026 в часовом поясе пользователя America/Los_Angeles. Статус visited здесь — учебное изменение строки, не доказательство фактического посещения шиномонтажа.

Мобильный Lighthouse через [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-lastuser55556-github-io-kursovaya_rabota/oywk7eo7hx?form_factor=mobile): Performance **93**, Accessibility **100**, SEO **100**, Best Practices **100**. Источник `screens/lighthouse/mobile.png`, `summary.json`; ранняя ошибка API 429 сохранена отдельно, не является финальным результатом. Последний подтверждённый успешный [deploy 42309139795](https://github.com/lastuser55556/kursovaya_rabota/actions/runs/42309139795), содержательных коммитов больше 10.

**Ограничение GA4 сохраняется:** DebugView всё ещё 0 received, получение generate_lead и остальных событий не подтверждено. Доставка строки в Sheets и выполнение локального вызова аналитики не равны приёму события Google. Все испытания полностью пройденными не объявляются. ManyChat/DataLens остаются только материалами по выбранному пользователем объёму.
