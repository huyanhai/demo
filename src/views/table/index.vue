<template>
  <div class="page-form">
    <el-form ref="form" :model="form" inline>
      <el-form-item label="磅单类型">
        <el-select v-model="queryParams.wType" placeholder="请选择磅单类型">
          <el-option label="进料磅单" value="1"></el-option>
          <el-option label="退料磅单" value="2"></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item label="项目名称">
        <el-input v-model="queryParams.pName"></el-input>
      </el-form-item>
      <el-form-item label="司磅员">
        <el-input v-model="queryParams.UserName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="U_Code" align="center"  label="过磅单编号" width="180"> </el-table-column>
      <el-table-column prop="BusNumber" align="center"  label="车牌号码" width="100"> </el-table-column>
      <el-table-column prop="material_name" align="center"  label="材料规格" width="150"> </el-table-column>
      <el-table-column prop="GrossWeight" align="center"  label="毛重" width="80"> </el-table-column>
      <el-table-column prop="MinusWeight" align="center"  label="扣重" width="80"> </el-table-column>
      <el-table-column prop="Tare" align="center"  label="皮重" width="80"> </el-table-column>
      <el-table-column prop="PrintNetWeight" align="center"  label="净重" width="100"> </el-table-column>
      <el-table-column prop="SupplierTicketData" align="center"  label="供方净重" width="100"> </el-table-column>
      <el-table-column prop="supplier_name" align="center"  label="供应商" width="150"> </el-table-column>
      <el-table-column prop="supplier_name" align="center"  label="客户单位" width="150"> </el-table-column>
      <el-table-column prop="InitialDate" align="center"  label="入场时间" width="180"> </el-table-column>
      <el-table-column prop="FinalDate" align="center"  label="出场时间" width="180"> </el-table-column>
      <el-table-column prop="CreationTime" align="center"  label="创建时间" width="180"> </el-table-column>
      <el-table-column prop="UserName" align="center"  label="司磅员" width="150"> </el-table-column>
      <el-table-column prop="Remarks" align="center"  label="备注" width="180"> </el-table-column>
      <el-table-column prop="address" align="center"  label="操作" width="150"> 
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
import { GetOrderWeightList,GetWeightByID,DeleteWeightByID} from "@/api/Manage";
import { GetWPList } from "@/api/Weight";
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
    printw(row){
       if(confirm("是否重新打印该磅单?")){
                let queryParams = {intType:2,strDataID:row.id}
                axios.post('http://localhost:44321/api/api/Weigh/InPrint',queryParams).then(function (success) { //success 是自定义响应的参数名
                  //返回成功的响应
                  console.log(success); //响应是一个 JSON 格式(axios 自动封装的)
                  alert("打印成功!");
                })
            }
    },
    previeww(row) {
      let queryParams = {utype:0,wType:1,ID:row.id}
      this.$refs.child.GetWeightByID(queryParams);
      this.showDialog=true;
    },
    updatew(row) {
      let queryParams = {utype:1,wType:1,ID:row.id}
      this.$refs.child.GetWeightByID(queryParams);
      this.showDialog=true;
    },
    deletew(row) {
      let queryParams = {ID:row.id}
      DeleteWeightByID(queryParams).then(res=>{
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
      GetOrderWeightList(this.queryParams).then(res=>{
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
