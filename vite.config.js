import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    plugins: [react()],
    server: {
        host: '127.0.0.1',
        port: 3000,
    },
    build: {
        outDir: 'dist/react',
    },
});
