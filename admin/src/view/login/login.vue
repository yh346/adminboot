<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :loading="loading"></login-form>
          <p class="login-tip">{{errorMsg}}</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      loading: false,
      errorMsg: ""
    };
  },
  methods: {
    ...mapActions(["handleLogin"]),
    handleSubmit(json) {
      this.loading = true;
      this.handleLogin(json).then(res => {
        this.loading = false;
        if (!res.code) {
          this.$router.push({
            name: "home"
          });
        } else {
          this.errorMsg = res.message;
        }
      });
    }
  }
};
</script>

<style>
</style>
