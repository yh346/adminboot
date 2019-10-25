<template>
  <div>
    <page-table ref="pageTable" show-date :filter="filter" :columns="columns">
      <template slot="search">
        <FormItem>
          <Select v-model="filter.field" style="width:90px;">
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
            v-model="filter.keyword"
            placeholder="关键词"
            clearable
            @keyup.enter.native="getList(true)"
          ></Input>
        </FormItem>
        <FormItem>
          <!-- <Select v-model="filter.operation_id" clearable placeholder="操作明细" style="width:100px;">
            <Option
              v-for="(option, index) in operation_array"
              :value="option.operation_id"
              :key="index"
            >{{option.operation_name}}</Option>
          </Select> -->
        </FormItem>
      </template>
    </page-table>
  </div>
</template>

<script>
import { logList, operationTypes, operationList } from "@/api/wealth";
import { notice } from "@/libs/util";
export default {
  name: "wealthLog",
  data() {
    return {
      fieldList: [
        {
          value: 1,
          label: "钱包帐号"
        },
        {
          value: 3,
          label: "关联单号"
        }
      ],
      operation_type_array: [],
      operation_array: [],
      columns: [
        {
          title: "流水编号",
          width: 90,
          key: "log_id",
          align: "center"
        },
        {
          title: "钱包帐号",
          key: "user_id",
          width: 100,
          align: "center"
        },
        {
          title: "用户名称",
          key: "nick_name",
          width: 100,
          align: "center",
          tooltip:true
        },
        {
          title: "流水金额",
          key: "wealth",
          width: 130,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: params.row.wealth > 0 ? "#19be6b" : "#ed4014"
                }
              },
              `${params.row.wealth > 0 ? "+" : ""}${params.row.wealth.toFixed(
                2
              )}`
            );
          }
        },
        {
          title: "账户余额",
          width: 130,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  fontSize: "14px"
                }
              },
              this.formatMoney(params.row.balance, 2)
            );
          }
        },
        {
          title: "交易类型",
          width: 120,
          key: "operation_name",
          align: "center"
        },
        {
          title: "关联单号",
          key: "link_no",
          width: 110,
          align: "center"
        },
        {
          title: "流水时间",
          key: "log_time_string",
          width: 152,
          align: "center"
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 300,
          tooltip: true
        }
      ],
      filter: {
        field: 1,
        keyword: "",
        operation_type_id: "",
        operation_id: "",
        begin_date: 0,
        end_date: 0
      }
    };
  },
  mounted() {
    notice.init(this);
    //this.getOperationTypes();
    this.getOperationList();
    this.getList();
  },
  methods: {
    getOperationTypes() {
      operationTypes().then(res => {
        if (!res.code) {
          this.operation_type_array = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    getOperationList() {
      operationList().then(res => {
        if (!res.code) {
          this.operation_array = res.data;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    formatMoney(s, n) {
      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
      var l = s
          .split(".")[0]
          .split("")
          .reverse(),
        r = s.split(".")[1];
      var t = "";
      for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
      }
      return (
        t
          .split("")
          .reverse()
          .join("") +
        "." +
        r
      );
    },
    getList(isRefresh = false) {
      if (isRefresh) {
        this.$refs.pageTable.reload();
      } else {
        this.$refs.pageTable.loadingList(logList);
      }
    }
  }
};
</script>
