import request from "@/utils/request";
import axios from "axios";
let url = "http://localhost:44321/api";

export function GetPZList(data) {
  return request({
    url: "/api/Weigh/GetPZList",
    method: "GET",
    data,
  });
}

export function GetCPList(data) {
  return request({
    url: "/api/Weigh/GetCPList",
    method: "GET",
    data,
  });
}
export function GetCPEndList(data) {
  return request({
    url: "/api/Weigh/GetCPEndList",
    method: "GET",
    data,
  });
}

export function GetWPEndList(data) {
  return request({
    url: "/api/Weigh/GetWPEndList",
    method: "GET",
    data,
  });
}

export function UpdateStatus(params) {
  return request({
    url: "/api/Weigh/UpdateStatus",
    method: "GET",
    params,
  });
}

export function GetWPList(data) {
  return request({
    url: "/api/Weigh/GetWPList",
    method: "GET",
    data,
  });
}
export function GetCPListAll(data) {
  return request({
    url: "/api/Weigh/GetCPListAll",
    method: "GET",
    data,
  });
}

export function GetWPListAll(data) {
  return request({
    url: "/api/Weigh/GetWPListAll",
    method: "GET",
    data,
  });
}

export function GetHPList(data) {
  return request({
    url: "/api/Weigh/GetHPList",
    method: "GET",
    data,
  });
}

export function GetCarNum(data) {
  return request({
    url: "/api/Weigh/GetCarNum?CarNum=" + data.cnum,
    method: "GET",
  });
}

export function InPrintXC(data) {
  axios.post("/api/Weigh/InPrintXC", data);
  // return request({
  //   url: '/api/Weigh/InPrintXC?m_strID='+data.ID,
  //   method: 'GET',
  //   data
  // })
}
export function InPrint(data) {
  axios.post("/api/Weigh/InPrint", data);
  // return request({
  //   url: '/api/Weigh/InPrint?intType='+data.ptype+'&strDataID='+data.ID,
  //   method: 'GET',
  //   data
  // })
}

export function GetTotal(data) {
  return request({
    url: "/api/Weigh/GetTotal?mtype=" + data.mtype + "&code=" + data.code,
    method: "GET",
    data,
  });
}

export function GetComPortList(data) {
  return request({
    url: "/api/Weigh/GetComPortList",
    method: "GET",
    data,
  });
}
export function GetProtVal(data) {
  return request({
    url: "/api/Weigh/GetProtVal?Comport=" + data.ID,
    method: "GET",
    data,
  });
}
export function AddOrder(data) {
  return request({
    url: "/api/Weigh/AddOrder",
    method: "POST",
    data,
  });
}
export function SubmitWeight(data) {
  return request({
    url: "/api/Weigh/SubmitWeight",
    method: "POST",
    data,
  });
}

export function GetAllCarNum() {
  return request({
    url: "/api/Weigh/GetAllCarNum",
    method: "GET",
  });
}
