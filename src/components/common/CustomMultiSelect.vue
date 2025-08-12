<!-- src/components/common/CustomMultiSelect.vue -->
<template>
    <Multiselect
    >
      
    </Multiselect>
  </template>
  

  
  <style>
  /* Bạn có thể thêm CSS tùy chỉnh ở đây */
  .multiselect {
    border-radius: 0.375rem;
    min-height: 38px;
  }
  
  .multiselect__tags {
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    min-height: 38px;
    padding: 0.375rem 0.75rem;
  }
  
  .multiselect__placeholder {
    color: #6c757d;
    padding-top: 0;
  }
  
  .multiselect__single {
    margin-bottom: 0;
    padding-top: 0;
  }
  
  .multiselect--active {
    z-index: 1000;
  }
  </style>