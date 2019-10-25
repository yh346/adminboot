<template>
  <Drawer
    width="720"
    v-model="visible"
    :mask-closable="false"
    title="新增用户"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
    @on-close="handleCancel('addForm')"
  >
    <Form ref="addForm" :model="user" :label-width="100" :rules="rules">
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="用户名" prop="user_name" label-for="user_name">
            <Input autofocus element-id="user_name" v-model="user.user_name" placeholder="用户名"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="登录密码" prop="user_pwd" label-for="user_pwd">
            <Input element-id="user_pwd" type="text" v-model="user.user_pwd" placeholder="登录密码"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="所属部门" prop="dept_id">
            <Select v-model="user.dept_id">
              <Option v-for="item in deptArray" :value="item.dept_id.toString()" :key="item.dept_id">{{ item.dept_name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="是否主管">
            <Checkbox v-model="user.is_dept_director"></Checkbox>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="角色" prop="role_id_array" class="ivu-form-item-required">
            <Select v-model="user.role_id_array" multiple>
              <Option
                v-for="item in roleArray"
                :value="item.role_id"
                :key="item.role_id"
              >{{ item.role_name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="姓名">
            <Input element-id="real_name" type="text" v-model="user.real_name" placeholder="姓名"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="手机号码" label-for="mobile">
            <Input element-id="mobile" type="text" v-model="user.mobile" placeholder="手机号码"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="电子邮箱" label-for="email">
            <Input element-id="email" type="email" v-model="user.email" placeholder="电子邮箱"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="性别">
            <RadioGroup v-model="user.sex">
              <Radio :label="1">男</Radio>
              <Radio :label="0">女</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="状态">
            <i-switch v-model="user.is_status_ok" size="large">
              <span slot="open">正常</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="24">
          <FormItem label="备注" label-for="remark">
            <Input v-model="user.remark" :autosize="{minRows:4,maxRows:6}" type="textarea"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('addForm')">取消</Button>
      <Button type="primary" @click="handleOk('addForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { add } from "@/api/admin-user";
import { notice } from "@/libs/util";
export default {
  name: "addUser",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    deptArray: {
      type: Array,
      default() {
        return [];
      }
    },
    roleArray: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    }
  },
  data() {
    return {
      user: {
        admin_id: 0,
        sex: 1,
        is_status_ok: true,
        role_id_array: [],
        dept_id: ""
      },
      rules: {
        user_name: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        user_pwd: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur"
          }
        ],
        dept_id: [{ required: true, message: "请选择部门", trigger: "change" }],
        role_id_array: [
          {
            validator: (rule, value, callback) => {
              if (value.length === 0) {
                callback(new Error("请选择角色"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      formLoading: false,
      visible: this.value
    };
  },
  methods: {
    handleCancel(name) {
      this.user = {
        admin_id: 0,
        sex: 1,
        is_status_ok: true,
        role_id_array: [],
        user_type_array: [],
        dept_id: "",
        is_dept_director: false
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          this.user.is_disabled = !this.user.is_status_ok;
          this.user.gender = this.user.sex === 1;
          var res = await add(this.user);
          this.formLoading = false;
          if (!res.code) {
            this.handleCancel(name);
            this.$emit("on-ok");
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
