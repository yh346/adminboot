<template>
  <div>
    <Row :gutter="8">
      <Col :span="showAddress?6:showArea?8:showCity?12:24">
        <Table
          ref="tbProvince"
          border
          stripe
          :height="tableHeight"
          :row-class-name="rowClassName"
          :columns="pColumns"
          :data="provinces"
          highlight-row
          :loading="loadingPrince"
          @on-row-dblclick="changeProvince"
        ></Table>
      </Col>
      <Col :span="showAddress?6:showArea?8:12" v-if="showCity">
        <Table
          border
          stripe
          :height="tableHeight"
          :row-class-name="rowClassName"
          :columns="cColumns"
          :data="cities"
          highlight-row
          :loading="loadingCity"
          @on-row-dblclick="changeCity"
        ></Table>
      </Col>
      <Col :span="showAddress?6:8" v-if="showArea">
        <Table
          border
          stripe
          :height="tableHeight"
          :row-class-name="rowClassName"
          :columns="aColumns"
          :data="areas"
          highlight-row
          :loading="loadingArea"
          @on-row-dblclick="changeArea"
        ></Table>
      </Col>
      <Col span="6" v-if="showAddress">
        <Table
          border
          stripe
          :height="tableHeight"
          :row-class-name="rowClassName"
          :columns="dColumns"
          :data="addresss"
          highlight-row
          :loading="laodingAddress"
        ></Table>
      </Col>
    </Row>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Modal
      v-model="addModal"
      :mask-closable="false"
      :loading="formLoading"
      :closable="false"
      :title="region.region_id>0?'编辑地区':'新增地区'"
      @on-ok="add('addForm')"
      @on-cancel="cancel('addForm')"
    >
      <Form ref="addForm" :model="region" :rules="rules" :label-width="90">
        <FormItem label="所属省份" v-if="region.type==1">{{region.parent_name}}({{region.parent_code}})</FormItem>
        <FormItem label="所属城市" v-if="region.type==2">{{region.parent_name}}({{region.parent_code}})</FormItem>
        <FormItem label="所属县区" v-if="region.type==3">{{region.parent_name}}({{region.parent_code}})</FormItem>
        <FormItem label="地区名称" prop="name">
          <Input type="text" ref="region_name" placeholder="地区名称" v-model="region.name"></Input>
        </FormItem>
        <FormItem label="地区代号" prop="code">
          <Input type="text" placeholder="地区代号" v-model="region.code"></Input>
        </FormItem>
        <FormItem label="是否显示">
          <i-switch v-model="region.is_show" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="显示排序">
          <InputNumber v-model="region.sort"></InputNumber>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { province, children, add, update, del } from "@/api/region";
