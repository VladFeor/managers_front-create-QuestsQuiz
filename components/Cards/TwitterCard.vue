<template>
  <div
    v-if="
      (task && isPost && !small && props.task.verifier.twitter_tweet) ||
      (task && small && userTwitter && userTwitter.name) ||
      isTweetLink ||
      (isSpace && spaceTwitter)
    "
    class="twitter-card"
  >
    <div v-if="userTwitter && !isTweetLink && isFollow" class="twitter-card_header column">
      <div class="twitter-project w-100">
        <img v-if="userTwitter" :src="userTwitter.profile_image_url" alt="" />
        <img v-else :src="defaultBg" alt="" />

        <div class="twitter-project-name">
          <div class="twitter-project_title">
            {{ userTwitter && userTwitter.name ? userTwitter.name : '' }}
          </div>
          <div class="twitter-project_subtitle">@{{ task.verifier.twitter_follow }}</div>
        </div>
      </div>

      <TwittrActionBtn
        :isDisabled="status === 'available' || status === 'upcoming'"
        :title="`Follow ${userTwitter && userTwitter.name ? userTwitter.name : ''}`"
        @action="
          goTo(`https://twitter.com/intent/follow?screen_name=${task.verifier.twitter_follow}`)
        "
        type="twitter_follow"
        :isVeryfied="
          allTask && allTask.twitter_verifiers && allTask.twitter_verifiers['twitter_follow']
        "
      />
    </div>

    <div
      v-if="!isTweetLink && isPost && props.task.verifier.twitter_tweet"
      class="twitter-card_header column relative"
    >
      <iframe
        border="0"
        frameborder="0"
        style="display: block; width: 100%; height: 400px"
        width="100%"
        :src="`https://twitframe.com/show?url=${transformLink(props.task.verifier.twitter_tweet)}`"
      ></iframe>
    </div>

    <div
      v-if="task && isShowBtns && !small && !isTweetLink && isPost"
      class="twiter-card_btns column"
    >
      <TwittrActionBtn
        v-if="props.task.verifier.types.includes('twitter_like')"
        :isDisabled="status === 'available' || status === 'upcoming'"
        :title="`Like this post`"
        @action="
          goTo(`https://twitter.com/intent/like?tweet_id=${props.task.verifier.twitter_tweet_id}`)
        "
        iconName="like"
        type="twitter_like"
        :isVeryfied="
          allTask && allTask.twitter_verifiers && allTask.twitter_verifiers['twitter_like']
        "
      />
      <TwittrActionBtn
        v-if="props.task.verifier.types.includes('twitter_reply')"
        :isDisabled="status === 'available' || status === 'upcoming'"
        :title="`Reply this post`"
        @action="
          goTo(
            `https://twitter.com/intent/tweet?in_reply_to=${props.task.verifier.twitter_tweet_id}&text=${props.task.verifier.default_reply}`,
          )
        "
        iconName="reply"
        type="twitter_reply"
        :isVeryfied="
          allTask && allTask.twitter_verifiers && allTask.twitter_verifiers['twitter_reply']
        "
      />
      <TwittrActionBtn
        v-if="props.task.verifier.types.includes('twitter_retweet')"
        :isDisabled="status === 'available' || status === 'upcoming'"
        :title="`Retweet this post`"
        @action="
          goTo(
            `https://twitter.com/intent/retweet?tweet_id=${props.task.verifier.twitter_tweet_id}`,
          )
        "
        iconName="retweet"
        type="twitter_retweet"
        :isVeryfied="
          allTask && allTask.twitter_verifiers && allTask.twitter_verifiers['twitter_retweet']
        "
      />
    </div>

    <div v-if="isTweetLink" class="twitter-default-tweet">
      <TwittrActionBtn
        :isDisabled="status === 'available' || status === 'upcoming'"
        :title="`Tell about us`"
        @action="handleDefaultTweet"
        type="twitter_tweet"
        :isVeryfied="
          allTask && allTask.twitter_verifiers && allTask.twitter_verifiers['twitter_tweet']
        "
        :extraParameter="tweetUrl"
      />
      <div v-if="task.verifier.tweet_words" class="twitter-default-tweet_words">
        <div class="twitter-default-tweet_words-title">Be sure to include the following words:</div>
        <Badge
          v-for="(word, i) in task.verifier.tweet_words"
          :key="word + i"
          type="Transparent"
          :text="word"
        />
      </div>
      <div v-if="isTweetLinkActive" class="twitter-default-tweet_url">
        <div class="twitter-default-tweet_url-title">URL to your Tweet</div>
        <Input
          class="w-full"
          v-model="tweetUrl"
          withoutName
          placeholder="Input link to your tweet"
          @input="handleUrl"
        />
        <div class="error-message" v-if="!tweetValid && tweetUrl">Tweet link is invalid</div>
        <div class="error-message" v-if="!tweetUrl.trim()">Tweet link is required</div>
      </div>
    </div>
    <div v-if="spaceTwitter && !isTweetLink && !isPost && isSpace" class="twitter-card_header">
      <div class="twitter-project">
        <img v-if="spaceTwitter.creator" :src="spaceTwitter.creator.avatar" alt="" />

        <div class="twitter-project-name">
          <div class="twitter-project_title">
            {{
              spaceTwitter && spaceTwitter.creator && spaceTwitter.creator.name
                ? spaceTwitter.creator.name
                : ''
            }}
          </div>
          <div v-if="spaceTwitter.creator" class="twitter-project_subtitle">
            {{ spaceTwitter.creator.screen_name }}
          </div>
        </div>
      </div>
    </div>
    <TwittrActionBtn
      v-if="spaceTwitter && !isTweetLink && !isPost && isSpace"
      :isDisabled="status === 'available' || status === 'upcoming'"
      :title="`Join twitter space`"
      @action="goTo(task.verifier.twitter_space)"
      type="twitter_space"
      :isVeryfied="
        allTask && allTask.twitter_verifiers && allTask.twitter_verifiers['twitter_space']
      "
    />
  </div>
