# Fortco ERP

Fortco ERP is a modular business platform built for **real estate** and **construction** operations in Tanzania.

It combines a modern Laravel backend with a React (Inertia.js) frontend and a module-driven architecture (Nwidart/Modules) to keep features isolated, scalable, and easy to maintain.

## Highlights

- **Modular architecture**
  - Feature areas live under `Modules/*` and can ship with their own config, migrations, routes, and assets.
- **Modern UI**
  - React + TailwindCSS with a clean landing site and reusable section components.
- **Fast local development**
  - Vite for hot reload.
- **Built for real workflows**
  - Clear navigation, role-ready structure, and room to expand into ERP modules.

## Tech Stack

- **Backend**
  - Laravel
  - PHP (see `composer.json`)
- **Frontend**
  - React 18
  - Inertia.js
  - Vite
  - TailwindCSS
- **Modules**
  - Nwidart/Modules (module folders under `Modules/`)

## Repository Structure (High level)

- `app/`
  - Core Laravel application code.
- `routes/`
  - `web.php`, auth routes, etc.
- `resources/js/`
  - React/Inertia pages and components.
  - Home sections live in `resources/js/Pages/Home/sections/`.
- `resources/views/`
  - Blade views (Inertia root layout, vendor views).
- `Modules/`
  - Independent modules such as Analytics, Appointment, Communication, Construction, etc.
- `public/`
  - Public assets including images and slides.

## Requirements

Make sure you have these installed locally:

- PHP (compatible with your Laravel version)
- Composer
- Node.js + npm
- A database (MySQL / MariaDB recommended; SQLite also works for quick local dev)

## Getting Started (Local Setup)

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd fortco-erp

composer install
npm install
```

### 2) Environment configuration

Create `.env` from the example:

```bash
cp .env.example .env
```

Generate the app key:

```bash
php artisan key:generate
```

Configure your database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fortco
DB_USERNAME=root
DB_PASSWORD=
```

### 3) Run migrations + seed (optional)

```bash
php artisan migrate
php artisan db:seed
```

If you have module migrations, run them as well if your module setup requires it.

### 4) Run the app

In two terminals:

```bash
php artisan serve
```

```bash
npm run dev
```

Then open:

- `http://127.0.0.1:8000`

## Common Scripts

### Frontend

- `npm run dev`
  - Starts Vite dev server.
- `npm run build`
  - Builds production assets.

### Backend

- `php artisan serve`
  - Runs the local PHP server.
- `php artisan migrate`
  - Runs database migrations.

## Modules

Modules live in the `Modules/` folder.

Each module typically contains:

- `app/` (controllers, actions, models inside the module)
- `config/`
- `database/` (migrations/seeders)
- `resources/` (module views/assets)
- `routes/`
- `module.json`

### Adding a new module

If you are using `nwidart/laravel-modules`, modules can be generated via artisan commands (depending on your installed package configuration). If you prefer, you can also manually add a new module folder following the existing module patterns.

## UI / Frontend Notes

The landing page sections are organized in:

- `resources/js/Pages/Home/sections/`

Examples:

- `AboutUs.jsx` (Who we are)
- `Blogs.jsx` (blog carousel)
- `Testimonials.jsx` (quote-style testimonials)
- `ContactUs.jsx` (contact form + details)
- `Footer.jsx`

## Configuration Notes

### Tailwind

Tailwind is configured in `tailwind.config.js`.

- Dark mode: `darkMode: 'class'`
- Primary color palette available under `theme.extend.colors.primary`

### Vite

Vite config lives in `vite.config.js`.

## Troubleshooting

### Vite build issues

- If an import fails, confirm the package exists in `package.json` and was installed.
- Remove stale caches if needed:

```bash
rm -rf node_modules/.vite
```

Then restart `npm run dev`.

### Storage / permissions

If you run into file permission issues on a server:

- Ensure `storage/` and `bootstrap/cache/` are writable.

### App key / encryption issues

If you see errors related to `APP_KEY`, run:

```bash
php artisan key:generate
```

## Security

If you discover a security issue, do not open a public issue. Share details privately with the maintainers.

## Contributing

Contributions are welcome.

Suggested workflow:

- Create a feature branch
- Add/adjust tests where relevant
- Keep UI changes consistent with existing Tailwind styles
- Open a PR with a clear description and screenshots for UI changes

## License

This project is licensed under the **MIT License**. See the `LICENSE` file.
