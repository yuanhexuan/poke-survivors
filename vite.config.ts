import { defineConfig } from "vite"

export default defineConfig({
  base: "/pokesurvivors/",
  build: {
    chunkSizeWarningLimit: 4000,
  },
  // socket.io-client 在 v2.1 中改为直接 import 到 bundle 内（不再依赖外部 CDN）
  optimizeDeps: {
    include: ["socket.io-client"],
  },
})
