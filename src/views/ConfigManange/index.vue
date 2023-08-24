<template>
  <div class="app-container">
    <div class="header">
      <div class="addConfig" @click="addConfig">
        <img class="logo" src="../../assets/image/add_logo.svg" />
        <span class="addSpan">新建配置</span>
      </div>
    </div>
    <div class="configData">
      <el-table :data="tableData" style="width:100%">
        <el-table-column prop="certConfigId" label="配置证书ID" width="150">
        </el-table-column>
        <el-table-column prop="certName" label="配置证书名称">
        </el-table-column>
        <el-table-column prop="certState" label="状态">
          <template slot-scope="scope">
            <span :class="classSpan(scope.row)">{{textStatus(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pic" label="查看证书图片">
          <template slot-scope="scope">
            <el-button type="text" size="middle" @click="viewCertList(scope.row)" v-if="scope.row.isCertPic===1">查看生成的所有证书</el-button>
            <span v-else>未上传数据</span>
          </template>
        </el-table-column>
        <el-table-column prop="look" label="预览模板">
          <template slot-scope="scope">
            <el-button type="text" size="middle" @click="preViewImg(scope.row)">证书图片</el-button>
            <el-button type="text" size="middle" @click="preViewQuery(scope.row)">查询页</el-button>
            <el-button type="text" size="middle" @click="preViewResult(scope.row)">查询结果</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="opreate" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="middle" @click="modify(scope.row)" v-if="scope.row.certReal&&scope.row.certState===0">编辑</el-button>
            <el-button type="text" size="middle" @click="copyConfig(scope.row)">拷贝配置项</el-button>
            <el-button type="text" size="middle" class="delete" @click="deleteData(scope.row)" v-if="scope.row.certReal&&scope.row.certState===0">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="previewPicShow" width="800px" height="560px" :append-to-body="true" class="dialogPreviewPic" v-if='previewPicShow' center>
      <preview-pic :ImgUrlData="previewCertPicData"></preview-pic>
    </el-dialog>
    <el-dialog class="previewQuery" :visible.sync="previewQueryShow" title="证书查询" width="375px" :append-to-body="true" v-if='previewQueryShow' center>
      <preview-query :previewCertQueryData="previewCertQueryData"></preview-query>
    </el-dialog>
    <el-dialog :visible.sync="previewResultShow" title="查询结果" width="375px" :append-to-body="true" class="previewQuery" v-if='previewResultShow' center>
      <preview-result :previewCertResultData="previewCertResultData"></preview-result>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCertList,
  previewCertPic,
  getQueryPage,
  getQueryResultPage,
  deleteCert,
  copeCert,
} from "@/api/table";
import previewPic from "@/components/dialog/previewPic.vue";
import PreviewQuery from "@/components/dialog/previewQuery.vue";
import previewResult from "@/components/dialog/previewResult.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    previewPic,
    PreviewQuery,
    previewResult,
  },
  data() {
    return {
      tableData: [],
      previewPicShow: false,
      previewQueryShow: false,
      previewResultShow: false,
      previewCertPicData: null,
      previewCertQueryData: null,
      previewCertResultData: null,
    };
  },
  computed: {
    ...mapGetters(["certificate_Id", "step"]),
  },
  watch: {},
  mounted() {
    this.getCertListData();
  },
  methods: {
    ...mapMutations("user", [
      "SET_CERTIFICATE_ID",
      "SET_STEP",
      "REMOVE_CERTIFICATE_ID",
    ]),
    addConfig() {
      this.REMOVE_CERTIFICATE_ID();
      this.$router.push("/addConfigManange");
    },
    modify(row) {
      this.SET_CERTIFICATE_ID(row.certConfigId);
      this.$router.push("/addConfigManange");
    },
    getCertListData() {
      getCertList().then((res) => {
        if (res.code === 0) {
          this.tableData = res.result;
          this.total = res.totalCount;
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    classSpan(row) {
      let handleClass = "";
      switch (row.certState) {
        case 0:
          handleClass = "unchaining";
          break;
        case 1:
          handleClass = "chaining";
          break;
        case 2:
          handleClass = "released";
          break;
        default:
          handleClass = "none";
      }
      return handleClass;
    },
    textStatus(row) {
      let text = "";
      switch (row.certState) {
        case 0:
          text = "未上链";
          break;
        case 1:
          text = "已上链";
          break;
        case 2:
          text = "已发布";
          break;
        default:
          text = "none";
      }
      return text;
    },
    preViewImg(row) {
      const reqData = {
        id: row.certConfigId,
      };
      previewCertPic(reqData).then((res) => {
        if (res.code === 0) {
          this.previewCertPicData = res.result;
          this.previewPicShow = true;
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    preViewQuery(row) {
      const reqData = {
        certConfigId: row.certConfigId,
      };
      getQueryPage(reqData).then((res) => {
        if (res.code === 0) {
          this.previewCertQueryData = res.result;
          this.previewQueryShow = true;
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    preViewResult(row) {
      const reqData = {
        certConfigId: row.certConfigId,
      };
      getQueryResultPage(reqData).then((res) => {
        if (res.code === 0) {
          this.previewCertResultData = res.result;
          this.previewResultShow = true;
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    deleteData(row) {
      this.$confirm("此操作将删除整个证书配置, 是否继续?", "提示", {
        customClass: "messageBox_coChain",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // type: "warning",
      }).then(() => {
        this.delete_way(row);
      });
    },
    delete_way(row) {
      const reqData = {
        id: row.certConfigId,
      };
      deleteCert(reqData).then((res) => {
        if (res.code === 0) {
          this.$message({
            message: "删除配置成功",
            type: "success",
            duration: 2000,
          });
          this.getCertListData();
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    viewCertList(row) {
      this.SET_CERTIFICATE_ID(row.certConfigId);
      this.$router.push("/createCertList");
    },
    copyConfig(row) {
      const reqData = {
        certConfigId: row.certConfigId,
      };
      copeCert(reqData).then((res) => {
        if (res.code === 0) {
          this.SET_CERTIFICATE_ID(res.result);
          this.$router.push("/addConfigManange");
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  width: 100%;
  height: 100%;
  background: #fff;
  min-height: calc(100vh - 100px);
  .addConfig {
    height: 32px;
    background-color: #3071f2;
    border-radius: 4px;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
    padding: 0 16px;
    display: inline-block;
    .addSpan {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: left;
      color: white;
    }

    .logo {
      background-size: cover;
      background-repeat: no-repeat;
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: text-bottom;
      margin-right: 8px;
    }
  }
  .configData {
    margin-top: 24px;
    .delete {
      color: red;
    }
    .unchaining {
      color: var(--grey-1, #262a32);
      /* text 12 R */
      font-family: PingFang SC;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 166.667% */
      display: inline-block;
      padding: 0 8px;
      background-color: #edf0f6;
      border-radius: 2px;
    }
    .chaining {
      color: var(--grey-1, #ffffff);
      /* text 12 R */
      font-family: PingFang SC;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 166.667% */
      display: inline-block;
      padding: 0 8px;
      background-color: #52b81f;
      border-radius: 2px;
    }
    .released {
      color: var(--grey-1, #ffffff);
      /* text 12 R */
      font-family: PingFang SC;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 166.667% */
      display: inline-block;
      padding: 0 8px;
      background-color: #c79d5e;
      border-radius: 2px;
    }
  }
}

::v-deep .el-table th,
.el-table tr {
  background-color: #f6f7fb;
  color: var(--grey-1, #262a32);
  font-family: PingFang SC;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
  line-height: 22px;
  /* 157.143% */
}

::v-deep .el-table__header tr,
::v-deep .el-table__header th {
  padding: 0;
  height: 42px;
}
.dialogPreviewPic ::v-deep .el-dialog__header {
  padding: 0;
  .el-dialog__headerbtn {
    right: -40px;
    top: -40px;
    .el-dialog__close {
      font-size: 32px;
      color: white;
    }
  }
}
::v-deep .el-dialog__body {
  padding: 0;
}
.previewQuery ::v-deep .el-dialog__header {
  padding: 12px 0;

  .el-dialog__title {
    color: var(--grey-1, #262a32);
    text-align: center;
    /* Medium / Headline - 16 */
    font-family: PingFang SC;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    /* 125% */
  }

  .el-dialog__headerbtn {
    top: 15px;
  }
}
</style>
