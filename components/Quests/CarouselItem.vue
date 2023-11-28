<!-- CardItem.vue -->
<template>
    <div class="card-carousel-item" transition="fade">
      <button class="btn-delete" @click="deleteCardItem">Delete Card</button>
      <UploaderButton 
        @changeError="handleImageError" 
        v-model="item.images" 
        :imagesFiles="images"
        @images="updateImages" 
      />
      <div class="input-custom">
        <Input 
          :isError="isTitleTooLong('text')" 
          v-model="item.title" 
          :name="''" 
          :placeholder="'Card title'" 
        />
        <p v-if="isTitleTooLong('text')" class="error-message">Task name should not exceed 43 characters</p>
      </div>
      <div class="input-custom">
        <TextArea 
          :rule="!isTitleTooLong('area')" 
          v-model="item.description" 
          :placeholder="'Description (optional)'" 
        />
        <p v-if="isTitleTooLong('area')" class="error-message">Task name should not exceed 43 characters</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      item: Object,
      images: Array,
    },
    methods: {
      deleteCardItem() {
        this.$emit('delete', this.item.id);
      },
      handleImageError() {
        // Handle image error
      },
      updateImages(images) {
        // Emit an event to notify the parent component to update images
        this.$emit('update-images', this.item.id, images);
      },
      isTitleTooLong(type) {
        const title = this.item.title || '';
        const maxLength = 43;
  
        if (type === 'text') {
          return title.length > maxLength;
        } else if (type === 'area') {
          // Additional logic for textarea, if needed
          return title.length > maxLength;
        }
  
        return false;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */
  </style>
  