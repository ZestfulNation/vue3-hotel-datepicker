export default {
  bookings: {
    type: Array,
    default: () => [],
  },
  activeMonthIndex: {
    type: Number,
  },
  belongsToThisMonth: {
    type: Boolean,
    default: false,
  },
  checkIn: {
    type: Date,
  },
  checkIncheckOutHalfDay: {
    type: Object,
    default: () => ({}),
  },
  checkInPeriod: {
    type: Object,
    default: () => ({}),
  },
  checkOut: {
    type: Date,
  },
  date: {
    type: Date,
  },
  disableCheckoutOnCheckin: {
    type: Boolean,
    default: false,
  },
  duplicateBookingDates: {
    type: Array,
    default: () => [],
  },
  hoveringDate: {
    type: Date,
  },
  hoveringPeriod: {
    type: Object,
    default: () => ({}),
  },
  hoveringTooltip: {
    default: true,
    type: Boolean,
  },
  i18n: {
    type: Object,
    default: () => ({}),
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  minNightCount: {
    type: Number,
    default: 0,
  },
  nextDisabledDate: {
    type: [Date, Number, String],
  },
  nextPeriodDisableDates: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
  },
  priceSymbol: {
    type: String,
    required: true,
  },
  priceDecimals: {
    type: [Number, null],
    default: 0,
  },
  screenSize: {
    type: String,
    default: '',
  },
  showCustomTooltip: {
    default: false,
    type: Boolean,
  },
  showPrice: {
    type: Boolean,
    default: false,
  },
  sortedDisabledDates: {
    type: Array,
    default: () => [],
  },
  sortedPeriodDates: {
    type: Array,
    default: () => [],
  },
  tooltipMessage: {
    default: null,
    type: String,
  },
  prefix: {
    default: "month-day--",
    type: String,
  }
};