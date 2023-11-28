<template>
    <div v-if="condition.type in GATE_CONDITION_DATA" class="p-4 gate_condition mb-2">
        <div class="flex justify-between">
            <div class="flex gap-4 items-center flex-grow-1!">
                <Icon :name="GATE_CONDITION_DATA[condition?.type]?.icon" :size="24" />
                <span class="title">{{ GATE_CONDITION_DATA[condition?.type]?.label }} </span>
            </div>
            <div v-if="!readonly" ref="menuContainer" style="position: relative;">
                <img class="w-6 h-6" src="@/assets/icons/more-black.svg" alt="" @click="onShowContextMenu" />
                <ContextMenu :isOpened="isContextMenuOpened" :onClose="onCloseContextMenu"
                    :items="[{ label: 'Edit Condition', onClick: () => onEditCondition(condition) }, { label: 'Delete', labelColor: '#CC2D14', onClick: handleDeleteCondition }]" />
            </div>
        </div>
        <div class="item-wrap">
            <div v-if="condition.type === GATE_CONDITIONS.ANY_NFT_FROM_COLLECTION">
                <NFTView :name="condition.values?.nftName" :contractAddress="condition.values?.contractAddress"
                    :imageUrl="handleIPFSUrl(condition.values?.imgUrl)" />
            </div>
            <div v-if="condition.type === GATE_CONDITIONS.SPECIFIC_NFT_FROM_COLLECTION">
                <NFTView :name="condition.values?.nftName" :tokenId="condition.values?.tokenId"
                    :contractAddress="condition.values?.contractAddress"
                    :imageUrl="handleIPFSUrl(condition.values?.imgUrl)" />
            </div>
            <div v-if="condition.type === GATE_CONDITIONS.MINIMUN_AMOUNT_OF_TOKEN">
                <TokenAmountView :quantity="condition.values.quantity" :tokenName="condition.values.tokenName"
                    :contractAddress="condition.values.contractAddress" :blockchain="condition.values.blockchain" />
            </div>
            <div v-if="condition.type === GATE_CONDITIONS.WHITELIST_OF_WALLET_ADRESSESS">
                <div class="value">{{ condition.values.adressess.split(',').filter(Boolean).length }} wallet addresses</div>
            </div>
        </div>
        <BaseModal title="Editing a Condition" :width="480" customHeight="fit-content" @close="closeEditModal($event)"
            :visible="isEditModalVisible">
            <EditGateCondition :project="project" :condition="condition" :isLoading="isLoading" @close="closeEditModal"
                @save="onUpdateCondition" />
        </BaseModal>
    </div>
</template>


<script setup>
import { GATE_CONDITIONS, GATE_CONDITION_DATA } from './utils';
import { handleIPFSUrl } from '~/util/onchain';

const props = defineProps(["condition", "project", "onUpdate", 'onDelete', 'readonly']);

const isContextMenuOpened = ref(false)
const isLoading = ref(false);

const getAddressBlockchain = (address) => {
    return address.startsWith('0x') ? '| ERC-721' : ''
}

const onShowContextMenu = () => {
    isContextMenuOpened.value = true
}

const isEditModalVisible = ref(false);
const onCloseContextMenu = () => {
    isContextMenuOpened.value = false
}

//TODO move to parent
const openEditModal = () => {
    isEditModalVisible.value = true
}

const closeEditModal = () => {
    isEditModalVisible.value = false
}
const onUpdateCondition = async (condition) => {
    isLoading.value = true;
    props.onUpdate && props.onUpdate(condition).then(() => {
        isLoading.value = false
        closeEditModal()
    }).finally(() => isLoading.value = false)
}

const onEditCondition = (c) => {
    openEditModal()
    onCloseContextMenu()
}

const handleDeleteCondition = () => {
    props.onDelete && props.onDelete(props.condition)
    onCloseContextMenu()
}


const menuContainer = ref(null);

const handleClickOutside = (event) => {
    if (!isContextMenuOpened) return

    if (menuContainer.value && !menuContainer.value.contains(event.target)) {
        if (isContextMenuOpened) {
            onCloseContextMenu()
        }
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

</script>


<style lang="scss">
.title {
    font-family: 'Basis Grotesque Pro';
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    color: #38405B;
}

.gate_condition {
    background-color: #F5F5FD;
    border-radius: 16px;

    .modal-overlay {
        overflow-y: scroll; // bigger modals cannot fit to 1366 screens
    }

    .modal-container {
        padding: 32px;

        .modal-header {
            justify-content: center !important;
            margin-bottom: 24px;

            h2 {
                font-family: Basis Grotesque Pro;
                font-size: 24px !important;
                line-height: 40px;

            }
        }
    }
}


.value {
    //styleName: Label;
    font-family: Basis Grotesque Pro;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.014em;
    text-align: left;

    //styleName: Text Small;
    font-family: Basis Grotesque Pro;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.014em;
    text-align: left;
    color: #6A6D8F;
}

.item-wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}
</style>