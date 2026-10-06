# Cutroom frontend (website + admin dashboard)

React + Vite + Tailwind CSS v4. Talks to the Express backend in `agency-backend`.

## Run it

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm run dev
```

Open http://localhost:5173 (start the backend first: `npm run dev` inside agency-backend).

In development, requests to `/api` are proxied to http://localhost:5000, so the login cookie
works with no extra CORS setup. If your backend runs on another port, set `VITE_PROXY_TARGET` in `.env`.

## Pages

| URL | What |
|---|---|
| `/` | Home: hero, recent work, services, process |
| `/work` | All published videos |
| `/contact` | Meeting enquiry form |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Overview and stats (login required) |
| `/admin/videos` | Upload, edit, publish, delete videos |
| `/admin/enquiries` | View enquiries, set status, add private notes |

## Make it yours

Edit `src/config/site.js` for the studio name, email, social links and upload limit.
Colors and fonts are in `src/index.css` (the `@theme` block).

## Deploying

Build with `npm run build` and upload the `dist` folder. Set `VITE_API_URL` to your backend URL
(including `/api`), and make sure your backend's `CLIENT_URLS` contains your site address.
If the site and API are on different domains, set `COOKIE_SAMESITE=none` in the backend (HTTPS required).
Your host must redirect all paths to `index.html` so links like `/admin/dashboard` work on refresh.
