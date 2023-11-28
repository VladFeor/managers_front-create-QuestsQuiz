<template>
  <div class="balance">
    <div class="title">
      <div>
        <span>Current Balance</span>
        <TooltipIcon tooltipText="Total earnings on the platform" />
      </div>
      <!-- <div><span>Current Balance</span> <Icon icon="Info-1px" :size="24"></Icon></div> -->
      <Icon icon="Usdt" :size="24"></Icon>
    </div>
    <div class="amount" :class="{ 'empty-balance': newBalance == 0 }">~{{ newBalance }} USDT</div>
    <!--    <ButtonDark-->
    <!--      v-if="isSuperAdmin || isCatapultManager"-->
    <!--      text="Inner Wallet"-->
    <!--      icon="Wallet"-->
    <!--      @click="router.push(`/inner-wallet/${1 + 1}`)"-->
    <!--    ></ButtonDark>-->
  </div>
</template>

<script setup>
import { useUserStore } from '~/store/user';
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();
const props = defineProps({
  balance: String,
});

const roles = inject('roles');

const { isSuperAdmin, isCatapultManager } = roles;
const newBalance = computed(() => {
  let num = props.balance;
  let splitNum = num.toString().split('.');
  if (splitNum[1] && splitNum[1].length > 4) {
    return parseFloat(num.toFixed(4));
  } else {
    return num;
  }
});
</script>

<style scoped lang="scss">
.balance {
  width: 360px;
  max-height: 184px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  display: flex;
  gap: 16px;
  flex-direction: column;
  padding: 16px;
  font-family: 'Basis Grotesque Pro';
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
    }
    span {
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      font-feature-settings: 'zero' on;
      color: $secondary;
      margin-right: 10px;
    }
  }
  .amount {
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;
    font-feature-settings: 'zero' on;
    color: $section-title;
  }
  .empty-balance {
    color: $secondary;
  }
}
</style>
