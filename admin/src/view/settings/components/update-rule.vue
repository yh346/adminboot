<template>
  <Drawer
    v-model="visible"
    :mask-closable="false"
    title="编辑分销规则"
    @on-close="handleCancel('addForm')"
    width="720"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
  >
    <Form ref="addForm" :model="rule" :label-width="100" :rules="rules">
      <FormItem label="规则名称" prop="user_reward_rules_name" label-for="user_reward_rules_name">
        <Input
          element-id="user_reward_rules_name"
          v-model="rule.user_reward_rules_name"
          placeholder="请填写规则名称，方便后台管理"
        ></Input>
      </FormItem>
      <FormItem label="一级分销(%)" label-for="d_one_proportion">
        <Input element-id="d_one_proportion" :min="0" v-model="rule.d_one_proportion"></Input>
      </FormItem>
      <FormItem label="二级分销(%)" label-for="d_two_proportion">
        <Input element-id="d_two_proportion" :min="0" v-model="rule.d_two_proportion"></Input>
      </FormItem>
      <FormItem label="状态">
        <Checkbox v-model="rule.is_enable">显示</Checkbox>
      </FormItem>
      <FormItem label="备注" prop="remark" label-for="remark">
        <Input element-id="remark" v-model="rule.remark" placeholder="备注"></Input>
      </FormItem>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('addForm')">取消</Button>
      <Button type="primary" @click="handleOk('addForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { add, get, edit } from "@/api/rule";
import { notice } from "@/libs/util";
export default {
  name: "updateRule",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    id(val) {
      this.rule.n_user_reward_rules_id = val;

      if (val > 0) {
        this.enableparam.single_id = val;
        get(this.enableparam).then(res => {
          if (!res.code) {
            this.rule = res.data;
          } else {
            notice.showError(this, res.message);
          }
        });
      }
    }
  },
  data() {
    return {
      rule: {
        remark: "",
        user_reward_rules_name: "",
        d_one_proportion: 0,
        d_two_proportion: 0,
        is_enable: true,
        n_user_reward_rules_id: 0
      },
      type_array: [],
      visible: this.value,
      formLoading: false,
      rules: {
        user_reward_rules_name: [
          {
            required: true,
            message: "规则名称不能为空",
            trigger: "change"
          }
        ]
      },
      enableparam: {
        single_id: 0
      }
    };
  },
  methods: {
    handleCancel(name) {
      this.rule = {
        n_user_reward_rules_id: 0,
        remark: "",
        user_reward_rules_name: "",
        d_one_proportion: 0,
        d_two_proportion: 0,
        is_enable: true
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await edit(this.rule);
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
