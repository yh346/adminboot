<template>
  <div>
    <Row :gutter="20">
      <i-col
        :xs="12"
        :md="8"
        :lg="4"
        v-for="(infor, i) in infoData"
        :key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <!-- <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="courseData" text="课程总量分布"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="orderData" text="近15天下单量统计"/>
        </Card>
      </i-col>
    </Row> -->
  </div>
</template>

<script>
// import { course, user, order } from "@/api/adminhome";
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import Example from "./example.vue";
export default {
  name: "home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data() {
    return {
      infoData: [],
      courseData: [],
      orderData: []
    };
  },
  mounted() {
    // order().then(res => {
    //   if (!res.code) {
    //     this.orderData = res.data;
    //   }
    // });
    // course().then(res => {
    //   if (!res.code) {
    //     this.courseData = res.data;
    //   }
    // });
    // user().then(res => {
    //   if (!res.code) {
    //     this.infoData = res.data;
    //   }
    // });
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>