<template>
  <div>
    <video ref="videoRef" style="width: 100%; border-radius: 8px" />
  </div>
</template>

<script setup>
import { BrowserMultiFormatReader } from "@zxing/browser";
import { ref, onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits(["detected", "close"]);
const videoRef = ref(null);

let reader; // instance
let controls = null; // object có stop()
let scanned = false; // thêm

const stopScanner = () => {
  try {
    if (controls) {
      controls.stop(); // dừng stream
      controls = null;
    }
    if (reader && typeof reader.reset === "function") {
      reader.reset();
    }
  } catch (e) {
    console.warn("Stop scanner error:", e);
  }
};

const handleClose = () => {
  stopScanner();
  emit("close");
};

onMounted(async () => {
  reader = new BrowserMultiFormatReader();
  try {
    controls = await reader.decodeFromVideoDevice(
      null,
      videoRef.value,
      (result, err) => {
        if (result && !scanned) {
          scanned = true;
          const code = result.getText();
          console.log("Scanned barcode:", code);
          emit("detected", code);
          stopScanner();
          emit("close"); // đóng ngay overlay
        }
        // bỏ qua err mỗi frame
      }
    );
  } catch (e) {
    console.error("Init scanner error:", e);
  }
});

onBeforeUnmount(() => {
  stopScanner();
});
</script>
