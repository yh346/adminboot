<template>
  <div>
    <Form ref="addForm" :model="goodsType" :label-width="110" :rules="rules">
      <FormItem label="属性名称" prop="goods_type_name">
        <Input v-model="goodsType.goods_type_name" placeholder="请输入类型名称"/>
      </FormItem>
      <FormItem label="前台显示">
        <Checkbox v-model="goodsType.is_show">&nbsp;</Checkbox>
      </FormItem>
      <FormItem label="显示排序">
        <InputNumber v-model="goodsType.sort" :precision="0"></InputNumber>
      </FormItem>
      <FormItem label="类型描述">
        <Input type="textarea" :rows="5" v-model="goodsType.description" placeholder="类型描述"/>
      </FormItem>
      <FormItem label="SEO标题">
        <Input type="textarea" :rows="2" v-model="goodsType.page_title" placeholder="SEO标题"/>
      </FormItem>
      <FormItem label="SEO关键词">
        <Input type="textarea" :rows="2" v-model="goodsType.page_keywords" placeholder="SEO关键词"/>
      </FormItem>
      <FormItem label="SEO描述">
        <Input type="textarea" :rows="5" v-model="goodsType.page_description" placeholder="SEO描述"/>
      </FormItem>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleAddCancel('addForm')">取消</Button>
      <Button type="primary" @click="handleAddOk('addForm')" :loading="formLoading">确定</Button>
    </div>
  </div>
</template>

<script>
import { notice } from "@/libs/util";
import { add } from "@/api/goods-type";
export default {
  name: "addGoodsType",
  data() {
    return {
      goodsType: {
        goods_type_name: "",
        description: "",
        is_show: true,
        sort: 0,
        page_title: "",
        page_keywords: "",
        page_description: ""
      },
      rules: {
        goods_type_name: [
          { required: true, message: "请输入类型名称", trigger: "blur" }
        ]
      },
      formLoading: false
    };
  },

  methods: {
    handleAddCancel(name) {
      this.goodsType = {
        goods_type_name: "",
        description: "",
        is_show: true,
        sort: 0,
        page_title: "",
        page_keywords: "",
        page_description: ""
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleAddOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await add(this.goodsType);
          this.formLoading = false;
          if (!res.code) {
            this.handleAddCancel(name);
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
