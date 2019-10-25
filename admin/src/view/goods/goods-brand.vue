<template>
  <div>
    <Form inline @submit.native.prevent>
      <FormItem>
        <Input
          type="text"
          v-model="filter.keyword"
          placeholder="品牌名称"
          @keyup.enter.native="getList"
          clearable
        ></Input>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          shape="circle"
          icon="ios-search"
          style="margin-right:15px;"
          @click="getList"
        >筛选</Button>
        <Button
          type="success"
          shape="circle"
          icon="ios-add-circle-outline"
          @click="addModal=true"
        >新增品牌</Button>
      </FormItem>
    </Form>
    <Table border stripe :columns="columns" :data="data" :loading="loading"></Table>
    <add-brand :value="addModal" @on-ok="handleAddBrandOk" @on-cancel="handleAddBrandCancel"></add-brand>
    <update-brand
      :value="updateModal"
      :brand-id="brand_id"
      @on-ok="handleUpdateBrandOK"
      @on-cancel="handleUpdateBrandCancel"
    ></update-brand>
  </div>
</template>

<script>
import { notice, deepCopy } from "@/libs/util";
import { manage, del } from "@/api/goods-brand";
import AddBrand from "./components/add-brand";
import UpdateBrand from "./components/update-brand";
export default {
  name: "goodsBrand",
  components: {
    AddBrand,
    UpdateBrand
  },
  data() {
    return {
      filter: {
        keyword: ""
      },
      columns: [
        {
          title: "品牌ID",
          width: 80,
          key: "brand_id",
          align: "center"
        },
        {
          title: "品牌名称",
          key: "brand_name",
          width: 180
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
                      this.brand_id = params.row.brand_id;
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
                      var res = await del(params.row.brand_id);
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
          title: "品牌描述",
          key: "remark",
          minWidth: 500,
          tooltip: true
        }
      ],
      data: [],
      loading: false,
      addModal: false,
      updateModal: false,
      brand_id: 0
    };
  },
  mounted() {
    notice.init(this);
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      manage(this.filter).then(res => {
        this.loading = false;
        if (!res.code) {
          this.data = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleAddBrandOk() {
      this.handleAddBrandCancel();
      notice.showSuccess(this, "新增成功");
      this.getList();
    },
    handleAddBrandCancel() {
      this.addModal = false;
    },
    handleUpdateBrandOK() {
      this.handleUpdateBrandCancel();
      notice.showSuccess(this, "编辑成功");
      this.getList();
    },
    handleUpdateBrandCancel() {
      this.brand_id = 0;
      this.updateModal = false;
    }
  }
};
</script>

<style>
</style>
