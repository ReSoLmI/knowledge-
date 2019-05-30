/*获取所有题型*/
import radio from '@/components/questionTree/questionNode/radio';
import radioSwitch from '@/components/questionTree/questionNode/radio-switch';
import checkBox from '@/components/questionTree/questionNode/checkBox';
import switchQ from '@/components/questionTree/questionNode/switch';
import inputsQ from '@/components/questionTree/questionNode/inputs';
import optional from '@/components/questionTree/questionNode/optional';
import timeText from '@/components/questionTree/questionNode/timeText';
import combina from '@/components/questionTree/questionNode/combina';
import addQ from '@/components/questionTree/questionNode/add';
import dropDown from '@/components/questionTree/questionNode/dropDown';
import picture from '@/components/questionTree/questionNode/picture';
import freeText from '@/components/questionTree/questionNode/freeText';
import comment from '@/components/questionTree/questionNode/comment';
import guideInto from '@/components/questionTree/questionNode/guideInto';
import labelQ from '@/components/questionTree/questionNode/labelQ';
import imports from '@/components/questionTree/questionNode/imports';


export const QuestionType = {
  '10': radio,
  '11': radioSwitch,
  '12': switchQ,
  '13': dropDown,
  '14': dropDown,
  '20': checkBox,
  '30': inputsQ,
  '40': addQ,
  '70': combina,
  '80': optional,
  '90': timeText,
  '110': picture,
  '32': freeText,
  '201': comment,
  // '200': labelQ,
  '32':imports,
  // '202': guideInto
}

