<template>
    <div class="name">Action Button Link</div>
    <p class="desc">A button that allows talent to switch to an external service to fulfill the conditions.</p>
    <div class="flex gap-4">
        <div class="inputWrap">
            <div class="inputName">
                Button Link
            </div>
            <Input withoutName placeholder="https://" :modelValue="link" @update:modelValue="onChangeLink"
                :isError="errors?.actionButtonLink?.isError" :errorText="errors?.actionButtonLink?.errorText || errors?.actionButtonLink?.text" />
        </div>
        <div v-if="showTitleInput" class="inputWrap">
            <div class="inputName">
                Button Title
            </div>
            <Input withoutName placeholder="Enter a button title" :modelValue="title" @update:modelValue="onChangeTitle"
                :isError="errors?.actionButtonTitle?.isError" :errorText="errors?.actionButtonTitle?.errorText || errors?.actionButtonTitle?.text" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['link', 'title', 'showTitleInput', 'errors'])
const emit = defineEmits(['change:title', 'change:link'])

const onChangeLink = (value) => {
    emit('change:link', value)
}
const onChangeTitle = (value) => {
    emit('change:title', value)
}
</script>

<style scoped lang="scss">
.desc {
    font-family: Basis Grotesque Pro;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.014em;
    text-align: left;
    color: #6A6D8F;
    margin-bottom: 16px;
    padding-right: 148px;
}

.inputWrap {
    width: 100%;

    .inputName {
        font-family: Basis Grotesque Pro;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.014em;
        text-align: left;
        color: #6A6D8F;

        margin-bottom: 8px;
    }
}
</style>