<template>
  <div class="resultConfig">
    <el-form :model="resultData" :rules="rules" ref="resultData" class="demo-resultData">
      <el-form-item label="结果页标题" prop="title">
        <el-input v-model="resultData.title"></el-input>
      </el-form-item>
      <el-form-item label="显示字段" prop="enableFields">
        <el-checkbox-group v-model="resultData.enableFields" @change="updateSelectedOptions">
          <el-checkbox :label="JSON.stringify(item)" v-for="(item, index) in resultData.fields" :key="item.id">{{ item.filedNameZh}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="页面底部logo" prop="bottomLog">
        <el-checkbox-group v-model="resultData.bottomLog" v-show="false"></el-checkbox-group>
        <el-upload class="avatar-uploader" action="#" :on-change="handlePreviewLogo" :limit="1" :file-list="fileLogoList" :on-exceed="handleExceed" :auto-upload='false'>
          <img v-if="resultData.bottomLog" :src="resultData.bottomLog" class="avatar">
          <div v-else>
            <img src="../../assets/image/add_img.svg" class="" />
            <span>上传图片</span>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="技术支持说明文案" prop="explainDoc">
        <el-input v-model="resultData.explainDoc"></el-input>
      </el-form-item>
      <el-form-item style="margin-top:32px" class="btn">
        <el-button type="primary" @click="next('resultData')">下一步</el-button>
        <el-button type="primary" @click="saveConfig('resultData')">保存配置</el-button>
        <el-button @click="lastStep('resultData')">上一步</el-button>
        <el-button @click="Preview('resultData')"><img src="../../assets/image/eye.svg" />预览模板</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="previewResultShow" title="查询结果" width="375px" :append-to-body="true" class="previewQuery" v-if='previewResultShow' center>
      <preview-result :previewCertResultData="previewCertResultData"></preview-result>
    </el-dialog>
  </div>
</template>
  
<script>
import { getQueryResultPage, saveQueryResultPage } from "@/api/table";
import previewResult from "@/components/dialog/previewResult.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: { previewResult },
  data() {
    var checkBoxRule = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("请选择显示字段"));
      } else {
        callback();
      }
    };
    return {
      resultData: {
        title: "",
        fields: [],
        bottomLog: "",
        explainDoc: "",
        enableFields: [],
      },
      fields: [],
      fileLogoList: [],
      previewCertResultData: null,
      previewResultShow: false,
      prevSelectedOptions: [], // Store previously selected options
      rules: {
        title: [
          { required: true, message: "请输入结果页标题", trigger: "blur" },
        ],
        bottomLog: [
          {
            required: true,
            message: "请上传页面底部logo",
            trigger: "change",
          },
        ],
        enableFields: [
          {
            required: true,
            message: "请选择显示字段",
            trigger: "blur",
          },
          ,
          { validator: checkBoxRule, trigger: "change" },
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
    this.queryCertificateResultData();
  },
  methods: {
    ...mapMutations("user", ["SET_CERTIFICATE_ID", "SET_STEP", "SET_LOADING"]),
    queryCertificateResultData() {
      const reqData = {
        certConfigId: this.certificate_Id,
      };
      getQueryResultPage(reqData).then((res) => {
        if (res.code === 0) {
          if (!res.result) {
            return false;
          }
          this.resultData = res.result;
          if (!this.resultData.enableFields) {
            this.resultData.enableFields = [];
          }
          this.updateSelectedOptions(this.resultData.enableFields);
          // 在使用el-checkbox / el-checkbox-group时，发现若label绑定的是对象，则是无法回显的
          // 而在获取参数对绑定参数进行JSON.stringify转换即可解决回显问题，如若在提交时保持数据结构一致，则再进行JSON.parse转换即可
          // res.result.enableFields.forEach((item, index) => {
          //   this.fields.push(JSON.stringify(item));
          // });
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
      this.previewCertResultData = this.resultData;
      this.previewResultShow = true;
    },
    saveConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveCertResult_Way();
        } else {
          return false;
        }
      });
    },
    saveCertResult_Way(jump) {
      this.SET_LOADING(true);
      const reqData = {
        certConfigId: this.certificate_Id,
        title: this.resultData.title,
        enableFields: this.resultData.enableFields,
        bottomLog: this.resultData.bottomLog,
        explainDoc: this.resultData.explainDoc,
      };
      saveQueryResultPage(reqData).then((res) => {
        if (res.code === 0) {
          this.SET_LOADING(false);
          this.$message({
            type: "success",
            message: "证书结果页配置成功！",
          });
          this.queryCertificateResultData();
          //下一步
          if (jump) {
            this.$emit("jumpPage", 4);
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
        this.resultData.certificate_banner = res;
      });
    },
    handlePreviewLogo(file, fileList) {
      console.log(file);
      this.getBase64(file.raw).then((res) => {
        this.resultData.bottomLog = res;
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
      this.resultData.certificate_fields.push(
        JSON.parse(JSON.stringify(this.fieldTemplate))
      );
    },
    deleteField(row) {
      console.log(row);
      this.resultData.certificate_fields.splice(
        this.resultData.certificate_fields.indexOf(row),
        1
      );
    },
    lastStep() {
      this.$emit("jumpPage", 2);
    },
    next(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveCertResult_Way(true);
        } else {
          return false;
        }
      });
    },
    updateSelectedOptions(newSelection) {
      // Find newly selected options
      const newlySelectedOptions = [];
      newSelection.forEach((option) =>
        newlySelectedOptions.push(JSON.parse(option))
      );

      // Find unselected options
      const unselectedOptions = this.resultData.fields.filter(
        (option) => !newSelection.includes(JSON.stringify(option))
      );

      // Update selectedOptions array with the new selection
      // Preserve the original order of selectedOptions
      this.resultData.fields = [...newlySelectedOptions, ...unselectedOptions];

      // Update prevSelectedOptions for the next change event
      this.prevSelectedOptions = newSelection;
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

.resultConfig {
  width: 100%;
  height: 100%;
  padding: 32px 0 0 0;
  background-color: white;
}

.demo-resultData {
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
</style>
  