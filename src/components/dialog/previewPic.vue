<template>
  <div class="previewPic-dialog">
    <img :src="ImgUrl" />
  </div>
</template>

<script>
export default {
  components: {},
  props: ["ImgUrlData"],
  data() {
    return {
      ImgUrl: this.ImgUrlData,
    };
  },
  watch: {
    ImgUrlData(val) {
      this.ImgUrl = val;
    },
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.previewPic-dialog {
  width: 100%;
  height: 560px;
  background: #f4f4f4;

  img {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
