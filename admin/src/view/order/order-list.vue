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
            clearable
            v-model="viewfilter.keyword"
            placeholder="关键字"
            @keyup.enter.native="getList(true)"
          ></Input>
        </FormItem>

        <FormItem>
          <Select v-model="viewfilter.status_id" style="width:110px;" placeholder="请选择状态" clearable>
            <Option
              v-for="(option, index) in statusList"
              :value="option.value"
              :key="index"
            >{{option.label}}</Option>
          </Select>
        </FormItem>
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
    <Modal v-model="modal" draggable scrollable title="开票信息">
      <Form :model="invoiceinfo" :label-width="120">
        <FormItem label="公司全称:">{{invoiceinfo.invoice_title}}</FormItem>
      </Form>
      <Form :model="invoiceinfo" :label-width="120">
        <FormItem label="税号:">{{invoiceinfo.invoice_no}}</FormItem>
      </Form>
      <Form :model="invoiceinfo" :label-width="120">
        <FormItem label="开户行和账号:">{{invoiceinfo.bank_name}}{{invoiceinfo.bank_no}}</FormItem>
      </Form>
      <Form :model="invoiceinfo" :label-width="120">
        <FormItem label="地址和电话:">{{invoiceinfo.address}}{{invoiceinfo.tel}}</FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { notice, deepCopy } from "@/libs/util";
import { getpage, invoice } from "@/api/order";
export default {
  name: "order-list",
  data() {
    return {
      loading: false,
      formLoading: false,
      modal: false,
      rules: {},
      invoiceinfo: {},
      imgs: [],
      editPriceData: {
        total_amount: 0,
        order_id: 0
      },
      fieldList: [
        {
          value: 1,
          label: "订单编号"
        },
        {
          value: 2,
          label: "公司全称"
        },
        {
          value: 3,
          label: "联系人"
        },
        {
          value: 4,
          label: "电话"
        }
      ],
      timeFiledList: [
        {
          value: 1,
          label: "创建日期"
        }
      ],

      statusList: [
        {
          value: 1,
          label: "待付款"
        },
        {
          value: 2,
          label: "已付款"
        },
        {
          value: 3,
          label: "已取消"
        }
      ],
      // 分组信息
      viewcolumns: [
        {
          title: "订单编号",
          align: "center",
          key: "order_id",
          width: 120
        },
        {
          title: "公司全称",
          align: "center",
          key: "company_name",
          tooltip: true,
          width: 200
        },
        {
          title: "联系人",
          align: "center",
          key: "full_name",
          tooltip: true,
          width: 100
        },
        {
          title: "电话",
          align: "center",
          key: "mobile",
          tooltip: true,
          width: 150
        },
        {
          title: "总额",
          align: "center",
          key: "total_amount",
          tooltip: true,
          width: 65
        },
        {
          title: "支付",
          key: "payment_amount",
          align: "center",
          width: 65
        },
        {
          title: "状态",
          key: "status_id",
          align: "center",
          tooltip: true,
          width: 80,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color:
                    params.row.status_id === 1
                      ? "red"
                      : params.row.status_id === 2
                      ? "orange"
                      : params.row.status_id === 99
                      ? "blue"
                      : params.row.status_id === 92
                      ? "blue"
                      : "purple"
                }
              },
              params.row.status_id === 1
                ? "待付款"
                : params.row.status_id === 2
                ? "已付款"
                : params.row.status_id === 99
                ? "已取消"
                : params.row.status_id === 92
                ? "已完成"
                : ""
            );
          }
        },
        {
          title: "微信订单号",
          align: "center",
          key: "transaction_id",
          width: 250
        },
        {
          title: "创建日期",
          align: "center",
          key: "create_time",
          width: 200
        },
        {
          title: "支付时间",
          align: "center",
          key: "pay_time",
          width: 200
        },
        {
          title: "操作",
          align: "center",
          render: (h, params) => {
            var btns = [];
            if (params.row.invoice_id!=null&&params.row.status_id === 2) {
              btns.push(
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: async () => {
                        var res = await invoice(params.row.order_id);
                        if (!res.code) {
                          if (res.data == null) {
                            notice.showSuccess(this, "无需开发票");
                          } else {
                            this.modal = true;
                            this.invoiceinfo = res.data;
                          }
                        }
                      }
                    }
                  },
                  "开票信息"
                )
              );
            }
            return h("div", btns);
          }
        }
      ],
      viewdata: [],
      viewfilter: {
        keyword: "",
        user_type: "",
        order_field: 1,
        field: 1,
        order_class: 1,
        order_type: 0,
        status_id: 0,
        time_field: 1,
        begin_date: 0,
        end_date: 0,
        total: 0
      },
      enabledata: {
        userid: 0
      },
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
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    changeDateRange(date) {
      this.viewfilter.begin_date = date[0] ? date[0].replace(/\-/g, "") : 0;
      this.viewfilter.end_date = date[1] ? date[1].replace(/\-/g, "") : 0;
    },
    getList(isRefresh = false) {
      if (isRefresh) {
        this.$refs.pageTable.reload();
      } else {
        this.$refs.pageTable.loadingList(getpage);
      }
    },
    async setenable() {
      var res = await setenable(this.enabledata);
      if (!res.code) {
        notice.showSuccess(this, "操作成功");
        this.getList();
        this.init(name);
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
    editOk() {
      notice.showSuccess(this, "新增成功");
    },
    editCancel() {
      notice.showSuccess(this, "新增成功");
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
