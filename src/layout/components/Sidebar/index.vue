<template>
  <div :class="{ 'has-logo': showLogo }" class="user-menu">
    <div class="user-info">
      <img src="../../../assets/tx.png" alt="" />
      <span>超级管理员</span>
    </div>
    <div class="user-op">
      <a>修改密码</a>
      <a @click.stop="logout">注销</a>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>
<style lang="scss">
.user-menu {
  .el-menu,
  .el-menu-item {
    background: transparent !important;
    color: #fff !important;
  }
  .el-submenu__title:hover {
    background: transparent !important;
    font-weight: bold;
  }
}

.user-op {
  color: #fff;
  display: flex;
  height: 30px;
  align-items: center;
  a {
    display: block;
    color: white;
    font-size: 14px;
    text-align: center;
  }
}

.user-info {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  box-sizing: border-box;
  img {
    width: 56px;
    height: 56px;
  }
  span {
    font-size: 14px;
    color: #fff;
    margin-left: 10px;
  }
}
</style>
