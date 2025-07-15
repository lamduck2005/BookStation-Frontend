<template>
  <div>
    <button class="close-btn" @click="$emit('close')">
      <i class="bi bi-x-lg"></i>
    </button>
    <video ref="videoRef" style="width: 100%; border-radius: 8px" />
  </div>
</template>

<script setup>
import { BrowserMultiFormatReader } from "@zxing/browser";
import { ref, onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits(["detected"]);
const videoRef = ref(null);
let codeReader;

onMounted(() => {
  codeReader = new BrowserMultiFormatReader();
  codeReader.decodeFromVideoDevice(null, videoRef.value, (result, err) => {
    if (result) {
      emit("detected", result.getText());
      codeReader.reset();
    }
  });
});

onBeforeUnmount(() => {
  if (codeReader) codeReader.reset();
});
</script>
