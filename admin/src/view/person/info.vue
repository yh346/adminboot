<template>
  <div class="small">
    <Card>
      <p slot="title">个人信息</p>
      <Form :label-width="120">
        <FormItem label="用户名：">{{user.user_name}}</FormItem>
        <FormItem label="姓名：">
          <Input v-model="user.real_name" style="width:240px;"/>
        </FormItem>
        <FormItem label="性别：">
          <RadioGroup v-model="user.gender">
            <Radio :label="1">男</Radio>
            <Radio :label="2">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="所属部门：">{{user.dept_name}}</FormItem>
        <FormItem label="是否主管：">{{user.is_dept_director?'是':'否'}}</FormItem>
        <FormItem label="手机号：">
          <Input v-model="user.mobile" style="width:240px;"/>
        </FormItem>
        <FormItem label="邮箱：">
          <Input v-model="user.email" style="width:240px;"/>
        </FormItem>
        <FormItem label="最后登录时间：">{{user.login_time}}</FormItem>
        <FormItem label="最后登录IP：">{{user.login_ip}}</FormItem>
        <FormItem>
          <Button type="primary" :loading="loading" @click="handleSubmit">确定修改</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import { notice } from "@/libs/util";
import { updateInfo } from "@/api/admin-user";
export default {
  name: "personInfo",
  data() {
    return {
      loading: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    }
  },
  mounted() {
    notice.init(this, 100);
  },
  methods: {
    handleSubmit() {
      this.loading = true;
      updateInfo(this.user).then(res => {
        this.loading = false;
        if (!res.code) {
          this.$store.dispatch("getUserInfo");
          notice.showSuccess(this, "修改成功");
        } else {
          notice.showError(this, res.message);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.small {
  .ivu-form-item {
    margin-bottom: 10px;
  }
}
</style>
