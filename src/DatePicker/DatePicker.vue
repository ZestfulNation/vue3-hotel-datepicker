<script setup>
import { computed, provide, ref } from 'vue'
import PropsToBeDefined from "@/DatePicker/props";


const props = defineProps(PropsToBeDefined)
provide('prefix', props.prefix);

const isOpen = computed({
  get() {
    return this.open
  },
  set(open) {
    this.open = open

    if (!this.isDesktop && !this.alwaysVisible) {
      const body = document.querySelector('body')

      if (open) {
        body.style.overflow = 'hidden'

        this.$nextTick(() => {
          if (this.$refs) {
            const { swiperWrapper } = this.$refs
            const monthHeihgt = this.$refs.datepickerMonth[0].offsetHeight
            const currentSelectionIndex = this.checkOut ? this.getMonthDiff(new Date(), this.checkOut) : 0

            swiperWrapper.scrollTop = currentSelectionIndex * monthHeihgt
          }
        })
      } else {
        body.style.overflow = ''
      }
    }

    this.$emit('input', this.open)
  }
});

const sortBookings = computed(() => {
  if (this.bookings.length > 0) {
    const bookings = [...this.bookings]

    return bookings.sort((a, b) => {
      const aa = a.checkInDate.split('/').reverse().join()
      const bb = b.checkOutDate.split('/').reverse().join()

      // eslint-disable-next-line no-nested-ternary
      return aa < bb ? -1 : aa > bb ? 1 : 0
    })
  }

  return []
});

const duplicateBookingDates = computed(() => {
  return this.baseHalfDayDates.filter(
    (
      (newArr) => (date) =>
        newArr.has(date) || !newArr.add(date)
    )(new Set()),
  )
});

const baseHalfDayDates = computed(() => {
  if (this.sortBookings.length > 0) {
    const bookings = this.sortBookings.map((x) => [x.checkInDate, x.checkOutDate])

    return bookings.reduce((a, b) => {
      return a.concat(b)
    })
  }

  return this.disabledDates
});

const paginateMonths = computed(() => {
  const months = [this.months[this.activeMonthIndex]]

  if (!(this.showSingleMonth || (this.alwaysVisible && !this.isDesktop))) {
    months.push(this.months[this.activeMonthIndex + 1])
  }

  return months
});

const customTooltipMessage = computed(() => {
  let tooltip = ''

  if (this.hoveringDate && (this.customTooltip || this.customTooltipHalfday)) {
    if (this.customTooltip && this.customTooltipHalfday) {
      tooltip = `${this.customTooltipHalfday}. <br/> ${this.customTooltip}`
    } else if (this.customTooltipHalfday && !this.customTooltip) {
      tooltip = this.customTooltipHalfday
    } else {
      tooltip = this.customTooltip
    }

    return tooltip
  }

  return this.tooltipMessage
});

const sortedPeriodDates = computed(() => {
  let periodDates = []

  if (this.periodDates) {
    const sortFunction = (fecha1, fecha2) => {
      const v1 = fecha1.startAt.split('/').reverse().join() + fecha1.endAt.split('/').reverse().join()
      const v2 = fecha2.startAt.split('/').reverse().join() + fecha2.endAt.split('/').reverse().join()

      // eslint-disable-next-line no-nested-ternary
      return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
    }

    periodDates = [...this.periodDates].sort(sortFunction)
  }

  return periodDates
});

const sliceMonthMobile = computed(() => {
  const nbMonthRenderDom = 4

  if (this.activeMonthIndex >= nbMonthRenderDom) {
    return this.months.slice(this.activeMonthIndex - 3, this.activeMonthIndex + 1)
  }

  return this.months.slice(0, nbMonthRenderDom)
});

const isPreventedMaxMonth = computed(() => {
  const lastIndexMonthAvailable = this.getMonthDiff(this.startDate, this.lastDateAvailable)

  return this.activeMonthIndex >= lastIndexMonthAvailable - 1
});

const minNightCount = computed(() => {
  return this.dynamicNightCounts || this.minNights
});

const showClearSelectionButton = computed(() => {
  return Boolean((this.checkIn || this.checkOut) && this.displayClearButton)
});

const disabledWeekDaysObject = computed(() => {
  const disabledDays = this.disabledDaysOfWeek.map((d) => d.toLowerCase())
  // const names = this.i18n['day-names']
  const names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const SUNDAY = names[0]
  const MONDAY = names[1]
  const TUESDAY = names[2]
  const WEDNESDAY = names[3]
  const THURSDAY = names[4]
  const FRIDAY = names[5]
  const SATURDAY = names[6]
  // The order of _default is important!
  const disabledWeekDaysObject = {
    sunday: disabledDays.includes(SUNDAY),
    monday: disabledDays.includes(MONDAY),
    tuesday: disabledDays.includes(TUESDAY),
    wednesday: disabledDays.includes(WEDNESDAY),
    thursday: disabledDays.includes(THURSDAY),
    friday: disabledDays.includes(FRIDAY),
    saturday: disabledDays.includes(SATURDAY),
  }

  return Object.assign(disabledWeekDaysObject, this.disabledWeekDays)
});

const disabledWeekDaysArray = computed(() => {
  const days = this.disabledWeekDaysObject
  // const names = this.i18n['day-names']
  const names = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  const fn = function fnDisabledWeekDaysArray(day, ix) {
    return day[1] ? names[ix] : false
  }

  return Object.entries(days)
    .map(fn)
    .filter((v) => v)
});

const dayOptions = computed(() => {
  return { ...this.$props, disabledWeekDaysObject: this.disabledWeekDaysObject }
});

const numberOfMonths = computed(() => {
  return this.showSingleMonth ? 1 : 2
});

const isDesktop = computed(() => {
  return this.screenSize === 'desktop'
});



</script>