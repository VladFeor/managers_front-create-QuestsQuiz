<template>
    <div class="p-4 create_gate_item">
        <div class="flex justify-between">
            <div class="flex gap-4 items-center flex-grow-1!">
                <Icon :name="item.icon" :size="24" />
                <span class="title">{{ item?.title }} </span>
            </div>
            <Switch v-if="toggle" type="small" @checked="(value) => toggle(item.id, value)" :checkedProp="item.active" />
            <div v-else @click="emit('remove')" class="cursor-pointer">
                <img class="w-6 h-6" src="@/assets/icons/delete-gray.svg" alt="" />
            </div>
        </div>
        <div v-if="toggle ? item.active : true" class="item-wrap">
            <slot />
        </div>
    </div>
</template>

<script setup>
const props = defineProps(["item", "toggle"]);
const emit = defineEmits('remove')

</script>


<style scoped lang="scss">
.create_gate_item {
    border: 1px solid #DAD9F7;
    background-color: #EAEAFB;
    border-radius: 16px;

    .title {
        font-family: 'Basis Grotesque Pro';
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #38405B;
    }
}

.item-wrap {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}
</style>