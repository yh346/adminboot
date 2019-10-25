<template>
  <div>
    <div
      class="multiple-upload-list"
      :style="{width:`${width}px`,height:`${height}px`,lineHeight:`${height}px`}"
      v-for="(item,index) in uploadList"
      :key="index"
    >
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="multiple-upload-list-cover">
          <Icon
            type="ios-eye-outline"
            title="点击查看原图"
            :size="width/4"
            @click.native="handleView(item.url)"
          ></Icon>
          <Icon
            type="ios-trash-outline"
            title="点击删除图片"
            :size="width/4"
            @click.native="handleDel(item)"
          ></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="tempUploadList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      paste
      type="drag"
      :action="`${url}upload/admin_image?token=${token}`"
      :style="{display:'inline-block',width:`${width-2}px`}"
    >
      <div :style="{width:`${width-2}px`,height:`${height-2}px`,lineHeight:`${height-2}px`}">
        <Icon type="ios-camera" :size="width/3"></Icon>
      </div>
    </Upload>
    <div class="item-error-tip" v-if="minNum && uploadList.length < minNum">请至少上传{{minNum}}张图片</div>
    <Modal title="查看原图" v-model="img.visible" ok-text="关闭窗口" cancel-text>
      <img :src="img.src" v-if="img.visible" style="width: 100%;">
    </Modal>
  </div>
</template>

<script>
import config from "@/config";
import { notice, getToken } from "@/libs/util";
export default {
  name: "multipleUpload",
  props: {
    maxSize: {
      type: Number,
      default: 2 * 1024
    },
    width: {
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 120
    },
    minNum: {
      type: Number,
      default: 0
    },
    maxNum: {
      type: Number,
      default: 0
    },
    defaultUploadList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    defaultUploadList: {
      handler(val) {
        this.tempUploadList = val;
        this.$nextTick(() => {
          this.uploadList = this.$refs.upload.fileList;
        });
      },
      immediate: true
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
  data() {
    return {
      url:
        process.env.NODE_ENV === "development"
          ? config.baseUrl.dev
          : config.baseUrl.pro,
      visible: false,
      token: getToken(),
      uploadList: this.defaultUploadList,
      img: {
        visible: false,
        src: ""
      },
      tempUploadList: []
    };
  },
  methods: {
    handleMaxSize() {
      notice.showError(this, `图片大小不得超过 ${this.maxSize / 1024}M`);
    },
    handleFormatError() {
      notice.showError(this, "文件必须是 jpg 或 png 格式的图片");
    },
    handleBeforeUpload() {
      const check =
        this.maxNum == 0 ||
        (this.maxNum > 0 && this.uploadList.length < this.maxNum);
      if (!check) {
        notice.showError(this, `您最多可上传${this.maxNum}张图片`);
      }
      return check;
    },
    handleSuccess(res, file) {
      if (!res.code) {
        for (var i in this.$refs.upload.fileList) {
          if (!this.$refs.upload.fileList[i].url) {
            this.$refs.upload.fileList[i].url = res.data;
            break;
          }
        }
        this.$emit("on-success", this.uploadList.map(p => p.url));
      } else {
        notice.showError(this, res.message);
      }
    },
    handleView(url) {
      this.img.src = url;
      this.img.visible = true;
    },
    handleDel(item) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(item), 1);
      this.$emit("on-success", this.uploadList.map(p => p.url));
    }
  }
};
</script>

<style lang="less" scoped>
.multiple-upload-list {
  display: inline-block;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  margin-right: 8px;
  border: 1px solid #dcdee2;
}
.multiple-upload-list img {
  width: 100%;
  height: 100%;
}
.multiple-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.multiple-upload-list:hover .multiple-upload-list-cover {
  display: block;
}
.multiple-upload-list-cover i {
  color: #fff;
  cursor: pointer;
  margin: 0 2px;
}
</style>
