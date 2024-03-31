<script setup>
import PropsToBeDefined from "@/components/DatePickerDay/props";
import DatePickerPrice from "@/components/DatePickerPrice";
import helpers from "@/helpers";
import { computed, inject, provide, ref, watch } from "vue";
import { WEEKLY_BY_SATURDAY, WEEKLY_BY_SUNDAY, NIGHTLY, WEEKLY } from "@/constants/periodType";
import { SATURDAY, SUNDAY } from "@/constants/days";

// import BookingBullet from `@/components/BookingBullet`
// import Price from `@/components/Price`

const day = ref(null)
const props = defineProps(PropsToBeDefined)
const mainPrefix = inject('prefix', '');
const prefix = mainPrefix + props.prefix;
provide('dayprefix', prefix);
const isDisabled = ref(false);
const isHighlighted = ref(false);
const emit = defineEmits(['booking-clicked', 'clear-selection', 'day-clicked', 'clear-selection']);

const formattedDate = computed(() => {
  return helpers.dateFormater(props.date, 'D')
});

const previousBooking = computed(() => {
  let previousBookingValue = null

  if (currentBooking.value && props.duplicateBookingDates.includes(currentBooking.value.checkInDate)) {
    previousBookingValue = props.bookings.find(
      (booking) =>
        booking.checkOutDate === formattedDate.value && props.duplicateBookingDates.includes(booking.checkOutDate),
    )
  }

  return previousBookingValue
});

const currentBooking = computed(() => {
  return props.bookings.find(
    (booking) =>
      (props.duplicateBookingDates.includes(formattedDate.value) && booking.checkInDate === formattedDate.value) ||
      (!props.duplicateBookingDates.includes(formattedDate.value) &&
        helpers.validateDateBetweenTwoDates(booking.checkInDate, booking.checkOutDate, formattedDate.value)),
  )
});

const dayNumber = computed(() => {
  return helpers.dateFormater(props.date, `D`)
});

const dayPrice = computed(() => {
  let result = ``
  const dayPriceCurrentDate = [...props.sortedPeriodDates]
    .reverse()
    .find((d) => helpers.validateDateBetweenTwoDates(d.startAt, d.endAt, formattedDate.value))

  if (dayPriceCurrentDate && dayPriceCurrentDate.price) {
    const priceIsNumeric = typeof dayPriceCurrentDate.price === `number` || !Number.isNaN(parseFloat(dayPriceCurrentDate.price))
    const weeklyPeriod = dayPriceCurrentDate.periodType !== NIGHTLY

    if (priceIsNumeric && weeklyPeriod) {
      // Convert the price when weekly and is not a float/int type
      const price = parseFloat(dayPriceCurrentDate.price)
      const divisor = 7
      const decimals = Number.isNaN(parseFloat(props.priceDecimals)) ? 0 : parseFloat(props.priceDecimals)

      result = (price / divisor).toFixed(decimals)
    } else {
      result = dayPriceCurrentDate.price
    }
  }

  return String(result)
});

const halfDayClass = computed(() => {
  if (Object.keys(props.checkIncheckOutHalfDay).length > 0) {
    const keyDate = helpers.dateFormater(props.date)

    if (props.checkIncheckOutHalfDay[keyDate] && props.checkIncheckOutHalfDay[keyDate].checkIn) {
      if (props.checkIn && !props.checkOut) {
        return `${prefix}halfCheckIn ${prefix}valid`
      }

      return `${prefix}halfCheckIn ${prefix}invalid`
    }

    if (props.checkIncheckOutHalfDay[keyDate] && props.checkIncheckOutHalfDay[keyDate].checkOut) {
      return `${prefix}halfCheckOut ${prefix}valid`
    }
  }

  return false
});

