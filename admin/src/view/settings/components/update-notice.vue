<template>
  <Drawer
    v-model="visible"
    :mask-closable="false"
    scrollable
    title="编辑公告"
    width="720"
    @on-close="handleCancel('updateForm')"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
  >
    <Form ref="updateForm" :model="notice" :label-width="70" :rules="rules">
      <FormItem label="标题" prop="title" label-for="title">
        <Input autofocus element-id="title" v-model="notice.title" placeholder="标题"></Input>
      </FormItem>
      <FormItem label="内容" prop="detail" label-for="detail">
        <Input v-model="notice.detail" :rows="15" type="textarea"></Input>
      </FormItem>
      <FormItem label-for="detail">
        <Checkbox v-model="notice.is_publish">发布上线</Checkbox>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('updateForm')">取消</Button>
      <Button type="primary" @click="handleOk('updateForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { update, view } from "@/api/notice";
import { notice } from "@/libs/util";
export default {
  name: "updateNotice",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    noticeId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    noticeId(val) {
      if (val) {
        this.notice.notice_id = val;
        this.getInfo();
      }
    }
  },
  data() {
    return {
      notice: {
        notice_id: 0,
        title: "",
        detail: "",
        is_publish: false
      },
      visible: false,
      formLoading: false,
      spinShow: false,
      rules: {
        title: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
        detail: [{ required: true, message: "请输入公告内容", trigger: "blur" }]
      }
    };
  },
  methods: {
    getInfo() {
      this.spinShow = true;
      view(this.notice.notice_id).then(res => {
        this.spinShow = false;
        if (!res.code) {
          this.notice = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleCancel(name) {
      this.notice = {
        notice_id: 0,
        title: "",
        detail: "",
        is_publish: false
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await update(this.notice);
          this.formLoading = false;
          if (!res.code) {
            this.handleCancel(name);
            this.$emit("on-ok");
          } else {
            notice.showError(this, res.message);
          }
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
