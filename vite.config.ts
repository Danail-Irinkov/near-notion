import { defineConfig } from 'vite'
import * as path from 'path'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import WindiCSS from 'vite-plugin-windicss'
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
	mode: process.env.NODE_ENV,
  resolve: {
    alias: {
	    '@/': `${path.resolve(__dirname, 'src')}/`
    }
  },
	publicDir: 'src/public',
  plugins: [
    Vue(),
    Pages({
      exclude: ['**/components/*.vue']
    }),
    Layouts({
      layoutsDir: 'src/components/layout',
      defaultLayout: 'default'
    }),
	  WindiCSS(),
	  pluginRewriteAll() // allows '.' inside url params
  ],
	optimizeDeps: {
		exclude: ['node-sdk-js'] // <= The libraries that need shimming should be excluded from dependency optimization.
	},
	server: {
		open: '/',
	}
})
