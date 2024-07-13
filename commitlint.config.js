module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 下面规则中的主语-格添加了一个额外的“句子-格”值； 2 参数确保如果规则检查失败，将显示错误。
  rules: {
    'subject-case': [2, 'always', ['lower-case', 'sentence-case']]
  }
};
