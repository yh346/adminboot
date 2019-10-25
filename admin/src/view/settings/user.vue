<template>
  <div>
    <page-table ref="pageTable" show-date :filter="filter" :columns="columns">
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
          <Select v-model="filter.dept_id" placeholder="所属部门" clearable>
            <Option
              v-for="(option, index) in deptList"
              :value="option.dept_id"
              :key="index"
            >{{option.dept_name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="filter.time_field">
            <Option
              v-for="(option, index) in timeFiledList"
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
      >新增用户</Button>
    </page-table>
    <add-user
      :value="addModal"
      :dept-array="deptList"
      :role-array="roleList"
      @on-ok="handleAddOk"
      @on-cancel="handleAddCancel"
    ></add-user>
    <update-user
      :value="updateModal"
      :admin-id="admin_id"
      :dept-array="deptList"
      :role-array="roleList"
      @on-ok="handleUpdateOk"
      @on-cancel="handleUpdateCancel"
    ></update-user>
    <user-info :value="infoModal" :admin-id="admin_id" @on-close="handleInfoClose"></user-info>
  </div>
</template>
<script>
import { list, del, disabled } from "@/api/admin-user";
import { list as deptList } from "@/api/dept";
import { list as roleList } from "@/api/admin-role";
import { notice, deepCopy } from "@/libs/util";
import AddUser from "./components/add-user";
import UpdateUser from "./components/update-user";
import UserInfo from "./components/user-info";
export default {
  name: "adminUser",
  components: {
    AddUser,
    UpdateUser,
    UserInfo
  },
  data() {
    return {
      fieldList: [
        {
          value: 1,
          label: "用户名"
        },
      ],
      timeFiledList: [
        {
          value: 1,
          label: "登录日期"
        },
      ],
      deptList: [],
      roleList: [],
      columns: [
        {
          title: "用户编号",
          key: "admin_id",
          width: 100,
          align:"center"
        },
        {
          title: "用户名",
          key: "user_name",
          width: 150,
          align:"center",
          render: (h, params) => {
            return h(
              "a",
              {
                attrs: {
                  href: "javascript:;",
                  title: "点击查看详情"
                },
                on: {
                  click: () => {
                    this.admin_id = params.row.admin_id;
                    this.infoModal = true;
                  }
                }
              },
              params.row.user_name
            );
          }
        },
        {
          title: "所属部门",
          key: "dept_name",
          width: 200,
          align:"center"
        },
        {
          title: "用户角色",
          width: 130,
          align:"center",
          render: (h, params) => {
            return h("span", params.row.role_name_array.join(""));
          }
        },
        {
          title: "最近一次登录时间",
          key: "last_login_time",
          width: 152,
          align:"center"
        },
        {
          title: "账号状态",
          width: 120,
          align: "center",
          render: (h, params) => {
            return h(
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
          title: "操作",
          minWidth: 230,
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
                      this.admin_id = params.row.admin_id;
                      this.updateModal = true;
                    }
                  }
                },
                "编辑"
              )
            );
            if (!params.row.deleting && !params.row.is_super) {
              btns.push(
                h(
                  "Button",
                  {
                    props: {
                      type: params.row.is_disabled ? "success" : "warning",
                      size: "small",
                      loading: params.row.setting
                    },
                    style: { marginRight: "5px" },
                    on: {
                      click: async () => {
                        this.$set(params.row, "setting", true);
                        var res = await disabled(params.row.admin_id);
                        this.$set(params.row, "setting", false);
                        if (!res.code) {
                          params.row.is_disabled = !params.row.is_disabled;
                          notice.showSuccess(
                            this,
                            (params.row.is_disabled ? "禁用" : "启用") + "成功"
                          );
                        } else {
                          notice.showError(this, res.message);
                        }
                      }
                    }
                  },
                  params.row.is_disabled ? "启用" : "禁用"
                )
              );
            }
            if (params.row.is_disabled && !params.row.setting) {
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
                        var res = await del(params.row.admin_id);
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
            }
            return h("div", btns);
          }
        }
      ],
      filter: {
        dept_id: 0,
        role_id: 0,
        field: 1,
        keyword: "",
        time_field: 1,
        begin_date: 0,
        end_date: 0
      },
      addModal: false,
      updateModal: false,
      admin_id: 0,
      infoModal: false
    };
  },
  async mounted() {
    notice.init(this);
    this.getDepts();
    this.getRoles();
    this.getList();
  },
  methods: {
    getDepts() {
      deptList().then(res => {
        if (!res.code) {
          this.deptList = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    getRoles() {
      roleList().then(res => {
        if (!res.code) {
          this.roleList = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    getList(isRefresh = false) {
      if (isRefresh) {
        this.$refs.pageTable.reload();
      } else {
        this.$refs.pageTable.loadingList(list);
      }
    },
    handleAddOk() {
      this.handleAddCancel();
      notice.showSuccess(this, "新增成功");
      this.getList(true);
    },
    handleAddCancel() {
      this.addModal = false;
    },
    handleUpdateOk() {
      this.handleUpdateCancel();
      notice.showSuccess(this, "编辑成功");
      this.getList(true);
    },
    handleUpdateCancel() {
      this.admin_id = 0;
      this.updateModal = false;
    },
    handleInfoClose() {
      this.admin_id = 0;
      this.infoModal = false;
    }
  }
};
</script>
