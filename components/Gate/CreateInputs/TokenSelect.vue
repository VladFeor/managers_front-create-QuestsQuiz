<template>
    <div>
        <div class="name">Token ID</div>
        <div class="flex flex-col">
            <NumberInput :class="{ error: errors?.tokenId?.isError }" :modelValue="value"
                :rule="!errors?.tokenId?.isError" @update:modelValue="setInputValue" :noArrows="true"
                :placeholder="'Enter Token ID'" />
            <div v-if="errors?.tokenId?.isError" class="error-message">{{ errors?.tokenId?.errorText }}</div>
            <!--      <div class="custom-select" ref="selectContainer">
                <div class="selected" :class="[{ open }, { placeholder: !selected }]" @click="toggle">
                    {{ selected ? reduceStringLength(selected.value, 18) : placeholder }}
                    <span class="arrow" :class="{ flipped: open }"></span>
                </div>
                <div class="items" :class="{ selectHide: !open }">
                    <div class="search-container">
                        <Icon class="search-icon" icon="Search" :size="16"></Icon>
                        <input class="search" type="text" v-model="search" :placeholder="`Find a token...`" />
                    </div>
                    <div v-if="filteredOptions.length === 0">No results</div>

                    <div v-for="(option, i) in filteredOptions" class="item" :key="i" @click.stop="selectOption(option)">
                        <img :src="option.imgSrc" />
                        <span>
                            {{ option.name }}
                        </span>
                        <icon v-if="option.value === selected?.value" icon="Tik" :size="20"></icon>
                    </div>
                </div>

            </div> -->
            <!--            <div v-if="selected" class="img-preview">
                <img :src="selected.imgSrc" />
                <span>{{ selected.name }}</span>
            </div> -->
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['options', 'initialSelected', 'errors', 'value'])
const emit = defineEmits(['change']);

const inputValue = ref("")
const setInputValue = (value) => {
    inputValue.value = value
    emit('change', value)
}
/* 
const selected = ref(null);
const open = ref(false);
const selectContainer = ref(null);
const search = ref('');
const toggle = () => {
    open.value = !open.value;
};

const selectOption = (option) => {
    selected.value = option;
    toggle();
    emit('input', option);
};

const handleClickOutside = (event) => {
    if (selectContainer.value && !selectContainer.value.contains(event.target)) {
        open.value = false;
    }
};

const filteredOptions = computed(() => {
    if (!search.value) return props.options;
    return props.options.filter((option) =>
        option.name.toLowerCase().includes(search.value.toLowerCase()) || option.value.toLowerCase().includes(search.value.toLowerCase())
    );
});

onBeforeMount(() => {
    //emit('input', selected.value);
    document.addEventListener('click', handleClickOutside);
});
 */
</script>

<style scoped lang="scss">
.input {
    width: 50%;
}

.error-message {
    color: $error-text;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-top: 8px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}

.custom-select .selected.error {
    border-color: $error-border !important;
}

.placeholder {
    color: $not-active-border !important;
}

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

.custom-select {
    position: relative;
    max-width: 100%;
    width: 240px;
    text-align: left;
    outline: none;
    height: 40px;
    z-index: 10;
    line-height: 47px;
    background: $white;
    border: 1px solid $default-border;
    border-radius: 8px;
    padding: 8px 12px;
}

.custom-select .selected {
    cursor: pointer;
    user-select: none;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $section-title;
}

.arrow {
    position: absolute;
    top: 15px;
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

.first {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
}

.custom-select .items {
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
}

hr {
    margin: 4px 0;
    color: #dad9f7;
}


.custom-select .items .item {
    color: $default;
    cursor: pointer;
    user-select: none;
    padding: 4px 8px;

    display: flex;
    align-items: center;
    gap: 8px;

    span {
        width: 100%;
    }

    img {
        width: 64px;
        height: 64px;
        border-radius: 8px;
    }
}

.custom-select .items div:hover {
    background-color: $default-border;
    border-radius: 8px;
}

.selectHide {
    display: none;
}

.error {
    border-color: $error-border;
}

.search-container {
    position: relative;
    margin-bottom: 8px;
}

.search {
    width: 100%;
    height: 32px;
    border: 1px solid $default-badge-border;
    background: none !important;
    outline: none !important;
    border-radius: 8px;
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.014em;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
    padding-left: 30px;

    &::placeholder {
        color: $colabs-bg;
    }
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: $colabs-bg;
    pointer-events: none;
}

.img-preview {
    font-family: 'Basis Grotesque Pro';
    font-weight: 500;
    width: 240px;
    border-radius: 8px;
    border: 1px solid #DAD9F7;
    padding: 8px;
    background: #F5F5FD;

    img {
        border-radius: 4px;
        width: 100%;
        height: 100%;
        max-width: 224px;
        max-height: 224px;
        margin-bottom: 8px;
    }
}
</style>
  