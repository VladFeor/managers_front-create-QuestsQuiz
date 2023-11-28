<template>
    <div :class="['nft-view', { bordered }]">
        <div v-if="isLoading"
            class="nft-skeleton space-y-4 divide-y divide-gray-200 rounded animate-pulse dark:divide-gray-700 bg-gray-300" />
        <div v-else-if="name && imageUrl" class="nft-container">
            <div class="nft-image-container">
                <img alt="preview" :src="imageUrl" />
            </div>
            <div class="nft-data-container">
                <div class="nft-header">
                    <span class="label">{{ name }}</span><span v-if="tokenId" class="label"> #{{ tokenId }}</span>
                    <!-- <span class="text-small"> | ID ???</span> -->
                </div>
                <div class="nft-body">
                    <div class="label">{{ name }}</div>
                    <div v-if="contractAddress" class="text-small">
                        <span :style="{ 'overflow-wrap': 'break-word' }">{{ contractAddress }}</span>
                        <span> | ERC-721</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="error" class="nft-error">{{ error }}</div>
        <div v-else-if="contractAddress">
            <div class="text-small">{{ contractAddress }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['name', "tokenId", "contractAddress", "imageUrl", 'isLoading', 'error', 'bordered'])

</script>

<style lang="scss">
.nft-view {
    &.bordered {
        .nft-container {
            border-radius: 8px;
            border: 1px solid #DAD9F7
        }
    }

    .nft-skeleton {
        height: 108px;
        border-radius: 8px;
    }

    .nft-error {
        color: $error-text;
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
    }

    .nft-container {
        display: flex;
        padding: 8px;

        .nft-image-container {
            max-width: 106px;
            border-radius: 8px;
            overflow: hidden;
        }

        .nft-data-container {
            width: 70%;
            padding-left: 8px;

            .nft-header {
                margin-bottom: 16px;
            }
        }
    }

    .label {
        //styleName: Label;
        font-family: Basis Grotesque Pro;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.014em;
        text-align: left;
        color: #1A1D29;
    }

    .text-small {
        //styleName: Text Small;
        font-family: Basis Grotesque Pro;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0.014em;
        text-align: left;
        color: #6A6D8F;
    }
}
</style>