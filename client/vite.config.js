import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as path from 'path'; // 1. Import the path module
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 5173,
        https: {
            key: fs.readFileSync("/home/sat/Documents/ssl/192.168.0.130+1-key.pem"),
            cert: fs.readFileSync("/home/sat/Documents/ssl/192.168.0.130+1.pem"),
        },
    },
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            // Map @components to the actual path (assuming components are in src/components)
            '@components': path.resolve(__dirname, './src/components'),

            // Map @utils to the actual path (assuming utils are in src/utils)
            '@utils': path.resolve(__dirname, './src/utils'),

            // Add any other aliases you defined in tsconfig.json here
            // For example: '@api': path.resolve(__dirname, './src/api'),
        },
    },
})
