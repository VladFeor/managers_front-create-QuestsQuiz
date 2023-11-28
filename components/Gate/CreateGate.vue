<template>
    <div class="p-10">
        <div class="flex justify-between items-center">
            <h3 class="font-normal text-[32px] leading-10 text-[#1A1D29] h-10">Create a Gate</h3>
        </div>
        <div class="mt-10 mb-8">
            <p class="font-medium text-base leading-6 text-[#1A1D29]">Gate is rules you set that determine who can
                access your project.
                To pass a gate, the talent must meet the conditions you specify below.
            </p>
        </div>
        <div class="section_wrapper mb-8">
            <div class="section_wrapper-title">
                <h3 class="font-normal text-[32px] leading-10 text-[#1A1D29] h-10">Conditions</h3>
                <div class="custom-condition-select" :tabindex="tabindex" ref="selectContainer">
                    <div class="selected" :class="{ open: gateConditionSelectOpened }" @click="toggleConditionTypeSelect">
                        {{ seletedGateConditionOption.name }}
                        <span class="arrow" :class="{ flipped: gateConditionSelectOpened }"></span>
                    </div>
                    <div class="items" :class="{ selectHide: !gateConditionSelectOpened }">
                        <div v-for="(option, i) in gateConditionOptions" :key="i"
                            @click.stop="onConditionTypeSelect(option)">
                            {{ option.name }}
                            <Icon v-if="seletedGateConditionOption.id === option.id" name="Tik" :size="20"
                                color="#38405B" />
                        </div>
                    </div>

                </div>

            </div>
            <p class="section_wrapper-subtitle">Choose whether <span class="color-black">all</span> the conditions must be
                met, or if <span class="color-black">any</span> of them is sufficient</p>
        </div>

        <div class="flex flex-col gap-2 item-container">
            <CreateGateItem v-for="condition in  conditions " :item="condition" :toggle="toggle">
                <div v-for="part in GATE_CONDITION_PARTS_MAP[condition.id] ">
                    <div v-if="part === GATE_CONDITION_PARTS.BLOCKCHAIN_SELECT">
                        <GateBlockchainSelect :selected="condition.values.blockchain"
                            @select="(option) => changeGateValue(condition.id, 'blockchain', option.name)" />
                    </div>
                    <div v-if="part === GATE_CONDITION_PARTS.NFT_NAME_OR_CONTRACT_ADDRESS">
                        <NFTSelect :chain="condition.values.blockchain" :errors="validationErrors[condition.id]"
                            @change="(value) => changeGateValue(condition.id, 'contractAddress', value, condition.values.blockchain)" />
                    </div>

                    <div v-if="part === GATE_CONDITION_PARTS.TOKEN_ID_SELECT">
                        <TokenSelect :errors="validationErrors[condition.id]"
                            @change="(value) => changeGateValue(condition.id, 'tokenId', value)" />
                    </div>
                    <div v-if="part === GATE_CONDITION_PARTS.TOKEN_AMOUNT">
                        <TokenAmount :errors="validationErrors[condition.id]" :blockchain="condition.values.blockchain"
                            @update:contractAddress="(value) => changeGateValue(condition.id, 'contractAddress', value, condition.values.blockchain)"
                            :quantity="condition.values.quantity"
                            @update:quantity="(quantity) => changeGateValue(condition.id, 'quantity', quantity)" />
                    </div>
                    <div v-if="part === GATE_CONDITION_PARTS.WALLET_ADRESSESS">
                        <WalletAddress :errors="validationErrors[condition.id]"
                            @change="(value) => changeGateValue(condition.id, 'adressess', value)" />
                    </div>
                    <div v-if="part === GATE_CONDITION_PARTS.LINK_TO_COMPLETION">
                        <CompletionLink :link="condition.values?.actionButtonLink"
                            @change:link="(value) => changeGateValue(condition.id, 'actionButtonLink', value)"
                            :errors="validationErrors[condition.id]" />
                    </div>
                    <div v-if="part === GATE_CONDITION_PREVIEWS.TOKEN_PREVIEW">
                        <TokenPreview :blockchain="condition.values.blockchain"
                            :tokenAddress="condition.values.contractAddress" :quantity="condition.values.quantity"
                            @update:tokenName="value => changeGateValue(condition.id, 'tokenName', value)" />
                    </div>
                    <div v-if="part === GATE_CONDITION_PREVIEWS.NFT_PREVIEW">
                        <NFTPreview :bordered="true" :blockchain="condition.values?.blockchain"
                            :contractAddress="condition.values?.contractAddress" :tokenId="condition.values?.tokenId"
                            @update:nfName="value => changeGateValue(condition.id, 'nftName', value)"
                            @update:imgUrl="value => changeGateValue(condition.id, 'imgUrl', value)" />
                    </div>
                </div>
            </CreateGateItem>

        </div>
        <div class="w-full mt-[88px]">
            <FeedbackTooltip :tooltipText="'First define at least one condition'" :active="showAtLeastOneTooltip">
                <button :disabled="isLoading" type="button"
                    class="font-medium text-base leading-6 bg-[#FC660C] w-full h-10 rounded-lg text-white flex items-center justify-center"
                    @click="createNewGate">
                    Create a Gate
                </button>
            </FeedbackTooltip>
        </div>
    </div>
