<template>
    <div class="condition-setting">
        <div class="condition-setting-item">
            <div class="name">Blockchain</div>

            <div class="blockchain-select">
                <div class="blockchain-select-icon">
                    <Blockchain :name="selectedBlockchain.icon" :size="24" />
                </div>
                <ConditionSelect :selected="selectedBlockchain" @select="setBlockchainsSelect" :options="blockchains" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { blockchains } from '~/util/onchain';

const props = defineProps(['selected'])
const emit = defineEmits(['select'])

const selectedBlockchain = computed(()=> props.selected ? blockchains.find(b => b.name === props.selected) : blockchains[0]);

const setBlockchainsSelect = (value) => {
    emit('select', value)
};
</script>

<style lang="scss" scoped>
.blockchain-select {
    position: relative;
    width: 50%;

    &-icon {
        position: absolute;
        height: 100%;
        left: 0;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;
        border-right: 1px solid #dad9f7;
        border-radius: 8px 0 0 8px;
        background-color: #dad9f7;
        top: 0;

        &>svg {
            display: inline-block;
        }
    }
}
</style>