<template>
  <ContentBox class="h-auto p-6 bg-white w-full">
    <div class="flex justify-between">
      <template v-if="project && project.blockchain">
        <div class="flex items-center justify-center" v-if="isProjectOwner || isSuperAdmin">
          <Icon v-if="project.blockchain" :name="`${project.blockchain.icon}-Default`" :size="18" />
          <BlockchainSelectSmall
            class="min-w-[140px] w-auto"
            :options="blockChainOptions"
            :default="project.blockchain"
            isEdit
            type="project"
            main-styles="!h-auto ml-1"
            selected-style="border-0"
            arrow-style="top-[10px]"
            @input="updateBlockchain"
            string-length="10"
            string-length-first="10"
          />
        </div>
        <div class="flex items-center justify-center" v-else>
          <Icon v-if="project.blockchain" :name="`${project.blockchain.icon}-Default`" :size="18" />
          <span class="text-[#38405B] font-medium text-sm leading-5 h-5 ml-[10px]">{{
            project.blockchain.name
          }}</span>
        </div>
      </template>
      <div class="flex items-center justify-center">
        <span class="text-[#38405B] font-medium text-xs leading-5 h-5">
          On Talentum since {{ dateSince }}
        </span>
      </div>
    </div>
    <div
      v-if="isSuperAdmin || isProjectOwner"
      class="mt-10 font-normal leading-8 text-xl text-[#1A1D29] break-words"
    >
      <Editor
        @update="updateDescription"
        :description="project.description"
        text-class="editor-projects"
        placeholder="Enter the project description"
        :is-edit="true"
      />
    </div>
    <div
      v-else
      class="mt-10 font-normal leading-8 text-xl text-[#1A1D29] break-words"
      v-html="project.description"
    />
    <div class="mt-7">
      <Categories
        expand
        show-all-tags
        align="justify-start"
        cat-bg="#FFFFFF"
        cat-txt-color="#38405B"
        :with-delete="isSuperAdmin || isProjectOwner"
        :with-add-more="isSuperAdmin || isProjectOwner"
        :categories="project.tags"
        :options="allTags"
        :styles="{
          border: '1px solid #EAEAFB',
          color: '#38405B',
          height: '32px',
          marginBottom: '3px',
        }"
        @setNewCategories="updateCategories"
        @deleteCategory="updateCategory"
      />
    </div>
    <div
      class="mt-6"
      v-if="
        socials.some((item) => item.status) ||
        newSocialButtons.filter(
          (item2) => !project.social_links?.some((item) => item.social_link.id === item2.id),
        ).length
      "
    >
      <h5 class="text-[#6A6D8F] text-lg leading-6">Contacts</h5>
      <div class="flex flex-wrap mt-4 gap-y-[4px]">
        <SocialTag
          class="mr-2 mb-2"
          v-for="social in socials"
          extra-classes="h-8"
          :data="social"
          :key="social"
          :hide-remove="!isProjectOwner"
          :connectable="isProjectOwner"
          href-to-link
          show-name
          @connect="social.fn()"
          @remove="social.rm()"
        />
        <SocialTagEditable
          v-for="social in newSocialButtons.filter(
            (item2) => !project.social_links?.some((item) => item.social_link.id === item2.id),
          )"
          :key="social.name"
          :project="project"
          :social="social"
          :is-url="true"
          :connectable="isProjectOwner"
          :isPM="isProjectManager"
          @update="updateSocialTag(social, $event)"
          @connect="connectSocial(social.name.toLowerCase())"
        />
      </div>
    </div>
  </ContentBox>
</template>

<script setup>
import { SocialTag, Categories, ContentBox } from '@/components';
import Icon from '~/components/Icon.vue';
import { useBlockchainsStore } from '~/store/blockchains';
import { useProjectsStore } from '~/store/projects';
import AxiosService from '~/service/axiosService';
import axios from 'axios';
import { useNuxtApp } from '#app';
import { useUserStore } from '~/store';
onMounted(() => {
  blockchainsStore.getBlockchainsAction();
});
const nuxtApp = useNuxtApp();
const emits = defineEmits(['update']);
const roles = inject('roles');
const { isSuperAdmin, isProjectOwner, isProjectManager } = roles;
const props = defineProps(['project', 'dateSince', 'socialButtons', 'allSocialButtons', 'allTags']);
const blockchainsStore = useBlockchainsStore();
const projectsStore = useProjectsStore();
const blockChainOptions = computed(() => blockchainsStore.getBlockchains);
const updateBlockchain = (data) => {
  if (data.id !== props.project.blockchain.id) {
    emits('update', { key: 'blockchain', value: data });
  }
};

const removeSocialTag = (social) => {
  if (props.socialButtons.length > 1 || socials.value.find((i) => i.status)) {
    let value = props.socialButtons
      .filter((p) => p.id !== social.id)
      .map((p) => ({ id: p.id_link, content: p.value, social_link: { id: p.id, name: p.name } }));
    emits('update', { key: 'social_links', value: value });
  } else {
    nuxtApp.$alert.show(
      'You need to have at least 1 social link. Try to add another and then delete this',
      {
        type: 'error',
        timeout: 2500,
      },
    );
  }
};
async function connectSocial(socialName) {
  if (!isProjectOwner.value) return;
  localStorage.social = socialName;
  AxiosService.get(
    useRuntimeConfig().public.apiBase +
      `projects/auth/${socialName}/redirect?uri=/projects&project_id=${
        useUserStore().getUserProjectId || props.project.id
      }`,
  )
    .then((response) => {
      window.location.href = response.data.redirect_url;
    })
    .catch((e) => (localStorage.social = ''));
}
const updateCategory = (data) => {
  emits('update', { key: 'tags', value: data.value });
};
const updateCategories = (data) => {
  emits('update', { key: 'tags', value: data });
};
const updateDescription = (data) => {
  emits('update', { key: 'description', value: data });
};

