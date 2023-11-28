<template>
  <div class="auth-wrapper">
    <AnimatedBackground />

    <div class="auth-container">
      <div class="header">
        <img
          class="logo cursor-pointer"
          @click="goLogin"
          src="@/assets/images/logo-ligth.svg"
          width="134"
        />
      </div>
      <div class="auth w-full">
        <div class="content">
          <slot />
        </div>
      </div>
      <div class="footer">
        <div>Copyrights Talentum 2023</div>
        <div class="socials cursor-pointer">
          Follow us
          <Icon
            icon="Twitter-Default"
            :size="20"
            size="20px"
            @click="goToSocial('https://twitter.com/TalentumID')"
          />
          <Icon
            icon="Discord-Default"
            :size="20"
            @click="goToSocial('https://discord.com/invite/kb83BGcDJP')"
          />
          <!--          <Icon icon="Telegram-Default" :size="20" />-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'auth',
  methods: {
    goToSocial(link) {
      window.open(link, '_blank');
    },
  },
};
</script>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
document.title = `Talentum Projects`;

const goLogin = () => {
  router.push('login');
};
</script>
<style scoped lang="scss">
.auth-wrapper {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
}

.auth-container {
  position: relative;
  z-index: 10;
  margin: 0;
  width: 100vw;
  display: flex;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  height: min-content;
  flex-direction: column;
  .header {
    position: absolute;
    top: 0;
    padding: 32px;
    width: 100vw;
  }
  .auth {
    max-width: 520px;
    min-height: 620px;
    margin: auto;
    background: $default-bg;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .content {
      padding: 60px 64px;
    }
  }
  .footer {
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    width: 100vw;
    div {
      font-family: 'Basis Grotesque Pro';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      font-feature-settings: 'zero' on;
      color: $white;
    }
    .socials {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      * {
        filter: invert(100%) sepia(98%) saturate(8%) hue-rotate(178deg) brightness(101%)
          contrast(101%);
      }
    }
  }
}
</style>