</template>
  
<script setup>
import { useGateStore } from "~/store";
import { GATE_CONDITIONS, GATE_CONDITION_DATA, GATE_CONDITION_PARTS, GATE_CONDITION_PREVIEWS, GATE_CONDITION_PARTS_MAP, getConditionDefaultValues } from './utils'
import { validateByKey } from './validate'

const props = defineProps(['project'])
const emit = defineEmits(['close'])
const nuxtApp = useNuxtApp();

const gateConditionOptions = computed(() => [
    { name: 'Any', id: 'any' },
    { name: 'All', id: 'all' },
])

const seletedGateConditionOption = ref(gateConditionOptions.value[0])
const gateConditionSelectOpened = ref(false)

const toggleConditionTypeSelect = () => {
    gateConditionSelectOpened.value = !gateConditionSelectOpened.value
}

const onConditionTypeSelect = (option) => {
    seletedGateConditionOption.value = option
    toggleConditionTypeSelect()
}


const isLoading = ref(false);


const conditions = ref([

    {
        id: GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION,
        icon: GATE_CONDITION_DATA[GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION].icon,
        title: GATE_CONDITION_DATA[GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION].label,
        active: false,
        values: getConditionDefaultValues(GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION)
    },
    {
        id: GATE_CONDITIONS.SPECIFIC_NFT_FROM_COLLECTION,
        icon: GATE_CONDITION_DATA[GATE_CONDITIONS.SPECIFIC_NFT_FROM_COLLECTION].icon,
        title: GATE_CONDITION_DATA[GATE_CONDITIONS.SPECIFIC_NFT_FROM_COLLECTION].label,
        active: false,
        values: getConditionDefaultValues(GATE_CONDITIONS.SPECIFIC_NFT_FROM_COLLECTION)


    },
    {
        id: GATE_CONDITIONS.MINIMUN_AMOUNT_OF_TOKEN,
        icon: GATE_CONDITION_DATA[GATE_CONDITIONS.MINIMUN_AMOUNT_OF_TOKEN].icon,
        title: GATE_CONDITION_DATA[GATE_CONDITIONS.MINIMUN_AMOUNT_OF_TOKEN].label,
        active: false,
        values: getConditionDefaultValues(GATE_CONDITIONS.MINIMUN_AMOUNT_OF_TOKEN)
    },
    {
        id: GATE_CONDITIONS.WHITELIST_OF_WALLET_ADRESSESS,
        icon: GATE_CONDITION_DATA[GATE_CONDITIONS.WHITELIST_OF_WALLET_ADRESSESS].icon,
        title: GATE_CONDITION_DATA[GATE_CONDITIONS.WHITELIST_OF_WALLET_ADRESSESS].label,
        active: false,
        values: getConditionDefaultValues(GATE_CONDITIONS.WHITELIST_OF_WALLET_ADRESSESS)

    },
])

const showAtLeastOneTooltip = ref(false);

const validationErrors = ref(conditions.value.reduce((result, currentGate) => {

    const id = currentGate.id;

    return {
        ...result, [id]: Object.keys(currentGate.values).reduce((res, key) => ({ ...res, [key]: { isError: false, errorText: "" } }), {})
    }
}, {}))


const gateStore = useGateStore();

const toggle = (id, val) => {
    showAtLeastOneTooltip.value = false
    conditions.value = conditions.value.map(g => g.id === id ? ({ ...g, active: val }) : g)
    clearErrors(id)
    clearValues(id)
}

