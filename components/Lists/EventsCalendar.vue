<template>
  <div class="tabs_wrapper">
    <info-toggle
      :buttons="[
        { title: 'Days', id: 0 },
        { title: 'List', id: 1 },
      ]"
      class="btns"
      :id="0"
      @select="setIsShowEvents($event)"
    ></info-toggle>
    <div class="calendar_wrapper" :class="{ none: id == 1 }" ref="calendarRef">
      <div class="tooltip">
        <div v-for="(data, i) in tooltipData" :key="data + i" class="tooltip-item">
          <span>{{ data.time }}</span>
          <span class="tooltip-content">{{ data.description }}</span>
        </div>
      </div>
      <input id="calendar" type="text" />
    </div>
    <div class="events_wrapper" :class="{ none: id == 0 }">
      <scroll-list v-if="events.length" class="mt-10">
        <div v-for="i in events" :key="i + 'a'">
          <event-item :event="i"></event-item>
        </div>
      </scroll-list>
      <scroll-list v-else class="w-full mt-10">
        <div class="empty-events-list">Super Event Comes Soon</div>
      </scroll-list>
    </div>
  </div>
</template>

<script>
import * as mobiscroll from '@mobiscroll/javascript';
import '@mobiscroll/javascript/dist/css/mobiscroll.min.css';
import { getTooltipTime } from '@/util/helpers';

export default {
  name: 'CalendarList',
  data() {
    return {
      id: 0,
      date: '',
      interval: null,
      customEvents: [],
      tooltipData: [],
    };
  },
  props: {
    events: { type: Array, default: [] },
  },
  methods: {
    setIsShowEvents(id) {
      this.id = id;
    },
    removeDuplicatedEvents() {
      if (this.events && this.events.length) {
        const uniqueDates = new Set(this.events.map((event) => event.started_at.substr(0, 10)));
        this.customEvents = Array.from(uniqueDates, (date) => {
          return this.events.find((event) => event.started_at.startsWith(date));
        }).map((item) => ({
          date: new Date(item.started_at),
        }));
      }
    },
    addTooltip(target) {
      if (target.classList.contains('mbsc-calendar-day')) {
        const calendarWrapper = this.$refs.calendarRef.parentNode;
        const rect = target.getBoundingClientRect();
        const x = rect.left - calendarWrapper.getBoundingClientRect().left;
        const y = rect.top - calendarWrapper.getBoundingClientRect().top;
        const tooltip = document.querySelector('.tooltip');
        tooltip.style.display = 'block';
        tooltip.style.left = x - 102 + 'px';
        tooltip.style.top = y + 47 + 'px';
      }
    },
    findEventsByDate(dateString) {
      const searchDate = new Date(dateString);
      const matchingEvents = this.events.filter((event) => {
        const eventDate = new Date(event.started_at);
        return (
          eventDate.getFullYear() === searchDate.getFullYear() &&
          eventDate.getMonth() === searchDate.getMonth() &&
          eventDate.getDate() === searchDate.getDate()
        );
      });
      return matchingEvents;
    },
  },
  updated() {
    this.removeDuplicatedEvents();
    mobiscroll.setOptions({
      marked: this.customEvents,
    });
  },
  watch: {
    customEvents(value) {
      if (value && value.length) {
        mobiscroll.setOptions({
          marked: value,
        });
      }
    },
  },
  created() {
    this.removeDuplicatedEvents();
  },
  mounted() {
    document.addEventListener('click', (event) => {
      const calendarWrapper = document.querySelector('.calendar_wrapper');
      const tooltip = document.querySelector('.tooltip');

      if (calendarWrapper && !calendarWrapper.contains(event.target)) {
        tooltip.style.display = 'none';
      }
    });

    mobiscroll.setOptions({
      theme: 'material',
    });

    mobiscroll.datepicker('#calendar', {
      display: 'inline',
      controls: ['calendar'],
      touchUi: false,
      marked: this.customEvents,
      onCellClick: (event, inst) => {
        const target = event.target;
      },
      onCellHoverIn: (event, inst) => {
        const target = event.target;
        event.selected = true;
        target.classList.add('mbsc-selected');
        const eventsByDate = this.findEventsByDate(event.date);
        if (eventsByDate.length) {
          this.tooltipData = eventsByDate.map((item) => ({
            time: getTooltipTime(item.started_at),
            description: item.description,
          }));
          this.addTooltip(target);
        }
      },
      onCellHoverOut: (event, inst) => {
        const target = event.target;
        target.classList.remove('mbsc-selected');
        const calendarWrapper = document.querySelector('.calendar_wrapper');
        const tooltip = document.querySelector('.tooltip');
        if (calendarWrapper.contains(event.target)) {
          tooltip.style.display = 'none';
        }
      },
      onChange: (ev, inst) => {
        this.date = inst.getVal();
      },
    });
  },
};
</script>

<style lang="scss">
.empty-events-list {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: $colabs-bg;
  padding-left: 15px;
}
.events_wrapper {
  padding: 20px 24px;
  background: $white;
  border-radius: 16px;
  width: fit-content;
  height: fit-content;
  min-width: 360px;
  display: flex;
  border: 1px solid $default-border;
  max-height: 425px;
  &.none {
    display: none;
  }
}
.btns {
  position: absolute;
  top: 23px;
  left: 30px;
  z-index: 100;
}
.tabs_wrapper {
  position: relative;
  width: 100%;
  border-radius: 16px;
}
.margin-top {
  margin-top: 20px;
}
#calendar {
  display: none;
}
.display-none {
  display: none;
}
.calendar_wrapper {
  position: relative;
  max-width: 360px;
  border-radius: 16px;
  border: 1px solid $default-border;
  &.none {
    display: none;
  }
}
.flex {
  flex: none;
}
.tooltip {
  display: none;
  position: absolute;
  z-index: 999;
  background: $default;
  box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 14px;
  line-height: 1.5;
  width: 240px;
  height: auto;
  min-height: 32px;
  left: -100px;
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 18px;
    background: $default;
    transform: rotate(45deg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
    top: 0;
    left: 115px;
  }
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    text-align: right;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default-border;
  }
  .tooltip-content {
    position: relative;
    z-index: 20;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $white;
    padding-left: 8px;
  }
}
</style>
