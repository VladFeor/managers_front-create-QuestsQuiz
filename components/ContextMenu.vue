<template>
    <div :class="['context-menu', { active: isOpened }]">
        <div v-for="item in   items  " class="item">
            <div @click="item.onClick" :style="`color: ${item?.labelColor};`">{{ item?.label }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['items', 'isOpened', 'onClose'])
</script>

<style scoped lang="scss">
.context-menu {
    display: none;
    position: absolute;
    background: white;
    right: -20px;
    top: 110%;
    width: fit-content;
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0px 4px 16px 0px rgba(56, 64, 91, 0.24);
    z-index: 2;

    &.active {
        display: block;
    }

    &::before {
        content: '';
        display: block;
        background: inherit;
        width: 16px;
        height: 16px;
        position: absolute;
        top: -6px;
        right: 20px;
        transform: rotate(45deg);
        z-index: -1;
    }

    .item {
        padding: 5px 11px;
        border-radius: 8px;
        color:#38405B;
        font-family: Basis Grotesque Pro;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0em;
        text-align: left;
        cursor: pointer;
        white-space: nowrap;
        z-index: 4;

        &:hover {
            background: rgba(234, 234, 251, 1);

        }
    }
}
</style>