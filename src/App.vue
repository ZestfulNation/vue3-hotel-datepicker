<script setup>
  import './assets/scss/index.scss'
  import DatePicker from './DatePicker/HotelDatePicker.vue'
  import pt from '../public/i18n/pt'
  import fr from '../public/i18n/fr'
  import en from '../public/i18n/en'
  import es from '../public/i18n/es'
  import it from '../public/i18n/it'

</script>

<template>
  <h1 style="flex-grow: 0">Vue Hotel Datepicker v5</h1>
  <div style="flex-grow: 0; padding: 1em 0">
    Language Selection:
    <select v-model="language">
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="it">Italiano</option>
      <option value="pt">Português</option>
    </select>
  </div>
  <div class="container">
    <div class="toggle-menu" @click="toggleMenu">
      <img src="@/assets/images/menu.svg" alt="..." />
    </div>
    <div :class="['menu', { hidden: !menu }]">
      <h3>Examples</h3>
      <ul>
        <li @click="selectBox(0)" :class="{ selected: boxShow == 0 }">Sandbox</li>
        <li @click="selectBox(8)" :class="{ selected: boxShow == 8 }">
          Blocked different day when clicked on with <strong>periodDates</strong>
        </li>
        <li @click="selectBox(9)" :class="{ selected: boxShow == 9 }">
          Half day, If you have check in at noon and checkout before noon
        </li>
        <li @click="selectBox(10)" :class="{ selected: boxShow == 10 }">
          Disable check-in and check-out on the same day
        </li>
        <li @click="selectBox(11)" :class="{ selected: boxShow == 11 }">Allow selection of single day</li>
        <li @click="selectBox(12)" :class="{ selected: boxShow == 12 }">
          Check in only on saturday and minimum stay of 10 nights
        </li>
        <li @click="selectBox(13)" :class="{ selected: boxShow == 13 }">
          Block all dates after December 31st of {{ new Date().getUTCFullYear() }}
        </li>
        <li @click="selectBox(14)" :class="{ selected: boxShow == 14 }">Block all dates after 15th of next month</li>
        <li @click="selectBox(15)" :class="{ selected: boxShow == 15 }">
          Block all date ranges of more than 30 days
        </li>
        <li @click="selectBox(16)" :class="{ selected: boxShow == 16 }">Minimum stay of 3 days</li>
        <li @click="selectBox(17)" :class="{ selected: boxShow == 17 }">Certain dates blocked</li>
        <li @click="selectBox(18)" :class="{ selected: boxShow == 18 }">Allow setting a default date range</li>
        <li @click="selectBox(19)" :class="{ selected: boxShow == 19 }">Checkin only on saturdays</li>
        <li @click="selectBox(20)" :class="{ selected: boxShow == 20 }">Custom tooltip text</li>
        <li @click="selectBox(22)" :class="{ selected: boxShow == 22 }">Custom date format (MMMM D)</li>
        <li @click="selectBox(24)" :class="{ selected: boxShow == 24 }">Set startingDateValue value</li>
        <li @click="selectBox(25)" :class="{ selected: boxShow == 25 }">Set endingDateValue value</li>
        <li @click="selectBox(26)" :class="{ selected: boxShow == 26 }">
          Event startingDateValue (check-in-changed) / endingDateValue (check-out-changed)
        </li>
      </ul>
    </div>
    <div v-show="!menu || currentWidth > 1184" class="box-container">
      <div v-if="boxShow == 0" class="box">
        <h3>Sandbox</h3>
        <div style="width: 48%; display: inline-block">
          <input type="checkbox" v-model="firstDayOfWeek" :true-value="1" :false-value="0" /> First day Monday<br />
          <input type="checkbox" v-model="alwaysVisible" /> alwaysVisible<br />
          <input type="checkbox" v-model="gridStyle" /> gridStyle<br />
          <input type="checkbox" v-model="showSingleMonth" /> showSingleMonth<br />
          <input type="checkbox" v-model="positionRight" /> positionRight<br />
          <input type="checkbox" v-model="singleDaySelection" /> singleDaySelection<br />
          <input type="checkbox" v-model="showYear" /> showYear<br />
          <input type="checkbox" v-model="yearBeforeMonth" /> yearBeforeMonth<br />
          <input type="checkbox" v-model="showWeekNumbers" /> showWeekNumbers<br />
        </div>
        <div style="width: 48%; display: inline-block">
          <input type="checkbox" v-model="showStartingDateValue" /> startingDateValue:
          <input type="text" v-model="startingDate" /> <br />
          <input type="checkbox" v-model="showEndingDateValue" /> endingDateValue:
          <input type="text" v-model="endingDate" /><br />
          <input type="checkbox" v-model="showPeriodDates" /> showPeriodDates<br />
          <input type="checkbox" v-model="showPrice" /> showPrice
          <span v-if="showPrice">- priceSymbol: <input type="text" v-model="priceSymbol" style="width: 3em" /></span>
          <br />
          <input type="checkbox" v-model="showMinNights" :true-value="minNights" :false-value="false" /> minNights
          <input v-if="showMinNights !== false" type="number" v-model="minNights" min="0" /><br />
          <input type="checkbox" v-model="showContentSlot" /> showContentSlot<br />
          <input type="checkbox" v-model="showBookings" /> showBookings<br />
          <input type="checkbox" v-model="showLastDateAvailable" />Stop pagination two years later
          (lastDateAvailable)<br />
        </div>
        <hr />
        <DatePicker :startingDateValue="showStartingDateValue ? new Date(startingDateValue) || null : null"
          :firstDayOfWeek="firstDayOfWeek" :alwaysVisible="alwaysVisible" :gridStyle="gridStyle"
          :showSingleMonth="showSingleMonth" :showYear="showYear" :showPrice="showPrice"
          :showWeekNumbers="showWeekNumbers" :priceSymbol="priceSymbol" :yearBeforeMonth="yearBeforeMonth"
          :positionRight="positionRight" :singleDaySelection="singleDaySelection"
          :lastDateAvailable="showLastDateAvailable ? lastDateAvailable : Infinity"
          :minNights="showMinNights ? minNights : 0" :periodDates="periodDates"
          :bookings="showBookings ? bookings : []" :i18n="i18n" @day-clicked="dayClicked">
          <!-- Insert content here -->
          <template v-slot:content v-if="showContentSlot">
            <div style="background: #ff8000; color: white; padding: 1rem; font-size: 2rem">
              Content Slot with style
            </div>
          </template>
        </DatePicker>
      </div>
      <div v-if="boxShow == 8" class="box">
        <h3>
          Blocked different day when clicked on with <strong>periodDates</strong>&nbsp;
          <span style="font-weight: 400">Emit day-clicked</span>
        </h3>
        <DatePicker :disabledDates="[
      '2021-10-15',
      '2021-10-16',
      '2021-10-17',
      '2021-10-18',
      '2021-10-19',
      '2021-10-20',
      '2021-10-21',
      '2021-10-01',
      '2021-10-02',
      '2021-10-03',
      '2021-10-04',
      '2021-10-05',
      '2021-10-06',
      '2021-10-07',
    ]" :disableCheckoutOnCheckin="true" :minNights="minNights" :i18n="i18n" @day-clicked="dayClicked" />
      </div>
      <div v-if="boxShow == 9" class="box">
        <h3>Half day, If you have check in at noon and checkout before noon</h3>
        <DatePicker :i18n="i18n" :disabledDates="[
      '2021-05-01',
      '2021-05-02',
      '2021-05-03',
      '2021-05-04',
      '2021-05-06',
      '2021-05-07',
      '2021-05-08',
    ]" />
      </div>
      <div v-if="boxShow == 10" class="box">
        <h3>Disable check-in and check-out on the same day</h3>
        <DatePicker :disableCheckoutOnCheckin="true" :minNights="1" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 11" class="box">
        <h3>Allow selection of single day</h3>
        <DatePicker :singleDaySelection="true" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 12" class="box">
        <h3>Check in only on saturday and minimum stay of 10 nights</h3>
        <DatePicker :disabledWeekDays="{
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
    }" :enableCheckout="true" />
      </div>
      <div v-if="boxShow == 13" class="box">
        <h3>Block all dates after December 31st of the current year</h3>
        <DatePicker :endDate="new Date(new Date().getFullYear(), 11, 31)" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 14" class="box">
        <h3>Block all dates after 15th of next month</h3>
        <DatePicker :endDate="new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15)" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 15" class="box">
        <h3>Block all date ranges of more than 30 days</h3>
        <DatePicker :maxNights="30" :selectForward="false" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 16" class="box">
        <h3>Minimum stay of 3 days</h3>
        <DatePicker :minNights="3" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 17" class="box">
        <h3>Certain dates blocked</h3>
        <DatePicker :disabledDates="['2017-09-14', '2017-09-26']" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 18" class="box">
        <h3>Allow setting a default date range ( can be used to set a range from a url param )</h3>
        <DatePicker
          :startingDateValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())"
          :endingDateValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5)"
          :i18n="i18n" />
      </div>
      <div v-if="boxShow == 19" class="box">
        <h3>Checkin only on saturdays</h3>
        <DatePicker :disabledWeekDays="{
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
    }" :enableCheckout="true" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 20" class="box">
        <h3>Custom tooltip text</h3>
        <DatePicker tooltipMessage="<strong style='color: red'>Enjoy</strong> your stay!" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 22" class="box">
        <h3>Custom date format (MMMM D)</h3>
        <DatePicker format="MMMM D" :i18n="i18n" />
      </div>
      <div v-if="boxShow == 24" class="box">
        <h3>Set startingDateValue value</h3>
        <DatePicker :firstDayOfWeek="firstDayOfWeek" :alwaysVisible="alwaysVisible" :startingDateValue="new Date()"
          :i18n="i18n" />
      </div>
      <div v-if="boxShow == 25" class="box">
        <h3>Set endingDateValue value</h3>
        <DatePicker :startingDateValue="new Date()"
          :endingDateValue="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3)"
          :i18n="i18n" />
      </div>
      <div v-if="boxShow == 26" class="box">
        <h3>Event startingDateValue / endingDateValue</h3>
        <DatePicker :i18n="i18n" @check-in-changed="checkIn = $event" @check-out-changed="checkOut = $event" />
        <p>new startingDateValue Date: {{ checkIn }}</p>
        <p>new endingDateValue Date : {{ checkOut }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
html {
  padding: 0;
  margin: 0;
}

body {
  padding: 0;
  margin: 0;
  display: block;
  font-family: Roboto, 'Source Sans Pro', sans-serif;
  font-size: 16px;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
}
h1 {
  background-color: #28ca9c;
  color: white;
  padding: 1em 0;
  margin: 0;
}
#app {
  text-align: center;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}
