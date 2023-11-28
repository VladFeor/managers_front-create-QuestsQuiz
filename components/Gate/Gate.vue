<template>
  <ContentBox
    class="h-auto w-full mt-6 p-4 bg-white gates-container"
    :class="{ gatesIsOpen: open && !visible }"
  >
    <div class="gate-name_wrapper">
      <div class="flex gap-1">
        <h5 class="font-medium text-[#6A6D8F] text-lg leading-6">Gates</h5>
        <TooltipIcon
          tooltipText="Gate is rules you set that determine who can access your project. To pass a gate, the talent must meet the conditions you specify below."
        />
        <span @click="toggle" v-if="!visible" :class="{ gatesIsOpen: open }" class="arrow"></span>
      </div>
      <div v-if="gateStore.conditions.length">
        <div class="gate-condition-select" ref="selectContainer">
          <div
            class="selected"
            :class="{ open: gateConditionSelectOpened }"
            @click="toggleConditionTypeSelect"
          >
            {{ selectedGateConditionOption.name }}
            <span class="arrow" :class="{ flipped: gateConditionSelectOpened }"></span>
          </div>
          <div class="items" :class="{ selectHide: !gateConditionSelectOpened }">
            <div
              v-for="(option, i) in gateConditionOptions"
              :key="i"
              @click.stop="onConditionTypeSelect(option)"
            >
              {{ option.name }}
              <Icon
                v-if="selectedGateConditionOption.id === option.id"
                name="Tik"
                :size="20"
                color="#38405B"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProjectGate v-if="gateStore.conditions.length" :project="project"/>

    <div class="empty-gate" v-else>
      <ProjectGateEmpty />
      <button
        type="button"
        @click="visible = true"
        class="w-[138px] h-8 px-2 py-[4px] bg-orange-500 rounded-lg flex justify-between items-center gap-2 mt-6"
      >
        <div class="justify-between items-start gap-[10px] flex w-[100%]">
          <div class="text-white text-[14px] font-medium leading-tight">Create a Gate</div>
          <img src="@/assets/icons/create-white.svg" height="24" />
        </div>
      </button>
    </div>
  </ContentBox>
  <ScrollContainerBaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    @close="handleClose($event)"
    :visible="visible"
    btnLeft
    @openConfirmationModal="isConfirmModalOpen = true"
    isConfirm
  >
    <CreateGate :project="project" @close="handleClose(false)" />
  </ScrollContainerBaseModal>
  <BaseModal
    isCloseBtnInvisible
    :width="480"
    @close="handleCloseConfirm($event)"
    :visible="isConfirmModalOpen"
  >
    <div class="confirm-modal">
      <div class="confirm-modal_title">Rejection of the Gate Creation</div>
      <div class="confirm-modal_subtitle">
        Confirm that this decision if you dont want to complete the creation
      </div>

      <div class="confirm-modal_btns-wrapper">
        <BaseButton text="Cancel" type="secondary" @click="handleCloseConfirm(false)" />
        <BaseButton
          text="Reject"
          type="normal"
          @click="
            handleCloseConfirm(false);
            handleClose(false);
          "
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { useGateStore } from '~/store';

const props = defineProps(['project']);
const gateStore = useGateStore();

const roles = inject('roles') || {};
const { isSuperAdmin, isProjectOwner } = roles;

const visible = ref(false);
const open = ref(true);
const isConfirmModalOpen = ref(false);

const handleClose = (value) => {
  visible.value = value;
};

const handleCloseConfirm = (value) => {
  isConfirmModalOpen.value = value;
};

const gateConditionOptions = computed(() => [
  { name: 'Any Conditions', id: 1 },
  { name: 'All Conditions', id: 0 },
]);

const selectedGateConditionOption = ref(
  gateConditionOptions.value.find((condition) => condition.id === props.project.any) ||
    gateConditionOptions.value[0],
);
const gateConditionSelectOpened = ref(false);

const toggleConditionTypeSelect = () => {
  gateConditionSelectOpened.value = !gateConditionSelectOpened.value;
};

const toggle = () => {
  open.value = !open.value;
};

const onConditionTypeSelect = (option) => {
  selectedGateConditionOption.value = option;
  toggleConditionTypeSelect();
  gateStore.changeGateType(props.project.id, option.id);
};
</script>

<style scoped lang="scss">
.gate-name_wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  padding: 0 40px 16px 0;
}

.gate-condition-select {
  position: relative;
  width: fit-content;
  height: 32px;
  text-align: left;
  outline: none;
  z-index: 1000;

  .selected {
    background: #F5F5FD;
    border: 1px solid #EAEAFB;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.7;
    padding: 4px 8px;
    width: 140px;
    height: 32px;
    color: #38405b;

    &:after {
      position: absolute;
      content: '';
      top: 12px;
      right: 1em;
      width: 12px;
      height: 7px;
      border: none;
    }

    &.open {
      background: $white;
      border: 1px solid $default-badge-border;
      cursor: pointer;
      user-select: none;
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.7;
      color: $default;
      box-shadow: 0 0 0 3px $default-border;
    }
  }

  .arrow {
    position: absolute;
    content: '';
    top: 12px;
    right: 0.5rem;
    width: 12px;
    height: 7px;
    border: none;
    transition: transform 0.2s;
    background: url('@/assets/images/select.svg');
    background-repeat: no-repeat;
    background-size: 12px 7px;

    &.flipped {
      transform: rotate(180deg);
    }
  }

  .items {
    background: $white;
    cursor: pointer;
    user-select: none;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    border-radius: 8px;
    margin-top: 10px;
    padding: 4px 8px;
    line-height: 20px;
    color: $default;
    max-height: 250px;
    overflow: auto;
    border: 1px solid $default-badge-border;
    position: absolute;

    right: 0;
    z-index: 11;
    width: 160px;

    > div {
      padding: 5px 8px;
      display: flex;
      justify-content: space-between;
      border-radius: 8px;
      &:hover {
        background: $default-badge-border;
      }
    }

    &.selectHide {
      display: none;
    }
  }
}

.confirm-modal {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 32px;
  gap: 24px;

  &_title {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
    color: $section-title;
  }

  &_subtitle {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
  }

  &_btns-wrapper {
    width: 100%;
    display: flex;
    gap: 24px;
  }
}
.gates-container {
  transition: height 0.5s;

  height: 62px;
  .project-gate,
  .empty-gate {
    display: none;
  }
}
.gates-container.gatesIsOpen {
  height: fit-content;
  min-height: 40px;

  .project-gate,
  .empty-gate {
    display: block;
  }
}
.arrow {
  position: absolute;
  cursor: pointer;
  top: 12px;
  right: 1em;
  width: 12px;
  height: 7px;
  border: none;
  transition: transform 0.2s;
  background: url('@/assets/images/select.svg');
  background-position-y: center;
  background-repeat: no-repeat;
  transform: rotate(0);
}
.arrow.gatesIsOpen {
  transform: rotate(180deg);
}
.tooltip-checkbox {
  z-index: 999999;
}
</style>
