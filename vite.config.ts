import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		// proxy: {
		// 	'/api': {
		// 		target: 'https://dym-indumentary-back.vercel.app/',
		// 		secure: false,
		// 		changeOrigin: true,
		// 	},
		// },
		
	},
});
