<template>
  <div @click.stop="closePop()">
    <template v-if="activeQuestion.currNode&&activeQuestion.currNode.paperTemplateId!='IO'">
      <div class="hd">
        <template v-if="activeQuestion.currNode">
          <div class="control-item-list">
            <template v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType==200 ||activeQuestion.currNode.questionType==41 || activeQuestion.currNode.questionType==202">
              <div class="control-item">
                <input type="text" class="input-text" v-model="activeQuestion.currNode.aliasName" @input="inputTitleName($event)" @blur.stop="saveQuestion()" style="width: 330px;" placeholder="选择题目" />
                <input type="text" style="width: 0.5px;border: none" id="embabedQuestion" />
              </div>
            </template>
            <template v-else>
              <div class="control-item" style="display:block;">
                <search ref="questionSearch" @complete="getQuestionCode" placeholder_="选择题目 (搜索支持辅助字段，以空格间隔)" :item="activeQuestion&&activeQuestion.currNode"></search>
              </div>
            </template>           
            <template v-if="codingList&&activeQuestion.currNode&&activeQuestion.currNode.questionType==13">
              <div class="control-item" style="display:block;width:330px;">
                <div :class="{'am-ctr-sel':true, 'am-mt-10':true, 'open':isCodeingOpen}" style="width: 100%;height: auto;">
                  <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" @click.stop="codeingOpen">{{ encodeingName || '特殊编码库配置选择' }}</a>
                  <div class="am-dropdown am-mr-10" v-show="isCodeingOpen" @mouseleave="leaveEncodeing">
                    <ul class="select2-option-list">
                      <li :class="{'active': item.isActive}" v-for="(item, index) in codingList" :key=index @click="selCodeingVal(item, activeQuestion.currNode)"><a>{{item.codingNam}}</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </template>
            <div class="control-item" v-if="activeQuestion.currNode.questionType == 90">             
              <div class="am-input-label-unit timePicker" style="width: 170px;">
                <el-time-select
                  v-model="activeQuestion.currNode.startTime"
                  :picker-options=startTimeObj
                  placeholder="起始时间"
                  @change="changeSelectTime">
                </el-time-select>
              </div>
              <div class="am-input-label-unit" style="width: 155px;">
                <span class="txt">时间间隔<i class="muted-line-txt">|</i></span>
                <input type="text" style="padding-left:90px;" class="input-text" v-model="activeQuestion.currNode.timeInterVal" @blur.stop="saveQuestion" />
                <i class="unit">时</i>
              </div>  
              <div class="am-input-label-unit selectList" style="width: 330px;margin-top:10px;">
                <el-select value-key="label" v-model="classes" multiple placeholder="请选择班次" @remove-tag="removeTag($event)" @visible-change="visibleChange($event)">
                  <el-option
                    v-for="item in checkList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </div>                           
            </div>  
            <div class="control-item" style="display:block;width:330px;">
              <div :class="{'am-ctr-sel':true, 'open':isMudOpen}" style="width: 100%;height: auto;">
                  <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" @click.stop="mudOpen">{{ mudName || '特殊配置选择' }}</a>
                  <div class="am-dropdown am-mr-10" v-show="isMudOpen">
                    <ul class="select2-option-list">
                      <li :class="{'active': item.isActive}" v-for="(item, index) in mudList" :key=index @click="selMudVal(item, activeQuestion.currNode)"><a>{{item.dicItemValue}}</a></li>                                                              
                    </ul>
                  </div>
              </div>                       
            </div>  
            <div class="control-item">
              <div class="am-input-label-unit" style="width: 170px;">
                <span class="txt">边距<i class="muted-line-txt">|</i></span>
                <input type="text" class="input-text" v-if="activeQuestion.currNode.style" v-model="activeQuestion.currNode.style.margin" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="saveQuestion" />
                <i class="unit">px</i>
              </div>
            </div>                      
            <div class="control-item">
              <label class="am-ctr-chk" :class="[getClassC(null,'check')]" @click="addCheck($event)">
                <i></i>
                <span class="txt">必答</span>
              </label>
            </div>
            <div class="control-item">
              <label class="am-ctr-chk" :class="[getClassC(null,'lineFeed')]" @click="addLineFeed($event)">
                <i></i>
                <span class="txt">是否换行</span>
              </label>
            </div>
            <div class="control-item" v-if="activeQuestion.currNode && activeQuestion.currNode.questionType == 30 || activeQuestion.currNode && activeQuestion.currNode.questionType == 90">
              <label class="am-ctr-chk" :class="[getClassC(null,'realTime')]" @click="addRealTime($event)">
                <i></i>
                <span class="txt">实时获取</span>
              </label>
            </div>
            <div class="control-item" v-if="activeQuestion.currNode && activeQuestion.currNode.questionType == 200">
              <label class="am-ctr-chk" :class="[getClassC(null,'addNavLocation')]" @click="addNavLocation($event)">
                <i></i>
                <span class="txt">定位导航</span>
              </label>
            </div>
            <div class="control-item">
              <label class="am-ctr-chk" v-if="(activeQuestion.currNode && activeQuestion.currNode.templateType != 1 && !activeQuestion.currNode.paperTemplateId)&&( activeQuestion.currNode.questionType == '14' || activeQuestion.currNode.questionType == '10' || activeQuestion.currNode.questionType == '20' ||activeQuestion.currNode.questionType == '30'|| activeQuestion.currNode.questionType == '13' || activeQuestion.currNode.questionType == '40'||activeQuestion.currNode.questionType=='200'||activeQuestion.currNode.questionType=='41'||activeQuestion.currNode.questionType=='32'||activeQuestion.currNode.questionType==201)" :class="[getClassC(null,'hideTitleCheck')]" @click="addIsShowTitle($event)">
                <i></i>
                <span class="txt">隐藏标题</span>
              </label>
            </div>
            <div class="control-item">
              <label class="am-ctr-chk" :class="[getClassC(null,'sexCheck')]" @click="isHideSexCheck($event)">
                <i></i>
                <span class="txt">性别隐藏</span>
              </label>
            </div>
            <div class="control-item" v-if="activeQuestion.currNode&&(activeQuestion.currNode.questionType==10||activeQuestion.currNode.questionType==11)">
              <label class="am-ctr-chk" :class="[getClassC(null,'radioStyle')]" @click="radioStyleCheck($event)">
                <i></i>
                <span class="txt">开关样式</span>
              </label>
            </div>
            <div class="control-item">
              <label class="am-ctr-chk" :class="[getClassC(null,'initPositionStyle')]" @click="initPositionCheck($event)">
                <i></i>
                <span class="txt">初始位置</span>
              </label>
            </div>
            <div class="control-item" v-if="activeQuestion.currNode && (activeQuestion.currNode.questionType==10 || activeQuestion.currNode.questionType==20)">
              <label class="am-ctr-chk" :class="[getClassC(null, 'radioCheckStyle')]" @click="radioOrCheckBox($event, 'radioChange')">
                <i></i>
                <span class="txt" v-if="activeQuestion.currNode.questionType==10&&(activeQuestion.currNode.switchQuestion =='0'|| activeQuestion.currNode.switchQuestion =='5' || !activeQuestion.currNode.switchQuestion)">多选题</span>
                <span class="txt" v-if="activeQuestion.currNode.questionType==20&&(activeQuestion.currNode.switchQuestion =='0' || activeQuestion.currNode.switchQuestion =='6' || !activeQuestion.currNode.switchQuestion)">单选题</span>
                <span class="txt" v-if="activeQuestion.currNode.questionType==20&&(activeQuestion.currNode.switchQuestion =='1')">多选题</span>
                <span class="txt" v-if="activeQuestion.currNode.questionType==10&&activeQuestion.currNode.switchQuestion =='3'">单选题</span>
              </label>
            </div>     
            <div class="control-item" v-if="activeQuestion.currNode && (activeQuestion.currNode.questionType==10 || activeQuestion.currNode.questionType==20)">
              <label class="am-ctr-chk"  @click="radioOrCheckBox($event, 'fromRadioOrBoxChange')">
                <i></i>
                <span class="txt">下拉题</span>
              </label>
            </div>             
            <div class="control-item" v-if="activeQuestion.currNode && (activeQuestion.currNode.questionType==14 || activeQuestion.currNode.questionType==13)">
              <label class="am-ctr-chk" :class="[getClassC(null, 'radioCheckStyle')]" @click="radioOrCheckBox($event, 'selectChange')">
                <i></i>
                <span class="txt">多选配置</span>
              </label>
            </div>   
            <div class="control-item" v-if="activeQuestion.currNode && (activeQuestion.currNode.questionType==14 || activeQuestion.currNode.questionType==13)">
              <label class="am-ctr-chk" :class="[getClassC(null, 'selectRadio')]" @click="radioOrCheckBox($event, 'selectChangeRadio')">
                <i></i>
                <span class="txt" v-if="activeQuestion.currNode.questionType==14">多选题</span>
                <span class="txt" v-if="activeQuestion.currNode.questionType==13">单选题</span>
              </label>
            </div>  
            <div class="control-item">
              <label class="am-ctr-chk" :class="[getClassC(null,'conceal')]" @click="conceal($event)">
                <i></i>
                <span class="txt">隐藏节点</span>
              </label>
            </div>            
            <div class="control-item">
              <selectRight :activeQuestion="activeQuestion" v-if="linkFlagDict&&linkFlagDict.length>0" :arr="linkFlagDict" :types="'linkDict'" @selectSort="selectSort"></selectRight>
              <selectRight :activeQuestion="activeQuestion" :arr="specialFlagDict" :types="'specialDict'" @selectSort="selectSort" v-if="activeQuestion&&activeQuestion.currNode&&activeQuestion.currNode.questionType==90"></selectRight>
            </div>                                                                                              
            <div class="control-item" v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType==41">
              <selectRight :activeQuestion="activeQuestion" :arr="sortTypeArr" :types="'sortType'" @selectSort="selectSort"></selectRight>
              <selectRight :activeQuestion="activeQuestion" :arr="sortFieldArr" :types="'sortField'" @selectSort="selectSort"></selectRight>
            </div>
            <a class="control-item am-txt-normal" style="vertical-align: middle" @click.stop="addInOutConfig">+出入量</a>
            <template v-if="activeQuestion.currNode.questionType==30">
              <div class="control-item">
                组合方式
              </div>
              <selectT :list="mStyleList" :chosed="{code:activeQuestion.currNode.style.link,name:''}" @complete="choseMstyle" :symbol='true'>
              </selectT>
            </template>
          </div>
          <!-- <div class="am-mt-10"> -->
          <!-- <el-tooltip  placement="top"  popper-class="menu-dd-limit"> -->
          <a class="control-item" style="vertical-align: middle;" @click.stop="addShare" :class="getShareClass()">+共享</a>

          <!-- </el-tooltip> -->
          <!-- <el-tooltip  placement="top"  popper-class="menu-dd-limit"> -->
          <a class="control-item" style="vertical-align: middle;" :class="getHelpClass('questionHelp')" @click="addHelp('questionHelp')">+help</a>
          <!-- </el-tooltip> -->
          <!--  <el-tooltip  placement="top"  popper-class="menu-dd-limit"> -->
          <a class="control-item" style="vertical-align: middle;" :class="getGroupClass('questionGroup')" @click="addGroup('questionGroup')">+组句</a>
          <!-- </el-tooltip> -->
          <!-- <el-tooltip  placement="top"  popper-class="menu-dd-limit" > -->
          <a class="control-item" style="vertical-align: middle;" :class="getRemarkClass()" @click="addRemark()">+备注</a>
          <!-- </el-tooltip> -->
          <a class="control-item am-btn am-btn-primary" style="width: 120px" @click.stop="addAttachQuestion">+ 附属题</a>
          <!-- </div> -->

          <!-- <div style="margin-top:5px;line-height:40px;" v-if="activeQuestion.currNode.questionType == 30">
            <span>BMI公式配置:</span>
            <input type="text" class="input-text" style="width: 245px;margin-top:5px;" placeholder="请输入BMI计算公式" />
          </div> -->

        </template>
        <div style="padding-right: 15px;">
            <div class="am-mt-10">互斥题目配置:</div>
            <div class="am-ctr-sel am-mt-10" :class="{'open':isOpenQuestionTree}" @mouseleave="leaveSaveData()" style="width: 100%;height: auto;" @click.stop="openQuestionTree(activeQuestion.currNode.mutexList, activeQuestion.currNode.uniqueId)">
                <div class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" v-if="activeQuestion.currNode && activeQuestion.currNode.mutexList && activeQuestion.currNode.mutexList.length > 0">
                    <div class="caption-span-list">
                        <span class="caption-span" v-for="(item, index) in activeQuestion.currNode.mutexList" :key="index">
                            <em class="caption-txt">{{item.aliasName}}</em><i class="i-close" @click.stop="delateMutex(activeQuestion.currNode.mutexList, index)"></i>
                        </span>
                    </div>
                </div>
                <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" @click.stop="openQuestionTree(activeQuestion.currNode.mutexList, activeQuestion.currNode.uniqueId)" v-if="!( activeQuestion.currNode && activeQuestion.currNode.mutexList && activeQuestion.currNode.mutexList.length > 0 )">选择互斥题目</a>
                <div class="am-dropdown am-mr-10" v-show="isOpenQuestionTree">
                    <ul class="select2-option-list">
                        <li :class="{ 'active': item.isActive }" :key="index" @click.stop="selQuestion(item)" v-for="(item, index) in treeList" ><a>{{ item.aliasName }}</a></li>
                    </ul>
                </div>
            </div>
        </div>          
        <template v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType==201">
          <imageUpload :activeQuestion="activeQuestion" @save="saveImage"></imageUpload>
          <div class="am-input-label-unit control-item" style="width: 110px;">
            <span class="txt">宽<i class="muted-line-txt">|</i></span>
            <input type="text" class="input-text" style="padding-left:40px;" v-if="activeQuestion.currNode" v-model="activeQuestion.currNode.style.width" @blur.stop="saveQuestion()" />
            <i class="unit">px</i>
          </div>
          <!-- <div class="am-input-label-unit" style="width: 170px;">
            <span class="txt">边距<i class="muted-line-txt">|</i></span>
            <input type="text" class="input-text" v-if="activeQuestion.currNode.style" v-model="activeQuestion.currNode.style.margin" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="saveQuestion" />
            <i class="unit">px</i>
          </div> -->
        </template>
        <template v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType==202">
          <guide :activeQuestion.sync="this.activeQuestion"></guide>
        </template>
      </div>
      <div class="bd" :class="{pd: activeQuestion.currNode.questionType =='30'}">
        <i class="i-child-angle"></i>
        <ul class="item-list">
          <template v-if="(activeQuestion.currNode)&&(activeQuestion.currNode.questionType =='10' ||activeQuestion.currNode.questionType =='11' ||activeQuestion.currNode.questionType =='20' ||activeQuestion.currNode.questionType =='12'||activeQuestion.currNode.questionType=='80'||activeQuestion.currNode.questionType=='13' || activeQuestion.currNode.questionType=='14')">
            <draggable v-show="activeQuestion.currNode.optionList.length>0" :list="activeQuestion.currNode.optionList" @start="drag=true" @end="drag=false;disabled=true" @change="dragChange" class="drag-step-list-cont" :options="{disabled:disabled,chosenClass:'choose',animation:150}">
              <li v-for="(item,index) in activeQuestion.currNode.optionList" :key=index>
                <div class="control-item" v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType!='12'">
                  <search @complete="getOptionCode" placeholder_="选择选项 (搜索支持辅助字段，以空格间隔)" :index_="index" :item="item" ref="optionSearch" :source="item"></search>
                </div>
                
                <template v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType!=12">
                  <div class="am-input-label-unit control-item" style="width: 135px;" v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType == 30 || activeQuestion.currNode&&activeQuestion.currNode.questionType == 13&&index == 0 || activeQuestion.currNode&&activeQuestion.currNode.questionType == 14&&index == 0">
                    <span class="txt">宽<i class="muted-line-txt">|</i></span>
                    <input type="text" style="padding-left:45px;" class="input-text" v-if="!item.style||(item.style&&!item.style.width)" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setWidthaa($event,item,index)" />
                    <input type="text" style="padding-left:45px;" class="input-text" v-if="item.style&&item.style.width" v-model="item.style.width" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setWidth($event,item,index)" />
                    <i class="unit">px</i>
                  </div>
                  <div class="am-input-label-unit control-item" style="width: 169px;">
                    <span class="txt">边距<i class="muted-line-txt">|</i></span>
                    <input type="text" class="input-text" v-if="!item.style||(item.style&&!item.style.margin&&item.style.margin != 0)" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setMarginNoObj($event,item,index)" />
                    <input type="text" class="input-text" v-if="(item.style&&item.style.margin) || (item.style.margin == 0)" v-model="item.style.margin" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setMargin($event,item,index)" />
                    <i class="unit">px</i>
                  </div>
                  <div class="control-item" @mouseleave="disabled=true">
                    <a class="i-link-move" @mouseover.stop="disabled=false"></a>
                  </div>
                  <div class="control-item">
                    <a class="i-link-del" @click="delOptionItem(index,item)"></a>
                  </div>
                </template>
                <div>
                  <label class="am-ctr-chk control-item" :class="[getClassC(item,'default')]" @click="addDefault(index,item)">
                    <i></i>
                    <span v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType==12">{{item.switchType == '1' ?'默认开启':'默认关闭'}}</span>
                    <span v-else>默认</span>
                  </label>
                  <label class="am-ctr-chk control-item" :class="[getClassC(item,'lineFeed')]" @click="addLineFeedNum(index,item)">
                    <i></i>
                    <span>是否换行</span>
                  </label>
                  <label class="am-ctr-chk control-item" v-if=" (activeQuestion.currNode && item.templateType != 1 && !item.paperTemplateId )&&( activeQuestion.currNode.questionType == '10' || activeQuestion.currNode.questionType == '20')" :class="[getClassC(item,'hideOptionTitleCheck')]" @click="addOptionShowTitle(index, item, $event)">
                    <i></i>
                    <span class="txt">隐藏标题</span>
                  </label>
                  <div class="control-item" v-if="activeQuestion.currNode && activeQuestion.currNode.questionType == 30 || activeQuestion.currNode && activeQuestion.currNode.questionType == 90">
                    <label class="am-ctr-chk" :class="[getClassC(null,'realTime')]" @click="addRealTime($event)">
                      <i></i>
                      <span class="txt">实时获取</span>
                    </label>
                  </div>
                  <label class="am-ctr-chk control-item" :class="[getClassC(item,'optionType')]" v-if="activeQuestion.currNode&&(activeQuestion.currNode.questionType==10||activeQuestion.currNode.questionType==20 || activeQuestion.currNode.questionType==13 || activeQuestion.currNode.questionType==14)" @click="addOptionType(index,item)">
                    <i></i>
                    <span>显示输入框</span>
                  </label>
                  <template v-if="item.optionType == 2">
                    <div class="control-item">
                      单位:
                      <selectT :key="index" :mUnit="mUnit" :list="units" :chosed="item.unitList[0]" @complete="choseUnitOne" type="unit" :index="index" :parentIndex="index" @deleteUnit="delInputUnit">
                      </selectT>
                    </div>
                    <div class="control-item">
                      <label class="am-ctr-chk" :class="[getClassC(item,'optionCheck')]" @click="addOptionCheck($event, item)">
                        <i></i>
                        <span class="txt">必答</span>
                      </label>
                    </div>                    
                  </template>

                  <a class="control-item " @click.stop="addSubItem(item,index)" :class="getSubChild(index)">+子项</a>
                  <a class="control-item" :class="getHelpClass('optionHelp',index)" @click="addHelp('optionHelp',index,item)">+help</a>
                  <span v-if="(activeQuestion.currNode)&&(activeQuestion.currNode.questionType =='10' ||activeQuestion.currNode.questionType =='11' ||activeQuestion.currNode.questionType =='20')"><a class="control-item" :class="getOptionNoteClass(item)" @click="addNote(index,item)">+注解</a></span>
                  <a class="control-item " @click="addGroup('optionGroup',index,item)" :class="getGroupClass('optionGroup',index)">+组句</a>
                  <a v-if="getClassC(item,'optionType') == 'active'" @click.stop="addVerify(index,item)" :class="getFillCheckeClass(item, 'optionTypeCheck')">+校验</a>
                </div>
              </li>
            </draggable>
          </template>
          <template v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType==90">
            <li v-for="(optionItem,optionIndex) in activeQuestion.currNode.optionList" :key=optionIndex>
              <div class="control-item">
                时间格式
              </div>
              <div class="control-item">
                <selectT :list="timeFormatList" type="time" :chosed="{code:optionItem.timeFormat,name:''}" :index="optionIndex" @complete="choseTimeFormat">
                </selectT>
              </div>

              <div class="am-input-label-unit control-item" style="width: 135px;">
                <span class="txt">宽<i class="muted-line-txt">|</i></span>
                <input type="text" class="input-text" v-if="!optionItem.style||(optionItem.style&&!optionItem.style.width)" @blur.stop="setWidthaa($event,optionItem,optionIndex)" />
                <input type="text" style="padding-left:45px" class="input-text" v-if="optionItem.style&&optionItem.style.width" v-model="optionItem.style.width" @blur.stop="saveQuestion()" />
                <i class="unit">px</i>
              </div>
              <div class="am-input-label-unit control-item" style="width: 169px;">
                <span class="txt">边距<i class="muted-line-txt">|</i></span>
                <input type="text" class="input-text" v-if="!optionItem.style||(optionItem.style&&!optionItem.style.margin&&optionItem.style.margin!=0)" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setMarginNoObj($event,optionItem,optionIndex)" />
                <input type="text" class="input-text" v-if="(optionItem.style&&optionItem.style.margin) || (optionItem.style.margin == 0)" v-model="optionItem.style.margin" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setMargin($event,optionItem,optionIndex)" />
                <i class="unit">px</i>
              </div>

              <!-- <label class="am-ctr-chk control-item"  :class="[getClassC(optionItem,'minDate')]" @click="addTimeCheck($event,optionIndex,'timeLimit')">
                  <i></i>
                  <span class="txt">限制最小时间</span>
                </label> -->
              <div :class="{'control-collapse':true, 'w140':true, 'control-item':true, 'timeLimit':true, 'open':isOpen}">
                <div class="hd" style="background:#FFF;" @click="openSelList(optionIndex)"><i class="i-collapse-angle"></i>选择限制时间</div>
                <div :class="{'time-wrap':true, 'active':isOpen}" @mouseleave="leaveTime">
                  <div>
                    <ul style="border-left:1px solid #E5E5E5;border-bottom:1px solid #E5E5E5;border-right:1px solid #E5E5E5;">
                      <li v-for="(item, index) in limitTime" :key=index @click="selCurTime(item)">
                        <div :class="{'am-ctr-native-chk':true, 'active':item.isActive}"><span>{{ item.timeName }}</span></div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <label class="am-ctr-chk control-item" :class="[getClassC(optionItem,'defaultTime')]" @click="addTimeCheck($event,optionIndex,'defaultTime')">
                <i></i>
                <span class="txt">默认当前时间</span>
              </label>
              <label class="am-ctr-chk control-item" :class="[getClassC(optionItem,'timeFlag')]" @click="checkTimeFlag($event,optionIndex)">
                <i></i>
                <span class="txt">不显示时间</span>
              </label>
              <label class="am-ctr-chk control-item" :class="[getClassC(optionItem,'timeAddOrMutil')]" @click="addTimeAddOrMutil($event,optionIndex)">
                <i></i>
                <span class="txt">时间加减</span>
              </label>
              <input type="text" v-if="optionItem.addType" v-model="optionItem.defaultValue" class="input-text w70 control-item" @keyup="validNumber($event)" @afterpaste="validNumber($event)" style="ime-mode:Disabled" @blur="setDefaultValue($event,optionIndex)" />
              <div class="control-item">
                <a class="am-ctr-chk control-item-list" @click="addGroup('optionGroup',optionIndex,optionItem)" :class="getGroupClass('optionGroup',optionIndex)">+组句</a>
              </div>
            </li>
          </template>
          <template v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType =='40'">
            <li>
              <div class="am-condition-inner b-dashed-b" v-if="activeQuestion.currNode">
                <input type="text" :value="addAddName" class="input-text w200" placeholder="添加按钮名称" @blur.stop="saveAddAddOption($event)" />
                <label class="am-ctr-chk am-ml-10" @click="addQuestionOption('del')" :class="{'active':addDeleteName}">
                  <i></i>
                  <span class="txt">可删除</span>
                </label>
                <input type="text" class="input-text w200" style="width:170px!important" :value="addDeleteName" @input="setQuestionOptionValue('del')" v-if="!(addDeleteName === false)" @blur.stop="saveQuestion()" />
                <label class="am-ctr-chk am-ml-10" @click="addQuestionOption('change')" :class="{'active':addChangeName}">
                  <i></i>
                  <span class="txt">可更换</span>
                </label>
                <input type="text" style="width:170px!important" class="input-text w200" :value="addChangeName" @input="setQuestionOptionValue('change')" v-if="!(addChangeName===false)" @blur.stop="saveQuestion()" />
                <label class="am-ctr-chk am-ml-10" :class="{'active':hasSequenceOption}" @click="addQuestionOption('sequence')">
                  <i></i>
                  <span class="txt">序号</span>
                </label>
                <label class="am-ctr-chk am-ml-10" :class="{'active':hasRelateOption}" @click="addQuestionOption('relate')">
                  <i></i>
                  <span class="txt">引用结果</span>
                </label>
              </div>
            </li>
          </template>
          <template v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType=='110'">
            <div v-for="(optionItem,optionIndex) in activeQuestion.currNode.optionList" :key=optionIndex>
              <i class="i-child-angle"></i>
              <div class="form-control-item am-mt-10" style="width: 100%;">
                图片张数
                <selectT :list="imageCountList" :chosed="{code:optionItem.checkList.pictureCount,name:''}" :index="optionIndex" @complete="chosePictureCount">
                </selectT>
                图片大小
                <selectT :list="imageSizeList" :chosed="{code:optionItem.checkList.pictureSize,name:''}" :index="optionIndex" @complete="chosePictureSize">
                </selectT>
              </div>
              <div class="form-control-item am-mt-10" style="width: 100%;">
                图片格式
                <selectT :list="imageFormatList" :chosed="{code:optionItem.checkList.pictureFormat,name:''}" :index="optionIndex" @complete="chosePictureFormat">
                </selectT>
                <a @click="addGroup('optionGroup',optionIndex,optionItem)" :class="getGroupClass('optionGroup',optionIndex)">+组句</a>

              </div>
              <div class="am-mt-10">
                <input type="text" class="input-text" placeholder="说明文字" v-model="activeQuestion.currNode.remarksContent" @blur.stop="saveQuestion()" />
              </div>
            </div>
          </template>
          <template v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType=='32'">
            <template v-for="(optionItem,optionIndex) in activeQuestion.currNode.optionList">
              <div class="control-item" :key="optionIndex">
                <div class="am-input-label-unit" style="width: 155px;" v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType==30 || activeQuestion.currNode.questionType==32">
                  <span class="txt">宽<i class="muted-line-txt">|</i></span>
                  <input type="text" class="input-text" v-if="!optionItem.style||(optionItem.style&&!optionItem.style.width)" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur="setWidthaa($event,optionItem,optionIndex)">
                  <input type="text" class="input-text" value="40" v-if="optionItem.style&&optionItem.style.width" v-model="optionItem.style.width" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur="setWidth($event,optionItem,optionIndex)">
                  <i class="unit">px</i>
                </div>
                <div class="am-input-label-unit control-item" style="width: 169px;margin-top:0px;">
                  <span class="txt">边距<i class="muted-line-txt">|</i></span>
                  <input type="text" class="input-text" v-if="!optionItem.style||(optionItem.style&&!optionItem.style.margin&&optionItem.style.margin != 0)" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setMarginNoObj($event,optionItem,optionIndex)" />
                  <input type="text" class="input-text" value="40" v-if="(optionItem.style&&optionItem.style.margin) || (optionItem.style.margin == 0)" v-model="optionItem.style.margin" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setMargin($event,optionItem,optionIndex)" />
                  <i class="unit">px</i>
                </div>
              </div>
              <div class="control-item" :key="optionIndex">
                <span class="txt">高度</span>
              </div>
              <div class="control-item" :key="optionIndex">
                <selectT :list="hList" :chosed="{code:optionItem.style.height,name:''}" :index="optionIndex" @complete="choseH">
                </selectT>
              </div>
              <div style="padding-right: 15px;" :key="optionIndex">
                <div class="am-mt-10">导入控件</div>
                <div class="am-ctr-sel am-mt-10" :class="{'open':isImportControlOpen}" @mouseleave="isImportControlOpen=false" style="width: 100%;height: auto;" @click.stop="isImportControlOpen=true">
                  <div class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" v-if="optionItem.controlList&&optionItem.controlList.length>0">
                    <!-- 选择问题 -->
                    <div class="caption-span-list">
                      <span class="caption-span" v-for="(item,index) in optionItem.controlList" :key="index">
                        <em class="caption-txt">{{item.controlName}}</em><i class="i-close" @click.stop="deleteControlItem(item,optionItem)"></i>
                      </span>
                    </div>
                  </div>
                  <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" @click.stop="isImportControlOpen=true" v-if="!optionItem.controlList||(optionItem.controlList&&optionItem.controlList.length==0)">选择控件</a>
                  <div class="am-dropdown am-mr-10" v-show="isImportControlOpen">
                    <ul class="select2-option-list">
                      <li :class="getControlClass(item,optionItem)" v-for="(item,index) in importControlList" :key=index @click.stop="choseImportControl($event,item,optionItem)"><a>{{item.controlName}}</a></li>
                      <li>
                        <div @click.stop="checkAllImportControl($event,optionItem)" class="am-ctr-native-chk am-ml-10 " :class="{'active':importControlList.length==optionItem.controlList.length}"><span>全选</span></div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-if="activeQuestion.currNode&&activeQuestion.currNode.questionType=='30'">
            <li v-for="(optionItem,optionIndex) in activeQuestion.currNode.optionList" :key=optionIndex>
              <div class="control-item-list" style="padding-top:10px;">
                <div style="width:328px;margin-top:10px;">
                  <input class="input-text" v-model="optionItem.blankFiller" type="text" placeholder="请输入填空题默认内容" @blur="saveDefault(optionItem, optionItem.blankFiller)">
                </div>

                <template>
                  <div class="control-item" style="display:block;width:330px;margin-top:0px;">
                    <div :class="{'am-ctr-sel':true, 'am-mt-10':true, 'open':isAssessmentListOpen}" style="width: 100%;height: auto;">
                      <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true" @click.stop="assessmentOpen(optionItem)">
                        {{ optionItem.specialShareRes ? (optionItem.specialShareRes.relateName ? (optionItem.specialShareRes.relateName) : '评估单关联配置') : '评估单关联配置' }}
                      </a>
                      <div class="am-dropdown am-mr-10" v-show="isAssessmentListOpen" @mouseleave="leaveAssessmentList">
                        <ul class="select2-option-list">
                          <li :class="{'active': item.isActive}" v-for="(item, index) in assessmentList" :key=index @click="selAssessment(item, optionItem, optionIndex)"><a>{{item.fileName}}</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </template>

                <div class="control-item">
                  <div class="am-input-label-unit" style="width: 155px;">
                    <span class="txt">宽<i class="muted-line-txt">|</i></span>
                    <input type="text" style="padding-left:45px;" class="input-text" v-if="!optionItem.style||(optionItem.style&&!optionItem.style.width)" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur="setWidthaa($event,optionItem,optionIndex)">
                    <input type="text" style="padding-left:45px;" class="input-text" value="40" v-if="optionItem.style&&optionItem.style.width" v-model="optionItem.style.width" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur="setWidth($event,optionItem,optionIndex)">
                    <i class="unit">px</i>
                  </div>
                  <div class="am-input-label-unit control-item" style="width: 169px;margin:0px 0px 0px 0px">
                    <span class="txt">边距<i class="muted-line-txt">|</i></span>
                    <input type="text" class="input-text" v-if="!optionItem.style||(optionItem.style&&!optionItem.style.margin&&optionItem.style.margin !=0)" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setMarginNoObj($event,optionItem,optionIndex)" />
                    <input type="text" class="input-text" v-if="(optionItem.style&&optionItem.style.margin) || (optionItem.style.margin == 0)" v-model="optionItem.style.margin" @keyup="validNumber($event)" @afterpaste="validNumber($event)" @blur.stop="setMargin($event,optionItem,optionIndex)" />
                    <i class="unit">px</i>
                  </div>
                </div>
                <div class="control-item">
                  <label style="margin:0px 30px 0 0" class="am-ctr-chk control-item" :class="[getClassC(optionItem,'lineFeed')]" @click="addLineFeedNum(optionIndex,optionItem)">
                    <i></i>
                    <span>是否换行</span>
                  </label>
                </div>
                <div class="control-item">
                  <selectT :list="secopStyleList" :LogicMode="true" :chosed="{code:optionItem.logicMode,name:''}" :index="optionIndex" @complete="choseMyLogic" :symbol='true'>
                  </selectT>
                </div>
                <div class="control-item">
                  <selectT :list="keyboardList" :LogicMode="true" :chosed="{code:optionItem.keyboardType,name:''}" :index="optionIndex"  @complete="chosekeyboradType" :symbol='true'>
                  </selectT>
                </div>                    
                <div class="control-item">
                  <span class="txt">高度</span>
                </div>
                <div class="control-item" v-if="optionItem.style">
                  <selectT :list="hList" :chosed="{code:optionItem.style.height,name:''}" :index="optionIndex" @complete="choseH">
                  </selectT>
                </div>
                <div class="control-item">
                  <label class="am-ctr-chk" @click="showUnit(optionIndex)" :class="{'active':(optionItem.unitList&&optionItem.unitList.length>0)}">
                    <i></i> 单位
                  </label>
                </div>
                <div class="control-item">
                  <label style="margin:0" class="am-ctr-chk" :class="[getClassC(optionItem,'expressType')]" @click="addExpressType(optionIndex,optionItem)">
                    <i></i>
                    <span>累计</span>
                  </label>
                </div>                
                <template v-if="optionItem.unitList&&optionItem.unitList.length>0">
                  <div class="control-item">
                    <selectT v-for="(item,index) in optionItem.unitList" :key="index" :list="units" :chosed="item" @complete="choseUnit" type="unit" :index="index" :parentIndex="optionIndex" @deleteUnit="delInputUnit">
                    </selectT>
                  </div>
                  <div class="control-item">
                    <a @click="addUnit(optionIndex)">+单位</a>
                  </div>
                </template>
                <div class="control-item">
                  <a @click.stop="addBMI(optionIndex,optionItem)" :class="getBmiClass(optionItem)">+BMI</a>
                </div>
                <div class="control-item">
                  <a @click.stop="addVerify(optionIndex,optionItem)" :class="getFillCheckeClass(optionItem)">+校验</a>
                </div>
                <div class="control-item">
                  <a @click.stop="addTips(optionIndex,optionItem)" :class="getTipClass(optionIndex)">+提示语</a>
                </div>
                <div class="control-item">
                  <a :class="getHelpClass('optionHelp',optionIndex)" @click="addHelp('optionHelp',optionIndex,optionItem)">+help</a>
                </div>
                <div class="control-item">
                  <a @click="addGroup('optionGroup',optionIndex,optionItem)" :class="getGroupClass('optionGroup',optionIndex)">+组句</a>
                </div>
                <div class="control-item">
                  <a class="i-link-del" @click="delOptionItem(optionIndex,optionItem)"></a>
                </div>
              </div>
            </li>
          </template>
        </ul>
        <div class="am-mt-10">
          <a v-if="activeQuestion.currNode&&(activeQuestion.currNode.questionType ==10 ||activeQuestion.currNode.questionType ==20||activeQuestion.currNode.questionType==13 || activeQuestion.currNode.questionType==14)" class="am-btn am-btn-plain-primary am-mr-10" @click="addOption()">+ 选项</a>
          <a class="am-btn am-btn-plain-primary am-mr-10" v-if="activeQuestion.currNode&&(activeQuestion.currNode.questionType==30)" @click="addOption()">+填输入框</a>
          <!-- <a class="am-btn am-btn-plain-primary am-mr-10" style="width: 162px;" v-if=" (activeQuestion.currNode)&&(activeQuestion.currNode.questionType == '10' || activeQuestion.currNode.questionType == '20')">批量增加选项</a> -->
        </div>
      </div>
    </template>
    <template v-if="activeQuestion.currNode&&activeQuestion.currNode.paperTemplateId=='IO'">
      <div class="control-item" style="margin-left: 20px">
        <label class="am-ctr-chk" :class="[getClassC(null,'statics')]" @click="addStatics($event)">
          <i></i>
          <span class="txt">统计功能</span>
        </label>
      </div>
      <div class="control-item">
        <label class="am-ctr-chk" :class="[getClassC(null,'detail')]" @click="showDetail($event)">
          <i></i>
          <span class="txt">显示明细</span>
        </label>
      </div>
    </template>
  </div>
