<template>
  <div>
    <page-table
      ref="pageTable"
      :columns="columns"
      :filter="filter"
      @on-selection-change="selectChange"
    >
      <template slot="search">
        <FormItem>
          <Input
            type="text"
            v-model="filter.keyword"
            placeholder="品名"
            clearable
            @keyup.enter.native="getList(true)"
          ></Input>
        </FormItem>
        <FormItem>
          <Select
            v-model="filter.goods_type_id"
            placeholder="商品类型"
            clearable
            style="min-width:120px;"
          >
            <Option
              v-for="(option, index) in goods_type_array"
              :value="option.key"
              :key="index"
            >{{option.value}}</Option>
          </Select>
        </FormItem>
      </template>
      <Button
        slot="add-btn"
        type="success"
        shape="circle"
        icon="ios-add-circle-outline"
        @click="addModal=true"
      >新增商品</Button>
      <template slot="action">
        <Button
          type="success"
          :disabled="up_disabled"
          :loading="up_loading"
          icon="md-arrow-round-up"
          @click="handle(1)"
        >上架</Button>
        <Poptip confirm title="您真的要下架勾选的商品吗？" @on-ok="handle(2)">
          <Button
            type="warning"
            :disabled="down_disabled"
            :loading="down_loading"
            icon="md-arrow-round-down"
          >下架</Button>
        </Poptip>
        <Button
          type="success"
          :disabled="pass_disabled"
          :loading="pass_loading"
          icon="md-arrow-round-up"
          @click="handle(3)"
        >审核通过</Button>
        <Poptip confirm title="您真的要取消审核勾选的商品吗？" @on-ok="handle(4)">
          <Button
            type="warning"
            :disabled="not_pass_disabled"
            :loading="not_pass_loading"
            icon="md-arrow-round-down"
          >取消审核</Button>
        </Poptip>
        <Poptip confirm title="您真的要删除勾选的商品吗？" @on-ok="handle(5)">
          <Button
            type="error"
            :disabled="delete_disabled"
            :loading="delete_loading"
            icon="md-trash"
          >删除</Button>
        </Poptip>
      </template>
    </page-table>
    <add-goods :value="addModal" @on-cancel="handleAddCancel" @on-ok="handleAddOk"></add-goods>
    <update-goods
      :value="updateModal"
      :goods-id="goods_id"
      @on-cancel="handleUpdateCancel"
      @on-ok="handleUpdateOk"
    ></update-goods>
  </div>
</template>

<script>
import { notice } from "@/libs/util";
import { manage, set } from "@/api/goods";
import { list } from "@/api/goods-type";
import AddGoods from "./components/add-goods";
import UpdateGoods from "./components/update-goods";
export default {
  name: "goods",
  components: {
    AddGoods,
    UpdateGoods
  },
  data() {
    return {
      filter: {
        keyword: "",
        goods_type_id: ""
      },
      data: [],
      columns: [
        {
          type: "selection",
          width: 50,
          align: "center"
        },
        {
          title: "商品编号",
          key: "goods_id",
          width: 85,
          align: "center"
        },
        {
          title: "商品名称",
          key: "goods_name",
          width: 200,
          tooltip: true
        },
        {
          title: "商品类型",
          key: "goods_type_name",
          width: 120,
          tooltip: true
        },
        {
          title: "市场价",
          width: 75,
          key: "market_price",
          align: "center"
        },
        {
          title: "零售价",
          width: 75,
          key: "sale_price",
          align: "center"
        },
        {
          title: "销量",
          width: 70,
          key: "sell_num",
          align: "center"
        },
        {
          title: "销售状态",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_on_sale ? "green" : ""
                }
              },
              params.row.is_on_sale ? "在售" : "已下架"
            );
          }
        },
        {
          title: "审核状态",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_checked ? "green" : ""
                }
              },
              params.row.is_checked ? "已审核" : "未审核"
            );
          }
        },
        {
          title: "操作",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  size: "small"
                },
                on: {
                  click: () => {
                    this.updateModal = true;
                    this.goods_id = params.row.goods_id;
                  }
                }
              },
              "编辑"
            );
          }
        },
        // {
        //   title: "最近更新时间",
        //   key: "update_time",
        //   minWidth: 152
        // }
      ],
      goods_type_array: [],
      selecteds: [],
      up_loading: false,
      down_loading: false,
      pass_loading: false,
      not_pass_loading: false,
      delete_loading: false,
      addModal: false,
      goods_id: 0,
      updateModal: false
    };
  },
  computed: {
    up_disabled() {
      return (
        !this.selecteds.length ||
        this.selecteds.findIndex(p => p.is_on_sale) > -1
      );
    },
    down_disabled() {
      return (
        !this.selecteds.length ||
        this.selecteds.findIndex(p => !p.is_on_sale) > -1
      );
    },
    pass_disabled() {
      return (
        !this.selecteds.length ||
        this.selecteds.findIndex(p => p.is_checked) > -1
      );
    },
    not_pass_disabled() {
      return (
        !this.selecteds.length ||
        this.selecteds.findIndex(p => !p.is_checked) > -1
      );
    },
    delete_disabled() {
      return !this.selecteds.length;
    }
  },
  mounted() {
    notice.init(this, 100);
    this.$refs.pageTable.loadingList(manage);
    this.getTypes();
  },
  methods: {
    selectChange(rows) {
      this.selecteds = rows;
    },
    getTypes() {
      list().then(res => {
        if (!res.code) {
          this.goods_type_array = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handle(type) {
      this.setLoading(type);
      var arr = this.selecteds.map(p => p.goods_id);
      set(arr, type).then(res => {
        this.setLoading(type, false);
        if (!res.code) {
          this.selecteds = [];
          this.$refs.pageTable.reload();
          notice.showSuccess(this, "操作成功");
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    setLoading(type, loading = true) {
      switch (type) {
        case 1:
          this.up_loading = loading;
          break;
        case 2:
          this.down_loading = loading;
          break;
        case 3:
          this.pass_loading = loading;
          break;
        case 4:
          this.not_pass_loading = loading;
          break;
        case 5:
          this.delete_loading = loading;
          break;
      }
    },
    handleAddCancel() {
      this.addModal = false;
    },
    handleAddOk() {
      this.addModal = false;
      notice.showSuccess(this, "新增成功");
      this.$refs.pageTable.reload();
    },
    handleUpdateCancel() {
      this.goods_id = 0;
      this.updateModal = false;
    },
    handleUpdateOk() {
      this.goods_id = 0;
      this.updateModal = false;
      notice.showSuccess(this, "编辑成功");
      this.$refs.pageTable.reload();
    }
  }
};
</script>

<style lang="less" scoped>
.btn-wrap {
  margin-bottom: 10px;

  button {
    margin-right: 10px;
  }
}

.drawer-footer {
  margin-top: 6px;
  border: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  background: #fff;
}
</style>
