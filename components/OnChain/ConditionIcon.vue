<template>
    <Blockchain v-if="isBlockchainIcon" :name="getChainIcon(conditionValues?.blockchain)" :size="40" />
    <div v-else>
        <img v-if="condition?.name === ON_CHAIN_CONDITIONS.USER_HOLDS_POAP" src="@/assets/icons/poap.svg" />
        <img v-else-if="condition?.name === ON_CHAIN_CONDITIONS.USER_HOLDS_NFT" src="@/assets/icons/nft_round.svg" />
    </div>
</template>

<script setup>
import { getConditionValues, getChainIcon, ON_CHAIN_CONDITIONS } from './utils';

const props = defineProps(['condition'])
const isBlockchainIcon = computed(() => !(props?.condition?.name === ON_CHAIN_CONDITIONS.USER_HOLDS_NFT || props?.condition?.name === ON_CHAIN_CONDITIONS.USER_HOLDS_POAP))

const conditionValues = getConditionValues(props.condition)

</script>