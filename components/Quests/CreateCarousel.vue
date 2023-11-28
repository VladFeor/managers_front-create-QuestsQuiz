<template>
    <div class="card-carousel">
      <div class="title-carousel">Carousel</div>
      <div class="subtitle-carousel">Create 2 to 8 carousel cards.</div>
  
      <TransitionGroup name="list" tag="ul" appear>
        <div v-for="(item) in cardItems" :key="item.id" class="card-carousel-item" transition="fade">
  
          <button 
            class="btn-delete" 
            @click="deleteCardItem(item.id)"
            >Delete Card
        </button>
          <UploaderButton 
            @changeError="handleImageError" 
            v-model="item.images" 
            :imagesFiles="images"
            @images="updateImages(item.id, $event)" 
          />
          <div class="input-custom">
            <Input  :isError="isTitleTooLong(item.id,'text') || item.isFilled == false" v-model="item.title" :name="''" :placeholder="'Card title'" />
            <p v-if="isTitleTooLong(item.id,'text')" class="error-message">Task name should not exceed 43 characters</p>
            <p v-if="item.isFilled == false" class="error-message">Enter a card title</p>
          </div>
          <div class="input-custom">
            <TextArea :rule="!isTitleTooLong(item.id,'area')" v-model="item.description" :placeholder="'Description (optional)'" />
            <p v-if="isTitleTooLong(item.id,'area')" class="error-message">Task name should not exceed 43 characters</p>
          </div>
        </div>
        <button class="btn-add-card" @click="addCardItem">
          <div class="btn-text">Add Card</div>
          <Icon name="Add" :size="20" />
        </button>
      </TransitionGroup>
    </div>
    <Loader v-if="isLoading" />
  </template>
    
  <script setup>
  const nuxtApp = useNuxtApp();
  
  const images = ref([]);
  
  const cardItems = ref([
    { id: `${Date.now()}`, title: '12', description: '', images: '', isFilled: '' }
  ]);
  function addCardItem() {
    let isHaveNoFilled = false
    cardItems.value.forEach(item=>{
      if(item.title ==  '') {
        item.isFilled = false
        isHaveNoFilled = true
      }
    })
    if(isHaveNoFilled){
      return
    }
    if(cardItems.value.length == 8){
      return alertError('You are trying to go beyond the number of items in the carousel')
    }
    const newItem = { id: `${Date.now()}`, title: '', description: '', images: '' };
    cardItems.value.push(newItem);
  }
  async function alertError(textErrot){
    await nuxtApp.$alert.show(textErrot, {
      type: 'error',
      timeout: 5000,
      });
  }
  function deleteCardItem(itemId) {
    if(cardItems.value.length <= 2) {
      return alertError('The desired size is not suitable for the subsequent carousel')
    }
    const index = cardItems.value.findIndex(item => item.id === itemId);
    if (index !== -1) {
      cardItems.value = cardItems.value.filter(item => item.id !== itemId);
    }
  }
  function updateImages(id, newImages) {
    const index = cardItems.value.findIndex(item => item.id === id);
    const jsonString = JSON.stringify(newImages[0]);
    const regularObject = JSON.parse(jsonString);
    if(index != -1){
      cardItems.value[index].images = regularObject;
    }
  }
  function handleImageError(error) {
    console.error('Image upload error:', error);
  }
  function isTitleTooLong(id,type) {
    const index = cardItems.value.findIndex(item => item.id === id);
    if(cardItems.value[index].title.trim().length > 0){
      cardItems.value[index].isFilled = true
    }
    if(type == 'text'){
      return cardItems.value[index].title.trim().length > 43;
    }
    if(type == 'area'){
      return cardItems.value[index].description.trim().length > 43;
    }
  }
  </script>
    
  <style lang="scss" scoped>
  * {
    font-family: Basis Grotesque Pro;
    transition: .3s;
  }
  
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  
  .list-leave-active {
    position: absolute;
  }
  
  .list-leave-active {
    position: absolute;
  }
  
  .card-carousel {
    width: 100%;
    padding: 16px;
  
  }
  
  .title-carousel {
    font-size: 20px;
    color: rgba(106, 109, 143, 1);
  }
  
  .subtitle-carousel {
    font-size: 12px;
    color: rgba(106, 109, 143, 1);
    margin-bottom: 24px;
  }
  
  .btn-upload-img {
    position: relative;
  }
  
  .opacity-uploader {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    top: 0;
    left: 0;
    z-index: 10;
    opacity: 0;
  }
  
  .card-carousel-item {
    padding: 16px;
    width: 100%;
    position: relative;
    // background: rgba(245, 245, 253, 1);
    background-color: rgb(218 217 247 / 22%);
    margin-bottom: 8px;
    border-radius: 8px;
  }
  
  .upload-img {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .btn-delete {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 7px 12px;
    color: rgba(106, 109, 143, 1);
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 1.4%;
    border-radius: 6px;
  
    &:hover {
      background-color: rgba(234, 234, 251, 1);
    }
  }
  
  .btn-upload-img {
    background-color: rgba(218, 217, 247, 1);
    padding: 8px 12px;
    border-radius: 6px;
    margin-right: 8px;
  
    &:hover {
      background-color: rgba(56, 64, 91, 1);
  
      .btn-text {
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  
  .btn-text {
    color: rgba(56, 64, 91, 1);
    font-size: 12px;
    font-weight: 500;
    margin-right: 10px;
  }
  
  .btn-add-card {
    background-color: rgba(218, 217, 247, 1);
    border-radius: 8px;
    width: 100%;
    padding: 8px 0;
    display: flex;
    justify-content: center;
    align-items: end;
  
    &:hover {
      background-color: rgba(56, 64, 91, 1);
  
      .btn-text {
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  
  .input-custom {
    position: relative;
    margin-bottom: 16px;
  }
  .error-message{
    position: absolute;
    bottom: -12px;
    right: 0;
    padding: 4px 8px;
    color: rgba(255, 255, 255, 1);
    background-color: rgba(235, 104, 84, 1);
    border-radius: 6px;
    font-size: 12px;
  }
  .red-border{
    border-color: rgba(235, 104, 84, 1);
  }
  </style>
    ../OnChain/utils.оы
    