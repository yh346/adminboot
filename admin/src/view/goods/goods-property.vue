<template>
  <div>
    <Tabs v-model="current" type="card" @on-click="changeType">
      <TabPane
        v-for="item in goods_type_array"
        :key="item.key"
        :label="item.value"
        :name="item.key"
      ></TabPane>
    </Tabs>
    <Button
      type="success"
      shape="circle"
      icon="ios-add-circle-outline"
      style="margin-right:15px;margin-bottom:10px;"
      @click="addModal=true"
    >新增属性</Button>
    <Button
      type="primary"
      shape="circle"
      icon="ios-search"
      style="margin-bottom:10px;"
      @click="getList(true)"
    >刷新一下</Button>
    <Table border stripe :columns="columns" :data="data" :loading="loading"></Table>
    <add-property
      :value="addModal"
      :goods-type-id="current"
      @on-ok="handleAddPropertyOk"
      @on-cancel="handleAddPropertyCancel"
    ></add-property>
    <update-property
      :value="updateModal"
      :property-id="property_id"
      @on-ok="handleUpdatePropertyOk"
      @on-cancel="handleUpdatePropertyCancel"
    ></update-property>
  </div>
</template>
<script>
import { notice } from "@/libs/util";
import { list } from "@/api/goods-type";
import { manage, del } from "@/api/goods-property";
import AddProperty from "./components/add-property";
import UpdateProperty from "./components/update-property";
export default {
  name: "goodsProperty",
  components: {
    AddProperty,
    UpdateProperty
  },
  data() {
    return {
      columns: [
        {
          title: "属性ID",
          width: 75,
          key: "property_id",
          align: "center"
        },
        {
          title: "属性名称",
          key: "property_name",
          width: 120
        },
        {
          title: "内容类型",
          key: "control_type_name",
          align: "center",
          width: 100
        },
        {
          title: "规格",
          width: 65,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_spec ? "green" : ""
                }
              },
              params.row.is_spec ? "是" : "否"
            );
          }
        },
        {
          title: "图片规格",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_pic_spec ? "green" : ""
                }
              },
              params.row.is_pic_spec ? "是" : "否"
            );
          }
        },
        {
          title: "选项值",
          width: 300,
          render: (h, params) => {
            return params.row.property_value_array
              ? h(
                  "span",
                  params.row.property_value_array
                    .map(p => p.value_name)
                    .join("，")
                )
              : h("span", "-");
          }
        },
        {
          title: "必填项",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_required ? "green" : ""
                }
              },
              params.row.is_required ? "是" : "否"
            );
          }
        },
        {
          title: "前台显示",
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
          title: "列表筛选",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_filter ? "green" : ""
                }
              },
              params.row.is_filter ? "是" : "否"
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
          width: 140,
          render: (h, params) => {
            var btns = [];
            btns.push(
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "4px"
                  },
                  on: {
                    click: () => {
                      this.property_id = params.row.property_id;
                      this.updateModal = true;
                    }
                  }
                },
                "编辑"
              )
            );
            btns.push(
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除这条数据吗?",
                    transfer: true,
                    placement: "top-end"
                  },
                  on: {
                    "on-ok": async () => {
                      this.$set(params.row, "deleting", true);
                      var res = await del(params.row.property_id);
                      this.$set(params.row, "deleting", false);
                      if (!res.code) {
                        this.data.splice(params.index, 1);
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
        },
        {
          title: "属性说明",
          key: "tooltip",
          minWidth: 300,
          tooltip: true
        }
      ],
      data: [],
      loading: false,
      current: "",
      goods_type_array: [],
      addModal: false,
      updateModal: false,
      property_id: 0
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
          if (this.goods_type_array.length) {
            this.current = this.goods_type_array[0].key;
            this.getList();
          }
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    changeType() {
      this.getList();
    },
    async getList(isRefresh = false) {
      this.loading = true;
      var goods_type = this.goods_type_array.find(p => p.key == this.current);
      if (isRefresh || !goods_type.data || !goods_type.data.length) {
        var res = await manage(this.current);
        if (!res.code) {
          goods_type.data = res.data;
        } else {
          notice.showError(this, res.message);
        }
      }
      this.loading = false;
      this.data = goods_type.data;
    },
    handleAddPropertyOk() {
      this.handleAddPropertyCancel();
      notice.showSuccess(this, "新增成功");
      this.getList(true);
    },
    handleAddPropertyCancel() {
      this.addModal = false;
    },
    handleUpdatePropertyOk() {
      this.handleUpdatePropertyCancel();
      notice.showSuccess(this, "编辑成功");
      this.getList(true);
    },
    handleUpdatePropertyCancel() {
      this.property_id = 0;
      this.updateModal = false;
    }
  }
};
</script>
