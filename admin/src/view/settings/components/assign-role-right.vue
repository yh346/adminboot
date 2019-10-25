<template>
  <Drawer
    v-model="visible"
    :mask-closable="false"
    scrollable
    title="角色权限设置"
    :width="720"
    @on-close="handleCancel"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
  >
    <Tree ref="tree" :data="right_data" show-checkbox check-strictly></Tree>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel">取消</Button>
      <Button type="primary" @click="handleOk" :loading="loading">确定</Button>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </Drawer>
</template>

<script>
import { assignRight } from "@/api/admin-role";
import { tree } from "@/api/admin-right";
import { notice } from "@/libs/util";
export default {
  name: "assignRoleRight",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    role: {
      type: Object,
      default() {
        return {
          role_id: 0,
          role_name: ""
        };
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val && this.role.role_id) {
        this.getTree();
      }
    },
    role: {
      handler(val) {
        if (val && val.role_id) {
          this.right_data[0].title = val.role_name;
        }
      },
      deep: true
    }
  },
  data() {
    return {
      visible: this.value,
      spinShow: false,
      right_data: [
        {
          title: "权限树",
          expand: true,
          children: []
        }
      ],
      loading: false
    };
  },
  methods: {
    getTree() {
      this.spinShow = true;
      tree(this.role.role_id).then(res => {
        this.spinShow = false;
        if (!res.code) {
          this.right_data[0].children = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleCancel() {
      this.$emit("on-cancel");
    },
    handleOk() {
      this.loading = true;
      var right_id_array = this.$refs.tree
        .getCheckedNodes()
        .filter(p => p.right_id > 0)
        .map(p => p.right_id);
      assignRight({
        role_id: this.role.role_id,
        right_id_array
      }).then(res => {
        this.loading = false;
        if (!res.code) {
          this.$emit("on-ok");
        } else {
          notice.showError(this, res.message);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
