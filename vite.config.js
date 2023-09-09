import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	// Chaneg baseUrl only when it's published to gh pages
  base: process.env.NODE_ENV === 'production'? '/react_todo_list/': '/', 
  plugins: [react()],
})
