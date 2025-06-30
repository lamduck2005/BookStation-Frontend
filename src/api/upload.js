// API routes cho Vite dev server
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // Middleware để xử lý upload
    middlewareMode: false,
    configureServer(server) {
      server.middlewares.use('/api/upload', (req, res, next) => {
        if (req.method === 'POST' && req.url === '/event-images') {
          handleMultipleImageUpload(req, res);
        } else if (req.method === 'POST' && req.url === '/event-image') {
          handleSingleImageUpload(req, res);
        } else if (req.method === 'DELETE' && req.url === '/event-image') {
          handleDeleteImage(req, res);
        } else {
          next();
        }
      });
    }
  }
});

// Xử lý upload multiple images
async function handleMultipleImageUpload(req, res) {
  // Implementation tương tự upload-server.js
  // nhưng đơn giản hơn
}
