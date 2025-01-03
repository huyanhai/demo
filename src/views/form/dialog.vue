<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" title="查看/修改" width="1200px">
    <div class="page-form">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="过磅单号">
                <el-input v-model="form.U_Code" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="过磅类型">
              <el-radio-group v-model="form.WeighingMode">
                <el-radio :label="1">进料</el-radio>
                <el-radio :label="2">退料</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="车牌号码">
                <el-input v-model="form.BusNumber" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <!-- <el-select v-model="form.supplier_name" placeholder="请选择活动区域" :disabled="updatetype">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select> -->
              <el-select v-model="form.mid" placeholder="请选择项目"  :disabled="updatetype" @change="handleChange">
                <el-option v-for="item in cpList" :value="item.mid" :label="item.selectlable">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="材料名称">
              <el-input v-model="form.qlx" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="毛重">
                <el-input v-model="form.GrossWeight" type="number" :readonly="updatetype" @change="WeightChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="皮重">
              <el-input v-model="form.Tare" type="number" :readonly="updatetype" @change="WeightChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="净重">
              <el-input v-model="form.PrintNetWeight" type="number" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="增加毛重">
                <el-input v-model="form.AddValue" type="number" :readonly="updatetype" @change="WeightChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出场时间">
                <el-date-picker 
                    type="datetime" 
                    placeholder="选择日期时间" 
                    value-format="yyyy-MM-dd HH:mm:ss"
                     :readonly="updatetype"
                    v-model="form.InitialDate" 
                    style="width: 100%" > 
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出料温度">
                <el-input v-model="form.Temperature" :readonly="updatetype"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.Remarks" :readonly="updatetype"></el-input>
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
  import { GetOrderWeightList,GetWeightByID,DeleteWeightByID,UpdateWeightByID} from "@/api/Manage";
  import { GetCPListAll } from "@/api/Weight";
  export default {
    data() {
      return {
        form: {
        },
        updatetype:true,
        cpList:[],
        InitialDate:new Date(),
        FinalDate:new Date(),
      };
    },
    created(){
        this.GetCPListAll();
    },
    methods: {
      onSubmit() {
        console.log(this.form);
        UpdateWeightByID(this.form).then(res=>{
          alert(res.msg);
          if(parseInt(res.code,10)==200){
            this.$emit("update:visible", false);
          }
        })
      },
    close() {
      this.$emit("update:visible", false);
    },
    handleChange(data){
      console.log(data);
      let item=this.cpList.filter(item => item.mid == data);
      console.log(item);
      this.form.qlx=item[0].material_name;
    },
      GetWeightByID(data){
        console.log(data.utype==0)
        if(data.utype==0){
            this.updatetype=true;
        }
        else{
            this.updatetype=false;
        }
        console.log(this.updatetype);
        GetWeightByID(data).then(res=>{
            this.form=res.Rows[0];
            console.log(this.form);
            if(this.form.WeighingMode==''){
              this.form.WeighingMode='1';
            }
            this.form.WeighingMode=parseInt(this.form.WeighingMode,10);
            this.form.InitialDate=this.form.InitialDate.split('/').join('-');
        })
      },
    //获取采购表单
    GetCPListAll() {
      this.wpList=[];
      GetCPListAll().then(res => {
        this.cpList=res.Rows;
        //this.PZList = res.data
        for(let i=0;i<this.cpList.length;i++){
          this.cpList[i].selectlable=this.cpList[i].code+'-'+this.cpList[i].ProjectName+'-'+this.cpList[i].material_name;
        }
      })
    },
    WeightChange(){
      this.form.PrintNetWeight=parseInt(this.form.GrossWeight,10)-parseInt(this.form.Tare,10)+parseInt(this.form.AddValue,10);
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
  