const revalidate = (gateId, key, value, options) => {
    const validationRes = validateByKey(key, value, options)
    if (typeof validationRes !== 'boolean') {
        setError(gateId, key, validationRes)
    } else if (validationRes) {
        clearError(gateId, key)
    }
}


const changeGateValue = (id, key, value, values) => {
    if (typeof value === 'string') {
        revalidate(id, key, value, values)
        conditions.value = conditions.value.map(g => g.id === id ? ({
            ...g, values: { ...g.values, [key]: value }
        }) : g)
    }
}

const setError = (gateId, key, error) => {
    validationErrors.value[gateId][key] = {
        isError: true,
        errorText: error
    }
}

const clearErrors = (id) => {
    Object.keys(validationErrors.value[id]).forEach(key => clearError(id, key))
}

const clearError = (id, key,) => {
    validationErrors.value[id][key] = {
        isError: false,
        errorText: ""
    }
}

const clearValues= (id) => {
    conditions.value= conditions.value.map(g => g.id === id ? ({
            ...g, values: getConditionDefaultValues(id)
        }) : g)
}

/// VALIDATE
const validateGateValues = (gate) => {
    return Object.keys(gate.values).map((key) => {
        const value = gate.values[key];
        const res = validateByKey(key, value, gate.values)

        if (typeof res !== 'boolean') {
            const errorMsg = res
            setError(gate.id, key, errorMsg)

            return false
        }

        return res

    }).every(v => v === true)
}


const createNewGate = async () => {
    const activeConditions = conditions.value.filter(g => g.active)

    if (!activeConditions.length) {
        showAtLeastOneTooltip.value = true
        return
    }
    const validated = activeConditions.map(validateGateValues).every(res => res === true)

    if (!validated) {
        return
    }
    isLoading.value = true

    await gateStore.createGateAction(props.project.id, seletedGateConditionOption.value.id, activeConditions).then((res) => {
        if (res) {
            nuxtApp.$alert.show('A new condition has been added to the gate', {
                type: 'success',
                timeout: 5000,
            });

            emit('close')
        } else {
            nuxtApp.$alert.show('Internal server error', {
                type: 'error',
                timeout: 5000,
            });
        }
    }).catch(err => {
        console.log('ERR', err)
    }).finally(() => {
        isLoading.value = false
    })
}

</script>
  
<style lang="scss">
.name {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
    margin-bottom: 8px;
}

.custom-condition-select {
    position: relative;
    width: fit-content;
    height: 32px;
    text-align: left;
    outline: none;
    z-index: 1000;
}

.custom-condition-select .selected {
    background: $default-border;
    border: 1px solid $default-border;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.7;
    padding: 4px 8px;
    width: 60px;
    height: 32px;
    color: #38405b;
}

.custom-condition-select .selected.open {
    background:#38405B;
    border: 1px solid #38405B;
    cursor: pointer;
    user-select: none;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.7;
    color: $white;
    box-shadow: none;
}

.custom-condition-select .selected:after {
    position: absolute;
    content: '';
    top: 12px;
    right: 1em;
    width: 12px;
    height: 7px;
    border: none;
}

.custom-condition-select {

    .arrow {
        position: absolute;
        content: '';
        top: 12px;
        right: .5rem;
        width: 12px;
        height: 7px;
        border: none;
        transition: transform 0.2s;

        background: url('@/assets/images/select.svg');
        background-repeat: no-repeat;
    }

    .arrow.flipped {
        transform: rotate(360deg);
        background: url('@/assets/images/select-white.svg');
        background-repeat: no-repeat;
        background-size: 12px 7px;
    }
}

.custom-condition-select .items {
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
    left: 0;
    right: 0;
    z-index: 11;
    width: 80px;

    &.selectHide {
        display: none;
    }

    >div {
        padding: 5px 8px;
        display: flex;
        justify-content: space-between;

        &:hover {
            background: $default-badge-border;
            border-radius: 8px;
        }
    }
}

.mb-8 {
    margin-bottom: 2rem;
}

.section_wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-title {
        display: flex;
        gap: 16px;
        align-items: center;
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: #1a1d29;
    }

    &-subtitle {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: #6a6d8f;

        & {
            .color-black {
                color: black;
            }

        }
    }
}
</style>