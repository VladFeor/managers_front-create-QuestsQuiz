<template>
    <!--  <Select :options="options" @input="onSelect" /> -->

    <div class="condition-select" ref="selectContainer">
        <div class="selected" :class="{ open: isOpen }" @click="toggle">
            <Icon :name="selected.icon" :size="24" />
            {{ selected.name }}
            <span class="arrow" :class="{ flipped: isOpen }"></span>
        </div>
        <div class="items" :class="{ selectHide: !isOpen }">
            <div v-for="(option, i) in options" :key="i" @click.stop="onSelect(option)">

                <Icon :name="option.icon" :size="24" />
                {{ option.name }}
                <div style="margin-left: auto;">
                    <Icon v-if="selected.value === option.value" name="Tik" :size="20" color="#38405B" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { GATE_CONDITIONS, GATE_CONDITION_DATA } from './utils'
const props = defineProps(['disabledOptions'])
const emit = defineEmits(['change'])



const getAvailableOptions = () => {
    let optionValues = Object.keys(GATE_CONDITION_DATA)
    if (props?.disabledOptions?.length) {
        console.log('disabled', props.disabledOptions)
        optionValues = optionValues.filter(key => !props?.disabledOptions.some(o => o === key))
    }
    const res = optionValues.map(type => ({ value: type, name: GATE_CONDITION_DATA[type].label, icon: GATE_CONDITION_DATA[type].icon }))
    return res
}
const options = ref(getAvailableOptions())

const isOpen = ref(false);
const selected = ref(options.value.length ? options.value[0] : GATE_CONDITION_DATA[GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION])

const toggle = () => isOpen.value = !isOpen.value

const onSelect = (option) => {
    selected.value = option
    isOpen.value = false
    emit('change', option)
}
</script>

<style scoped lang="scss">
.condition-select {
    position: relative;
    width: 100%;
    text-align: left;
    outline: none;
    z-index: 1000;
    font-weight: 500;
}

.condition-select .selected {
    display: flex;
    gap: 8px;
    align-items: center;
    background: #EAEAFB;
    padding: 16px;
    border: 1px solid $default-border;
    border-radius: 16px;
    cursor: pointer;
    user-select: none;
    font-family: Basis Grotesque Pro;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: left;


    color: #38405b;
}

.condition-select .selected.open {
    background: #DAD9F7;
    border: 1px solid $default-badge-border;
    cursor: pointer;
    user-select: none;
}


.arrow {
    position: absolute;
    content: '';
    top: 45%;
    right: 1em;
    width: 12px;
    height: 7px;
    border: none;
    transition: transform 0.2s;

    background: url('@/assets/images/select.svg');
    background-repeat: no-repeat;
}

.arrow.flipped {
    transform: rotate(180deg);
}

.condition-select .items {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px;
    background: $white;
    cursor: pointer;
    user-select: none;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: $default;
    overflow: hidden;
    border-right: 1px solid $default-badge-border;
    border-left: 1px solid $default-badge-border;
    border-bottom: 1px solid $default-badge-border;
    position: absolute;
    left: 0;
    right: 0;
    top: 68px;
    z-index: 555;
    border-radius: 8px;
    overflow: inherit;
    max-height: 368px;
    overflow-y: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        width: 6px;
        height: 100%;
    }

    &::-webkit-scrollbar-track {
        border-radius: 10px;
        margin-top: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: $secondary;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: $secondary;
    }

    &.selectHide {
        display: none;
    }

    &::after {
        content: '';
        position: absolute;
        width: 28px;
        height: 18px;
        background: $white;
        z-index: -1;
        top: 14px;
        left: 50%;
        right: 50%;
        transform: rotate(45deg) translate(-50%, -10%);
    }
}

.condition-select .items div:not(.empty-options) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    color: $default;
    cursor: pointer;
    user-select: none;
    padding: 4px 8px;
    white-space: nowrap;
}



.condition-select .items div:not(.input-project-wrapper, .empty-options):hover {
    background-color: $default-border;
    border-radius: 8px;
}
</style>
