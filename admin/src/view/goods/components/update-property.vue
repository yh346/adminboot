<template>
  <Drawer
    v-model="visible"
    title="编辑属性"
    width="720"
    scrollable
    :mask-closable="false"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',padding:'10px',paddingBottom: '53px', position: 'static'}"
    @on-close="handleCancel('updateForm')"
  >
    <Form ref="updateForm" :model="property" :label-width="110" :rules="rules">
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
        v-if="!is_has_option && ['2','3','4'].indexOf(property.control_type) > -1"
        label="选项值"
        prop="property_value"
      >
        <Button type="primary" size="small" @click="property.property_value.push('')">添加一个</Button>
        <Row :gutter="10">
          <Col
            v-for="(item,index) in property.property_value"
            :key="index"
            :span="12"
            style="margin-bottom:4px;"
          >
            <Input
              type="text"
              v-model="property.property_value[index]"
              placeholder="选项名称"
              style="width:200px"
            ></Input>&nbsp;&nbsp;
            <Button @click="property.property_value.splice(index,1)">删除</Button>
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
      <FormItem label>
        <Button
          type="primary"
          :loading="loading_update_basic"
          @click="handleUpdateBasic('updateForm')"
        >保存基本信息</Button>
      </FormItem>
    </Form>
    <Card :padding="6" v-if="is_has_option && ['2','3','4'].indexOf(property.control_type) > -1">
      <p slot="title">选项列表</p>
      <Button slot="extra" size="small" type="primary" @click="addModal=true">添加选项</Button>
      <Table border stripe :columns="columns" :data="property.property_value_array"></Table>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="drawer-footer">
      <Button @click="handleCancel('updateForm')">关闭</Button>
    </div>
    <add-property-value
      :value="addModal"
      :property-id="property.property_id"
      @on-ok="handleAddOk"
      @on-cancel="handleAddCancel"
    ></add-property-value>
    <update-property-value
      :value="updateModal"
      :property-value="property_value"
      @on-ok="handleUpdateOk"
      @on-cancel="handleUpdateCancel"
    ></update-property-value>
  </Drawer>
</template>

<script>
import { notice, deepCopy } from "@/libs/util";
import { enumList } from "@/api/enum";
import { info, deleteValue, update } from "@/api/goods-property";
import { list } from "@/api/goods-type";
import AddPropertyValue from "./add-property-value";
import UpdatePropertyValue from "./update-property-value";
export default {
  name: "updateProperty",
  components: {
    AddPropertyValue,
    UpdatePropertyValue
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    propertyId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    propertyId(val) {
      if (val > 0) {
        this.property.property_id = val;
        this.getInfo();
      }
    }
  },
  mounted() {
    this.getControlTypes();
    this.getList();
  },
  data() {
    return {
      goods_type_array: [],
      control_type_array: [],
      property: {
        property_id: 0
      },
      property_value: {},
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
      is_has_option: false,
      columns: [
        {
          title: "值ID",
          key: "value_id",
          width: 70,
          align: "center"
        },
        {
          title: "值名称",
          key: "value_name"
        },
        {
          title: "值代号",
          key: "value_code",
          width: 120,
          align: "center"
        },
        {
          title: "是否显示",
          key: "value_name",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_show ? "green" : ""
                }
              },
              params.row.is_show ? "是" : "否"
            );
          }
        },
        {
          title: "显示排序",
          key: "sort",
          width: 85,
          align: "center"
        },
        {
          title: "操作",
          width: 125,
          align: "right",
          render: (h, params) => {
            var btns = [];
            if (!params.row.deleting) {
              btns.push(
                h(
                  "Button",
                  {
                    props: {
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.property_value = deepCopy(params.row);
                        this.updateModal = true;
                      }
                    }
                  },
                  "编辑"
                )
              );
            }
            btns.push(
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除这个选项吗？",
                    placement: "top-end",
                    transfer: true
                  },
                  on: {
                    "on-ok": async () => {
                      this.$set(params.row, "deleting", true);
                      var res = await deleteValue(params.row.value_id);
                      this.$set(params.row, "deleting", false);
                      if (!res.code) {
                        this.property.property_value_array.splice(params.index, 1);
                        notice.showSuccess(this, "删除成功");
                      } else {
                        notice.showError(this, res.message);
                      }
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small",
                        loading: params.row.deleting
                      }
                    },
                    "删除"
                  )
                ]
              )
            );
            return h("div", btns);
          }
        }
      ],
      spinShow: false,
      addModal: false,
      updateModal: false,
      loading_update_basic: false,
      visible: this.value
    };
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
    getInfo() {
      this.spinShow = true;
      info(this.property.property_id).then(res => {
        this.spinShow = false;
        if (!res.code) {
          this.property = res.data;
          this.property.goods_type_id = this.property.goods_type_id.toString();
          this.property.control_type = this.property.control_type.toString();
          this.is_has_option =
            ["2", "3", "4"].indexOf(this.property.control_type) > -1;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleUpdateBasic(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.loading_update_basic = true;
          this.property.property_value_array = this.property
            .property_value_array
            ? this.property.property_value_array
                .filter(p => p)
                .map(p => p.value_name)
            : [];
          var res = await update(this.property);
          this.loading_update_basic = false;
          if (!res.code) {
            this.handleCancel(name);
            this.$emit("on-ok");
          } else {
            notice.showError(this, res.message);
          }
        }
      });
    },
    handleCancel(name) {
      this.property = {
        property_id: 0
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleAddOk() {
      this.addModal = false;
      notice.showSuccess(this, "添加选项成功");
      this.getInfo();
    },
    handleAddCancel() {
      this.addModal = false;
    },
    handleUpdateOk() {
      this.addModal = false;
      this.property_value = {};
      notice.showSuccess(this, "编辑选项成功");
      this.getInfo();
    },
    handleUpdateCancel() {
      this.property_value = {};
      this.updateModal = false;
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
  z-index: 10;
}
</style>
