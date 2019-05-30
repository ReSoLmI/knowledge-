/***********************v2.1页面**********************************/
const createAssesment = resolve => {
  require.ensure(['./views/createAssesment/createAssesment.vue'], () => {
    resolve(require('./views/createAssesment/createAssesment.vue'));
  });
};
const createAssesmentTitle = resolve => {
  require.ensure(['./views/createAssesment/createAssesmentTitle.vue'], () => {
    resolve(require('./views/createAssesment/createAssesmentTitle.vue'));
  });
};
const createAssesmentContent = resolve => {
  require.ensure(['./views/createAssesment/createAssesmentContent.vue'], () => {
    resolve(require('./views/createAssesment/createAssesmentContent.vue'));
  });
};
const styleSetting = resolve => {
  require.ensure(['./views/createAssesmentStyle/styleSetting.vue'], () => {
    resolve(require('./views/createAssesmentStyle/styleSetting.vue'));
  });
};
const editor = resolve => {
  require.ensure(['./views/createAssesmentStyle/Editor.vue'], () => {
    resolve(require('./views/createAssesmentStyle/Editor.vue'));
  });
};
const createQuestion = resolve => {
  require.ensure(['./views/createAssesment/createQuestion.vue'], () => {
    resolve(require('./views/createAssesment/createQuestion.vue'));
  });
};
const preShowAssesment = resolve => {
  require.ensure(['./views/createAssesment/preShowAssesment.vue'], () => {
    resolve(require('./views/createAssesment/preShowAssesment.vue'));
  });
};
const preQuestion = resolve => {
  require.ensure(['./views/createAssesment/preQuestion.vue'], () => {
    resolve(require('./views/createAssesment/preQuestion.vue'));
  });
};
//文书的表格设置
const assesmentTableSetting = resolve => {
  require.ensure(['./views/createAssesmentTable/assesmentTableSetting.vue'], () => {
    resolve(require('./views/createAssesmentTable/assesmentTableSetting.vue'));
  });
};
const tableAddData = resolve => {
  require.ensure(['./views/createAssesmentTable/addData.vue'], () => {
    resolve(require('./views/createAssesmentTable/addData.vue'));
  });
};
const preShowTableSetting = resolve => {
  require.ensure(['./views/createAssesmentTable/preShowTableSetting.vue'], () => {
    resolve(require('./views/createAssesmentTable/preShowTableSetting.vue'));
  });
};
const createAssesmentByDept = resolve => {
  require.ensure(['./views/createAssesmentByDept/createAssesmentByDept.vue'], () => {
    resolve(require('./views/createAssesmentByDept/createAssesmentByDept.vue'));
  });
};

const createNotification = resolve => {
  require.ensure(['./views/createNotification/createNotification.vue'], () => {
    resolve(require('./views/createNotification/createNotification.vue'));
  });
};
const wardAssesmentSetting = resolve => {
  require.ensure(['./views/wardAssesmentSetting/wardAssesmentSetting.vue'], () => {
    resolve(require('./views/wardAssesmentSetting/wardAssesmentSetting.vue'));
  });
};
/**************************护理诊断部分******************************************/
const NursingConfig = resolve => {
  require.ensure(['./views/nursing/nursingConfig.vue'], () => {
    resolve(require('./views/nursing/nursingConfig.vue'));
  });
};
/**************************问卷配置部分******************************************/
const questionnaireConfig = resolve => {
  require.ensure(['./views/questionnaireConfig/questionnaireConfig.vue'], () => {
    resolve(require('./views/questionnaireConfig/questionnaireConfig.vue'));
  });
};

const noRightMsg = resolve => {
  require.ensure(['./views/noRightMsg.vue'], () => {
    resolve(require('./views/noRightMsg.vue'));
  });
};

/**************************编辑域配置部分******************************************/
const assessmentHightArea = resolve => {
  require.ensure(['./views/assessmentHightArea/assessmentHightArea.vue'], () => {
    resolve(require('./views/assessmentHightArea/assessmentHightArea.vue'))
  });
}

const createAssessmentReactArea = resolve => {
  require.ensure(['./views/createAssessmentReactArea/createAssessmentReactArea.vue'], () => {
    resolve(require('./views/createAssessmentReactArea/createAssessmentReactArea.vue'));
  });
};

const nursingRecord = resolve => {
  require.ensure(['./views/otherSet/nursingRecordNew.vue'], () => {
    resolve(require('./views/otherSet/nursingRecordNew.vue'));
  });
};

const assessmentMenu = resolve => {
  require.ensure(['./views/assessmentMenu/index.vue'], () => {
    resolve(require('./views/assessmentMenu/index.vue'));
  });
};



//require.ensure（dependencies：String []，callback：function（require），errorCallback：function（error），chunkName：String）

// require.ensure（）接受三个参数：

// 第一个参数的依赖关系是一个数组，代表了当前需要进来的模块的一些依赖;
// 。第二个参数回调就是一个回调函数其中需要注意的是，这个回调函数有一个参数要求，通过这个要求就可以在回调函数内动态引入其他模块值得注意的是，虽然这个要求是回调函数的参数，理论上可以换其他名称，但是实际上是不能换的，否则的的的的WebPack就无法静态分析的时候处理它;
// 第三个参数errorCallback比较好理解，就是处理错误的回调;
// 第四个参数chunkName则是指定打包的组块名称。




const routers = [{
    path: '/',
    component: createAssesment, //创建文书
  },
  {
    path: '/createAssesmentTitle',
    component: createAssesmentTitle, //创建评估头
  },
  {
    path: '/createAssesmentContent', //创建评估内容
    component: createAssesmentContent
  },
  {
    path: '/createQuestion', //创建问题内容
    component: createQuestion
  },
  {
    path: '/preShowAssesment', //预览评估
    component: preShowAssesment
  },
  {
    path: '/preQuestion', //预览问题
    component: preQuestion,
  },
  {
    path: '/assesmentTableSetting', //评估表格设置
    component: assesmentTableSetting,
  },
  {
    path: '/tableAddData', //评估表格添加数据
    component: tableAddData,
  },
  {
    path: '/nursingDiagnosis', //护理诊断---nocomponents
    name: 'nursingDiagnosis',
    component: NursingConfig,
  },
  {
    path: '/preShowTableSetting', //预览评估表格设置
    component: preShowTableSetting,
  },
  {
    name: 'questionnaireTemplate', //nocomponents
    path: '/questionnaireTemplate',
    component: questionnaireConfig,
  },
  {
    name: 'questionnaireCach', //nocomponents
    path: '/questionnaireCach',
    component: questionnaireConfig,
  },
  {
    name: 'questionnaireList', //nocomponents
    path: '/questionnaireList',
    component: questionnaireConfig,
  },
  {
    path: '/noRightMsg', //无权限，请联系管理员
    component: noRightMsg,
  },
  {
    path: '/createAssesmentByDept', //按科室创建评估
    component: createAssesmentByDept,
  },
  {
    path: '/editor',
    component: editor,
  },
  {
    path: '/styleSetting', //样式设定
    component: styleSetting,
  },
  {
    path: '/createNotification', //创建通知
    component: createNotification,
  },
  {
    path: '/wardAssesmentSetting',
    component: wardAssesmentSetting
  },
  {
    path: '/createAssessmentReactArea',
    component: createAssessmentReactArea
  },
  {
    path: '/assessmentHightArea',
    component: assessmentHightArea
  },
  {
    path: '/nursingRecord', //护士记录
    component: nursingRecord
  },
  {
    path: '/assessmentMenu', //评估单
    component: assessmentMenu
  }

];

export default routers;
