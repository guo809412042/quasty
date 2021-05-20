/* eslint-disable no-restricted-syntax */
/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-09-21 10:25:37
 * @LastEditTime: 2020-09-21 11:02:43
 * @LastEditors: ssssslf
 */
export const getIssueTree = (list) => {
  const treeData = [];
  const levelOneList = [...new Set(list.map(v => v.levelOne.trim()))];
  for (const i of levelOneList) {
    const arr = {
      value: i.trim(),
      label: i.trim(),
      title: i.trim(),
      children: [],
    };
    const two = [...new Set(list.filter(v => v.levelOne.trim() === i.trim()).map(v => v.levelTwo.trim()))];
    for (const j of two) {
      const arr1 = {
        value: `${i}-${j.trim()}`,
        label: j.trim(),
        title: j.trim(),
        children: [],
      };
      const three = list.filter(v => v.levelOne.trim() === i && v.levelTwo.trim() === j);
      for (const k of three) {
        arr1.children.push({
          value: String(k.id),
          label: k.levelThree.trim(),
          title: k.levelThree.trim(),
        });
      }
      arr.children.push(arr1);
    }
    treeData.push(arr);
  }
  return treeData;
};
export const domainFix = (configStr) => {
  let s = configStr;
  const newDomain = 'xy-hybrid.kakalili.com';
  const domainList = [
    /hybrid\.xiaoying\.tv/gi,
    /hybridxiaoyingtv\.oss-cn-shanghai\.aliyuncs\.com/gi,
    /hybrid\.gltxy\.xyz/gi,
    /hybrid\.vivalabtv\.com/gi,
  ];

  domainList.forEach((reg) => {
    s = s.replace(reg, newDomain);
  });

  return s;
};
export const onLink = (url) => {
  const newUrl = domainFix(url);
  window.open(newUrl, '', 'height=800,width=711,scrollbars=yes,status =yes');
};
