<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" title="任务/计划" width="1200px">
    <el-radio-group v-model="type" style="margin-bottom: 10px">
      <el-radio-button label="1">正供</el-radio-button>
      <el-radio-button label="2">供毕</el-radio-button>
    </el-radio-group>
    <el-table :data="tableData" style="width: 100%; height: 500px">
      <el-table-column prop="code" label="订单号"> </el-table-column>
      <el-table-column prop="ProjectName" label="项目名称"> </el-table-column>
      <el-table-column prop="supplier_name" label="物料单位"> </el-table-column>
      <el-table-column prop="material_name" label="材料规格"> </el-table-column>
      <el-table-column prop="Address" label="施工地址"> </el-table-column>
      <el-table-column prop="jhl" label="计划量"> </el-table-column>
      <el-table-column prop="yj" label="计划运距"> </el-table-column>
      <el-table-column prop="create_time" label="供货/入库时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template v-if="type === '1'">
            <el-link @click="select(scope.row)" :underline="false">选择</el-link>
            <el-divider direction="vertical"></el-divider>
          </template>
          <el-link @click="close(scope.row)" :underline="false">
            {{ type === "1" ? "转毕" : "正供" }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { GetCPList, GetWPList, GetCPEndList, GetWPEndList, UpdateStatus } from "@/api/Weight";
export default {
  props: {
    activeLeft: Number,
  },
  data() {
    return {
      tableData: [],
      type: "1",
    };
  },
  watch: {
    type: {
      handler(value) {
        this.getData();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getData() {
      if (this.activeLeft == 1) {
        this.type === "1" ? this.GetCPList() : this.GetCPEndList();
      } else {
        this.type === "1" ? this.GetWPList() : this.GetWPEndList();
      }
    },
    select(row) {
      const dataToSend = {
        id: row.id,
        code: row.code,
        supplier_name: row.supplier_name,
        material_name: row.material_name,
        Address: row.Address,
      };
      this.$emit("data-received", dataToSend);
      this.$emit("update:visible", false);
    },
    close(item) {
      const status = this.activeLeft == 1 ? (this.type === "1" ? 3 : 1) : this.type === "1" ? 3 : 0;
      UpdateStatus({
        wType: this.activeLeft,
        ID: item.mid,
        Status: status,
      }).then((res) => {
        this.$emit("update:visible", false);
      });
    },
    //获取正供表单
    GetCPList() {
      this.tableData = [];
      GetCPList().then((res) => {
        this.tableData = res.Rows;
      });
    },
    GetCPEndList() {
      this.tableData = [];
      GetCPEndList().then((res) => {
        this.tableData = res.Rows;
      });
    },

    //获取采购表单
    GetWPList() {
      this.tableData = [];
      GetWPList().then((res) => {
        this.tableData = res.Rows;
      });
    },
    GetWPEndList() {
      this.tableData = [];
      GetWPEndList().then((res) => {
        this.tableData = res.Rows;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
