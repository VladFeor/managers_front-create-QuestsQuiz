<template>
    <div>
        <div class="name">{{ name }}</div>
        <div class="multiselect-with-tags" :class="{ error: !rule }">
            <div class="selected-tags">
                <span v-for="(item, index) in selectedItems" :key="item.id" class="tag">
                    {{ item.name }}
                    <Icon class="remove-tag" @click.stop="removeTag(index)" icon="Delete" :size="16"></Icon>
                </span>
                <div class="select-wrap" ref="multiselectContainer">
                    <button :class="['tag add-btn', { active: open }]" @click="toggle">Add Attribute +</button>

                    <div class="options" v-show="open">
                        <div class="search-container">
                            <Icon class="search-icon" icon="Search" :size="16"></Icon>
                            <input class="search" type="text" v-model="search" :placeholder="placeholder" />
                        </div>
                        <div v-for="(option, index) in filteredOptions" :key="option.id"
                            :class="['option', { selected: isSelected(option) }]" @click.stop="selectOption(option)">
                            {{ option.name }}
                            <icon v-if="isSelected(option)" icon="Tik" :size="20"></icon>
                            <img v-if="!isSelected(option)" src="@/assets/icons/create-dark.svg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps(["options", "name", "placeholder"]);
const emit = defineEmits(['selected-items']);
const selectedOptions = ref([])

const open = ref(false);
const search = ref('');
const selectedItems = ref([]);
const multiselectContainer = ref(null);

const toggle = () => {
    open.value = !open.value;
};

onMounted(() => {
    selectedItems.value = selectedOptions.value;
});


const filteredOptions = computed(() => {
    return props.options.filter((option) =>
        option.name.toLowerCase().includes(search.value.toLowerCase()),
    );
});

const isSelected = (option) => {
    return selectedItems.value.some((item) => item.id === option.id);
};

const selectOption = (option) => {
    const index = selectedItems.value.findIndex((item) => item.id === option.id);
    if (index === -1) {
        selectedItems.value.push(option);
    } else {
        if (selectedItems.value.length > 1) {
            selectedItems.value.splice(index, 1);
        }
    }
    toggle()
    search.value = ''
    emit('selected-items', selectedItems.value);

};

const removeTag = (index) => {
    selectedItems.value.splice(index, 1);
    if (!selectedItems.value || (selectedItems.value && !selectedItems.value.length)) {
        selectedItems.value = [
            {
                name: 'Coins',
                id: 1,
            },
        ];
    }
    emit('selected-items', selectedItems.value);
};

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

.name {
    font-family: $name-font;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: $default;
    margin-bottom: 8px;
}

.multiselect-with-tags {
    position: relative;
    display: inline-block;


    min-height: 38px;
    width: 100%;
}

.select-wrap {
    position: relative;
}

.selected-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;

    .tag {
        display: flex;
        align-items: center;
        gap: 10px;
        background: white;
        border: 1px solid #DAD9F7;
        border-radius: 6px;
        cursor: pointer;
        padding: 7px 12px;
        font-family: $name-font;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        font-feature-settings: 'zero' on;
        color: #1a1d29;
    }

    .tag.add-btn {
        background: #DAD9F7;
        transition: .3s all;

        &.active {
            color: white;
            background: #38405B;
        }
    }
}

.options {
    position: absolute;
    top: 46px;
    left: 0;
    background-color: #ffffff;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    padding: 8px;
    z-index: 100;
    max-height: 250px;
    width: 240px;
    overflow-y: auto;
}

.search-container {
    position: relative;
}

.search {
    width: 184px;
    padding: 4px 8px;
    height: 32px;
    border: 1px solid #eaeafb;
    background: none !important;
    outline: none !important;
    border-radius: 8px;
    font-family: $name-font;
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
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: $colabs-bg;
    pointer-events: none;
    /* чтобы иконка не блокировала события ввода */
}

.option {
    padding: 5px 8px;
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
    justify-content: space-between;
}

.option:hover {
    background: #eaeafb;
    border-radius: 8px;
}
</style>