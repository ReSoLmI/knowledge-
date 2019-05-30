/*
tableTop带分数头的表格；
tableNoTop 不带分数头的表格；
*/

/*统一配置模板路径*/
export const TempaltePath = {
  'USER_PATIENT': () => import('@/components/questionTemp/common/patient'),
  'EMC_USER_PATIENT': () => import('@/components/questionTemp/common/patient'),
  'USER': () => import('@/components/questionTemp/common/user'),
  'CONSULTATION': () => import('@/components/questionTemp/consultation/consultation'),
  'BradenQ': () => import('@/components/questionTemp/admissionNursing/tableTop'),
  'PIPP': () => import('@/components/questionTemp/admissionNursing/tableTop'),
  'NUTRITION_ASSESSMENT': () => import('@/components/questionTemp/admissionNursing/tableNoTop'),
  'FLACC': () => import('@/components/questionTemp/admissionNursing/tableNoTop'),
  'FALL': () => import('@/components/questionTemp/admissionNursing/fallScore'),
  'PEWS': () => import('@/components/questionTemp/admissionNursing/fallScore'),
  'CATHETER': () => import('@/components/questionTemp/admissionNursing/fallScore'),
  'Braden': () => import('@/components/questionTemp/admissionNursing/tableTop'),
  'GCS': () => import('@/components/questionTemp/admissionNursing/tableTop'),
  'CPOT': () => import('@/components/questionTemp/admissionNursing/tableTop'),
  'VAS': () => import('@/components/questionTemp/admissionNursing/painScoreTool'), //疼痛评分工具
  'FACE': () => import('@/components/questionTemp/admissionNursing/painScoreTool'), //疼痛评分工具
  'PAIN_SCORE': () => import('@/components/questionTemp/admissionNursing/painScore'), //疼痛评分
  'USER_NURSE': () => import('@/components/questionTemp/common/userNursing'), //用户签名
  'RASS': () => import('@/components/questionTemp/admissionNursing/rass'), //用户签名
  'SIGNATURE_VERIFICATION': () => import('@/components/questionTemp/common/signature_verification'), //用户签名 验证密码
  'SIGNATURE_PERIPHERAL': () => import('@/components/questionTemp/common/signature_peripheral'), //用户签名 外设导入
  'IO': () => import('@/components/questionTemp/common/io'), //出入量
}
