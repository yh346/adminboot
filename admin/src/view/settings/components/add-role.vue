<template>
  <Modal
    v-model="visible"
    :mask-closable="false"
    :loading="formLoading"
    :closable="false"
    title="新增角色"
    @on-ok="handleOk('addForm')"
    @on-cancel="handleCancel('addForm')"
  >
    <Form ref="addForm" :model="role" :label-width="80" :rules="rules">
      <FormItem label="角色名称" prop="role_name" label-for="role_name">
        <Input
          ref="role_name"
          element-id="role_name"
          v-model="role.role_name"
          placeholder="角色名称"
          style="width: 300px"
        ></Input>
      </FormItem>
      <FormItem label="排序" label-for="sort">
        <InputNumber element-id="sort" :min="0" v-model="role.sort"></InputNumber>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { add } from "@/api/admin-role";
import { notice } from "@/libs/util";
export default {
  name: "addRole",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.$nextTick(() => {
          this.$refs.role_name.focus();
        });
      }
    }
  },
  data() {
    return {
      visible: this.val,
      formLoading: true,
      role: {
        sort: 0,
        role_name: ""
      },
      rules: {
        role_name: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleCancel(name) {
      this.role = {
        sort: 0,
        role_name: ""
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          var res = await add(this.role);
          if (!res.code) {
            this.handleCancel(name);
            this.$emit("on-ok");
          } else {
            notice.showError(this, res.message);
          }
        }
        this.formLoading = false;
        this.$nextTick(() => {
          this.formLoading = true;
        });
      });
    }
  }
};
</script>

<style>
</style>
