<template>
    <div class="create-quest_wrapper">
       <div class="title-wrapper">
            <div class="title">Create a New Quest</div>
       </div>
       <div class="section_wrapper">
            <div class="section_wrapper-title" >
                Tasks
            </div>
            <button 
                class="section_wrapper-title"
                @click="openModalCarousel"
            >
                Carousel
            </button>
            <TooltipIcon tooltipText="Gate is rules that determine who can access the task." />
            <div class="section_wrapper-subtitle">
                This is the project where your task will appear.
            </div>
            <TaskType/>
        </div>
        <BaseModal
            :width="600"
            :top="10"
            :rightCustom="10"
            :bottom="10"
            customHeight="auto"
        >
            <CreateQuiz />
        </BaseModal>
        <BaseModal
            :width="600"
            :top="10"
            :rightCustom="10"
            :bottom="10"
            customHeight="auto"
            @close="handleCloseConfirm($event)"
            :visible="isConfirmModalOpen"
            btnLeft
            @openConfirmationModal="isConfirmModalOpen = false"
            isConfirm
        >
            <CreateCarousel/>
        </BaseModal>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const isConfirmModalOpen = ref(false);

    function openModalCarousel() {
      isConfirmModalOpen.value = true; 
    }

    const handleCloseConfirm = (value) => {
        isConfirmModalOpen.value = value;
    };


    return {
      isConfirmModalOpen,
      openModalCarousel,
      handleCloseConfirm,
    };
  },
};
</script>