<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" title="查看/修改" width="1200px">
    <div class="page-form">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="任务单号">
                <el-input v-model="form.code" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
                <el-input v-model="form.ProjectName" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户单位">
                <el-input v-model="form.ContactName" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="车牌号码">
                <el-input v-model="form.CarNumber" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="砼类型">
                <el-input v-model="form.qlx" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排产量">
              <el-input v-model="form.quantity" type="number" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="出厂温度">
                <el-input v-model="form.OutTemp" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人">
              <el-input v-model="form.Site_Contacter" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式">
              <el-input v-model="form.Site_Contacter_PN" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="项目地址">
          <el-input v-model="form.Address" :readonly="updatetype"></el-input>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="updatetype">保存</el-button>
          <el-button @click="close">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
</el-dialog>
  </template>
  <script>
  import { GetYHWeightByID,AddMaintenance} from "@/api/Manage";
  import axios from 'axios';
  export default {
    data() {
      return {
        form: {
        },
        updatetype:true,
        wpList:[],
        InitialDate:new Date(),
        FinalDate:new Date(),
      };
    },
    created(){
    },
    methods: {
      onSubmit() {
        console.log(this.form);
        AddMaintenance(this.form).then(res=>{
         if(confirm(res.msg)){
                  let queryParams = {intType:1,strDataID:res.WeighingDataID}
                  axios.post('http://localhost:44321/api/api/Weigh/InPrintYH',queryParams).then(function (success) { //success 是自定义响应的参数名
                    //返回成功的响应
                    console.log(success); //响应是一个 JSON 格式(axios 自动封装的)
                    alert("打印成功!");
                  })
              }
              
              this.$emit("update:visible", false);
        })
      },
    close() {
      this.$emit("update:visible", false);
    },
    handleChange(data){
      console.log(data);
      let item=this.wpList.filter(item => item.mid == data);
      console.log(item);
      this.form.material_name=item[0].material_name;
    },
    GetYHWeightByID(data){
        if(data.utype==0){
            this.updatetype=true;
        }
        else{
            this.updatetype=false;
        }
        if(data.ID>0){
          GetYHWeightByID(data).then(res=>{
              this.form=res.Rows[0];
              console.log(this.form);
          })
        }
        else{
          this.form={
            ID:0,
            Address:"",
            CarNumber:"",
            ContactName:"",
            CreateTime:"",
            CreateUser:"",
            IsValid:"",
            OutTemp:"",
            ProjectName:"",
            Site_Contacter:"",
            Site_Contacter_PN:"",
            code:"",
            qlx:"",
            quantity:"",
            UpdateTime:"",
            UpdateUser:"",
          }
        }
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
  