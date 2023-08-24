<template>
  <div class="importConfig">
    <el-form :model="importData" :rules="rules" ref="importData" class="demo-importData">
      <el-form-item prop="certificate_importData">
        <el-checkbox-group v-model="importData.certificate_importData" v-show="false"></el-checkbox-group>
        <el-upload class="avatar-uploader" action="#" :on-change="handlePreview" :limit="1" :file-list="fileLogoList" :on-exceed="handleExceed" :auto-upload='false'>
          <div class="uploadLogo"></div>
          <div class="el-upload__text">点击上传文件</div>
          <br />
          <div class="el-upload__tip">支持xls、xlsx格式</div>
        </el-upload>
      </el-form-item>
      <el-form-item style="margin-top:32px" class="btn">
        <el-button type="primary" @click="saveConfig('importData')">保存配置</el-button>
        <el-button @click="lastStep('importData')">上一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import { importExcelData } from "@/api/table";
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      importData: {
        certificate_importData: "",
        certConfigId: "",
      },
      formDataInfo: null,
      fileLogoList: [],
      rules: {
        certificate_importData: [
          {
            required: true,
            message: "请上传文件",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["certificate_Id", "step"]),
  },
  created() {},
  methods: {
    ...mapMutations("user", ["SET_CERTIFICATE_ID", "SET_STEP", "SET_LOADING"]),
    saveConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.importExcelData_Way();
        } else {
          return false;
        }
      });
    },
    importExcelData_Way() {
      this.SET_LOADING(true);
      const reqData = {
        certConfigId: this.certificate_Id,
        excelData: this.importData.certificate_importData,
      };
      importExcelData(this.formDataInfo).then((res) => {
        if (res.code === 0) {
          this.SET_LOADING(false);
          this.$router.push("/createCertList");
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
    handlePreview(file, fileList) {
      console.log(file);
      this.getBase64(file.raw).then((res) => {
        this.formDataInfo = new FormData();
        this.formDataInfo.append("certConfigId", this.certificate_Id);
        this.formDataInfo.append("file", file.raw);
        this.importData.certificate_importData = URL.createObjectURL(file.raw);
      });
    },
    handlePreviewLogo(file, fileList) {
      console.log(file);
      this.getBase64(file.raw).then((res) => {
        this.importData.certificate_logo = URL.createObjectURL(file.raw);
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
      this.importData.certificate_fields.push(
        JSON.parse(JSON.stringify(this.fieldTemplate))
      );
    },
    deleteField(row) {
      console.log(row);
      this.importData.certificate_fields.splice(
        this.importData.certificate_fields.indexOf(row),
        1
      );
    },
    lastStep() {
      this.$emit("jumpPage", 3);
    },
  },
};
</script>
<style scoped lang="scss">
.importConfig {
  width: 100%;
  height: 100%;
  padding: 32px 0 0 0;
  background-color: white;
}

.demo-importData {
  padding: 0px 295px;
}

.el-form-item {
  margin-bottom: 24px;
}

::v-deep .avatar-uploader .el-upload {
  width: 100%;
  height: 160px;
  line-height: 160px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px dashed var(--grey-5, #e0e4ed);
  background: var(--grey-bg-2, #f6f7fb);
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .uploadLogo {
  background-image: url("../../assets/image/content.svg");
  background-size: cover;
  width: 22px;
  height: 22px;
  margin-right: 10px;
}

::v-deep .el-upload__tip {
  position: absolute;
  top: 35px;
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

::v-deep .fileds .content {
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
</style>
  