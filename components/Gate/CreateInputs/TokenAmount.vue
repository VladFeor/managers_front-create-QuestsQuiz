<template>
    <div class="flex gap-4">
        <div class="w-full">
            <Input name="Token Name or Contact Address" :isError="errors?.contractAddress?.isError"
                placeholder="Enter contract address" :modelValue="contractAddress" @update:modelValue="setContractAddress"
                :errorText="errors?.contractAddress?.errorText" />
            <!--   <BaseSelect :options="options" placeholder="'Select or add token contract address" /> -->
        </div>
        <div>
            <div class="name">Quantity</div>
            <div>
                <NumberInput :allowDecimal="true" :modelValue="quantity" @update:modelValue="setQuantity"
                    :placeholder="'Enter quantity'" :rule="!errors?.quantity?.isError" :step="0.1" />
            </div>
            <div>
                <div v-if="errors?.quantity?.isError && errors?.quantity?.errorText" class="error-message">
                    {{ errors?.quantity?.errorText }}
                </div>
            </div>
        </div>
    </div>
    
</template>

<script setup>
const props = defineProps(['options', 'errors', "quantity", "contractAddress"])
const emit = defineEmits(['update:contractAddress', 'update:quantity'])

const setContractAddress = (newValue) => {
    emit('update:contractAddress', newValue)
}

const setQuantity = (newQuantity) => {
    emit('update:quantity', newQuantity)
}

</script>

<style scoped lang="scss">
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
</style>