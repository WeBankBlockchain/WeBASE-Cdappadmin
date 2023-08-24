<template>
  <div class="app-container">
    <div class="header">
      <div class="uploadExcel" v-if="certStatus===0">
        <el-upload class="avatar-uploader" action="#" :on-change="handlePreview" :file-list="fileList" :auto-upload='false'>
          <img class="logo" src="../../assets/image/upload.svg" />
          <span class="operateSpan">重新上传excel</span>
        </el-upload>
      </div>
      <div class="certCochain" @click="coChaining()" v-if="certStatus===0">
        <img class="logo" src="../../assets/image/certCoChain.svg" />
        <span class="operateSpan">证书上链</span>
      </div>
      <div class="publish" @click="publish()" v-if="certStatus===1">
        <img class="logo" src="../../assets/image/publish.svg" />
        <span class="operateSpan">对外发布</span>
      </div>
      <div class="stopPulish" @click="stopPulish()" v-if="certStatus===2">
        <span class="operateSpan">停止发布</span>
      </div>
      <div class="downLoadCert" @click="downLoadALl()" v-if="certStatus!==null">
        <img class="logo" src="../../assets/image/downLoad.svg" />
        <span class="">下载所有证书</span>
      </div>
    </div>
    <div class="configData">
      <el-table :data="certList" style="width:100%" v-if="certList.length>0">
        <el-table-column v-for="item in headerData" :label="item.filedNameZh" :key="item.filedSerial" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <template v-if="item.filedName!=='certStatus'">
              <span>{{scope.row[item.filedName]}}</span>
            </template>
            <template v-else>
              <span :class="classSpan(scope.row)">{{textStatus(scope.row)}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="preview(scope.row)">预览</el-button>
            <el-button type="text" size="small" @click="downLoad(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="previewPicShow" width="800px" height="560px" :append-to-body="true" class="dialogPreviewPic" v-if='previewPicShow' center>
      <preview-pic :ImgUrlData="previewCertPicData"></preview-pic>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFiledInfo,
  downloadCertPic,
  downloadAllCert,
  importExcelData,
  cochain,
  updateCertState,
} from "@/api/table";
import previewPic from "@/components/dialog/previewPic.vue";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    previewPic,
  },
  data() {
    return {
      headerData: [],
      certList: [],
      fileList: [],
      certStatus: null,
      previewPicShow: false,
      previewCertPicData: null,
      downLoadData: null,
      importData: {
        certificate_importData: "",
        certConfigId: "",
      },
      formDataInfo: null,
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["certificate_Id", "step"]),
  },
  mounted() {
    this.getCertListData();
  },
  methods: {
    ...mapMutations("user", ["SET_CERTIFICATE_ID", "SET_STEP", "SET_LOADING"]),
    getCertListData() {
      this.SET_LOADING(true);
      const reqData = {
        certConfigId: this.certificate_Id,
      };
      getFiledInfo(reqData).then((res) => {
        this.certList = []; //重新请求清空列表
        this.SET_LOADING(false);
        if (res.code === 0) {
          this.headerData = res.result.certFiledInfo;
          this.headerData.push({
            filedName: "certStatus",
            filedNameZh: "上链状态",
            filedSerial: "666",
          });
          //head数据和返回字段数据整合
          res.result.filedInfoResp.forEach((item, itemIndex) => {
            let filedItem = item.filedInfo.split(";");
            this.certList[itemIndex] = {};
            this.headerData.forEach((headItem, index) => {
              this.certList[itemIndex][headItem.filedName] = filedItem[index];
            });
            this.certList[itemIndex].certStatus = res.result.certState;
            this.certList[itemIndex].id = item.id;
          });
          this.certStatus = res.result.certState;
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    coChaining() {
      this.$confirm(
        "上链后证书内容将不可修改巴啦啦啦提示说明",
        "确定上链所有证书？",
        {
          customClass: "messageBox_coChain",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      )
        .then(() => {
          this.coChaining_way();
        })
        .catch(() => {
          console.log("error");
        });
    },
    classSpan(row) {
      let handleClass = "";
      switch (row.certStatus) {
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
      switch (row.certStatus) {
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
    preview(row) {
      const reqData = {
        id: row.id,
      };
      downloadCertPic(reqData).then((res) => {
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
    downLoad(row) {
      const reqData = {
        id: row.id,
      };
      downloadCertPic(reqData).then((res) => {
        if (res.code === 0) {
          const previewCertPicData = res.result;
          let downloadElement = document.createElement("a");
          downloadElement.href = previewCertPicData;
          downloadElement.download = row.name + ".png"; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //触发点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    async downLoadALl() {
      this.SET_LOADING(true);
      const reqData = {
        certConfigId: this.certificate_Id,
      };
      downloadAllCert(reqData).then((res) => {
        this.SET_LOADING(false);
        if (res.code === 0) {
          this.downLoadData = res.result;
          this.downloadImages();
        } else {
          this.$message({
            message: "系统错误",
            type: "error",
            duration: 2000,
          });
        }
      });
    },
    async downloadImages() {
      try {
        const zip = new JSZip();
        // Create a folder inside the zip to store the images
        const folder = zip.folder("images");
        // Download and add base64 images to the zip
        this.downLoadData.forEach((base64Image, index) => {
          // Extract the image extension (e.g., 'jpeg', 'png', etc.)
          const extension = base64Image.certPic.substring(
            base64Image.certPic.indexOf("/") + 1,
            base64Image.certPic.indexOf(";base64")
          );
          // Remove the data prefix from the base64 string
          const base64Data = base64Image.certPic.replace(
            /^data:image\/\w+;base64,/,
            ""
          );
          // Convert the base64 string to a Uint8Array
          const byteArray = new Uint8Array(
            atob(base64Data)
              .split("")
              .map((char) => char.charCodeAt(0))
          );
          // Add the image to the zip
          folder.file(`image_${index + 1}.${extension}`, byteArray, {
            base64: true,
          });
        });
        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: "blob" });
        // Save the zip file
        saveAs(zipBlob, "certificateImages.zip");
      } catch (error) {
        console.error("Error while downloading images:", error);
      }
    },
    handlePreview(file, fileList) {
      this.SET_LOADING(true);
      console.log(file);
      this.getBase64(file.raw).then((res) => {
        this.formDataInfo = new FormData();
        this.formDataInfo.append("certConfigId", this.certificate_Id);
        this.formDataInfo.append("file", file.raw);
        this.importData.certificate_importData = URL.createObjectURL(file.raw);
        importExcelData(this.formDataInfo).then((res) => {
          if (res.code === 0) {
            this.SET_LOADING(false);
            this.getCertListData();
          } else {
            this.SET_LOADING(false);
            this.$message({
              message: "系统错误",
              type: "error",
              duration: 2000,
            });
          }
        });
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
    coChaining_way() {
      this.SET_LOADING(true);
      const reqData = {
        certConfigId: this.certificate_Id,
      };
      cochain(reqData).then((res) => {
        if (res.code === 0) {
          this.SET_LOADING(false);
          this.certStatus = 1;
          this.getCertListData();
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
    publish() {
      this.SET_LOADING(true);
      const reqData = {
        certConfigId: this.certificate_Id,
        state: true,
      };
      updateCertState(reqData).then((res) => {
        if (res.code === 0) {
          this.SET_LOADING(false);
          this.certStatus = 2;
          this.getCertListData();
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
    stopPulish() {
      this.$confirm("停止发布后将无法查询该证书", "确定停止发布？", {
        customClass: "messageBox_coChain",
        confirmButtonText: "停止发布",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.stopPulish_way();
        })
        .catch(() => {
          console.log("error");
        });
    },
    stopPulish_way() {
      this.SET_LOADING(true);
      const reqData = {
        certConfigId: this.certificate_Id,
        state: false,
      };
      updateCertState(reqData).then((res) => {
        if (res.code === 0) {
          this.SET_LOADING(false);
          this.certStatus = 1;
          this.getCertListData();
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
  },
};
</script>

<style  scoped lang="scss">
.app-container {
  width: 100%;
  height: 100%;
  background: #fff;
  min-height: calc(100vh - 100px);

  .header {
    width: 100%;
    height: 32px;

    .uploadExcel,
    .certCochain,
    .publish,
    .stopPulish,
    .downLoadCert {
      height: 32px;
      display: inline-block;
      height: 32px;
      background-color: #3071f2;
      border-radius: 4px;
      text-align: center;
      line-height: 32px;
      padding: 0 16px;
      cursor: pointer;

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

    .certCochain {
      margin-left: 16px;
      cursor: pointer;
    }
    .stopPulish {
      border-radius: 4px;
      background: var(--red, #ff4d4f);
    }

    .downLoadCert {
      float: right;
      background-color: #fff;
      color: var(--grey-1, #262a32);
      /* text 14 R */
      font-family: PingFang SC;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      /* 157.143% */
      border-radius: 4px;
      border: 1px solid var(--grey-5, #e0e4ed);
      cursor: pointer;
    }
  }
}

.operateSpan {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: left;
  color: white;
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

.configData {
  margin-top: 24px;
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
::v-deep .el-upload-list {
  display: none;
}
</style>
