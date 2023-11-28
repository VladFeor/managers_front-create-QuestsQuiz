<template>
  <div class="horizontal-stepper">
    <div
      class="step"
      v-for="(step, index) in steps"
      :key="index"
      :class="{ 'current-step': currentStep === index, 'completed-step': currentStep > index }"
    >
      <div class="step-circle">
        <span class="step-number"></span>
        <div v-if="currentStep === index" class="step-ring"></div>
      </div>
      <div v-if="index < steps.length - 1" class="step-line-container">
        <div class="step-line"></div>
      </div>
      <div class="step-title">{{ step.title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      required: true,
    },
    currentStep: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.horizontal-stepper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.step {
  display: flex;
  flex-direction: column; // Изменено на column для размещения заголовка под шагом
  align-items: center;
  position: relative;
}

.step-circle {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background: $default-border;
}

.current-step .step-number,
.completed-step .step-number {
  background: $dot_bg;
}
.current-step .step-title {
  color: $default;
}
.step-ring {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid $orange;
  background: $default-bg;
  z-index: -1;
}

.step-line-container {
  flex: 1;
  height: 2px;
  position: relative;
}

.step-line {
  position: absolute;
  left: 0;
  bottom: 3px;
  transform: translateY(-50%);
  width: calc(520px / 2);
  height: 1px;
  background-color: $default-border;
  z-index: 0;
}

.step:nth-child(1) .step-line,
.completed-step + .current-step .step-line,
.completed-step .step-line {
  background-color: $dot_bg;
}

.step-title {
  margin-top: 12px; // Отступ сверху для разделения заголовка и шага
  text-align: center; // Выравнивание текста по центру
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
  color: #aaa7cc;
}
</style>
