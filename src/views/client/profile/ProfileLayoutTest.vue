<template>
  <div>
    <h1>Profile Layout Test</h1>
    <div class="row">
      <div class="col-3">
        <div style="background: #f8f9fa; padding: 20px;">
          <h3>Sidebar</h3>
          <ul>
            <li><RouterLink to="/profile/info">Hồ sơ cá nhân</RouterLink></li>
            <li><RouterLink to="/profile/orders">Đơn hàng</RouterLink></li>
          </ul>
        </div>
      </div>
      <div class="col-9">
        <div style="background: #fff; padding: 20px; border: 1px solid #ddd;">
          <h3>Content</h3>
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
console.log('ProfileLayoutTest loaded')
</script>