const updateSocialTag = (social, data) => {
  if (!isProjectOwner.value) return;
  let content = data.value;
  let protocol = content.slice(0, 8);
  if (!protocol.includes('http://') && !protocol.includes('https://')) {
    content = 'https://' + content;
  }

  let value = props.socialButtons.map((p) =>
    p.id === social.id
      ? { id: p.id_link, content: content, social_link: { id: p.id, name: p.name } }
      : { id: p.id_link, content: p.value, social_link: { id: p.id, name: p.name } },
  );

  if (!value.some((p) => p.id === social.id)) {
    value.push({
      id: social.id_link ?? null,
      content: content,
      social_link: {
        id: social.id,
        name: social.name,
      },
    });
  }

  emits('update', { key: 'social_links', value: value });
};

const newSocialButtons = computed(() => {
  if (props.allSocialButtons) {
    return props.allSocialButtons.filter(

      (i) =>
        i.name === 'LinkedIn' ||
        i.name === 'Website' ||
        i.name === 'Discord' ||
        i.name === 'Reddit' ||
        i.name === 'Telegram',
    );
  }
});
console.log('newSocialButtons', newSocialButtons);
async function removeSocical(socialName) {
  if (!isProjectOwner.value) return;

  AxiosService.delete(
    useRuntimeConfig().public.apiBase +
      `projects/${useUserStore().getUserProjectId}/auth/${socialName}`,
  )
    .then(() => {
      nuxtApp.$alert.show('Success', {
        type: 'success',
        timeout: 5000,
      });
      projectsStore.getProjectAction(useUserStore().getUserProjectId);
    })
    .catch((e) => console.log(e));
}

const getSocialName = (social) => {
  if (props.socialButtons) {
    return props.socialButtons.find((i) => i.status.toLowerCase() === social);
  }
};

const getSocialStatus = (social) => {
  if (props.project && props.project.social_providers) {
    return props.project.social_providers.find((i) => i.provider_name.toLowerCase() === social);
  }
};
const getWebName = (social) => {
  if (props.socialButtons) {
    return props.socialButtons.find((i) => i.status.toLowerCase() === social);
  }
};
const getDiscordName = (link) => {
  const defaultCodePattern =
    /(https?:\/\/)?(discord(?:(?:app)?\.com\/invite|\.gg)(?:\/invite)?)\/(?<code>[\w-]{2,255})/;
  if (link) {
    const insertCode = link.match(defaultCodePattern);
    if (insertCode)
      try {
        const { data } = axios.get(`https://discord.com/api/invites/${insertCode.groups.code}`);
        console.log(data);
        return data.guild.name;
      } catch (e) {
        return link;
      }
  }
  return null;
};
const socials = computed(() =>
  [
    {
      id: 3,
      icon: 'Twitter-Default',
      status: getSocialStatus('twitter'),
      name: getSocialStatus('twitter') ? getSocialStatus('twitter').name : 'Twitter',
      value: getSocialName('twitter')?.value,
      fn: () => connectSocial('twitter'),
      rm: () => removeSocical('twitter'),
    },

    // {
    //   id: 2,
    //   icon: 'Telegram-Default',
    //   status: getSocialStatus('telegram'),
    //   name: getSocialStatus('telegram') ? getSocialStatus('telegram').name : 'Telegram',
    //   value: getSocialName('telegram')?.value,
    //   fn: () => connectSocial('telegram'),
    //   rm: () => removeSocical('telegram'),
    // },
    // {
    //   id: 4,
    //   icon: 'Reddit-Default',
    //   status: getSocialStatus('reddit'),
    //   name: getSocialStatus('reddit') ? getSocialStatus('reddit').name : 'Reddit Account',
    //   value: getSocialName('reddit')?.value,
    //   fn: () => connectSocial('reddit'),
    //   rm: () => removeSocical('reddit'),
    // },
    {
      id: 5,
      icon: 'Web',
      status: getWebName('website'),
      name: getWebName('website')?.value || 'Website',
      value: getWebName('website')?.value,
      fn: () => {},
      rm: () => removeSocialTag(getWebName('website')),
    },
    {
      id: 5,
      icon: 'Telegram-Default',
      status: getWebName('telegram'),
      name: getWebName('telegram')?.value || 'Telegram',
      value: getWebName('telegram')?.value,
      fn: () => {},
      rm: () => removeSocialTag(getWebName('telegram')),
    },
    {
      id: 5,
      icon: 'Discord-Default',
      status: getWebName('discord'),
      name: getWebName('discord')?.value || 'Invite Link Discord',
      value: getWebName('discord')?.value,
      fn: () => {},
      rm: () => removeSocialTag(getWebName('discord')),
    },
    {
      id: 5,
      icon: 'LinkedIn-Default',
      status: getWebName('linkedin'),
      name: getWebName('linkedin')?.value || 'LinkedIn',
      value: getWebName('linkedin')?.value,
      fn: () => {},
      rm: () => removeSocialTag(getWebName('linkedin')),
    },
    {
      id: 5,
      icon: 'Reddit-Default',
      status: getWebName('reddit'),
      name: getWebName('reddit')?.value || 'reddit',
      value: getWebName('reddit')?.value,
      fn: () => {},
      rm: () => removeSocialTag(getWebName('reddit')),
    },
  ].filter((item) => (item.id === 5 && item.status) || item.id !== 5),
);

console.log('socials=', socials);
</script>

<style scoped lang="scss"></style>
