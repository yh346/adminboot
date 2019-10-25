<template>
  <div>
    <Form inline @submit.native.prevent>
      <slot name="search"></slot>
      <FormItem>
        <Date-picker
          v-if="showDate"
          type="daterange"
          confirm
          placement="bottom-start"
          placeholder="日期"
          :options="options"
          @on-change="changeDateRange"
          style="width:182px;"
        ></Date-picker>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          shape="circle"
          icon="ios-search"
          style="margin-right:15px;"
          @click="getList(true)"
        >筛选</Button>
        <slot name="add-btn"></slot>
      </FormItem>
    </Form>
    <div v-if="$slots.action" class="btn-wrap">
      <slot name="action"></slot>
    </div>
    <Table
      border
      stripe
      :columns="columns"
      :data="data"
      :loading="loading"
      @on-selection-change="onSelectionChange"
    ></Table>
    <div v-if="data_filter.total>0" style="margin: 10px;overflow: hidden;">
      <div style="float: right;">
        <Page
          :total="data_filter.total"
          :current="data_filter.page_index"
          @on-change="changePage"
          @on-page-size-change="changeSize"
          show-total
          :page-size="data_filter.page_size"
          placement="top"
          show-sizer
          transfer
        ></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { notice } from "@/libs/util";
export default {
  name: "pageTable",
  props: {
    filter: {
      type: Object,
      default() {
        return {
          page_index: 1,
          page_size: 10,
          total: 0
        };
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    showDate: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    filter: {
      handler(newName, oldName) {
        Object.assign(this.data_filter, newName);
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      loading: false,
      data_filter: {
        page_index: 1,
        page_size: 10,
        total: 0
      },
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
      api: null
    };
  },
  methods: {
    onSelectionChange(selection) {
      this.$emit("on-selection-change", selection);
    },
    changePage(page) {
      this.data_filter.page_index = page;
      this.getList();
    },
    changeSize(size) {
      this.data_filter.page_size = size;
      this.getList();
    },
    changeDateRange(date) {
      this.filter.begin_date = date[0] ? date[0].replace(/\-/g, "") : 0;
      this.filter.end_date = date[1] ? date[1].replace(/\-/g, "") : 0;
    },
    loadingList(api) {
      if (!api) {
        console.error("缺少参数:api");
        return;
      }
      if (!this.api) {
        this.api = api;
      }
      this.getList();
    },
    getList(isResetFilter = false) {
      if (isResetFilter) {
        this.data_filter.page_index = 1;
      }
      this.loading = true;
      this.api(this.data_filter).then(res => {
        this.loading = false;
        if (!res.code) {
          this.data = res.data;
          this.data_filter.total = res.count;
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    reload() {
      this.getList(false);
    }
  }
};
</script>

<style lang="less" scoped>
.btn-wrap {
  margin-bottom: 10px;
  button {
    margin-right: 10px;
  }
}
</style>
