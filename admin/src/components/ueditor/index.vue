<template>
  <vue-ueditor-wrap
    ref="ueditor"
    v-model="content"
    :destroy="false"
    :config="config"
    :style="{margin:margin?margin:'0'}"
  ></vue-ueditor-wrap>
</template>

<script>
import config from "@/config";
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  name: "UEditor",
  props: {
    margin: {
      type: String,
      default: ""
    },
    html: {
      type: String,
      default: ""
    },
    height: {
      type: Number,
      default: 500
    }
  },
  components: {
    VueUeditorWrap
  },
  watch: {
    html(val) {
      this.content = val;
    },
    content(val) {
      this.$emit("on-sync", val);
    }
  },
  data() {
    return {
      content: "",
      config: {
        toolbars: [
          [
            "fullscreen",
            "source",
            "paragraph",
            "pasteplain",
            "undo",
            "redo",
            "insertunorderedlist",
            "insertorderedlist",
            "bold",
            "italic",
            "underline",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "fontsize",
            "forecolor",
            "fontfamily",
            "indent",
            "rowspacingbottom",
            "rowspacingtop",
            "lineheight",
            "drafts",
            "backcolor",
            "insertimage",
            "map"
          ]
        ],
        serverUrl:
          (process.env.NODE_ENV === "development"
            ? config.baseUrl.dev
            : config.baseUrl.pro) + "ueditor/upload",
        UEDITOR_HOME_URL: "/assets/UEditor/",
        autoHeightEnabled: true,
        initialFrameHeight: this.height,
        initialFrameWidth: "100%",
        enableAutoSave: false
      }
    };
  }
};
</script>

<style>
</style>
