# ARCHIVE — Flight Review Assistant

Проект заархивирован **2026-10-02** (коммит `731510c` + этот файл). Сайт при этом
продолжает работать. Этот документ — всё, что нужно, чтобы вернуться через 1–2 года.

## Что это

Статический одностраничный помощник для проверяющего на Advanced RPAS Flight
Review (Канада, TP 15395). Чистые HTML/CSS/JS, **без сборки, без `package.json`,
без бэкенда и БД**. Заполненный PDF по бланку FR Assessment Form V3 генерируется
в браузере через `pdf-lib`. Прогресс хранится только в `localStorage` браузера
(ключ `fr-assessment`) — на сервер ничего не уходит, пользовательских данных
на сервере нет.

| Файл | Что внутри |
|---|---|
| `index.html` | разметка, подключение CSS/JS (с `?v=` для сброса кэша) |
| `app.js` | вся логика: вопросы, критерии, ссылки на TC/CAR, навигация, сохранение |
| `pdf-export.js` | заполнение PDF-бланка |
| `assets/pdf-lib.min.js` | библиотека [pdf-lib](https://github.com/Hopding/pdf-lib), вендорена (не из npm) |
| `assets/fr-assessment-template.js` | сам PDF-бланк в base64 (`window.FR_ASSESSMENT_PDF_BASE64`) |
| `*.css` | стили (`styles`, `mobile`, `brand`, `maneuvers`, `navigation`, `export`, `reference-match`) |
| `.nojekyll` | для GitHub Pages |

## Где живёт

- **Прод:** https://flightreview.terrikonlabs.com — Terrikon VPS (IP, SSH-пользователь и
  доступы — в `~/Documents/TerrikonLabs/docs/DEPLOY.md` и `ACCESS.md`; IP здесь не
  пишется, т.к. репозиторий публичный, а сайт за Cloudflare-прокси).
  - код на сервере: `/var/www/terrikon-clients/flightreview/` (владелец `terrikon-hub:www-data`);
  - nginx: общий wildcard-vhost `/etc/nginx/sites-available/terrikon-clients`
    (`<slug>.terrikonlabs.com` → `/var/www/terrikon-clients/<slug>`), отдельного конфига у сайта нет;
  - TLS: wildcard Let's Encrypt `*.terrikonlabs.com` (cert-name `terrikonlabs-wildcard`, DNS-01 через Cloudflare);
  - DNS: proxied A-запись `flightreview` в зоне `terrikonlabs.com` (Cloudflare).
  - **Данных на сервере нет** — только копия файлов из репо. На 2026-10-02 сервер
    и репо совпадали побайтно.
- **Зеркало:** https://mickhailov.github.io/flight-review-canada/ — GitHub Pages,
  автоматически из ветки `main`.
- **Репо:** https://github.com/mickhailov/flight-review-canada (публичный), ветка `main`.

## Что в архиве

`~/Documents/FlightReview-2026-10-02.zip` — все файлы репо (см. таблицу выше),
`README.md` и этот `ARCHIVE.md`. **Без** `.git` (история — в GitHub), без
`.claude/`. Зависимостей, сборки, кэшей, данных и `.env` у проекта нет —
исключать было нечего; lock-файла нет, потому что нет менеджера пакетов
(`pdf-lib` лежит в `assets/`).

## Как восстановить и запустить

```sh
# вариант А — из GitHub (с историей, предпочтительно)
git clone https://github.com/mickhailov/flight-review-canada.git "Fligth Review"
cd "Fligth Review"

# вариант Б — из архива (без истории)
unzip ~/Documents/FlightReview-2026-10-02.zip -d "Fligth Review"
cd "Fligth Review"

# запуск локально
python3 -m http.server 8080
# открыть http://localhost:8080
```

Можно и просто открыть `index.html` в браузере.

## Что поставить отдельно

- Python 3 (только для локального сервера; подойдёт любой статический сервер) — или ничего.
- `git`, `gh` (GitHub CLI, залогинен как `mickhailov`) — чтобы пушить.
- `rsync`, `ssh` + SSH-ключ `~/.ssh/terrikon-deploy` — для деплоя на VPS.
  Как получить ключ заново — `~/Documents/TerrikonLabs/docs/ACCESS.md`.
