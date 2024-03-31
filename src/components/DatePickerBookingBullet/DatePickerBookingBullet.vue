<script setup>
import { computed, inject } from 'vue'
import PropsToBeDefined from '@/components/DatePickerBookingBullet/props'

const props = defineProps(PropsToBeDefined)
const prefix = inject('prefix', '')

const isCheckIn = computed(() => props.currentBooking.checkInDate === props.formatDate)
const isCheckOut = computed(() => props.currentBooking.checkOutDate === props.formatDate)
const isDuplicateBookingDates = computed(() => props.duplicateBookingDates.includes(props.formatDate))
const showPreviousBooking = computed(
  () => props.previousBooking && props.duplicateBookingDates.includes(props.formatDate),
)
const showCurrentBooking = computed(() => props.currentBooking && (isCheckIn.value || isCheckOut.value))
</script>

<template>
  <span :class="`${prefix}parent-bullet`">
    <span
      v-if="showPreviousBooking.value"
      :style="props.previousBooking.style"
      :class="[
        `${prefix}bullet`,
        {
          [`${prefix}checkInCheckOut`]: isDuplicateBookingDates.value,
        },
      ]"
    />
    <span
      v-if="showPreviousBooking.value"
      :style="props.previousBooking.style"
      :class="`${prefix}pipe ${prefix}checkInCheckOut`"
    />
    <span
      v-if="showCurrentBooking.value"
      :style="props.currentBooking.style"
      :class="[
        `${prefix}bullet`,
        {
          [`${prefix}checkIn`]: isCheckIn.value,
          [`${prefix}checkOut`]: isCheckOut.value,
        },
      ]"
    />
    <span
      v-if="props.currentBooking"
      :style="props.currentBooking.style"
      :class="[
        `${prefix}pipe`,
        {
          [`${prefix}checkIn`]: isCheckIn.value,
          [`${prefix}checkOut`]: isCheckOut.value,
        },
      ]"
    />
  </span>
</template>
