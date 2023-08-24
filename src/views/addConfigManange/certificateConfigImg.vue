<template>
  <div class="imgConfig">
    <el-form :model="configData" :rules="rules" ref="configData" class="demo-configData">
      <el-form-item label="证书名称" prop="certName">
        <el-input v-model="configData.certName" class="certificate_name_input"></el-input>
      </el-form-item>
      <el-form-item label="底图" prop="baseMap">
        <el-checkbox-group v-model="configData.baseMap" v-show="false"></el-checkbox-group>
        <el-upload class="avatar-uploader" action="#" :on-change="handlePreview" :limit="1" :file-list="fileList" :on-exceed="handleExceed" :auto-upload='false'>
          <img v-if="configData.baseMap" :src="configData.baseMap" class="avatar">
          <div v-else>
            <img src="../../assets/image/add_img.svg" class="" />
            <span>上传图片</span>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="二维码链接" prop="qrCodeUrl">
        <el-input v-model="configData.qrCodeUrl"></el-input>
      </el-form-item>
      <el-form-item label="定义填充字段" class="fileds" prop="fields">
        <div class="filedTip">
          <span>1、如有编号，请定义编号显示位置</span><br>
          <span>2、结果页需要展示的列表信息也需要在这里定义添加，并设置为“不显示”</span><br>
          <span>3、请先定义证书图片上需要展示的信息，后添加其他信息</span>
        </div>
        <div class="content">
          <el-table :data="configData.fields" style="width: 100%">
            <el-table-column type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column prop="filedName" label="字段名称" width="140">
              <template slot-scope="scope">
                <el-form-item :prop="'fields.' + scope.$index + '.filedName'" :rules="rules.filedName">
                  <el-input v-model="scope.row['filedName']" clearable :disabled="scope.$index===0"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="filedNameZh" label="字段中文名" width="140">
              <template slot-scope="scope">
                <el-form-item :prop="'fields.' + scope.$index + '.filedNameZh'" :rules="rules.filedName">
                  <el-input v-model="scope.row['filedNameZh']" clearable :disabled="scope.$index===0"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="filedDemo" label="预览值" width="140">
              <template slot-scope="scope">
                <el-form-item :prop="'fields.' + scope.$index + '.filedDemo'" :rules="rules.filedName">
                  <el-input v-model="scope.row['filedDemo']" clearable></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="" label="是否显示" width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row['showEnable']" style="width:90px;" @change="reset(scope.row)">
                  <el-option v-for="item in showList" :key="item.value" :label="item.label" :value="item.value">
                    <span>{{ item.label }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="x" label="X">
              <template slot-scope="scope">
                <el-form-item :prop="'fields.' + scope.$index + '.x'" :rules="rules.coordinate">
                  <el-input v-model="scope.row['x']" v-if="scope.row['showEnable']"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="y" label="Y">
              <template slot-scope="scope">
                <el-form-item :prop="'fields.' + scope.$index + '.y'" :rules="rules.coordinate">
                  <el-input v-model="scope.row['y']" v-if="scope.row['showEnable']"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="w" label="W">
              <template slot-scope="scope">
                <el-form-item :prop="'fields.' + scope.$index + '.w'" :rules="rules.coordinate">
                  <el-input v-model="scope.row['w']" v-if="scope.row['showEnable']"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="h" label="H">
              <template slot-scope="scope">
                <el-form-item :prop="'fields.' + scope.$index + '.h'" :rules="rules.coordinate">
                  <el-input v-model="scope.row['h']" v-if="scope.row['showEnable']"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作">
              <template slot-scope="scope">
                <span class="delete" type="" v-if="!scope.row['delete']" @click="deleteField(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="operate">
            <div class="addField" @click="addField"><img src="../../assets/image/add_filed.svg" />新增字段</div>
            <div class="export" @click="exportField"><img src="../../assets/image/downLoad_filed.svg" />导出Excel模板</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="编号字体" prop="filedFont" class="fontItem">
        <div class="id_font">
          <div class="fontSize">
            <span>font-size</span>
            <el-input v-model="configData.filedFont"></el-input>
          </div>
          <div class="recover" @click="recoverIdFontSize()">
            <img src="../../assets/image/recover.svg">
            <span>恢复默认</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="填充字段字体" prop="numFont" class="fontItem">
        <div class="font">
          <div class="fontSize">
            <span>font-size</span>
            <el-input v-model="configData.numFont"></el-input>
          </div>
          <div class="recover" @click="recoverFiledFontSize()">
            <img src="../../assets/image/recover.svg">
            <span>恢复默认</span>
          </div>
        </div>
      </el-form-item>
      <div label="二维码">
        <div class="code_p">
          <el-form-item prop="qrCodeLocal.x" label="二维码位置">
            <div class="code_x">
              <span>X</span>
              <el-input v-model="configData.qrCodeLocal.x"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="qrCodeLocal.y" label-width="0">
            <div class="code_y">
              <span>Y</span>
              <el-input v-model="configData.qrCodeLocal.y"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="qrCodeLocal.w" label-width="0">
            <div class="code_w">
              <span>W</span>
              <el-input v-model="configData.qrCodeLocal.w"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="qrCodeLocal.h" label-width="0">
            <div class="code_h">
              <span>H</span>
              <el-input v-model="configData.qrCodeLocal.h"></el-input>
            </div>
          </el-form-item>
          <div class="recover" @click="recoverCodeP()">
            <img src="../../assets/image/recover.svg">
            <span>恢复默认</span>
          </div>
        </div>
      </div>
      <el-form-item style="margin-top:20px" class="btn">
        <el-button type="primary" @click="submitForm('configData')">下一步</el-button>
        <el-button type="primary" @click="saveConfig('configData')">保存配置</el-button>
        <el-button :disabled="previewAble" @click="Preview('configData')"><img src="../../assets/image/eye.svg" />预览模板</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="previewPicShow" width="800px" height="560px" :append-to-body="true" class="dialogPreviewPic" v-if='previewPicShow' center>
      <preview-pic :ImgUrlData="previewCertPicData"></preview-pic>
    </el-dialog>
  </div>
</template>
  
<script>
import { saveCertPic, queryCertPice, previewCertPic } from "@/api/table";
import previewPic from "@/components/dialog/previewPic.vue";
import * as XLSX from "xlsx";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: { previewPic },
  data() {
    return {
      configData: {
        certName: "",
        baseMap: "",
        qrCodeUrl: "",
        numFont: "34",
        filedFont: "28",
        qrCodeLocal: {
          h: "48",
          w: "180",
          x: "234",
          y: "518",
        },
        fields: [
          {
            delete: "no",
            filedName: "certificatID",
            filedNameZh: "证书编号",
            filedDemo: "default",
            x: "0",
            y: "0",
            h: "0",
            w: "0",
            showEnable: 0,
          },
        ],
      },
      fieldTemplate: {
        filedName: "default",
        filedNameZh: "default",
        filedDemo: "default",
        x: 0,
        y: 0,
        h: 0,
        w: 0,
        showEnable: 1,
      },
      showList: [
        { label: "显示", value: 1 },
        { label: "不显示", value: 0 },
      ],
      fileList: [],
      previewAble: true,
      previewPicShow: false,
      saveSuccessData: null,
      querySuccessData: null,
      previewCertPicData: null,
      rules: {
        certName: [
          { required: true, message: "请输入证书名称", trigger: "blur" },
        ],
        fields: [{ required: true, message: "", trigger: "blur" }],
        baseMap: [
          {
            required: true,
            message: "请上传证书底图",
            trigger: "change",
          },
        ],
        qrCodeUrl: [
          { required: true, message: "请输入二维码url", trigger: "blur" },
        ],
        numFont: [
          {
            required: true,
            message: "请输入填充字段字体大小",
            trigger: ["blur", "change"],
          },
        ],
        "qrCodeLocal.x": [
          { required: true, message: "请输入二维码X坐标", trigger: "blur" },
        ],
        "qrCodeLocal.y": [
          { required: true, message: "请输入二维码Y坐标", trigger: "blur" },
        ],
        "qrCodeLocal.w": [
          { required: true, message: "请输入二维码宽度", trigger: "blur" },
        ],
        "qrCodeLocal.h": [
          { required: true, message: "请输入二维码高度", trigger: "blur" },
        ],
        filedFont: [
          {
            required: true,
            message: "请输入编号字体大小",
            trigger: ["blur", "change"],
          },
        ],
        filedName: [
          { required: true, message: "字段不能为空", trigger: "blur" },
        ],
        coordinate: [{ required: true, message: "不能为空", trigger: "blur" }],
        certificateQuery_icon: [
          { required: true, message: "请上传证书查询-图标", trigger: "blur" },
        ],
        certificateQuery_supply: [
          {
            required: true,
            message: "请输入证书查询-技术支持",
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
    if (this.certificate_Id) {
      this.queryCertPice_Way();
    }
  },
  methods: {
    ...mapMutations("user", ["SET_CERTIFICATE_ID", "SET_STEP", "SET_LOADING"]),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveCertPic_Way(true);
        } else {
          return false;
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
      const reqData = {
        id: this.certificate_Id,
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
    reset(row) {
      this.$refs["configData"].clearValidate();
      row.x = 0;
      row.y = 0;
      row.w = 0;
      row.h = 0;
    },
    saveConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveCertPic_Way();
        } else {
          return false;
        }
      });
    },
    queryCertPice_Way() {
      if (!this.certificate_Id) {
        return;
      }
      const reqData = {
        id: this.certificate_Id,
      };
      queryCertPice(reqData).then((res) => {
        if (res.code === 0) {
          this.configData = res.result;
          this.configData.fields[0].delete = "no";
          this.previewAble = false;
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    saveCertPic_Way(jump) {
      this.SET_LOADING(true);
      const reqData = this.configData;
      if (this.certificate_Id) {
        reqData.id = this.certificate_Id;
      }
      saveCertPic(reqData).then((res) => {
        if (res.code === 0) {
          this.SET_LOADING(false);
          this.$message({
            type: "success",
            message: "证书图片配置成功！",
          });
          this.saveSuccessData = res.result;
          // localStorage.setItem("certificate_Id", res.result.id);
          this.SET_CERTIFICATE_ID(res.result.id);
          localStorage.setItem("saveSuccessData", JSON.stringify(res.result));
          this.previewAble = false;
          //下一步
          if (jump) {
            this.$emit("jumpPage", 2);
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
        // this.configData.baseMap = URL.createObjectURL(file.raw);
        this.configData.baseMap = res;
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
      this.configData.fields.push(
        JSON.parse(JSON.stringify(this.fieldTemplate))
      );
    },
    deleteField(row) {
      console.log(row);
      this.configData.fields.splice(this.configData.fields.indexOf(row), 1);
    },
    exportField() {
      let excelJson = {};
      this.configData.fields.forEach((element) => {
        excelJson[element.filedNameZh] = "";
      });
      excelJson = [excelJson];
      console.log(excelJson);
      const xlsxObj = {
        SheetNames: ["sheet1"],
        Sheets: {
          ["sheet1"]: XLSX.utils.json_to_sheet(excelJson),
        },
      };
      XLSX.writeFile(xlsxObj, "certificateFields.xlsx");
      // 导出第二种写法
      // let excelJson = {};
      // this.configData.fields.forEach((element) => {
      //   excelJson[element.filedNameZh] = "";
      // });
      // excelJson=[excelJson]
      // const workbook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(
      //   workbook,
      //   XLSX.utils.json_to_sheet(excelJson),
      //   "Sheet1"
      // );
      // XLSX.writeFile(workbook, "certificateFields.xlsx");
    },
    recoverIdFontSize() {
      this.configData.filedFont = 28;
    },
    recoverFiledFontSize() {
      this.configData.numFont = 34;
    },
    recoverCodeP() {
      this.configData.qrCodeLocal = {
        h: "48",
        w: "180",
        x: "234",
        y: "518",
      };
      this.$refs["configData"].clearValidate();
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-dialog__body {
  padding: 0;
}

.imgConfig {
  width: 100%;
  height: 100%;
  padding: 32px 0 0 0;
  background-color: white;
}

.demo-configData {
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
  font-size: 16px;
  color: #8c939d;
  text-align: center;
}

.avatar {
  width: 72px;
  height: 72px;
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

::v-deep .fileds .el-form-item {
  margin: 0;
}

::v-deep .fileds .el-table td {
  border: none;
  padding: 5px 0 16px 0;
}

::v-deep .fileds .el-table .cell {
  overflow: visible;
}

::v-deep .fileds .el-input__icon {
  line-height: normal;
}
.filedTip {
  padding-bottom: 10px;
  span {
    color: var(--grey-3, #787b84);
    /* text 12 R */
    font-family: PingFang SC;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 166.667% */
  }
}
::v-deep .el-table__header-wrapper {
  line-height: 32px;
  height: 32px;
}

::v-deep .el-table {
  border-radius: 4px 4px 0 0;
}

::v-deep .el-table th {
  padding: 0;
}

::v-deep .el-table th {
  background-color: #f6f7fb;
  color: var(--grey-1, #262a32);
  /* menu 14 M */
  font-family: PingFang SC;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  /* 157.143% */
}

::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}

::v-deep .el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
}

.operate {
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  height: 24px;
  line-height: 24px;

  img {
    width: 16px;
    height: 16px;
    vertical-align: sub;
    margin-right: 8px;
  }
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

.code_p {
  display: flex;
  justify-content: space-between;

  .el-form-item__content {
    span {
      border-radius: 4px 0 0 4px;
    }
  }
  .code_y,
  .code_w,
  .code_h {
    margin-top: 30px;
  }
  .recover {
    padding-top: 30px;
  }
}

.font,
.id_font {
  display: flex;
  .recover {
    margin-left: 20px;
  }
}

.recover {
  padding: 0 8px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    vertical-align: sub;
  }

  span {
    color: var(--main, #3071f2);
    /* text 14 R */
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
}
.fontItem {
  width: 50%;
  display: inline-block;
  ::v-deep .el-input {
    width: 68px !important;
  }
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

.delete {
  cursor: pointer;
  color: var(--main, #3071f2);
  /* text 14 R */
  font-family: PingFang SC;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  /* 157.143% */
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
  