<template>
  <Drawer
    width="520"
    v-model="visible"
    :mask-closable="false"
    title="新增部门"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
    @on-close="handleCancel('addForm')"
  >
    <Form ref="addForm" :model="dept" :label-width="80" :rules="rules">
      <FormItem label="上级部门">
        <Tag color="success" v-if="parent_dept_name">{{parent_dept_name}}</Tag>
      </FormItem>
      <FormItem label="部门名称" prop="dept_name" label-for="dept_name">
        <Input ref="dept_name" element-id="dept_name" v-model="dept.dept_name" placeholder="部门名称"></Input>
      </FormItem>
      <FormItem label="部门类型" prop="dept_type">
        <Select v-model="dept.dept_type">
          <Option v-for="item in type_array" :value="item.code.toString()" :key="item.code">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="排序" label-for="sort">
        <InputNumber element-id="sort" :min="0" v-model="dept.sort"></InputNumber>
      </FormItem>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('addForm')">取消</Button>
      <Button type="primary" @click="handleOk('addForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { enumList } from "@/api/enum";
import { add } from "@/api/dept";
import { notice } from "@/libs/util";
export default {
  name: "addDept",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    parent: {
      type: Object,
      default() {
        return {
          parent_dept_id: 0,
          parent_dept_name: ""
        };
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    parent: {
      handler(val) {
        if (val && val.parent_dept_id) {
          this.dept.parent_dept_id = val.parent_dept_id;
          this.parent_dept_name = val.parent_dept_name;
          if (!this.type_array.length) {
            this.getTypes();
          }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      visible: this.value,
      formLoading: false,
      dept: {
        dept_id: 0,
        parent_dept_id: 0,
        dept_name: "",
        dept_type: "",
        sort: 0
      },
      parent_dept_name: "",
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
            message: "请选择部门类型",
            trigger: "change"
          }
        ]
      },
      type_array: []
    };
  },
  methods: {
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
        parent_dept_id: 0,
        dept_name: "",
        dept_type: "",
        sort: 0
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await add(this.dept);
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
