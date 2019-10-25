<template>
  <Drawer
    width="520"
    v-model="visible"
    title="部门信息"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
    @on-close="handleClose"
  >
    <div class="drawer-dept">
      <Form :label-width="80">
        <FormItem label="上级部门：">
          <Tag color="success" v-if="info.parent_dept_name">{{info.parent_dept_name}}</Tag>
        </FormItem>
        <FormItem label="部门名称：">{{info.dept_name}}</FormItem>
        <FormItem label="部门类型：">{{info.dept_type_name}}</FormItem>
        <FormItem label="部门主管：">{{info.dept_director_array.join('，')}}</FormItem>
        <FormItem label="排序：">{{info.sort}}</FormItem>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <div class="drawer-footer">
        <Button type="primary" @click="handleClose">关闭</Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
import { update, types, view } from "@/api/dept";
import { notice } from "@/libs/util";
export default {
  name: "deptInfo",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    deptId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    deptId(val) {
      if (val) {
        this.info.dept_id = val;
        this.getInfo();
      }
    }
  },
  data() {
    return {
      visible: this.value,
      info: {
        dept_director_array: []
      },
      spinShow: false
    };
  },
  methods: {
    getInfo() {
      this.spinShow = true;
      view(this.info.dept_id).then(res => {
        this.spinShow = false;
        if (!res.code) {
          this.info = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleClose() {
      this.$emit("on-close");
    }
  }
};
</script>

<style lang="less" scoped>
.drawer-dept {
  .ivu-form-item {
    margin-bottom: 8px;
  }
}
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
