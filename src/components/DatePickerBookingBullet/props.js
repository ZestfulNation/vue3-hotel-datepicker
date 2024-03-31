export default {
  currentBooking: {
    type: Object,
    default: () => ({}),
  },
  duplicateBookingDates: {
    type: Array,
    default: () => [],
  },
  formatDate: {
    type: String,
    default: '',
  },
  previousBooking: {
    type: Object,
    default: () => ({}),
  },
};