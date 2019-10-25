<template>
  <Drawer
    v-model="visible"
    title="新增品牌"
    width="720"
    scrollable
    :mask-closable="false"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',padding:'10px',paddingBottom: '53px', position: 'static'}"
    @on-close="handleCancel('addForm')"
  >
    <Form ref="addForm" :model="brand" :label-width="110" :rules="rules">
      <FormItem label="所属商品类型" prop="brand_name">
        <CheckboxGroup v-model="brand.goods_type_id_array">
          <Checkbox
            :label="item.key"
            v-for="item in goods_type_array"
            :key="item.key"
          >{{item.value}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="品牌名称" prop="brand_name">
        <Input v-model="brand.brand_name" placeholder="请输入品牌名称"/>
      </FormItem>
      <FormItem label="显示排序">
        <InputNumber v-model="brand.sort"></InputNumber>
      </FormItem>
      <FormItem label="品牌描述">
        <Input type="textarea" :rows="5" v-model="brand.remark" placeholder="品牌描述"/>
      </FormItem>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('addForm')">取消</Button>
      <Button type="primary" @click="handleOk('addForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { notice } from "@/libs/util";
import { manage, add } from "@/api/goods-brand";
import { list } from "@/api/goods-type";
export default {
  name: "addbrand",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    }
  },
  data() {
    return {
      visible: this.value,
      brand: {
        brand_name: "",
        sort: 0,
        remark: "",
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
      goods_type_array: []
    };
  },
  mounted() {
    notice.init(this);
    this.getTypes();
  },
  methods: {
    getTypes() {
      list().then(res => {
        if (!res.code) {
          this.goods_type_array = res.data;
        }
      });
    },
    handleCancel(name) {
      this.brand = {
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
          var res = await add(this.brand);
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
