<script setup>
import { inject } from 'vue';

const dayprefix = inject('dayprefix');
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  symbol: {
    type: [String, null, undefined],
    default: '',
  },
});

</script>

<template>
  <div v-if="props.show && !!props.price" :class="`${dayprefix}price`">
    <span :class="`${dayprefix}price-symbol`">{{ props.symbol }}</span>
    <span :class="`${dayprefix}price-number`">{{ props.price }}</span>
  </div>
</template>
