import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const applyTheme = (theme) => {
    try {
        const t = theme || {};
        const dir = t.direction === 'rtl' ? 'rtl' : 'ltr';
        const mode = t.mode || 'light';
        const bg = t.bg || '#f7f5f0';

        document.documentElement.setAttribute('dir', dir);
        document.documentElement.style.setProperty('--fortco-bg', bg);

        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = mode === 'dark' || (mode === 'system' && prefersDark);

        document.documentElement.classList.toggle('dark', !!isDark);
    } catch (e) {
        // ignore
    }
};

const appName = import.meta.env.VITE_APP_NAME || 'Fortco Company Limited';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        applyTheme(props?.initialPage?.props?.theme);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