</template>

<script setup>
import defaultBg from '@/assets/images/default-avatar.png';
import axiosService from '~~/service/axiosService';
import { ref, onMounted } from 'vue';

onMounted(() => {
  if (props.isSpace) {
    spaceTwitterInfo();
  }

  if (props.isFollow) {
    userTwitterInfo();
  }
});
const transformLink = (link) => {
  const encodedUrl = encodeURIComponent(link);

  // Заменяем символы в закодированной строке, чтобы получить желаемый формат
  return encodedUrl
    .replace(/%3A/g, ':')
    .replace('x.com', 'twitter.com')
    .replace(/%2F/g, '/')
    .replace(/%3F/g, '?');
};
const spaceTwitter = ref(null);
const userTwitter = ref(null);
const postTwitter = ref(null);
const tweetUrl = ref('');
const tweetValid = ref(true);

const props = defineProps({
  task: { type: Object, default: null },
  allTask: { type: Object, default: null },
  img: { type: String, default: '' },
  status: { type: String, default: '' },
  isShowBtns: { type: Boolean, default: false },
  btnsDisabled: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
  isTweetLink: { type: Boolean, default: false },
  isTweetLinkActive: { type: Boolean, default: false },
  isFollow: { type: Boolean, default: false },
  isPost: { type: Boolean, default: false },
  isSpace: { type: Boolean, default: false },
});

const emit = defineEmits(['urlInput']);

