<template>
  <div class="animated-background">
    <div
        v-for="(rectangle, index) in rectangles"
        :key="index"
        class="rectangle"
        :style="{ background: rectangle.color }"
        :class="getBlockDirectionClass(index)"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'AnimatedBackground',

  data() {
    return {
      rectangles: [
        { color: 'linear-gradient(90deg, #DAD9F7 0%, rgba(218, 217, 247, 0) 100%)' },
        { color: 'linear-gradient(90deg, #DAD9F7 0%, rgba(218, 217, 247, 0) 100%)' },
        { color: 'linear-gradient(90deg, #DAD9F7 0%, rgba(218, 217, 247, 0) 100%)' },
        { color: 'linear-gradient(90deg, #DAD9F7 0%, rgba(218, 217, 247, 0) 100%)' },
        { color: 'linear-gradient(90deg, #DAD9F7 0%, rgba(218, 217, 247, 0) 100%)' },
      ],
    };
  },
  methods: {
    getBlockDirectionClass(index) {
      const isDown = [0, 2, 3].includes(index);
      return isDown ? 'move-down' : 'move-up';
    },
  },
};
</script>

<style lang="scss">
.animated-background {
  display: flex;
  position: absolute;
  height: 100%;
  width: 100vw;
  overflow: hidden;
  animation: colorChange 8s ease-in-out infinite;

  .rectangle {
    flex: 0 0 25%;
    height: 100%;
    background: linear-gradient(90deg, $default-border 0%, rgba(218, 217, 247, 0) 100%);
    position: relative;

    &:not(:last-child) {
      margin-right: -4%; // Добавляем отрицательный отступ справа для всех блоков, кроме последнего
    }

    &:nth-child(odd) {
      z-index: 2; // Устанавливаем z-index для нечетных блоков
    }

    &:nth-child(even) {
      z-index: 1; // Устанавливаем z-index для четных блоков
    }
  }

  .move-down {
    animation: moveDown 8s ease-in-out infinite;
  }

  .move-up {
    animation: moveUp 8s ease-in-out infinite;
  }

  .rectangle:nth-child(4) {
    margin-top: 10%;
  }
  .rectangle:nth-child(3) {
    margin-top: 0%;
  }

  .rectangle:nth-child(1) {
    margin-top: 0%;
  }

  .rectangle:nth-child(2) {
    margin-top: -10%;
  }
  .rectangle:nth-child(5) {
    margin-top: -5%;
  }
}

@keyframes moveDown {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(25vh);
  }
}

@keyframes moveUp {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25vh);
  }
}

@keyframes colorChange {
  0%,
  100% {
    background: $secondary;
  }
  50% {
    background: $default;
  }
}
</style>
