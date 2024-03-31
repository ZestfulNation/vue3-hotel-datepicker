<script setup>
import { computed, inject } from "vue";
import PropsToBeDefined from "@/components/DatePickerBookingBullet/props";

const props = defineProps(PropsToBeDefined)
const prefix = inject('prefix', '');

const isCheckIn = computed(() => props.currentBooking.checkInDate === props.formatDate);
const isCheckOut = computed(() => props.currentBooking.checkOutDate === props.formatDate);

</script>

<template>
  <i :class="`${prefix}parent-bullet`">
    <i v-if="props.previousBooking && props.duplicateBookingDates.includes(props.formatDate)" :class="`${prefix}bullet`"
      :style="props.previousBooking.style" :class="[
    {
      [`${prefix}checkInCheckOut`]: props.duplicateBookingDates.includes(props.formatDate),
    },
  ]" />
    <i v-if="props.previousBooking && props.duplicateBookingDates.includes(props.formatDate)"
      :class="`${prefix}pipe ${prefix}checkInCheckOut`" :style="props.previousBooking.style" />
    <i v-if="props.currentBooking && (isCheckIn.value || isCheckOut.value)" :class="`${prefix}bullet`"
      :style="props.currentBooking.style" :class="[
    {
      [`${prefix}checkIn`]: isCheckIn.value,
      [`${prefix}checkOut`]: isCheckOut.value,
    },
  ]" />
    <i v-if="props.currentBooking" :class="{
    [`${prefix}pipe`]: true,
    [`${prefix}checkIn`]: isCheckIn.value,
    [`${prefix}checkOut`]: isCheckOut.value,
  }" :style="props.currentBooking.style" />
  </i>
</template>
