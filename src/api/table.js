import request from "@/utils/request";

export function getCertList(params) {
  return request({
    url: "/certapp-cert/cert/getCertList",
    method: "get",
    params,
  });
}

export function saveCertPic(data) {
  return request({
    url: "/certapp-cert/cert/saveCertPic",
    method: "post",
    data,
  });
}
// 获取查询页配置
export function getQueryPage(params) {
  return request({
    url: "/certapp-cert/cert/getQueryPage",
    method: "get",
    params,
  });
}
// 添加/修改查询结果页配置
export function saveQueryPage(data) {
  return request({
    url: "/certapp-cert/cert/saveQueryPage",
    method: "post",
    data,
  });
}

// 获取查询结果页配置
export function getQueryResultPage(params) {
  return request({
    url: "/certapp-cert/cert/getQueryResultPage",
    method: "get",
    params,
  });
}
// 添加/修改查询结果页配置
export function saveQueryResultPage(data) {
  return request({
    url: "certapp-cert/cert/saveQueryResultPage",
    method: "post",
    data,
  });
}
// 查询证书图片配置
export function queryCertPice(params) {
  return request({
    url: "/certapp-cert/cert/queryCertPic",
    method: "get",
    params,
  });
}
// 预览证书图片
export function previewCertPic(params) {
  return request({
    url: "/certapp-cert/cert/previewCertPic",
    method: "get",
    params,
  });
}

// 导入数据
export function importExcelData(data) {
  return request({
    url: "/certapp-cert/cert/importData",
    method: "post",
    data,
  });
}

// 删除证书模板
export function deleteCert(params) {
  return request({
    url: "/certapp-cert/cert/deleteById",
    method: "delete",
    params,
  });
}

// 获取导入数据字段
export function getFiledInfo(params) {
  return request({
    url: "/certapp-cert/cert/getFiledInfo",
    method: "get",
    params,
  });
}

// 下载/预览证书
export function downloadCertPic(params) {
  return request({
    url: "/certapp-cert/cert/downloadById",
    method: "get",
    params,
  });
}

// 下载all证书
export function downloadAllCert(params) {
  return request({
    url: "/certapp-cert/cert/download",
    method: "get",
    params,
  });
}

// 证书上链
export function cochain(params) {
  return request({
    url: "/certapp-cert/cert/cochain",
    method: "get",
    params,
  });
}

// 修改证书发布状态
export function updateCertState(params) {
  return request({
    url: "/certapp-cert/cert/updateCertState",
    method: "get",
    params,
  });
}

// 拷贝配置项
export function copeCert(params) {
  return request({
    url: "/certapp-cert/cert/copeCert",
    method: "get",
    params,
  });
}

