<template>
  <div class="tabs_wrapper">
    <Tabs>
      <Tab title="Days">
        <Calendar />
      </Tab>
      <Tab title="List">
        <scroll-list class="margin-top">
          <event-item v-for="i in 15" :key="i + 'a'"></event-item>
        </scroll-list>
      </Tab>
      <!-- <Tab title="List">
        <EventCalendar />
      </Tab> -->
    </Tabs>
  </div>
</template>

<script>
export default {
  name: 'CalendarList',
};
</script>

<style scoped lang="scss">
.tabs_wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 360px;
  height: 100%;
  max-height: 440px;
  overflow: hidden;
  border-radius: 16px;
}
.margin-top {
  margin-top: 20px;
}
</style>
