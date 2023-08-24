<template>
  <div class="previewResult-dialog">
    <div class="certificateInfo">
      <img class="certBg" src="../../assets/image/bg_certificate.png" />
      <img class="cert" :src="previewCertResultData.picPreview" />
      <span class="certificateTitle">{{previewCertResultData.title}}</span>
      <div class="certificateInfo_bottom"></div>
    </div>
    <div class="certificateFileds">
      <div class="filed" v-for="(item,index) in previewCertResultData.enableFields">
        <span>{{JSON.parse(item).filedNameZh}}</span>
        <span>{{JSON.parse(item).filedDemo}}</span>
        <!-- <span></span> -->
      </div>
      <!-- <div class="filed">
        <span>上链哈希</span>
        <span>0xc8740e8a21b5c9a7f7474650dc513ceb7f14ccc4a0cbeee4cb8a6f0aaf378982</span>
      </div> -->
    </div>
    <div class="certificateInfo_top"></div>
    <div class="logo"><img :src="previewCertResultData.bottomLog" /></div>
    <div class="support">
      <span>{{previewCertResultData.explainDoc}}</span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["previewCertResultData"],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.previewResult-dialog {
  width: 100%;
  height: 812px;
  background: #f4f4f4;

  .certificateInfo {
    width: 100%;
    height: 305px;
    overflow: hidden;
    position: relative;
    .certBg {
      width: 100%;
      height: auto;
      background-repeat: no-repeat;
    }
    .cert {
      width: 239px;
      height: 168px;
      position: absolute;
      left: 68px;
      top: 79px;
      border: 1px solid #fff;
      background: url(<path-to-image>), lightgray 50% / cover no-repeat;
    }

    span {
      position: absolute;
      display: inline-block;
      width: 100%;
      top: 12px;
      left: 0;
      color: #262a32;
      text-align: center;
      font-family: PingFang SC;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: 22px;
      /* 146.667% */
    }

    .certificateInfo_bottom {
      width: 100%;
      height: 24px;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      border-radius: 20px 20px 0 0;
    }
  }

  .certificateFileds {
    width: 100%;
    padding: 0 30px;
    background: #fff;
    min-height: 300px;

    .filed {
      padding-bottom: 10px;
      display: flex;

      span:nth-child(1) {
        width: 75px;
        display: inline-block;
        color: var(--grey-3, #787b84);
        font-family: PingFang SC;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;

        /* 166.667% */
      }

      span:nth-child(2) {
        display: inline-block;
        max-width: 230px;
        color: var(--grey-2, #525660);
        font-family: PingFang SC;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        /* 166.667% */
      }
    }
  }

  .certificateInfo_top {
    width: 100%;
    height: 24px;
    background-color: #fff;
    border-radius: 0 0 20px 20px;
  }

  .support {
    padding: 0 32px;
    // position: absolute;
    // bottom: 60px;
    margin-top: 10px;
    width: 100%;
    text-align: center;
    color: #999;
    text-align: center;
    font-family: PingFang SC;
    font-size: 9px;
    font-style: normal;
    font-weight: 400;
    transform: scale(0.75);
    line-height: 20px;
    letter-spacing: 1px;
    word-spacing: 3px;
  }

  .logo {
    padding: 0 32px;
    // position: absolute;
    // bottom: 90px;
    margin-top: 20px;
    width: 100%;
    text-align: center;

    img {
      height: 20px;
      width: auto;
      background-repeat: no-repeat;
    }
  }
}

::v-deep .el-dialog__body {
  padding: 0;
}
</style>
