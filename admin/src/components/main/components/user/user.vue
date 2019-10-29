<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar style="background-color: #87d068" size="large"  icon="ios-person" />
      <span class="user-real-name">{{user&&user.name}}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="info">个人信息</DropdownItem> -->
        <DropdownItem name="modify">修改密码</DropdownItem>
        <DropdownItem name="logout" divided>退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import "./user.less";
import { mapActions } from "vuex";
export default {
  name: "User",
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    handleClick(name) {
      switch (name) {
        case "info":
          this.$router.push({
            name: "my_info"
          });
          break;
        case "modify":
          this.$router.push({
            name: "modify_pwd"
          });
          break;
        case "logout":
          this.handleLogOut().then(() => {
            this.$router.push({
              name: "login"
            });
          });
          break;
      }
    }
  }
};
</script>
