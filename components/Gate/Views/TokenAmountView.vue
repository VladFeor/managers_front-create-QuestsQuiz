

<template>
    <div v-if="tokenName && blockchain" class="token-view">
        <div class="token-chain">
            <Blockchain :size="24" :name="blockchain" />
            {{ blockchain }}
        </div>
        <div class="token-name">
            {{ quantity || 0 }} {{ tokenName }}
        </div>
    </div>
    <div v-else-if="contractAddress" class="value">{{ contractAddress }}</div>
</template>

<script setup>
const props = defineProps(['contractAddress', 'quantity', 'tokenName', 'blockchain'])
</script>

<style scoped lang="scss">
.token-view {
    display: flex;

    justify-content: space-between;
    align-items: center;

    .token-chain {
        display: flex;
        gap: 4px;
        background: linear-gradient(0deg, #DAD9F7, #DAD9F7), linear-gradient(0deg, #EAEAFB, #EAEAFB);
        border: 1px solid rgba(218, 217, 247, 1);
        padding: 2px 8px 2px 4px;
        border-radius: 6px;
        border: 1px;
        align-items: center;

        //styleName: Label;
        font-family: Basis Grotesque Pro;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.014em;
        text-align: left;
        color: #38405B;
    }

    .token-name {

        color: rgba(26, 29, 41, 1);
        //styleName: Text Light;
        font-family: Basis Grotesque Pro;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0em;
        text-align: left;

    }
}
</style>