const bookingClass = computed(() => {
  if (props.bookings.length > 0 && currentBooking.value) {
    if (
      !isDisabled.value &&
      helpers.validateDateBetweenTwoDates(
        currentBooking.value.checkInDate,
        currentBooking.value.checkOutDate,
        props.hoveringDate,
      )
    ) {
      if (props.checkIncheckOutHalfDay[formattedDate.value]) {
        if (props.checkIn && !props.checkOut) {
          return `${prefix}not-allowed ${prefix}hovering`
        }

        if (props.checkIncheckOutHalfDay[formattedDate.value].checkOut) {
          return `${prefix}not-allowed ${prefix}hovering`
        }

        return `${prefix}not-allowed ${prefix}invalid`
      }

      if (props.checkIn && !props.checkOut) {
        return `${prefix}not-allowed ${prefix}invalid`
      }

      return `${prefix}not-allowed ${prefix}hovering`
    }

    if (
      props.checkIncheckOutHalfDay[formattedDate.value] &&
      props.checkIncheckOutHalfDay[formattedDate.value].checkOut &&
      !props.duplicateBookingDates.includes(formattedDate.value)
    ) {
      if (!props.checkIn) {
        return `${prefix}not-allowed ${prefix}hovering`
      }

      if ((props.checkIn && props.checkIn === props.date) || (props.checkIn && props.checkOut)) {
        return `${prefix}not-allowed ${prefix}hovering`
      }
    }

    if (props.checkIn && !props.checkOut && props.hoveringDate === props.date) {
      return `${prefix}not-allowed ${prefix}hovering`
    }

    return `${prefix}not-allowed ${prefix}invalid`
  }

  return ``
});

const disabledClass = computed(() => {
  return isDisabled.value || isADisabledDay ? ` ${prefix}disabled ` : ``
});

const dayClass = computed(() => {
  if (!props.belongsToThisMonth) {
    // Good
    return `${prefix}hidden`
  }

  // If the calendar has a minimum number of nights && !checkOut
  const nextValidDate = helpers.addDays(props.checkIn, props.minNightCount)
  const isDateAfterMinimumDuration = helpers.getDayDiff(props.hoveringDate, nextValidDate) <= 0

  if (
    !isDateAfterMinimumDuration &&
    !props.checkOut &&
    !isDisabled.value &&
    helpers.compareDay(props.date, props.checkIn) >= 0 &&
    props.minNightCount > 0 &&
    helpers.compareDay(props.date, helpers.addDays(props.checkIn, props.minNightCount)) === -1
  ) {
    return `${prefix}valid ${prefix}disabled ${prefix}not-allowed minimum-duration-unvalid-day`
  }

  // Current Day
  if (!isDisabled.value && props.date === props.hoveringDate && props.checkIn !== null && props.checkOut == null) {
    return `${prefix}selected ${prefix}hovering vhd__currentDay`
  }

  // Highlight the selected dates and prevent the user from selecting
  // the same date for checkout and checkin
  if (props.checkIn !== null && helpers.dateFormater(props.checkIn) === helpers.dateFormater(props.date)) {
    if (props.minNightCount === 0) {
      return `${prefix}first-day-selected checkIn`
    }

    // Good
    return `${prefix}disabled ${prefix}first-day-selected checkIn`
  }

  // Checkout day
  if (props.checkOut !== null) {
    if (helpers.dateFormater(props.checkOut) === helpers.dateFormater(props.date)) {
      if (halfDayClass.value) {
        return `${prefix}disabled ${prefix}last-day-selected ${halfDayClass.value} checkOut`
      }

      return `${prefix}disabled ${prefix}last-day-selected checkOut`
    }
  }

  // Only highlight dates that are not disabled
  if (isHighlighted.value && !isDisabled.value) {
    const classSelected = `${prefix}selected`

    if (isADisabledDay.value) {
      return `${classSelected} ${prefix}disabled after-minimum-duration-valid-day`
    }

    if (
      Object.keys(props.checkInPeriod).length > 0 &&
      props.checkInPeriod.periodType.includes(WEEKLY) &&
      props.hoveringDate &&
      ((props.checkInPeriod.periodType === WEEKLY_BY_SATURDAY && props.hoveringDate.getDay() === SATURDAY) ||
        (props.checkInPeriod.periodType === WEEKLY_BY_SUNDAY && props.hoveringDate.getDay() === SUNDAY)) &&
      helpers.isDateLessOrEquals(props.date, props.hoveringDate)
    ) {
      // If currentPeriod has a minimumDuration 1
      if (props.checkInPeriod.minimumDuration === 1) {
        return `${classSelected} after-minimum-duration-valid-day`
      }

      // If currentPeriod has a minimumDuration superior to 1
      if (helpers.getDayDiff(props.hoveringDate, props.checkInPeriod.nextValidDate) <= 0) {
        return `${classSelected} after-minimum-duration-valid-day`
      }
    } else if (
      Object.keys(props.checkInPeriod).length > 0 &&
      props.checkInPeriod.periodType === NIGHTLY &&
      props.hoveringDate &&
      props.hoveringPeriod.periodType.includes(WEEKLY) &&
      ((props.hoveringPeriod.periodType === WEEKLY_BY_SATURDAY && props.hoveringDate.getDay() === SATURDAY) ||
        (props.hoveringPeriod.periodType === WEEKLY_BY_SUNDAY &&
          props.hoveringDate.getDay() === SUNDAY &&
          helpers.isDateLessOrEquals(props.date, props.hoveringDate)))
    ) {
      return `${classSelected} after-minimum-duration-valid-day`
    }

    if (props.hoveringPeriod.periodType === NIGHTLY && helpers.isDateLessOrEquals(props.date, props.hoveringDate)) {
      return `${classSelected}  after-minimum-duration-valid-day`
    }

    if (props.checkIn && props.checkOut) {
      return `${classSelected}`
    }

    return `${classSelected} ${prefix}valid`
  }

  // Good
  if (isDisabled.value || isADisabledDay) {
    return `${prefix}disabled`
  }

  if (halfDayClass.value) {
    return `${halfDayClass.value}`
  }

  // Good
  return `${prefix}valid`
});

