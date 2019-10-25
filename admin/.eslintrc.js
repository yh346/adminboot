module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off',
    // 关闭语句强制分号结尾
    "semi": 0,
    "quotes": 0,
    "indent": 0,
    //空行最多不能超过100行
    "no-multiple-empty-lines": [0, {
      "max": 100
    }],
    //关闭禁止混用tab和空格
    "no-mixed-spaces-and-tabs": [0],
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],
    "no-useless-escape": ['error']
  }
}
