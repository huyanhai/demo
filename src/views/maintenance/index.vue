<template>
    <div class="page-form">
      <el-form ref="form" :model="form" inline>
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="daterangeCreateTime"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="车牌号码">
          <el-input v-model="queryParams.CarNum"></el-input>
        </el-form-item>
        <el-form-item label="材料规格">
          <el-input v-model="queryParams.mName"></el-input>
        </el-form-item>
        <el-form-item label="客户单位">
          <el-input v-model="queryParams.pName"></el-input>
        </el-form-item>
        <el-form-item label="司磅员">
          <el-input v-model="queryParams.UserName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button type="primary" @click="AddRow">新增</el-button>
          <el-button @click="ResetInput">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="code" align="center"  label="任务单号" width="250"> </el-table-column>
        <el-table-column prop="ContactName" align="center"  label="客户单位" width="200"> </el-table-column>
        <el-table-column prop="CarNumber" align="center"  label="车牌号码" width="100"> </el-table-column>
        <el-table-column prop="qlx" align="center"  label="砼类型" width="90"> </el-table-column>
        <el-table-column prop="CreateTime" align="center"  label="创建时间" width="100"> </el-table-column>
        <el-table-column prop="quantity" align="center"  label="排产量" width="80"> </el-table-column>
        <el-table-column prop="OutTemp" align="center"  label="出厂温度" width="80"> </el-table-column>
        <el-table-column prop="Address" align="center"  label="项目地址" width="250"> </el-table-column>
        <el-table-column prop="Site_Contacter" align="center"  label="联系人" width="100"> </el-table-column>
        <el-table-column prop="Site_Contacter_PN" align="center"  label="联系方式" width="150"> </el-table-column>
        <el-table-column prop="address" align="center"  label="操作" width="200"> 
          <template slot-scope="scope">
            <el-link @click="printw(scope.row)">打印</el-link> | 
            <el-link @click="previeww(scope.row)">查看</el-link> | 
            <el-link @click="updatew(scope.row)">修改</el-link> | 
            <el-link @click="deletew(scope.row)">删除</el-link> 
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-show="total>0"
        :total="total"
        :currentPage.sync="queryParams.PageNum"
        :page-size.sync="queryParams.PageSize"
        layout="jumper,prev,pager,next,total"
        @current-change="getList"
      />
      <Dialog :visible.sync="showDialog"  ref="child"  @update:visible="handleDialogClose" />
    </div>
    
  </template>
  <script>
  import { GetMaintenanceWeightList,DeleteYHWeightByID} from "@/api/Manage";
  import axios from 'axios';
  import Dialog from "./dialog.vue";
  export default {
    components: { Dialog },
    data() {
      return {
        form: { name: "" },
        loading:false,
        showDialog:false,
        // 创建时间时间范围
        daterangeCreateTime: [],
        // 查询参数
        queryParams: {
          PageNum: 1,
          PageSize: 10,
          startTime: null,
          endTime: null,
          wType: null,
          CarNum: null,
          mName: null,
          pName: null,
          UserName: null,
        },
        total: 0,
        // 任务管理表格数据
        tableData: [
        ],
      };
    },
    methods: {
      ResetInput(){
        this.queryParams={
          PageNum: 1,
          PageSize: 10,
          startTime: null,
          endTime: null,
          wType: null,
          CarNum: null,
          mName: null,
          pName: null,
          UserName: null,
        }
        this.getList();
      },
      printw(row){
         if(confirm("是否重新打印该磅单?")){
                  let queryParams = {intType:2,strDataID:row.ID}
                  axios.post('http://localhost:44321/api/api/Weigh/InPrintYH',queryParams).then(function (success) { //success 是自定义响应的参数名
                    //返回成功的响应
                    console.log(success); //响应是一个 JSON 格式(axios 自动封装的)
                    alert("打印成功!");
                  })
              }
      },
      previeww(row) {
        let queryParams = {utype:0,wType:0,ID:row.ID}
        this.$refs.child.GetYHWeightByID(queryParams);
        this.showDialog=true;
      },
      AddRow(row) {
        let queryParams = {utype:2,wType:0,ID:0}
        this.$refs.child.GetYHWeightByID(queryParams);
        this.showDialog=true;
      },
      updatew(row) {
        let queryParams = {utype:1,wType:0,ID:row.ID}
        this.$refs.child.GetYHWeightByID(queryParams);
        this.showDialog=true;
      },
      deletew(row) {
        let queryParams = {ID:row.ID}
        DeleteYHWeightByID(queryParams).then(res=>{
          alert(res.msg)
        })
        this.getList();
      },
      handleDialogClose(isVisible) {
        this.showDialog = isVisible;
        this.getList();
      },
  
      onSubmit() {
        this.queryParams.PageNum=1;
        this.getList();
      },
      /** 查询任务管理列表 */
      getList() {
        this.loading = true;
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.startTime = this.daterangeCreateTime[0];
          this.queryParams.endTime = this.daterangeCreateTime[1];
        }
        GetMaintenanceWeightList(this.queryParams).then(res=>{
          if(parseInt(res.Total, 10)==0){
            this.tableData=[];
          }
          else{
            this.tableData=res.Rows;
          }
          this.total=parseInt(res.Total, 10);
          this.loading = false;
        })
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  .page-form {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 20px;
  }
  </style>
  