// Test service để debug upload
import axios from 'axios';

const BACKEND_API_URL = 'http://localhost:8080';

// Test function đơn giản
export const testBackendUpload = async (file) => {
  try {
    console.log('=== TESTING BACKEND UPLOAD ===');
    console.log('File to upload:', file.name, file.size, file.type);
    
    const formData = new FormData();
    formData.append('image', file);
    
    console.log('FormData created, sending to:', `${BACKEND_API_URL}/api/upload/event-image`);
    
    const response = await axios.post(`${BACKEND_API_URL}/api/upload/event-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    });
    
    console.log('=== BACKEND RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('=== BACKEND UPLOAD ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request made but no response:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
};

// Test multiple upload
export const testBackendMultipleUpload = async (files) => {
  try {
    console.log('=== TESTING BACKEND MULTIPLE UPLOAD ===');
    console.log('Files to upload:', files.length);
    files.forEach((file, index) => {
      console.log(`File ${index + 1}:`, file.name, file.size, file.type);
    });
    
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    console.log('FormData created, sending to:', `${BACKEND_API_URL}/api/upload/event-images`);
    
    const response = await axios.post(`${BACKEND_API_URL}/api/upload/event-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for multiple files
    });
    
    console.log('=== BACKEND MULTIPLE RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('=== BACKEND MULTIPLE UPLOAD ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request made but no response:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
};

// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    console.log('=== TESTING BACKEND CONNECTION ===');
    
    const response = await axios.get(`${BACKEND_API_URL}/api/events`, {
      timeout: 10000
    });
    
    console.log('=== BACKEND CONNECTION OK ===');
    console.log('Status:', response.status);
    console.log('Events count:', response.data?.data?.content?.length || 0);
    
    return true;
  } catch (error) {
    console.error('=== BACKEND CONNECTION ERROR ===');
    console.error('Error:', error.message);
    return false;
  }
};

// Test upload endpoints availability
export const testUploadEndpoints = async () => {
  const endpoints = [
    '/api/upload',
    '/api/upload/event-image',
    '/api/upload/event-images'
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${BACKEND_API_URL}${endpoint}`);
      
      // Test with OPTIONS to check CORS
      const optionsResponse = await axios.options(`${BACKEND_API_URL}${endpoint}`, {
        timeout: 5000
      });
      
      results[endpoint] = {
        available: true,
        status: optionsResponse.status,
        cors: optionsResponse.headers['access-control-allow-origin'] || 'Not set'
      };
      
    } catch (error) {
      results[endpoint] = {
        available: false,
        error: error.message,
        status: error.response?.status || 'No response'
      };
    }
  }
  
  console.log('=== UPLOAD ENDPOINTS TEST RESULTS ===');
  console.log(results);
  
  return results;
};
