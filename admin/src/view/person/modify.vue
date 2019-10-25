<template>
  <div>
    <Card>
      <p slot="title">修改密码</p>
      <Form ref="addForm" :model="user" :label-width="180" :rules="rules">
        <!-- <FormItem label="用户名：">
          {{current_user&&(current_user.real_name||current_user.nick_name||current_user.user_name)}}
        </FormItem> -->
        <FormItem label="原密码：" prop="old_pwd" label-for="old_pwd" class="ivu-form-item-required">
          <Input autofocus element-id="old_pwd" type="password" v-model="user.old_pwd" placeholder="原密码" style="width:220px;"></Input>
        </FormItem>
        <FormItem label="新密码：" prop="user_pwd" label-for="user_pwd" class="ivu-form-item-required">
          <Input element-id="user_pwd" type="password" v-model="user.user_pwd" placeholder="新密码" style="width:220px;"></Input>
        </FormItem>
        <FormItem label="确认密码：" prop="user_re_pwd" label-for="user_re_pwd" class="ivu-form-item-required">
          <Input element-id="user_re_pwd" type="password" v-model="user.user_re_pwd" placeholder="请再次输入新密码" style="width:220px;"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" :disabled="disabled" :loading="loading" @click="handleSubmit('addForm')">确定修改</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { modifyPwd } from "@/api/admin-user";
import { notice } from "@/libs/util";
export default {
  name: "modifyPwd",
  data() {
    return {
      user: {
        old_pwd: "",
        user_pwd: "",
        user_re_pwd: ""
      },
      rules: {
        old_pwd: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入原密码"));
              } else {
                if (value && value.length < 6) {
                  callback(new Error("至少输入6位原密码"));
                } else {
                  callback();
                }
              }
            }
          }
        ],
        user_pwd: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入新密码"));
              } else {
                if (value && value.length < 6) {
                  callback(new Error("至少输入6位新密码"));
                } else {
                  callback();
                }
              }
            }
          }
        ],
        user_re_pwd: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请再次输入新密码"));
              } else if (value !== this.user.user_pwd) {
                callback(new Error("两次输入的密码不一致"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      loading: false
    };
  },
  computed: {
    current_user() {
      return this.$store.state.user.user;
    },
    disabled() {
      return (
        this.user.old_pwd === "" ||
        this.user.user_re_pwd === "" ||
        this.user.user_re_pwd !== this.user.user_pwd
      );
    }
  },
  mounted() {
    notice.init(this, 100);
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          var res = await modifyPwd(this.user);
          if (!res.code) {
            var that = this;
            notice.showSuccess(this, {
              title: "修改密码成功，请重新登录",
              duration: 2,
              onClose: () => {
                that.handleLogOut().then(() => {
                  that.$router.push({
                    name: "login"
                  });
                });
              }
            });
          } else {
            notice.showError(this, res.message);
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
