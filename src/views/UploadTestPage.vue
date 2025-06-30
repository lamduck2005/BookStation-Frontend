<template>
  <div class="upload-test-page">
    <div class="container py-4">
      <h1>🔬 Upload Test Page</h1>
      <p class="text-muted">Debug upload functionality with Backend API</p>
      
      <!-- Backend Connection Test -->
      <div class="card mb-4">
        <div class="card-header">
          <h5>1. Backend Connection Test</h5>
        </div>
        <div class="card-body">
          <button @click="testConnection" class="btn btn-primary" :disabled="testing">
            <i class="bi bi-wifi"></i> Test Backend Connection
          </button>
          <div v-if="connectionResult" class="mt-3">
            <div :class="connectionResult.success ? 'alert alert-success' : 'alert alert-danger'">
              {{ connectionResult.message }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Upload Endpoints Test -->
      <div class="card mb-4">
        <div class="card-header">
          <h5>2. Upload Endpoints Test</h5>
        </div>
        <div class="card-body">
          <button @click="testEndpoints" class="btn btn-info" :disabled="testing">
            <i class="bi bi-cloud-upload"></i> Test Upload Endpoints
          </button>
          <div v-if="endpointsResult" class="mt-3">
            <div v-for="(result, endpoint) in endpointsResult" :key="endpoint" class="mb-2">
              <div :class="result.available ? 'alert alert-success' : 'alert alert-danger'">
                <strong>{{ endpoint }}:</strong>
                {{ result.available ? `✅ Available (${result.status})` : `❌ ${result.error}` }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- File Upload Test -->
      <div class="card mb-4">
        <div class="card-header">
          <h5>3. File Upload Test</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Select Images to Test:</label>
            <input ref="fileInput" type="file" class="form-control" accept="image/*" multiple @change="onFileSelect">
          </div>
          
          <div v-if="selectedFiles.length > 0" class="mb-3">
            <h6>Selected Files:</h6>
            <ul class="list-group">
              <li v-for="(file, index) in selectedFiles" :key="index" class="list-group-item">
                {{ file.name }} ({{ formatFileSize(file.size) }}, {{ file.type }})
              </li>
            </ul>
          </div>
          
          <div class="btn-group" role="group">
            <button @click="testSingleUpload" class="btn btn-success" :disabled="testing || selectedFiles.length === 0">
              <i class="bi bi-upload"></i> Test Single Upload
            </button>
            <button @click="testMultipleUpload" class="btn btn-warning" :disabled="testing || selectedFiles.length < 2">
              <i class="bi bi-cloud-upload"></i> Test Multiple Upload
            </button>
          </div>
          
          <div v-if="uploadResult" class="mt-3">
            <div :class="uploadResult.success ? 'alert alert-success' : 'alert alert-danger'">
              <h6>{{ uploadResult.success ? '✅ Upload Success' : '❌ Upload Failed' }}</h6>
              <pre>{{ JSON.stringify(uploadResult.data, null, 2) }}</pre>
            </div>
            
            <div v-if="uploadResult.success && uploadResult.images" class="mt-3">
              <h6>Uploaded Images:</h6>
              <div class="row">
                <div v-for="(url, index) in uploadResult.images" :key="index" class="col-md-3 mb-3">
                  <img :src="url" class="img-fluid border rounded" :alt="`Upload ${index + 1}`" @error="handleImageError">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading Indicator -->
      <div v-if="testing" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Testing...</span>
        </div>
        <p class="mt-2">Testing in progress...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  testBackendConnection, 
  testUploadEndpoints, 
  testBackendUpload, 
  testBackendMultipleUpload 
} from '@/services/admin/uploadTest';

// Reactive data
const testing = ref(false);
const connectionResult = ref(null);
const endpointsResult = ref(null);
const uploadResult = ref(null);
const selectedFiles = ref([]);
const fileInput = ref(null);

// Methods
const testConnection = async () => {
  testing.value = true;
  connectionResult.value = null;
  
  try {
    const isConnected = await testBackendConnection();
    connectionResult.value = {
      success: isConnected,
      message: isConnected ? 'Backend is running and accessible!' : 'Backend connection failed!'
    };
  } catch (error) {
    connectionResult.value = {
      success: false,
      message: `Connection error: ${error.message}`
    };
  } finally {
    testing.value = false;
  }
};

const testEndpoints = async () => {
  testing.value = true;
  endpointsResult.value = null;
  
  try {
    const results = await testUploadEndpoints();
    endpointsResult.value = results;
  } catch (error) {
    console.error('Endpoints test error:', error);
  } finally {
    testing.value = false;
  }
};

const onFileSelect = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const testSingleUpload = async () => {
  if (selectedFiles.value.length === 0) return;
  
  testing.value = true;
  uploadResult.value = null;
  
  try {
    const response = await testBackendUpload(selectedFiles.value[0]);
    uploadResult.value = {
      success: true,
      data: response,
      images: response.url ? [response.url] : []
    };
  } catch (error) {
    uploadResult.value = {
      success: false,
      data: {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      }
    };
  } finally {
    testing.value = false;
  }
};

const testMultipleUpload = async () => {
  if (selectedFiles.value.length < 2) return;
  
  testing.value = true;
  uploadResult.value = null;
  
  try {
    const filesToUpload = selectedFiles.value.slice(0, 5); // Max 5 files
    const response = await testBackendMultipleUpload(filesToUpload);
    uploadResult.value = {
      success: true,
      data: response,
      images: response.urls || []
    };
  } catch (error) {
    uploadResult.value = {
      success: false,
      data: {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      }
    };
  } finally {
    testing.value = false;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
};
</script>

<style scoped>
.upload-test-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.card-header {
  background: linear-gradient(135deg, #ecae9e 0%, #d49489 100%);
  color: white;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}

pre {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  font-size: 0.875rem;
  max-height: 300px;
  overflow-y: auto;
}

.img-fluid {
  max-height: 200px;
  object-fit: cover;
}

.btn {
  border-radius: 6px;
  font-weight: 500;
}

.alert {
  border-radius: 6px;
}

.list-group-item {
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>
