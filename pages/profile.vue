<template>
  <div class="profile" v-if="user">
    <BannerUploader :banner="user.banner"></BannerUploader>
    <div class="naming w-full">
      <AvatarUploader :avatar="user.avatar"></AvatarUploader>
      <div class="info">
        <InputName v-model="name" :placeholder="user.name" @input="setName"></InputName>
        <SecurityButton></SecurityButton>
      </div>
    </div>
    <div class="info-block">
      <div class="content">
        <div class="stats">
          <StatCardSmall
            v-for="i in cards"
            :title="i.title"
            :value="i.value"
            profile
          ></StatCardSmall>
        </div>
        <div v-if="!isSuperAdmin">
          <div class="participant-title">Participating in the Projects</div>
          <div class="warning mb-2" v-if="user.project_members.length > 1">
            <icon icon="TM" :size="24" />You are Talentum Manager with defined roles in several
            projects.
          </div>

          <div
            v-if="isProjectOwner && user.project_members.length > 1"
            class="flex flex-col gap-[16px]"
          >
            <ProjectsOfManager
              v-for="project in user.project_members"
              :protocol="project.project ? project.project.name : ''"
              :bg="project.project.banner"
              :logo="project.project.logo"
              :role="project.role"
              :created_tasks="project.project.created_tasks || '0'"
              :overdue_tasks="project.project.overdue_tasks || '0'"
              :reviewed_tasks="project.project.reviewed_tasks || '0'"
              :id="project.project.id"
              :tags="project.project.tags"
            />
          </div>
          <div v-else class="flex flex-col gap-[16px]">
            <ProjectsOfManager
              v-for="project in user.project_members"
              :protocol="project.project ? project.project.name : ''"
              :bg="project.project?.banner"
              :logo="project.project?.logo"
              :tags="project.project.tags"
              :description="project.project?.description"
              :id="project.project?.id"
              :role="project.role"
            />
          </div>
        </div>
      </div>
      <div class="sidebar">
        <div class="personal-info">
          <div class="section">
            <span class="title">Country</span>
            <SelectWithSearch
              :options="countries"
              class="select"
              :default="user.country || 'Choose your country'"
              @input="editCountry"
              name="country"
            ></SelectWithSearch>
          </div>
          <div class="section">
            <span class="title">Languages</span>
            <MultiSelectLanguages
              :options="languages"
              :limit="3"
              :initial-selected-items="userLangs"
              @selected-items="editLanguages"
            ></MultiSelectLanguages>
          </div>
          <div class="section">
            <span class="title">Contacts</span>
            <div class="tags">
              <SocialTag
                v-for="i in socialButtons"
                :data="i"
                @connect="i.fn()"
                @remove="i.rm()"
                :key="i"
                :hide-remove="
                  socialButtons.filter((item) => !item.status).length >= socialButtons.length - 1
                "
              ></SocialTag>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DeleteProfile v-if="!isSuperAdmin"></DeleteProfile>
  </div>
</template>
<script setup>
import { useUserStore } from '~/store/user';
import AxiosService from '~/service/axiosService';
import { useAssetsStore } from '~/store/assets';
import { useDashboardStore } from '~/store/dashboard';
import InputName from '~/components/Inputs/InputName.vue';

