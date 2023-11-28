<template>
  <div class="border-y border-y-[#DAD9F7] my-9 py-9">
    <p class="font-medium text-base leading-6 text-[#1A1D29]">Project Logo</p>
    <div class="mt-3 flex">
      <ProjectAvatar @set-file="setAvatarFile" />
      <div class="text-[#6A6D8F] text-xs font-medium leading-4 h-12 ml-3">
        This image will be used for featuring the project <br />
        on different pages of the Talentum Platform. <br />
        Recommended size: 320 x 320.
      </div>
    </div>
    <div class="mt-8">
      <p class="font-medium text-base leading-6 text-[#1A1D29]">Project Name</p>
      <p class="mt-1 font-medium text-[#6A6D8F] text-xs leading-4 h-4">
        Public name of the project, it can be edited in the future.
      </p>
      <input
        type="text"
        placeholder="Enter the project name"
        class="mt-3 bg-white outline-none h-10 border border-[#DAD9F7] text-[#1A1D29] py-[7px] px-[12px] rounded-lg w-full"
        v-model="data.name"
      />
    </div>
    <div class="mt-8">
      <p class="font-medium text-base leading-6 text-[#1A1D29]">Description</p>
      <p class="mt-1 font-medium text-[#6A6D8F] text-xs leading-4 h-4">
        These are the instructions to complete the task.
      </p>
      <div class="mt-3">
        <Editor
          :description="data.description || ''"
          @update="setDescription"
          :isError="
            validationErrors.description.isError && validationErrors.description.isTriggered
          "
          :errorText="validationErrors.description.text"
        />
      </div>
    </div>
    <div class="mt-8">
      <p class="font-medium text-base leading-6 text-[#1A1D29]">Categories</p>
      <div class="mt-[17px]">
        <Categories
          :expand="true"
          with-select
          align="justify-start"
          cat-bg="#FFFFFF"
          @set-category="setCategory"
          :categories="tagsOptions"
          :styles="{
            marginLeft: '8px',
            marginBottom: '8px',
            border: '1px solid',
            borderColor: '#DDEDF0',
            cursor: 'pointer',
          }"
        />
      </div>
    </div>
    <div class="mt-8 py-8 border-t border-t-[#DAD9F7]">
      <p class="font-medium text-base leading-6 text-[#1A1D29]">Project Email Address</p>
      <p class="mt-1 font-medium text-[#6A6D8F] text-xs leading-4 h-4">
        Specify the project email address.
      </p>
      <div class="mt-3">
        <EmailInput
          with-icon
          without-label
          v-model="data.email"
          placeholder="Enter the project email"
          @error="error = $event"
        />
      </div>
    </div>
    <div>
      <p class="font-medium text-base leading-6 text-[#1A1D29]">Website</p>
      <p class="mt-1 font-medium text-[#6A6D8F] text-xs leading-4 h-4">
        Specify the project website.
      </p>
      <div class="mt-3" v-if="data.social_links && data.social_links.length > 0">
        <InputWithIcon
          placeholder="https://"
          icon="Web"
          :key="1"
          :is-custom-error="!websiteCorrent"
          class="field"
          @input="checkWebsiteCorrect"
          v-model="data.social_links[data.social_links.length - 1].content"
        />
        <div class="text-red-800 text-xs h-1">
          <span v-if="!websiteCorrent">Please enter a valid website url</span>
        </div>
      </div>
    </div>
    <!--    <div class="mt-8">-->
    <!--      <p class="font-medium text-base leading-6 text-[#1A1D29]">Social Media</p>-->
    <!--      <p class="mt-1 font-medium text-[#6A6D8F] text-xs leading-4 h-4">-->
    <!--        Specify all social networks associated with the project.-->
    <!--      </p>-->
    <!--      <template v-if="data.social_links && data.social_links.length > 0">-->
    <!--        <template v-for="(social, i) in data.social_links" :key="social.id">-->
    <!--          <div class="mt-3" v-if="i + 1 < data.social_links.length">-->
    <!--            <InputWithIcon-->
    <!--              :placeholder="social.placeholder"-->
    <!--              :icon="`${social.name}-Default`"-->
    <!--              :key="1"-->
    <!--              class="field"-->
    <!--              v-model="social.content"-->
    <!--            />-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </template>-->
    <!--    </div>-->
    <div class="mt-8">
      <p class="font-medium text-base leading-6 text-[#1A1D29]">Medium</p>
      <p class="mt-1 font-medium text-[#6A6D8F] text-xs leading-4 h-4">
        Specify the project username on medium.com where the articles will be taken from.
      </p>
      <div class="mt-3">
        <InputWithIcon
          placeholder="@projectname"
          icon="Medium-Default"
          class="field"
          v-model="data.medium_username"
          :regex="usernameMedium()"
          :error="'Please enter a valid medium url'"
        />
      </div>
    </div>
    <div class="mt-8">
      <p class="font-medium text-base leading-6 text-[#1A1D29]">
        Blockchain
        <Icon name="Info-1px" :size="23" />
      </p>
      <p class="mt-1 font-medium text-[#6A6D8F] text-xs leading-4 h-4">
        This is the project where your task will appear.
      </p>
      <div class="mt-3">
        <Select
          tasty
          v-if="blockchainsLoaded && blockChainOptions"
          :height="380"
          :options="blockChainOptions"
          :scrollHorizontalHidden="true"
          :selected-label-style="`h-[32px] text-base flex justify-start font-normal items-center ${
            data.blockchain_id <= 0 ? 'text-[#AAA7CC]' : 'text-[#38405B]'
          }`"
          class="w-[240px] text-base"
          selected-style="border border-[#DAD9F7]"
          arrow-style="!top-[17px]"
          @input="setBlockChain"
          :default="defaultBlockchain"
        />
      </div>
    </div>
    <div class="mt-8">
      <p class="font-medium text-base leading-6 text-[#1A1D29]">
        Pool
        <Icon name="Info-1px" :size="23" />
      </p>
      <p class="mt-1 font-medium text-[#6A6D8F] text-xs leading-4 h-4">
        Choose the token and specify the amount.
      </p>
      <div class="mt-3">
        <!-- <CoinRewardSelect
          @amountChange="setCoinInputValue($event)"
          :amount="''"
          @input="setCoinOption"
          :options="coinsOptions"
          :default="defaultCoin"
        /> -->
        <InputWithSelect
          :options="coinsOptions"
          :default="defaultCoin"
          :input="0"
          name-prop="symbol"
          @setOption="setCoinOption"
          @setInputValue="setCoinInputValue"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ProjectAvatar, Categories, InputWithSelect } from '@/components';
import { computed, reactive, ref, defineProps } from 'vue';
import { useBlockchainsStore } from '~/store/blockchains';
import { useCoinsStore, useProjectsStore } from '~/store';
import { isValidHttpUrl } from '~/util/helpers';
import { usernameMedium } from '@/util/validations';

const props = defineProps({
  websiteErrorMsg: {
    type: Boolean,
    default: false,
  },
});
const coinsStore = useCoinsStore();
const blockchainsStore = useBlockchainsStore();
const projectsStore = useProjectsStore();

const defaultCoin = ref(null);
const blockchainId = ref(0);
const defaultBlockchain = ref(null);

onMounted(() => {
  defaultCoin.value = coinsOptions.value[0];
});

const blockchainsLoaded = computed(() => blockchainsStore.blockchainsLoaded);
const blockChainOptions = ref([
  { id: 0, name: 'Select Blockchain' },
  ...blockchainsStore.getBlockchains,
]);
const socialLinkOptions = computed(() => projectsStore.getSocialLinks);
const tagsOptions = computed(() => projectsStore.getTags.map((t) => ({ tag: t })));
const coinsOptions = computed(() => coinsStore.getCoins);
watch(
  coinsOptions,
  (value) => {
    if (value && value.length) {
      defaultCoin.value = value[0];
    }
  },
  { deep: true, instant: true },
);
const isImagesError = ref(false);
const validationErrors = reactive({
  description: {
    isTriggered: false,
    isError: false,
    text: '',
  },
});
const websiteCorrent = ref(true);
const error = ref(null);
const data = ref({
  logo: null,
  name: '',
  email: '',
  medium_username: '',
  description: '',
  blockchain_id: 0,
  pool_amount: 0,
  coin_type_id: 1,
  tags: [],
  social_links: socialLinkOptions.value.map((l) => ({
    id: l.id,
    name: l.name,
    content: '',
  })),
});
const emits = defineEmits(['setFullProjectData']);

const checkWebsiteCorrect = () => {
  let links = data.value.social_links;
  if (links && links.length > 0 && links[links.length - 1].content) {
    websiteCorrent.value = isValidHttpUrl(links[links.length - 1].content);
  }
};
const setBlockChain = (blockChain) => {
  if (blockChain.id !== 0) {
    blockchainId.value = blockChain.id;
    defaultBlockchain.value = blockChain;
    blockChainOptions.value = blockChainOptions.value.filter((b) => b.id !== 0);
    // console.log(blockChainOptions.value.filter((b) => b.id !== 0))
  }
  data.value.blockchain_id = blockChain.id;
};

watch(blockchainId, (value) => {
  if (value) {
    coinsStore.getCoinsAction(value);
  }
});

const handleImageError = (event) => {
  isImagesError.value = event;
};
const setDescription = (value) => {
  data.value.description = value;
};
const setCoinOption = (value) => {
  data.value.coin_type_id = value.id;
};
const setCoinInputValue = (value) => {
  data.value.pool_amount = value;
};
const setCategory = (categories) => {
  data.value.tags = categories;
};
const setAvatarFile = (event) => {
  data.value.logo = event.data;
};
watch(
  data,
  (newData) => {
    emits('setFullProjectData', newData);
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="scss"></style>