const notAllowedDayDueToNextPeriod = (currentPeriod) => {
  // Check if the next period is directly after the current period
  const date = new Date(currentPeriod.endAt)
  let nextPeriod = null

  props.sortedPeriodDates.forEach((period) => {
    const dateA = new Date(period.startAt).setHours(0, 0, 0, 0)
    const dateB = new Date(date).setHours(0, 0, 0, 0)

    if (dateA === dateB) {
      nextPeriod = period
    }
  })

  if (nextPeriod) {
    // Subtract the startAt nextPeriod to the currentPeriod minimumDuration
    const subtractTimestamp = new Date(nextPeriod.startAt).setHours(0, 0, 0, 0)
    const subtractDate = new Date(subtractTimestamp)
    const resultDate = new Date(subtractDate.setDate(subtractDate.getDate() - currentPeriod.minimumDuration))

    if (!helpers.validateDateBetweenTwoDates(currentPeriod.startAt, resultDate, props.date)) {
      return true
    }
  }

  return false
};

const notAllowDaysBetweenCheckInAndNextValidDate = (dayCode) =>
  props.checkIn &&
  !props.checkOut &&
  props.date.getDay() === dayCode &&
  Object.keys(props.hoveringPeriod).length > 0 &&
  helpers.validateDateBetweenTwoDates(props.checkIn, props.hoveringPeriod.nextValidDate, props.date) &&
  helpers.dateFormater(props.checkIn) !== formattedDate.value &&
  helpers.dateFormater(props.hoveringPeriod.nextValidDate) !== formattedDate.value;

const checkinCheckoutClass = computed(() => {
  let currentPeriod = null

  props.sortedPeriodDates.forEach((d) => {
    if (
      d.endAt !== formattedDate.value &&
      (d.startAt === formattedDate.value || helpers.validateDateBetweenTwoDates(d.startAt, d.endAt, formattedDate.value))
    ) {
      currentPeriod = d
    }
  })

  if (
    props.nextPeriodDisableDates
      ? props.nextPeriodDisableDates.some((i) => helpers.compareDay(i, props.date) === 0)
      : null
  ) {
    return `${prefix}disabled ${prefix}not-allowed ${NIGHTLY}`
  }

  if (currentPeriod) {
    if (currentPeriod.periodType === NIGHTLY && props.belongsToThisMonth && !isDisabled.value) {
      if (
        ((!props.checkIn && !props.checkOut) || (props.checkIn && props.checkOut)) &&
        notAllowedDayDueToNextPeriod(currentPeriod)
      ) {
        return `${prefix}disabled ${prefix}not-allowed ${NIGHTLY}`
      }

      return NIGHTLY
    }

    if (
      currentPeriod.periodType === WEEKLY_BY_SATURDAY &&
      currentPeriod.startAt !== formattedDate.value &&
      currentPeriod.endAt !== formattedDate.value &&
      props.date.getDay() !== 6
    ) {
      return `${prefix}disabled ${prefix}not-allowed ${WEEKLY_BY_SATURDAY}`
    }

    // Disable date between checkIn and nextDate, if minimumDuration is superior to 1
    if (notAllowDaysBetweenCheckInAndNextValidDate(6)) {
      return `${prefix}disabled ${prefix}not-allowed ${WEEKLY_BY_SATURDAY}`
    }
    if (
      currentPeriod.periodType === WEEKLY_BY_SUNDAY &&
      currentPeriod.startAt !== formattedDate.value &&
      currentPeriod.endAt !== formattedDate.value &&
      props.date.getDay() !== 0
    ) {
      return `${prefix}disabled ${prefix}not-allowed ${WEEKLY_BY_SUNDAY}`
    }

    // Disable date between checkIn and nextDate, if minimumDuration is superior to 1
    if (notAllowDaysBetweenCheckInAndNextValidDate(0)) {
      return `${prefix}disabled ${prefix}not-allowed ${WEEKLY_BY_SUNDAY}`
    }

    return ``
  }

  return ``
});

