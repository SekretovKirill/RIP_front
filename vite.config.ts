import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     port: 3000,
    
//    },
//   base: "RIP_front",
//   plugins: [react()],
// })


// https://vitejs.dev/config/
export default defineConfig({  server: {
    port : 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),

      }
    }
  },
  base: "/RIP_front/",
  plugins: [react()],
})
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/RIP_front": {
//         target: "http://localhost:8000",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/RIP_front/, "/"),
//       },
//     },
//   },
// });