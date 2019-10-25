<template>
  <Modal
    v-model="visible"
    :mask-closable="false"
    :loading="formLoading"
    :closable="false"
    title="添加选项"
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
    </Form>
  </Modal>
</template>

<script>
import { notice } from "@/libs/util";
import { addValue } from "@/api/goods-property";
export default {
  name: "addPropertyValue",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    propertyId: {
      type: Number,
      required: true
    }
  },
  watch: {
    propertyId(val) {
      if (val > 0) {
        this.property_value.property_id = val;
      }
    },
    value(val) {
      this.visible = val;
    }
  },
  data() {
    return {
      property_value: {
        property_id: 0,
        value_name: "",
        value_code: "",
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
  mounted() {},
  methods: {
    handleCancel(name) {
      this.saleSlipCollect = {
        property_id: 0,
        value_name: "",
        value_code: "",
        sort: 0
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOK(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          var res = await addValue(this.property_value);
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