const tabIndex = computed(() => {
  if (!props.isOpen || !props.belongsToThisMonth || isDisabled.value || !isClickable) {
    return -1
  }

  return 0
});

const nightsCount = computed(() => {
  return helpers.countDays(props.checkIn, props.hoveringDate)
});

const tooltipMessageDisplay = computed(() => {
  const dateIsInPeriod = helpers.validateDateBetweenTwoDates(
    props.hoveringPeriod.startAt,
    props.hoveringPeriod.endAt,
    props.date,
  )
  const checkInIsInPeriod = helpers.validateDateBetweenTwoDates(
    props.hoveringPeriod.startAt,
    props.hoveringPeriod.endAt,
    props.checkIn,
  )

  if (props.tooltipMessage) {
    return props.tooltipMessage
  }

  if (
    props.hoveringPeriod &&
    props.hoveringPeriod.type !== NIGHTLY &&
    dateIsInPeriod &&
    checkInIsInPeriod &&
    nightsCount.value >= 7
  ) {
    return `${nightsCount.value / 7} ${helpers.pluralize(nightsCount.value, `week`)}`
  }

  if (nightsCount.value >= 1) {
    return `${nightsCount.value} ${nightsCount.value !== 1 ? props.i18n.nights : props.i18n.night}`
  }

  return ``
});

const showTooltip = computed(() => {
  if (props.screenSize === `desktop` || props.screenSize === `tablet`) {
    const showCustomTooltip = props.showCustomTooltip && props.date === props.hoveringDate
    const showDefaultTooltip =
      !isDisabled.value &&
      props.belongsToThisMonth &&
      props.date === props.hoveringDate &&
      props.tooltipMessageDisplay.length > 0 &&
      props.checkIn !== null &&
      props.checkOut === null

    return showCustomTooltip || showDefaultTooltip
  }

  return false
});

const isToday = computed(() => {
  return helpers.compareDay(new Date, props.date) === 0
});

const isADisabledDay = computed(() => {
  const days = [`sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`]
  const day = days[props.date.getUTCDay()]

  return props.options.disabledWeekDaysObject[day]
});


const showBookingBullet = computed(() => currentBooking.value && props.belongsToThisMonth && !isDisabled.value);

const isClickable = () => {
  if (props.$refs && props.$refs.day) {
    return getComputedStyle(props.$refs.day).pointerEvents !== 'none'
  }

  return true
};

const dayClicked = (event, date) => {
  let resetCheckin = false
  let disableCheckoutOnCheckin = !props.disableCheckoutOnCheckin

  if (!props.checkIncheckOutHalfDay[formattedDate.value] && currentBooking.value) {
    emit('booking-clicked', event, date, currentBooking.value)

    return
  }

  if (props.disableCheckoutOnCheckin) {
    if (props.checkIn && props.checkIn === date) {
      if (props.checkOut) {
        disableCheckoutOnCheckin = true
        resetCheckin = true
      } else {
        disableCheckoutOnCheckin = false
        emit('clear-selection')
      }
    } else {
      disableCheckoutOnCheckin = true
    }
  }

  if (disableCheckoutOnCheckin) {
    if (!isDisabled.value || isClickable) {
      const formatDate = helpers.dateFormater(date)

      emit('day-clicked', event, date, formatDate, resetCheckin)
    } else {
      emit('clear-selection')
      helpers.dayClicked(event, date)
    }
  }
};

