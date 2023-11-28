<template>
  <div class="show-btn" @click="showProfile()">
    <Icon icon="View" :size="24"></Icon>
  </div>
  <BaseModal
    :width="600"
    :top="10"
    :rightCustom="10"
    :bottom="10"
    customHeight="auto"
    :visible="isOpen"
    btnLeft
    @close="showProfile"
    ><div class="relative">
      <SmallBanner :banner="profile.banner || defaultBg"></SmallBanner>
      <div class="container">
        <div class="header">
          <SmallAvatar
            :avatar="profile.avatar || defaultBg"
            :rating="profile.average_point"
          ></SmallAvatar>
          <div class="bio">
            <span class="name">{{ profile.name }}</span>
            <span class="status"
              >On Talentum since {{ dateTransformer(profile.registered_at) }}</span
            >
          </div>
        </div>
        <div class="content">
          <div class="flex flex-col gap-y-[24px]">
            <div class="flex flex-col gap-y-[12px]">
              <div class="flex gap-x-[12px] items-center">
                <stat-card-small
                  class="w-[168px]!"
                  title="joined projects"
                  :value="profile.project_members_count"
                  icon="Star"
                ></stat-card-small>
                <LevelCard :info="profile" class="w-[346px]! h-[120px]!" reading></LevelCard>
              </div>
              <div class="flex items-center gap-x-[12px]">
                <stat-card-small
                  class="w-[168px]!"
                  title="in progress"
                  icon="Mark"
                  :value="profile.tasks_in_work_count"
                ></stat-card-small>
                <stat-card-small
                  class="w-[168px]!"
                  title="completed"
                  :value="profile.tasks_is_done_count"
                  icon="Tik-Tik"
                ></stat-card-small>
                <stat-card-small
                  class="w-[168px]!"
                  title="USDT earned"
                  icon="Usdt"
                  :value="profile.total_payout"
                ></stat-card-small>
              </div>
            </div>
            <ButtonDark text="View Full Profile" @click="goToTalent()"></ButtonDark>
            <div class="section-info" v-if="profile.activities && profile.activities.length">
              <span class="title">Directions</span>
              <div class="flex gap-[8px] flex-wrap">
                <Badge
                  v-for="i in profile.activities"
                  :key="i.activity.id"
                  :text="i.activity.name"
                  :type="getBadgeTypeByName(i.activity.name)"
                ></Badge>
              </div>
            </div>
            <div class="section-info" v-if="profile.skills && profile.skills.length">
              <span class="title">Skills</span>
              <div class="flex gap-[8px] flex-wrap">
                <Badge
                  type="chip"
                  v-for="i in profile.skills"
                  :key="i.skill.id"
                  :text="i.skill.name"
                ></Badge>
              </div>
            </div>
            <div class="section-info" v-if="profile.country">
              <span class="title">Country</span>
              <div class="flex gap-[8px] flex-wrap">
                <Badge type="chip" :text="profile.country"></Badge>
              </div>
            </div>
            <div class="section-info" v-if="profile.languages && profile.languages.length">
              <span class="title">Languages</span>
              <div class="flex gap-[8px] flex-wrap">
                <Badge
                  type="chip"
                  v-for="i in profile.languages"
                  :key="i.language.id"
                  :text="i.language.name"
                ></Badge>
              </div>
            </div>
            <div class="section-info" v-if="profile.bio">
              <span class="title">Bio</span>
              <span class="bio">
                {{ profile.bio.replace(/<[^>]*>/g, '') }}
              </span>
            </div>
            <div class="section-info" v-if="profile.email">
              <span class="title">Email Address</span>
              <div class="flex gap-[8px] flex-wrap">
                <Badge type="chip" :text="profile.email"></Badge>
              </div>
            </div>
            <div class="section-info" v-if="profile.wallet">
              <span class="title">Wallet Address</span>
              <div class="flex gap-[8px] flex-wrap">
                <Badge type="chip" :text="profile.wallet"></Badge>
              </div>
            </div>
            <div class="section-info" v-if="socialButtons.length">
              <span class="title">Social</span>
              <div class="flex gap-[8px] flex-wrap">
                <Badge
                  type="chip"
                  v-for="i in socialButtons"
                  :key="i.id"
                  :text="i.value"
                  :icon="i.icon"
                ></Badge>
              </div>
            </div>
            <div class="flex flex-col gap-y-[40px]" v-if="profile.twitter">
              <hr />
              <div class="flex items-center justify-between">
                <div class="flex gap-x-[8px] items-center">
                  <Icon icon="Twitter-Default" :size="24"></Icon>Twitter
                </div>
                <Badge type="chip" :text="`@${profile.twitter.twitter_handle}`"></Badge>
              </div>
              <div class="flex items-center gap-x-[12px]">
                <stat-card-small
                  class="w-[168px]!"
                  title="Followers"
                  :value="profile.twitter.followers"
                ></stat-card-small>
                <stat-card-small
                  class="w-[168px]!"
                  title="Following"
                  :value="profile.twitter.following"
                ></stat-card-small>
                <stat-card-small
                  class="w-[168px]!"
                  title="Tweets"
                  :value="profile.twitter.tweets"
                ></stat-card-small>
              </div>
              <div class="section-info" v-if="profile.twitter.bio">
                <span class="title">Bio on Twitter</span>
                <span class="bio">
                  {{ profile.twitter.bio.replace(/<[^>]*>/g, '') }}
                </span>
              </div>
              <div
                class="section-info"
                v-if="profile.twitter.labels && profile.twitter.labels.length"
              >
                <span class="title">Labels</span>
                <div class="flex gap-[8px] flex-wrap">
                  <Badge type="chip" v-for="i in profile.twitter.labels" :key="i" :text="i"></Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
