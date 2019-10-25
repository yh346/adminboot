<template>
  <Drawer
    v-model="visible"
    title="新增属性"
    width="720"
    scrollable
    :mask-closable="false"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',padding:'10px',paddingBottom: '53px', position: 'static'}"
    @on-close="handleCancel('addForm')"
  >
    <Form ref="addForm" :model="property" :label-width="110" :rules="rules">
      <FormItem label="所属产品类型" prop="goods_type_id">
        <Select v-model="property.goods_type_id" placeholder="请选择所属产品类型">
          <Option
            v-for="(option, index) in goods_type_array"
            :value="option.key"
            :key="index"
          >{{option.value}}</Option>
        </Select>
      </FormItem>
      <FormItem label="属性名称" prop="property_name">
        <Input v-model="property.property_name" placeholder="请输入属性名称"/>
      </FormItem>
      <FormItem label="是否规格">
        <Checkbox v-model="property.is_spec" @on-change="handleChangeIsSpec">&nbsp;</Checkbox>
      </FormItem>
      <FormItem label="是否图片规格" v-if="property.is_spec">
        <Checkbox v-model="property.is_pic_spec" :disabled="!property.is_spec">&nbsp;</Checkbox>
      </FormItem>
      <FormItem label="内容类型" prop="control_type">
        <Select v-model="property.control_type" placeholder="请选择内容类型">
          <Option
            v-for="(option, index) in control_type_array"
            :value="option.code"
            :key="index"
            :disabled="property.is_spec && option.code != 3"
          >{{option.name}}</Option>
        </Select>
      </FormItem>
      <FormItem
        v-if="property.control_type==2||property.control_type==3||property.control_type==4"
        label="选项值"
        prop="property_value"
      >
        <Button type="primary" size="small" @click="property.property_value_array.push('')">添加一个</Button>
        <Row :gutter="10">
          <Col
            v-for="(item,index) in property.property_value_array"
            :key="index"
            :span="12"
            style="margin-bottom:4px;"
          >
            <Input
              type="text"
              v-model="property.property_value_array[index]"
              placeholder="选项名称"
              style="width:200px"
            ></Input>&nbsp;&nbsp;
            <Button @click="property.property_value_array.splice(index,1)">删除</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="必填项">
        <Checkbox v-model="property.is_required" :disabled="property.is_spec">&nbsp;</Checkbox>
      </FormItem>
      <FormItem label="列表筛选">
        <Checkbox v-model="property.is_filter">&nbsp;</Checkbox>
      </FormItem>
      <FormItem label="前台显示">
        <Checkbox v-model="property.is_show">&nbsp;</Checkbox>
      </FormItem>
      <FormItem label="显示排序">
        <InputNumber v-model="property.sort"></InputNumber>
      </FormItem>
      <FormItem label="属性说明">
        <Input v-model="property.tooltip" placeholder="请输入属性说明"/>
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
import { notice, deepCopy } from "@/libs/util";
import { list } from "@/api/goods-type";
import { add } from "@/api/goods-property";
export default {
  name: "addProperty",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    goodsTypeId: {
      type: String,
      default: ""
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    goodsTypeId(val) {
      if (val) {
        this.property.goods_type_id = val;
      }
    }
  },
  data() {
    return {
      goods_type_array: [],
      control_type_array: [],
      property: {
        goods_type_id: "",
        property_name: "",
        control_type: "",
        is_spec: false,
        is_pic_spec: false,
        is_filter: true,
        is_show: true,
        is_required: false,
        sort: 0,
        tooltip: "",
        property_value_array: []
      },
      rules: {
        goods_type_id: [
          { required: true, message: "请选择所属产品类型", trigger: "change" }
        ],
        property_name: [
          {
            required: true,
            message: "请输入属性名称",
            trigger: "blur"
          }
        ],
        control_type: [
          { required: true, message: "请选择内容类型", trigger: "change" }
        ],
        property_value: [
          {
            validator: (rule, value, callback) => {
              if (
                (this.property.control_type == 2 ||
                  this.property.control_type == 3 ||
                  this.property.control_type == 4) &&
                this.property.property_value.findIndex(p => p) === -1
              ) {
                callback(new Error("请至少配置一个选项"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      formLoading: false,
      visible: this.value
    };
  },
  mounted() {
    this.getControlTypes();
    this.getList();
  },
  methods: {
    getControlTypes() {
      enumList(112).then(res => {
        if (!res.code) {
          this.control_type_array = res.data;
        }
      });
    },
    getList() {
      list().then(res => {
        if (!res.code) {
          this.goods_type_array = res.data;
        }
      });
    },
    handleChangeIsSpec(checked) {
      if (!checked) {
        this.property.is_pic_spec = false;
        this.property.is_required = false;
      } else {
        this.property.control_type = "3";
        this.property.is_required = true;
      }
    },
    handleCancel(name) {
      var obj = deepCopy(this.property);
      this.property = {
        goods_type_id: obj.goods_type_id,
        property_name: "",
        control_type: "",
        is_spec: false,
        is_pic_spec: false,
        is_filter: true,
        is_show: true,
        is_required: false,
        sort: 0,
        tooltip: "",
        property_value_array: []
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          this.property.property_value_array = this.property.property_value_array.filter(
            p => p
          );
          var res = await add(this.property);
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