- Доступ к Cloudflare (зона `terrikonlabs.com`) — для DNS и purge кэша.
- Переменных окружения / `.env` нет.
- Интернет у пользователя: шрифты Google Fonts (Barlow Condensed, Montserrat)
  грузятся с `fonts.googleapis.com`; остальное — локально.

## Как вносить правки после перерыва

1. **Сначала сверить, что лежит на сервере, с репо** (ничего не меняет):
   ```sh
   git pull
   rsync -rcn --delete -i -e "ssh -i ~/.ssh/terrikon-deploy" \
     --exclude='.git' --exclude='.claude' --exclude='.DS_Store' \
     --exclude='README.md' --exclude='ARCHIVE.md' --exclude='.nojekyll' \
     ./ ubuntu@<VPS_IP>:/var/www/terrikon-clients/flightreview/
   ```
   Пустой вывод = совпадает. Если есть строки — кто-то правил сервер руками;
   сначала разобраться и перенести это в репо.
2. Ветка от `main`, правки, проверка локально (`python3 -m http.server 8080`):
   пройти анкету, проверить мобильную ширину, скачать PDF и открыть его.
3. **Если менялись `app.js` / `*.css` — поднять `?v=` в `index.html`**
   (Cloudflare кэширует JS/CSS на edge; серверный токен не умеет purge).
   Сейчас `?v=` стоит только у `export.css` и `app.js` — при правке других файлов
   добавить и им.
4. Коммит, merge в `main`, `git push` (GitHub Pages обновится сам).
5. Деплой на VPS:
   ```sh
   rsync -avz -e "ssh -i ~/.ssh/terrikon-deploy" \
     --exclude='.git' --exclude='.claude' --exclude='.DS_Store' \
     --exclude='README.md' --exclude='ARCHIVE.md' \
     ./ ubuntu@<VPS_IP>:/tmp/flightreview/
   ssh -i ~/.ssh/terrikon-deploy ubuntu@<VPS_IP> \
     'sudo rsync -a --delete /tmp/flightreview/ /var/www/terrikon-clients/flightreview/ \
      && sudo chown -R terrikon-hub:www-data /var/www/terrikon-clients/flightreview'
   ```
6. Проверить: повторить dry-run из п.1 (пусто) и
   `curl -sI https://flightreview.terrikonlabs.com` → `200`; открыть сайт в
   приватном окне.

Если появится новая версия бланка FR Assessment Form — перегенерировать
`assets/fr-assessment-template.js` (base64 нового PDF) и проверить координаты
полей в `pdf-export.js`.

## Переезд на новый сервер

Из кода восстанавливается **весь сайт** (данных нет). Из кода **не**
восстанавливается только инфраструктура:
- nginx-vhost (wildcard `terrikon-clients` или отдельный `server_name flightreview.terrikonlabs.com`);
- TLS-сертификат (wildcard через certbot DNS-01 + Cloudflare-токен, или обычный HTTP-01);
- DNS-запись в Cloudflare;
- SSH-доступ/пользователь для деплоя.

Порядок:
1. На новом сервере: nginx, certbot, каталог `/var/www/terrikon-clients/flightreview/`
   (или любой другой docroot), владелец — пользователь веб-сервера.
2. Vhost + сертификат (схема — `TerrikonLabs/docs/DEPLOY.md`, раздел «Клиентские тест-сайты на сабдоменах»).
3. Залить файлы командой из п.5 выше, заменив `<VPS_IP>`, пользователя `ubuntu`,
   ключ, путь docroot и `chown terrikon-hub:www-data` на новые.
4. Проверить по IP/hosts-файлу, что сайт отдаётся, **потом** переключить
   A-запись `flightreview` в Cloudflare на новый IP (оставить proxied).
5. Purge кэша в Cloudflare (дашборд → Caching → Purge Everything).
6. Обновить IP/пути в этом файле, в `TerrikonLabs/docs/DEPLOY.md` и в памяти Claude.
7. Старый docroot удалить только после проверки нового.

Простейшая альтернатива переезду — оставить только GitHub Pages (работает
без сервера) и повесить домен туда (`CNAME` в репо + запись в Cloudflare).
