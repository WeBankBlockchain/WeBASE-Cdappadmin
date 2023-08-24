<template>
  <div class="config">
    <div class="step">
      <el-steps :active="active" finish-status="success">
        <el-step title="证书图片配置"></el-step>
        <el-step title="查询页配置"></el-step>
        <el-step title="查询结果页配置"></el-step>
        <el-step title="导入数据"></el-step>
      </el-steps>
    </div>
    <certificate-config-img v-if="active===1" @jumpPage="jumpPage"></certificate-config-img>
    <certificate-config-query v-if="active===2" @jumpPage="jumpPage"></certificate-config-query>
    <certificate-config-result v-if="active===3" @jumpPage="jumpPage"></certificate-config-result>
    <certificate-config-import v-if="active===4" @jumpPage="jumpPage"></certificate-config-import>
  </div>
</template>

<script>
import certificateConfigImg from "./certificateConfigImg.vue";
import certificateConfigQuery from "./certificateConfigQuery.vue";
import certificateConfigResult from "./certificateConfigResult.vue";
import certificateConfigImport from "./certificateConfigImport.vue";
export default {
  components: {
    certificateConfigImg,
    certificateConfigQuery,
    certificateConfigResult,
    certificateConfigImport,
  },
  data() {
    return {
      active: 1,
    };
  },
  created() {},
  methods: {
    jumpPage(step) {
      this.active = step;
    },
  },
};
</script>
<style scoped>
.config {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: white;
  min-height: calc(100vh - 100px);
}
.step {
  padding: 0 250px;
}
.demo-configData {
  padding: 32px 380px;
}
</style>
