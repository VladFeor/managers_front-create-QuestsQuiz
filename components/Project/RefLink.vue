<template>
  <div class="ref-btn" @click="copy()">
    <Icon icon="Managers" size="24px" class="icon" />
    <div class="w-[75%]">Invite Talents</div>
    <Icon icon="Create" size="24px" class="icon" />
  </div>
</template>
<script setup>
const nuxtApp = useNuxtApp();

const props = defineProps({
  code: {
    type: String,
    default: 'code',
  },
});
const copy = () => {
  const link = useRuntimeConfig().public.apiLink;
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(`${link}referrals/` + props.code);
    nuxtApp.$alert.show('Link successfully copied to clipboard!', {
      type: 'success',
      timeout: 5000,
    });

    window.dataLayer.push({
      event: 'project_talent_invite',
    });
  } else {
    unsecuredCopyToClipboard(`${link}referrals/` + props.code);
  }
};

const unsecuredCopyToClipboard = (link) => {
  const textArea = document.createElement('textarea');
  textArea.value = link;
  document.body.appendChild(textArea);
  textArea.classList.add('copy-container');
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    nuxtApp.$alert.show('Link successfully copied to clipboard!', {
      type: 'success',
      timeout: 5000,
    });
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
};
</script>
<style scoped lang="scss">
.ref-btn {
  width: 100%;
  background: $orange;
  display: flex;
  padding: 8px 16px;
  margin-bottom: 24px;
  gap: 16px;
  align-self: stretch;
  border-radius: 8px;
  color: $white;
  font-variant-numeric: lining-nums tabular-nums ordinal slashed-zero;
  font-feature-settings: 'dlig' on, 'ss04' on;
  font-family: 'Basis Grotesque Pro';
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 160% */
  align-items: center;
  cursor: pointer;
  &:hover {
    background: $orange-active;
  }
  .icon {
    filter: invert(99%) sepia(1%) saturate(2%) hue-rotate(233deg) brightness(105%) contrast(200%);
  }
}
</style>
