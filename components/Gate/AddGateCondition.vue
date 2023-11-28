<template>
    <GateConditionSelect :disabledOptions="disabledOptions" :selected="condition.type" @change="onConditionSelected" />

    <div class="flex flex-col gap-6 item-container mb-6 mt-6">
        <div v-for="part in GATE_CONDITION_PARTS_MAP[condition.type]">
            <div v-if="part === GATE_CONDITION_PARTS.BLOCKCHAIN_SELECT">
                <GateBlockchainSelect :selected="condition.values?.blockchain"
                    @select="(option) => changeConditionValue('blockchain', option.name)" />
            </div>
            <div v-if="part === GATE_CONDITION_PARTS.NFT_NAME_OR_CONTRACT_ADDRESS">
                <NFTSelect :chain="condition.values?.blockchain" :errors="validationErrors"
                    :value="condition.values?.contractAddress"
                    @change="(value) => typeof value === 'string' && changeConditionValue('contractAddress', value)" />
            </div>

            <div v-if="part === GATE_CONDITION_PARTS.TOKEN_ID_SELECT">
                <TokenSelect :errors="validationErrors" :value="condition.values?.tokenId"
                    @change="(value) => changeConditionValue('tokenId', value)" />
            </div>
            <div v-if="part === GATE_CONDITION_PARTS.TOKEN_AMOUNT">
                <TokenAmount :errors="validationErrors" :tokenAddress="condition.values?.contractAddress"
                    @update:contractAddress="(value) => changeConditionValue('contractAddress', value)"
                    :quantity="condition.values?.quantity"
                    @update:quantity="(quantity) => changeConditionValue('quantity', quantity)" />
            </div>
            <div v-if="part === GATE_CONDITION_PARTS.WALLET_ADRESSESS">
                <WalletAddress :errors="validationErrors" :value="condition.values?.adressess"
                    @change="(value) => changeConditionValue('adressess', value)" />
            </div>
            <div v-if="part === GATE_CONDITION_PARTS.LINK_TO_COMPLETION">
                <CompletionLink :link="condition.values?.actionButtonLink"
                    @change:link="(value) => changeConditionValue('actionButtonLink', value)" :errors="validationErrors" />
            </div>
            <div v-if="part === GATE_CONDITION_PREVIEWS.TOKEN_PREVIEW">
                <TokenPreview :blockchain="condition.values?.blockchain" :tokenAddress="condition.values?.contractAddress"
                    :quantity="condition.values?.quantity"
                    @update:tokenName="value => changeConditionValue('tokenName', value)" />
            </div>
            <div v-if="part === GATE_CONDITION_PREVIEWS.NFT_PREVIEW">
                <NFTPreview :bordered="true" :blockchain="condition.values?.blockchain" :contractAddress="condition.values?.contractAddress"
                    :tokenId="condition.values?.tokenId" @update:nfName="value => changeConditionValue('nftName', value)"
                    @update:imgUrl="value => changeConditionValue('imgUrl', value)" />
            </div>
        </div>
    </div>
    <div class="flex gap-6">
        <base-button type="secondary" text="Cancel" @click="handleClose">Cancel</base-button>

        <base-button type="normal" text="Add Condition" @click="handleSave" :loading="isLoading" />
    </div>
</template>

<script setup>
import { GATE_CONDITION_PARTS_MAP, GATE_CONDITION_PARTS, GATE_CONDITION_PREVIEWS, GATE_CONDITIONS } from './utils'
import { validateByKey } from './validate'
import { getConditionDefaultValues } from './utils'

const props = defineProps(["project", "onSave", "availableOptions"]);
const emit = defineEmits(['close', 'add'])

const isLoading = ref(false);
const condition = ref({ type: props.availableOptions[0], values: getConditionDefaultValues(props.availableOptions[0]) })
const disabledOptions = ref(Object.values(GATE_CONDITIONS).filter(k => !props.availableOptions.some(o => o === k)))

const handleClose = () => {
    emit('close')
}

const onConditionSelected = ({ value }) => {
    condition.value = { type: value, values: getConditionDefaultValues(value) }
}

const validationErrors = ref(Object.keys(condition.value.values).reduce((res, key) => ({ ...res, [key]: { isError: false, errorText: '' } }), {}))

const changeConditionValue = (key, value) => {
    revalidate(key, value, condition.value.values)
    condition.value.values[key] = value
}

const handleSave = () => {
    if (validateValues()) {
        isLoading.value = true
        return props.onSave && props.onSave(condition.value)?.finally(() => {
            isLoading.value = false
        })
    }
}

const validateValues = () => {
    return (Object.keys(condition.value.values)).map((key) => {
        const value = condition.value.values[key];
        const res = validateByKey(key, value, condition.value.values)

        if (typeof res !== 'boolean') {
            const errorMsg = res
            setError(key, errorMsg)

            return false
        }
        return res

    }).every(v => v === true)

}

const setError = (key, error) => {
    validationErrors.value[key] = {
        isError: true,
        errorText: error
    }
}

const clearError = (key) => {
    validationErrors.value[key] = {
        isError: false,
        errorText: ""
    }
}

const revalidate = (key, value, options) => {
    const validationRes = validateByKey(key, value, options)
    if (typeof validationRes !== 'boolean') {
        setError(key, validationRes)
    } else if (validationRes) {
        clearError(key)
    }
}


</script>

<style scoped lang="scss">
.title {
    font-family: 'Basis Grotesque Pro';
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
}
</style>