</template>
<script>
import Bus from "@/bus.js";
import Vue from "vue";
import common from "@/util/common.js";
import inputLayer from "@/components/questionC/inputLayer.vue";
import search from "@/components/questionC/search.vue";
import cascaderSearch from "@/components/questionC/cascaderSearch.vue";
import selectRight from "@/components/questionC/selectRight.vue";
import selectT from "@/components/questionC/selectT.vue";
import confirmMsg from "@/components/confirm_delete.vue";
import inputImgLayer from "@/components/questionC/inputAndImageLayer.vue";
import verifyLayer from "@/components/questionC/verifyLayer.vue";
import { getCatalogue } from "@/util/util";
import draggable from "vuedraggable";
import imageUpload from "@/components/questionC/imageUpload.vue";
import guide from "@/components/logic/guide.vue";
import { Tooltip, TimePicker, TimeSelect, Select, Option } from "element-ui";
import { mapState, mapActions, mapMutations } from "vuex";
Vue.component(TimePicker.name, TimePicker);
Vue.component(TimeSelect.name, TimeSelect);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.use(Tooltip);
export default {
  data() {
    return {
      isOpenQuestionTree: false,
      classes: [],
      startTimeObj: {
        start: '06:30',
        step: '00:15',
        end: '24:00'
      },
      selAssessmentName: "",
      w: 10,
      activeQuestion: this.currentQuestion, //当前选中问题
      organCode: common.getUrlParam("organCode") || common.getOrganCode(),
      optionIdAll: 0, //动态增加的选项ID计数
      hList: [
        {
          code: 1,
          name: "单行"
        },
        {
          code: 2,
          name: "多行"
        }
      ],
      wList: [
        {
          code: 0,
          name: "默认"
        },
        {
          code: 1,
          name: "加宽"
        },
        {
          code: 2,
          name: "更窄"
        }
      ], //连接符设置
      mStyleList: [
        {
          code: 0,
          name: "无符号"
        },
        {
          code: 1,
          name: "/"
        },
        {
          code: 2,
          name: "*"
        }
      ],
      // 填空题评分类型选择
      secopStyleList: [
        {
          code: 0,
          name: "评分类型"
        },
        {
          code: 1,
          name: "输入方式"
        },
        {
          code: 2,
          name: "弹出方式"
        }
      ],
      // 填空题键盘类型选择
      keyboardList: [{
        code: 0,
        name: '键盘类型'
      }, {
        code: 1,
        name: '数字键盘'
      }, {
        code: 2,
        name: '体温键盘'
      }],       
      //时间格式设置
      timeFormatList: [
        {
          code: "yyyy-MM-dd hh:mm:ss",
          name: "yyyy-MM-dd hh:mm:ss"
        },
        {
          code: "yyyy-MM-dd hh:mm",
          name: "yyyy-MM-dd hh:mm"
        },
        {
          code: "yyyy-MM-dd",
          name: "yyyy-MM-dd"
        }
      ],
      //性别设置
      sexList: [
        {
          code: "1",
          name: "男"
        },
        {
          code: "2",
          name: "女"
        },
        {
          code: "9",
          name: "未知性别"
        },
        {
          code: "0",
          name: "第三性别"
        }
      ],
      //图片数量数组
      imageCountList: [
        { code: "1", name: "1" },
        { code: "3", name: "3" },
        { code: "5", name: "5" }
      ],
      //图片大小
      imageSizeList: [
        { code: "2", name: "2M以内" },
        { code: "5", name: "5M以内" },
        { code: "10", name: "10M以内" }
      ],
      //图片格式
      imageFormatList: [
        { code: "1", name: "jpg" },
        { code: "2", name: "png" },
        { code: "3", name: "bmp" }
      ],
      //导入控件
      importControlList: [
        { controlName: "医嘱", controlType: 1 },
        { controlName: "医嘱执行记录", controlType: 2 },
        { controlName: "生命体征", controlType: 3 },
        { controlName: "检验报告", controlType: 4 },
        { controlName: "检查报告", controlType: 5 },
        { controlName: "评分", controlType: 6 },
        // { 'controlName':'文书记录','controlType':7},
        { controlName: "护理记录", controlType: 8 },
        { controlName: "特殊字符", controlType: 9 },
        { controlName: "输血记录", controlType: 10 },
      ],         
      isMudOpen:false,
      curMudVal: '',
      isCodeingOpen: false, // 特殊编码下拉控制
      curCodeingVal: "特殊编码库配置选择",
      isAssessmentListOpen: false,
      isImportControlOpen: false,
      evaluationId: common.getUrlParam("assesmentId"), //评估单id
      disabled: true,
      statisticsType: this.statistiType,
      detailType: this.detaType,
      //排序
      sortTypeArr: [
        { sortName: "请选择" },
        { sortName: "ASC", sortType: "ASC" },
        { sortName: "DESC", sortType: "DESC" }
      ],
      //初始化位置
      initPositionCK: this.initPosition,
      // 题目搜索方式
      isCascader: false,
      curTimeindex: null,
      isOpen: false,
      // 限制时间选择
      limitTime: [
        { timeName: "限制入院时间", isActive: false, conTime: "1" },
        { timeName: "限制最大时间", isActive: false, conTime: "2" },
        { timeName: "限制转科时间", isActive: false, conTime: "3" }
      ],
      tLimit: "",
      treeList: [],
      mUnit: true,
    };
  },
  props: [
    "codingList",
    "currentQuestion",
    "units",
    "subRelateNode",
    "detaType",
    "statistiType",
    "initPosition",
    "linkFlagDict",
    "specialFlagDict",
    "assessmentList",
    "isOnce",
    "tableFlag",
    "routineFlag",
    "dynamicFlag",
    "mudList",
    "checkList",
    "currentPage",
  ],
  computed: {
    mudName: function() {
      let mud = '';
      if(this.mudList) {
        if(this.activeQuestion.currNode && this.activeQuestion.currNode.mud || (this.activeQuestion.currNode && this.activeQuestion.currNode.mud == 0)) { 
          this.mudList.forEach((ele, index) => {
            if(ele.dicItemKey == this.activeQuestion.currNode.mud) {
              ele.isActive = true;
              mud = ele.dicItemValue;
            } else {
              ele.isActive = false;
            }
          })    
        } else {
          this.mudList.forEach((ele, index) => {
            ele.isActive = false;
          })
        }
      }
      if(mud) {
        return mud;   
      } else {
        return '特殊配置选择'
      }            
    },    
    //特殊编码名称
    encodeingName: function() {
      let curName = "";
      if (
        this.activeQuestion.currNode &&
        this.activeQuestion.currNode.questionType == 13
      ) {
        if (this.activeQuestion.currNode.optionDomain) {
          this.codingList.forEach((ele, index) => {
            if (ele.codingVal == this.activeQuestion.currNode.optionDomain) {
              ele.isActive = true;
              curName = ele.codingNam;
            } else {
              ele.isActive = false;
            }
          });
        } else {
          this.codingList.forEach((ele, index) => {
            ele.isActive = false;
          });
        }
      }
      if (curName) {
        return curName;
      } else {
        return "特殊编码库配置选择";
      }
    },
    //添加题添加删除
    addDeleteName: function() {
      debugger
      var name = false;
      if (!this.activeQuestion && !this.activeQuestion.currNode) {
        return;
      }
      this.activeQuestion.currNode.optionList.forEach(ol => {
        if (ol.optionType == "62") {
          name = ol.aliasName;
        }
      });
      return name;
    },
    //添加题目+名称
    addAddName: function() {
      var name = "";
      if (!this.activeQuestion && !this.activeQuestion.currNode) {
        return;
      }
      this.activeQuestion.currNode.optionList.forEach(ol => {
        if (ol.optionType == "61") {
          name = ol.aliasName;
        }
      });
      return name;
    },
    //引用结果添加题
    hasRelateOption: function() {
      var flag = false;
      this.activeQuestion.currNode.optionList.forEach(ol => {
        if (ol.optionType == "23") {
          flag = true;
        }
      });
      return flag;
    },
    //添加题序号
    hasSequenceOption: function() {
      var flag = false;
      this.activeQuestion.currNode.optionList.forEach(ol => {
        if (ol.optionType == "24") {
          flag = true;
        }
      });
      return flag;
    },
    //添加题可更换
    addChangeName: function() {
      var name = false;
      if (!this.activeQuestion && !this.activeQuestion.currNode) {
        return;
      }
      this.activeQuestion.currNode.optionList.forEach(ol => {
        if (ol.optionType == "63") {
          name = ol.aliasName;
        }
      });
      return name;
    },
    //表格题排序添加请选择提示
    sortFieldArr: function() {
      let arr = [];
      if (
        this.activeQuestion &&
        this.activeQuestion.currNode &&
        this.activeQuestion.currNode.questionType == 41
      ) {
        if (this.activeQuestion && this.activeQuestion.childList) {
          arr = $.extend([], [], this.activeQuestion.childList);
          arr.splice(0, 0, {
            currNode: { aliasType: "2", catalogueName: "请选择" }
          });
          return arr;
        } else {
          arr.splice(0, 0, {
            currNode: { aliasType: "2", catalogueName: "请选择" }
          });
          return arr;
        }
      }
      return arr;
    },
    arrClasses: function() {
      let arr = [];
      let currNode = this.activeQuestion.currNode
      if ( currNode && currNode.questionType == 90) {
        if(currNode.classes && tcurrNode.classes.length > 0) {
          currNode.classes.forEach((ele, i) => {
            arr.push(ele.substr(13, 2))
          })
        } 
        return arr;
      };
      return arr;     
    }
  },
  methods: {  
      // 互斥题目下拉选择
      selQuestion(item) {
        debugger
        this.isSaveMutexFlag = true;
        if(item.isActive) { 
          item.isActive = false;
          this.activeQuestion.currNode.mutexList.forEach((ele, index) => {
            if(ele.uniqueId == item.uniqueId) {
              this.activeQuestion.currNode.mutexList.splice(index, 1)    
            }
          })
        } else {
          item.isActive = true;
          if(this.activeQuestion.currNode.mutexList) {
            this.activeQuestion.currNode.mutexList.push( {'uniqueId': item.uniqueId, 'hierarchyCode': item.hierarchyCode, 'aliasName': item.aliasName} )
          } else {
            this.$set(this.activeQuestion.currNode, 'mutexList', [])
            this.activeQuestion.currNode.mutexList.push( {'uniqueId': item.uniqueId, 'hierarchyCode': item.hierarchyCode, 'aliasName': item.aliasName} )            
          }
        } 
        let mutexListData = this.activeQuestion.currNode.mutexList;
        if(mutexListData && mutexListData.length > 0) {
          this.treeList.forEach((element) => {
            mutexListData.forEach((ele) => {
              if(element.uniqueId == ele.uniqueId) {
                element.isActive = true;
              } 
            })  
          }) 
        }          
      },    
      getQuestionTree() {
        const that = this;
        if(this.evaluationId) {
          common.ajax({
            url: "knowledge-service/evaluation/paper2/" + this.evaluationId + "/sketch",
            dataType: "json",
            type: "get",
            async: false,
            callback: function(res) {
              that.questionList = res.questionList;
              that.treeList = [];
              that.getQuestionList(that.questionList);
              // console.log(that.treeList)
            }
          });
        }
      },   
      getQuestionList: function(obj) {
        obj.forEach((ele) => {
          if(ele.childList && ele.childList.length > 0) {
            this.treeList.push({ 'uniqueId': ele.uniqueId, 'hierarchyCode': ele.hierarchyCode, 'aliasName': ele.aliasName, 'isActive': false }) 
            this.getQuestionList(ele.childList)        
          } else {
            this.treeList.push({ 'uniqueId': ele.uniqueId, 'hierarchyCode': ele.hierarchyCode, 'aliasName': ele.aliasName, 'isActive': false })
          }
        })
      },           
      clearCurUnique(mutexListData, curUniqueId) {
        debugger
        if(mutexListData && mutexListData.length > 0) {
          mutexListData.forEach((ele, i) => {
            if(ele.uniqueId == curUniqueId) {
              mutexListData.splice(i, 1)    
            }
          })   
        }       
        this.getQuestionTree();
        let treeListData = this.treeList;
        if(treeListData && treeListData.length > 0) {
          treeListData.forEach((ele, i) => {
            if(ele.uniqueId == curUniqueId) {
              treeListData.splice(i, 1)    
            }
          })   
        }              
      },   
      unique: function(array) {
        // 数组去重
        var temp = [];
        for (var i = 0; i < array.length; i++) {
          if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
          }
        }
        return temp;
      },         
      saveMutex() {
        let mutexList = [];
        this.treeList.forEach((ele) => {
          if(ele.isActive) {
            mutexList.push(ele.uniqueId)
          }
        })
        mutexList = this.unique(mutexList);
        let data = {
          'uniqueId': this.activeQuestion.currNode.uniqueId,
          'mutexList': mutexList
        }
        const that = this;
        common.ajax({
          url: "knowledge-service/evaluation/paper2/mutex",
          dataType: "json",
          type: "put",
          data: JSON.stringify(data),
          callback: function(problems) {
            common.tip_msg("保存成功",1000);
            that.isSaveMutexFlag = false;
          }
        });         
      },        
    openQuestionTree(mutexListData, curUniqueId) {
      this.isOpenQuestionTree = true;
      this.clearCurUnique(mutexListData, curUniqueId);

      if(this.treeList && this.treeList.length > 0 ) {
        this.treeList.forEach((ele, index) => {
          ele.isActive = false;
        })
      }
      if(mutexListData && mutexListData.length > 0) {
        this.treeList.forEach((element) => {
          mutexListData.forEach((ele, index) => {
            if(element.uniqueId == ele.uniqueId) {
              element.isActive = true;
            }
          })  
        }) 
      } else {
        this.treeList.forEach((ele) => {
          ele.isActive = false;
        })            
      }
    },    
    leaveSaveData() {
      this.isOpenQuestionTree = false
      if(this.isSaveMutexFlag) {
        this.saveMutex();            
      }
    },
    saveClasses: function() {
      let arrClasses = [];
      if(this.classes.length > 0) {
        this.classes.forEach((ele, index) => {
          if(ele === '白班') {
            arrClasses.push('{"type":1,"name":"白班","limit":"x>=7&&x<=15"}')
          } 
          if (ele === '夜班') {
            arrClasses.push('{"type":3,"name":"夜班","limit":"x>23||x<7"}')
          } 
          if(ele === '晚班') {
            arrClasses.push('{"type":2,"name":"晚班","limit":"x>15&&x<=23"}')
          } 
          if (ele === '总量') {
            arrClasses.push('{"type":4,"name":"总量","limit":"x>=0&&x<=24"}')
          }
        })
      }
      this.activeQuestion.currNode.classes = arrClasses;
      this.saveQuestion();
    },
    visibleChange: function(ev) {
      if(!ev) {
        this.saveClasses();
      }
    },
    removeTag: function(ev) {
      this.saveClasses();
    },
    changeSelectTime: function() {
      this.saveQuestion();
    },
    // 填空题默认内容添加
    saveDefault: function(item, val) {
      if (item.blankFiller) {
        item.blankFiller = val;
      } else {
        this.$set(item, "blankFiller", val);
      }
      item.defaultType = "1";
      this.saveQuestion();
    },
    leaveEncodeing() {
      this.isCodeingOpen = false;
    },
    leaveAssessmentList() {
      this.isAssessmentListOpen = false;
    },
    selAssessment: function(item, optionItem, optionIndex) {
      const that = this;
      let assessmentDetail = {
        "relateName": item.fileName,
        "isDynamic": this.dynamicFlag,
        "isOnce": this.isOnce ? 1 : 0,
        "optionId": optionItem.optionId,
        "popupType": 0,
        "questionId": optionItem.questionId,
        "relateType": item.evalutionType,
        "specialType": null,
        "stepUrl": ""
      }
      if(!item.isActive) {
        if(this.assessmentList && this.assessmentList.length > 0) {
          this.assessmentList.forEach((ele) => {
            ele.isActive = false
          })
        }        
        item.isActive = true;      
        if(optionItem.specialShareRes && optionItem.specialShareRes.relateName) {
          assessmentDetail.specialShareId =  optionItem.specialShareRes.specialShareId   
          optionItem.specialShareRes = assessmentDetail
        } else {
          this.$set(optionItem, 'specialShareRes', assessmentDetail)  
        }
      } else {
        if(optionItem.specialShareRes) {
          assessmentDetail = optionItem.specialShareRes
        }        
        item.isActive = false;
        for(var k in assessmentDetail){
          if(k != 'specialShareId')  {
            assessmentDetail[k] = null;
          }        
        }
        if(optionItem.specialShareRes) {
          optionItem.specialShareRes = null;          
        }
      }
      common.ajax({
        url: "knowledge-service/evaluation/question/option/step",
        dataType: "json",
        type: "post",
        data: JSON.stringify(assessmentDetail),
        callback: function(problems) {
          optionItem.specialShareRes = problems;  
          common.tip_msg("保存成功", 1000);
          that.isAssessmentListOpen = false;
        }
      });

    },
    //选择问题
    getQuestionCode(obj) {
      let that = this;
      this.activeQuestion.currNode.aliasType = 2;
      $.extend(true, this.activeQuestion.currNode, obj);
      this.saveQuestion();
    },
    //下拉框选择字段
    selectSort: function(sortItem, type) {
      debugger;
      if (type == "sortType" && sortItem.sortType) {
        this.activeQuestion.currNode.sortType = sortItem.sortType;
        this.saveQuestion();
      } else if (
        type == "sortField" &&
        sortItem.currNode &&
        sortItem.currNode.questionId
      ) {
        this.activeQuestion.currNode.sortField = sortItem.currNode.questionId;
        this.saveQuestion();
      } else if (type == "linkDict") {
        if (!sortItem.dicItemKey) {
          this.activeQuestion.currNode.linkFlag = "";
        } else {
          this.activeQuestion.currNode.linkFlag = sortItem.dicItemKey;
        }
        this.saveQuestion();
      } else if (type == "specialDict") {
        if (!sortItem.dicItemKey) {
          this.activeQuestion.currNode.specialFlag = "";
        } else {
          this.activeQuestion.currNode.specialFlag = sortItem.dicItemKey;
        }
        this.saveQuestion();
      }
    },
    //关闭搜索下拉框
    closePop: function() {
      if (this.$refs.questionSearch) {
        this.$refs.questionSearch.blur_();
      }
      if (this.$refs.optionSearch && this.$refs.optionSearch.length > 0) {
        this.$refs.optionSearch.forEach(function(el) {
          el.blur_();
        });
      }
    },
    inputValue: function(event) {
      // console.log("input-text");
      this.activeQuestion.currNode.style.width = $(event.currentTarget).val();
    },
    //删除选项
    delOptionItem: function(index, item) {
      this.activeQuestion.currNode.optionList.splice(index, 1);
      this.saveQuestion();
    },
    //说明题保存备注
    saveImage: function(filePaths, content) {
      //debugger;
      this.activeQuestion.currNode.filePaths = filePaths;
      Vue.set(this.activeQuestion.currNode, "filePaths", filePaths);
      Vue.set(this.activeQuestion.currNode, "remarksContent", content);
      this.saveQuestion();
    },
    //选择单位
    choseUnit(obj, index, parentIndex) {
      $.extend(
        true,
        this.activeQuestion.currNode.optionList[parentIndex].unitList[index],
        { unitCode: obj.unitCode, unitName: obj.unitName }
      );
      this.saveQuestion();
    },
    choseUnitOne(obj, index, parentIndex) {
      this.activeQuestion.currNode.optionList[parentIndex].unitList = [
        { unitCode: obj.unitCode, unitName: obj.unitName }
      ];
      this.saveQuestion();
    },
    //选择导入控件的项目
    choseImportControl: function(event, item, optionItem) {
      let obj = $(event.currentTarget);
      if (!obj.hasClass("active")) {
        optionItem.controlList.push(item);
      } else {
        optionItem.controlList = optionItem.controlList.filter(al => {
          return al.controlType != item.controlType;
        });
      }
      this.saveQuestion();
    },
    //删除导入控件的项目
    deleteControlItem: function(item, optionItem) {
      optionItem.controlList = optionItem.controlList.filter(al => {
        return al.controlType != item.controlType;
      });
      this.saveQuestion();
    },
    getControlClass: function(item, optionItem) {
      if (
        optionItem.controlList.some(al => {
          return al.controlType == item.controlType;
        })
      ) {
        return "active";
      } else {
        return "";
      }
    },
    //全选所有的导入体征
    checkAllImportControl: function(event, optionItem) {
      //debugger;
      let obj = $(event.currentTarget);
      if (!obj.hasClass("active")) {
        optionItem.controlList = this.importControlList;
      } else {
        optionItem.controlList = [];
      }
      this.saveQuestion();
    },
    //根据输入值获取样式
    getFillCheckeClass(optionItem, str) {
      if (optionItem.checkList && optionItem.checkList.inputType) {
        if(str == 'optionTypeCheck') {
          return "am-txt-primary control-item";
        } else {
          return "am-txt-primary";
        }
      } else {
        if(str == 'optionTypeCheck') {
          return "am-txt-normal control-item"
        } else {
          return "am-txt-normal";
        }
      }
    },
    getBmiClass(optionItem) {
      if(optionItem.formula) {
        return "am-txt-primary";
      } else {
        return "am-txt-normal";
      }
    },
    getOptionNoteClass(item) {
      if(item.optionNote) {
        return "am-txt-primary";
      } else {
        return "am-txt-normal";
      }
    },
    getFillCheckTitle(optionItem) {
      if (optionItem.checkList) {
        return ""; //这里是否要提示校验内容
      } else {
        return "添加校验";
      }
    },
    //选择高度
    choseH(obj, index) {
      Vue.set(
        this.activeQuestion.currNode.optionList[index].style,
        "height",
        obj.code
      );
      this.saveQuestion();
    },
    //增加单位
    addUnit(optinIndex) {
      this.activeQuestion.currNode.optionList[optinIndex].unitList.push({
        otherDescription: "",
        unitCode: ""
      });
      this.saveQuestion();
    },
    //设置单位
    showUnit(optionIndex) {
      let that = this;
      let obj = $(event.currentTarget);
      //1表示有单位  2表示无单位
      let default_ = "1";
      if (obj.hasClass("active")) {
        default_ = "2";
        that.activeQuestion.currNode.optionList[optionIndex].unitList = [];
      } else {
        if (
          this.activeQuestion.currNode.optionList[optionIndex].unitList
            .length == 0
        ) {
          this.activeQuestion.currNode.optionList[optionIndex].unitList.push({
            otherDescription: "",
            unitCode: "HKU000001",
            unitName: "%"
          });
        }
      }
      Vue.nextTick(function() {
        if (default_ == "2") {
          that.activeQuestion.currNode.optionList[optionIndex].unitList = [];
        }
      });
      this.saveQuestion();
    },
    //删除单位
    delInputUnit: function(index, optionIndex) {
      this.activeQuestion.currNode.optionList[optionIndex].unitList.splice(
        index,
        1
      );
    },
    //图片题，设置图片数量
    chosePictureCount(obj, index) {
      Vue.set(
        this.activeQuestion.currNode.optionList[index].checkList,
        "pictureCount",
        obj.code
      );
      this.saveQuestion();
    },
    //图片题,设置图片大小
    chosePictureSize(obj, index) {
      Vue.set(
        this.activeQuestion.currNode.optionList[index].checkList,
        "pictureSize",
        obj.code
      );
      this.saveQuestion();
    },
    //图片题，设置图片格式
    chosePictureFormat(obj, index) {
      Vue.set(
        this.activeQuestion.currNode.optionList[index].checkList,
        "pictureFormat",
        obj.code
      );
      this.saveQuestion();
    },
    choseWByIndex(obj, index) {
      // console.log("设置填空题宽度" + obj.code);
      Vue.set(this.activeQuestion.childList[index].currNode, "width", obj.code);
    },
    choseMstyle(obj) {
      // console.log(obj);
      Vue.set(this.activeQuestion.currNode.style, "link", obj.code);
      this.saveQuestion();
    },
    choseMyLogic(obj, index) {
      Vue.set(
        this.activeQuestion.currNode.optionList[index],
        "logicMode",
        obj.code
      );
      this.saveQuestion();
    },
    chosekeyboradType(obj, index) {
      Vue.set(this.activeQuestion.currNode.optionList[index], "keyboardType", obj.code);
      this.saveQuestion();
    },     
    choseSex: function(obj) {
      Vue.set(this.activeQuestion.currNode, "sexType", obj.code);
      // console.log("choseSex这里的" + this.activeQuestion.currNode.sexType);
    },
    //添加子项
    addSubItem: function(optionItem, index) {
      let ss = this.activeQuestion.currNode.optionList[index];
      Bus.$emit("addSubItem", optionItem);
    },
    //时间加减题设置默认值
    setDefaultValue(event, index) {
      let val = $(event.currentTarget).val();
      Vue.set(
        this.activeQuestion.currNode.optionList[index],
        "defaultValue",
        val
      );
      this.saveQuestion();
    },
    //时间题设置
    addTimeCheck(event, index, type) {
      let isChecked = 0;
      let obj = $(event.currentTarget);
      if (!obj.hasClass("active")) {
        isChecked = 1;
      }
      if (type == "timeLimit") {
        Vue.set(
          this.activeQuestion.currNode.optionList[index],
          "timeLimit",
          isChecked
        );
      } else if (type == "defaultTime") {
        Vue.set(
          this.activeQuestion.currNode.optionList[index],
          "defaultTimeType",
          isChecked
        );
      }
      this.saveQuestion();
    },
    //选择时间设置
    choseTimeFormat(obj, index) {
      let newTime = new Date().format(obj.code);
      Vue.set(this.activeQuestion.currNode.optionList[index], "time", newTime);
      this.activeQuestion.currNode.optionList[index].timeFormat = obj.code;
      this.saveQuestion();
    },
    //时间加减
    addTimeAddOrMutil(event, index) {
      let obj = $(event.currentTarget);
      let value = "";
      if (!obj.hasClass("active")) {
        value = "1";
      }
      this.activeQuestion.currNode.optionList[index].quantity = "";
      Vue.set(this.activeQuestion.currNode.optionList[index], "addType", value);
      console.log(this.activeQuestion.currNode);
      this.saveQuestion();
    },
    //时间设置
    checkTimeFlag: function(event, index) {
      let obj = $(event.currentTarget);
      let value = "1";
      if (!obj.hasClass("active")) {
        value = "0";
      }
      Vue.set(
        this.activeQuestion.currNode.optionList[index],
        "timeFlag",
        value
      );
      this.saveQuestion();
    },
    //校验
    validNumber: function(event) {
      let obj = $(event.currentTarget);
      let value = obj.val();
      let newValue = value.replace(/[^\d]/g, "");
      obj.val(newValue);
    },
    //设置宽度
    setWidth(event, item, index) {
      let val = $(event.currentTarget).val();
      Vue.set(item.style, "width", val);
      this.saveQuestion();
    },
    //设置宽度
    setMargin(event, item, index) {
      let val = $(event.currentTarget).val();
      debugger;
      Vue.set(item.style, "margin", val);
      this.saveQuestion();
    },
    //没有style对象时，设置宽度
    setWidthaa(event, item, index) {
      debugger;
      let val = $(event.currentTarget).val();
      if (!item.style) {
        Vue.set(item, "style", {});
        Vue.set(item.style, "width", val);
      }
      if (item.style && !item.style.width) {
        Vue.set(item.style, "width", val);
      }
      this.saveQuestion();
    },
    setMarginNoObj(event, item, index) {
      debugger;
      let val = $(event.currentTarget).val();
      if (!item.style) {
        Vue.set(item, "style", {});
        Vue.set(item.style, "margin", val);
      }
      if (item.style && !item.style.margin) {
        Vue.set(item.style, "margin", val);
      }
      this.saveQuestion();
    },
    //设成默认选中
    addDefault(index, item) {
      //debugger;
      let obj = $(event.currentTarget);

      let default_ = "1";
      if (obj.hasClass("active")) {
        default_ = "2";
      }
      // 下拉题选项默认可以多选条件添加
      if (
        this.activeQuestion.currNode.questionType != "20" &&
        default_ == "1" &&
        this.activeQuestion.currNode.questionType != "14"
      ) {
        this.activeQuestion.currNode.optionList.forEach(function(el) {
          Vue.set(el, "defaultType", "2");
        });
      }

      Vue.set(
        this.activeQuestion.currNode.optionList[index],
        "defaultType",
        default_
      );
      this.saveQuestion();
    },
    //增加选项类型
    addOptionType: function(index, item) {
      let obj = $(event.currentTarget);
      let value = "1";
      if (!obj.hasClass("active")) {
        value = "2";
      } else {
        item.unitList = [];
      }
      this.activeQuestion.currNode.optionList[index].optionType = value;
      Vue.set(
        this.activeQuestion.currNode.optionList[index],
        "optionType",
        value
      );
      this.saveQuestion();
    },
    // 增加是否换行
    addLineFeedNum: function(index, item) {
      let obj = $(event.currentTarget);
      let value = 0;
      if (!obj.hasClass("active")) {
        value = 1;
      }
      if (this.activeQuestion.currNode.optionList[index].lineFeed) {
        this.activeQuestion.currNode.optionList[index].lineFeed = value;
      } else {
        Vue.set(
          this.activeQuestion.currNode.optionList[index],
          "lineFeed",
          value
        );
      }
      this.saveQuestion();
    },
    addExpressType: function(index, item) {
      let obj = $(event.currentTarget);
      let value = 'sum';
      if (!obj.hasClass("active")) {
        value = 'total';
      }
      if (this.activeQuestion.currNode.optionList[index].expressionType) {
        this.activeQuestion.currNode.optionList[index].expressionType = value;
      } else {
        Vue.set(
          this.activeQuestion.currNode.optionList[index],
          "expressionType",
          value
        );
      }
      this.saveQuestion();
    },
    // 标签题导航定位
    addNavLocation: function(event) {
      let obj = $(event.currentTarget);
      let navLocation = 1;
      if (obj.hasClass("active")) {
        navLocation = 0;
      }
      Vue.set(this.activeQuestion.currNode, "navLocation", navLocation);
      this.saveQuestion();
    },
    // 添加实时获取
    addRealTime: function(index, item) {
      debugger;
      let obj = $(event.currentTarget);
      let realTime = 1;
      if (obj.hasClass("active")) {
        realTime = 0;
      }
      Vue.set(this.activeQuestion.currNode, "realTime", realTime);
      this.saveQuestion();
    },
    //添加帮助
    addHelp(helpType, optionIndex, optionItem) {
      this.$emit(
        "addHelp",
        helpType,
        optionIndex,
        optionItem,
        this.activeQuestion,
        this.subRelateNode
      );
    },
    addNote(optionIndex, optionItem) {
      this.$emit(
        "addNote",
        optionIndex,
        optionItem,
        this.activeQuestion,
      );
    },
    // 添加bmi公式
    addBMI(optionIndex, optionItem) {
      this.$emit("addBMI", optionIndex, optionItem, this.activeQuestion);
    },
    //添加备注
    addRemark: function() {
      this.$emit("addRemark", this.activeQuestion, this.subRelateNode);
    },
    //添加组句
    addGroup: function(groupType, optionIndex, optionItem) {
      this.$emit(
        "addGroupSentence",
        groupType,
        optionIndex,
        optionItem,
        this.activeQuestion,
        this.subRelateNode
      );
    },
    //添加附属题
    addAttachQuestion: function() {
      this.$emit("addAttachQuestion");
    },
    //添加校验
    addVerify(index, item) {
      this.$emit(
        "addVerify",
        index,
        item,
        this.activeQuestion,
        this.subRelateNode
      );
    },
    //添加提示
    addTips: function(index, item) {
      this.$emit(
        "addTips",
        index,
        item,
        this.activeQuestion,
        this.subRelateNode
      );
    },
    //添加共享
    addShare() {
      this.$emit("addShare", this.activeQuestion, this.subRelateNode);
    },
    //添加出入量配置
    addInOutConfig() {
      this.$emit("addInOutConfig", this.activeQuestion, this.subRelateNode);
    },
    //添加题 更换 删除
    setQuestionOptionValue: function(type) {
      var optionType;
      if (type == "del") {
        optionType = 62;
      } else if (type == "change") {
        optionType = 63;
      } else {
        return;
      }
      var op = this.activeQuestion.currNode.optionList.find(op => {
        return op.optionType == optionType;
      });
      if (op) {
        Vue.set(op, "aliasName", event.currentTarget.value);
      }
    },
    //获取选择的选项
    getOptionCode(obj, index) {
      obj.aliasType = 2;
      $.extend(true, this.activeQuestion.currNode.optionList[index], obj);
      this.saveQuestion();
    },
    //保存添加题
    saveAddAddOption: function(event) {
      var value = event.currentTarget.value;
      this.optionIdAll++;
      let optionId = "o-" + this.optionIdAll;
      Bus.$emit("addAddOption", optionId, this.activeQuestion, value);
    },
    //添加选项
    addOption() {
      this.optionIdAll++;
      Bus.$emit("addOption", this.optionIdAll, this.activeQuestion);
    },
    //添加题
    addQuestionOption: function(type) {
      var optionType;
      if (type == "del") {
        optionType = 62;
      } else if (type == "change") {
        optionType = 63;
      } else if (type == "relate") {
        optionType = 23;
      } else if (type == "sequence") {
        optionType = 24;
      } else {
        return;
      }
      if ($(event.currentTarget).hasClass("active")) {
        this.activeQuestion.currNode.optionList = this.activeQuestion.currNode.optionList.filter(
          op => {
            return op.optionType != optionType;
          }
        );
        debugger
        this.saveQuestion();
      } else {
        if (
          this.activeQuestion.currNode.optionList.find(op => {
            return op.optionType == optionType;
          })
        ) {
          $(event.currentTarget).toggleClass("active");
          return;
        }

        let isActive = $(event.currentTarget).hasClass("active");
        this.optionIdAll++;
        let param = {
          isActive: isActive,
          optionIdAll: this.optionIdAll,
          optionType: optionType,
          aliasName: $(event.currentTarget)
            .next("input")
            .val()
        };
        Bus.$emit("addQuestionOption", type, param, this.activeQuestion);
      }
      $(event.currentTarget).toggleClass("active");
    },
    //点击必答
    addCheck(event) {
      debugger;
      let obj = $(event.currentTarget);
      let checkType = "1";
      if (obj.hasClass("active")) {
        checkType = "2";
      }
      Vue.set(this.activeQuestion.currNode, "checkType", checkType);
      this.saveQuestion();
    },
    // 选项的必答
    addOptionCheck(event, item) {
      let obj = $(event.currentTarget);
      let checkType = "1";
      if (obj.hasClass("active")) {
        checkType = "2";
      }
      Vue.set(item, "checkType", checkType);
      this.saveQuestion();
    },
    getParentData(currNode) {
      let hierarchyCode = currNode.hierarchyCode;
      let hierarchyCodeArr = hierarchyCode.split("|");
      let parQuestionId = hierarchyCodeArr[hierarchyCodeArr.length-2];
    },
    // 是否换行
    addLineFeed(event) {
      let obj = $(event.currentTarget);
      let lineFeed = 1;
      if (obj.hasClass("active")) {
        lineFeed = 0;
      }
      Vue.set(this.activeQuestion.currNode, "lineFeed", lineFeed);
      this.saveQuestion('lineFeed');
    },
    //添加统计
    addStatics(event) {
      let obj = $(event.currentTarget);
      if (obj.hasClass("active")) {
        this.statisticsType = 0;
      } else {
        this.statisticsType = 1;
      }
      this.updataIOStatus();
    },
    //显示明细
    showDetail: function(event) {
      let obj = $(event.currentTarget);
      if (obj.hasClass("active")) {
        this.detailType = 0;
      } else {
        this.detailType = 1;
      }
      this.updataIOStatus();
    },
    //调用保存
    updataIOStatus: function() {
      let that = this;
      let data = {
        detailType: this.detailType,
        evaluationId: this.evaluationId,
        statisticsType: this.statisticsType
      };
      common.ajax({
        url: "knowledge-service/dynamic/evaluation/update/IO/status",
        dataType: "text",
        type: "put",
        data: JSON.stringify(data),
        callback: function(problems) {
          common.tip_msg("保存成功", 1000);
          that.$emit("updateIOStatus", data);
        }
      });
    },
    //获取备注样式
    getRemarkClass: function() {
      if (
        this.activeQuestion.currNode &&
        this.activeQuestion.currNode.questionRemark
      ) {
        return "am-txt-primary";
      } else {
        return "am-txt-normal";
      }
    },
    //获取组样式
    getGroupClass: function(helpType, optionIndex) {
      if (!this.activeQuestion || !this.activeQuestion.currNode) {
        return "am-txt-normal";
      }
      if (helpType == "optionGroup") {
        if (
          optionIndex != undefined &&
          this.activeQuestion.currNode.optionList[optionIndex] &&
          this.activeQuestion.currNode.optionList[optionIndex].sentence &&
          this.activeQuestion.currNode.optionList[optionIndex].sentence
            .displayType == 1
        ) {
          return "am-txt-primary";
        } else {
          return "am-txt-normal";
        }
      } else {
        if (
          this.activeQuestion.currNode.sentence &&
          this.activeQuestion.currNode.sentence.displayType == 1
        ) {
          return "am-txt-primary";
        } else {
          return "am-txt-normal";
        }
      }
    },
    //获取子项样式
    getSubChild: function(optinIndex) {
      let arr = this.activeQuestion.currNode.optionList[optinIndex];
      for (var i = 0; i < arr.hierarchyList.length; i++) {
        let questionId = arr.hierarchyList[i].childQuestionId;
        if (questionId) {
          let node = this.getRelatedNode(questionId);
          if (node) {
            return "am-txt-primary";
          }
        }
      }
      return "am-txt-normal";
    },
    getRelatedNode: function(id) {
      return this.activeQuestion.childList.find(childNode => {
        return childNode.currNode.questionId == id;
      });
    },
    //获取样式
    getHelpClass: function(helpType, optionIndex) {
      //debugger;
      if (!this.activeQuestion || !this.activeQuestion.currNode) {
        return "am-txt-normal";
      }
      if (helpType == "optionHelp") {
        if (
          this.activeQuestion.currNode.optionList[optionIndex].helpContent ||
          (this.activeQuestion.currNode.optionList[optionIndex].filePaths &&
            this.activeQuestion.currNode.optionList[optionIndex].filePaths
              .length > 0)
        ) {
          return "am-txt-primary";
        } else {
          return "am-txt-normal";
        }
      } else {
        if (
          this.activeQuestion.currNode.helpContent ||
          (this.activeQuestion.currNode.filePaths &&
            this.activeQuestion.currNode.filePaths.length > 0)
        ) {
          return "am-txt-primary";
        } else {
          return "am-txt-normal";
        }
      }
    },
    //获取提示样式
    getTipClass: function(optionIndex) {
      if (!this.activeQuestion || !this.activeQuestion.currNode) {
        return "am-txt-normal";
      }
      if (this.activeQuestion.currNode.optionList[optionIndex].placeHolder) {
        return "am-txt-primary";
      } else {
        return "am-txt-normal";
      }
    },
    //获取共享样式
    getShareClass: function() {
      if (!this.activeQuestion || !this.activeQuestion.currNode) {
        return "am-txt-normal";
      }
      if (this.activeQuestion.currNode.isShare) {
        return "am-txt-primary";
      } else {
        return "am-txt-normal";
      }
    },
    //获取帮助
    getHelpTitle: function(helpContent) {
      if (helpContent) {
        return helpContent;
      } else {
        return "添加帮助";
      }
    },
    //获取校验提示
    getCheckTitle: function(checkList) {
      if (checkList && checkList.length > 0 && checkList[0].checkContext) {
        return checkList[0].checkContext;
      } else {
        return "添加填空及校验";
      }
    },
    //初始化位置
    initPositionCheck: function(event) {
      let obj = $(event.currentTarget);
      if (!obj.hasClass("active")) {
        this.initPositionCK = this.activeQuestion.currNode.uniqueId;
      } else {
        this.initPositionCK = "";
      }
      this.$emit("changeInitPosition", this.initPositionCK);
    },
    //拖动
    dragChange: function() {
      this.activeQuestion.currNode.optionList.map((item, index) => {
        item.sort = index + 1;
      });
      this.saveQuestion();
    },
    //开关样式切换
    radioStyleCheck: function(event) {
      let that = this;
      let obj = $(event.currentTarget);
      if (!obj.hasClass("active")) {
        this.questionType = 11;
        Vue.set(this.activeQuestion.currNode, "isSwitch", "1");
        Vue.set(this.activeQuestion.currNode, "questionType", 11);
        if (
          !this.activeQuestion.currNode.optionList.some(al => {
            return al.defaultType == "1";
          })
        ) {
          this.activeQuestion.currNode.optionList[0].defaultType = "1";
        }
      } else {
        this.questionType = 10;
        Vue.set(this.activeQuestion.currNode, "isSwitch", "0");
        Vue.set(this.activeQuestion.currNode, "questionType", 10);
      }
      obj.toggleClass("active");
      this.saveQuestion();
    },
    radioOrCheckBox: function(event, val) {
      let that = this;
      let obj = $(event.currentTarget);
      let questionType = this.activeQuestion.currNode.questionType;
      let currNode = this.activeQuestion.currNode;
      if(val === "radioChange") {
        if (questionType == 10 && !obj.hasClass("active")) {
          Vue.set(currNode, "switchQuestion", "1");
          Vue.set(currNode, "questionType", 20);
        } else if (questionType == 10 && obj.hasClass("active")) {
          Vue.set(currNode, "switchQuestion", "0");
          Vue.set(currNode, "questionType", 20);
        }  
        if (questionType == 20 && !obj.hasClass("active")) {
          Vue.set(currNode, "questionType", 10);
          Vue.set(currNode, "switchQuestion", 3);
        } else if (questionType == 20 && obj.hasClass("active")) {
          Vue.set(currNode, "questionType", 10);
          Vue.set(currNode, "switchQuestion", "0");
        }               
      }
      if(val === "selectChange") {
        if (questionType == 13 && !obj.hasClass("active")) {
          Vue.set(currNode, "questionType", 14);
          Vue.set(currNode, "switchQuestion", "1");
        } else  if(questionType == 14 && obj.hasClass("active")) {
          Vue.set(currNode, "questionType", 13);
          Vue.set(currNode, "switchQuestion", "0");
        }
      }
      if(val === "selectChangeRadio") {
        if (questionType == 13 && !obj.hasClass("active")) {
          Vue.set(currNode, "questionType", 10);
          Vue.set(currNode, "switchQuestion", "5");
        } 
        if(questionType == 14 && !obj.hasClass("active")) {
          Vue.set(currNode, "questionType", 20);
          Vue.set(currNode, "switchQuestion", "6");
        }
      }

      if(val === "fromRadioOrBoxChange") {
        if (questionType == 10 && !obj.hasClass("active")) {
          Vue.set(currNode, "questionType", 13);
          Vue.set(currNode, "switchQuestion", "0");
        } 
        if(questionType == 20 && !obj.hasClass("active")) {
          Vue.set(currNode, "questionType", 14);
          Vue.set(currNode, "switchQuestion", "1");
        }        
      }
          
      this.saveQuestion();
    },
    //隐藏标题设置
    addIsShowTitle(event) {
      /*aliasType 1.显示别名 2.显示默认名称 3.不显示内容*/
      let obj = $(event.currentTarget);
      let aliasType = "3";
      if (obj.hasClass("active")) {
        aliasType = "2";
      }
      Vue.set(this.activeQuestion.currNode, "aliasType", aliasType);
      obj.toggleClass("active");
      this.saveQuestion();
    },
    // 选项标题隐藏
    addOptionShowTitle(index, item) {
      /*aliasType 1.显示别名 2.显示默认名称 3.不显示内容*/
      let obj = $(event.currentTarget);
      let aliasType = "3";
      if (obj.hasClass("active")) {
        aliasType = "2";
      }
      Vue.set(item, "aliasType", aliasType);
      obj.toggleClass("active");
      this.saveQuestion();
    },
    //性别隐藏设置
    isHideSexCheck: function(event) {
      let obj = $(event.currentTarget);
      if (!obj.hasClass("active")) {
        Vue.set(this.activeQuestion.currNode, "sexType", "1");
      } else {
        Vue.set(this.activeQuestion.currNode, "sexType", "10");
      }
      obj.toggleClass("active");
      this.saveQuestion();
    },
    conceal: function(event) {
      let obj = $(event.currentTarget);
      if (!obj.hasClass("active")) {
        Vue.set(this.activeQuestion.currNode, "conceal", "1");
      } else {
        Vue.set(this.activeQuestion.currNode, "conceal", "0");
      }
      obj.toggleClass("active");
      this.saveQuestion();
    },
    //输入标签题的名称
    inputTitleName: function(event) {
      let val = $(event.currentTarget).val();
      this.activeQuestion.currNode.aliasName = val;
      this.activeQuestion.currNode.aliasType = 1;
    },
    //保存问题
    saveQuestion: function(val) {
      console.log(this.currentPage)
      if(val == 'lineFeed' && this.currentPage == "createQuestion") {
        let curQuestionId =  this.activeQuestion.currNode.questionId;
        let parentQuestion = this.$parent.fetchParentNode(curQuestionId);
        let optionListData = parentQuestion.currNode.optionList;
        if(optionListData && optionListData.length>0) {
          optionListData.forEach((ele, i) => {
            if(ele.hierarchyList && ele.hierarchyList.length > 0) {
              ele.hierarchyList.forEach((ele, index) => {
                if(ele.childQuestionId == curQuestionId) {
                  ele.lineFeed = this.activeQuestion.currNode.lineFeed;
                }
              })
            }
          })
        }
      } 
      this.$emit("activeQuestionChange", this.activeQuestion); 
    },
    //获取样式
    getClassC(obj, type) {
      if (!this.activeQuestion.currNode) {
        return "";
      }
      if (type == "check") {
        if (this.activeQuestion.currNode.checkType == "1") {
          return "active";
        }
      } else if (type == "sexCheck") {
        if (
          this.activeQuestion.currNode.sexType &&
          this.activeQuestion.currNode.sexType != "10"
        ) {
          return "active";
        }
      } else if (type == "radioStyle") {
        if (
          this.activeQuestion.currNode.isSwitch &&
          this.activeQuestion.currNode.isSwitch == "1"
        ) {
          return "active";
        }
      } else if (type == "hideTitleCheck") {
        let aliasType = this.activeQuestion.currNode.aliasType;
        if (aliasType == 2 || aliasType == 1) {
          return "";
        } else {
          return "active";
        }
      } else if (type == "default") {
        if (obj.defaultType == "1") {
          return "active";
        }
      } else if (type == "minDate") {
        if (obj.timeLimit == 1) {
          return "active";
        }
      } else if (type == "defaultTime") {
        if (obj.defaultTimeType == 1) {
          return "active";
        }
      } else if (type == "isCheckDel") {
        if (this.activeQuestion.currNode.isCheckDel) {
          return "active";
        }
      } else if (type == "timeAddOrMutil") {
        if (obj.addType == "1") {
          return "active";
        }
      } else if (type == "timeFlag") {
        if (obj.timeFlag == "0") {
          return "active";
        }
      } else if (type == "optionType") {
        if (obj.optionType == "2") {
          return "active";
        }
      } else if (type == "radioCheckStyle") {
        if (
          this.activeQuestion.currNode.switchQuestion &&
          (this.activeQuestion.currNode.switchQuestion == "1" || this.activeQuestion.currNode.switchQuestion == "3")
        ) {
          return "active";
        }
      } else if (type === "selectRadio") {
        if (
          this.activeQuestion.currNode.switchQuestion &&
          (this.activeQuestion.currNode.switchQuestion == "5" || this.activeQuestion.currNode.switchQuestion == "6")
        ) {
          return "active";
        }        
      }else if (type == "statics" && this.statisticsType == 1) {
        return "active";
      } else if (type == "detail" && this.detailType == 1) {
        return "active";
      } else if (
        type == "initPositionStyle" &&
        this.activeQuestion &&
        this.activeQuestion.currNode &&
        this.initPositionCK == this.activeQuestion.currNode.uniqueId
      ) {
        return "active";
      } else if (type == "lineFeed") {
        if (
          !obj &&
          this.activeQuestion.currNode.lineFeed &&
          this.activeQuestion.currNode.lineFeed == "1"
        ) {
          return "active";
        }
        if (obj && obj.lineFeed && obj.lineFeed == "1") {
          return "active";
        }
      } else if (type == "addNavLocation") {
        if (
          !obj &&
          this.activeQuestion.currNode.navLocation &&
          this.activeQuestion.currNode.navLocation == "1"
        ) {
          return "active";
        }
      } else if (type == "realTime") {
        if (
          !obj &&
          this.activeQuestion.currNode.realTime &&
          this.activeQuestion.currNode.realTime == "1"
        ) {
          return "active";
        }
      } else if (type == "optionCheck") {
        if(obj && obj.checkType == '1' ) {
          return "active"
        }
      } else if(type == "hideOptionTitleCheck") {
        if(obj && obj.aliasType == '3') {
          return "active"
        }
      } else if(type == "expressType") {
        if(obj && obj.expressionType == 'total') {
          return "active"
        }        
      } else if(type == "conceal") {
        if(!obj && this.activeQuestion.currNode.conceal == '1') {
          return "active"
        }
      }
      return "";
    },
    // 打开时间限制选择列表
    openSelList: function(n) {
      this.curTimeindex = n;
      this.isOpen = !this.isOpen;
      if (!this.isOpen) {
        Vue.set(
          this.activeQuestion.currNode.optionList[this.curTimeindex],
          "timeLimit",
          this.tLimit
        );
        this.saveQuestion();
      }
    },
    selCurTime: function(item) {
      item.isActive = !item.isActive;
    },
    leaveTime: function() {
      this.isOpen = false;
      Vue.set(
        this.activeQuestion.currNode.optionList[this.curTimeindex],
        "timeLimit",
        this.tLimit
      );
      this.saveQuestion();
    },
    getLimitTime: function() {
      this.limitTime.forEach((ele, i) => {
        ele.isActive = false;
      });
      if (this.activeQuestion.currNode.questionType === "90") {
        if (this.activeQuestion.currNode.optionList[0].timeLimit) {
          this.activeQuestion.currNode.optionList[0].timeLimit
            .split(",")
            .forEach((ele, i) => {
              if (ele == "1") {
                this.limitTime[0].isActive = true;
              }
              if (ele == "2") {
                this.limitTime[1].isActive = true;
              }
              if (ele == "3") {
                this.limitTime[2].isActive = true;
              }
            });
        }
      }
    },
    getClaeese: function() {
      if(this.activeQuestion.currNode.questionType === "90") {
        if(this.activeQuestion.currNode.classes && this.activeQuestion.currNode.classes.length > 0) {
          let newClasses = [];
          this.activeQuestion.currNode.classes.forEach((ele, index) => {
            newClasses.push(ele.name)
          })
          this.classes = newClasses;
        } else {
          this.classes = [];
        }
      }
    },
    // 江苏省人民医院特殊编码下拉控制
    codeingOpen() {
      this.isCodeingOpen = !this.isCodeingOpen;
    },
    // 跳转url配置
    assessmentOpen(optionItem) {
      this.isAssessmentListOpen = !this.isAssessmentListOpen;
      if(optionItem.specialShareRes && optionItem.specialShareRes.relateName) {
        this.assessmentList.forEach((ele) => {
          if(ele.fileName == optionItem.specialShareRes.relateName) {
            ele.isActive = true;
          } else {
            ele.isActive = false;
          }
        })
      }
    },
    mudOpen() {
      this.isMudOpen = !this.isMudOpen;
    },
    selMudVal(item, currNode) {

      if(item.isActive) {
        item.isActive = false;
        currNode.mud = null;
        this.curMudVal = "";
      } else {
        this.mudList.forEach((ele, index) => {
          ele.isActive = false;
        })
        item.isActive = true;
        if(currNode.mud) {
          currNode.mud = item.dicItemKey;   
        } else {
          this.$set(currNode, 'mud', item.dicItemKey)    
        }
        this.curMudVal = item.dicItemValue;
      }
      this.isMudOpen = false;
      this.saveQuestion();
    },        
    // 特殊编码选择
    selCodeingVal(item, currNode) {
      if (item.isActive) {
        if (currNode.optionDomain) {
          currNode.optionDomain = null;
        }
        this.curCodeingVal = "特殊编码库配置选择";
      } else {
        this.codingList.forEach((ele, index) => {
          ele.isActive = false;
        });
        item.isActive = true;
        if (currNode.optionDomain) {
          currNode.optionDomain = item.codingVal;
        } else {
          this.$set(currNode, "optionDomain", item.codingVal);
        }
        this.curCodeingVal = item.codingNam;
      }
      this.isCodeingOpen = false;
      this.saveQuestion();
    },       
  },
  components: {
    guide: guide,
    search: search,
    selectT: selectT,
    draggable,
    imageUpload: imageUpload,
    selectRight: selectRight,
    cascaderSearch: cascaderSearch
  },
  mounted: function() {
    this.getLimitTime();
    this.getClaeese();
    this.optionIdAll = 0;
    this.getQuestionTree();
  },
  watch: {
    currentQuestion: {
      handler: function(val, oldVal) {
        debugger
        this.activeQuestion = val;
        this.getLimitTime();
        this.getClaeese();
      },
      deep: true
    },
    limitTime: {
      deep: true,
      handler: function(nVal, oVal) {
        let tiemLimit = "";
        nVal.forEach((ele, index) => {
          if (ele.isActive) {
            tiemLimit += ele.conTime + ",";
          }
        });
        tiemLimit = tiemLimit.substring(0, tiemLimit.length - 1);
        this.tLimit = tiemLimit;
      }
    }
  }
};
</script>

<style scoped>
.am-ctr-native-chk span {
  font-size: 12px;
}
.topic-layout-right .item-list li {
  padding: 0px 10px 0;
}
.time-wrap {
  height: 93px;
  background: #fff;
  width: 140px;
  position: absolute;
  color: #333;
  z-index: 10;
  top: 120px;
  left: 10px;
  display: none;
}
.timeLimit .active {
  display: block;
}
.timeLimit .am-ctr-native-chk.active {
  height: 30px;
  line-height: 30px;
}
.pd {
  padding-top: 10px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 170px;
}
</style>
