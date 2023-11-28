<template>
  <div>
    <div v-if="loading" class="custom-loading-screen">
      <img :src="defaultLogo" alt="" />
    </div>

    <NuxtLayout>
      <NuxtLoadingIndicator>
        <CustomLoader />
      </NuxtLoadingIndicator>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import defaultLogo from '@/assets/images/default-loader-img.png';

const nuxtApp = useNuxtApp();
const loading = ref(true);
nuxtApp.hook('page:start', () => {
  console.log('APP START');
  loading.value = true;
});
nuxtApp.hook('page:finish', () => {
  console.log('APP FINISH');
  loading.value = false;
});
const gtagId = useRuntimeConfig().public.gtagId;
console.log('GTAG-TEST');
function gtag() {
  window.dataLayer.push(arguments);
}

window.dataLayer = window.dataLayer || [];

gtag('js', new Date());
gtag('config', gtagId);

useHead({
  script: [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${gtagId}`,
      async: true,
    },
  ],
});
onMounted(() => {
  if (loading.value) {
    setTimeout(() => {
      loading.value = false;
    }, 10000);
  }
});
</script>
<script type="text/javascript">
(function (m, e, t, r, i, k, a) {
  m[i] =
    m[i] ||
    function () {
      (m[i].a = m[i].a || []).push(arguments);
    };
  m[i].l = 1 * new Date();
  (k = e.createElement(t)),
    (a = e.getElementsByTagName(t)[0]),
    (k.async = 1),
    (k.src = r),
    a.parentNode.insertBefore(k, a);
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

ym('92649834', 'init', {});
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-5PKW9LWC');
</script>
<style lang="scss">
.custom-loading-screen {
  width: 100%;
  height: 100vh;
  position: absolute;
  z-index: 9999999999999;
  display: flex;
  justify-content: center;
  align-items: center;

  @keyframes scale-in-out {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
    }
  }
  img {
    animation: scale-in-out 1s infinite;
    width: 50px;
    height: auto;
  }
  // background-color: red;
  background-color: #f5f5fd;
}
</style>
