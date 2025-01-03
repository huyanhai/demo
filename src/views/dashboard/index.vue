<template>
  <div class="page-home" ref="homeRef">
    <div class="row">
      <div class="top">
        <!-- Left Section -->
        <div class="left-panel">
          <div class="category-buttons">
            <button
              class="btn-secondary max-50"
              :class="activeLeft === 1 && 'btn-primary'"
              @click="selectType(1)"
            >
              成品
            </button>
            <button
              class="btn-secondary max-50"
              :class="activeLeft === 2 && 'btn-primary'"
              @click="selectType(2)"
            >
              材料
            </button>
            <button
              class="btn-secondary max-50"
              :class="activeLeft === 3 && 'btn-primary'"
              @click="selectType(3)"
            >
              皮重
            </button>
          </div>

          <div class="form-group">
            <div class="form-item">
              <label>任务/计划:</label>
              <div class="input-more">
                <input type="text" @click="showD" v-model="code" readonly />
                <i class="el-icon-arrow-down"></i>
              </div>
            </div>
            <div class="form-item">
              <label>单位/项目:</label>
              <input type="text" value="南沙1桥段" v-model="PName" readonly />
            </div>
            <div class="form-item">
              <label>产品规格:</label>
              <input type="text" value="南沙1桥段" v-model="CName" readonly />
            </div>
            <div class="form-item">
              <label>供应地址:</label>
              <input type="text" value="南沙1桥段" v-model="Address" readonly />
            </div>
            <div class="line"></div>
            <div class="form-item">
              <label>累计重量(吨):</label>
              <input type="text" value="10.50" v-model="Total" readonly />
            </div>
            <div class="form-item">
              <label>累计车次:</label>
              <input type="text" value="5" v-model="CarTotal" readonly />
            </div>
            <div class="form-item">
              <label>当日累计总量:</label>
              <input type="text" value="820.00" v-model="AllTotal" readonly />
            </div>
          </div>
        </div>

        <!-- Center Section -->
        <div class="center-panel">
          <div class="header">
            <div>
              磅名：
              <!-- <select class="is-text">
                <option value="1">一号地磅</option>
              </select> -->
              <select class="is-text" v-model="selectdb">
                <option v-for="item in dbList" :value="item.Id">
                  {{ item.Id }}号地磅
                </option>
              </select>
            </div>
            <div class="status">
              <el-radio-group
                v-model="radio"
                fill="#00BEA4"
                text-color="#00BEA4"
              >
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="2">退料</el-radio>
              </el-radio-group>
            </div>
          </div>

          <div class="show-container">
            <div class="show-l">
              <button
                @click="selectmode(1)"
                :class="activeMiddle === 1 && 'active'"
              >
                自动
              </button>
              <button
                @click="selectmode(2)"
                :class="activeMiddle === 2 && 'active'"
              >
                手动
              </button>
            </div>
            <div class="show-m">{{ count }}</div>
            <button class="show-r" @click="SaveWeight">称重</button>
          </div>

          <div class="form-content">
            <div class="weight-inputs">
              <div class="input-group">
                <label>车牌号码</label>
                <div class="car-no-box">
                  <input
                    v-model="CarNum"
                    type="text"
                    @change="GetCarNum"
                    @focus="
                      () => {
                        showCardNo = true;
                      }
                    "
                    @blur="cardItemClick()"
                  />
                  <div class="card-no" v-show="CarNum && showCardNo">
                    <span
                      class="no-item"
                      v-for="(item, index) in cardListFilter"
                      :key="index"
                      @click="cardItemClick(item)"
                    >
                      {{ item.busnumber }}
                    </span>
                  </div>
                </div>
                <button @click="GetCarNum">识别</button>
              </div>
              <div class="input-group">
                <label>毛重(kg)</label>
                <input
                  type="number"
                  v-model="Gross"
                  :readonly="readonly"
                  @change="WeightChange"
                />
                <div class="count">
                  <input
                    type="number"
                    v-model="AddGross"
                    :readonly="jlonly"
                    @change="WeightChange"
                  />
                  <button
                    class="left"
                    :readonly="jlonly"
                    @click="AddGrossWeight(-100)"
                  >
                    -
                  </button>
                  <button
                    class="right"
                    :readonly="jlonly"
                    @click="AddGrossWeight(100)"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="input-group xz-width">
                <label>皮重(kg)</label>
                <input
                  type="number"
                  v-model="tare"
                  :readonly="readonly"
                  @change="WeightChange"
                />
              </div>
              <div class="input-group xz-width">
                <label>净重(kg)</label>
                <input
                  type="number"
                  v-model="Print"
                  :readonly="readonly"
                  @change="WeightChange"
                />
              </div>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="input-group">
                    <label>扣除重量(kg)</label>
                    <input
                      type="number"
                      v-model="DeductWeight"
                      :readonly="jlonly"
                      @change="WeightChange"
                    />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="input-group">
                    <label>扣除比例(%)</label>
                    <input
                      type="number"
                      v-model="DeductProportion"
                      :readonly="jlonly"
                      @change="WeightChange"
                    />
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="input-group">
                    <label>供方重量(kg)</label>
                    <input
                      type="number"
                      v-model="SuppilerWeight"
                      :readonly="jlonly"
                    />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="input-group">
                    <label>出厂料温(℃)</label>
                    <input type="number" v-model="OutTemp" :readonly="clonly" />
                  </div>
                </el-col>
              </el-row>
              <div class="input-group">
                <label>过磅备注</label>
                <input type="text" v-model="Remarks" />
                <button class="btn-primary" @click="AddW">保存</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="vehicle-list">
          <h2>待回皮车辆</h2>
          <el-table :data="HPList" style="width: 100%" @row-click="rowclick">
            <el-table-column prop="date" label="序号"> </el-table-column>
            <el-table-column prop="BusNumber" label="车牌号"> </el-table-column>
            <el-table-column prop="GrossWeight" label="毛重"> </el-table-column>
            <el-table-column prop="suppliername" label="物料单位">
            </el-table-column>
            <el-table-column prop="materialname" label="材料规格">
            </el-table-column>
            <el-table-column prop="InitialDate" label="进场时间">
            </el-table-column>
            <el-table-column prop="IsChecked" label="检验结果">
              <template slot-scope="scope">
                <span>{{
                  scope.row.IsChecked == 0
                    ? "未检测"
                    : scope.row.IsChecked == 1
                    ? "合格"
                    : "不合格"
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="right-panel">
      <div class="vehicle-list">
        <h2>车辆列表</h2>
        <el-table :data="PZList" style="width: 100%">
          <el-table-column prop="date" label="序号"> </el-table-column>
          <el-table-column prop="BusNumber" label="车牌号"> </el-table-column>
          <el-table-column prop="tare" label="车辆皮重"> </el-table-column>
        </el-table>
      </div>

      <div class="task-management">
        <h2>任务/计划管理</h2>
        <div class="form-group">
          <div class="form-item">
            <label>称重类型:</label>
            <select v-model="ptype">
              <option value="1">生产任务</option>
              <option value="2">采购计划</option>
            </select>
          </div>
          <div class="form-item">
            <label>任务/计划编号:</label>
            <input type="text" v-model="AddCode" />
          </div>
          <div class="form-item">
            <label>物料单位:</label>
            <input type="text" v-model="SupplierName" />
          </div>
          <div class="form-item">
            <label>材料规格:</label>
            <input type="text" v-model="MaterialName" />
          </div>
          <div class="form-item">
            <label>供应地址:</label>
            <input type="text" v-model="AddAddress" />
          </div>
          <div class="form-item">
            <label>加运费:</label>
            <input type="text" v-model="Freight" />
          </div>
          <button class="btn-primary center" @click="AddP">保存记录</button>
        </div>
      </div>
    </div>
    <Dialog
      v-if="showDialog"
      :activeLeft="activeLeft"
      :visible.sync="showDialog"
      ref="child"
      @data-received="handleDataReceived"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  GetPZList,
  GetCPList,
  GetWPList,
  GetHPList,
  SubmitWeight,
  InPrint,
  InPrintXC,
  GetCarNum,
  GetTotal,
  GetComPortList,
  AddOrder,
  GetProtVal,
  GetAllCarNum,
} from "@/api/Weight";
import Dialog from "./dialog.vue";
import axios from "axios";

export default {
  name: "Dashboard",
  components: { Dialog },
  data() {
    return {
      currentRole: "adminDashboard",
      radio: 1,
      showDialog: false,
      activeLeft: 1,
      activeMiddle: 1,
      CarNum: "",
      tare: "",
      count: 0.0,
      PZList: [],
      HPList: [],
      CPList: [],
      code: "",
      PName: "",
      CName: "",
      Address: "",
      Total: 0,
      CarTotal: 0,
      AllTotal: 0,
      readonly: true,
      jlonly: true,
      clonly: false,
      WeighType: 4,
      Gross: 0,
      AddGross: 0,
      tare: 0,
      Print: 0,
      DeductWeight: 0,
      DeductProportion: 0,
      SuppilerWeight: 0,
      OutTemp: 0,
      Remarks: 0,
      ptype: 1,
      AddCode: "",
      SupplierName: "",
      MaterialName: "",
      AddAddress: "",
      Freight: "",
      Cid: 0,
      Wid: 0,
      selectdb: 1,
      dbList: [],
      showCardNo: false,
      cardList: [1, 2],
    };
  },
  computed: {
    ...mapGetters(["roles"]),
    cardListFilter() {
      return this.cardList.filter((item) =>
        item.busnumber?.includes(this.CarNum)
      );
    },
  },
  mounted() {
    const parentElement = this.$refs.homeRef.parentElement;
    if (parentElement) {
      this.$refs.homeRef.style.height = `${
        parentElement.getBoundingClientRect().height
      }px`;
    }

    setInterval(() => {
      this.GetProtVal();
    }, 2000);
  },

  created() {
    this.GetPZList();
    this.GetHPList();
    this.GetComPortList();
    this.GetAllCarNum();
  },
  methods: {
    cardItemClick(item) {
      if (item) {
        this.CarNum = item.busnumber;
      }
      const timer = setTimeout(() => {
        this.showCardNo = false;
        clearTimeout(timer);
      }, 200);
    },
    GetAllCarNum() {
      GetAllCarNum().then((res) => {
        this.cardList = res.Rows;
      });
    },
    GetProtVal() {
      let data = { ID: 1 };
      GetProtVal(data).then((res) => {
        let weightlist = res.Rows;
        this.count = weightlist[0].Weight;
      });
    },
    GetComPortList() {
      GetComPortList().then((res) => {
        this.dbList = res.Rows;
      });
    },
    rowclick(row, column, event) {
      console.log(row);
      this.selectType(2);
      this.Wid = row.id;
      this.Cid = row.CID;
      this.Gross = row.GrossWeight;
      this.CarNum = row.BusNumber;
      this.code = row.code;
      this.CName = row.materialname;
      this.PName = row.suppliername;
      this.Address = "";
      this.WeighType = 2;
    },
    SaveWeight() {
      if (this.WeighType == 1) {
        this.Gross = this.count;
      }
      if (this.WeighType == 2) {
        this.tare = this.count;
        this.Print = this.Gross - this.tare;
      }
      if (this.WeighType == 4) {
        this.Gross = this.count;
        this.Print = this.Gross - this.tare;
      }
      if (this.WeighType == 5) {
        this.tare = this.count;
      }
    },
    AddGrossWeight(data) {
      this.AddGross = this.AddGross + data;
      this.Print =
        parseInt(this.Gross, 10) -
        parseInt(this.tare, 10) +
        parseInt(this.AddGross, 10);
    },
    WeightChange() {
      console.log(this.Gross - this.tare);
      if (this.WeighType == 1) {
        this.tare = 0;
        this.Print = 0;
      }
      if (this.WeighType == 2) {
        this.Print =
          parseInt(this.Gross, 10) -
          parseInt(this.tare, 10) +
          parseInt(this.AddGross, 10) -
          parseInt(this.DeductWeight, 10) -
          (parseInt(this.Gross, 10) * parseInt(this.DeductProportion, 10)) /
            100;
      }
      if (this.WeighType == 4) {
        this.Print =
          parseInt(this.Gross, 10) -
          parseInt(this.tare, 10) +
          parseInt(this.AddGross, 10);
      }
    },
    //选择过磅类型
    selectType(gtype) {
      this.activeLeft = gtype;
      this.code = "";
      this.PName = "";
      this.CName = "";
      this.Address = "";
      this.Total = 0;
      this.CarTotal = 0;
      this.AllTotal = 0;
      this.CarNum = "";
      this.Gross = 0;
      this.tare = 0;
      this.AddGross = 0;
      this.Print = 0;
      this.DeductWeight = 0;
      this.DeductProportion = 0;
      this.SuppilerWeight = 0;
      if (gtype == 1) {
        this.jlonly = true;
        this.readonly = true;
        this.clonly = false;
        this.WeighType = 4;
      }
      if (gtype == 2) {
        this.jlonly = false;
        this.readonly = true;
        this.clonly = true;
        this.WeighType = 1;
      }
      if (gtype == 3) {
        this.jlonly = false;
        this.readonly = true;
        this.clonly = false;
        this.WeighType = 5;
      }
    },
    //选择自动过磅
    selectmode(gtype) {
      this.activeMiddle = gtype;
      if (gtype == 1) {
        if (this.activeLeft == 1) {
          this.jlonly = true;
          this.readonly = true;
          this.clonly = false;
        }
        if (this.activeLeft == 2) {
          this.jlonly = false;
          this.readonly = true;
          this.clonly = true;
        }
        if (this.activeLeft == 3) {
          this.jlonly = false;
          this.readonly = true;
          this.clonly = false;
        }
      }
      if (gtype == 2) {
        this.jlonly = false;
        this.readonly = false;
        this.clonly = false;
      }
    },
    //调用弹窗方法
    showD() {
      if (this.activeLeft != 3) {
        this.showDialog = true;
      }
    },
    // 获取皮重表单
    GetPZList() {
      GetPZList().then((res) => {
        this.PZList = res.Rows;
        //this.PZList = res.data
      });
    },
    //获取回皮表单
    GetHPList() {
      GetHPList().then((res) => {
        this.HPList = res.Rows;
        //this.PZList = res.data
      });
    },
    // 获取车牌
    GetCarNum() {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        let cnum = this.CarNum;
        var data = {
          cnum: cnum,
        };
        GetCarNum(data).then((res) => {
          let car = res.Rows;
          if (car.length > 0) {
            this.CarNum = car[0].carNum;
            if (this.activeLeft == 1) {
              this.tare = car[0].tare;
            } else {
              this.tare = 0;
            }
          } else {
            this.CarNum = cnum;
            this.tare = 0;
          }

          this.Print =
            parseInt(this.Gross) +
            parseInt(this.AddGross) -
            parseInt(this.tare);

          //this.PZList = res.data
        });
      }, 300);
    },
    handleDataReceived(data) {
      this.code = data.code;
      this.PName = data.supplier_name;
      this.CName = data.material_name;
      this.Address = data.Address;
      this.Cid = data.id;

      let queryParams = { mtype: this.activeLeft, code: "" };
      if (this.activeLeft == 1) {
        queryParams.code = data.code;
      }
      if (this.activeLeft == 2) {
        queryParams.code = data.id;
      }
      GetTotal(queryParams).then((res) => {
        console.log(res);
        let retdata = res.Rows;
        this.Total = retdata[0].PrintNetWeight;
        this.CarTotal = retdata[0].printcount;
        this.AllTotal = retdata[0].todaycount;
      });
    },
    AddP() {
      let queryParams = {
        OrderType: this.ptype,
        Code: this.AddCode,
        SupplierName: this.SupplierName,
        MaterialName: this.MaterialName,
        Address: this.AddAddress,
        Freight: this.Freight,
      };
      AddOrder(queryParams).then((res) => {
        console.log(Res);
        console.log(res);
        alert(res.msg);
        if (res.code == 200) {
          this.ptype = 1;
          this.AddCode = "";
          this.SupplierName = "";
          this.MaterialName = "";
          this.AddAddress = "";
          this.Freight = "";
        }
      });
    },
    AddW() {
      let queryParams = {
        ID: this.Wid,
        CID: this.Cid,
        WeighType: this.WeighType,
        CarNum: this.CarNum,
        Gross: this.Gross,
        Tare: this.tare,
        PrintWeight: this.Print,
        DeductWeight: this.DeductWeight,
        DeductProportion: this.DeductProportion,
        SuppilerWeight: this.SuppilerWeight,
        OutTemp: this.OutTemp,
        AddWeight: this.AddGross,
        Remarks: this.Remarks,
        NormalType: this.radio,
        UserID: "1",
        Sys_ConcreteStrength_ID: "",
        Code: this.code,
      };
      SubmitWeight(queryParams).then((res) => {
        console.log(Res);
        console.log(res);
        if (res.code == 200) {
          this.GetHPList();
          this.GetPZList();
          if (this.WeighType == 5 || this.WeighType == 1) {
            alert("保存成功!");
          }
          if (this.WeighType == 2 || this.WeighType == 4) {
            if (confirm("保存成功,是否打印?")) {
              if (this.WeighType == 2) {
                let queryParams = { intType: 1, strDataID: res.WeighingDataID };
                axios
                  .post(
                    "http://localhost:44321/api/api/Weigh/InPrint",
                    queryParams
                  )
                  .then(function (success) {
                    //success 是自定义响应的参数名
                    //返回成功的响应
                    console.log(success); //响应是一个 JSON 格式(axios 自动封装的)
                    alert("打印成功!");
                  });
              }
              if (this.WeighType == 4) {
                let queryParams = { intType: 1, strDataID: res.WeighingDataID };
                axios
                  .post(
                    "http://localhost:44321/api/api/Weigh/InPrintXC",
                    queryParams
                  )
                  .then(function (success) {
                    //success 是自定义响应的参数名
                    //返回成功的响应
                    console.log(success); //响应是一个 JSON 格式(axios 自动封装的)
                    alert("打印成功!");
                  });
              }
            }
          }
          this.Wid = 0;
          this.CarNum = "";
          this.Gross = 0;
          this.tare = 0;
          this.AddGross = 0;
          this.Print = 0;
          this.DeductWeight = 0;
          this.DeductProportion = 0;
          this.SuppilerWeight = 0;
          this.OutTemp = 0;
          this.Remarks = "";
        }
      });
    },
  },
};
</script>
<style lang="scss">
@font-face {
  font-family: "MyCustomFont"; /* 自定义字体名称 */
  src: url("../../assets/Seven Segment.ttf") format("woff2"); /* 备用字体文件路径和格式 */
  font-weight: normal; /* 字体粗细 */
  font-style: normal; /* 字体样式 */
}

