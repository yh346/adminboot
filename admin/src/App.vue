<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
.ivu-menu li div:hover {
  background-color: #0a8792 !important;
}
.ivu-menu li:hover {
  background-color: #00bccc !important;
}
.ivu-menu li {
  // color: white !important;

  background-color: #0a8792 !important;
}
.ivu-menu {
  color: white !important;
  background-color: #0a8792 !important;
}
.ivu-layout-sider {
  color: white !important;
  background-color: #0a8792 !important;
}


.size {
  width: 100%;
  height: 100%;
}

html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#app {
  .size;
}
</style>
