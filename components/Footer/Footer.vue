<template>
  <footer class="footer" :class="{ mobile: isMobile() }">
    <div class="title">Copyrights Talentum {{ new Date().getFullYear() }}</div>
    <div class="info">
      <span>Follow us</span>
      <div class="socials cursor-pointer">
        <Icon
          name="Twitter-Default"
          :size="26"
          @click="goToSocial('https://twitter.com/TalentumID')"
        />
        <Icon
          name="Discord-Default"
          :size="26"
          @click="goToSocial('https://discord.com/invite/kb83BGcDJP')"
        />
      </div>
    </div>
  </footer>
</template>

<script>
import windowSizeMixin from '@/mixins/windowSizeMixin';
export default {
  mixins: [windowSizeMixin],
  name: 'Footer',
  methods: {
    goToSocial(link) {
      window.open(link, '_blank');
    },
  },
};
</script>

<style scoped lang="scss">
.info {
  display: flex;
  align-items: center;
  gap: 25px;
  span {
    font-family: 'Basis Grotesque Pro';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: $secondary;
  }
}
.socials {
  display: flex;
  align-items: center;
  gap: 30px;
  img {
    width: 16px;
    height: 14px;
  }
}
.title {
  display: flex;
  align-items: center;

  font-family: 'Basis Grotesque Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: $secondary;
}
.footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: $default-bg;
  height: 72px;
  max-height: 72px;
  border-top: 1px solid $default-border;
  position: relative;
  z-index: 1000;
  margin-top: 102px;
  padding: 0 32px 0 32px;
  &.mobile {
    flex-direction: column;
    padding: 10px 20px;
  }
}
</style>
