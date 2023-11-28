<template>
  <div class="refferal-card">
    <div class="title">Your Refferal Link</div>
    <div class="description">
      Invite Talent to the task using your link and you’ll get 1% of their earnings.
    </div>
    <div class="code">
      <span class="text">http://talentum.id/ba022kOCv123ybsawcvs90 </span>
      <div class="shadow-copy"><span class="icon-facebook"></span></div>
    </div>
    <div class="social-control">
      <div><span class="icon-facebook mr-2" />facebook</div>
      <div><span class="icon-facebook mr-2" />facebook</div>
      <div><span class="icon-facebook mr-2" />facebook</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RefferalCard',
};
</script>

<style scoped lang="scss">
.refferal-card {
  max-width: 360px;
  padding: 24px;
  background: $refferal-bg;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  font-family: 'Basis Grotesque Pro';
  font-style: normal;

  .title {
    font-weight: 400;
    font-size: 32px;
    line-height: 40px;

    color: $default;
  }
  .description {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: $default;
  }

  .code {
    margin-top: 24px;
    width: 100%;
    height: 40px;
    padding: 9px;
    background: $white;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: $default;
    align-items: center;
    display: flex;

    .text {
      overflow: hidden;
    }
    .shadow-copy {
      width: 40px;
      height: 16px;
      align-items: center;
      display: flex;
      justify-content: flex-end;
      box-shadow: -19px 0px 15px 6px $white;
    }
  }
  .social-control {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      background: #38405b;
      border-radius: 8px;
      padding: 4px 8px;
      color: $white;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      align-items: center;
    }
  }
}
</style>
