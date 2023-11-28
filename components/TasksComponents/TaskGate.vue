<template>
    <div>
        <CreateGateItem class="mb-3" v-for="condition in  conditions" :item="condition"
            @remove="() => onRemoveCondition(condition.type)">
            <div v-for="part in GATE_CONDITION_PARTS_MAP[condition.type] ">
                <div v-if="part === GATE_CONDITION_PARTS.BLOCKCHAIN_SELECT">
                    <GateBlockchainSelect :selected="condition.values.blockchain"
                        @select="(option) => changeConditionValue(condition.id, 'blockchain', option.name)" />
                </div>
                <div v-if="part === GATE_CONDITION_PARTS.NFT_NAME_OR_CONTRACT_ADDRESS">
                    <NFTSelect :chain="condition.values.blockchain" :errors="validationErrors[condition.id]"
                        @change="(value) => changeConditionValue(condition.id, 'contractAddress', value, condition.values.blockchain)" />
                </div>

                <div v-if="part === GATE_CONDITION_PARTS.TOKEN_ID_SELECT">
                    <TokenSelect :errors="validationErrors[condition.id]"
                        @change="(value) => changeConditionValue(condition.id, 'tokenId', value)" />
                </div>
                <div v-if="part === GATE_CONDITION_PARTS.TOKEN_AMOUNT">
                    <TokenAmount :errors="validationErrors[condition.id]"
                        @update:contractAddress="(value) => changeConditionValue(condition.id, 'contractAddress', value, condition.values.blockchain)"
                        :quantity="condition.values.quantity"
                        @update:quantity="(quantity) => changeConditionValue(condition.id, 'quantity', quantity)" />
                </div>
                <div v-if="part === GATE_CONDITION_PARTS.WALLET_ADRESSESS">
                    <WalletAddress :errors="validationErrors[condition.id]"
                        @change="(value) => changeConditionValue(condition.id, 'adressess', value)" />
                </div>
                <div v-if="part === GATE_CONDITION_PARTS.LINK_TO_COMPLETION">
                    <CompletionLink :showTitleInput="true" :link="condition.values?.actionButtonLink"
                        @change:link="(value) => changeConditionValue(condition.id, 'actionButtonLink', value)"
                        :title="condition.values.actionButtonTitle"
                        @change:title="(value) => changeConditionValue(condition.id, 'actionButtonTitle', value)"
                        :errors="validationErrors[condition.id]" />
                </div>
                <div v-if="part === GATE_CONDITION_PREVIEWS.TOKEN_PREVIEW">
                    <TokenPreview :blockchain="condition.values?.blockchain" :tokenAddress="condition.values?.contractAddress"
                        :quantity="condition.values?.quantity"
                        @update:tokenName="value => changeConditionValue(condition.id, 'tokenName', value)" />
                </div>
            </div>
        </CreateGateItem>
        <AddGateConditionSelect v-if="allowedOptions.length" :options="allowedOptions" :onSelect="onAddCondition" />
    </div>
</template>

<script setup>
import { GATE_CONDITION_DATA, GATE_CONDITION_PARTS, GATE_CONDITION_PARTS_MAP, GATE_CONDITION_PREVIEWS } from '../Gate/utils';

const props = defineProps(['conditions', 'onAddCondition', 'onRemoveCondition', 'onConditionValueChanged', 'validationErrors'])

const changeConditionValue = props.onConditionValueChanged

const allowedOptions = computed(() => Object.keys(GATE_CONDITION_DATA).filter(k => !props.conditions.some(t => t.type === k)).map(key => ({ value: key, icon: GATE_CONDITION_DATA[key].icon, name: GATE_CONDITION_DATA[key].label })));
</script>