import { notice, deepCopy } from "@/libs/util";
export default {
  name: "region",
  data() {
    return {
      loadingPrince: false,
      loadingCity: false,
      loadingArea: false,
      laodingAddress: false,
      showCity: false,
      showArea: false,
      showAddress: false,
      tableHeight: 450,
      pColumns: [
        {
          title: "省份",
          key: "name",
          width: 80,
          tooltip: true
        },
        {
          title: "代号",
          key: "code",
          width: 80
        },
        {
          title: "操作",
          minWidth: 65,
          render: (h, params) => {
            return h(
              "Dropdown",
              {
                props: {
                  transfer: true,
                  trigger: "click"
                },
                on: {
                  "on-click": name => {
                    switch (name) {
                      case "edit":
                        this.region = deepCopy(params.row);
                        this.region.type = 0;
                        this.addModal = true;
                        break;
                      case "add":
                        this.region.type = 1;
                        this.region.parent_name = params.row.name;
                        this.region.parent_code = params.row.code;
                        this.region.code = deepCopy(this.region.parent_code);
                        this.addModal = true;
                        this.$nextTick(() => {
                          this.$refs.region_name.focus();
                        });
                        break;
                      default:
                        break;
                    }
                  }
                }
              },
              [
                h(
                  "a",
                  {
                    attrs: {
                      href: "javascript:void(0)"
                    }
                  },
                  [
                    h("Icon", {
                      props: {
                        type: "ios-arrow-down"
                      }
                    })
                  ]
                ),
                h(
                  "DropdownMenu",
                  {
                    slot: "list"
                  },
                  [
                    { name: "edit", text: "编辑" },
                    { name: "add", text: "加城市" }
                  ].map(p =>
                    h(
                      "DropdownItem",
                      {
                        props: {
                          name: p.name
                        }
                      },
                      p.text
                    )
                  )
                )
              ]
            );
          }
        }
      ],
      provinces: [],
      cColumns: [
        {
          title: "城市",
          key: "name",
          width: 80,
          tooltip: true
        },
        {
          title: "代号",
          key: "code",
          width: 80
        },
        {
          title: "操作",
          minWidth: 65,
          render: (h, params) => {
            return h(
              "Dropdown",
              {
                props: {
                  transfer: true,
                  trigger: "click"
                },
                on: {
                  "on-click": name => {
                    switch (name) {
                      case "edit":
                        this.region = deepCopy(params.row);
                        this.region.type = 1;
                        this.region.parent_code = params.row.code.substring(
                          0,
                          params.row.code.length - 2
                        );
                        var index = this.provinces.findIndex(
                          p => p.code === this.region.parent_code
                        );
                        this.region.parent_name =
                          index > -1 ? this.provinces[index].name : "";
                        this.addModal = true;
                        break;
                      case "add":
                        this.region.type = 2;
                        this.region.parent_name = params.row.name;
                        this.region.parent_code = params.row.code;
                        this.region.code = deepCopy(this.region.parent_code);
                        this.addModal = true;
                        this.$nextTick(() => {
                          this.$refs.region_name.focus();
                        });
                        break;
                      case "del":
                        this.$Modal.confirm({
                          title: "温馨提示",
                          content: `<p>您真的要删除“${
                            params.row.name
                          }”吗？</p>`,
                          onOk: async () => {
                            this.spinShow = true;
                            var res = await del(params.row.region_id);
                            this.spinShow = false;
                            if (!res.code) {
                              this.cities.splice(params.index, 1);
                              notice.showSuccess(this, "删除成功");
                            } else {
                              notice.showError(this, res.message);
                            }
                          }
                        });
                        break;
                      default:
                        break;
                    }
                  }
                }
              },
              [
                h(
                  "a",
                  {
                    attrs: {
                      href: "javascript:void(0)"
                    }
                  },
                  [
                    h("Icon", {
                      props: {
                        type: "ios-arrow-down"
                      }
                    })
                  ]
                ),
                h(
                  "DropdownMenu",
                  {
                    slot: "list"
                  },
                  [
                    { name: "edit", text: "编辑" },
                    { name: "add", text: "加县区" },
                    { name: "del", text: "删除" }
                  ].map(p =>
                    h(
                      "DropdownItem",
                      {
                        props: {
                          name: p.name,
                          loading: true
                        }
                      },
                      p.text
                    )
                  )
                )
              ]
            );
          }
        }
      ],
      cities: [],
      aColumns: [
        {
          title: "县区",
          key: "name",
          width: 80,
          tooltip: true
        },
        {
          title: "代号",
          key: "code",
          width: 80
        },
        {
          title: "操作",
          minWidth: 190,
          render: (h, params) => {
            return h(
              "Dropdown",
              {
                props: {
                  transfer: true,
                  trigger: "click"
                },
                on: {
                  "on-click": name => {
                    switch (name) {
                      case "edit":
                        this.region = deepCopy(params.row);
                        this.region.type = 2;
                        this.region.parent_code = params.row.code.substring(
                          0,
                          params.row.code.length - 2
                        );
                        var index = this.cities.findIndex(
                          p => p.code === this.region.parent_code
                        );
                        this.region.parent_name =
                          index > -1 ? this.cities[index].name : "";
                        this.addModal = true;
                        break;
                      case "add":
                        this.region.type = 3;
                        this.region.parent_name = params.row.name;
                        this.region.parent_code = params.row.code;
                        this.region.code = deepCopy(this.region.parent_code);
                        this.addModal = true;
                        this.$nextTick(() => {
                          this.$refs.region_name.focus();
                        });
                        break;
                      case "del":
                        this.$Modal.confirm({
                          title: "温馨提示",
                          content: `<p>您真的要删除“${
                            params.row.name
                          }”吗？</p>`,
                          onOk: async () => {
                            this.spinShow = true;
                            var res = await del(params.row.region_id);
                            this.spinShow = false;
                            if (!res.code) {
                              this.areas.splice(params.index, 1);
                              notice.showSuccess(this, "删除成功");
                            } else {
                              notice.showError(this, res.message);
                            }
                          }
                        });
                        break;
                      default:
                        break;
                    }
                  }
                }
              },
              [
                h(
                  "a",
                  {
                    attrs: {
                      href: "javascript:void(0)"
                    }
                  },
                  [
                    h("Icon", {
                      props: {
                        type: "ios-arrow-down"
                      }
                    })
                  ]
                ),
                h(
                  "DropdownMenu",
                  {
                    slot: "list"
                  },
                  [
                    { name: "edit", text: "编辑" },
                    { name: "add", text: "加乡镇" },
                    { name: "del", text: "删除" }
                  ].map(p =>
                    h(
                      "DropdownItem",
                      {
                        props: {
                          name: p.name,
                          loading: true
                        }
                      },
                      p.text
                    )
                  )
                )
              ]
            );
          }
        }
      ],
      areas: [],
      dColumns: [
        {
          title: "乡镇街道",
          key: "name",
          width: 85,
          tooltip: true
        },
        {
          title: "代号",
          key: "code",
          width: 95
        },
        {
          title: "操作",
          minWidth: 130,
          render: (h, params) => {
            return h(
              "Dropdown",
              {
                props: {
                  transfer: true,
                  trigger: "click"
                },
                on: {
                  "on-click": name => {
                    switch (name) {
                      case "edit":
                        this.region = deepCopy(params.row);
                        this.region.type = 3;
                        this.region.parent_code = params.row.code.substring(
                          0,
                          params.row.code.length - 2
                        );
                        var index = this.areas.findIndex(
                          p => p.code === this.region.parent_code
                        );
                        this.region.parent_name =
                          index > -1 ? this.areas[index].name : "";
                        this.addModal = true;
                        break;
                      case "del":
                        this.$Modal.confirm({
                          title: "温馨提示",
                          content: `<p>您真的要删除“${
                            params.row.name
                          }”吗？</p>`,
                          onOk: async () => {
                            this.spinShow = true;
                            var res = await del(params.row.region_id);
                            this.spinShow = false;
                            if (!res.code) {
                              this.addresss.splice(params.index, 1);
                              notice.showSuccess(this, "删除成功");
                            } else {
                              notice.showError(this, res.message);
                            }
                          }
                        });
                        break;
                      default:
                        break;
                    }
                  }
                }
              },
              [
                h(
                  "a",
                  {
                    attrs: {
                      href: "javascript:void(0)"
                    }
                  },
                  [
                    h("Icon", {
                      props: {
                        type: "ios-arrow-down"
                      }
                    })
                  ]
                ),
                h(
                  "DropdownMenu",
                  {
                    slot: "list"
                  },
                  [
                    { name: "edit", text: "编辑" },
                    { name: "del", text: "删除" }
                  ].map(p =>
                    h(
                      "DropdownItem",
                      {
                        props: {
                          name: p.name,
                          loading: true
                        }
                      },
                      p.text
                    )
                  )
                )
              ]
            );
          }
        }
      ],
      addresss: [],
      addModal: false,
      formLoading: true,
      region: {
        type: 0,
        sort: 0,
        is_show: true,
        name: "",
        code: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入地区名称",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入地区代号",
            trigger: "blur"
          }
        ]
      },
      spinShow: false
    };
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.tbProvince.$el.offsetTop - 140;
    notice.init(this, 100);
    this.loadProvince();
  },
  methods: {
    rowClassName(row, index) {
      if (!row.is_show) {
        return "is-hide";
      }
      return "";
    },
    async loadProvince() {
      this.loadingPrince = true;
      var res = await province();
      if (!res.code) {
        this.loadingPrince = false;
        this.provinces = res.data;
      } else {
        notice.showError(res.message);
      }
    },
    async changeProvince(currentRow, oldCurrentRow) {
      this.showCity = true;
      this.showArea = false;
      this.showAddress = false;
      this.loadingCity = true;
      this.cities = [];
      this.areas = [];
      var res = await children(currentRow.code);
      if (!res.code) {
        this.loadingCity = false;
        this.cities = res.data;
      } else {
        notice.showError(res.message);
      }
    },
    async changeCity(currentRow, oldCurrentRow) {
      this.showArea = true;
      this.showAddress = false;
      this.loadingArea = true;
      this.areas = [];
      var res = await children(currentRow.code);
      if (!res.code) {
        this.loadingArea = false;
        this.areas = res.data;
      } else {
        notice.showError(res.message);
      }
    },
    async changeArea(currentRow, oldCurrentRow) {
      this.showAddress = true;
      this.laodingAddress = true;
      this.addresss = [];
      var res = await children(currentRow.code);
      if (!res.code) {
        this.laodingAddress = false;
        this.addresss = res.data;
      } else {
        notice.showError(res.message);
      }
    },
    init() {
      this.region = {
        type: 0,
        sort: 0,
        is_show: true,
        name: "",
        code: ""
      };
    },
    cancel(name) {
      this.init();
      this.$refs[name].resetFields();
    },
    add(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          var isUpdate = this.region.region_id > 0;
          var index = this.region._index;
          var res = await (isUpdate ? update(this.region) : add(this.region));
          if (!res.code) {
            this.addModal = false;
            if (!isUpdate) {
              if (this.region.type == 1) {
                this.cities.push(res.data);
              } else if (this.region.type == 2) {
                this.areas.push(res.data);
              } else {
                this.addresss.push(res.data);
              }
              notice.showSuccess(this, "新增成功");
            } else {
              this.$set(
                this.region.type == 0
                  ? this.provinces
                  : this.region.type == 1
                  ? this.cities
                  : this.region.type == 2
                  ? this.areas
                  : this.addresss,
                index,
                res.data
              );
              notice.showSuccess(this, "编辑成功");
            }
            this.init();
          } else {
            notice.showError(this, res.message);
          }
        }
        this.formLoading = false;
        this.$nextTick(() => {
          this.formLoading = true;
        });
      });
    }
  }
};
</script>
<style>
.ivu-table .is-hide td {
  background-color: #ed4014;
  color: #fff;
}
.ivu-table .is-hide:hover td {
  color: #515a6e;
}
</style>
