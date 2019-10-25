<template>
  <div>
    <page-table
      ref="pageTable"
      show-date
      :filter="filter"
      :columns="columns"
      @on-selection-change="selectChange"
    >
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
          <Cascader
            :data="type_array"
            :load-data="loadData"
            placeholder="文章分类"
            change-on-select
            @on-change="handleChangeType"
          ></Cascader>
        </FormItem>
        <FormItem>
          <Select v-model="filter.status" placeholder="状态" clearable style="min-width:80px;">
            <Option
              v-for="(option, index) in status_array"
              :value="option.id"
              :key="index"
            >{{option.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="filter.time_field">
            <Option
              v-for="(option, index) in time_field_array"
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
      >发布文章</Button>
      <template slot="action">
        <Button
          type="success"
          :disabled="check_pass_disabled"
          :loading="check_pass_loading"
          icon="md-arrow-round-up"
          @click="handleCheckPass"
        >审核通过</Button>
        <Button
          type="warning"
          :disabled="cancel_check_disabled"
          :loading="cancel_check_loading"
          icon="md-arrow-round-down"
          @click="handleCancelCheck"
        >取消审核</Button>
        <Poptip confirm title="您真的要删除勾选的文章吗？" @on-ok="handleDelete">
          <Button
            type="error"
            :disabled="delete_disabled"
            :loading="delete_loading"
            icon="md-trash"
          >删除</Button>
        </Poptip>
      </template>
    </page-table>
    <add-article
      :value="addModal"
      :article-type-array="type_array"
      @on-cancel="handleAddCancel"
      @on-ok="handleAddOk"
    ></add-article>
    <update-article
      :value="updateModal"
      :article-type-array="type_array"
      :article-id="article_id"
      @on-cancel="handleUpdateCancel"
      @on-ok="handleUpdateOk"
    ></update-article>
  </div>
</template>

<script>
import config from "@/config";
import { list } from "@/api/dict";
import {
  classConfig,
  listClass,
  manage,
  checkPass,
  del,
  cancelChecked
} from "@/api/article";
import { notice } from "@/libs/util";
import AddArticle from "./components/add-article";
import UpdateArticle from "./components/update-article";
export default {
  name: "articleList",
  components: {
    AddArticle,
    UpdateArticle
  },
  data() {
    return {
      time_field_array: [
        {
          id: 1,
          name: "发布日期"
        },
        {
          id: 2,
          name: "更新日期"
        }
      ],
      status_array: [
        {
          id: 2,
          name: "未审核"
        },
        {
          id: 1,
          name: "审核通过"
        }
      ],
      columns: [
        {
          type: "selection",
          width: 45,
          align: "center"
        },
        {
          title: "标题",
          key: "title",
          minWidth: 250,
          tooltip: true,
          render: (h, params) => {
            return h(
              "a",
              {
                attrs: {
                  href: "javascript:;",
                  title: "编辑或查看详情"
                },
                on: {
                  click: () => {
                    this.article_id = params.row.article_id;
                    this.updateModal = true;
                  }
                }
              },
              params.row.title
            );
          }
        },
        {
          title: "文章分类",
          width: 200,
          render: (h, params) => {
            return h(
              "span",
              `${params.row.type_name} > ${params.row.class_name}`
            );
          }
        },
        {
          title: "浏览次数",
          key: "hits",
          width: 85,
          align: "center"
        },
        {
          title: "状态",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_checked ? "#19be6b" : "#ed4014"
                }
              },
              params.row.is_checked ? "审核通过" : "未审核"
            );
          }
        },
        {
          title: "发布时间",
          key: "create_time",
          width: 152
        },
        {
          title: "最后更新时间",
          key: "update_time",
          width: 152
        }
      ],
      filter: {
        status: "",
        keyword: "",
        type_id: "",
        class_id: "",
        time_field: 1,
        begin_date: 0,
        end_date: 0
      },
      check_pass_loading: false,
      cancel_check_loading: false,
      delete_loading: false,
      selecteds: [],
      type_array: [],
      type_class: ["", ""],
      addModal: false,
      updateModal: false,
      article_id: 0
    };
  },
  computed: {
    check_pass_disabled() {
      return (
        !this.selecteds.length ||
        this.selecteds.findIndex(item => item.is_checked) > -1
      );
    },
    cancel_check_disabled() {
      return (
        !this.selecteds.length ||
        this.selecteds.findIndex(item => !item.is_checked) > -1
      );
    },
    delete_disabled() {
      return !this.selecteds.length;
    }
  },
  mounted() {
    notice.init(this);
    this.getList();
    classConfig().then(res => {
      if (!res.code) {
        list(res.data).then(_res => {
          if (!_res.code) {
            this.type_array = _res.data.map(p => {
              return {
                value: p.dict_code,
                label: p.dict_name,
                children: [],
                loading: false
              };
            });
          } else {
            notice.showError(this, res.message);
          }
        });
      } else {
        notice.showError(this, res.message);
      }
    });
  },
  methods: {
    getList(isRefresh = false) {
      if (isRefresh) {
        this.$refs.pageTable.reload();
      } else {
        this.$refs.pageTable.loadingList(manage);
      }
    },
    loadData(item, callback) {
      if (!item.children.length) {
        item.loading = true;
        listClass(item.value).then(res => {
          item.loading = false;
          if (!res.code) {
            item.children = res.data.map(p => {
              return {
                value: p.class_id.toString(),
                label: p.class_name
              };
            });
            callback();
          }
        });
      } else {
        callback();
      }
    },
    handleChangeType(value, selectedData) {
      if (selectedData.length) {
        this.filter.type_id = selectedData[0].value;
        if (selectedData.length > 1) {
          this.filter.class_id = selectedData[1].value;
        }
      } else {
        this.filter.type_id = "";
        this.filter.class_id = "";
      }
    },
    selectChange(rows) {
      this.selecteds = rows;
    },
    handleCheckPass() {
      this.check_pass_loading = true;
      var article_id_array = this.selecteds.map(p => p.article_id);
      checkPass(article_id_array).then(res => {
        this.check_pass_loading = false;
        if (!res.code) {
          this.selecteds = [];
          notice.showSuccess(this, "审核成功");
          this.getList(true);
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleCancelCheck() {
      this.cancel_check_loading = true;
      var article_id_array = this.selecteds.map(p => p.article_id);
      cancelChecked(article_id_array).then(res => {
        this.cancel_check_loading = false;
        if (!res.code) {
          this.selecteds = [];
          notice.showSuccess(this, "取消审核成功");
          this.getList(true);
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleDelete() {
      this.delete_loading = true;
      var article_id_array = this.selecteds.map(p => p.article_id);
      del(article_id_array).then(res => {
        this.delete_loading = false;
        if (!res.code) {
          notice.showSuccess(this, "删除成功");
          this.selecteds = [];
          this.getList(true);
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
      this.article_id = 0;
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
