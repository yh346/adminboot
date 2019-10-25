<template>
  <div>
    <Tabs :value="current" type="card" @on-click="changeType">
      <TabPane
        v-for="item in types"
        :key="item.dict_code"
        :label="item.dict_name"
        :name="item.dict_code"
      ></TabPane>
    </Tabs>
    <Button
      type="success"
      shape="circle"
      style="margin-bottom:10px;"
      icon="ios-add-circle-outline"
      @click="openAddModal"
    >新增分类</Button>
    <Button
      type="primary"
      shape="circle"
      style="margin-bottom:10px;margin-left:10px;"
      icon="md-refresh"
      @click="getList(true)"
    >刷新一下</Button>
    <Table border stripe :columns="columns" :data="data" :loading="loading"></Table>
    <add-article-class
      :value="addModal"
      :parent-type="parent_type_id"
      :parent-type-array="types"
      @on-cancel="handleAddCancel"
      @on-ok="handleAddOk"
    ></add-article-class>
    <update-article-class
      :value="updateModal"
      :parent-type-array="types"
      :article-class="article_class"
      @on-cancel="handleUpdateCancel"
      @on-ok="handleUpdateOk"
    ></update-article-class>
  </div>
</template>
<script>
import { list } from "@/api/dict";
import { classConfig, listClass, deleteClass } from "@/api/article";
import { notice, deepCopy } from "@/libs/util";
import AddArticleClass from "./components/add-article-class";
import UpdateArticleClass from "./components/update-article-class";
export default {
  name: "articleClass",
  components: {
    AddArticleClass,
    UpdateArticleClass
  },
  data() {
    return {
      current: "",
      types: [],
      columns: [
        {
          title: "操作",
          width: 140,
          align: "center",
          render: (h, params) => {
            var btns = [];
            btns.push(
              h(
                "Button",
                {
                  props: {
                    type: "default",
                    loading: params.row.saving,
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.article_class = deepCopy(params.row);
                      this.article_class.parent_id = this.article_class.parent_id.toString();
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
                    transfer: true
                  },
                  on: {
                    "on-ok": async () => {
                      this.$set(params.row, "deleting", true);
                      var res = await deleteClass(params.row.class_id);
                      if (!res.code) {
                        this.$set(params.row, "deleting", false);
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
          title: "分类编号",
          key: "class_id",
          align: "center",
          width: 85
        },
        {
          title: "分类名称",
          key: "class_name",
          width: 140
        },
        {
          title: "显示排序",
          key: "sort",
          width: 85,
          align: "center"
        },

        {
          title: "SEO标题",
          key: "seo_title",
          width: 200,
          tooltip: true
        },
        {
          title: "SEO关键词",
          key: "seo_keywords",
          width: 200,
          tooltip: true
        },
        {
          title: "SEO描述",
          key: "seo_description",
          minWidth: 300,
          tooltip: true
        }
      ],
      data: [],
      loading: false,
      addModal: false,
      parent_type_id: "",
      updateModal: false,
      article_class: {}
    };
  },
  mounted() {
    notice.init(this, 145);
    classConfig().then(res => {
      if (!res.code) {
        list(res.data).then(_res => {
          if (!_res.code) {
            this.types = _res.data;
            if (this.types.length) {
              this.current = this.types[0].dict_code;
            }
            this.getList();
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
    changeType(type) {
      this.current = type;
      this.getList();
    },
    getList(isRefresh = false) {
      this.loading = true;
      var type = this.types.find(p => p.dict_code === this.current);
      if (isRefresh || !type.data || !type.data.length) {
        listClass(this.current).then(res => {
          if (!res.code) {
            this.loading = false;
            type.data = res.data;
            this.data = res.data;
          } else {
            notice.showError(this, res.message);
          }
        });
      } else {
        this.loading = false;
        this.data = type.data;
      }
    },
    openAddModal() {
      this.parent_type_id = this.current;
      this.addModal = true;
    },
    handleAddCancel() {
      this.parent_type_id = "";
      this.addModal = false;
    },
    handleAddOk() {
      this.handleAddCancel();
      this.getList(true);
      notice.showSuccess(this, "新增成功");
    },
    handleUpdateCancel() {
      this.article_class = {};
      this.updateModal = false;
    },
    handleUpdateOk() {
      this.handleUpdateCancel();
      this.getList(true);
      notice.showSuccess(this, "编辑成功");
    }
  }
};
</script>