.container {
  position: relative;
  display: flex;
  flex-direction: row;
  overflow-y: hidden;

  .toggle-menu {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    flex: none;
    color: white;
    padding: 1em 0.5em 1em;
    img {
      width: 1.5em;
    }
  }
  @media (min-width: 1441px) {
    .toggle-menu {
      display: none;
    }
  }

  .menu {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    flex-grow: 1;
    max-width: 300px;
    text-align: left;
    max-height: 100%;
    overflow-y: hidden;
    @media (max-width: 1440px) {
      max-width: 100%;

      &.hidden {
        width: 0;
        max-width: 0;
        overflow: hidden;
        flex-shrink: 1;
      }
    }

    ul {
      padding: 0 0 2em 0;
      margin: 0 1em 0 0;
      font-size: 1.17rem;
      overflow: auto;
      @media (max-width: 1440px) {
        margin-left: calc(24px + 1em);
      }
      li {
        font-size: 1rem;
        padding: 0.25em 0.75em;
        margin: 0;
        text-align: left;
        cursor: pointer;
        list-style-type: none;
        border-bottom: 1px dashed rgba(128, 128, 128, 0.425);

        &:hover,
        &:active,
        &:focus {
          background-color: gray;
          color: white;
        }
        &.selected {
          background-color: #28ca9c;
          color: white;
          position: sticky;
          top: 0;
          bottom: -2em;
        }
      }
    }
  }

  .box-container {
    max-width: 100%;
    width: 100%;
    overflow: auto;
    @media (min-width: 1441px) {
      text-align: left;
    }
    .box {
      flex-grow: 1;
    }
    .box:first-child {
      flex-grow: 0;
    }
  }

  h3 {
    background-color: gray;
    color: white;
    padding: 1em 0 1em calc(1em + 24px);
    margin-top: 0;
    text-align: left;
  }
}
.vhd__datepicker__wrapper {
  max-width: 300px;
  &.vhd__datepicker__fullview {
    max-width: 90%;
  }
}
pre.code {
  background: black;
}
</style>
