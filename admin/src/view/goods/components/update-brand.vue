<template>
  <Drawer
    v-model="visible"
    title="编辑品牌"
    width="720"
    scrollable
    :mask-closable="false"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',padding:'10px',paddingBottom: '53px', position: 'static'}"
    @on-close="handleCancel('updateForm')"
  >
    <Form ref="updateForm" :model="goods_brand" :label-width="110" :rules="rules">
      <FormItem label="所属商品类型" prop="brand_name">
        <CheckboxGroup v-model="goods_brand.goods_type_id_array">
          <Checkbox
            :label="item.key"
            v-for="item in goods_type_array"
            :key="item.key"
          >{{item.value}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="品牌名称" prop="brand_name">
        <Input v-model="goods_brand.brand_name" placeholder="请输入品牌名称"/>
      </FormItem>
      <FormItem label="显示排序">
        <InputNumber v-model="goods_brand.sort"></InputNumber>
      </FormItem>
      <FormItem label="品牌描述">
        <Input type="textarea" :rows="5" v-model="goods_brand.remark" placeholder="品牌描述"/>
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
import { notice, deepCopy } from "@/libs/util";
import { update, info } from "@/api/goods-brand";
import { list } from "@/api/goods-type";
export default {
  name: "updateBrand",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    brandId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    brandId(val) {
      if (val) {
        this.goods_brand.brand_id = val;
        this.getInfo();
        if (!this.goods_type_array.length) {
          this.getTypes();
        }
      }
    }
  },
  data() {
    return {
      visible: this.value,
      goods_brand: {
        goods_type_id_array: []
      },
      rules: {
        brand_name: [
          {
            required: true,
            message: "请输入品牌名称",
            trigger: "blur"
          }
        ]
      },
      formLoading: false,
      goods_type_array: [],
      spinShow: false
    };
  },
  methods: {
    getInfo() {
      this.spinShow = true;
      info(this.goods_brand.brand_id).then(res => {
        this.spinShow = false;
        if (!res.code) {
          this.goods_brand = res.data;
        }
      });
    },
    getTypes() {
      list().then(res => {
        if (!res.code) {
          this.goods_type_array = res.data;
        }
      });
    },
    handleCancel(name) {
      this.goods_brand = {
        brand_id: 0,
        brand_name: "",
        sort: 0,
        remark: "",
        goods_type_id_array: []
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await update(this.goods_brand);
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
