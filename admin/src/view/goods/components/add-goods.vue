<template>
  <Drawer
    width="80"
    v-model="visible"
    title="新增商品"
    :mask-closable="false"
    scrollable
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',padding:'10px',paddingBottom: '53px', position: 'static'}"
    @on-close="handleCancel('addForm')"
  >
    <Form ref="addForm" :model="goods" :label-width="100" :rules="rules">
      <Collapse v-model="collapse_value">
        <Panel name="1">基本信息
          <Row slot="content">
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="商品类型" prop="goods_type_id">
                <Select
                  v-model="goods.goods_type_id"
                  placeholder="请选择商品类型"
                  @on-change="handleChangeGoodsType"
                >
                  <Option
                    v-for="(option, index) in goods_type_array"
                    :value="option.key"
                    :key="index"
                  >{{option.value}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="商品品牌" prop="brand_id">
                <Select v-model="goods.brand_id" placeholder="请选择商品品牌">
                  <Option
                    v-for="(option, index) in goods_brand_array"
                    :value="option.key"
                    :key="index"
                  >{{option.value}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="商品名称" prop="goods_name" label-for="goods_name">
                <Input element-id="goods_name" v-model="goods.goods_name" placeholder="请输入商品名称"></Input>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="商品类别" prop="type_id">
                <Select v-model="goods.type_id" placeholder="请选择商品类别">
                  <Option
                    v-for="(option, index) in type_array"
                    :value="option.code"
                    :key="index"
                  >{{option.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="简短描述" label-for="brief">
                <Input element-id="brief" v-model="goods.brief" placeholder="简短描述"></Input>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="商品型号" label-for="model">
                <Input element-id="model" v-model="goods.model" placeholder="商品型号"></Input>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="货号" label-for="item_code">
                <Input element-id="item_code" v-model="goods.item_code" placeholder="货号"></Input>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="市场价">
                <InputNumber :min="0" v-model="goods.market_price"/>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="销售价">
                <InputNumber :min="0" v-model="goods.sale_price"/>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="商品重量">
                <InputNumber :min="0" v-model="goods.weight"/>&nbsp;g
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="计价单位" prop="unit_name" label-for="unit_name">
                <Input element-id="unit_name" v-model="goods.unit_name" placeholder="请输入计价单位"></Input>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="原产地" label-for="place_origin">
                <Input element-id="place_origin" v-model="goods.place_origin" placeholder="原产地"></Input>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="下单检查库存">
                <Checkbox v-model="goods.is_check_stock"></Checkbox>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="销量">
                <InputNumber :min="0" v-model="goods.sell_num"/>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="浏览数">
                <InputNumber :min="0" v-model="goods.hits"/>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="6">
              <FormItem label="显示排序">
                <InputNumber :min="0" v-model="goods.sort"/>
              </FormItem>
            </Col>
          </Row>
        </Panel>
        <Panel name="2">SEO信息（选填）
          <div slot="content">
            <FormItem label="SEO标题" prop="page_title" label-for="page_title">
              <Input element-id="page_title" v-model="goods.page_title" placeholder="SEO标题"></Input>
            </FormItem>
            <FormItem label="SEO关键词" prop="page_keywords" label-for="page_keywords">
              <Input element-id="page_keywords" v-model="goods.page_keywords" placeholder="SEO关键词"></Input>
            </FormItem>
            <FormItem label="SEO描述" prop="page_description" label-for="page_description">
              <Input
                element-id="page_description"
                v-model="goods.page_description"
                type="textarea"
                :rows="3"
                placeholder="SEO描述"
              ></Input>
            </FormItem>
          </div>
        </Panel>
        <Panel name="3">属性信息
          <div :model="goods" slot="content">
            <FormItem
              v-for="(item,index) in goods._property_array"
              :key="index"
              :label="item.property_name"
              :prop="item.control_type===1||item.control_type===5?'_property_array.' + index +'.property_text':item.control_type===3?'_property_array.' + index +'.property_value_array':'_property_array.' + index +'.property_value'"
              :rules="{required: item.is_required, type:item.control_type===3? 'array':'', message: item.control_type===1||item.control_type===5?'请输入'+item.property_name:'请选择'+item.property_name, trigger: item.control_type===1||item.control_type===5?'blur':'change'}"
            >
              <Tooltip :content="item.tooltip" style="width:100%;" :disabled="!item.tooltip">
                <Input
                  v-if="item.control_type===1"
                  v-model="goods._property_array[index].property_text"
                  :placeholder="item.property_name"
                ></Input>
                <RadioGroup
                  v-model="goods._property_array[index].property_value"
                  v-if="item.control_type===2"
                >
                  <Radio
                    :label="value.value_id"
                    v-for="value in item.option_array"
                    :key="'value_'+value.value_id"
                  >{{value.value_name}}</Radio>
                </RadioGroup>
                <CheckboxGroup
                  v-model="goods._property_array[index].property_value_array"
                  v-if="item.control_type===3"
                >
                  <Checkbox
                    :label="value.value_id"
                    v-for="value in item.option_array"
                    :key="'value_'+value.value_id"
                  >{{value.value_name}}</Checkbox>
                </CheckboxGroup>
                <Select
                  v-model="goods._property_array[index].property_value"
                  v-if="item.control_type===4"
                >
                  <Option
                    v-for="value in item.option_array"
                    :value="value.value_id"
                    :key="'value_'+value.value_id"
                  >{{ value.value_name }}</Option>
                </Select>
                <Input
                  v-if="item.control_type===5"
                  type="textarea"
                  :auto-size="{minRows:2,maxRows:4}"
                  v-model="goods._property_array[index].property_text"
                  :placeholder="item.property_name"
                ></Input>
              </Tooltip>
            </FormItem>
          </div>
        </Panel>
        <Panel name="4">图片信息
          <p slot="content">
            <Card style="margin:-10px -10px 10px -10px;">
              <p slot="title">
                列表图
                <span class="sub-title">（最佳尺寸：300*300）</span>
              </p>
              <single-upload
                :src="goods.original_image"
                :width="200"
                :height="200"
                @on-success="(src)=>goods.original_image=src"
              ></single-upload>
            </Card>
            <Card style="margin:0 -10px;">
              <p slot="title">
                轮播图
                <span class="sub-title">（最佳尺寸：800*800）</span>
              </p>
              <multiple-upload
                :default-upload-list="image_array"
                :width="200"
                :height="200"
                @on-success="(list)=>goods.image_array=list"
              ></multiple-upload>
            </Card>
          </p>
        </Panel>
        <Panel name="5">SKU信息
          <div slot="content">
            <FormItem
              v-for="(item,index) in goods._spec_property_array"
              :key="index"
              :label="item.property_name"
              :prop="'_spec_property_array.' + index +'.property_value_array'"
              :rules="{required: item.is_required, type:'array', message: '请选择'+item.property_name, trigger:'change'}"
            >
              <Tooltip :content="item.tooltip" style="width:100%;" :disabled="!item.tooltip">
                <CheckboxGroup
                  v-model="goods._spec_property_array[index].property_value_array"
                  @on-change="handleChangeSpec"
                  size="large"
                >
                  <Checkbox
                    :label="value.value_id"
                    v-for="value in item.option_array"
                    :key="'value_'+value.value_id"
                    :style="{display:'block',width:item.is_pic_spec?'316px':'230px',height:item.is_pic_spec?'82px':'40px'}"
                  >
                    <Input
                      v-model="value.new_value_name"
                      @on-blur="handleValueBlur(index,value)"
                      style="width:200px;margin-right:10px;"
                    />
                    <!--加label是为了阻止事件冒泡（checkbox），加了for是为了防止触发2次-->
                    <label for="test">
                      <single-upload
                        v-if="item.is_pic_spec"
                        :src="value.original_image"
                        :width="80"
                        :height="80"
                        @on-success="(src)=>value.original_image=src"
                      ></single-upload>
                    </label>
                  </Checkbox>
                </CheckboxGroup>
              </Tooltip>
            </FormItem>
            <Table
              stripe
              border
              v-if="goods.sku_array.length"
              :data="goods.sku_array"
              :columns="columns"
            ></Table>
          </div>
        </Panel>
        <Panel name="6">详细信息
          <p slot="content">
            <ueditor :margin="'-10px'" @on-sync="(html)=>goods.description=html"></ueditor>
          </p>
        </Panel>
      </Collapse>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('addForm')">取消</Button>
      <Button type="primary" @click="handleOk('addForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { notice, deepCopy } from "@/libs/util";
import { enumList } from "@/api/enum";
import { add } from "@/api/goods";
import { list as listTypes, listBrands } from "@/api/goods-type";
import { list as listProperty } from "@/api/goods-property";
export default {
  name: "addGoods",
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
      formLoading: false,
      collapse_value: ["1"],
      goods_type_array: [],
      goods_brand_array: [],
      type_array: [],
      goods: {
        goods_id: 0,
        goods_name: "",
        goods_type_id: "",
        brand_id: "",
        type_id: "",
        brief: "",
        model: "",
        item_code: "",
        market_price: 0,
        sale_price: 0,
        weight: 0,
        unit_name: "",
        place_origin: "",
        is_check_stock: true,
        sell_num: 0,
        hits: 0,
        sort: 0,
        page_title: "",
        page_keywords: "",
        page_description: "",
        description: "",
        _property_array: [],
        _spec_property_array: [],
        sku_array: [],
        original_image: ""
      },
      image_array: [],
      rules: {
        goods_type_id: [
          {
            required: true,
            message: "请选择商品类型",
            trigger: "change"
          }
        ],
        brand_id: [
          {
            required: true,
            message: "请选择商品品牌",
            trigger: "change"
          }
        ],
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        type_id: [
          {
            required: true,
            message: "请选择商品类别",
            trigger: "change"
          }
        ],
        unit_name: [
          {
            required: true,
            message: "请输入商品计价单位",
            trigger: "blur"
          }
        ]
      },
      spinShow: false,
      columns: [
        {
          title: "规格",
          key: "value_texts",
          width: 150
        },
        {
          title: "规格别名",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.sku_name
              },
              on: {
                "on-change": event => {
                  params.row.sku_name = event.target.value;
                  this.goods.sku_array[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: "SKU编码",
          width: 200,
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.sku_code
              },
              on: {
                "on-change": event => {
                  params.row.sku_code = event.target.value;
                  this.goods.sku_array[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: "库存数",
          width: 120,
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                min: 0,
                precision: 0,
                value: params.row.stock
              },
              on: {
                "on-change": val => {
                  params.row.stock = val;
                  this.goods.sku_array[params.index] = params.row;
                }
              }
            });
          }
        },
        {
          title: "零售价",
          width: 120,
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                min: 0,
                value: params.row.price
              },
              on: {
                "on-change": val => {
                  params.row.price = val;
                  this.goods.sku_array[params.index] = params.row;
                }
              }
            });
          }
        }
      ]
    };
  },
  mounted() {
    this.getGoodsTypes();
    this.getTypes();
  },
  methods: {
    getGoodsTypes() {
      listTypes().then(res => {
        if (!res.code) {
          this.goods_type_array = res.data;
        }
      });
    },
    getTypes() {
      enumList(113).then(res => {
        if (!res.code) {
          this.type_array = res.data;
          if (this.type_array.length) {
            this.goods.type_id = this.type_array[0].code;
          }
        }
      });
    },
    handleChangeGoodsType() {
      if (this.goods.goods_type_id) {
        this.spinShow = true;
        Promise.all([
          listProperty(this.goods.goods_type_id),
          listBrands(this.goods.goods_type_id)
        ]).then(res => {
          this.spinShow = false;
          if (!res[0].code) {
            this.goods._property_array = res[0].data.filter(p => !p.is_spec);
            this.goods._spec_property_array = res[0].data.filter(
              p => p.is_spec
            );
          } else {
            notice.showError(this, res[0].message);
          }
          if (!res[1].code) {
            this.goods_brand_array = res[1].data;
          } else {
            notice.showError(this, res[1].message);
          }
        });
      }
    },
    handleChangeSpec() {
      var sku_array = deepCopy(this.goods.sku_array);
      this.goods.sku_array.splice(0, this.goods.sku_array.length);
      if (this.goods._spec_property_array.length === 1) {
        var o1 = this.goods._spec_property_array[0];
        var len1 = o1.property_value_array.length;
        if (len1) {
          for (var i = 0; i < len1; i++) {
            var val1 = o1.property_value_array[i];
            var txt1 = o1.option_array.find(p => p.value_id == val1)
              .new_value_name;
            var sku = sku_array.find(p => p.value_ids === val1);
            this.goods.sku_array.push({
              value_ids: val1,
              value_texts: txt1,
              sku_name: (sku && sku.sku_name) || txt1,
              price: (sku && sku.price) || 0,
              sku_code: (sku && sku.sku_code) || val1,
              stock: (sku && sku.stock) || 0
            });
          }
        }
      } else {
        var o1 = this.goods._spec_property_array[0];
        var o2 = this.goods._spec_property_array[1];
        var len1 = o1.property_value_array.length;
        var len2 = o2.property_value_array.length;
        if (len1 && len2) {
          for (var i = 0; i < len1; i++) {
            var val1 = o1.property_value_array[i];
            var txt1 = o1.option_array.find(p => p.value_id == val1)
              .new_value_name;
            for (var j = 0; j < len2; j++) {
              var val2 = o2.property_value_array[j];
              var txt2 = o2.option_array.find(p => p.value_id == val2)
                .new_value_name;
              var value_ids = val1 + "-" + val2;
              var sku = sku_array.find(p => p.value_ids === value_ids);
              this.goods.sku_array.push({
                value_ids: value_ids,
                value_texts: `${txt1}+${txt2}`,
                sku_name: (sku && sku.sku_name) || txt1 + txt2,
                price: (sku && sku.price) || 0,
                sku_code: (sku && sku.sku_code) || value_ids,
                stock: (sku && sku.stock) || 0
              });
            }
          }
        }
      }
    },
    handleValueBlur(index, value) {
      if (this.goods.sku_array.length) {
        this.goods.sku_array
          .filter(p => p.value_ids.indexOf(value.value_id) > -1)
          .forEach(p => {
            var is_same = p.sku_name == p.value_texts.replace("+", "");
            var arr = p.value_texts.split("+");
            if (arr.length == 1) {
              p.value_texts = value.new_value_name;
            } else {
              p.value_texts =
                index === 0
                  ? value.new_value_name + "+" + arr[1]
                  : arr[0] + "+" + value.new_value_name;
            }
            if (is_same) {
              p.sku_name = p.value_texts.replace("+", "");
            }
          });
      }
    },
    handleCancel(name) {
      this.goods = {
        goods_id: 0,
        goods_name: "",
        goods_type_id: "",
        brand_id: "",
        type_id: "",
        brief: "",
        model: "",
        item_code: "",
        market_price: 0,
        sale_price: 0,
        weight: 0,
        unit_name: "",
        place_origin: "",
        is_check_stock: true,
        sell_num: 0,
        hits: 0,
        sort: 0,
        page_title: "",
        page_keywords: "",
        page_description: "",
        description: "",
        _property_array: [],
        property_array: [],
        _spec_property_array: [],
        spec_property_array: [],
        sku_array: [],
        original_image: ""
      };
      this.image_array = [];
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.goods.spec_property_array = this.goods._spec_property_array.map(
            p => {
              return {
                property_id: p.property_id,
                property_value_array: p.property_value_array.map(q => {
                  var value = p.option_array.find(m => m.value_id == q);
                  return {
                    value_id: q,
                    new_value_name: value.new_value_name,
                    original_image: value.original_image || ""
                  };
                })
              };
            }
          );
          this.goods.property_array = this.goods._property_array.map(p => {
            var obj = {
              property_id: p.property_id
            };
            switch (p.control_type) {
              case 1:
              case 5:
                obj.property_text = p.property_text;
                obj.property_value = 0;
                obj.property_value_array = [];
                break;
              case 2:
              case 4:
                obj.property_value = p.property_value || 0;
                obj.property_text = "";
                obj.property_value_array = [];
                break;
              case 3:
                obj.property_text = "";
                obj.property_value = 0;
                obj.property_value_array = p.property_value_array;
                break;
            }
            return obj;
          });
          this.formLoading = true;
          var res = await add(this.goods);
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
.sub-title {
  font-size: 12px;
  color: #808695;
  font-weight: normal;
}
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
