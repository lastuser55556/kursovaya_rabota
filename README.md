# Колесо 21 — курсовая работа

| Ресурс | Ссылка / статус |
|---|---|
| GitHub Pages | https://lastuser55556.github.io/kursovaya_rabota/ — опубликован |
| Учебный репозиторий | https://github.com/lastuser55556/kursovaya_rabota |
| Google Sheets | https://docs.google.com/spreadsheets/d/1wplyIpkCAh8myS5_qHFk4SZn8-v5e6nKiOvdXOPn2dA/edit |
| DataLens | BLOCKED: учебный аккаунт не подключён |
| Instagram / VK / Telegram / YouTube | Публикации не выполнялись, требуется подтверждение |
| Reel с автоответами | BLOCKED: учебные Instagram и ManyChat не подключены |

Идентификатор GA4: **G-YEMK5T27NW**, отдельный ресурс 563008174. Настройки созданы; получение событий в DebugView пока не подтверждено.
Доступ Viewer к ресурсу GA4 выдан: не выдан, email Заказчика не предоставлен.

Учебный проект по ТЗ-21/2026. Компания, реквизиты и контактные сведения вымышлены. Только тестовые данные.

## Отклонения по указанию пользователя

Вместо Vercel используется **GitHub Pages**. Репозиторий называется **kursovaya_rabota**, вместо имени из PDF. Для оформления применены свободное пространство и простые элементы по пожеланию Apple Design, фирменная палитра ТЗ сохранена.

## Запуск

Чистые HTML/CSS/JavaScript, без сборки и фреймворков. В каталоге проекта: `python3 -m http.server 8080`, затем http://localhost:8080 . Сервер нужен для корректной работы браузерных API, `file://` не предназначен для проверки формы.

Все 8 страниц и 404 находятся в корне. `js/analytics.js` — единственная точка вызова gtag; `js/main.js` — калькулятор, протектор, промокод и календарный файл; `js/form.js` — заявка; `js/booking.js` — слоты. Учебная занятость календаря статична, фактический лимит 4 мест дополнительно проверяет сервер.

## Подключения и публикация

1. Settings → Pages → Source → GitHub Actions в подтверждённом учебном репозитории.
2. Workflow `.github/workflows/pages.yml` публикует изменения main.
3. Создайте отдельный учебный GA4 и Apps Script по `docs/integrations.md`; заполните только публичные ga4Id/appsScriptUrl в `js/config.js`.
4. `.env.example` описывает подключения, `.env` игнорируется. Идентификатор Sheets хранится в Script Properties, не в Git. Никаких секретов в браузерном коде.
5. Подробные зависимости и недостающие доступы: `docs/access-required.md`.

## Проверки и доказательства

`tests/backend.test.cjs` запускается командой `node tests/backend.test.cjs`. Это локальный VM-тест приёмника, а не запись в Google Sheets. Реальные браузерные доказательства — `screens/site/`. Отдельные итоги всех 13 испытаний находятся в `FINAL_STATUS.md` и `docs/acceptance.md`. Не выданы за выполненные DebugView, DataLens, публикации и выгрузки GA4.

## Материалы

- Матрица требований: `docs/requirements.md`.
- События: `docs/events.md`, отчётность: `docs/ga4-reporting.md`, `docs/report.md`.
- Реестр 12 ссылок: `docs/utm.csv`, сценарии ManyChat: `docs/manychat.md`.
- Афиша: `docs/afisha.pdf`, QR: `docs/qr-u-12.png`, договор: `files/storage-contract.pdf`.
- Защита: `docs/defense/`, презентация: `deliverables/defense.pptx`.

Не получилось: подтверждение событий GA4, Reports/Explore и DataLens/ManyChat без аккаунтов; подробный итог 13 испытаний в FINAL_STATUS.md.
Нейросеть использовалась для: разработки сайта, кода приёмника, документации, материалов продвижения, презентации и локального тестирования; история запросов — docs/prompts.md.