const compareEndDay = () => {
  if (props.options.endDate !== Infinity) {
    return helpers.compareDay(props.date, props.options.endDate) === 1
  }

  return false
};

const checkIfDisabled = () => {
  isDisabled.value =
    // If this day is equal any of the disabled dates
    (props.sortedDisabledDates ? props.sortedDisabledDates.some((i) => helpers.compareDay(i, props.date) === 0) : null) ||
    // Or is before the start date
    helpers.compareDay(props.date, props.options.startDate) === -1 ||
    // Or is after the end date
    compareEndDay ||
    // Or is in one of the disabled days of the week
    isADisabledDay ||
    // Or is after max Nights
    (props.date >= props.nextDisabledDate && props.nextDisabledDate !== null)

  // Handle checkout enabled
  if (props.options.enableCheckout) {
    if (helpers.compareDay(props.date, props.checkIn) === 1 && helpers.compareDay(props.date, props.checkOut) === -1) {
      isDisabled.value = false
    }
  }
};

const checkIfHighlighted = () => {
  if (props.checkIn !== null && props.checkOut !== null && isDisabled.value === false) {
    if (helpers.isDateLessOrEquals(props.checkIn, props.date) && helpers.isDateLessOrEquals(props.date, props.checkOut)) {
      isHighlighted.value = true
    } else {
      isHighlighted.value = false
    }
  }
};

const disableNextDays = () => {
  if (
    props.nextDisabledDate !== null &&
    !helpers.isDateLessOrEquals(props.date, props.nextDisabledDate) &&
    props.nextDisabledDate !== Infinity
  ) {
    isDisabled.value = true
  } else if (helpers.isDateLessOrEquals(props.date, new Date().setDate(props.options.startDate.getDate() - 1))) {
    isDisabled.value = true
  }

  if (helpers.compareDay(props.date, props.checkIn) === 0 && props.minNightCount === 0) {
    isDisabled.value = false
  }

  if (helpers.isDateLessOrEquals(props.checkIn, props.date) && props.options.enableCheckout) {
    isDisabled.value = false
  }
};


const fetchHighlight = () => {
  if (props.checkIn !== null && props.checkOut === null && isDisabled.value === false) {
    if (!helpers.isDateLessOrEquals(props.checkIn, props.date)) {
      isHighlighted.value = false
    } else if (helpers.isDateLessOrEquals(props.date, props.hoveringDate)) {
      isHighlighted.value = true
    } else if (!helpers.isDateLessOrEquals(props.date, props.hoveringDate)) {
      isHighlighted.value = false
    }
  }
};

watch(() => props.hoveringDate, fetchHighlight);
watch(() => props.checkIn, fetchHighlight);
watch(() => props.activeMonthIndex, () => {
  checkIfDisabled()
  checkIfHighlighted()

  if (props.checkIn !== null && props.checkOut !== null) {
    if (helpers.isDateLessOrEquals(props.checkIn, props.date) && helpers.isDateLessOrEquals(props.date, props.checkOut)) {
      isHighlighted.value = true
    } else {
      isHighlighted.value = false
    }
  } else if (props.checkIn !== null && props.checkOut === null) {
    disableNextDays()
  }
});
watch(() => props.nextDisabledDate, () => {
  disableNextDays()
});


</script>

<template>
  <div>
    <div :class="`${mainPrefix}tooltip`" v-html="tooltipMessageDisplay" v-if="showTooltip && options.hoveringTooltip" />
    <div @click.prevent.stop="dayClicked($event, date)" :class="[
      dayClass,
      disabledClass,
      checkinCheckoutClass,
      bookingClass,
      `${mainPrefix}month-day`,
      { [`${prefix}today`]: isToday },
    ]" :tabindex="tabIndex" ref="day">
      <div :class="`${mainPrefix}month-day-wrapper`">
        <span class="day">{{ dayNumber }}</span>
        <DatePickerPrice :show="showPrice" :price="dayPrice" :symbol="priceSymbol" />
      </div>
    </div>
    <DatePickerBookingBullet v-if="showBookingBullet" :currentBooking="currentBooking"
      :duplicateBookingDates="duplicateBookingDates" :formatDate="formatDate" :previousBooking="previousBooking" />
  </div>
</template>