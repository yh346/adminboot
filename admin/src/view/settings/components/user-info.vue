<template>
  <Drawer width="512" v-model="visible" :mask-closable="false" @on-close="handleClose">
    <div class="drawer-person">
      <Form :label-width="130">
        <FormItem label="用户名：">
          {{user.user_name}}
          <Tag color="success" v-if="user.is_super">超级用户</Tag>
        </FormItem>
        <FormItem label="所属部门：">{{user.dept_name}}</FormItem>
        <FormItem label="是否主管：">{{user.is_dept_director?'是':'否'}}</FormItem>
        <FormItem label="角色：">{{user.role_name_array && user.role_name_array.join('，')}}</FormItem>
        <FormItem label="姓名：">{{user.real_name}}</FormItem>
        <FormItem label="性别：">{{user.gender?'男':'女'}}</FormItem>
        <FormItem label="手机号码：">{{user.mobile}}</FormItem>
        <FormItem label="电子邮箱：">{{user.email}}</FormItem>
        <FormItem label="状态：">
          <Tag :color="user.is_disabled?'red':'green'">{{user.is_disabled?'禁用':'正常'}}</Tag>
        </FormItem>
        <FormItem label="添加时间：">{{user.create_time}}</FormItem>
        <FormItem label="最后一次登录信息：">【{{user.last_login_time}}】【{{user.last_login_ip}}】</FormItem>
        <FormItem label="登录次数：">{{user.login_times}} 次</FormItem>
        <FormItem label="备注：">{{user.remark}}</FormItem>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="drawer-footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
import { getInfo } from "@/api/admin-user";
import { notice } from "@/libs/util";
export default {
  name: "userInfo",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    adminId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    adminId(val) {
      if (val) {
        this.user.admin_id = val;
        this.getUserInfo();
      }
    }
  },
  data() {
    return {
      user: {},
      spinShow: false,
      visible: false
    };
  },
  methods: {
    getUserInfo() {
      this.spinShow = true;
      getInfo(this.user.admin_id).then(res => {
        this.spinShow = false;
        if (!res.code) {
          this.user = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleClose() {
      this.$emit("on-close");
    }
  }
};
</script>

<style lang="less" scoped>
.drawer-person {
  .ivu-form-item {
    margin-bottom: 8px;
  }
}
.drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
