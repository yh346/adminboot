<template>
  <div>
    <page-table ref="pageTable" :filter="filter" :columns="columns">
      <template slot="search">
        <FormItem>
          <Select v-model="filter.field" style="width:90px;">
            <Option
              v-for="(option, index) in fieldList"
              :value="option.value"
              :key="index"
            >{{option.label}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input
            type="text"
            v-model="filter.keyword"
            placeholder="关键词"
            clearable
            @keyup.enter.native="getList(true)"
          ></Input>
        </FormItem>
        <FormItem>
          <Select v-model="filter.status" style="width:90px;" placeholder="状态" clearable>
            <Option
              v-for="(option, index) in status_array"
              :value="option.value"
              :key="index"
            >{{option.label}}</Option>
          </Select>
        </FormItem>
      </template>
      <Button
        slot="add-btn"
        type="success"
        shape="circle"
        icon="ios-add-circle-outline"
        @click="addModal=true"
      >新增</Button>
    </page-table>
    <add-rule :value="addModal" @on-cancel="handleAddCancel" @on-ok="handleAddOk"></add-rule>
    <update-rule
      :value="updateModal"
      :id="id"
      @on-cancel="handleUpdateCancel"
      @on-ok="handleUpdateOk"
    ></update-rule>
  </div>
</template>
<script>
import { list, getpage, add, get, edit, enable } from "@/api/rule";
import { notice, deepCopy } from "@/libs/util";
import AddRule from "./components/add-rule";
import UpdateRule from "./components/update-rule";
export default {
  name: "rule-list",
  components: {
    AddRule,
    UpdateRule
  },
  data() {
    return {
      fieldList: [
        {
          value: 1,
          label: "规则名称"
        }
      ],
      status_array: [
        {
          value: 2,
          label: "启用"
        },
        {
          value: 1,
          label: "停用"
        }
      ],
      columns: [
        {
          title: "规则编号",
          key: "n_user_reward_rules_id",
          width: 120,
          align: "center"
        },
        {
          title: "规则名称",
          key: "user_reward_rules_name",
          width: 200,
          tooltip: true
        },
        {
          title: "一级（%）",
          key: "d_one_proportion",
          width: 100,
          tooltip: true
        },
        {
          title: "二级（%）",
          key: "d_two_proportion",
          width: 100,
          tooltip: true
        },

        {
          title: "创建时间",
          key: "create_time_string",
          width: 152
        },
        {
          title: "状态",
          key: "is_enable",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: !params.row.is_enable ? "red" : "green"
                }
              },
              !params.row.is_enable ? "停用" : "正常"
            );
          }
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          render: (h, params) => {
            var btns = [];
            btns.push(
              h(
                "Button",
                {
                  props: {
                    type: params.row.is_enable ? "error" : "success",
                    size: "small"
                  },
                  style: { marginRight: "5px" },
                  on: {
                    click: async () => {
                      this.$set(params.row, "setting", true);
                      this.enableparam.single_id =
                        params.row.n_user_reward_rules_id;
                      await enable(this.enableparam);
                      this.getList();
                    }
                  }
                },
                !params.row.is_enable ? "启用" : "停用"
              )
            );
            btns.push(
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: async () => {
                      this.id = params.row.n_user_reward_rules_id;
                      this.updateModal = true;
                    }
                  }
                },
                "编辑"
              )
            );
            return h("div", btns);
          }
        },
        {
          title: "备注",
          key: "remark",
          tooltip: true
        }
      ],
      filter: {
        field: 1,
        status: 2,
        keyword: "",
        begin_date: 0,
        end_date: 0
      },
      enableparam: {
        single_id: 0
      },
      id: 0,
      addModal: false,
      updateModal: false,
      remark: ""
    };
  },
  mounted() {
    notice.init(this);
    this.getList();
  },
  methods: {
    getList(isRefresh = false) {
      if (isRefresh) {
        this.$refs.pageTable.reload();
      } else {
        this.$refs.pageTable.loadingList(getpage);
      }
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
      this.id=0;
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
