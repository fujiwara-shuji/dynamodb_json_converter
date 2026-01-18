import { defineConfig } from 'vite';

export default defineConfig({
    base: '/dynamodb_json_converter/',
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
});
