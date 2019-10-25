<template>
  <div>
    <page-table ref="pageTable" :filter="filter" :columns="columns">
      <template slot="search">
        <FormItem>
          <Input
            type="text"
            v-model="filter.keyword"
            placeholder="标题"
            clearable
            @keyup.enter.native="getList(true)"
            style="width:150px;"
          ></Input>
        </FormItem>
        <FormItem>
          <Select
            v-model="filter.banner_type"
            placeholder="轮播类型"
            clearable
            style="min-width:150px;"
          >
            <Option
              v-for="(option, index) in type_array
              "
              :value="option.code"
              :key="index"
            >{{option.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="filter.is_show" placeholder="显示状态" clearable style="min-width:80px;">
            <Option
              v-for="(option, index) in status_array"
              :value="option.id"
              :key="index"
            >{{option.name}}</Option>
          </Select>
        </FormItem>
      </template>
      <Button
        slot="add-btn"
        type="success"
        shape="circle"
        icon="ios-add-circle-outline"
        @click="addModal=true"
      >新增轮播</Button>
    </page-table>
    <add-banner
      :value="addModal"
      :type-array="type_array"
      @on-cancel="handleAddCancel"
      @on-ok="handleAddOk"
    ></add-banner>
    <update-banner
      :value="updateModal"
      :type-array="type_array"
      :banner="banner"
      @on-cancel="handleUpdateCancel"
      @on-ok="handleUpdateOk"
    ></update-banner>
    <Modal :title="img.title" v-model="visible" ok-text="关闭" cancel-text :closable="false">
      <img :src="img.src" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import { enumList } from "@/api/enum";
import { manage, isShow, del } from "@/api/banner";
import { notice, deepCopy } from "@/libs/util";
import AddBanner from "./components/add-banner";
import UpdateBanner from "./components/update-banner";
export default {
  name: "banner",
  components: {
    AddBanner,
    UpdateBanner
  },
  data() {
    return {
      status_array: [
        {
          id: 1,
          name: "显示"
        },
        {
          id: 2,
          name: "不显示"
        }
      ],
      type_array: [],
      columns: [
        {
          title: "标题",
          key: "title",
          width: 200,
          tooltip: true
        },
        {
          title: "轮播类型",
          key: "banner_type_name",
          width: 100
        },
        {
          title: "图片",
          width: 70,
          align: "center",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "text",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.img = {
                      title: params.row.title || "轮播图",
                      src: params.row.pic_url
                    };
                    this.visible = true;
                  }
                }
              },
              "查看"
            );
          }
        },
        {
          title: "跳转链接",
          key: "url",
          width: 180,
          tooltip: true
        },
        {
          title: "显示排序",
          key: "sort",
          width: 85,
          align: "center"
        },
        {
          title: "状态",
          width: 75,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_show ? "#19be6b" : "#ed4014"
                }
              },
              params.row.is_show ? "显示" : "不显示"
            );
          }
        },
        {
          title: "添加时间",
          key: "create_time",
          width: 152
        },
         {
          title: "上架时间",
          key: "begin_date_string",
          width: 120
        },
         {
          title: "下架时间",
          key: "end_date_string",
          width: 120
        },
        {
          title: "操作",
          render: (h, params) => {
            var btns = [];
            btns.push(
              h(
                "Button",
                {
                  props: { size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.banner = deepCopy(params.row);
                      this.updateModal = true;
                    }
                  }
                },
                "编辑"
              )
            );
            btns.push(
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    type: params.row.is_show ? "warning" : "success",
                    loading: params.row.setting
                  },
                  style: { marginRight: "5px" },
                  on: {
                    click: async () => {
                      this.$set(params.row, "setting", true);
                      var res = await isShow(params.row.banner_id);
                      if (!res.code) {
                        this.$set(params.row, "setting", false);
                        params.row.is_show = !params.row.is_show;
                        notice.showSuccess(this, "设置成功");
                      } else {
                        notice.showError(this, res.message);
                      }
                    }
                  }
                },
                params.row.is_show ? "不显示" : "显示"
              )
            );
            btns.push(
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除这条数据吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": async () => {
                      this.$set(params.row, "deleting", true);
                      var res = await del(params.row.banner_id);
                      if (!res.code) {
                        this.$refs.pageTable.reload();
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
      filter: {
        is_show: "",
        banner_type: "",
        keyword: ""
      },
      addModal: false,
      updateModal: false,
      banner: {},
      visible: false,
      img: {
        title: "",
        src: ""
      }
    };
  },
  mounted() {
    notice.init(this);
    this.getList();
    this.getTypes();
  },
  methods: {
    getList(isRefresh = false) {
      if (isRefresh) {
        this.$refs.pageTable.reload();
      } else {
        this.$refs.pageTable.loadingList(manage);
      }
    },
    getTypes() {
      enumList(104).then(res => {
        if (!res.code) {
          this.type_array = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleAddCancel() {
      this.addModal = false;
    },
    handleAddOk() {
      this.handleAddCancel();
      notice.showSuccess(this, "新增成功");
      this.getList(true);
    },
    handleUpdateCancel() {
      this.banner = {};
      this.updateModal = false;
    },
    handleUpdateOk() {
      this.handleUpdateCancel();
      notice.showSuccess(this, "编辑成功");
      this.getList(true);
    }
  }
};
</script>
