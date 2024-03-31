"use strict";

import i18nDefaults from '/public/i18n/en'

export default {
  alwaysVisible: {
    type: Boolean,
    default: false,
  },
  bookings: {
    type: Array,
    default() {
      return []
    },
  },
  closeDatepickerOnClickOutside: {
    type: Boolean,
    default: true,
  },
  disableCheckoutOnCheckin: {
    type: Boolean,
    default: false,
  },
  disabledDates: {
    type: Array,
    default() {
      return []
    },
  },
  disabledDaysOfWeek: {
    type: Array,
    default() {
      return []
    },
  },
  disabledWeekDays: {
    type: Object,
    default() {
      return {}
    },
  },
  displayClearButton: {
    type: Boolean,
    default: true,
  },
  enableCheckout: {
    type: Boolean,
    default: false,
  },
  endDate: {
    type: [Date, String, Number],
    default: Infinity,
  },
  endingDateValue: {
    type: [Date, null],
    default: null,
  },
  firstDayOfWeek: {
    type: Number,
    default: 0,
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  gridStyle: {
    type: Boolean,
    default: true,
  },
  halfDay: {
    type: Boolean,
    default: true,
  },
  hoveringTooltip: {
    default: true,
    type: [Boolean, Function],
  },
  i18n: {
    type: Object,
    default: () => i18nDefaults,
  },
  lastDateAvailable: {
    type: [Number, Date],
    default: Infinity,
  },
  maxNights: {
    type: [Number, null],
    default: null,
  },
  minNights: {
    type: Number,
    default: 1,
  },
  periodDates: {
    type: Array,
    default() {
      return []
    },
  },
  positionRight: {
    type: Boolean,
    default: false,
  },
  priceSymbol: {
    type: String,
    default: '',
  },
  showPrice: {
    type: Boolean,
    default: false,
  },
  showSingleMonth: {
    type: Boolean,
    default: false,
  },
  showYear: {
    type: Boolean,
    default: true,
  },
  showWeekNumbers: {
    type: Boolean,
    default: false,
  },
  singleDaySelection: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: [Date, String],
    default() {
      return new Date()
    },
  },
  startingDateValue: {
    type: [Date, null],
    default: null,
  },
  tooltipMessage: {
    type: [String, null],
    default: null,
  },
  value: {
    type: Boolean,
    default: true,
  },
  yearBeforeMonth: {
    type: Boolean,
    default: false,
  },
  prefix: {
    type: String,
    default: 'vhd__datepicker__',
  }
};