<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ScrollList",
};
</script>

<style scoped lang="scss">
.container {
  padding-right: 9px;
  overflow: scroll;
  height: 360px;
}
/* width */
::-webkit-scrollbar {
  width: 6px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: $secondary;
  border-radius: 4px;
}

</style>