import { computed, inject, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { useRouter } from 'vue-router';
const userStore = useUserStore();

const user = computed(() => userStore.getProfile);
const assetsStore = useAssetsStore();
let name = ref(user.value?.name);
let timeOut = ref(null);
const roles = inject('roles');
const nuxtApp = useNuxtApp();
const router = useRouter();
const route = useRoute();

const { isSuperAdmin, isProjectOwner } = roles;
const languages = computed(() => assetsStore.getLanguages);
const countries = computed(() => assetsStore.getCountries);
const stats = computed(() => useDashboardStore().getDashboardOverview);
onMounted(() => {
  userStore.userInfo();
  assetsStore.getCountriesAction();
  assetsStore.getLanguagesAction();
  useDashboardStore().getDashboardOverviewAction();
  userStore.getQRAction();

  const isTG = window.location.href.match(/[#\?\&]tgAuthResult=([A-Za-z0-9\-_=]*)$/);
  if (localStorage.social && route.query && !isTG) {
    const query = Object.entries(route.query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    AxiosService.get(
      useRuntimeConfig().public.apiBase + `auth/${localStorage.social}/callback/?${query}`,
    )
      .then(async () => {
        localStorage.social = '';
        await userStore.userInfo();
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
        await router.push('/profile');
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        localStorage.social = '';
      });
  } else if (localStorage.social && isTG) {
    AxiosService.get(
      useRuntimeConfig().public.apiBase +
        `auth/${localStorage.social}/callback/?tgAuthResult=${isTG[1]}`,
    )
      .then(async () => {
        localStorage.social = '';
        await userStore.userInfo();
        nuxtApp.$alert.show('Success', {
          type: 'success',
          timeout: 5000,
        });
        await router.push('/profile');
      })
      .catch((e) => {
        nuxtApp.$alert.show(e.response.data.message, {
          type: 'error',
          timeout: 5000,
        });
        localStorage.social = '';
      });
  }
});
const userLangs = computed(() =>
  user.value.languages.map((i) => {
    return {
      id: i.language.id,
      name: i.language.name,
    };
  }),
);
let cards = reactive([
  {
    value: user.value?.created_tasks,
    title: 'created tasks',
  },
  {
    value: user.value?.reviewed_tasks,
    title: 'reviewed tasks',
  },
  {
    value: user.value?.overdue_by_manager_tasks + user.value?.overdue_by_talent_tasks,
    title: 'overdue tasks',
  },
]);

console.log(user);

const setName = () => {
  clearTimeout(timeOut.value);
  timeOut.value = setTimeout(() => {
    AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
      name: name.value,
    })
      .then(() => {
        useUserStore().userProfile();

        window.dataLayer.push({
          event: 'project_profile_update',
        });
      })
      .catch((e) => console.log(e));
  }, 500);
};
async function editCountry(country) {
  if (country.id) {
    AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
      country_id: country.id,
    })
      .then(() => {
        useUserStore().userProfile();

        window.dataLayer.push({
          event: 'project_profile_update',
        });
      })
      .catch((e) => console.log(e));
  }
}
async function editLanguages(langs) {
  AxiosService.patch(useRuntimeConfig().public.apiBaseV2 + `profile`, {
    language_ids: langs.map((i) => {
      return i.id;
    }),
  })
    .then(() => {
      useUserStore().userProfile();

      window.dataLayer.push({
        event: 'project_profile_update',
      });
    })
    .catch((e) => console.log(e));
}
async function connectSocial(socialName) {
  window.dataLayer.push({
    event: 'project_social_update',
  });

  if (!getSocialName(socialName)) {
    localStorage.social = socialName;

    AxiosService.get(useRuntimeConfig().public.apiBase + `auth/${socialName}/redirect?uri=/profile`)
      .then((response) => {
        window.location.href = response.data.redirect_url;
      })
      .catch((e) => (localStorage.social = ''));
  }
}
async function removeSocical(socialName) {
  if (!socialName) {
    return;
  }
  AxiosService.delete(useRuntimeConfig().public.apiBase + `auth/${socialName}`)
    .then((response) => {
      useUserStore().userProfile();
    })
    .catch((e) => console.log(e));
}
const getSocialName = (social) => {
  return user.value?.social_providers.find((i) => i.provider_name.toLowerCase() === social);
};
const socialButtons = computed(() => [
  {
    id: 2,
    icon: 'Email-Default',
    status: getSocialName('google') || true,
    name: 'google',
    value: getSocialName('google') ? getSocialName('google').name : user.value?.email,
    fn: () => connectSocial('google'),
    rm: () => removeSocical(getSocialName('google') ? 'google' : null),
  },
  {
    id: 3,
    icon: 'Twitter-Default',
    status: getSocialName('twitter'),
    name: 'twitter',
    value: getSocialName('twitter')?.name,
    fn: () => connectSocial('twitter'),
    rm: () => removeSocical('twitter'),
  },
  {
    id: 4,
    icon: 'Discord-Default',
    status: getSocialName('discord'),
    name: 'discord',
    value: getSocialName('discord')?.name,
    fn: () => connectSocial('discord'),
    rm: () => removeSocical('discord'),
  },
  {
    id: 4,
    icon: 'Telegram-Default',
    status: getSocialName('telegram'),
    name: 'telegram',
    value: getSocialName('telegram')?.name,
    fn: () => connectSocial('telegram'),
    rm: () => removeSocical('telegram'),
  },
]);
</script>

<style scoped lang="scss">
.profile {
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  .naming {
    margin-top: 140px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .info {
      margin-left: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    margin-bottom: 40px;

    gap: 40px;
    .sidebar {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
      .personal-info {
        background: $white;
        border: 1px solid $default-border;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 24px;
        .section {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 16px;
          .select {
            width: 224px;
          }
          .tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .title {
            font-family: 'Basis Grotesque Pro';
            font-style: normal;
            font-weight: 500;
            font-size: 18px;
            line-height: 24px;
            font-feature-settings: 'zero' on;
            color: $secondary;
          }
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      max-width: 560px;
      width: 100%;
      gap: 24px;
      .stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }
      .participant-title {
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 40px;
        color: $section-title;
        margin-bottom: 8px;
      }
      .warning {
        background: $white;
        border: 1px solid $rounded-bg;
        border-radius: 8px;
        padding: 8px 16px;
        display: flex;
        gap: 16px;
        font-family: 'Basis Grotesque Pro';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        align-items: center;
        font-feature-settings: 'zero' on;
        color: $orange;
      }
    }
  }
}
</style>
