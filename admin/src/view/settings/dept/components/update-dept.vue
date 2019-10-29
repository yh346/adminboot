<template>
  <Drawer
    width="520"
    v-model="visible"
    :mask-closable="false"
    title="编辑部门"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
    @on-close="handleCancel('updateForm')"
  >
    <Form ref="updateForm" :model="dept" :label-width="80" :rules="rules">
      <FormItem label="上级部门">
        <Tag color="success" v-if="dept.parent_dept_name">{{dept.parent_dept_name}}</Tag>
      </FormItem>
      <FormItem label="部门名称" prop="dept_name" label-for="dept_name">
        <Input ref="dept_name" element-id="dept_name" v-model="dept.dept_name" placeholder="部门名称"></Input>
      </FormItem>
      <FormItem label="部门类型" prop="dept_type">
        <Select v-model="dept.dept_type">
          <Option v-for="item in type_array" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="排序" label-for="sort">
        <InputNumber element-id="sort" :min="0" v-model="dept.sort"></InputNumber>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('updateForm')">取消</Button>
      <Button type="primary" @click="handleOk('updateForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { enumList } from "@/api/enum";
import { update, getInfo } from "@/api/dept";
import { notice } from "@/libs/util";
export default {
  name: "updateDept",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    deptId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val && !this.type_array.length) {
        this.getTypes();
      }
    },
    deptId(val) {
      if (val) {
        this.dept.dept_id = val;
        this.getDeptInfo();
      }
    }
  },
  data() {
    return {
      visible: this.value,
      formLoading: false,
      dept: {
        dept_id: 0,
        dept_name: "",
        dept_type: 0,
        sort: 0
      },
      rules: {
        dept_name: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur"
          }
        ],
        dept_type: [
          {
            required: true,
            type: "integer",
            message: "请选择部门类型",
            trigger: "blur"
          }
        ]
      },
      type_array: [],
      spinShow: false
    };
  },
  methods: {
    getDeptInfo() {
      this.spinShow = true;
      getInfo(this.dept.dept_id).then(res => {
        this.spinShow = false;
        if (!res.code) {
          this.dept = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    getTypes() {
      enumList(101).then(res => {
        if (!res.code) {
          this.type_array = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleCancel(name) {
      this.dept = {
        dept_id: 0,
        dept_name: "",
        dept_type: 0,
        sort: 0
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await update(this.dept);
          this.formLoading = false;
          if (!res.code) {
            this.handleCancel(name);
            this.$emit("on-ok", {
              id: res.data.id,
              label: res.data.label
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
