<template>
  <div class="queryConfig">
    <el-form :model="queryData" :rules="rules" ref="queryData" class="demo-queryData">
      <el-form-item label="banner" prop="banner">
        <el-checkbox-group v-model="queryData.banner" v-show="false"></el-checkbox-group>
        <el-upload class="avatar-uploader" action="#" :on-change="handlePreview" :limit="1" :file-list="fileList" :on-exceed="handleExceed" :auto-upload='false'>
          <img v-if="queryData.banner" :src="queryData.banner" class="avatar">
          <div v-else>
            <img src="../../assets/image/add_img.svg" class="" />
            <span>上传图片</span>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="发证机构" prop="certOrg">
        <el-input v-model="queryData.certOrg"></el-input>
      </el-form-item>
      <el-form-item label="搜索字段选择" prop="filedSerial">
        <!-- <el-input v-model="queryData.searchHint"></el-input> -->
        <el-select v-model="queryData.filedSerial" placeholder="请选择搜索字段" @change="produceSearchHint">
          <el-option v-for="item in queryData.fields" :key="item.filedSerial" :label="item.filedNameZh" :value="item.filedSerial">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面底部logo" prop="bottomLog">
        <el-checkbox-group v-model="queryData.bottomLog" v-show="false"></el-checkbox-group>
        <el-upload class="avatar-uploader" action="#" :on-change="handlePreviewLogo" :limit="1" :file-list="fileLogoList" :on-exceed="handleExceed" :auto-upload='false'>
          <img v-if="queryData.bottomLog" :src="queryData.bottomLog" class="avatar">
          <div v-else>
            <img src="../../assets/image/add_img.svg" class="" />
            <span>上传图片</span>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="技术支持说明文案" prop="explainDoc">
        <el-input v-model="queryData.explainDoc"></el-input>
      </el-form-item>
      <el-form-item style="margin-top:32px" class="btn">
        <el-button type="primary" @click="next('queryData')">下一步</el-button>
        <el-button type="primary" @click="saveConfig('queryData')">保存配置</el-button>
        <el-button @click="lastStep('queryData')">上一步</el-button>
        <el-button @click="Preview('queryData')"><img src="../../assets/image/eye.svg" />预览模板</el-button>
      </el-form-item>
    </el-form>
    <el-dialog class="previewQuery" :visible.sync="previewQueryShow" title="证书查询" width="375px" :append-to-body="true" v-if='previewQueryShow' center>
      <preview-query :previewCertQueryData="previewCertQueryData"></preview-query>
    </el-dialog>
  </div>
</template>
  
