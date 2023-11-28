<template>
  <div class="con">
    <div class="block m-3" v-for="(icon, idx) in icons" :key="idx">
      <span :class="`icon-${icon}`"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'icons',
  data() {
    return {
      icons: [
        'home',
        'house',
        'image',
        'picture',
        'images',
        'pictures',
        'profile',
        'file2',
        'cart',
        'purchase',
        'coin-dollar',
        'money',
        'alarm',
        'time4',
        'floppy-disk',
        'save2',
        'user-plus',
        'user2',
        'user-minus',
        'user3',
        'user-check',
        'user4',
        'spinner6',
        'loading7',
        'spinner11',
        'loading12',
        'lock',
        'secure',
        'unlocked',
        'lock-open',
        'clipboard',
        'board',
        'cloud-download',
        'cloud2',
        'cloud-upload',
        'cloud3',
        'eye',
        'views',
        'bookmark',
        'ribbon',
        'bookmarks',
        'ribbons',
        'star-empty',
        'rate',
        'star-full',
        'rate3',
        'google',
        'brand2',
        'google-plus',
        'brand5',
        'google-drive',
        'brand9',
        'facebook',
        'brand10',
        'facebook2',
        'brand11',
        'youtube',
        'brand21',
        'Copy',
        'Dashboard',
        'Direction ',
        'Events',
        'Left-Arrow',
        'Left',
        'Mark',
        'Notification',
        'Project',
        'Requests',
        'Returned ',
        'Right-1',
        'Tik-Tik',
        'Usdt',
        'Managers ',
        'Projects ',
        'Social-1',
        'Social-2v',
        'Star-1',
        'Talents Tasks',
        'Vector',
        'arrow',
        'Blockchains-1',
        'Blockchains-2',
        'Blockchains-3',
        'Blockchains-4',
        'Blockchains-5',
        'Blockchains-6',
        'Blockchains',
        'Ellipse-550',
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.con {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
}
.block {
  padding: 20px 24px;
  background: $white;
  border: 1px solid $default-border;
  border-radius: 16px;
  width: fit-content;
  height: fit-content;
  align-content: start;
  align-items: center;
  * {
    color: $default;
    font-size: 24px;
  }
}
</style>
