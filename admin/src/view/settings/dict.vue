<template>
  <div>
    <Tabs :value="current" type="card" @on-click="changeType">
      <TabPane v-for="item in types" :key="item.code" :label="item.name" :name="item.code"></TabPane>
    </Tabs>
    <Button
      type="success"
      shape="circle"
      style="margin-bottom:10px;"
      icon="ios-add-circle-outline"
      @click="openAddModal"
    >新增字典</Button>
    <Button
      type="primary"
      shape="circle"
      style="margin-bottom:10px;margin-left:10px;"
      icon="md-refresh"
      @click="loadList(true)"
    >刷新一下</Button>
    <Table border stripe :columns="columns" :data="data" :loading="loading"></Table>
    <Modal
      v-model="addModal"
      :mask-closable="false"
      :loading="formLoading"
      :closable="false"
      title="新增字典"
      @on-ok="add('addForm')"
      @on-cancel="init('addForm')"
    >
      <Form ref="addForm" :model="dict" :label-width="80" :rules="rules">
        <FormItem label="字典类型">
          <Select v-model="dict.dict_type" style="width:200px">
            <Option
              v-for="item in types"
              :value="item.code"
              :key="item.code"
            >{{ item.name }}({{item.code}})</Option>
          </Select>
        </FormItem>
        <FormItem label="字典名称" prop="dict_name" label-for="dict_name">
          <Input
            autofocus
            element-id="dict_name"
            v-model="dict.dict_name"
            placeholder="字典名称"
            style="width: 300px"
          ></Input>
        </FormItem>
        <FormItem label="字典代号" prop="dict_code" label-for="dict_code">
          <Input
            element-id="dict_code"
            v-model="dict.dict_code"
            placeholder="字典代号"
            style="width: 300px"
          ></Input>
        </FormItem>
        <FormItem label="字典值" prop="dict_value" label-for="dict_value">
          <Input
            element-id="dict_value"
            v-model="dict.dict_value"
            placeholder="字典值"
            style="width: 300px"
          ></Input>
        </FormItem>
        <FormItem label="状态">
          <i-switch v-model="dict.is_ok" size="large">
            <span slot="open">正常</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <FormItem label="排序" label-for="sort">
          <InputNumber element-id="sort" :min="0" v-model="dict.sort"></InputNumber>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { enumList } from "@/api/enum";
import { list, add, update, del } from "@/api/dict";
import { notice, deepCopy } from "@/libs/util";
export default {
  name: "dict",
  data() {
    return {
      current: "0",
      types: [],
      columns: [
        {
          title: "字典名称",
          key: "dict_name",
          width: 180,
          render: (h, params) => {
            return params.row.editting
              ? h("Input", {
                  props: {
                    type: "text",
                    value: params.row.dict_name
                  },
                  on: {
                    "on-change": event => {
                      params.row.current.dict_name = event.target.value;
                    }
                  }
                })
              : h("span", params.row.dict_name);
          }
        },
        {
          title: "字典代号",
          key: "dict_code",
          width: 140,
          align: "center",
          render: (h, params) => {
            return params.row.editting
              ? h("Input", {
                  props: {
                    type: "text",
                    value: params.row.dict_code
                  },
                  on: {
                    "on-change": event => {
                      params.row.current.dict_code = event.target.value;
                    }
                  }
                })
              : h("span", params.row.dict_code);
          }
        },
        {
          title: "字典值",
          key: "dict_value",
          width: 140,
          render: (h, params) => {
            return params.row.editting
              ? h("Input", {
                  props: {
                    type: "text",
                    value: params.row.dict_value
                  },
                  on: {
                    "on-change": event => {
                      params.row.current.dict_value = event.target.value;
                    }
                  }
                })
              : h("span", params.row.dict_value);
          }
        },
        {
          title: "状态",
          key: "is_disabled",
          align: "center",
          width: 120,
          render: (h, params) => {
            return params.row.editting
              ? h(
                  "i-switch",
                  {
                    props: {
                      value: !params.row.is_disabled,
                      size: "large"
                    },
                    on: {
                      "on-change": checked => {
                        params.row.current.is_disabled = !checked;
                      }
                    }
                  },
                  [
                    h(
                      "span",
                      {
                        slot: "open"
                      },
                      "正常"
                    ),
                    h(
                      "span",
                      {
                        slot: "close"
                      },
                      "禁用"
                    )
                  ]
                )
              : h(
                  "span",
                  {
                    style: {
                      color: params.row.is_disabled ? "#ed4014" : "#19be6b"
                    }
                  },
                  params.row.is_disabled ? "禁用" : "正常"
                );
          }
        },
        {
          title: "排序",
          key: "sort",
          width: 120,
          align: "center",
          render: (h, params) => {
            return params.row.editting
              ? h("InputNumber", {
                  props: {
                    min: 0,
                    value: params.row.sort
                  },
                  on: {
                    "on-change": value => {
                      params.row.current.sort = value || 0;
                    }
                  }
                })
              : h("span", params.row.sort);
          }
        },
        {
          title: "操作",
          minWidth: 140,
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
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: async () => {
                      if (params.row.editting) {
                        this.$set(params.row, "saving", true);
                        var res = await update(params.row.current);
                        if (!res.code) {
                          this.$set(params.row, "saving", false);
                          this.$set(params.row, "editting", false);
                          var obj = deepCopy(params.row.current);
                          params.row.dict_name = obj.dict_name;
                          params.row.dict_code = obj.dict_code;
                          params.row.dict_value = obj.dict_value;
                          params.row.is_disabled = obj.is_disabled;
                          params.row.sort = obj.sort;
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
            } else {
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
                        var res = await del(params.row.dict_id);
                        if (!res.code) {
                          this.$set(params.row, "deleting", false);
                          this.data[params.row.dict_type].splice(
                            params.index,
                            1
                          );
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
            }
            return h("div", btns);
          }
        }
      ],
      loading: false,
      addModal: false,
      formLoading: true,
      dict: {
        is_ok: true,
        dict_type: "0",
        sort: 0
      },
      rules: {
        dict_name: [
          {
            required: true,
            message: "请输入字典名称",
            trigger: "blur"
          }
        ],
        dict_code: [
          {
            required: true,
            message: "请输入字典代号",
            trigger: "blur"
          }
        ]
      },
      data: []
    };
  },
  mounted() {
    notice.init(this);
    this.loadTypes();
  },
  methods: {
    loadTypes() {
      this.loading = true;
      enumList(106).then(res => {
        if (!res.code) {
          this.loading = false;
          this.types = res.data;
          if (this.types.length > 0) {
            this.current = res.data[0].code;
            this.loadList();
          }
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    loadList(isRefresh = false) {
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
    },
    changeType(type) {
      this.current = type;
      this.loadList();
    },
    openAddModal() {
      this.dict.dict_type = this.current;
      this.addModal = true;
    },
    init(name) {
      this.dict = {
        is_ok: true,
        dict_type: "0",
        sort: 0
      };
      this.$refs[name].resetFields();
    },
    add(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.dict.is_disabled = !this.dict.is_ok;
          var res = await add(this.dict);
          if (!res.code) {
            this.addModal = false;
            notice.showSuccess(this, "新增成功");
            this.loadList(true);
            this.init(name);
          } else {
            notice.showError(this, res.message);
          }
        }
        this.formLoading = false;
        this.$nextTick(() => {
          this.formLoading = true;
        });
      });
    }
  }
};
</script>
