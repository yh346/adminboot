<template>
  <div style="display:inline-block;vertical-align:top;">
    <Upload
      :action="`${url}upload/admin_image?token=${token}`"
      :show-upload-list="false"
      :format="['jpg','jpeg','png']"
      :max-size="maxSize"
      :on-success="handleSuccess"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-progress="handleProgress"
      type="drag"
      paste
      v-if="!image_src"
      :style="{display:'inline-block',width:`${width-2}px`}"
    >
      <div :style="{width:`${width-2}px`,height:`${height-2}px`,lineHeight:`${height-2}px`}">
        <icon v-if="!item.showProgress" type="ios-camera" :size="width/3"></icon>
        <i-progress v-else :percent="item.percentage" hide-info></i-progress>
      </div>
    </Upload>
    <div
      class="upload-list"
      :style="{width:`${width}px`,height:`${height}px`,lineHeight:`${height}px`}"
      v-else
    >
      <img :src="image_src_url">
      <div class="upload-list-cover">
        <Icon type="ios-eye-outline" title="点击查看原图" :size="width/4" @click.native="visible=true"></Icon>
        <Icon type="ios-trash-outline" title="点击删除图片" :size="width/4" @click.native="handleDel"></Icon>
      </div>
    </div>
    <div class="item-error-tip" v-if="required && !image_src">{{message}}</div>
    <modal title="图片原图" v-model="visible">
      <img :src="image_src_url" v-if="visible" style="width:100%;">
    </modal>
  </div>
</template>

<script>
import config from "@/config";
import { notice, getToken } from "@/libs/util";
export default {
  name: "singleUpload",
  props: {
    maxSize: {
      type: Number,
      default: 20 * 1024
    },
    width: {
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 120
    },
    src: {
      type: String,
      default: ""
    },
    img_url: {
      type: String,
      default: ""
    },
    required: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: "请上传图片"
    }
  },
  watch: {
    src(val) {
      this.image_src = val;
    },
    img_url(val) {
      this.image_src_url = val;
    }
  },
  data() {
    return {
      url:
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro,
      visible: false,
      token: getToken(),
      item: {
        status: "",
        showProgress: false,
        percentage: 0
      },
      image_src: this.src,
      image_src_url: this.img_url
    };
  },
  methods: {
    handleMaxSize() {
      notice.showError(this, `图片大小不得超过 ${this.maxSize / 1024}M`);
    },
    handleFormatError() {
      notice.showError(this, "文件必须是 jpg 或 png 格式的图片");
    },
    handleProgress(event, file, fileList) {
      if (!this.item.showProgress) {
        this.item.percentage = 0;
        this.item.showProgress = true;
      }
      this.item.percentage = parseInt(event.percent);
    },
    handleSuccess(res, file) {
      this.item.showProgress = false;
      this.item.status = "finished";
      if (!res.code) {
        this.image_src = res.data;
        this.$emit("on-success", this.image_src);
      } else {
        notice.showError(this, res.message);
      }
    },
    handleDel() {
      this.item = {
        status: "",
        showProgress: false,
        percentage: 0
      };
      this.image_src = "";
      this.image_src_url = "";
      this.$emit("on-success", "");
    }
  }
};
</script>

<style lang="less" scoped>
.item-error-tip {
  color: #ed4014;
  font-size: 12px;
  padding-top: 6px;
  box-sizing: border-box;
}
.upload-list {
  display: inline-block;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  border: 1px solid #dcdee2;
  margin-right: 4px;
}
.upload-list img {
  width: 100%;
  height: 100%;
}
.upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.upload-list:hover .upload-list-cover {
  display: block;
}
.upload-list-cover i {
  color: #fff;
  cursor: pointer;
  margin: 0 2px;
}
</style>
