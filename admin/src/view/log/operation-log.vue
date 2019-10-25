<template>
  <div>
    <Tabs :value="user_type" type="card" @on-click="handleChangeUserType">
      <TabPane
        v-for="item in user_type_array"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      ></TabPane>
    </Tabs>
    <Form inline>
      <FormItem>
        <Select placeholder="日志类型" v-model="filter.log_type" clearable style="width:120px;">
          <Option
            v-for="(option, index) in type_array"
            :value="option.code"
            :key="index"
          >{{option.name}}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Input
          type="text"
          placeholder="关键词"
          v-model="filter.keyword"
          @keyup.enter.native="getList(true)"
        ></Input>
      </FormItem>
      <FormItem>
        <Input
          type="text"
          placeholder="操作帐号"
          v-model="filter.user_name"
          @keyup.enter.native="getList"
        ></Input>
      </FormItem>
      <FormItem>
        <Date-picker
          type="daterange"
          confirm
          placement="bottom-end"
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
import { enumList } from "@/api/enum";
import { list, userLogList } from "@/api/log";
import { notice } from "@/libs/util";
export default {
  name: "operationLog",
  data() {
    return {
      user_type: "1",
      user_type_array: [
        {
          label: "后台日志",
          value: "1"
        }
        // ,
        // {
        //   label: "前台日志",
        //   value: "2"
        // }
      ],
      type_array: [],
      log_type_array: [],
      user_log_type_array: [],
      loading: false,
      columns: [
        {
          title: "日志类型",
          key: "log_type_name",
          width: 120,
          align: "center"
        },
        {
          title: "操作帐号",
          key: "user_name",
          width: 120
        },
        {
          title: "操作IP",
          key: "admin_ip",
          width: 130
        },
        {
          title: "操作时间",
          key: "create_time",
          width: 152
        },
        {
          title: "操作说明",
          key: "remark"
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
        keyword: "",
        user_name: "",
        log_type: 0,
        page_index: 1,
        page_size: 20,
        total: 0,
        begin_date: 0,
        end_date: 0
      }
    };
  },
  async mounted() {
    notice.init(this, 100);
    var res = await enumList(103);
    if (!res.code) {
      this.log_type_array = res.data;
      this.type_array = res.data;
      this.getList();
    } else {
      notice.showError(this, res.message);
    }
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
    async handleChangeUserType(type) {
      this.user_type = type;
      if (this.user_type == 1) {
        if (!this.log_type_array.length) {
          var res = await enumList(103);
          if (!res.code) {
            this.log_type_array = res.data;
          }
        }
        this.type_array = this.log_type_array;
      } else {
        if (!this.user_log_type_array.length) {
          var res = await enumList(108);
          if (!res.code) {
            this.user_log_type_array = res.data;
          }
        }
        this.type_array = this.user_log_type_array;
      }
      this.filter.log_type = "";
      this.getList(true);
    },
    async getList(isReset = false) {
      if (isReset) {
        this.filter.page_index = 1;
      }
      this.loading = true;

      this.filter.is_belong_admin_user = this.user_type == 1 ? 1 : 2;

      var res = await (this.user_type == 1
        ? list(this.filter)
        : list(this.filter));
      this.loading = false;
      if (!res.code) {
        this.data = res.data;
        this.filter.total = res.count;
      } else {
        notice.showError(this, res.message);
      }
    }
  }
};
</script>