<script setup>
import { getBadgeTypeByName } from '~/util/helpers';
import defaultBg from '@/assets/images/default-avatar.png';
import { computed } from 'vue';
const router = useRouter();

const props = defineProps({
  profile: {
    type: Object,
    default: () => {},
  },
});
const isOpen = ref(false);
const showProfile = () => {
  isOpen.value = !isOpen.value;
};
const goToTalent = () => {
  let talentId = props.profile.id;
  router.replace(`/talent/${talentId}`);
};
const dateTransformer = (date) => {
  let newDate = new Date(date);
  let options = { year: 'numeric', month: 'long', day: 'numeric' };
  return newDate.toLocaleDateString('en-US', options);
};
const getSocialName = (social) => {
  return props.profile?.social_providers?.find((i) => i.provider_name.toLowerCase() === social);
};
const socialButtons = computed(() =>
  [
    {
      id: 3,
      icon: 'Twitter-Default',
      status: getSocialName('twitter'),
      name: 'twitter',
      value: getSocialName('twitter')?.name,
    },
    {
      id: 4,
      icon: 'Discord-Default',
      status: getSocialName('discord'),
      name: 'discord',
      value: getSocialName('discord')?.name,
    },
    {
      id: 5,
      icon: 'Telegram-Default',
      status: getSocialName('telegram'),
      name: 'telegram',
      value: getSocialName('telegram')?.name,
    },
    {
      id: 7,
      icon: 'Reddit-Default',
      status: getSocialName('reddit'),
      name: 'telegram',
      value: getSocialName('reddit')?.name,
    },
  ].filter((i) => i.status),
);
</script>
<style scoped lang="scss">
.show-btn {
  display: flex;
  width: 32px;
  height: 32px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: $default-bg;
  &:hover {
    background: $default-badge-border;
  }
}
.container {
  padding: 56px 32px 20px;
  display: flex;
  flex-direction: column;
  font-family: 'Basis Grotesque Pro';
  gap: 40px;
  font-variant-numeric: slashed-zero;
  .header {
    display: flex;
    align-items: flex-end;
    gap: 24px;
    .bio {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
      .name {
        color: $section-title;
        font-size: 32px;
        font-style: normal;
        font-weight: 400;
        line-height: 40px;
      }
      .status {
        color: $secondary;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0.168px;
      }
    }
  }
  .content {
    .section-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
      .title {
        color: $section-title;
        font-variant-numeric: slashed-zero;
        font-family: 'Basis Grotesque Pro';
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px; /* 142.857% */
      }
      .bio {
        color: $section-title;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        text-align: left;
      }
    }
  }
}
</style>
