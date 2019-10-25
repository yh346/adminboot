<template>
  <Drawer
    v-model="visible"
    :mask-closable="false"
    scrollable
    title="编辑文章"
    width="60"
    @on-close="handleCancel('addForm')"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',padding:'5px',paddingBottom: '53px', position: 'static'}"
  >
    <Form ref="addForm" :model="article" :label-width="120" :rules="rules">
      <Collapse v-model="collapse_value" accordion>
        <Panel name="1">基本信息
          <div slot="content">
            <FormItem label="文章分类" prop="type" class="ivu-form-item-required">
              <Cascader
                :data="type_array"
                :load-data="loadData"
                v-model="type_class"
                placeholder="文章分类"
                change-on-select
                @on-change="handleChangeType"
              ></Cascader>
            </FormItem>
            <FormItem label="标题" prop="title">
              <Input element-id="title" v-model="article.title" placeholder="标题"></Input>
            </FormItem>
            <FormItem label="短标题" prop="short_title">
              <Input element-id="short_title" v-model="article.short_title" placeholder="短标题"></Input>
            </FormItem>
            <Row :gutter="32">
              <Col :span="12">
                <FormItem label="标题样式" label-for="title_style_class">
                  <Input
                    element-id="title_style_class"
                    v-model="article.title_style_class"
                    placeholder="标题样式"
                  ></Input>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="新窗口打开">
                  <i-Switch v-model="article.is_target">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                  </i-Switch>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="32">
              <Col :span="12">
                <FormItem label="显示排序">
                  <InputNumber v-model="article.sort" :precision="0" :min="0"></InputNumber>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="浏览数">
                  <InputNumber v-model="article.hits" :precision="0" :min="0"></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="封面图">
              <single-upload
                :src="article.cover_image"
                :width="235"
                :height="147"
                @on-success="(src)=>article.cover_image=src"
              ></single-upload>
            </FormItem>
          </div>
        </Panel>
        <Panel name="2">扩展信息
          <div slot="content">
            <FormItem label="来源文本" label-for="source_text">
              <Input element-id="source_text" v-model="article.source_text" placeholder="来源文本"></Input>
            </FormItem>
            <FormItem label="来源链接" label-for="source_url">
              <Input element-id="source_url" v-model="article.source_url" placeholder="来源链接"></Input>
            </FormItem>
            <FormItem label="SEO标题" label-for="seo_title">
              <Input element-id="seo_title" v-model="article.seo_title" placeholder="SEO标题"></Input>
            </FormItem>
            <FormItem label="SEO关键词" label-for="seo_keywords">
              <Input element-id="seo_keywords" v-model="article.seo_keywords" placeholder="SEO关键词"></Input>
            </FormItem>
            <FormItem label="SEO描述" label-for="seo_description">
              <Input
                type="textarea"
                :rows="3"
                element-id="seo_description"
                v-model="article.seo_description"
                placeholder="SEO描述"
              ></Input>
            </FormItem>
          </div>
        </Panel>
        <Panel name="3">详细信息
          <p slot="content">
            <ueditor
              :html="article.content"
              :margin="'-10px'"
              @on-sync="(html)=>article.content=html"
            ></ueditor>
          </p>
        </Panel>
      </Collapse>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('addForm')">取消</Button>
      <Button type="primary" @click="handleOk('addForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { listClass, update, view } from "@/api/article";
export default {
  name: "updateArticle",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleId: {
      type: Number,
      default: 0
    },
    articleTypeArray: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    articleId(val) {
      if (val > 0) {
        this.article.article_id = val;
        this.getInfo();
      }
    },
    articleTypeArray(val) {
      this.type_array = val;
    }
  },
  data() {
    return {
      visible: this.value,
      collapse_value: "1",
      formLoading: false,
      type_array: [],
      type_class: ["", ""],
      article: {
        article_id: 0,
        type_id: "",
        class_id: "",
        content: "",
        sort: 0,
        hits: 0,
        is_target: false,
        title: "",
        short_title: "",
        title_style_class: "",
        source_text: "",
        source_url: "",
        seo_title: "",
        seo_keywords: "",
        seo_description: "",
        content: ""
      },
      rules: {
        type: [
          {
            validator: (rule, value, callback) => {
              if (!this.article.type_id || !this.article.class_id) {
                callback(new Error("请选择文章分类"));
              } else {
                callback();
              }
            }
          }
        ],
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ]
      },
      spinShow: false
    };
  },
  methods: {
    getInfo() {
      this.spinShow = true;
      view(this.article.article_id).then(res => {
        this.spinShow = false;
        if (!res.code) {
          this.article = res.data;
          this.$set(this.type_class, 0, this.article.type_id.toString());
          setTimeout(() => {
            this.$set(this.type_class, 1, this.article.class_id.toString());
          }, 500);
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    loadData(item, callback) {
      if (!item.children.length) {
        item.loading = true;
        listClass(item.value).then(res => {
          item.loading = false;
          if (!res.code) {
            item.children = res.data.map(p => {
              return {
                value: p.class_id.toString(),
                label: p.class_name
              };
            });
            callback();
          }
        });
      } else {
        callback();
      }
    },
    handleChangeType(value, selectedData) {
      if (selectedData.length) {
        this.article.type_id = selectedData[0].value;
        if (selectedData.length > 1) {
          this.article.class_id = selectedData[1].value;
        }
      } else {
        this.article.type_id = "";
        this.article.class_id = "";
      }
    },
    handleCancel(name) {
      this.article = {
        type_id: "",
        class_id: "",
        content: "",
        sort: 0,
        hits: 0,
        is_target: false,
        title: "",
        short_title: "",
        title_style_class: "",
        source_text: "",
        source_url: "",
        seo_title: "",
        seo_keywords: "",
        seo_description: "",
        content: ""
      };
      this.$set(this.type_class, 0, "");
      this.$set(this.type_class, 1, "");
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await update(this.article);
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
  z-index: 1000;
}
</style>
