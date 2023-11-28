<template>
  <ContentBox
    class="min-h-[120px] max-w-[360px] h-auto w-full p-4 bg-white relative"
    v-if="
      (project.pool_amount && project.coin_type) ||
      (project.coin_type && isProjectOwner) ||
      isSuperAdmin
    "
  >
    <div class="pool-name_wrapper">
      <h5 class="font-medium text-[#6A6D8F] text-lg leading-6">Pool</h5>
      <TooltipIcon
        tooltipText="The amount of funds intended to be spent on collaboration with Talents"
      />
    </div>
    <div class="mt-3 flex w-full">
      <Coin
        v-if="project && project.coin_type"
        :large="true"
        :name="`${project.coin_type.symbol}-Default`"
        :size="40"
      />

      <div
        v-if="!isPoolInputActive"
        data-parent-id="parent-coin-reward"
        class="ml-3 slashed-zero text-[#AAA7CC] text-[32px] font-normal leading-10 uppercase border-b-2 border-dashed"
        @click="setIsPoolInputActive(true)"
      >
        {{ project.pool_amount }} {{ project.coin_type?.symbol }}
      </div>

      <div
        class="text-[32px] text-[#38405B] font-normal leading-10 border-b-1 border-dashed flex ml-3 w-[calc(100%-55px)]"
        v-if="isPoolInputActive && (isProjectOwner || isSuperAdmin)"
      >
        <CoinRewardSelect
          is-full
          v-if="coins && coins.length > 0"
          :coin-id="project.coin_type?.id"
          :amount="project.pool_amount"
          :options="coins"
          @amountChange="setPoolAmount"
          @input="setCoinId"
          @outside="setIsPoolInputActive(false)"
        />
      </div>
    </div>
    <div
      @click="goToInnerWallet"
      v-if="isSuperAdmin || isProjectOwner"
      class="cursor-pointer w-36 mt-6 h-10 px-[12px] pt-[6px] pb-2 bg-violet-200 rounded-lg justify-center items-center gap-2 inline-flex"
    >
      <div class="text-slate-700 text-[16px] font-medium leading-normal">Inner Wallet</div>
      <Icon :size="24" name="Wallet"></Icon>
    </div>
    <div
      class="cursor-pointer w-8 h-8 p-2 hover:bg-violet-50 rounded-md justify-start items-center gap-2 inline-flex absolute top-2 right-2"
      @mouseover="hoverVisible = true"
      @mouseleave="hoverVisible = false"
      @click="updatePoolVisible"
    >
      <img
        v-if="isVisibleForOthers"
        class="w-4 h-4 relative"
        src="@/assets/icons/eye-black.svg"
        alt="is visible for others"
      />
      <img
        v-else
        class="w-4 h-4 relative"
        src="@/assets/icons/eye-block.svg"
        alt="is visible for others"
      />

      <div
        v-if="hoverVisible && isVisibleForOthers"
        class="absolute -bottom-14 -left-22 w-40 h-10 p-2 bg-slate-700 rounded-lg shadow flex-col justify-start items-start gap-2 inline-flex"
      >
        <div class="self-stretch justify-start items-start gap-2 inline-flex">
          <div
            class="grow shrink basis-0 text-white text-[12px] font-medium leading-none tracking-wide"
          >
            Block is visible for others. Press to hide it.
          </div>
        </div>
      </div>
    </div>
  </ContentBox>
</template>

<script setup>
const props = defineProps(['project', 'coins']);
const emits = defineEmits(['update']);
const roles = inject('roles');
const { isSuperAdmin, isProjectOwner } = roles;
const isPoolInputActive = ref(false);
const isVisibleForOthers = ref(1);
const hoverVisible = ref(false);
const setPoolAmount = (value) => {
  emits('update', { key: 'pool_amount', value: value });
};
const setCoinId = (value) => {
  emits('updateCoinId', { key: 'coin_type_id', value: value });
};
const goToInnerWallet = () => {
  location.replace(`/inner-wallet/${props.project.id}`);
};

const updatePoolVisible = () => {
  if (isSuperAdmin.value || isProjectOwner.value) {
    isVisibleForOthers.value = isVisibleForOthers.value > 0 ? 0 : 1;
    emits('update', { key: 'pool_visible', value: isVisibleForOthers.value });
  }
};

const setIsPoolInputActive = (value) => {
  if (isSuperAdmin.value || isProjectOwner.value) {
    isPoolInputActive.value = value;
  }
};

watch(
  props.project,
  (newV) => {
    if (newV.id) {
      isVisibleForOthers.value = newV.pool_visible;
    }
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.pool-name_wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
