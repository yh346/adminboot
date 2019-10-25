<template>
  <div>
    <Button
      type="success"
      shape="circle"
      style="margin-bottom:10px;"
      icon="ios-add-circle-outline"
      @click="addModal=true"
    >新增角色</Button>
    <Button
      type="primary"
      shape="circle"
      style="margin-bottom:10px;margin-left:10px;"
      icon="md-refresh"
      @click="getList"
    >刷新一下</Button>
    <Table border stripe :columns="columns" :data="data" :loading="loading"></Table>
    <add-role :value="addModal" @on-ok="handleAddOk" @on-cancel="handleAddCancel"></add-role>
    <update-role
      :value="updateModal"
      :role="role"
      @on-ok="handleUpdateOk"
      @on-cancel="handleUpdateCancel"
    ></update-role>
    <assign-role-right
      :value="assignModal"
      :role="assign_role"
      @on-ok="handleAssignOk"
      @on-cancel="handleAssignCancel"
    ></assign-role-right>
  </div>
</template>
<script>
import { list, del } from "@/api/admin-role";
import { notice, deepCopy } from "@/libs/util";
import AddRole from "./components/add-role";
import UpdateRole from "./components/update-role";
import AssignRoleRight from "./components/assign-role-right";
export default {
  name: "adminRole",
  components: {
    AddRole,
    UpdateRole,
    AssignRoleRight
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          title: "角色编号",
          key: "role_id",
          width: 85,
          align: "center"
        },
        {
          title: "角色名称",
          key: "role_name",
          width: 200
        },
        {
          title: "显示排序",
          key: "sort",
          width: 85,
          align: "center"
        },
        {
          title: "添加时间",
          key: "create_time",
          width: 152
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
                  props: {
                    size: "small"
                  },
                  style: { marginRight: "5px" },
                  on: {
                    click: async () => {
                      this.role = deepCopy(params.row);
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
                  props: { type: "primary", size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.assign_role = {
                        role_id: params.row.role_id,
                        role_name: params.row.role_name
                      };
                      this.assignModal = true;
                    }
                  }
                },
                "权限设置"
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
                      var res = await del(params.row.role_id);
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
        }
      ],
      data: [],
      addModal: false,
      updateModal: false,
      role: {},
      assignModal: false,
      assign_role: {}
    };
  },
  mounted() {
    notice.init(this);
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      var res = await list();
      if (!res.code) {
        this.loading = false;
        this.data = res.data;
      } else {
        notice.showError(this, res.message);
      }
    },
    handleAddCancel() {
      this.addModal = false;
    },
    handleAddOk() {
      this.handleAddCancel();
      notice.showSuccess(this, "新增成功");
      this.getList();
    },
    handleUpdateCancel() {
      this.updateModal = false;
      this.role = {};
    },
    handleUpdateOk() {
      this.handleUpdateCancel();
      notice.showSuccess(this, "编辑成功");
      this.getList();
    },
    handleAssignCancel() {
      this.assignModal = false;
      this.assign_role = {};
    },
    handleAssignOk() {
      this.handleAssignCancel();
      notice.showSuccess(this, "设置权限成功");
    }
  }
};
</script>
