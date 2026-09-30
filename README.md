# Wuddart Furniture — Website (Frontend + Backend)

A full-stack version of the site: a Node.js/Express backend with a small JSON
database, and a static frontend that loads its content from that backend —
so products and categories can be added, edited or deleted from an admin
panel without touching any code. Every part of the site is its own file
(see the layout below), which makes it easy to open in an IDE like
**Antigravity** and have an agent work on one file at a time.

## Project layout

```
wuddart-app/
  package.json
  server/                    ← BACKEND
    index.js                   entry point — run this to start the server
    db.js                       reads/writes server/data/db.json
    data/
      db.json                    the "database": settings, categories, products
    middleware/
      auth.js                    checks the admin key on write requests
      upload.js                  handles product/category photo uploads
    routes/
      settings.js                 GET/PUT /api/settings
      categories.js                GET/POST/PUT/DELETE /api/categories
      products.js                   GET/POST/PUT/DELETE /api/products
  public/                    ← FRONTEND
    index.html                  the public website (structure only)
    admin.html                   the admin panel (structure only)
    css/
      style.css                   public site styling
      admin.css                    admin panel styling
    js/
      main.js                      public site behaviour (fetches the API, renders products)
      admin.js                      admin panel behaviour (sign-in, CRUD forms)
    images/                       starter photos (from your brochure)
    uploads/                       photos you upload from the admin panel land here
```

## 1. Install (one-time)

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
```

## 2. Run it

```bash
npm start
```

```
Wuddart Furniture server running: http://localhost:3000
Admin panel:                       http://localhost:3000/admin.html
```

- **Public website:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin.html
- **Admin key (default):** `wuddart123` — change it in `server/data/db.json`
  (the `"adminKey"` field) before putting the site online.

While developing, `npm run dev` restarts the server automatically on file
changes (uses Node's built-in `--watch`, no extra install needed).

To keep it running in the background on a real server, use a process
manager such as `pm2`:
```bash
npm i -g pm2
pm2 start server/index.js --name wuddart
```

## 3. Using the admin panel

Go to `/admin.html`, enter the admin key, and you can manage:

- **Products** — name, category, description, status (Available / Out of
  Stock) and a photo. No price fields, matching the enquiry-only model.
- **Categories** — the tiles shown on the homepage.
- **Site Settings** — tagline, phone numbers, WhatsApp number, email,
  address, Google Maps link/coordinates, Instagram link, warranty text —
  all in one place.

Changes save to `server/data/db.json` and appear on the public site on next
page load.

## 4. Reaching it from other devices

The server listens on all network interfaces, so from another device on the
same network you can open `http://<host-machine-local-ip>:3000`. Find that
IP with `ipconfig` (Windows) or `ifconfig` / `ip addr` (Mac/Linux). For
access from outside your network, either port-forward, put it behind a
reverse proxy (e.g. Nginx) with a domain, or deploy to a hosting provider.

## 5. Changing the port

```bash
PORT=8080 npm start
```

## Using this in Antigravity (or any AI coding IDE)

The project is split so an agent can be pointed at one concern at a time —
for example "edit `server/routes/products.js` to add an endpoint" or "restyle
`public/css/style.css`" — without needing to touch unrelated files. If you
ask an agent to add a feature that needs a new API route, the pattern to
follow is already there in `server/routes/*.js`: a small Express router,
exported and mounted in `server/index.js`.

## Notes

- Uploaded images live in `public/uploads/` — back that up along with
  `server/data/db.json`.
- The JSON-file database is fine for a single-showroom catalogue like this.
  If it needs to scale up later (a very large catalogue, or several editors
  writing at the same time), swap `server/db.js` for a real database — the
  routes only ever call `readDB()` / `writeDB()`, so that's the only file
  that would need to change.
- This project's JavaScript and JSON were syntax-checked, but `npm install`
  and an actual server run have **not** been verified in this environment
  (no internet access here to fetch packages). Please run `npm install &&
  npm start` and let me know if anything errors.
