<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" :loading="loading" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: "LoginForm",
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit("on-success-valid", this.form);
        }
      });
    }
  }
};
</script>
