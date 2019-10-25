<template>
  <div>
    <page-table ref="pageTable" :filter="viewfilter" :columns="viewcolumns">
      <template slot="search">
        <FormItem>
          <Select v-model="viewfilter.field" style="width:90px;">
            <Option
              v-for="(option, index) in fieldList"
              :value="option.value"
              :key="index"
            >{{option.label}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input
            type="text"
            v-model="viewfilter.keyword"
            placeholder="关键字"
            @keyup.enter.native="getList(true)"
          ></Input>
        </FormItem>
        <!-- <FormItem>
          <Select v-model="viewfilter.n_status" style="width:80px;" placeholder="用户状态" clearable>
            <Option
              v-for="(option, index) in statusList"
              :value="option.value"
              :key="index"
            >{{option.label}}</Option>
          </Select>
        </FormItem>-->

        <FormItem>
          <Select v-model="viewfilter.time_field">
            <Option
              v-for="(option, index) in timeFiledList"
              :value="option.value"
              :key="index"
            >{{option.label}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Date-picker
            type="daterange"
            confirm
            placement="bottom-start"
            placeholder="日期"
            :options="options"
            @on-change="changeDateRange"
            style="width:182px;"
          ></Date-picker>
        </FormItem>
      </template>
    </page-table>
    <update-user
      :value="updateModal"
      :id="id"
      @on-cancel="handleUpdateCancel"
      @on-ok="handleUpdateOk"
    ></update-user>
    <Modal v-model="modal1" title="邀请人信息" @on-cancel="model1=false" :footer-hide="true">
      <Form :model="userinfo" :label-width="80">
        <FormItem label="用户编号:">{{userinfo.n_user_id}}</FormItem>
        <FormItem label="用户头像">
          <img
            :src="userinfo.vc_head_img_src"
            width="100px"
            height="100px"
            style="border-radius:50%"
          />
        </FormItem>
        <FormItem label="用户名称:">{{userinfo.vc_user_name}}</FormItem>
        <FormItem label="用户姓名:">{{userinfo.vc_real_name?userinfo.vc_real_name:""}}</FormItem>
        <FormItem label="用户区域:">{{userinfo.vc_region_code?userinfo.vc_region_code:""}}</FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import {
  getpage,
  setenable,
  partner,
  recommenduserinfo,
  updateuserbuttopermissions
} from "@/api/user";
import UpdateUser from "./components/update-user";
import { notice, getToken, deepCopy } from "@/libs/util";
import config from "@/config";

export default {
  name: "userList",
  components: {
    UpdateUser
  },
  data() {
    return {
      modal1: false,
      loading: false,
      formLoading: false,
      updateModal: false,
      userinfo: {},
      rules: {},
      imgs: [],
      fieldList: [
        {
          value: 2,
          label: "用户昵称"
        },
        {
          value: 3,
          label: "用户编号"
        }
      ],
      timeFiledList: [
        {
          value: 1,
          label: "创建时间"
        },
        {
          value: 2,
          label: "访问时间"
        }
      ],
      // statusList: [
      //   {
      //     value: 1,
      //     label: "正常"
      //   },
      //   {
      //     value: 2,
      //     label: "禁用"
      //   }
      // ],

      // 分组信息
      viewcolumns: [
        {
          title: "编号",
          align: "center",
          key: "login_id",
          width: 150
        },
        {
          title: "用户编号",
          align: "center",
          key: "user_id",
          width: 150
        },
        {
          title: "用户头像",
          align: "center",
          key: "avatar_url",
          tooltip: true,
          width: 200,
          render: (h, params) => {
            if (params.row.avatar_url) {
              return h("div", [
                h("img", {
                  style: {
                    "margin-top": "4px",
                    "margin-bottom": "-1px",
                    width: "50px",
                    height: "50px"
                  },
                  attrs: {
                    src: params.row.avatar_url
                  }
                })
              ]);
            }
          }
        },
        {
          title: "用户昵称",
          align: "center",
          key: "nick_name",
          tooltip: true,
          width: 200
        },
        {
          title: "用户openid",
          align: "center",
          key: "open_id",
          tooltip: true,
          width: 300
        },
        {
          title: "区域",
          align: "center",
          key: "vc_region_code",
          tooltip: true,
          width: 200,
          render: (h, params) => {
            return h("div", [
              h("p", params.row.province),
              h("p", params.row.city)
            ]);
          }
        },
        {
          title: "访问时间",
          align: "center",
          key: "login_time",
          width: 200
        },
        {
          title: "创建时间",
          align: "center",
          key: "create_time_string",
          
        }
      ],
      viewdata: [],
      viewfilter: {
        field: 1,
        keyword: "",
        user_type: "",
        n_status: 0,
        time_field: 1,
        begin_date: 0,
        city: "",
        companyid: 0,
        end_date: 0,
        total: 0,
        partner: 0
      },
      enabledata: {
        userid: 0
      },
      id: 0,
      options: {
        shortcuts: [
          {
            text: "今天",
            value() {
              const end = new Date();
              const start = new Date();
              return [start, end];
            }
          },
          {
            text: "昨天",
            value() {
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              return [start, start];
            }
          },
          {
            text: "最近一周",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "最近一个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          }
        ]
      },
      baseUrl:
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(isRefresh = false) {
      if (isRefresh) {
        this.$refs.pageTable.reload();
      } else {
        this.$refs.pageTable.loadingList(getpage);
      }
    },
    download() {
      var filter = JSON.parse(JSON.stringify(this.viewfilter));
      let url = "";
      for (let key in filter) {
        url += `&${key}=${filter[key]}`;
      }
      window.open(this.baseUrl + "user/download?token=" + getToken() + url);
    },
    changeDateRange(date) {
      this.viewfilter.begin_date = date[0] ? date[0].replace(/\-/g, "") : 0;
      this.viewfilter.end_date = date[1] ? date[1].replace(/\-/g, "") : 0;
    },
    async setenable() {
      var res = await setenable(this.enabledata);
      if (!res.code) {
        notice.showSuccess(this, "操作成功");
        this.getList();
      } else {
        notice.showError(this, res.msg);
      }

      this.formLoading = false;
      this.$nextTick(() => {
        this.formLoading = true;
      });
    },
    handleAddCancel() {
      this.addModal = false;
    },
    handleAddOk() {
      this.handleAddCancel();
      notice.showSuccess(this, "新增成功");
      this.getList(true);
    },
    handleUpdateCancel() {
      this.id = 0;
      this.updateModal = false;
    },
    handleUpdateOk() {
      this.handleUpdateCancel();
      notice.showSuccess(this, "编辑成功");
      this.getList(true);
    }
  }
};
</script>
