<template>
  <Drawer
    v-model="visible"
    :mask-closable="false"
    title="编辑轮播"
    @on-close="handleCancel('updateForm')"
    width="720"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
  >
    <Form ref="updateForm" :model="banner_info" :label-width="70" :rules="rules">
      <FormItem label="标题" prop="title" label-for="title">
        <Input element-id="title" v-model="banner_info.title" placeholder="请填写标题，方便后台管理"></Input>
      </FormItem>
      <FormItem label="轮播类型" prop="banner_type">
        <Select v-model="banner_info.banner_type" placeholder="轮播类型">
          <Option
            v-for="(option, index) in type_array"
            :value="option.code.toString()"
            :key="index"
          >{{option.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="图片" prop="pic" class="ivu-form-item-required">
        <single-upload
          :src="banner_info.pic"
          :img_url="banner_info.pic_url"
          :width="235"
          :height="147"
          @on-success="(src)=>{banner_info.pic=src.key;banner_info.pic_url=src.url}"
        ></single-upload>
         <span style="color:#9ea7b4;">（最佳尺寸：750*420）</span>
      </FormItem>
      <FormItem label="跳转链接" prop="url" label-for="url">
        <Input element-id="url" v-model="banner_info.url" placeholder="如需跳转，请设置链接"></Input>
      </FormItem>
      <FormItem label="排序" label-for="sort">
        <InputNumber element-id="sort" :min="0" v-model="banner_info.sort"></InputNumber>
        <span style="color:#9ea7b4;">（数值越大，排序越靠前）</span>
      </FormItem>
      <FormItem label="显示状态">
        <Checkbox v-model="banner_info.is_show">显示</Checkbox>
      </FormItem>
      <FormItem label="上架时间" prop="begin_date" label-for="begin_date">
        <DatePicker
          type="date"
          v-model="banner_info.begin_date_string"
          element-id="begin_date"
          placeholder="请输入上架时间"
          @on-change="changeBeginDate"
        ></DatePicker>
      </FormItem>
      <FormItem label="下架时间" prop="end_date" label-for="end_date">
        <DatePicker
          type="date"
          v-model="banner_info.end_date_string"
          element-id="end_date"
          placeholder="请输入下架时间"
          @on-change="changeEndDate"
        ></DatePicker>
      </FormItem>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('updateForm')">取消</Button>
      <Button type="primary" @click="handleOk('updateForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { update } from "@/api/banner";
import { notice } from "@/libs/util";
export default {
  name: "updateBanner",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    typeArray: {
      type: Array,
      default() {
        return [];
      }
    },
    banner: {
      type: Object,
      default() {
        return {
          banner_id: 0,
          banner_type: "",
          title: "",
          pic: "",
          pic_url: "",
          is_show: true,
          begin_date: 0,
          begin_date_string: "",
          end_date: 0,
          end_date_string: "",
          sort: 0
        };
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    typeArray(val) {
      this.type_array = val;
    },
    banner: {
      handler(val) {
        if (val && val.banner_type) {
          this.banner_info = val;
          this.banner_info.banner_type = this.banner_info.banner_type.toString();
        }
      },
      deep: true
    }
  },
  data() {
    return {
      banner_info: {
        banner_id: 0,
        banner_type: "",
        title: "",
        pic: "",
        pic_url: "",
        is_show: true,
        begin_date: 0,
        begin_date_string: "",
        end_date: 0,
        end_date_string: "",
        sort: 0
      },
      type_array: [],
      visible: this.value,
      formLoading: false,
      rules: {
        banner_type: [
          {
            required: true,
            message: "请选择轮播类型",
            trigger: "change"
          }
        ],
        begin_date: [
          {
            validator: (rule, value, callback) => {
              if (!this.banner_info.begin_date) {
                callback(new Error("请输入上架时间"));
              } else {
                callback();
              }
            }
          }
        ],
        end_date: [
          {
            validator: (rule, value, callback) => {
              if (!this.banner_info.end_date) {
                callback(new Error("请输入下架时间"));
              } else {
                callback();
              }
            }
          }
        ],
        pic: [
          {
            validator: (rule, value, callback) => {
              if (!this.banner_info.pic) {
                callback(new Error("请上传轮播图片"));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    changeBeginDate(date) {
      this.banner_info.begin_date = date ? date.replace(/\-/g, "") : 0;
    },
    changeEndDate(date) {
      this.banner_info.end_date = date ? date.replace(/\-/g, "") : 0;
    },
    handleCancel(name) {
      this.banner_info = {
        banner_id: 0,
        banner_type: "",
        title: "",
        pic: "",
        pic_url: "",
        is_show: true,
        begin_date: 0,
        begin_date_string: "",
        end_date: 0,
        end_date_string: "",
        sort: 0
      };
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await update(this.banner_info);
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
