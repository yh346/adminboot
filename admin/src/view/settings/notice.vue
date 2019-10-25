<template>
  <div>
    <page-table
      ref="pageTable"
      show-date
      :filter="filter"
      :columns="columns"
      @on-selection-change="selectChange"
    >
      <template slot="search">
        <FormItem>
          <Input
            type="text"
            v-model="filter.keyword"
            placeholder="标题"
            clearable
            @keyup.enter.native="getList(true)"
            style="width:150px;"
          ></Input>
        </FormItem>
        <FormItem>
          <Select v-model="filter.status" placeholder="状态" clearable style="min-width:80px;">
            <Option
              v-for="(option, index) in status_array"
              :value="option.id"
              :key="index"
            >{{option.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="filter.time_field">
            <Option
              v-for="(option, index) in time_field_array"
              :value="option.id"
              :key="index"
            >{{option.name}}</Option>
          </Select>
        </FormItem>
      </template>
      <Button
        slot="add-btn"
        type="success"
        shape="circle"
        icon="ios-add-circle-outline"
        @click="addModal=true"
      >新增公告</Button>
      <template slot="action">
        <Button
          type="success"
          :disabled="publish_disabled"
          :loading="publish_loading"
          icon="md-wifi"
          @click="handlePublish"
        >发布</Button>
        <Poptip confirm title="您真的要删除勾选的数据吗？" @on-ok="handleDelete">
          <Button
            type="error"
            :disabled="delete_disabled"
            :loading="delete_loading"
            icon="md-trash"
          >删除</Button>
        </Poptip>
      </template>
    </page-table>
    <add-notice :value="addModal" @on-ok="handleAddOk" @on-cancel="handleAddCancel"></add-notice>
    <update-notice
      :value="updateModal"
      :notice-id="notice_id"
      @on-ok="handleUpdateOk"
      @on-cancel="handleUpdateCancel"
    ></update-notice>
  </div>
</template>

<script>
import { manage, del, publish, view } from "@/api/notice";
import { notice } from "@/libs/util";
import AddNotice from "./components/add-notice";
import UpdateNotice from "./components/update-notice";
export default {
  name: "notice",
  components: {
    AddNotice,
    UpdateNotice
  },
  data() {
    return {
      time_field_array: [
        {
          id: 1,
          name: "发布日期"
        },
        {
          id: 2,
          name: "添加日期"
        }
      ],
      status_array: [
        {
          id: 1,
          name: "已发布"
        },
        {
          id: 2,
          name: "待发布"
        }
      ],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "操作",
          width: 85,
          align: "center",
          render: (h, params) => {
            var btns = [];
            btns.push(
              h(
                "Button",
                {
                  props: { size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.notice_id = params.row.notice_id;
                      this.updateModal = true;
                    }
                  }
                },
                "编辑"
              )
            );
            return h("div", btns);
          }
        },
        {
          title: "编号",
          key: "notice_id",
          width: 70,
          align: "center"
        },
        {
          title: "标题",
          key: "title",
          minWidth: 300,
          tooltip: true
        },
        {
          title: "状态",
          width: 85,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.is_publish ? "#19be6b" : "#ed4014"
                }
              },
              params.row.is_publish ? "已发布" : "待发布"
            );
          }
        },
        {
          title: "添加时间",
          key: "create_time",
          width: 152
        },
        {
          title: "发布时间",
          key: "publish_time",
          width: 152
        }
      ],
      filter: {
        status: "",
        keyword: "",
        time_field: 1,
        begin_date: 0,
        end_date: 0
      },
      publish_loading: false,
      delete_loading: false,
      selecteds: [],
      addModal: false,
      updateModal: false,
      notice_id: 0
    };
  },
  mounted() {
    notice.init(this);
    this.getList();
  },
  computed: {
    publish_disabled() {
      return (
        !this.selecteds.length ||
        this.selecteds.findIndex(item => item.is_publish) > -1
      );
    },
    delete_disabled() {
      return !this.selecteds.length;
    }
  },
  methods: {
    getList(isRefresh = false) {
      if (isRefresh) {
        this.$refs.pageTable.reload();
      } else {
        this.$refs.pageTable.loadingList(manage);
      }
    },
    selectChange(rows) {
      this.selecteds = rows;
    },
    handlePublish() {
      this.publish_loading = true;
      var notice_id_array = this.selecteds.map(p => p.notice_id);
      publish(notice_id_array).then(res => {
        this.publish_loading = false;
        if (!res.code) {
          this.selecteds = [];
          notice.showSuccess(this, "发布成功");
          this.getList(true);
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleDelete() {
      this.delete_loading = true;
      var notice_id_array = this.selecteds.map(p => p.notice_id);
      del(notice_id_array).then(res => {
        this.delete_loading = false;
        if (!res.code) {
          this.selecteds = [];
          notice.showSuccess(this, "删除成功");
          this.getList(true);
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleAddOk() {
      this.addModal = false;
      notice.showSuccess(this, "新增成功");
      this.getList(true);
    },
    handleAddCancel() {
      this.addModal = false;
    },
    handleUpdateOk() {
      this.handleUpdateCancel();
      notice.showSuccess(this, "编辑成功");
      this.getList(true);
    },
    handleUpdateCancel() {
      this.notice_id = 0;
      this.updateModal = false;
    }
  }
};
</script>
