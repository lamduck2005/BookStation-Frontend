<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);" @click.self="close">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Xem ảnh</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body text-center">
          <img :src="imageUrl" alt="Preview" style="max-width: 100%; max-height: 70vh; border-radius: 8px; box-shadow: 0 2px 16px rgba(0,0,0,0.2);" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  imageUrl: String
});
const emit = defineEmits(['close']);
const close = () => emit('close');
</script>

<style scoped>
.modal.fade.show {
  display: block;
  z-index: 2000;
}
</style>
