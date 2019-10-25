<template>
  <div>
    <Tabs v-model="current" type="card" @on-click="changeTab">
      <TabPane v-for="item in types" :key="item.code" :label="item.name" :name="item.code"></TabPane>
      <Button @click="getList(true)" type="primary" icon="md-refresh" size="small" slot="extra">刷新一下</Button>
    </Tabs>
    <Table border stripe :columns="columns" :data="data" :loading="loading"></Table>
  </div>
</template>
<script>
import { enumList } from "@/api/enum";
import { list, update } from "@/api/config";
import { notice, deepCopy } from "@/libs/util";
export default {
  name: "config",
  data() {
    return {
      current: "",
      types: [],
      columns: [
        {
          title: "配置名称",
          key: "name",
          width: 150
        },
        {
          title: "配置代号",
          key: "code",
          width: 190
        },
        {
          title: "配置值",
          key: "value",
          width: 300,
          render: (h, params) => {
            return params.row.editting
              ? h("Input", {
                  props: {
                    type: "text",
                    value: params.row.value
                  },
                  on: {
                    "on-change": event => {
                      params.row.current.value = event.target.value;
                    }
                  }
                })
              : h("span", params.row.value);
          }
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 300,
          tooltip: true,
          render: (h, params) => {
            return params.row.editting
              ? h("Input", {
                  props: {
                    type: "text",
                    value: params.row.remark
                  },
                  on: {
                    "on-change": event => {
                      params.row.current.remark = event.target.value;
                    }
                  }
                })
              : h("span", params.row.remark);
          }
        },
        {
          title: "操作",
          key: "operation",
          width: 160,
          render: (h, params) => {
            var btns = [];
            btns.push(
              h(
                "Button",
                {
                  props: {
                    type: params.row.editting ? "success" : "default",
                    loading: params.row.saving,
                    size: "small"
                  },
                  style: { marginRight: "5px" },
                  on: {
                    click: async () => {
                      if (params.row.editting) {
                        this.$set(params.row, "saving", true);
                        var res = await update(params.row.current);
                        if (!res.code) {
                          this.$set(params.row, "saving", false);
                          this.$set(params.row, "editting", false);
                          var obj = deepCopy(params.row.current);
                          params.row.value = obj.value;
                          params.row.remark = obj.remark;
                          delete params.row.current;
                          notice.showSuccess(this, "编辑成功");
                        } else {
                          notice.showError(this, res.message);
                        }
                      } else {
                        params.row.current = deepCopy(params.row);
                        this.$set(params.row, "editting", true);
                      }
                    }
                  }
                },
                params.row.editting ? "保存" : "编辑"
              )
            );
            if (params.row.editting) {
              btns.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "text"
                    },
                    on: {
                      click: () => {
                        this.$set(params.row, "saving", false);
                        this.$set(params.row, "editting", false);
                      }
                    }
                  },
                  "取消"
                )
              );
            }
            return h("div", btns);
          }
        }
      ],
      loading: false,
      data: [],
      config: {}
    };
  },
  mounted() {
    notice.init(this);
    this.getTypes();
  },
  methods: {
    getTypes() {
      enumList(105).then(res => {
        if (!res.code) {
          this.types = res.data;
          if (this.types.length) {
            this.current = this.types[0].code;
            this.getList();
          }
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    changeTab() {
      this.getList();
    },
    async getList(isRefresh = false) {
      this.loading = true;
      var type = this.types.find(p => p.code === this.current);
      if (isRefresh || !type.data || !type.data.length) {
        list(this.current).then(res => {
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
    }
  }
};
</script>
