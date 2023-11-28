<template>
  <div class="export-menu" :class="{ open: isMenuOpen }">
    <button class="export-btn" @click="toggleMenu">
      <span>{{ title }}</span>
      <div v-if="!loading">
        <img v-if="isMenuOpen" :src="downloadWhiteIcon" alt="" />
        <img v-else :src="downloadIcon" alt="" @click.stop="toggleMenu" />
      </div>
      <span v-else class="loader"></span>
    </button>
    <div v-if="isMenuOpen" class="wrapper-menu">
      <div class="wrapper-int" v-for="option in options" :key="option.name">
        <div class="export-title_wrapper" @click="handleOpenSubMenu(option)">
          <div class="export-title_arrow-wrapper">
            <span class="export-title">{{ option.name }}</span>
            <div @click.stop="handleOpenSubMenu(option)" class="arrow-icon">
              <Icon v-if="option.isSubMenuVisible" name="Up" :size="24" />
              <Icon v-else name="Down" :size="24" />
            </div>
          </div>

          <ul v-if="option.isSubMenuVisible" class="menu-list">
            <li
              v-for="listOption in option.list"
              :key="listOption.title"
              @click="handleOptionClick(listOption)"
            >
              {{ listOption.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import downloadIcon from '@/assets/icons/Download.svg';
import downloadWhiteIcon from '@/assets/icons/Download-white.svg';
import axiosService from '~/service/axiosService';
import { useUserStore } from '~/store/user';

const userStore = useUserStore();

const isMenuOpen = ref(false);

const user = computed(() => userStore.getProfile);

const props = defineProps({
  title: { type: String, default: '' },
  options: { type: Array, default: [] },
  handleOpenSubMenu: { type: Function, default: (event) => console.log('click handleOpenSubMenu') },
  id: { type: Number, default: null },
  exportFunction: { type: Function, default: () => console.log('click') },
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const loading = ref(false);
const getSocialName = (social) => {
  console.log('user.value?.social_providers', user.value?.social_providers);
  return user.value?.social_providers.find((i) => i.provider_name.toLowerCase() === social);
};

async function connectSocial(socialName, redirect_url) {
  localStorage.social = socialName;

  axiosService
    .get(useRuntimeConfig().public.apiBase + `auth/${socialName}/redirect?uri=/${redirect_url}`)
    .then((response) => {
      window.location.href = response.data.redirect_url;
    })
    .catch((e) => (localStorage.social = ''));
}

const handleOptionClick = async (option) => {
  loading.value = true;
  if (option.type === 'google_sheet' && !getSocialName('google')) {
    await connectSocial('google', option.redirect_url).then(() => (loading.value = false));
  } else {
    let exportData;
    if (props.id) {
      exportData = await props.exportFunction(props.id, option.type, option.table);
      loading.value = false;
    } else {
      exportData = await props.exportFunction(option.type, option.table);
      loading.value = false;
    }
    console.log('exportData', exportData);
    if (option.type === 'pdf' || option.type === 'csv') {
      const url = URL.createObjectURL(exportData);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exported_data.${option.type === 'csv' ? 'xlsx' : option.type}`;
      a.click();
      URL.revokeObjectURL(url);
      loading.value = false;
    }
  }
  isMenuOpen.value = false;
};

const handleWrapperClick = (event) => {
  if (!event.target.closest('.export-menu')) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleWrapperClick);
});
onUnmounted(() => {
  document.removeEventListener('click', handleWrapperClick);
});
</script>

<style lang="scss" scoped>
.export-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.arrow-icon {
  cursor: pointer;
}
.export-title_arrow-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background: #eaeafb;
    border-radius: 8px;
  }
}
.wrapper-int {
  width: 100%;
}
.export-title {
  display: block;
  width: 100%;
  padding: 4px 8px;
  color: $default;
  font-variant-numeric: slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #eaeafb;
  }
}
.export-menu {
  position: relative;
  display: flex;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  height: fit-content;
  color: $default;
  font-variant-numeric: slashed-zero;
  font-family: Basis Grotesque Pro;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  &:hover {
    border-radius: 8px;
    background: #eaeafb;
  }
  &.open {
    border-radius: 8px;
    background: $default;
    color: $white;
  }
}

.export-title_wrapper {
  width: 100%;
}

.wrapper-menu {
  display: flex;
  width: 180px;
  padding: 8px 4px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  position: absolute;
  top: 40px;
  right: 0;
  z-index: 100;

  border-radius: 8px;
  background: $white;
  box-shadow: 0px 4px 16px 0px rgba(56, 64, 91, 0.24);
}

.menu-list {
  list-style-type: none;
  padding-left: 5px;
  li {
    color: $default;
    font-variant-numeric: slashed-zero;
    font-family: Basis Grotesque Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }
  //   width: 100%;
  //   position: absolute;
  //   top: 100%;
  //   left: 0;
  //   list-style: none;
  //   padding: 0;
  //   margin: 0;
  //   background-color: #fff;
  //   border: 1px solid #ccc;
  //   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menu-list li {
  padding: 8px 8px;
  cursor: pointer;
}

.menu-list li:hover {
  border-radius: 8px;
  background: #eaeafb;
}
.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;
}
.loader::before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  inset: 0px;
  border-radius: 50%;
  border: 2px solid $default;
  animation: prixClipFix 2s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}
</style>
