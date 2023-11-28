<template>
    <div class="create-quest_wrapper">
       <div class="title-wrapper">
            <div class="title">Create a New Quest</div>
       </div>
       <div class="section_wrapper">
            <div class="section_wrapper-title">
                Tasks
            </div>
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
    </div>
</template>

<script>
</script>