const handleUrl = async (event) => {
  // try {
  if (typeof tweetUrl.value === 'string' && tweetUrl.value === '') {
    tweetValid.value = false;
    return;
  }
  if (!tweetUrl.value.trim()) {
    tweetValid.value = false;
    return;
  }
  const twitterTweetRegex =
    /^(?:https?:\/\/)?(?:www\.|m\.|mobile\.)?(twitter|x)\.com\/(?:#!\/)?\w+\/status\/(\d+)/i;

  const isValid = twitterTweetRegex.test(tweetUrl.value);

  if (!isValid) {
    tweetValid.value = false;
    return;
  }
  tweetValid.value = true;
  // const data = await axiosService.get(
  //   useRuntimeConfig().public.apiBase + `twitter/tweet/${tweetUrl.value.split('status/')[1]}`,
  // );
  // tweetValid.value = true;
  emit('urlInput', event.target.value);
  //   return true;
  // } catch (error) {
  //   tweetValid.value = false;
  //   return;
  // }
};

// const debouncedTweetLinkValidation = useDebounce(handleUrl, 300);

const goTo = (link) => {
  window.open(link, '_blank');
};

onMounted(() => {
  console.log('props.task twittercard', props.task);
});

const handleDefaultTweet = () => {
  if (!props.isTweetLinkActive) return;
  if (props.task.verifier.default_tweet) {
    window.open(`https://twitter.com/compose/tweet?text=${props.task.verifier.default_tweet}`);
  } else {
    window.open(`https://twitter.com/compose/tweet`);
  }
};

const spaceTwitterInfo = () => {
  if (props.task.verifier && props.task.verifier.twitter_space_id) {
    axiosService
      .get(
        useRuntimeConfig().public.apiBase + `twitter/space/${props.task.verifier.twitter_space_id}`,
      )
      .then((response) => {
        console.log('spaceTwitterInfo response', response);
        spaceTwitter.value = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }
};
const userTwitterInfo = () => {
  if (props.task.verifier && props.task.verifier.twitter_follow) {
    axiosService
      .get(useRuntimeConfig().public.apiBase + `twitter/user/${props.task.verifier.twitter_follow}`)
      .then((response) => {
        userTwitter.value = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }
};
</script>

<style lang="scss" scoped>
.twitter-post_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.error-message {
  color: $error-text;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: 8px;
  letter-spacing: 0.014em;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
}
.twitter-default-tweet {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // gap: 10px;
  &_url {
    display: flex;
    flex-direction: column;
    &-title {
      color: $section-title;
      font-family: Basis Grotesque Pro;
      font-size: 16px;
      font-style: bold;
      font-weight: 400;
      line-height: 32px; /* 160% */
    }
  }
  &_words {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 10px;

    color: $section-title;
    font-family: Basis Grotesque Pro;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px; /* 160% */
  }
}
.twiter-card_btns {
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  &.column {
    width: 100%;
    flex-direction: column;
  }
}
.twitter-tweet-text {
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 32px;
  hanging-punctuation: first last;
  font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on, 'ordn' on, 'ss04' on;
  color: #38405b;
}
.twitter-join {
  padding: 7px 12px 7px 16px;
  border-radius: 8px;
  background: #dad9f7;

  color: $default;
  font-family: Basis Grotesque Pro;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  &.click {
    width: fit-content;
    cursor: pointer;
  }
  a {
    margin-right: 10px;
  }
  // a {
  //   color: rgba(252, 102, 12, 1);
  //   text-decoration: underline;
  // }
}
.twitter-link {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 7px 12px 7px 16px;
  gap: 8px;
  width: fit-content;
  height: 40px;
  background: #dad9f7;
  border-radius: 8px;

  a {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
    color: #38405b;
  }
}
.twitter-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  gap: 24px;
  width: 600px;
  min-height: 74px;
  height: auto;
  background: #f5f5fd;
  border: 1px solid #dad9f7;
  border-radius: 8px;
  &_header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.column {
      gap: 24px;
      align-items: flex-start;
      flex-direction: column;
    }
  }
  .twitter-project {
    display: flex;
    align-items: center;
    gap: 12px;
    img {
      width: 48px;
      height: 48px;
      border-radius: 8px;
    }
    &_title {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #38405b;
    }
    &_subtitle {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      display: flex;
      align-items: center;
      letter-spacing: 0.014em;
      font-feature-settings: 'tnum' on, 'lnum' on, 'zero' on;
      color: #6a6d8f;
    }
  }
}
</style>