<script>
import { getQueryPage, saveQueryPage } from "@/api/table";
import previewQuery from "@/components/dialog/previewQuery";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    previewQuery,
  },
  data() {
    return {
      queryData: {
        banner: "",
        certOrg: "",
        searchHint: "",
        bottomLog: "",
        explainDoc: "",
        fields: [],
        filedSerial: "",
      },
      CertificateQueryData: null,
      previewCertQueryData: null,
      previewQueryShow: false,
      fileList: [],
      fileLogoList: [],
      rules: {
        certOrg: [
          { required: true, message: "请输入发证机构", trigger: "blur" },
        ],
        banner: [
          {
            required: true,
            message: "请上传证书底图",
            trigger: "change",
          },
        ],
        filedSerial: [
          { required: true, message: "请选择搜索项", trigger: "change" },
        ],
        bottomLog: [
          {
            required: true,
            message: "请上传底部Logo",
            trigger: "change",
          },
        ],
        explainDoc: [
          {
            required: true,
            message: "请输入技术支持说明文案",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["certificate_Id", "step"]),
  },
  created() {
    this.queryCertificateQueryData();
  },
  methods: {
    ...mapMutations("user", ["SET_CERTIFICATE_ID", "SET_STEP", "SET_LOADING"]),
    queryCertificateQueryData() {
      const reqData = {
        certConfigId: this.certificate_Id,
      };
      getQueryPage(reqData).then((res) => {
        if (res.code === 0) {
          if (!res.result) {
            return false;
          }
          this.queryData = res.result;
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    Preview(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.preViewImg();
        } else {
          return false;
        }
      });
    },
    preViewImg() {
      this.previewCertQueryData = this.queryData;
      this.previewQueryShow = true;
    },
    saveConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveCertQuery_Way();
        } else {
          return false;
        }
      });
    },
    saveCertQuery_Way(jump) {
      this.SET_LOADING(true);
      const reqData = {
        certConfigId: this.certificate_Id,
        banner: this.queryData.banner,
        certOrg: this.queryData.certOrg,
        searchHint: this.queryData.searchHint,
        bottomLog: this.queryData.bottomLog,
        explainDoc: this.queryData.explainDoc,
        filedSerial: this.queryData.filedSerial,
      };
      saveQueryPage(reqData).then((res) => {
        if (res.code === 0) {
          this.SET_LOADING(false);
          this.$message({
            type: "success",
            message: "证书查询页配置成功！",
          });
          this.tableData = res.result;
          //下一步
          if (jump) {
            this.$emit("jumpPage", 3);
          }
        } else {
          this.SET_LOADING(false);
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handlePreview(file, fileList) {
      console.log(file);
      this.getBase64(file.raw).then((res) => {
        this.queryData.banner = res;
      });
    },
    handlePreviewLogo(file, fileList) {
      console.log(file);
      this.getBase64(file.raw).then((res) => {
        this.queryData.bottomLog = res;
      });
    },
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    handleExceed(files, fileList) {
      this.$message({
        message: `当前限制选择 1 个文件，请移除后再上传！`,
        type: "warning",
      });
    },
    addField() {
      this.queryData.certificate_fields.push(
        JSON.parse(JSON.stringify(this.fieldTemplate))
      );
    },
    deleteField(row) {
      console.log(row);
      this.queryData.certificate_fields.splice(
        this.queryData.certificate_fields.indexOf(row),
        1
      );
    },
    lastStep() {
      this.$emit("jumpPage", 1);
    },
    next(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveCertQuery_Way(true);
        } else {
          return false;
        }
      });
    },
    produceSearchHint(item) {
      this.queryData.searchHint =
        "请输入" + this.queryData.fields[item].filedNameZh + "查询";
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-dialog__body {
  padding: 0;
}

::v-deep .el-dialog {
  margin-top: 5vh !important;
}

.queryConfig {
  width: 100%;
  height: 100%;
  padding: 32px 0 0 0;
  background-color: white;
}

.demo-queryData {
  padding: 0px 295px;
}

.el-form-item {
  margin-bottom: 24px;
}

::v-deep .avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px dashed var(--grey-5, #e0e4ed);
  background: var(--grey-bg-2, #f6f7fb);
  width: 72px;
  height: 72px;
  line-height: 55px;

  span {
    position: absolute;
    width: 100%;
    left: 0;
    top: 20px;
    color: var(--grey-3, #787b84);
    font-family: PingFang SC;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    /* 100% */
  }
}

::v-deep .el-upload-list {
  display: flex;
}

::v-deep .el-upload-list__item {
  margin: 0;
  display: inline-block;
  width: auto;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 72px;
  height: 72px;
  line-height: 72px;
  text-align: center;
}

.avatar {
  width: 72px;
  height: 72px;
  display: block;
}

::v-deep .el-form-item__label {
  display: contents;
  line-height: 30px;
}

::v-deep .el-form-item__content {
  line-height: initial;
}

::v-deep .fields .content {
  border-radius: 4px;
  border: 1px solid var(--grey-5, #e0e4ed);
}

::v-deep .el-table__header-wrapper {
  line-height: 32px;
  height: 32px;
}

::v-deep .el-table th {
  padding: 0;
}

::v-deep .el-table th {
  background-color: #f6f7fb;
}

::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}

.operate {
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
}

.addField,
.export {
  color: var(--main, #3071f2);
  /* text 14 R */
  font-family: PingFang SC;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  /* 157.143% */
  cursor: pointer;
}

.font,
.code_p,
.id_p,
.id_font {
  display: flex;
  justify-content: space-between;
}

.fontSize,
.fontWeight,
.fontFamily,
.code_x,
.code_y,
.code_w,
.code_h,
.id_x,
.id_y,
.id_w,
.id_h {
  display: flex;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  border: 1px solid var(--grey-5, #e0e4ed);

  span {
    padding: 4px 8px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background: var(--grey-bg-2, #f6f7fb);
    color: var(--grey-1, #262a32);
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    /* 157.143% */
  }

  ::v-deep .el-input__inner {
    border: none;
    height: 25px;
    line-height: 32px;
  }

  ::v-deep .el-input {
    width: 80px;
  }
}

.btn .el-button--primary {
  padding: 5px 16px;
  border-radius: 4px;
  background: var(--main, #3071f2);

  ::v-deep span {
    color: #fff;
    /* text 14 R */
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    /* 157.143% */
  }
}

.btn .el-button--default {
  padding: 5px 16px;
  border-radius: 4px;
  // background: var(--main, #3071F2);

  ::v-deep span {
    color: var(--grey-1, #262a32);
    /* text 14 R */
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    /* 157.143% */
    img {
      width: 16px;
      height: 16px;
      vertical-align: sub;
      margin-right: 8px;
    }
  }
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
.el-select {
  width: 100%;
}
</style>
  