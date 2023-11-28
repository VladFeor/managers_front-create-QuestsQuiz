<template>
    <div class="project-gate">

        <GateCondition v-for="condition in gateStore.conditions" :project="project" :condition="condition"
            :onUpdate="onUpdateCondition" :onDelete="onDeleteCondition" />
        <ScrollContainerBaseModal title="Adding a Condition" :width="480" customHeight="auto" @close="onClose"
            :visible="isAddModalVisible" :bottom="20">

            <AddGateCondition :availableOptions="availableOptions" :project="project" @close="onClose"
                :onSave="onAddCondition" />

        </ScrollContainerBaseModal>
        <button v-if="haveAvailableOptions" class="btn" @click="onOpen">
            Add condition
            <img src="@/assets/icons/create-dark.svg" />
        </button>
    </div>
</template>

<script setup>
import { useGateStore } from '~/store';
import { GATE_CONDITIONS } from '../Gate/utils';

const props = defineProps(['project'])
const nuxtApp = useNuxtApp();
const gateStore = useGateStore();

const isAddModalVisible = ref(false)

const hasAvailableOptions = (conditions) => !Object.values(GATE_CONDITIONS).map(key => conditions.some(c => c.type === key)).every(Boolean)
const getAvailableOptions = () => Object.values(GATE_CONDITIONS).filter(type => !gateStore.conditions.some(c => c.type === type))

const haveAvailableOptions = computed(() => hasAvailableOptions(gateStore.conditions))
const availableOptions = computed(() => getAvailableOptions());

const onOpen = () => {
    console.log(availableOptions)
    isAddModalVisible.value = true
}
const onClose = () => {
    isAddModalVisible.value = false
}

const onAddCondition = async ({ type, values }) => {
    return gateStore.addCondition(props.project.id, type, values).then(() => {
        nuxtApp.$alert.show('A new condition has been added to the gate', {
            type: 'success',
            timeout: 5000,
        });
        onClose()
    })

}

const onUpdateCondition = async ({ type, values }) => {
    return await gateStore.editCondition(props.project.id, type, values)
}

const onDeleteCondition = async ({ type }) => {
    return await gateStore.removeConditionAction(props.project.id, type)
}

</script>

<style lang="scss">
.project-gate {

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


    .btn {
        width: 100%;
        display: flex;
        gap: 8px;
        justify-content: center;
        align-items: center;
        border: 1px solid #EAEAFB;
        border-radius: 8px;
        padding: 5px 8px;

        font-family: Basis Grotesque Pro;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #38405B;

        &:hover {
            border: 1px solid #DAD9D7;
            background-color: #f5f5fd;
        }

    }
}
</style>