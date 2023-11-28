<template>
  <div class="h-screen bg-cover bg-no-repeat bg-404 ">
      <div class="wrapper">
          <div class="scrolling">
              <p class="mr-[80px] scroll-element-1 inline text-[#DAD9F7] text-404 tracking-[.03em] text-center whitespace-nowrap">
                  404
              </p>
              <p class="mr-[80px] scroll-element-1 inline text-[#DAD9F7] text-404 tracking-[.03em] text-center whitespace-nowrap">
                  404
              </p>
              <p class="mr-[80px] scroll-element-1 inline text-[#DAD9F7] text-404 tracking-[.03em] text-center whitespace-nowrap">
                  404
              </p>
          </div>
      </div>
    <div class="flex justify-between pl-[64px] pr-[144px]">
        <div>
          <img class="logo" src="@/assets/images/logo.png" width="134" height="24" alt="logo"/>
        </div>
        <div class="flex flex-col">
          <h4 class="text-[#DAD9F7] font-normal text-2xl leading-[40px] w-[316px]">We couldn’t find the page you were looking for</h4>
          <nuxt-link to="/" class="py-2 px-12 rounded-lg bg-[#FC660C] text-white text-base leading-6 font-medium h-10 mt-10 w-[180px]">Back Home</nuxt-link>
        </div>
    </div>
    <div class="absolute bottom-4 px-8 w-full">
        <div class="flex justify-between">
            <div class="font-medium text-base leading-6 text-white h-6">Copyrights Talentum 2023</div>
            <div class="flex">
              <div class="font-medium text-base leading-6 text-white h-6">Follow Us</div>
              <a href="https://twitter.com/TalentumID">
                <img class="ml-[31px]" src="@/assets/icons/twitter-white.svg" width="16" height="16" alt="logo"/>
              </a>
              <a href="https://discord.com/invite/kb83BGcDJP">
                <img class="ml-[31px]" src="@/assets/icons/discord-white.svg" width="16" height="16" alt="logo"/>
              </a>
            </div>
        </div>

    </div>
  </div>
</template>

<script>
export default {
  name: '404',
};
</script>

<style scoped lang="scss">
  .text-404 {
    font-feature-settings: 'zero' on;
    font-style: normal;
    font-weight: 350;
    font-size: 400px;
    line-height: 400px;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    //-moz-animation: my-animation 10s linear infinite;
    //-webkit-animation: my-animation 10s linear infinite;
    //animation: my-animation 10s linear infinite;
  }
  .bg-404 {
    font-family: 'Basis Grotesque Pro' !important;
    background-image: url('@/assets/images/404bg.jpg') !important;
  }
  .wrapper {
    max-width: 100%;
    overflow: hidden;
  }
  .scrolling {
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    animation: scrolling 5s linear infinite;
  }
  @keyframes scrolling {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-35%, 0, 0);
    }
  }





</style>
