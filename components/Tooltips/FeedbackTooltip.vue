<template>
    <div style="position: relative;">

        <div class="tooltip-component" :class="{ active }" :style="{ width: width, height: height }">
            <div class="tooltip-item">
                <span class="tooltip-content">{{ tooltipText }}</span>
            </div>
        </div>
        <slot />
    </div>
</template>

<script setup>
const props = defineProps({
    tooltipText: { type: String, default: '' },
    active: { type: Boolean, default: false },
    width: { type: String, default: 'fit-content' },
    height: { type: String, default: 'auto' },
});
</script>

<style scoped lang="scss">
.tooltip-component {
    display: none;
    position: absolute;
    z-index: 999;
    background: $default;
    box-shadow: 0px 2px 8px rgba(26, 29, 41, 0.24);
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 14px;
    line-height: 1.5;
    width: fit-content;
    white-space: nowrap;
    height: auto;
    min-height: 32px;
    left: 50%;
    top: -60%;
    transform: translate(-50%, -50%);

    &.active {
        display: block;
    }

    &::after {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        background: $default;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 10;
        top: 11px;
        left: 50%;
        right: 50%;
        transform-origin: center;
        transform: rotate(45deg) translate(-20%, 60%);
    }

    span {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        text-align: right;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $default-border;
    }

    .tooltip-content {
        position: relative;
        z-index: 20;
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
        letter-spacing: 0.014em;
        font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
        color: $white;
        padding-left: 8px;
    }
}
</style>
