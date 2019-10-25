<template>
  <Drawer
    v-model="visible"
    :mask-closable="false"
    title="编辑用户"
    @on-close="handleCancel('addForm')"
    width="720"
    :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
  >
    <Form ref="addForm" :model="datainfo" :label-width="100" :rules="rules">
      <FormItem label="用户编号" prop="vc_user_name" label-for="vc_user_name">{{datainfo.n_user_id}}</FormItem>
      <FormItem label="用户名称" prop="vc_user_name" label-for="vc_user_name">{{datainfo.vc_user_name}}</FormItem>
      <FormItem label="用户姓名" prop="vc_user_name" label-for="vc_user_name">
        <Input style=" width:100px;" v-model="datainfo.vc_real_name"></Input>
        <!-- {{datainfo.vc_real_name}} -->
      </FormItem>
      <FormItem label="身份证" prop="vc_user_name" label-for="vc_user_name">{{datainfo.vc_sfz}}</FormItem>
      <FormItem label="手机号码" prop="vc_real_name" label-for="vc_real_name">
        <Input style=" width:100px;" v-model="datainfo.vc_phone"></Input>
        <!-- {{datainfo.vc_phone}} -->
      </FormItem>
      <FormItem
        label="紧急联系人"
        prop="emergency_name"
        label-for="emergency_name"
      >{{datainfo.emergency_name}}</FormItem>
      <FormItem
        label="紧急联系人电话"
        prop="emergency_phone"
        label-for="emergency_phone"
      >{{datainfo.emergency_phone}}</FormItem>
      <FormItem label="一级邀请" label-for="n_sort">
        <Input style=" width:100px;" v-model="datainfo.n_one_parent_user_id"></Input>
        <span style="color:#9ea7b4;">（二级邀请人根据一级邀请人自动得出）</span>
      </FormItem>
      <FormItem label="区域信息">
        <Select
          v-model="datainfo.region_province_code"
          id="region_province_code"
          style="width:110px; margin-right:10px;"
          @on-change="changeprovinces"
          placeholder="省"
        >
          <Option
            v-for="(option, index) in provinces"
            :value="option.value"
            :key="index"
          >{{option.label}}</Option>
        </Select>
        <Select
          v-model="datainfo.region_city_code"
          id="region_city_code"
          style="width:110px; margin-right:10px;"
          placeholder="市"
          clearable
        >
          <Option
            v-for="(option, index) in citys"
            :value="option.value"
            :key="index"
          >{{option.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="用户类别" label-for="n_sort">
        <Select v-model="datainfo.n_user_grade_id" style="width:100px;" placeholder="用户类别">
          <Option
            v-for="(option, index) in userTypeList"
            :value="option.value"
            :key="index"
          >{{option.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="合伙人">
        <Checkbox v-model="datainfo.is_partner"></Checkbox>
        <span style="color:#9ea7b4;">（不是合伙人不参与分销计算）</span>
      </FormItem>
      <FormItem
        label="年卡时间"
        prop="n_year_card_end_date_string"
        label-for="n_year_card_end_date_string"
      >
        <DatePicker
          type="date"
          v-model="datainfo.n_year_card_end_date_string"
          element-id="n_year_card_end_date"
          placeholder="请输入年卡时间"
          @on-change="changeDate"
        ></DatePicker>
        <span style="color:#9ea7b4;">（年卡过期时间）</span>
      </FormItem>
      <FormItem label="备注" label-for="vc_remark">
        <Input element-id="vc_remark" :rows="6" v-model="datainfo.vc_remark" type="textarea"></Input>
      </FormItem>
    </Form>
    <div class="drawer-footer">
      <Button style="margin-right: 8px" @click="handleCancel('addForm')">取消</Button>
      <Button type="primary" @click="handleOk('addForm')" :loading="formLoading">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import { get, update } from "@/api/user";
import { notice } from "@/libs/util";
import { province, children } from "@/api/region";
export default {
  name: "UpdateUser",
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
      this.datainfo.n_user_id = val;

      if (val > 0) {
        get(val).then(res => {
          if (!res.code) {
            this.datainfo = res.data;
            this.datainfo.region_city_code = res.data.region_city_code;
            this.datainfo.region_province_code = res.data.region_province_code;
            this.changeprovinces(this.datainfo.region_province_code);
          } else {
            notice.showError(this, res.message);
          }
        });
      }
    }
  },
  data() {
    return {
      datainfo: {
        n_user_id: 0,
        vc_phone: "",
        vc_user_name: "",
        vc_real_name: "",
        n_one_parent_user_id: 0,
        n_user_grade_id: "",
        region_city_code: "",
        region_province_code: "",
        is_partner: false,
        vc_remark: "",
        n_year_card_end_date: 0
      },
      provinces: [],
      citys: [],
      userTypeList: [
        {
          value: 1,
          label: "普通用户"
        },
        {
          value: 2,
          label: "一星用户"
        },
        {
          value: 3,
          label: "二星用户"
        },
        {
          value: 4,
          label: "三星用户"
        }
      ],
      type_array: [],
      visible: this.value,
      formLoading: false,
      rules: {
        vc_course_teacher_name: [
          {
            required: true,
            message: "教师名称不能为空",
            trigger: "change"
          }
        ],
        n_year_card_end_date_string: [
          {
            validator: (rule, value, callback) => {
              if (!this.datainfo.n_year_card_end_date_string) {
                callback(new Error("请输入年卡过期时间"));
              } else {
                callback();
              }
            }
          }
        ],
        vc_img: [
          {
            validator: (datainfo, value, callback) => {
              if (!value) {
                callback(new Error("请上传图片"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      enableparam: {
        single_id: 0
      }
    };
  },
  mounted() {
    province().then(_res => {
      if (!_res.code) {
        this.provinces = _res.data.map(p => {
          return {
            value: p.code,
            label: p.name
          };
        });
      } else {
        notice.showError(this, res.message);
      }
    });
  },
  methods: {
    changeDate(date) {
      this.datainfo.n_year_card_end_date = date ? date.replace(/\-/g, "") : 0;
    },
    handleCancel(name) {
      // Object.assign(this.datainfo, this.$options.data().datainfo);
      // console.log(this.$options.data().datainfo)
      this.datainfo = {
        n_user_id: 0,
        vc_phone: "",
        vc_user_name: "",
        vc_real_name: "",
        n_one_parent_user_id: 0,
        n_user_grade_id: "",
        region_city_code: "",
        region_province_code: "",
        is_partner: false,
        vc_remark: "",
        n_year_card_end_date: 0
      };
      this.citys = [];
      this.$refs[name].resetFields();
      this.$emit("on-cancel");
    },
    handleOk(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formLoading = true;
          var res = await update(this.datainfo);
          this.formLoading = false;
          if (!res.code) {
            this.handleCancel(name);
            this.$emit("on-ok");
          } else {
            notice.showError(this, res.message);
          }
        }
      });
    },
    changeprovinces(val) {
      if (!val) return;
      children(val).then(_res => {
        if (!_res.code) {
          this.citys = _res.data.map(p => {
            if (p.code == this.datainfo.region_city_code) {
              this.datainfo.region_city_code = p.code;
            }
            return {
              value: p.code,
              label: p.name,
              loading: false
            };
          });
          if (this.citys.length > 0) {
            // this.datainfo.region_city_code = this.citys[0].value;
          } else {
            this.datainfo.region_city_code = 0;
          }
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
