<template>
  <div>
    <Form inline @submit.native.prevent>
      <FormItem>
        <Button
          type="primary"
          shape="circle"
          style="margin-right:10px;"
          icon="md-refresh"
          @click="getList"
        >刷新</Button>
        <Button
          type="success"
          shape="circle"
          icon="ios-add-circle-outline"
          @click="addModal=true"
        >新增类型</Button>
      </FormItem>
    </Form>
    <Table border stripe :columns="columns" :data="data" :loading="loading"></Table>
    <Drawer
      v-model="addModal"
      title="新增类型"
      width="720"
      :closable="false"
      scrollable
      :mask-closable="false"
      :styles="{height: 'calc(100% - 55px)',overflow: 'auto',padding:'10px',paddingBottom: '53px', position: 'static'}"
    >
      <add-goods-type @on-ok="handleAddOk" @on-cancel="handleAddCancel"></add-goods-type>
    </Drawer>
    <Drawer
      width="720"
      :value="updateModal"
      :mask-closable="false"
      title="编辑类型"
      :styles="{height: 'calc(100% - 55px)',overflow: 'auto',padding:'10px',paddingBottom: '53px', position: 'static'}"
      @on-close="handleUpdateCancel"
    >
      <update-goods-type
        v-model="goods_type"
        @on-ok="handleUpdateOk"
        @on-cancel="handleUpdateCancel"
      ></update-goods-type>
    </Drawer>
  </div>
</template>
<script>
import { notice, deepCopy } from "@/libs/util";
import { manage, del } from "@/api/goods-type";
import AddGoodsType from "./components/add-goods-type";
import UpdateGoodsType from "./components/update-goods-type";
export default {
  components: {
    AddGoodsType,
    UpdateGoodsType
  },
  name: "goodsType",
  data() {
    return {
      columns: [
        {
          title: "类型ID",
          width: 85,
          key: "goods_type_id",
          align: "center"
        },
        {
          title: "类型名称",
          key: "goods_type_name",
          width: 140
        },
        {
          title: "显示排序",
          key: "sort",
          width: 85,
          align: "center"
        },
        {
          title: "显示前台",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_show ? "green" : "gray"
                }
              },
              params.row.is_show ? "显示" : "不显示"
            );
          }
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
                      this.updateModal = true;
                      this.goods_type = deepCopy(params.row);
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
                      var res = await del(params.row.goods_type_id);
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
          title: "类型描述",
          key: "description",
          minWidth: 400,
          tooltip: true
        },
        {
          title: "SEO标题",
          key: "page_title",
          width: 400,
          tooltip: true
        },
        {
          title: "SEO关键词",
          key: "page_keywords",
          width: 400,
          tooltip: true
        },
        {
          title: "SEO描述",
          key: "page_description",
          width: 400,
          tooltip: true
        }
      ],
      data: [],
      loading: false,
      addModal: false,
      updateModal: false,
      goods_type_id: 0,
      goods_type: {}
    };
  },
  mounted() {
    notice.init(this);
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      manage().then(res => {
        this.loading = false;
        if (!res.code) {
          this.data = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleAddOk() {
      this.addModal = false;
      notice.showSuccess(this, "新增成功");
      this.getList();
    },
    handleAddCancel() {
      this.addModal = false;
    },
    handleUpdateOk() {
      this.updateModal = false;
      notice.showSuccess(this, "编辑成功");
      this.getList();
    },
    handleUpdateCancel() {
      this.updateModal = false;
    }
  }
};
</script>

<style>
</style>
