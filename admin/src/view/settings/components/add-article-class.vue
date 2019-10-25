<template>
  <Drawer
    v-model="visible"
    :mask-closable="false"
    scrollable
    title="新增文章分类"
    @on-close="handleCancel('addForm')"
    width="720"
  >
    <Form ref="addForm" :model="article_class" :label-width="80" :rules="rules">
      <FormItem label="文章基类" prop="parent_id">
        <Select v-model="article_class.parent_id" style="width:200px">
          <Option
            v-for="item in types"
            :value="item.dict_code"
            :key="item.dict_code"
          >{{ item.dict_name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="分类名称" prop="class_name" label-for="class_name">
        <Input
          ref="class_name"
          element-id="class_name"
          v-model="article_class.class_name"
          placeholder="分类名称"
          style="width: 300px"
        ></Input>
      </FormItem>
      <FormItem label="排序" label-for="sort">
        <InputNumber element-id="sort" :min="0" v-model="article_class.sort"></InputNumber>
      </FormItem>
      <FormItem label="SEO标题" label-for="seo_title">
        <Input
          type="textarea"
          element-id="seo_title"
          v-model="article_class.seo_title"
          placeholder="SEO标题"
          :rows="2"
        ></Input>
      </FormItem>
      <FormItem label="SEO关键词" label-for="seo_keywords">
        <Input
          type="textarea"
          element-id="seo_keywords"
          v-model="article_class.seo_keywords"
          placeholder="SEO关键词"
          :rows="3"
        ></Input>
      </FormItem>
      <FormItem label="SEO描述" label-for="seo_description">
        <Input
          type="textarea"
          element-id="seo_description"
          v-model="article_class.seo_description"
          placeholder="SEO描述"
          :rows="5"
        ></Input>
      </FormItem>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('addForm')">取消</Button>
      <Button type="primary" @click="handleOk('addForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { addClass } from "@/api/article";
import { notice } from "@/libs/util";
export default {
  name: "addArticleClass",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    parentTypeArray: {
      type: Array,
      default() {
        return [];
      }
    },
    parentType: {
      type: String,
      default: ""
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.$nextTick(() => {
          this.$refs.class_name.focus();
        });
      }
    },
    parentTypeArray(val) {
      this.types = val;
    },
    parentType(val) {
      if (val) {
        this.article_class.parent_id = val;
      }
    }
  },
  data() {
    return {
      visible: this.value,
      article_class: {
        class_id: 0,
        parent_id: "",
        class_name: "",
        sort: 0,
        seo_title: "",
        seo_keywords: "",
        seo_description: ""
      },
      formLoading: false,
      rules: {
        parent_id: [
          {
            required: true,
            message: "请选择文章基类",
            trigger: "change"
          }
        ],
        class_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      },
      types: []
    };
  },
  methods: {
    handleCancel(name) {
      this.article_class = {
        class_id: 0,
        parent_id: "",
        class_name: "",
        sort: 0,
        seo_title: "",
        seo_keywords: "",
        seo_description: ""
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await addClass(this.article_class);
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
