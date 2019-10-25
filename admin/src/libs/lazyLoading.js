/**
 * 注意这里传入的组件名不能以/开头，否则会报错。切记切记切记！！！！2018-06-09 09:18解决
 */
export default name => () => name === "main" ? import(`@/components/main/main.vue`) : import(`@/view/${name}.vue`);
