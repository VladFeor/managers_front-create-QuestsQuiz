<template>
  <div :class="[type]">
    <img
      v-if="type === 'pending' || type === 'canceled'"
      :src="type === 'pending' ? pendingIcon : canceledIcon"
      alt="status icon"
    />
    <Icon
      v-else
      class="wallet-icon-color"
      :name="type === 'executed' ? 'Tik' : 'Cancel'"
      :size="16"
    />
    <span>
      {{ text === 'canceled' ? 'Declined' : text[0].toUpperCase() + text.slice(1) }}
    </span>
  </div>
</template>

<script setup>
import pendingIcon from '@/assets/icons/wallet/pending-icon.svg';
import canceledIcon from '@/assets/icons/wallet/canceled-icon.svg';
const props = defineProps({
  type: { type: String, default: 'pending' },
  text: { type: String, default: 'pending' },
});
</script>

<style lang="scss" scoped>
.wallet-icon-color {
  filter: invert(41%) sepia(83%) saturate(3109%) hue-rotate(94deg) brightness(87%) contrast(77%);
}
.pending {
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 8px;
  border: 1px solid $default-border;
  background: $white;
  padding: 2px 8px;

  span {
    font-family: Basis Grotesque Pro;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.168px;
    color: $default;
  }
}
.executed {
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 8px;
  border: 1px solid #bce0bc;
  background: $white;
  padding: 2px 8px;

  span {
    font-family: Basis Grotesque Pro;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.168px;
    color: #1d8f1d;
  }
}
.failed {
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 8px;
  border: 1px solid #ffc0b7;
  background: $white;
  padding: 2px 8px;
  .wallet-icon-color {
    filter: invert(23%) sepia(97%) saturate(1814%) hue-rotate(349deg) brightness(90%) contrast(102%);
  }
  span {
    font-family: Basis Grotesque Pro;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.168px;
    color: #cc2d14;
  }
}
.canceled {
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 8px;
  border: 1px solid #ffb580;
  background: $white;
  padding: 2px 8px;

  span {
    font-family: Basis Grotesque Pro;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.168px;
    color: #fc660c;
  }
}
</style>
