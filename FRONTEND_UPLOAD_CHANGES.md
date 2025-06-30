# Frontend Changes for Backend Upload Integration

## Summary
Moving upload functionality from separate Upload Server (port 3001) to main Backend API (port 8080).

## Changes Made

### 1. Updated upload service (`src/services/admin/upload.js`)
```javascript
// Old: Upload Server
const UPLOAD_SERVER_URL = 'http://localhost:3001';

// New: Backend API  
const BACKEND_API_URL = 'http://localhost:8080';
```

### 2. API endpoints changed
```javascript
// Old endpoints
POST http://localhost:3001/api/upload/event-images
POST http://localhost:3001/api/upload/event-image
DELETE http://localhost:3001/api/upload/event-image

// New endpoints (waiting for Backend implementation)
POST http://localhost:8080/api/upload/event-images
POST http://localhost:8080/api/upload/event-image  
DELETE http://localhost:8080/api/upload/event-image
```

### 3. Simplified vite.config.js
- Removed upload middleware
- Backend will handle all upload logic

## Testing

### When Backend is ready:
1. Start Backend API: `port 8080`
2. Start Frontend: `npm run dev` (port 5173) 
3. Test upload in Event creation modal

### Expected response format:
```json
{
  "success": true,
  "urls": [
    "http://localhost:8080/uploads/events/2025/06/image1751234567890_abc123.jpg"
  ],
  "message": "Upload successful"
}
```

## Rollback Plan
If Backend upload is not ready, can quickly revert to Upload Server:
1. Change `BACKEND_API_URL` back to `http://localhost:3001`
2. Start `node upload-server.js`

## Next Steps
1. ✅ Frontend ready for Backend upload
2. ⏳ Backend team implement upload endpoints (see BACKEND_UPLOAD_REQUIREMENTS.md)
3. ⏳ Test integration  
4. ⏳ Remove upload-server.js file
