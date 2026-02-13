import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: true,
        port: 5173,
        strictPort: true,
        hmr: {
            host: process.env.VITE_DEV_SERVER_HOST || undefined,
        },
    },
});
