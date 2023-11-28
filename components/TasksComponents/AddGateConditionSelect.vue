<template>
    <div class="add-talent-btn_wrapper" ref="multiselectContainer">
        <div class=" add-talent-btn" @click="toggle">
            <span>Add Condition</span>
            <Icon v-if="type !== 'level'" name="Add" :size="20" />
        </div>
        <!-- filter: invert(21%) sepia(9%) saturate(2104%) hue-rotate(189deg) brightness(100%) contrast(88%); -->
        <div class="options" :class="{ isScroll, isTop }" v-if="open">
            <div v-for="option in options" :key="option.id" class="option" @click.stop="onSelect(option)">
                <Icon :name="option.icon" :size="24" />
                {{ option.name }}
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import Icon from '../Icon';
import { GATE_CONDITION_DATA } from '../Gate/utils';
const props = defineProps(['options', 'onSelect'])

const open = ref(false);
const multiselectContainer = ref(null);

const toggle = () => {
    open.value = !open.value;
};

const onSelect = (option) => {
    props.onSelect && props.onSelect(option)
    toggle()
}

const handleClickOutside = (event) => {
    if (multiselectContainer.value && !multiselectContainer.value.contains(event.target)) {
        open.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

</script>
  
<style scoped lang="scss">
$name-font: 'Basis Grotesque Pro';

.add-talent-btn_wrapper {
    position: relative;
    width: fit-content;
}

.add-talent-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 151px;
    padding: 8px 12px;
    height: 40px;
    background: #eaeafb;
    border: 1px solid #dad9f7;
    border-radius: 8px;
    cursor: pointer;

    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: #38405b;
}


.name {
    font-family: $name-font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
    margin-bottom: 8px;
}



.selected-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
}

.placeholder {
    font-family: $name-font;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    margin-top: 2px;
    margin-left: 7px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $colabs-bg;
}

.tag {
    display: flex;
    align-items: center;
    background: $default-border;
    border-radius: 6px;
    cursor: pointer;
    padding: 5px 12px;
    font-family: $name-font;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-feature-settings: 'zero' on;
    color: #1a1d29;
}

.remove-tag {
    margin-left: 10px;
    cursor: pointer;
}

.options {
    position: absolute;
    left: 0;
    top: 50px;
    background-color: #ffffff;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    padding: 8px;
    z-index: 610;
    max-height: 250px;
    width: 280px;
    overflow-y: auto;
    gap: 10px;
    display: flex;
    flex-direction: column;

    &.isTop {
        top: -155px;
    }

    &.isScroll {
        max-height: 150px;
    }

    &::-webkit-scrollbar {
        width: 6px;
        height: 90%;
    }

    &::-webkit-scrollbar-track {
        border-radius: 10px;
        margin-top: 30px;
    }

    &::-webkit-scrollbar-thumb {
        background: $secondary;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: $secondary;
    }
}

.option {
    padding: 4px 8px;
    cursor: pointer;
    font-family: $name-font;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: 'zero' on;
    color: $default;
    align-items: center;
    display: flex;
    gap: 8px;
}

.option:hover {
    background: #eaeafb;
    border-radius: 8px;
}

.arrow {
    position: absolute;
    bottom: 15px;
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
</style>
  