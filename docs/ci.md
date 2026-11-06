# GitHub Actions и публикация

Учебный репозиторий: [lastuser55556/kursovaya_rabota](https://github.com/lastuser55556/kursovaya_rabota).
Сайт: [GitHub Pages](https://lastuser55556.github.io/kursovaya_rabota/).

В `.github/workflows/pages.yml` задан один workflow `Deploy static site to GitHub Pages`. Он запускается после push в `main` или вручную через `workflow_dispatch`. GitHub hosted runner `ubuntu-latest` получает код через checkout, настраивает Pages, загружает статический артефакт и публикует его через deploy-pages. Сборки HTML/CSS/JS нет. Секреты и долгоживущие токены для публикации не требуются: permissions ограничены `contents: read`, `pages: write`, `id-token: write`, используется окружение `github-pages` и временный OIDC. Параллельные публикации объединены группой `pages`; старый незавершённый запуск отменяется.

## Подтверждённые запуски

GitHub connector в учебном аккаунте вернул завершённый job `deploy` с conclusion `success` и успешными шагами checkout, configure-pages, upload-pages-artifact и Deploy для перечисленных запусков:

| Запуск | Job | Результат |
|---|---|---|
| [42306577165](https://github.com/lastuser55556/kursovaya_rabota/actions/runs/42306577165) | 128197314794 | success |
| [42307399987](https://github.com/lastuser55556/kursovaya_rabota/actions/runs/42307399987) | 128200097012 | success |
| [42309139795](https://github.com/lastuser55556/kursovaya_rabota/actions/runs/42309139795) | Последний подтверждённый deploy | success |

Это доказательства публикации конкретных версий. Они не подтверждают, что последующие локальные изменения уже отправлены или опубликованы. Для новой версии сверяйте head commit `main` с последним успешным запуском.

## Локальные проверки

Выполните из корня репозитория:

```sh
python3 tests/static-check.py
node tests/backend.test.cjs
node tests/analytics.test.cjs
```

`static-check.py` использует установленный Node или bundled runtime Codex и записывает `tests/static-report.json`. Проверяет девять HTML, внутренние ссылки и якоря, title/description/Open Graph, favicon, og.jpg 1200×630, размер растров, alt, наличие GA4-тега, синтаксис JS, серверные VM-тесты и privacy/API contract аналитики. Не обращается к Google.

VM-тесты используют явно обозначенные моки браузера и Apps Script. PASS означает выполнение локального контракта кода. Он не заменяет реальный POST в Sheets, DebugView, Realtime, проверку всех 13 приёмочных испытаний, Lighthouse или ручную проверку адаптивности.

Текущий deploy workflow выполняет публикацию; перечисленные локальные тесты пока не являются обязательным CI gate. Не следует называть успешный deploy доказательством прохождения этих тестов.

## Отклонения от PDF

По прямому указанию пользователя GitHub Pages заменяет Vercel. Имя учебного репозитория подтверждено пользователем и отличается от рекомендованного PDF. Правки `main` публикуются автоматически только при включённом Pages Source = GitHub Actions.

В учебном репозитории более 10 содержательных коммитов. Результат деплоя по-прежнему не заменяет приём событий GA4; DebugView 0 received остаётся PENDING. Реальные POST/duplicate уже дополнительно проверены через опубликованный Apps Script (screens/sheets/).
