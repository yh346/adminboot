<template>
  <div>
    <Form ref="updateForm" :model="goods_type" :label-width="90" :rules="rules">
      <FormItem label="类型名称" prop="goods_type_name">
        <Input v-model="goods_type.goods_type_name" placeholder="请输入类型名称"/>
      </FormItem>
      <FormItem label="前台显示">
        <Checkbox v-model="goods_type.is_show">&nbsp;</Checkbox>
      </FormItem>
      <FormItem label="显示排序">
        <InputNumber v-model="goods_type.sort" :precision="0"></InputNumber>
      </FormItem>
      <FormItem label="类型描述">
        <Input type="textarea" :rows="5" v-model="goods_type.description" placeholder="类型描述"/>
      </FormItem>
      <FormItem label="SEO标题">
        <Input type="textarea" :rows="2" v-model="goods_type.page_title" placeholder="SEO标题"/>
      </FormItem>
      <FormItem label="SEO关键词">
        <Input type="textarea" :rows="2" v-model="goods_type.page_keywords" placeholder="SEO关键词"/>
      </FormItem>
      <FormItem label="SEO描述">
        <Input type="textarea" :rows="5" v-model="goods_type.page_description" placeholder="SEO描述"/>
      </FormItem>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleUpdateCancel('updateForm')">取消</Button>
      <Button type="primary" @click="handleUpdateOk('updateForm')" :loading="formLoading">确定</Button>
    </div>
  </div>
</template>

<script>
import { notice } from "@/libs/util";
import { update } from "@/api/goods-type";
export default {
  name: "updateGoodsType",
  props: {
    value: {
      type: Object,
      default() {
        return {
          goods_type_name: "",
          description: "",
          is_show: true,
          sort: 0
        };
      }
    }
  },
  watch: {
    value(val) {
      this.goods_type = val;
    }
  },
  data() {
    return {
      rules: {
        goods_type_name: [
          { required: true, message: "请输入类型名称", trigger: "blur" }
        ]
      },
      formLoading: false,
      goods_type: this.value
    };
  },
  methods: {
    handleUpdateCancel(name) {
      this.goods_type = {
        goods_type_name: "",
        description: "",
        is_show: true,
        sort: 0
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleUpdateOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await update(this.goods_type);
          this.formLoading = false;
          if (!res.code) {
            this.handleUpdateCancel(name);
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
