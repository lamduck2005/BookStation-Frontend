<template>
  <div class="money-to-words-tooltip" v-if="showTooltip">
    <span class="tooltip-content">{{ moneyInWords }}</span>
  </div>
</template>

<script>

// Hàm chuyển số thành chữ tiếng Việt
function numberToVietnameseWords(number) {
  number = Number(number);
  if (isNaN(number)) return '';
  if (number === 0) return 'không';
  const dv = ['','một','hai','ba','bốn','năm','sáu','bảy','tám','chín'];
  const hang = ['','nghìn','triệu','tỷ','nghìn tỷ','triệu tỷ','tỷ tỷ'];
  function doc3so(num) {
    let tram = Math.floor(num/100), chuc = Math.floor((num%100)/10), donvi = num%10;
    let str = '';
    if (tram > 0) str += dv[tram] + ' trăm';
    if (chuc > 1) str += (str?' ':'') + dv[chuc] + ' mươi';
    else if (chuc === 1) str += (str?' ':'') + 'mười';
    else if (chuc === 0 && donvi > 0 && tram > 0) str += (str?' ':'') + 'lẻ';
    if (donvi > 0) {
      if (chuc === 0 || chuc === 1) {
        if (donvi === 5 && chuc !== 0) str += ' lăm';
        else str += (str?' ':'') + dv[donvi];
      } else {
        if (donvi === 1) str += ' mốt';
        else if (donvi === 5) str += ' lăm';
        else str += (str?' ':'') + dv[donvi];
      }
    }
    return str.trim();
  }
  let str = '', i = 0;
  while (number > 0) {
    let so3 = number % 1000;
    if (so3 > 0) {
      let doc = doc3so(so3);
      if (i > 0 && doc !== '') doc += ' ' + hang[i];
      str = doc + (str ? ' ' : '') + str;
    }
    number = Math.floor(number / 1000);
    i++;
  }
  return str.trim();
}

export default {
  name: 'MoneyToWordsTooltip',
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    showTooltip: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    moneyInWords() {
      if (this.value === '' || this.value === null || isNaN(this.value)) return '';
      return numberToVietnameseWords(this.value) + ' đồng';
    }
  }
}
</script>

<style scoped>
.money-to-words-tooltip {
  position: absolute;
  top: -30px;
  left: 0;
  background: #fffbe6;
  color: #333;
  border: 1px solid #ffe58f;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 10;
  white-space: nowrap;
}
</style>
