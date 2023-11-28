<template>
    <div>
        <Input name="NFT Contract Address" placeholder="Enter NFT contract address" :modelValue="value"
            @update:modelValue="onChange" :isError="errors?.contractAddress?.isError"
            :errorText="errors?.contractAddress?.errorText" />
        <!-- <BaseSelect :name="'NFT Collection Name or Contract Address'" :options="options" @input="onSelect" /> -->
        <!--   <div class="nft-preview">
            <div class="nft-preview-image-wrap">

                <img />
            </div>
            <div>
                <div>
                    Gumbo by Mathias Isaksen
                </div>
                <div>
                    0x99a9b7c1116f9ceeb1652de04d5969cce509b069
                </div>
                <div>
                    ERC-721
                </div>
            </div>
        </div> -->
    </div>
</template>

<script setup>
const props = defineProps(["chain", "errors", "revalidate", 'value']);
const emit = defineEmits('change')


const value = ref(props.value || '')

const onChange = (newValue) => {
    value.value = newValue
    emit('change', newValue)
}

</script>

<style scoped lang="scss">
.nft-preview {
    display: flex;
    padding: 8px;
    border-radius: 8px;
    border: 1px;
    gap: 8px;
}

.nft-preview-image-wrap {
    width: 64px;
    height: 64px;
    overflow: hidden;
    border-radius: 4px;

    border: 1px solid silver; //TODO remove
}
</style>