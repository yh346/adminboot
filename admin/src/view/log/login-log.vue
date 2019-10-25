<template>
  <div>
    <Tabs v-model="filter.is_belong_admin_user" type="card" @on-click="handleChangeUserType">
      <TabPane
        v-for="item in belong_array"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      ></TabPane>
    </Tabs>
    <Form inline>
      <FormItem>
        <Select v-model="filter.is_succeed" placeholder="登录状态" clearable>
          <Option
            v-for="(option, index) in success_array"
            :value="option.value"
            :key="index"
          >{{option.label}}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Input
          type="text"
          placeholder="登录帐号"
          v-model="filter.user_name"
          @keyup.enter.native="getList(true)"
        ></Input>
      </FormItem>
      <FormItem>
        <Date-picker
          type="daterange"
          confirm
          placement="bottom-start"
          placeholder="操作日期"
          :options="options"
          @on-change="changeDate"
        ></Date-picker>
      </FormItem>
      <FormItem>
        <Button type="primary" shape="circle" icon="ios-search" @click="getList(true)">筛选</Button>
      </FormItem>
    </Form>
    <Table border stripe :columns="columns" :data="data" :loading="loading"></Table>
    <div v-show="filter.total>0" style="margin: 10px;overflow: hidden;">
      <div style="float: right;">
        <Page
          :total="filter.total"
          :current="filter.page_index"
          @on-change="changePage"
          show-total
          :page-size="filter.page_size"
          :on-page-size-change="changeSize"
          placement="top"
          show-sizer
          transfer
        ></Page>
      </div>
    </div>
  </div>
</template>
<script>
import { list, del } from "@/api/login-log";
import { notice } from "@/libs/util";
export default {
  name: "loginLog",
  data() {
    return {
      loading: false,
      belong_array: [
        { label: "后台日志", value: "1" },
        // { label: "前台日志", value: "2" }
      ],
      success_array: [{ label: "成功", value: 1 }, { label: "失败", value: 2 }],
      columns: [
        {
          title: "日志ID",
          key: "login_id",
          width: 100,
          align: "center"
        },
        {
          title: "登录帐号",
          key: "user_name",
          width: 120
        },
        {
          title: "登录状态",
          key: "is_succeed",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h("Icon", {
              props: {
                type: params.row.is_succeed
                  ? "ios-checkmark-circle"
                  : "ios-close-circle",
                size: 20,
                color: params.row.is_succeed ? "green" : "red"
              }
            });
          }
        },
        {
          title: "登录时间",
          key: "login_time",
          width: 152
        },
        {
          title: "登录IP",
          key: "login_ip",
          width: 150
        },
        {
          title: "操作",
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  confirm: true,
                  title: "您确定要删除这条数据吗?",
                  transfer: true
                },
                on: {
                  "on-ok": async () => {
                    this.$set(params.row, "deleting", true);
                    var res = await del(params.row.login_id);
                    this.$set(params.row, "deleting", false);
                    if (!res.code) {
                      this.data.splice(params.index, 1);
                      notice.showSuccess(this, "删除成功");
                    } else {
                      notice.showError(this, res.message);
                    }
                  }
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small",
                      loading: params.row.deleting
                    },
                    style: {
                      marginRight: "5px"
                    }
                  },
                  "删除"
                )
              ]
            );
          }
        }
      ],
      data: [],
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
      filter: {
        is_belong_admin_user: "1",
        is_succeed: "",
        user_name: "",
        page_index: 1,
        page_size: 20,
        total: 0,
        begin_date: 0,
        end_date: 0
      }
    };
  },
  mounted() {
    notice.init(this, 100);
    this.getList();
  },
  methods: {
    changePage(page) {
      this.filter.page_index = page;
      this.getList();
    },
    changeSize(size) {
      this.filter.page_size = size;
      this.getList();
    },
    changeDate(date) {
      this.filter.begin_date = date[0] ? date[0].replace(/\-/g, "") : 0;
      this.filter.end_date = date[1] ? date[1].replace(/\-/g, "") : 0;
    },
    async getList(isReset = false) {
      if (isReset) {
        this.filter.page_index = 1;
      }
      this.loading = true;
      var res = await list(this.filter);
      this.loading = false;
      if (!res.code) {
        this.data = res.data;
        this.filter.total = res.count;
      } else {
        notice.showError(this, res.message);
      }
    },
    handleChangeUserType() {
      this.getList(true);
    }
  }
};
</script>