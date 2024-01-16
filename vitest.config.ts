import viteConfig from './vite.config'

import { defineConfig, mergeConfig } from 'vite'

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'jsdom',
			setupFiles: './src/shared/config/setup-test.ts',
		},
	}),
)
