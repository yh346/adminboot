<template>
  <Modal
    v-model="visible"
    :mask-closable="false"
    :loading="formLoading"
    :closable="false"
    title="编辑选项"
    :styles="{top: '200px',position:'absolute',right:'100px'}"
    @on-cancel="handleCancel('addForm')"
    @on-ok="handleOK('addForm')"
  >
    <Form
      ref="addForm"
      :model="property_value"
      :loading="formLoading"
      :label-width="100"
      :rules="rules"
    >
      <FormItem label="值名称" prop="value_name">
        <Input v-model="property_value.value_name" placeholder="请输入值名称"/>
      </FormItem>
      <FormItem label="值代号">
        <Input v-model="property_value.value_code" placeholder="选填"/>
      </FormItem>
      <FormItem label="显示排序">
        <InputNumber v-model="property_value.sort" placeholder="数字越大越靠前"/>
      </FormItem>
      <FormItem label="是否显示">
        <i-switch v-model="property_value.is_show" size="large">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { notice } from "@/libs/util";
import { updateValue } from "@/api/goods-property";
export default {
  name: "addPropertyValue",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    propertyValue: {
      type: Object,
      required: true
    }
  },
  watch: {
    propertyValue(val) {
      if (val) {
        this.property_value = val;
      }
    },
    value(val) {
      this.visible = val;
    }
  },
  data() {
    return {
      property_value: {
        value_id: 0,
        property_id: 0,
        value_name: "",
        value_code: "",
        is_show: false,
        sort: 0
      },
      formLoading: true,
      rules: {
        value_name: [
          {
            required: true,
            message: "请输入属性值",
            trigger: "blur"
          }
        ]
      },
      visible: this.value
    };
  },
  methods: {
    handleCancel(name) {
      this.property_value = {
        value_id: 0,
        property_id: 0,
        value_name: "",
        value_code: "",
        is_show: false,
        sort: 0
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOK(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          var res = await updateValue(this.property_value);
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