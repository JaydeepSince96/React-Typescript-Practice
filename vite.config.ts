import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Allow connections from any IP address in your network
    port: 5173,       // Use a fixed port
    open: false,      // Don't automatically open browser
    cors: true,       // Enable CORS for API calls
  },
})
