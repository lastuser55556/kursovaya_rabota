# Источник и решения

Основной источник: TZ-21_Shinomontazh_Koleso21.pdf, 17 страниц. SHA-256: 9afa6ce9a10440978d64811679a16418c21317306f7599573c54d64cf6893a1a. Изучены все страницы, приложения и критерии оценки.

По указанию пользователя: GitHub Pages вместо Vercel, имя репозитория kursovaya_rabota, минималистичное оформление по мотивам Apple Design. Только GitHub УЧЕБНАЯ lastuser55556 и Google lastuser55556@gmail.com.

Пользователь подтвердил браузерный способ настройки Sheets, публикацию приёмника с доступом Все и создание четырёх коротких ссылок. Публикации в соцсетях не выполнялись. Для ManyChat и DataLens пользователь выбрал только материалы.

Первый remote-коммит содержит исходную главную страницу нейросети. Полный проект добавлен последующими содержательными коммитами. История и даты не переписывались. Полный проект не находился в первом remote-коммите, что является ограничением требования PDF.

## Завершённые живые проверки, 06.11.2026

Apps Script авторизован и опубликован, `initializeProject` выполнена успешно. Реальный endpoint: https://script.google.com/macros/s/AKfycbwNocgF2l0I-4CL3fbV2EGgmy2J01z2CQByNiPMGsa7bILGPjk2ZgoHzpODO4Hpr-De/exec . В нативной Sheets две **учебные тестовые** записи, не реальные клиентские обращения:

- Строка 2: `REQ-cc05728f-edfc-4216-886d-70ba434bc74f`, интеграционный запрос с localhost; итоговый учебный статус `no_show`.
- Строка 3: `REQ-f40316cd-8792-4fbf-91c3-d6c5a5b988d0`, «Приёмка ТЗ-21/2026» с опубликованного Pages, UTM `instagram / social / winter_tires_2026 / reel_tread_01`. Проведена `new → confirmed → reminded → visited`.
- Повторный реальный POST ID строки 2 вернул `{"ok":false,"error":"duplicate","field":"request_id"}`; число тестовых записей осталось 2. Это живая серверная проверка, не mock.

Доказательства: `screens/sheets/lead-evidence.tsv`, `duplicate-response.json`, `status-transitions.json`, `statuses.tsv`, а также PNG в `screens/index.md`. Время в Sheets отображается по Москве: 07.11.2026 02:24–02:25, что соответствует вечеру 06.11.2026 в часовом поясе пользователя America/Los_Angeles. Статус visited здесь — учебное изменение строки, не доказательство фактического посещения шиномонтажа.

Мобильный Lighthouse через [PageSpeed Insights](https://pagespeed.web.dev/analysis/https-lastuser55556-github-io-kursovaya_rabota/oywk7eo7hx?form_factor=mobile): Performance **93**, Accessibility **100**, SEO **100**, Best Practices **100**. Источник `screens/lighthouse/mobile.png`, `summary.json`; ранняя ошибка API 429 сохранена отдельно, не является финальным результатом. Последний подтверждённый успешный [deploy 42309139795](https://github.com/lastuser55556/kursovaya_rabota/actions/runs/42309139795), содержательных коммитов больше 10.

**Ограничение GA4 сохраняется:** DebugView всё ещё 0 received, получение generate_lead и остальных событий не подтверждено. Доставка строки в Sheets и выполнение локального вызова аналитики не равны приёму события Google. Все испытания полностью пройденными не объявляются. ManyChat/DataLens остаются только материалами по выбранному пользователем объёму.
