<template>
  <div class="previewQuery-dialog">
    <div class="banner">
      <img :src="previewCertQueryData.banner" />
      <div class="banner_bottom"></div>
    </div>
    <div class="org">
      <i class="icon"></i>
      <span class="cert">发证机构:</span>
      <span>{{ previewCertQueryData.certOrg}}</span>
    </div>
    <div class="input">
      <div class="enter">
        <span>{{ previewCertQueryData.searchHint}}</span>
        <i class="icon"></i>
      </div>
    </div>
    <div class="logo"><img :src="previewCertQueryData.bottomLog" /></div>
    <div class="support">
      <span>{{ previewCertQueryData.explainDoc}}</span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["previewCertQueryData"],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.previewQuery-dialog {
  width: 100%;
  height: 812px;

  .banner {
    width: 100%;
    height: 235px;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      background-repeat: no-repeat;
    }

    .banner_bottom {
      width: 100%;
      height: 24px;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      border-radius: 10px 10px 0 0;
    }
  }

  .org {
    padding: 0 32px;
    color: var(--grey-3, #787b84);
    text-align: center;
    /* 14 regular */
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    /* 157.143% */
    .icon {
      width: 22px;
      height: 22px;
      background-image: url("../../assets/image/icon_org.png");
      background-size: cover;
      display: inline-block;
      vertical-align: bottom;
    }

    .cert {
      padding: 0 12px 0 3px;
    }
  }

  .input {
    padding: 24px 32px;

    .enter {
      border-radius: 8px;
      border: 2px solid #336cc2;
      background: #fff;
      height: 50px;
      line-height: 50px;
      padding: 0 12px;
      position: relative;

      i {
        width: 28px;
        height: 28px;
        background-image: url("../../assets/image/icon_search.png");
        background-size: cover;
        display: inline-block;
        position: absolute;
        right: 12px;
        top: 8px;
      }
    }
  }

  .support {
    padding: 0 32px;
    position: absolute;
    bottom: 50px;
    width: 100%;
    text-align: center;
    color: #999;
    font-family: PingFang SC;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    transform: scale(0.83);
  }

  .logo {
    padding: 0 32px;
    position: absolute;
    bottom: 75px;
    width: 100%;
    text-align: center;

    img {
      height: 26px;
      width: auto;
      background-repeat: no-repeat;
    }
  }
}

::v-deep .el-dialog__body {
  padding: 0;
}
</style>