.page-home {
  display: flex;
  gap: 20px;
  .max-50 {
    width: 50% !important;
  }
  .input-more {
    width: 50%;
    flex: 1 0 auto;
    position: relative;
    i {
      position: absolute;
      right: 2px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 10px;
      color: #000;
      font-weight: bold;
    }
  }
  .line {
    border-bottom: 1px solid #eff0f2;
    margin-bottom: 10px;
  }
  .row {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 50%;
    flex: 1 0 auto;
    height: 100%;
    .top {
      gap: 20px;
      display: flex;
      width: 100%;
      flex: 0 0 auto;
    }
    .bottom {
      flex: 1 0 auto;
      .vehicle-list {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
        h2 {
          margin: 0;
          margin-bottom: 15px;
          font-weight: bold;
          font-size: 16px;
        }
      }
    }
  }
  .left-panel {
    width: 370px;
    flex: 0 0 auto;
  }
  .center-panel {
    width: 50%;
    flex: 1 0 auto;

    .input-group {
      button {
        background-color: #00a0e9;
        color: white;
        border: none;
        cursor: pointer;
        width: 90px;
        display: block;
        height: 34px;
        margin-left: 10px;
        flex: 0 0 auto;
      }
      &.xz-width {
        padding-right: 100px;
      }
    }
  }
  .right-panel {
    flex: 0 0 auto;
    width: 440px;
    .vehicle-list {
      display: flex;
      flex-direction: column;
    }
  }
  .el-table {
    height: 50%;
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    border: 1px solid #979797;
    display: flex;
    flex-direction: column;
    .el-table__header-wrapper {
      background: #fafafa;
      height: 40px;
      flex: 0 0 auto;
      .cell {
        color: #000;
        font-size: 14px;
        font-weight: normal;
      }
    }
    .el-table__body-wrapper {
      flex: 1 0 auto;
      height: 100px;
      overflow-y: scroll;
    }
    table th {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      font-size: 14px;
    }

    table td {
      padding: 4px 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      font-size: 12px;
    }

    table th {
      background-color: #f5f5f5;
    }
  }
  .center {
    margin: 0 auto;
    display: block;
  }

  .show-container {
    display: flex;
    height: 90px;
    margin-bottom: 20px;
    .show-l {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 90px;
      flex: 0 0 auto;
      button {
        flex: 1 0 auto;
        background: #bfbfbf;
        border: none;
        outline: none;
        color: #fff;
        font-size: 16px;
      }
      .active {
        background: #0ea2d2;
      }
    }
    .show-m {
      width: 50%;
      flex: 1 0 auto;
      background: #000000;
      margin-left: 20px;
      font-family: MyCustomFont;
      color: rgb(10, 167, 46);
      display: flex;
      text-align: right;
      align-items: center;
      box-sizing: border-box;
      padding: 0 20px;
      font-size: 90px;
      justify-content: flex-end;
    }
    .show-r {
      background: #fafafa;
      border: none;
      outline: none;
      width: 80px;
      font-size: 16px;
      color: rgb(154, 161, 189);
      margin-left: 5px;
      flex: 0 0 auto;
    }
  }

  .count {
    position: relative;
    margin-left: 10px;
    flex: 0 0 auto;
    width: 90px;
    button {
      position: absolute;
      background: none !important;
      color: #000 !important;
      width: unset !important;
      height: unset !important;
      margin: 0 !important;
      font-weight: bold;
      font-size: 16px;
      &.left {
        left: 0;
      }
      &.right {
        right: 0;
      }
    }
  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #4bbba5;
    background: #00bea4;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #00bea4;
  }
  .is-text {
    background: unset !important;
    width: unset !important;
    height: unset !important;
    border: none;
  }
  .car-no-box {
    position: relative;
    .card-no {
      position: absolute;
      max-height: 200px;
      background: white;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      z-index: 30;
      box-sizing: border-box;
      padding: 0 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      span {
        height: 25px;
        line-height: 25px;
        cursor: pointer;
      }
    }
  }
}
</style>

