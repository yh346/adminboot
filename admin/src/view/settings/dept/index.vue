<template>
  <Card shadow style="height: 100%;width: 100%;overflow:hidden">
    <div class="department-outer">
      <div class="zoom-box">
        <zoom-controller v-model="zoom" :min="20" :max="200"></zoom-controller>
      </div>
      <div class="view-box">
        <org-view
          v-if="data"
          :data="data"
          :zoom-handled="zoomHandled"
          @on-menu-click="handleMenuClick"
        ></org-view>
      </div>
    </div>
    <add-dept
      :value="addModal"
      :parent="parent_dept"
      @on-cancel="handleAddCancel"
      @on-ok="handleAddOk"
    ></add-dept>
    <update-dept
      :value="updateModal"
      :dept-id="dept_id"
      @on-cancel="handleUpdateCancel"
      @on-ok="handleUpdateOk"
    ></update-dept>
    <dept-info :value="infoModal" :dept-id="info_dept_id" @on-close="handleClose"></dept-info>
  </Card>
</template>

<script>
import { tree, del } from "@/api/dept";
import { notice } from "@/libs/util";
import "./index.less";
import OrgView from "./components/org-view";
import ZoomController from "./components/zoom-controller";
import AddDept from "./components/add-dept";
import UpdateDept from "./components/update-dept";
import DeptInfo from "./components/dept-info";
export default {
  name: "org_tree_page",
  components: {
    OrgView,
    ZoomController,
    AddDept,
    UpdateDept,
    DeptInfo
  },
  data() {
    return {
      data: null,
      zoom: 100,
      addModal: false,
      selectedNode: null,
      parent_dept: {},
      updateModal: false,
      dept_id: 0,
      infoModal: false,
      info_dept_id: 0
    };
  },
  computed: {
    zoomHandled() {
      return this.zoom / 100;
    }
  },
  mounted() {
    notice.init(this);
    this.getTree();
  },
  methods: {
    handleMenuClick({ data, key }) {
      switch (key) {
        case "edit": //编辑部门
          this.selectedNode = data;
          this.dept_id = data.id;
          this.updateModal = true;
          break;
        case "detail": //查看部门
          this.info_dept_id = data.id;
          this.infoModal = true;
          break;
        case "new": //新增子部门
          this.selectedNode = data;
          this.parent_dept = {
            parent_dept_id: data.id,
            parent_dept_name: data.label
          };
          this.addModal = true;
          break;
        case "delete": //删除部门
          this.$Modal.confirm({
            loading: true,
            title: "温馨提示",
            content: `<p>您真的要删除“${
              data.label
            }”吗？</p><p>一旦删除，无法恢复！</p>`,
            onOk: () => {
              del(data.id).then(res => {
                if (!res.code) {
                  notice.showSuccess(this, "删除成功");
                  this.getTree();
                } else {
                  notice.showError(this, res.message);
                }
                this.$Modal.remove();
              });
            }
          });
          break;
        default:
          break;
      }
    },
    getTree() {
      tree().then(res => {
        if (!res.code) {
          this.data = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleAddCancel() {
      this.parent_dept = {};
      this.addModal = false;
    },
    handleAddOk({ id, label }) {
      this.handleAddCancel();
      var children = this.selectedNode.children || [];
      children.push({
        id: id,
        label: label,
        children: []
      });
      notice.showSuccess(this, "新增成功");
    },
    handleUpdateCancel() {
      this.dept_id = 0;
      this.updateModal = false;
    },
    handleUpdateOk({ id, label }) {
      this.handleUpdateCancel();
      this.selectedNode.label = label;
      notice.showSuccess(this, "编辑成功");
    },
    handleClose() {
      this.info_dept_id = 0;
      this.infoModal = false;
    }
  }
};
</script>
