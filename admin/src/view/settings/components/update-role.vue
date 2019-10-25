<template>
  <Modal
    v-model="visible"
    :mask-closable="false"
    :loading="formLoading"
    :closable="false"
    title="编辑角色"
    @on-ok="handleOk('updateForm')"
    @on-cancel="handleCancel('updateForm')"
  >
    <Form ref="updateForm" :model="admin_role" :label-width="80" :rules="rules">
      <FormItem label="角色名称" prop="role_name" label-for="role_name">
        <Input
          ref="role_name"
          element-id="role_name"
          v-model="admin_role.role_name"
          placeholder="角色名称"
          style="width: 300px"
        ></Input>
      </FormItem>
      <FormItem label="排序" label-for="sort">
        <InputNumber element-id="sort" :min="0" v-model="admin_role.sort"></InputNumber>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { update } from "@/api/admin-role";
import { notice } from "@/libs/util";
export default {
  name: "updateRole",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    role: {
      type: Object,
      default() {
        return {
          role_id: 0,
          role_name: ""
        };
      }
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
    },
    role: {
      handler(val) {
        this.admin_role = val;
      },
      deep: true
    }
  },
  data() {
    return {
      visible: this.val,
      formLoading: true,
      admin_role: {
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
      this.admin_role = {
        sort: 0,
        role_name: ""
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          var res = await update(this.admin_role);
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