<style>
.page-home {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
}

.left-panel,
.center-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 20px 0 20px;
}

input,
select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  background: #fafafa;
  outline: none;
}

button {
  cursor: pointer;
}

input:focus {
  outline: none;
  border-color: #00a0e9;
}

button.btn-primary {
  background-color: #00a0e9;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0090d9;
}

.btn-secondary {
  background-color: #a5c7d3;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom: 8px;
}

.btn-gray {
  background-color: #f0f0f0;
  color: #333;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.left-panel .category-buttons {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-panel .category-buttons button {
  margin-bottom: 8px;
  width: 100%;
}

.center-panel .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.center-panel .status-dot {
  color: #00c853;
  margin-left: 8px;
}

.center-panel .mode-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.center-panel .weight-display {
  background: black;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  position: relative;
}

.center-panel .weight-value {
  color: #00ff00;
  font-size: 48px;
  font-family: "Digital-7", monospace;
  text-align: right;
}

.center-panel .weight-unit {
  position: absolute;
  right: 20px;
  bottom: 10px;
  color: #666;
}

.form-group .form-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.form-group .form-item label {
  display: block;
  margin-bottom: 5px;
  flex: 0 0 auto;
  width: 100px;
  font-weight: normal;
}
.weight-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.weight-inputs .input-group {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.weight-inputs .input-group label {
  display: block;
  margin-bottom: 5px;
  flex: 0 0 auto;
  width: 100px;
  font-weight: normal;
}

.weight-inputs .adjust-buttons {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.weight-inputs .adjust-buttons button {
  flex: 1;
  padding: 5px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.weight-inputs .adjust-buttons button:hover {
  background: #f5f5f5;
}

.license-plate {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.license-plate input {
  flex: 1;
}

.note-section {
  display: flex;
  gap: 10px;
}

.note-section input {
  flex: 1;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  width: 300px;
}

.right-panel .vehicle-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  flex: 1 0 auto;
}

.right-panel .vehicle-list h2,
.right-panel .task-management h2 {
  margin: 0;
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 16px;
}

.task-management {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 0 0 auto;
}

.right-panel table {
  width: 100%;
  border-collapse: collapse;
}

@font-face {
  font-family: "Digital-7";
  src: url("https://fonts.cdnfonts.com/css/digital-7") format("woff2");
}
</style>
