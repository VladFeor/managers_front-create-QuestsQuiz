<template>
    <div class="task-condition" :class="{ noEditing: !isEditingActive }">
        <div class="task-condition_head">
            <div class="task-condition_head_title">
                {{ getConditionName(condition) }}
            </div>
            <ConditionIcon :condition="condition"/>
        </div>
        <div v-if="condition?.name === ON_CHAIN_CONDITIONS.USER_HOLDS_NFT || condition?.name === ON_CHAIN_CONDITIONS.USER_HOLDS_POAP"
            class="mb-2">
            <NFTView :name="conditionValues?.nftName" :imageUrl="handleIPFSUrl(conditionValues?.imgUrl)"
                :contractAddress="conditionValues?.contract_address" :tokenId="conditionValues?.token_id" />
        </div>
        <p class="task-condition_body" v-html="getConditionDescription(condition)"></p>
        <div class="task-condition_card">
            <a class="task-condition_card_title" :href="getConditionButtonLink(condition)" target="_blank"
                rel="noopener noreferrer">
                <img src="@/assets/icons/link.svg" alt="link" />
                {{ getConditionButtonLabel(condition) }}
            </a>
            <div v-if="isEditingActive" class="task-condition_card_btn" @click="toggleEditOnChainTaskModal">
                <img src="@/assets/icons/Edit.svg">
            </div>
        </div>
    </div>
</template>

<script setup>
import { handleIPFSUrl } from '~/util/onchain';
import { getConditionValues, getConditionDescription, getConditionName, getChainIcon, getConditionButtonLabel, getConditionButtonLink, ON_CHAIN_CONDITIONS } from './utils';

const props = defineProps({
    condition: { type: Object, default: {} },
    isEditingActive: { type: Boolean, default: false },
})

const emit = defineEmits(['toggleEditOnChainTaskModal']);

const conditionValues = getConditionValues(props.condition)

const toggleEditOnChainTaskModal = () => {
    emit('toggleEditOnChainTaskModal');
}
</script>

<style lang="scss" scoped>
.task-condition {
    min-width: 600px;
    background-color: #F5F5FD;
    padding: 16px;
    border-radius: 8px;

    &_head {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        &_title {
            display: flex;
            color: #6A6D8F;
            font-size: 18px;
            font-weight: 500;
            line-height: 24px;
            letter-spacing: 0em;
        }

        img {
            width: 40px;
        }
    }

    &_body {
        margin-bottom: 24px;
        font-size: 20px;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0em;
        text-align: left;
        color: #38405B;
    }

    &_card {
        display: flex;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0em;
        color: #38405B;

        &_title {
            width: calc(100% - 82px);
            background-color: #DAD9F7;
            margin-right: 24px;
            border-radius: 8px;
            padding: 7px 16px;
            display: flex;
            align-items: center;

            img {
                margin-right: 8px;
            }
        }

        &_btn {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
            cursor: pointer;

            &:hover {
                background-color: #DAD9F7;
            }
        }
    }

    &_loading {
        width: 100%;
        margin-top: 24px;

        p {
            width: 100%;
            color: #FC660C;
            font-size: 12px;
            font-weight: 500;
            line-height: 16px;
            letter-spacing: 0.014em;
            text-align: right;
        }
    }
}

.task-condition.noEditing {
    .task-condition_card_title {
        width: 100%;
        margin-right: 0;
    }
}
</style>