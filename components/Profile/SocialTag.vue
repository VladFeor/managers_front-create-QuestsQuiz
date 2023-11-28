<template>
  <span :class="`tag mr-2 mb-2 ${extraClasses}`" v-if="data.status" @click="goToLink(data)">
    <Icon class="icon" :icon="iconName" :size="24"></Icon>
    {{
      showName
        ? reduceStringLength(displayName(data.name), stringLength)
        : reduceStringLength(data.value, stringLength)
    }}

    <Icon
      v-if="!hideRemove"
      class="remove-tag"
      @click.stop="$emit('remove')"
      icon="Cancel"
      :size="16"
    ></Icon>
  </span>

  <span
    v-if="!data.status && connectable"
    :class="`${extraClasses}`"
    class="tag mr-2 mb-2 connect"
    @click.stop="$emit('connect')"
  >
    <Icon class="icon" :icon="data.icon" :size="24"></Icon>
    Connect {{ capitalizedName }}
  </span>
</template>

<script>
import Icon from '~/components/Icon.vue';
import { reduceStringLength } from '../../util/helpers';

export default {
  name: 'SocialTag',
  components: { Icon },
  props: {
    hrefToLink: {
      type: Boolean,
      default: false,
    },
    showName: {
      type: Boolean,
      default: false,
    },
    extraClasses: {
      type: String,
      default: {},
    },
    hideRemove: {
      type: Boolean,
      default: false,
    },
    connectable: {
      type: Boolean,
      default: true,
    },
    stringLength: {
      type: Number,
      default: 30,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    capitalizedName() {
      return this.data.name.charAt(0).toUpperCase() + this.data.name.slice(1);
    },
    iconName() {
      return this.data.icon;
    },
  },
  methods: {
    reduceStringLength,
    ensureProtocol(url) {
      if (url) {
        const hasProtocol = url.startsWith('http://') || url.startsWith('https://');

        if (!hasProtocol) {
          return `http://${url}`;
        }

        return url;
      }
    },
    goToLink(data) {
      let value = data.status.value ?? data?.status?.name;
      let provider = data?.status?.provider_name ?? data.status.name;
      let url = this.getLinkByProviderName(provider, value);
      console.log(data);
      window.open(this.ensureProtocol(url) || data.value, '_blank').focus();
    },
    displayName(url) {
      if (this.data.status.name.toLowerCase() === 'linkedin') {
        const companyRegex = /\/company\/([^/]+)\//;
        const companyMatch = url.match(companyRegex);
        if (companyMatch) {
          return companyMatch[1];
        } else {
          return url;
        }
      } else if (this.data.status.name.toLowerCase() === 'reddit') {
        const subredditPattern = /\/r\/([A-Za-z0-9_]+)/;
        const matchResult = url.match(subredditPattern);
        if (matchResult && matchResult.length > 1) {
          const subredditName = matchResult[1];
          return `r/${subredditName}`;
        } else {
          return url;
        }
      } else if (this.data.status.name.toLowerCase() === 'website' && url) {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
      } else {
        return url;
      }
    },
    getLinkByProviderName(provider, value) {
      if (provider === 'telegram') {
        return 'https://t.me/' + value.replace(' ', '');
      } else if (provider === 'discord_bot') {
        return 'https://discord.com/channels/@' + value.replace(' ', '');
      } else if (provider === 'twitter') {
        return 'https://twitter.com/' + value.replace(' ', '');
      } else if (provider.toLowerCase() === 'website' || provider.toLowerCase() === 'linkedin') {
        return value;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tag {
  display: flex;
  align-items: center;
  background: $default-bg;
  border: 1px solid $default-badge-border;
  border-radius: 8px;
  cursor: pointer;
  padding: 5px 8px;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  font-feature-settings: 'zero' on;
  color: $default;
  width: max-content;
}
.icon {
  margin-right: 10px;
}
.connect {
  background: $white;
}
.remove-tag {
  margin-left: 10px;
  cursor: pointer;
}
</style>
