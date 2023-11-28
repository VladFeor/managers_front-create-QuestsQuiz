<template>
  <div class="calendar_wrapper">
    <input id="agenda" type="text" />
  </div>
</template>
<script>
import * as mobiscroll from '@mobiscroll/javascript';
import '@mobiscroll/javascript/dist/css/mobiscroll.min.css';

export default {
  name: 'EventCalendar',
  data() {
    return {
      date: '',
      events: [],
    };
  },
  mounted() {
    mobiscroll.setOptions({
      theme: 'material',
    });
    mobiscroll.eventcalendar('#agenda', {
      view: {
        agenda: { type: 'month' },
      },
      data: [
        {
          start: '2023-03-21T07:00:00Z',
          end: '2023-03-21T09:00:00Z',
          title: 'Stakeholder mtg.',
          description: 'Weekly meeting with team',
          busy: true,
        },
        {
          start: '2023-03-21T18:00:00Z',
          end: '2023-03-21T19:30:00Z',
          title: 'Wrapup mtg.',
          description: 'Weekly meeting with team',
          busy: false,
        },
        {
          start: '2023-03-21T14:00:00Z',
          end: '2023-03-21T18:00:00Z',
          title: 'Business of Software Conference',
          description: 'Weekly meeting with team',
          busy: false,
        },
        {
          start: '2023-03-21T20:00:00Z',
          end: '2023-03-21T21:50:00Z',
          title: 'Product Team mtg.',
          description: 'Weekly meeting with team',
          busy: false,
        },
        {
          start: '2023-03-21T13:00:00Z',
          end: '2023-03-21T15:00:00Z',
          title: 'Decision Making mtg.',
          description: 'Weekly meeting with team',
          busy: false,
        },
        {
          start: '2023-03-21T13:00:00Z',
          end: '2023-03-21T14:00:00Z',
          title: 'Quick mtg. with Martin',
          description: 'Weekly meeting with team',
          busy: true,
        },
        {
          start: '2023-03-21T07:00:00Z',
          end: '2023-03-21T09:00:00Z',
          title: 'Stakeholder mtg.',
          description: 'Weekly meeting with team',
          busy: true,
        },
        {
          start: '2023-03-21T18:00:00Z',
          end: '2023-03-21T19:30:00Z',
          title: 'Wrapup mtg.',
          description: 'Weekly meeting with team',
          busy: false,
        },
        {
          start: '2023-03-21T14:00:00Z',
          end: '2023-03-21T18:00:00Z',
          title: 'Business of Software Conference',
          description: 'Weekly meeting with team',
          busy: false,
        },
        {
          start: '2023-03-21T20:00:00Z',
          end: '2023-03-21T21:50:00Z',
          title: 'Product Team mtg.',
          description: 'Weekly meeting with team',
          busy: false,
        },
        {
          start: '2023-03-21T13:00:00Z',
          end: '2023-03-21T15:00:00Z',
          title: 'Decision Making mtg.',
          description: 'Weekly meeting with team',
          busy: false,
        },
        {
          start: '2023-03-21T13:00:00Z',
          end: '2023-03-21T14:00:00Z',
          title: 'Quick mtg. with Martin',
          description: 'Weekly meeting with team',
          busy: true,
        },
        {
          start: '2023-03-21T12:00:00Z',
          end: '2023-03-21T16:00:00Z',
          title: 'Team-Building',
          description: 'Weekly meeting with team',
          busy: true,
        },
      ],
      onEventClick: function (event, inst) {
        mobiscroll.toast({
          message: event.event.title,
        });
      },
    });
  },
};
</script>

<style scoped lang="scss">
#agenda {
  display: none;
}
.calendar_wrapper {
  max-width: 360px;
  border-radius: 16px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 90%;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    margin-top: 30px;
  }

  &::-webkit-scrollbar-thumb {
    background: $secondary;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: $secondary;
  }
}
</style>
