<template>
  <div class="split">
    <Split v-model="split">
      <div slot="left" class="split-pane">
        <Tree :data="group_data" :render="renderGroup"></Tree>
      </div>
      <div slot="right" class="split-pane">
        <Tree :data="right_data" :load-data="handleGetChildren" :render="renderRight"></Tree>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </div>
    </Split>
    <Modal
      v-model="addGroupModal"
      :mask-closable="false"
      :loading="formLoading"
      :closable="false"
      :title="rightGroup.group_id>0?'编辑权限组':'新增权限组'"
      @on-ok="handleAddGroup('addGroupForm')"
      @on-cancel="handleCancelAddGroup('addGroupForm')"
    >
      <Form ref="addGroupForm" :model="rightGroup" :label-width="100" :rules="rightGroupRules">
        <Row>
          <Col span="12">
            <FormItem label="权限组名称" prop="group_name" label-for="group_name">
              <Input
                autofocus
                element-id="group_name"
                v-model="rightGroup.group_name"
                placeholder="权限组名称"
              ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="图标" label-for="icon">
              <Input autofocus element-id="icon" v-model="rightGroup.icon" placeholder="图标"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="组路径" prop="path" label-for="path">
              <Input autofocus element-id="path" v-model="rightGroup.path" placeholder="组路径"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="路由名称" prop="router_name" label-for="router_name">
              <Input
                autofocus
                element-id="router_name"
                v-model="rightGroup.router_name"
                placeholder="路由名称"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="是否正常">
              <i-switch v-model="rightGroup.is_ok" size="large">
                <span slot="open">正常</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="排序" label-for="sort">
              <InputNumber element-id="sort" :min="0" v-model="rightGroup.sort"></InputNumber>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <Drawer
      v-model="addRightModal"
      :mask-closable="false"
      scrollable
      :title="right.right_id>0?'编辑权限':'新增权限'"
      :width="720"
      :styles="{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: '53px', position: 'static'}"
      @on-close="handleCancelAddRight('addRightForm')"
    >
      <Form ref="addRightForm" :model="right" :label-width="100" :rules="rightRules">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="权限名称" prop="right_name" label-for="right_name">
              <Input
                autofocus
                element-id="right_name"
                v-model="right.right_name"
                placeholder="权限名称"
              ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="权限图标" label-for="icon">
              <Input element-id="icon" v-model="right.icon" placeholder="权限图标"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="是否菜单权限">
              <i-switch v-model="right.is_menu" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="请求方式" prop="method">
              <Select v-model="right.method" placeholder="请选择请求方式">
                <Option :value="1">GET</Option>
                <Option :value="2">POST</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="权限Url" prop="url_path" label-for="url_path">
              <Input element-id="url_path" v-model="right.url_path" placeholder="权限Url"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              v-show="right.is_menu"
              label="路由器名"
              label-for="router_name"
              prop="router_name"
              :class="{'ivu-form-item-required':right.is_menu}"
            >
              <Input element-id="router_name" v-model="right.router_name" placeholder="路由器名"></Input>
            </FormItem>
            <FormItem
              v-show="!right.is_menu"
              label="控制器名"
              prop="controller"
              :class="{'ivu-form-item-required':!right.is_menu}"
            >
              <Select
                v-model="right.controller"
                placeholder="控制器名"
                clearable
                @on-change="changeController"
                @on-clear="clearController"
              >
                <Option v-for="item in controller_array" :value="item" :key="item">{{item}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem
              v-show="right.is_menu"
              label="组件路径"
              label-for="component_path"
              prop="component_path"
              :class="{'ivu-form-item-required':right.is_menu}"
            >
              <Input element-id="component_path" v-model="right.component_path" placeholder="组件路径"></Input>
            </FormItem>
            <FormItem
              v-show="!right.is_menu"
              label="方法名称"
              prop="action"
              :class="{'ivu-form-item-required':!right.is_menu}"
            >
              <Select v-model="right.action" placeholder="方法名称" clearable>
                <Option v-for="item in action_array" :value="item" :key="item">{{item}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="是否付费">
              <i-switch v-model="right.is_paid" size="large">
                <span slot="open">付费</span>
                <span slot="close">免费</span>
              </i-switch>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="排序" label-for="sort">
              <InputNumber element-id="sort" :min="0" v-model="right.sort"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="备注" label-for="remark">
              <Input
                element-id="remark"
                v-model="right.remark"
                :autosize="{minRows:4,maxRows:6}"
                placeholder="备注"
                type="textarea"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="handleCancelAddRight('addRightForm')">取消</Button>
        <Button type="primary" @click="handleAddRight('addRightForm')" :loading="loading_save">确定</Button>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Drawer>
  </div>
</template>
<script>
import {
  groups,
  addGroup,
  updateGroup,
  deleteGroup,
  disabledGroup,
  getGroup,
  list,
  _delete,
  _children,
  add,
  update,
  controllers,
  actions,
  getRight
} from "@/api/admin-right";
import { notice, deepCopy } from "@/libs/util";
export default {
  name: "right",
  data() {
    return {
      split: 0.5,
      group_data: [
        {
          title: "权限组管理",
          expand: true,
          render: (h, { root, node, data }) => {
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%"
                }
              },
              [
                h("span", data.title),
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      float: "right",
                      marginRight: "32px"
                    }
                  },
                  [
                    h(
                      "Button",
                      {
                        props: {
                          type: "primary",
                          size: "small"
                        },
                        style: {
                          width: "64px"
                        },
                        on: {
                          click: () => {
                            this.addGroupModal = true;
                            this.groupNode = data;
                          }
                        }
                      },
                      "新增组"
                    )
                  ]
                )
              ]
            );
          },
          children: []
        }
      ],
      right_data: [
        {
          title: "权限管理",
          expand: true,
          render: (h, { root, node, data }) => {
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%"
                }
              },
              [
                h("span", data.title),
                data.title === "权限管理"
                  ? null
                  : h(
                      "span",
                      {
                        style: {
                          display: "inline-block",
                          float: "right",
                          marginRight: "32px"
                        }
                      },
                      [
                        h(
                          "Button",
                          {
                            props: {
                              type: "primary",
                              size: "small"
                            },
                            style: {
                              width: "64px"
                            },
                            on: {
                              click: () => {
                                this.addRightModal = true;
                                this.rightNode = data;
                                this.right.group_id = this.groupNode.group_id;
                              }
                            }
                          },
                          "新增权限"
                        )
                      ]
                    )
              ]
            );
          },
          children: []
        }
      ],
      addGroupModal: false,
      formLoading: false,
      rightGroup: {
        sort: 0,
        is_ok: false
      },
      rightGroupRules: {
        group_name: [
          {
            required: true,
            message: "请输入权限组名称",
            trigger: "blur"
          }
        ],
        path: [
          {
            required: true,
            message: "请输入组目录",
            trigger: "blur"
          }
        ],
        router_name: [
          {
            required: true,
            message: "请输入路由名称",
            trigger: "blur"
          }
        ]
      },
      groupNode: null,
      spinShow: false,
      loading_save: false,
      addRightModal: false,
      right: {
        sort: 0,
        is_menu: true,
        method: 1
      },
      rightRules: {
        right_name: [
          {
            required: true,
            message: "请输入权限名称",
            trigger: "blur"
          }
        ],
        url_path: [
          {
            required: true,
            message: "请输入权限Url",
            trigger: "blur"
          }
        ],
        controller: [
          {
            validator: (rule, value, callback) => {
              if (!this.right.is_menu && !value) {
                callback(new Error("请输入控制器名"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        action: [
          {
            validator: (rule, value, callback) => {
              if (!this.right.is_menu && !value) {
                callback(new Error("请输入方法名称"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        router_name: [
          {
            validator: (rule, value, callback) => {
              if (this.right.is_menu && !value) {
                callback(new Error("请输入路由器名"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        component_path: [
          {
            validator: (rule, value, callback) => {
              if (this.right.is_menu && !value) {
                callback(new Error("请输入组件路径"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      controller_array: [],
      action_array: [],
      rightNode: null
    };
  },
  mounted() {
    notice.init(this, 100);
    this.getGroups();
    this.getControllers();
  },
  methods: {
    renderGroup(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: data.icon
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title)
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.groupNode = data;
                      this.spinShow = true;
                      list(data.group_id).then(res => {
                        this.spinShow = false;
                        this.right_data[0].title = data.title;
                        this.right_data[0].children = res.data.map(p => {
                          return {
                            title: p.right_name,
                            icon: p.icon,
                            right_id: p.right_id,
                            parent_id: p.parent_id,
                            loading: false,
                            children: []
                          };
                        });
                      });
                    }
                  }
                },
                "权限列表"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.addGroupModal = true;
                      this.groupNode = data;
                      getGroup(data.group_id).then(res => {
                        if (!res.code) {
                          this.rightGroup = res.data;
                          this.rightGroup.is_ok = !this.rightGroup.is_disabled;
                        } else {
                          notice.showError(this, res.message);
                        }
                      });
                    }
                  }
                },
                "编辑组"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除这条数据吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": async () => {
                      this.$set(data, "deleting", true);
                      var res = await deleteGroup(data.group_id);
                      this.$set(data, "deleting", false);
                      if (!res.code) {
                        const parentKey = root.find(el => el === node).parent;
                        const parent = root.find(el => el.nodeKey === parentKey)
                          .node;
                        const index = parent.children.indexOf(data);
                        parent.children.splice(index, 1);
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
                        type: "error",
                        size: "small",
                        loading: data.deleting
                      },
                      style: {
                        marginRight: "8px"
                      }
                    },
                    "删除组"
                  )
                ]
              ),
              h(
                "Button",
                {
                  props: {
                    type: data.is_disabled ? "success" : "warning",
                    size: "small",
                    loading: data.setting
                  },
                  on: {
                    click: async () => {
                      this.$set(data, "setting", true);
                      var res = await disabledGroup(data.group_id);
                      this.$set(data, "setting", false);
                      if (!res.code) {
                        this.$set(data, "is_disabled", !data.is_disabled);
                        notice.showSuccess(
                          this,
                          (!data.is_disabled ? "启用" : "禁用") + "成功"
                        );
                      } else {
                        notice.showError(this, res.message);
                      }
                    }
                  }
                },
                data.is_disabled ? "启用组" : "禁用组"
              )
            ]
          )
        ]
      );
    },
    renderRight(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: data.icon
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title)
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              data.parent_id > 0
                ? null
                : h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "8px"
                      },
                      on: {
                        click: () => {
                          this.addRightModal = true;
                          this.rightNode = data;
                          this.right.parent_id = data.right_id;
                          this.right.group_id = this.groupNode.group_id;
                        }
                      }
                    },
                    "新增权限"
                  ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.addRightModal = true;
                      this.spinShow = true;
                      this.rightNode = data;
                      getRight(data.right_id).then(res => {
                        this.spinShow = false;
                        if (!res.code) {
                          this.right = res.data;
                          if (!this.right.is_menu) {
                            actions(this.right.controller).then(res => {
                              if (!res.code) {
                                this.action_array = res.data;
                              }
                            });
                          }
                        } else {
                          notice.showError(this, res.message);
                        }
                      });
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "您确定要删除这条数据吗?",
                    transfer: true
                  },
                  on: {
                    "on-ok": async () => {
                      this.$set(data, "deleting", true);
                      var res = await _delete(data.right_id);
                      this.$set(data, "deleting", false);
                      if (!res.code) {
                        const parentKey = root.find(el => el === node).parent;
                        const parent = root.find(el => el.nodeKey === parentKey)
                          .node;
                        const index = parent.children.indexOf(data);
                        parent.children.splice(index, 1);
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
                        type: "error",
                        size: "small",
                        loading: data.deleting
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]
          )
        ]
      );
    },
    getGroups() {
      groups().then(res => {
        if (!res.code) {
          var children = res.data.map(p => {
            return {
              title: p.group_name,
              icon: p.icon,
              group_id: p.group_id,
              is_disabled: p.is_disabled
            };
          });
          this.group_data[0].children.push(...children);
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleGetChildren(item, callback) {
      _children(item.right_id).then(res => {
        if (!res.code) {
          var data = res.data.map(p => {
            return {
              title: p.right_name,
              right_id: p.right_id,
              parent_id: p.parent_id,
              loading: false,
              children: []
            };
          });
          callback(data);
          if (!data.length) {
            delete item.loading;
            delete item.children;
            this.$Message.info("无子权限哦");
          }
        } else {
          notice.showError(this, res.message);
        }
      });
    },
    handleAddGroup(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.rightGroup.is_disabled = !this.rightGroup.is_ok;
          var isUpdate = this.rightGroup.group_id > 0;
          var res = await (isUpdate
            ? updateGroup(this.rightGroup)
            : addGroup(this.rightGroup));
          if (!res.code) {
            this.addGroupModal = false;
            if (!isUpdate) {
              const children = this.groupNode.children || [];
              children.push({
                title: res.data.group_name,
                icon: res.data.icon,
                group_id: res.data.group_id,
                is_disabled: res.data.is_disabled
              });
              this.$set(this.groupNode, "children", children);
              notice.showSuccess(this, "新增成功");
            } else {
              this.$set(this.groupNode, "title", res.data.group_name);
              this.$set(this.groupNode, "icon", res.data.icon);
              this.$set(this.groupNode, "is_disabled", res.data.is_disabled);
              notice.showSuccess(this, "编辑成功");
            }
          } else {
            notice.showError(this, res.message);
          }
          this.handleCancelAddGroup(name);
        }
        this.formLoading = false;
        this.$nextTick(() => {
          this.formLoading = true;
        });
      });
    },
    handleCancelAddGroup(name) {
      this.rightGroup = {
        sort: 0,
        is_ok: false
      };
      this.$refs[name].resetFields();
    },
    getControllers() {
      controllers().then(res => {
        if (!res.code) {
          this.controller_array = res.data;
        }
      });
    },
    getActions() {
      this.action_array = [];
      this.right.action = "";
      if (this.right.controller) {
        actions(this.right.controller).then(res => {
          if (!res.code) {
            this.action_array = res.data;
          }
        });
      }
    },
    changeController(controller) {
      this.right.controller = controller;
      this.getActions();
    },
    clearController() {
      this.right.controller = "";
      this.getActions();
    },
    handleCancelAddRight(name) {
      this.addRightModal = false;
      this.right = {
        sort: 0,
        is_menu: true,
        method: 1
      };
      this.$refs[name].resetFields();
    },
    handleAddRight(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.loading_save = true;
          var isUpdate = this.right.right_id > 0;
          var res = await (isUpdate ? update(this.right) : add(this.right));
          this.loading_save = false;
          if (!res.code) {
            this.addRightModal = false;
            if (!isUpdate) {
              const children = this.rightNode.children || [];
              children.push({
                title: res.data.right_name,
                icon: res.data.icon,
                right_id: res.data.right_id,
                parent_id: res.data.parent_id
              });
              this.$set(this.rightNode, "children", children);
              notice.showSuccess(this, "新增成功");
            } else {
              this.$set(this.rightNode, "title", res.data.right_name);
              this.$set(this.rightNode, "icon", res.data.icon);
              notice.showSuccess(this, "编辑成功");
            }
            this.handleCancelAddRight(name);
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
.split {
  border: 1px solid #dcdee2;
  height: 100%;
  .split-pane {
    padding: 10px;
  }
}
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
