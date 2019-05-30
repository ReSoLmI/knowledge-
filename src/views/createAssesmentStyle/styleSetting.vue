<template>
  <div>
        <menuTemplate ref="leftmenu" :currentPage="currentPage"></menuTemplate>
        <div class="am-page-rcont bg-main">
            <div class="am-page-pd">
                <div class="book-top-cont">
                    <div class="book-top-return">
                        <a class="txt-return" @click.stop="returnBack()">返回</a>
                        <div class="h5">
                        <template v-if="!isEditAssesmentName">{{evaluationName}}
                            <i class="i-link-upd am-ml-5" style="margin-top: -2px;"  @click.stop="clickEditAssesment"></i>
                        </template>
                        <template v-if="isEditAssesmentName" >
                            <input type="text" class="input-text w180" id="inputAssesment" v-model="evaluationName" @blur="editAssesmentName()"/>
                            <a @click.stop="editAssesmentName()" >保存</a>
                        </template>
                        </div>
                    </div>
                    <div class="step-list-cont">
                        <ul class="step-list">
                            <li class="active">
                                <i class="num">1</i><span class="txt">新建或选择模版</span>
                            </li>
                            <li class="cur">
                                <i class="num">2</i><span class="txt">文书样式</span>
                            </li>                            
                            <li class="active">
                                <i class="num">3</i><span class="txt">配置文书内容</span>
                            </li>
                            <li>
                                <i class="num">4</i><span class="txt">列表设置</span>
                            </li>
                            <li>
                                <i class="num">5</i><span class="txt">科室设置</span>
                            </li>
                            <li>
                                <i class="num">6</i><span class="txt">编辑域设置</span>
                            </li>                                                        
                        </ul>
                        <div class="right">
                            <div class="am-btn am-btn-info am-ml-10" @click="saveStyles(saveList)">保存</div>
                            <div class="am-btn am-btn-info am-ml-10" @click.stop="nextStep()">下一步</div>
                        </div>
                    </div>
                </div>
                <div class="word-panel">
                    <ul class="word-set-list">
                        <li data-index='0' :class="activeTab==0?'active':''" v-on:click="changeTab($event)">
                            <h5>全局样式</h5>
                            <p>{{saveList.global.directionName | directionFilter}}，{{saveList.global.columnWide}}px，
                                <!-- {{saveList.global.backgroud}}， -->
                                <!-- {{saveList.global.columns}}列， -->
                                {{segmentLine | segmentFilter}}，{{saveList.global.pageHeader | pageHeader}}，{{saveList.global.pageFooter | pageFooter}}</p>
                        </li>
                        <li data-index='1' :class="activeTab==1?'active':''" v-on:click="changeTab($event)">
                            <h5>标题样式</h5>
                            <p>{{saveList.headline.fontName}}，{{saveList.headline.fontSize}}，{{saveList.headline.fontColor}}，
                                {{saveList.headline.rowHeight}}，{{saveList.headline.arrangeName}}
                            </p>
                        </li>
                        <li data-index='2' :class="activeTab==2?'active':''" v-on:click="changeTab($event)">
                            <h5>标签样式</h5>
                            <p>{{saveList.label.fontName}}，{{saveList.label.fontSize}}，{{saveList.label.fontColor}}，
                                {{saveList.label.rowHeight}}，{{saveList.label.arrangeName}}
                            </p>
                        </li>
                        <li data-index='3' :class="activeTab==3?'active':''" v-on:click="changeTab($event)">
                            <h5>题目设置</h5>
                            <p>{{saveList.question.fontName}}，{{saveList.question.fontSize}}，{{saveList.question.fontColor}}，
                                {{saveList.question.rowHeight}}，{{saveList.question.arrangeName}}
                            </p>
                        </li>
                        <li data-index='4' :class="activeTab==4?'active':''" v-on:click="changeTab($event)">
                            <h5>选项设置</h5>
                            <p>{{saveList.option.fontName}}，{{saveList.option.fontSize}}，{{saveList.option.fontColor}}，
                                {{saveList.option.rowHeight}}，{{saveList.option.arrangeName}}
                            </p>
                        </li>
                        <li data-index='5' :class="activeTab==5?'active':''" v-on:click="changeTab($event)">
                            <h5>说明文字设置</h5>
                            <p>{{saveList.comment.fontName}}，{{saveList.comment.fontSize}}，{{saveList.comment.fontColor}}，
                                {{saveList.comment.rowHeight}}，{{saveList.comment.arrangeName}}
                            </p>
                        </li>
                    </ul>
                    <!-- 全局设置 -->
                    <div class="condition-panel condition-control-items" v-if="activeTab==0?true:false">
                        <div class="am-ctr-sel w140 control-item" data-index='1' :class="{open:itemOpen==1?true:false}" @mouseleave='slideUp($event)' >
                            <a class="caption"  @click="changeDirection($event)">
                                {{saveList.global.directionName | directionFilter}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='1' @click.stop='selectOption($event)'>
                                    <li v-for="(item, index) in styleDictionaries['DIRECTION_STYLE']" :class="saveList.global.directionName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- <div class="control-item am-ctr-sel w140" data-index='2' v-bind:class="itemOpen==2?'open':''" @mouseleave='slideUp($event)'  v-if="saveList.global.directionName=='横向'">
                            <a class="caption"  @click='changeOption($event)' aria-expanded="true">
                              {{saveList.global.columns}}列
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='2' @click='selectOption($event)'>
                                    <li class="disabled"><a>列数</a></li>
                                    <li v-bind:class="saveList.global.columns==1?'active':''"><a data-val="1">1列</a></li>
                                    <li v-bind:class="saveList.global.columns==2?'active':''"><a data-val="2">2列</a></li>
                                    <li v-bind:class="saveList.global.columns==3?'active':''"><a data-val="3">3列</a></li>
                                    <li v-bind:class="saveList.global.columns==4?'active':''"><a data-val="4">4列</a></li>
                                    <li v-bind:class="saveList.global.columns==5?'active':''"><a data-val="5">5列</a></li>
                                    <li v-bind:class="saveList.global.columns==6?'active':''"><a data-val="6">6列</a></li>
                                    <li v-bind:class="saveList.global.columns==7?'active':''"><a data-val="7">7列</a></li>
                                    <li v-bind:class="saveList.global.columns==8?'active':''"><a data-val="8">8列</a></li>
                                </ul>
                            </div>
                        </div> -->
                        <div class="control-item am-input-unit w140">
                            <input id="inputWidth" @mouseenter="showTip()" type="text" class="input-text" v-model="saveList.global.columnWide" value="saveList.global.columnWide" placeholder="宽度"/><i>px</i>
                        </div>
                        <div class="control-item am-ctr-native-chk" :class="segmentLine==true?'active':''" @click="segment"><span>分割线</span></div>                                                                    
                        <div class="control-item am-ctr-sel w140" data-index='3' v-bind:class="itemOpen==3?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' aria-expanded="true">
                                <!-- {{saveList.global.backgroud}} --> 背景
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='3' @click='selectOption($event)'>
                                    <li class="disabled"><a>背景设置</a></li>
                                    <li v-bind:class="saveList.global.backgroud=='无'?'active':''"><a data-val="无">无</a></li>
                                    <li v-bind:class="saveList.global.backgroud=='背景1'?'active':''"><a data-val="背景1">背景1</a></li>
                                    <li v-bind:class="saveList.global.backgroud=='背景2'?'active':''"><a data-val="背景2">背景2</a></li>
                                    <li v-bind:class="saveList.global.backgroud=='背景3'?'active':''"><a data-val="背景3">背景3</a></li>
                                    <li v-bind:class="saveList.global.backgroud=='背景4'?'active':''"><a data-val="背景4">背景4</a></li>
                                </ul>
                            </div>
                        </div>
                        <a class="control-item am-btn am-btn-plain-primary" @click="headerEditor">页眉设置</a>
                        <a class="control-item am-btn am-btn-plain-primary" @click="footerEditor">页脚设置</a>
                        <br>

                        <div class="control-item am-ctr-native-chk" :class="fullScreen==true || saveList.global.fullScreen?'active':''" @click="screen('fullScreen')"><span>总屏</span></div>
                        <div class="control-item am-input-unit w140" v-if="fullScreen || saveList.global.fullScreen">
                          <input type="text" class="input-text" v-model="saveList.global.fullScreen">
                          <i>px</i>
                        </div>
                        <div class="control-item"><span>默认问题边距</span></div>
                        <div class="control-item am-input-unit w100">
                          <input type="text" style="width:100px;" class="input-text" v-model="saveList.global.defaultQuestionMargin">
                          <i>px</i>
                        </div>        
                        <div class="control-item"><span>默认选项边距</span></div>
                        <div class="control-item am-input-unit w100">
                          <input type="text" style="width:100px;" class="input-text" v-model="saveList.global.defaultOptionMargin">
                          <i>px</i>
                        </div>  
                        <div class="control-item"><span>默认题目最小宽度</span></div>
                        <div class="control-item am-input-unit w100">
                          <input type="text" style="width:100px;" class="input-text" v-model="saveList.global.defaultTitWidth">
                          <i>px</i>
                        </div>                           
                    </div>
                    <!-- 标题设置 -->
                    <div class="condition-panel condition-control-items" v-show="activeTab==1?true:false">
						<div class="am-ctr-sel w140 control-item" data-index='4' v-bind:class="itemOpen==4?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption" @click='changeOption($event)'>{{saveList.headline.fontName}}</a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='4' @click='selectOption($event)'>
                                    <li class="disabled"><a>字体</a></li>
                                    <li v-for="(item, index) in styleDictionaries['FONT_STYLE']" :class="saveList.headline.fontName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>                                    
                                    <!-- <li v-bind:class="saveList.headline.fontName=='宋体'?'active':''"><a data-val="宋体">宋体</a></li>
                                    <li v-bind:class="saveList.headline.fontName=='微软雅黑'?'active':''"><a data-val="微软雅黑">微软雅黑</a></li> -->
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='5' v-bind:class="itemOpen==5?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.headline.fontSize}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='5' @click='selectOption($event)'>
                                    <li class="disabled"><a>字号大小</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='16px'?'active':''"><a data-val="16px">16px</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='17px'?'active':''"><a data-val="17px">17px</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='18px'?'active':''"><a data-val="18px">18px</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='19px'?'active':''"><a data-val="19px">19px</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='20px'?'active':''"><a data-val="20px">20px</a></li>
                                </ul>
                            </div>
                        </div>
                        <!-- <div class="am-ctr-sel w140 control-item" data-index='6' v-bind:class="itemOpen==6?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" @click='changeOption($event)' aria-expanded="true">
                                {{saveList.headline.fontColor}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='6' @click='selectOption($event)'>
                                    <li class="disabled"><a>颜色设置</a></li>
                                    <li v-bind:class="saveList.headline.fontColor=='1'?'active':''"><a data-val="1">1</a></li>
                                    <li v-bind:class="saveList.headline.fontColor=='2'?'active':''"><a data-val="2">2</a></li>
                                    <li v-bind:class="saveList.headline.fontColor=='3'?'active':''"><a data-val="3">3</a></li>
                                    <li v-bind:class="saveList.headline.fontColor=='4'?'active':''"><a data-val="4">4</a></li>
                                    <li v-bind:class="saveList.headline.fontColor=='5'?'active':''"><a data-val="5">5</a></li>
                                </ul>
                            </div>
                        </div> -->
                        <div class="control-item am-ctr-sel w140" data-index='6' v-bind:class="itemOpen==3?'open':''" @mouseleave='slideUp($event)'>
                            <input class="caption w140 hideButton" data-index='6' :value="saveList.headline.fontColor" />    
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='7' v-bind:class="itemOpen==7?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)'>
                                {{saveList.headline.rowHeight}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='7' @click='selectOption($event)'>
                                    <li class="disabled"><a>行高</a></li>
                                    <li v-bind:class="saveList.headline.rowHeight=='20'?'active':''"><a data-val="20">20</a></li>
                                    <li v-bind:class="saveList.headline.rowHeight=='30'?'active':''"><a data-val="30">30</a></li>
                                    <li v-bind:class="saveList.headline.rowHeight=='40'?'active':''"><a data-val="40">40</a></li>
                                    <li v-bind:class="saveList.headline.rowHeight=='50'?'active':''"><a data-val="50">50</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='8' v-bind:class="itemOpen==8?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.headline.arrangeName}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='8' @click='selectOption($event)'>
                                    <li class="disabled"><a>排列</a></li>
                                    <li v-for="(item, index) in styleDictionaries['ARRANGE_STYLE']" :class="saveList.headline.arrangeName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>                                    
                                    <!-- <li v-bind:class="saveList.headline.arrangeName=='居左'?'active':''"><a data-val="居左">居左</a></li>
                                    <li v-bind:class="saveList.headline.arrangeName=='居中'?'active':''"><a data-val="居中">居中</a></li>
                                    <li v-bind:class="saveList.headline.arrangeName=='居右'?'active':''"><a data-val="居右">居右</a></li> -->
                                </ul>
                            </div>
                        </div>
					</div>
                    <!-- 标签样式 -->
                    <div class="condition-panel condition-control-items" v-show="activeTab==2?true:false">
                        <div class="am-ctr-sel w140 control-item" data-index='9' v-bind:class="itemOpen==9?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.label.fontName}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='9' @click='selectOption($event)'>
                                    <li class="disabled"><a>字体</a></li>
                                    <li v-for="(item, index) in styleDictionaries['FONT_STYLE']" :class="saveList.headline.fontName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>   
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='10' v-bind:class="itemOpen==10?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.label.fontSize}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='10' @click='selectOption($event)'>
                                    <li class="disabled"><a>字号大小</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='14px'?'active':''"><a data-val="14px">14px</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='15px'?'active':''"><a data-val="15px">15px</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='16px'?'active':''"><a data-val="16px">16px</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='17px'?'active':''"><a data-val="17px">17px</a></li>
                                    <li v-bind:class="saveList.headline.fontSize=='18px'?'active':''"><a data-val="18px">18px</a></li>
                                </ul>
                            </div>
                        </div>
                        <!-- <div class="am-ctr-sel w140 control-item" data-index='11' v-bind:class="itemOpen==11?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" @click='changeOption($event)' aria-expanded="true">
                                {{saveList.label.fontColor}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='11' @click='selectOption($event)'>
                                    <li class="disabled"><a>颜色设置</a></li>
                                    <li v-bind:class="saveList.label.fontColor=='1'?'active':''"><a data-val="1">1</a></li>
                                    <li v-bind:class="saveList.label.fontColor=='2'?'active':''"><a data-val="2">2</a></li>
                                    <li v-bind:class="saveList.label.fontColor=='3'?'active':''"><a data-val="3">3</a></li>
                                    <li v-bind:class="saveList.label.fontColor=='4'?'active':''"><a data-val="4">4</a></li>
                                    <li v-bind:class="saveList.label.fontColor=='5'?'active':''"><a data-val="5">5</a></li>
                                </ul>
                            </div>
                        </div> -->
                        <div class="control-item am-ctr-sel w140" data-index='11' v-bind:class="itemOpen==3?'open':''" @mouseleave='slideUp($event)'>
                            <input class="caption w140 hideButton" data-index='11' :value="saveList.label.fontColor" />    
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='12' v-bind:class="itemOpen==12?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"   @click='changeOption($event)'>
                                {{saveList.label.rowHeight}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='12' @click='selectOption($event)'>
                                    <li class="disabled"><a>行高</a></li>
                                    <li v-bind:class="saveList.label.rowHeight=='20'?'active':''"><a data-val="20">20</a></li>
                                    <li v-bind:class="saveList.label.rowHeight=='30'?'active':''"><a data-val="30">30</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='13' v-bind:class="itemOpen==13?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.label.arrangeName}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='13' @click='selectOption($event)'>
                                    <li class="disabled"><a>排列</a></li>
                                    <li v-for="(item, index) in styleDictionaries['ARRANGE_STYLE']" :class="saveList.label.arrangeName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- 题目设置 -->
                    <div class="condition-panel condition-control-items" v-show="activeTab==3?true:false">
                        <div class="am-ctr-sel w140 control-item" data-index='14' v-bind:class="itemOpen==14?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.question.fontName}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='14' @click='selectOption($event)'>
                                    <li class="disabled"><a>字体</a></li>
                                    <li v-for="(item, index) in styleDictionaries['FONT_STYLE']" :class="saveList.headline.fontName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>   
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='15' v-bind:class="itemOpen==15?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)'>
                                {{saveList.question.fontSize}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='15' @click='selectOption($event)'>
                                    <li class="disabled"><a>字号大小</a></li>
                                    <li v-bind:class="saveList.question.fontSize=='14px'?'active':''"><a data-val="14px">14px</a></li>
                                    <li v-bind:class="saveList.question.fontSize=='15px'?'active':''"><a data-val="15px">15px</a></li>
                                    <li v-bind:class="saveList.question.fontSize=='16px'?'active':''"><a data-val="16px">16px</a></li>
                                    <li v-bind:class="saveList.question.fontSize=='17px'?'active':''"><a data-val="17px">17px</a></li>
                                    <li v-bind:class="saveList.question.fontSize=='18px'?'active':''"><a data-val="18px">18px</a></li>
                                </ul>
                            </div>
                        </div>
                        <!-- <div class="am-ctr-sel w140 control-item" data-index='16' v-bind:class="itemOpen==16?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" @click='changeOption($event)' aria-expanded="true">
                                {{saveList.question.fontColor}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='11' @click='selectOption($event)'>
                                    <li class="disabled"><a>颜色设置</a></li>
                                    <li v-bind:class="saveList.question.fontColor=='1'?'active':''"><a data-val="1">1</a></li>
                                    <li v-bind:class="saveList.question.fontColor=='2'?'active':''"><a data-val="2">2</a></li>
                                    <li v-bind:class="saveList.question.fontColor=='3'?'active':''"><a data-val="3">3</a></li>
                                    <li v-bind:class="saveList.question.fontColor=='4'?'active':''"><a data-val="4">4</a></li>
                                    <li v-bind:class="saveList.question.fontColor=='5'?'active':''"><a data-val="5">5</a></li>
                                </ul>
                            </div>
                        </div> -->
                        <div class="control-item am-ctr-sel w140" data-index='16' v-bind:class="itemOpen==3?'open':''" @mouseleave='slideUp($event)'>
                            <input class="caption w140 hideButton" data-index='16' :value="saveList.question.fontColor" />    
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='17' v-bind:class="itemOpen==17?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)'>
                                {{saveList.question.rowHeight}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='17' @click='selectOption($event)'>
                                    <li class="disabled"><a>行高</a></li>
                                    <li v-bind:class="saveList.question.rowHeight=='20'?'active':''"><a data-val="20">20</a></li>
                                    <li v-bind:class="saveList.question.rowHeight=='30'?'active':''"><a data-val="30">30</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='18' v-bind:class="itemOpen==18?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)'>
                                {{saveList.question.arrangeName}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='18' @click='selectOption($event)'>
                                    <li class="disabled"><a>排列</a></li>
                                    <li v-for="(item, index) in styleDictionaries['ARRANGE_STYLE']" :class="saveList.question.arrangeName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>                                     
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- 选项设置 -->
                    <div class="condition-panel condition-control-items" v-show="activeTab==4?true:false">
                        <div class="am-ctr-sel w140 control-item" data-index='19' v-bind:class="itemOpen==19?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)'>
                                {{saveList.option.fontName}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='19' @click='selectOption($event)'>
                                    <li class="disabled"><a>字体</a></li>
                                    <li v-for="(item, index) in styleDictionaries['FONT_STYLE']" :class="saveList.headline.fontName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>   
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='20' v-bind:class="itemOpen==20?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.option.fontSize}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='20' @click='selectOption($event)'>
                                    <li class="disabled"><a>字号大小</a></li>
                                    <li v-bind:class="saveList.option.fontSize=='14px'?'active':''"><a data-val="14px">14px</a></li>
                                    <li v-bind:class="saveList.option.fontSize=='15px'?'active':''"><a data-val="15px">15px</a></li>
                                    <li v-bind:class="saveList.option.fontSize=='16px'?'active':''"><a data-val="16px">16px</a></li>
                                    <li v-bind:class="saveList.option.fontSize=='17px'?'active':''"><a data-val="17px">17px</a></li>
                                    <li v-bind:class="saveList.option.fontSize=='18px'?'active':''"><a data-val="18px">18px</a></li>
                                </ul>
                            </div>
                        </div>
                        <!-- <div class="am-ctr-sel w140 control-item" data-index='21' v-bind:class="itemOpen==21?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" @click='changeOption($event)' aria-expanded="true">
                                {{saveList.option.fontColor}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='21' @click='selectOption($event)'>
                                    <li class="disabled"><a>颜色设置</a></li>
                                    <li v-bind:class="saveList.option.fontColor=='1'?'active':''"><a data-val="1">1</a></li>
                                    <li v-bind:class="saveList.option.fontColor=='2'?'active':''"><a data-val="2">2</a></li>
                                    <li v-bind:class="saveList.option.fontColor=='3'?'active':''"><a data-val="3">3</a></li>
                                    <li v-bind:class="saveList.option.fontColor=='4'?'active':''"><a data-val="4">4</a></li>
                                    <li v-bind:class="saveList.option.fontColor=='5'?'active':''"><a data-val="5">5</a></li>
                                </ul>
                            </div>
                        </div> -->
                        <div class="control-item am-ctr-sel w140" data-index='21' v-bind:class="itemOpen==3?'open':''" @mouseleave='slideUp($event)'>
                            <input class="caption w140 hideButton" data-index='21' :value="saveList.option.fontColor" />    
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='22' v-bind:class="itemOpen==22?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.option.rowHeight}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='22' @click='selectOption($event)'>
                                    <li class="disabled"><a>行高</a></li>
                                    <li v-bind:class="saveList.option.rowHeight=='20'?'active':''"><a data-val="20">20</a></li>
                                    <li v-bind:class="saveList.option.rowHeight=='30'?'active':''"><a data-val="30">30</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='23' v-bind:class="itemOpen==23?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.option.arrangeName}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='23' @click='selectOption($event)'>
                                    <li class="disabled"><a>排列</a></li>
                                    <li v-for="(item, index) in styleDictionaries['ARRANGE_STYLE']" :class="saveList.option.arrangeName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!-- 说明文字 -->
                    <div class="condition-panel condition-control-items" v-show="activeTab==5?true:false">
                        <div class="am-ctr-sel w140 control-item" data-index='24' v-bind:class="itemOpen==24?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)'>
                                {{saveList.comment.fontName}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='24' @click='selectOption($event)'>
                                    <li class="disabled"><a>字体</a></li>
                                    <li v-for="(item, index) in styleDictionaries['FONT_STYLE']" :class="saveList.headline.fontName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>   
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='25' v-bind:class="itemOpen==25?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)'>
                                {{saveList.comment.fontSize}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='25' @click='selectOption($event)'>
                                    <li class="disabled"><a>字号大小</a></li>
                                    <li v-bind:class="saveList.comment.fontSize=='14px'?'active':''"><a data-val="14px">14px</a></li>
                                    <li v-bind:class="saveList.comment.fontSize=='15px'?'active':''"><a data-val="15px">15px</a></li>
                                    <li v-bind:class="saveList.comment.fontSize=='16px'?'active':''"><a data-val="16px">16px</a></li>
                                    <li v-bind:class="saveList.comment.fontSize=='17px'?'active':''"><a data-val="17px">17px</a></li>
                                    <li v-bind:class="saveList.comment.fontSize=='18px'?'active':''"><a data-val="18px">18px</a></li>
                                </ul>
                            </div>
                        </div>
                        <!-- <div class="am-ctr-sel w140 control-item" data-index='26' v-bind:class="itemOpen==26?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption" href="javascript:void(0)" data-toggle="dropdown" role="button" aria-haspopup="true" @click='changeOption($event)' aria-expanded="true">
                                {{saveList.comment.fontColor}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='26' @click='selectOption($event)'>
                                    <li class="disabled"><a>颜色设置</a></li>
                                    <li v-bind:class="saveList.comment.fontColor=='1'?'active':''"><a data-val="1">1</a></li>
                                    <li v-bind:class="saveList.comment.fontColor=='2'?'active':''"><a data-val="2">2</a></li>
                                    <li v-bind:class="saveList.comment.fontColor=='3'?'active':''"><a data-val="3">3</a></li>
                                    <li v-bind:class="saveList.comment.fontColor=='4'?'active':''"><a data-val="4">4</a></li>
                                    <li v-bind:class="saveList.comment.fontColor=='5'?'active':''"><a data-val="5">5</a></li>
                                </ul>
                            </div>
                        </div> -->
                        <div class="control-item am-ctr-sel w140" data-index='26' v-bind:class="itemOpen==3?'open':''" @mouseleave='slideUp($event)'>
                            <input class="caption w140 hideButton" data-index='26' :value="saveList.comment.fontColor" />    
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='27' v-bind:class="itemOpen==27?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption" @click='changeOption($event)' >
                                {{saveList.comment.rowHeight}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='27' @click='selectOption($event)'>
                                    <li class="disabled"><a>行高</a></li>
                                    <li v-bind:class="saveList.comment.rowHeight=='20'?'active':''"><a data-val="20">20</a></li>
                                    <li v-bind:class="saveList.comment.rowHeight=='30'?'active':''"><a data-val="30">30</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="am-ctr-sel w140 control-item" data-index='28' v-bind:class="itemOpen==28?'open':''" @mouseleave='slideUp($event)'>
                            <a class="caption"  @click='changeOption($event)' >
                                {{saveList.comment.arrangeName}}
                            </a>
                            <div class="am-dropdown am-mr-10">
                                <ul data-select='28' @click='selectOption($event)'>
                                    <li class="disabled"><a>排列</a></li>
                                    <li v-for="(item, index) in styleDictionaries['ARRANGE_STYLE']" :class="saveList.comment.arrangeName==item['dicItemValue']?'active':''" :key=index>
                                      <a :data-val="item['dicItemValue']"> {{item['dicItemValue']}}</a>
                                    </li>                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--横向的v-show="evaluation.questionList.length>0"-->
                    <!-- <div class="lv-cont lv-v-usabled am-pdr-15" style="padding-left: 15px;display:none;" >
                        <div class="topic-layout-rcont"  style="border: 1px solid #E5E5E5;margin-top:10px;margin-bottom: 10px">
                           <questionTrees ref="questionTree"  mode='add' :pageFrom="'knowledge'"  v-if="renderReady"  :treeId="evaluation.evaluationId" :isShowCloseBtn='false'></questionTrees>
                        </div>
                        <div v-if="!renderReady">
                          <loading :load="!renderReady" type="loading"></loading>
                        </div>
                        <div v-if="renderReady&&evaluation.questionList.length==0" style="min-height:100px;line-height:100px;text-align:center">
                           <div class="no-data">
                           <img src="../../image/no-data/no-data-notice.png" />
                           <div class="responsive-txt">
                               <div class="txt">没有配置评估单数据</div>
                           </div>
                           </div>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import Vue from "vue";
import menuTemplate from "../../components/menu.vue";
import common from "@/util/common.js";
import Editor from "./Editor.vue";
import questionTrees from '@/components/questionTree/questionTree';
import { mapState, mapActions,mapMutations} from 'vuex'
import loading from '@/components/common/loading.vue';

import "../../../static/colorpicker/evol-colorpicker.min.css";
import "../../../static/colorpicker/jquery-ui.min.js";
import "../../../static/colorpicker/evol-colorpicker.min.js";

export default {
  data() {
    return {
      activeTab: 0, // tab选项（外层）
      itemOpen: "", // 选项开关
      evaluationId: common.getUrlParam("assesmentId"),
      saveList: {
        comment: {
          arrange: "left",
          arrangeName: "居左",
          font: "SimSun",
          fontName: "宋体",
          fontColor: "#333333",
          fontSize: "12",
          rowHeight: "16"
        },
        global: {
          backgroud: "",
          columnWide: 400,
          columns: 1,
          cutLine: "",
          direction: "1",
          directionName: "横向",
          pageFooter: "",
          pageHeader: "",
          fullScreen: '',
          defaultQuestionMargin: '20'
        },
        headline: {
          arrange: "left",
          arrangeName: "居左",
          font: "SimSun",
          fontName: "宋体",
          fontColor: "#333333",
          fontSize: "20",
          rowHeight: "40"
        },
        label: {
          arrange: "left",
          arrangeName: "居左",
          font: "SimSun",
          fontName: "宋体",
          fontColor: "#333333",
          fontSize: "14",
          rowHeight: "40"
        },
        option: {
          arrange: "left",
          arrangeName: "居左",
          font: "SimSun",
          fontName: "宋体",
          fontColor: "#333333",
          fontSize: "14",
          rowHeight: "20"
        },
        question: {
          arrange: "left",
          arrangeName: "居左",
          font: "SimSun",
          fontName: "宋体",
          fontColor: "#333333",
          fontSize: "14",
          rowHeight: "20"
        }
      },
      styleDictionaries: {}, // 字体，列横纵，排列 数据字典
      segmentLine: false, // 分割线
      fullScreen: false, // 总屏
      evaluation:{},//评估单
      evaluationName:'',
      renderReady: false,
      currentPage:'styleSetting',
      isEditAssesmentName:false,
      questionList:{},
    };
  },
  filters: {
    //横向纵向筛选
    directionFilter: function (val) {
        if(val === null) {
            return '横向'
        }else{
            return val;
        }
    },
    //分割线筛选
    segmentFilter: function(value) {
        if (value == false) {
            return "无分割线";
        } else {
            return "有分割线";
        }
    },
    pageHeader: function(value) {
        return "无页眉";
    },
    pageFooter: function(value) {
        return "无页脚";
    }
  },
  components: {
        'menuTemplate': menuTemplate,
        Editor,
        'questionTrees':questionTrees,
        'loading':loading,
  },
  mounted() {
    var that = this;
    this.getStyles();
    this.getStyleDictionaries();
    $(".hideButton").colorpicker({
        hideButton: true,
        strings: "颜色设置,标准颜色,Web Colors,Theme Colors,返回,历史,无历史"
    });
    // 保存颜色
    $(".hideButton").on("change", function(ev) {
        var index = this.getAttribute("data-index");
        if (index == 6) {
            that.saveList.headline.fontColor = $(this).val();
        } else if (index == 11) {
            that.saveList.label.fontColor = $(this).val();
        } else if (index == 16) {
            that.saveList.question.fontColor = $(this).val();
        } else if (index == 21) {
            that.saveList.option.fontColor = $(this).val();
        } else if (index == 26) {
            that.saveList.comment.fontColor = $(this).val();
        }
    });
    this.SET_USERFULWIDTH($('body').width() - 200);
    this.getData();
  },
  methods: {
    ...mapMutations([
            'SET_PAPERSTYLE', 'SET_USERFULWIDTH'
        ]),
    //编辑评估单名称
    editAssesmentName:function(){
        let that=this;
        let data={evaluationId:this.evaluationId,evaluationName:this.evaluationName};
        common.ajax({
        url: "knowledge-service/evaluation/paper2/update",
        dataType: "text",
        type: "put",
        data:JSON.stringify(data),
        callback: function(problems) {
            that.isEditAssesmentName=false;
            common.tip_msg("保存成功",1000);
        }
      });
    },
    clickEditAssesment:function(){
        this.isEditAssesmentName=true;
        Vue.nextTick(function(){
            $('#inputAssesment').focus();
        })
    },
    refreshAll:function(){
        this.renderReady=false;
        this.getData();
    },
    showTip: function () {
    //   layer.tips('每列宽度',$('#inputWidth'))
    },
    //根据评估单Id，获取评估节点数据
    getData() {
        let that=this;
        try{
            common.ajax({
              url: 'knowledge-service/evaluation/paper2/'+this.evaluationId+'/detail',
              // url: 'knowledge-service/evaluation/paper2/'+this.evaluationId+'/paper',
              type: 'get',
              callback: function(data) {
                that.evaluation = Object.freeze(data);
                that.evaluationName=that.evaluation.evaluationName;
                that.renderReady = true;
                that.questionList={
                    "questionList": data.questionList
                };
                that.refreshPreShow();
               
              }
            });
        }catch(e){
            this.renderReady=true;
        }
    },
    refreshPreShow() {
        let that = this;
        Vue.nextTick(function() {
            that.SET_PAPERSTYLE(that.evaluation.paperStyle);
            let questionList = $.extend(true, {}, that.questionList); 
            that.$refs.questionTree.initData(questionList);
        })
    },
    //页眉设置
    headerEditor: function() {
        var url = "/#/editor?pageSet=1";
        layer.open({
        type: 2,
        title: "页眉设置",
        area: ["800px", "330px"],
        content: [url, "no"],
        btn: "获取内容",
        yes: function(index, layero) {
            console.log("保存吧", index, layero);
        }
        });
    },
    //返回
    returnBack:function(){
        let { query } = this.$route;
        Object.assign(query, {
          assesmentId: undefined
        });        
        // this.$router.push({ path: '/createAssesmentContent',query:query});
        this.$router.push({ path: '/',query:query});
    },
    nextStep:function(){
        let { query } = this.$route;
        // let evaluationName=encodeURIComponent(this.evaluationName);
        query.evaluationName= this.evaluationName;
        // this.$router.push({path:'/assesmentTableSetting',query:query});
        this.$router.push({path:'/createAssesmentContent',query:query});
    },
    // 页脚设置
    footerEditor: function() {
      var url = "/#/editor?pageSet=2";
      layer.open({
        type: 2,
        title: "页脚设置",
        area: ["800px", "660px"],
        content: [url, "no"],
        yes: function(index, layero) {
            console.log("保存吧", index, layero);
        }
      });
    },
    // 点击选项
    selectOption: function(ev) {
      var index = ev.currentTarget.dataset.select;
      console.log('执行方法',index)
      if (ev.target.parentElement.classList[0] == "disabled") return;
      if (index == 1) {
        this.saveList.global.directionName = ev.target.getAttribute("data-val");
      } else if (index == 2) {
        this.saveList.global.columns = ev.target.getAttribute("data-val");
      } else if (index == 3) {
        this.saveList.global.backgroud = ev.target.getAttribute("data-val");
      } else if (index == 4) {
        this.saveList.headline.fontName = ev.target.getAttribute("data-val");
      } else if (index == 5) {
        this.saveList.headline.fontSize = ev.target.getAttribute("data-val");
      } else if (index == 6) {
        this.saveList.headline.fontColor = ev.target.getAttribute("data-val");
      } else if (index == 7) {
        this.saveList.headline.rowHeight = ev.target.getAttribute("data-val");
      } else if (index == 8) {
        this.saveList.headline.arrangeName = ev.target.getAttribute("data-val");
      } else if (index == 9) {
        this.saveList.label.fontName = ev.target.getAttribute("data-val");
      } else if (index == 10) {
        this.saveList.label.fontSize = ev.target.getAttribute("data-val");
      } else if (index == 11) {
        this.saveList.label.fontColor = ev.target.getAttribute("data-val");
      } else if (index == 12) {
        this.saveList.label.rowHeight = ev.target.getAttribute("data-val");
      } else if (index == 13) {
        this.saveList.label.arrangeName = ev.target.getAttribute("data-val");
      } else if (index == 14) {
        this.saveList.question.fontName = ev.target.getAttribute("data-val");
      } else if (index == 15) {
        this.saveList.question.fontSize = ev.target.getAttribute("data-val");
      } else if (index == 16) {
        this.saveList.question.fontColor = ev.target.getAttribute("data-val");
      } else if (index == 17) {
        this.saveList.question.rowHeight = ev.target.getAttribute("data-val");
      } else if (index == 18) {
        this.saveList.question.arrangeName = ev.target.getAttribute("data-val");
      } else if (index == 19) {
        this.saveList.option.fontName = ev.target.getAttribute("data-val");
      } else if (index == 20) {
        this.saveList.option.fontSize = ev.target.getAttribute("data-val");
      } else if (index == 21) {
        this.saveList.option.fontColor = ev.target.getAttribute("data-val");
      } else if (index == 22) {
        this.saveList.option.rowHeight = ev.target.getAttribute("data-val");
      } else if (index == 23) {
        this.saveList.option.arrangeName = ev.target.getAttribute("data-val");
      } else if (index == 24) {
        this.saveList.comment.fontName = ev.target.getAttribute("data-val");
      } else if (index == 25) {
        this.saveList.comment.fontSize = ev.target.getAttribute("data-val");
      } else if (index == 26) {
        this.saveList.comment.fontColor = ev.target.getAttribute("data-val");
      } else if (index == 27) {
        this.saveList.comment.rowHeight = ev.target.getAttribute("data-val");
      } else if (index == 28) {
        this.saveList.comment.arrangeName = ev.target.getAttribute("data-val");
      }
      this.itemOpen = 0;
    },
    // 分割线
    segment: function() {
        this.segmentLine = !this.segmentLine;
    },
    screen: function(val) {
      if(val == 'fullScreen') {
        this.fullScreen = !this.fullScreen;
        this.saveList.global.fullScreen = null;
      }

      if(val == 'defaultQuestionMargin') {
        this.defaultQuestionMargin = !this.defaultQuestionMargin;
        // this.saveList.global.defaultQuestionMargin = 20;
      }

    },
    // 选项鼠标移出时收起
    slideUp: function(ev) {
        this.itemOpen = 0;
    },
    // 选项
    changeOption: function(ev) {
        var index = ev.target.parentElement.dataset.index;
        this.itemOpen = index;
    },
    changeDirection:function(ev){
        var index = ev.target.parentElement.dataset.index;
        this.itemOpen = index;
        this.saveList.global.columns=1;
    },
    // 最外层tab
    changeTab: function(ev) {
        var index = ev.currentTarget.dataset.index;
        console.log(index);
        this.activeTab = index;
    },
    // 获取样式
    getStyles() {
        let that = this;
        common.ajax({
        url: "knowledge-service/evaluation/style/" + this.evaluationId,
        type: "get",
        data: {},
        callback: function(data) {
            that.saveList = data;
            if(that.saveList.global.fullScreen) {
              that.fullScreen = true;
            }
            if(that.saveList.global.defaultQuestionMargin) {
              that.saveList.global.defaultQuestionMargin = 20; 
            }
            if(that.saveList.global.defaultOptionMargin) {
              that.saveList.global.defaultQuestionMargin = 20; 
            }            
            console.log(that.saveList);
        }
      });
    },
    // 保存样式
    saveStyles: function(data) {
        let that=this;
        common.ajax({
        url: "knowledge-service/evaluation/savaStyle",
        type: "post",
        async:false,
        data: JSON.stringify(data),
        callback: function(data) {
            common.tip_msg("已保存", 1000);
            that.refreshAll();
        }
      });
    },
    // 获取数据字典
    getStyleDictionaries: function() {
      const _this = this;
      common.ajax({
        url: "knowledge-service/evaluation/queryAllStyleType",
        type: "get",
        async:false,
        data: {},
        callback: function(data) {  
          console.log(data)
          _this.styleDictionaries = data
        }
      });    
    }
  }
};
</script>





