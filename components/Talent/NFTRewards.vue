<template>
  <div class="nft-container">
    <div class="header">
      <span>NFT Rewards</span>
      <!--      <Select :options="options" class="select"></Select>-->
    </div>
    <!--    <div class="list">-->
    <!--        <NFT v-for="i in 6" class="w-4/12" :key="i"></NFT>-->
    <!--    </div>-->
    <div class="empty-list">
      <icon icon="icons8-futurama-nibbler-zero" :size="48"></icon>
      <span>There’s no reward yet</span>
    </div>
  </div>
</template>

<script>
import Select from '../Select/Select';
export default {
  name: 'NFTRewards',
  components: { Select },
  data() {
    return {
      options: [
        {
          id: 1,
          name: '123',
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.nft-container {
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  padding: 16px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-feature-settings: 'zero' on;
  width: 360px;
  height: 184px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      font-feature-settings: 'zero' on;
      color: $secondary;
    }
    .select {
      width: 105px;
    }
  }
  .list {
    margin-top: 24px;
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .empty-list {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    margin-top: 24px;
    padding: 2px 0px 20px;
    * {
      margin: auto;
    }
    span {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: $colabs-bg;
    }
  }
}
</style>
