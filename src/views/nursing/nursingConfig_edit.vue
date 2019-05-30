<template>
	<!-- <div class="am-cover"></div> -->
	<div class="am-page-slide">
		<div class="hd" style="z-index:2147483647">
			<h3>护理诊断配置 </h3>
			<a class="i-close" @click="closeLayer"></a>
		</div>
		<div class="bd">
			<div class="amp-confirm-scroll am-ptlr-10">
				<div class="am-line-panel">
					<div class="am-panel-hd">护理诊断</div>
					<div class="am-panel-bd am-panel-pd" style="line-height:30px;">
						<a class="first toggle-next config-plus-btn clickOtherClose mycloseSearchPanel_dia hideDiagnose"
						   @click.stop="addDiagnose($event)" v-show="isShowAddDia"> +诊断</a>
						<span class="am-ft-md" v-show="isShowChangeVal">{{diagnoseItem}}</span>
						<!--toggle-->
						<a class="toggle-next replace" @click.stop="changeDiagnose($event)" v-show="isShowChange">更换</a>
						<div class="am-search-cancel-bar" v-show="isCancel" style="display:inline-block;">
							<div class="am-search-bar">
								<div class="am-search-picker">
									<input @focus="focusFun($event)" v-model="valDiagnose" type="text" @keyup="onEnter_diagnose"
										   class="input-text" placeholder="搜索添加护理诊断">
									<i class="i-search"></i>
								</div>
								<!-- <div class="am-dropdown" v-show="isCancel">
									<ul>
										<li v-for="item in diagnosesMenu" @click="selectVal(item,'diagnose')"><a>
											{{item.catalogueName}}
										</a></li>
									</ul>
								</div> -->
								<div class="am-dropdown hideSearch" v-show="isCancel&&diagnosesMenu!=''"
									 style="max-height:200px;overflow:auto;left:0;">
									<dl class="dl-op dl-op-diagnosis">
										<dd @mouseover.stop="hover($event,diagnosesMenu,item)"
											:class="{'disabled':item.hasAdd,'select_first':item.addFirst}"
											v-for="item in diagnosesMenu"
											@click.stop="selectVal(item,'diagnose')"> {{item.catalogueName}}
											<span class="right" v-show="item.hasAdd">已添加</span>
										</dd>
									</dl>
								</div>
							</div>
							<a class="am-link-default am-ml-10 hideSearch" @click="cancelDiagnose($event)" v-show="isCancel">取消</a>
						</div>
						<!--toggle end-->
						<i class="i-error" v-show="diagnose_catalogueName == ''&&diagnoseError"></i>
					</div>
				</div>
				<div class="am-line-panel am-mt-10">
					<div class="am-panel-hd">触发条件（阳性项）</div>
					<div class="am-panel-bd">
						<div class="am-space-nt-1">
							<table class="am-tb-config controllAddCombination">
								<tr v-for="(group,group_index) in positiveItems">
									<td>
										<table class="am-tb-config-inner">
											<tr>
												<td class="controllAddother_part" v-for="(subset,subset_index) in group.subsets">
													<div class="am-btn-rdo-radius delabled" style="min-height:0;padding-bottom:10px;">
														<a v-show="positive.catalogueName!=''" v-for="(positive,positive_index2) in subset.items">{{positive.catalogueName}}
															<i class="i-close" @click="delPositive(positive_index2,subset_index,group_index,$event)"></i>
														</a>
													</div>
													<div class="toggle-config">
														<a @click.stop="addPositive($event)" class="mycloseSearchPanel_pos enterOpen first toggle-next config-plus-btn ">+阳性项</a>
														<div style="display:none" class="enterClose second am-search-cancel-bar">
															<div class="am-search-bar">
																<div class="am-search-picker">
																	<input @blur="closeSearch($event)"
																		   v-model="valPostitive"
																		   @input="valChange_positive(group_index,$event)"
																		   @keyup="onEnter_positive($event,subset_index,group_index)"
																		   type="text"
																		   class="input-text" placeholder="搜索添加阳性项">
																	<i class="i-search"></i>
																</div>
																<div v-if="positiveMenu!=''" class="am-dropdown hideSearch" style="display: block;max-height:200px;overflow:auto;left:0;">
																	<dl class="dl-op dl-op-diagnosis">
																		<dd @mouseover.stop="hover($event,positiveMenu,positive)"
																			:class="{'disabled':positive.hasAdd,'select_first':positive.addFirst}"
																			@click="selectVal(positive,'positive',subset_index,group_index,$event,positiveMenu,positive_index)"
																			v-for="(positive,positive_index) in positiveMenu">
																			{{positive.catalogueName}}
																			<span class="right" v-show="positive.hasAdd">已添加</span>
																		</dd>
																	</dl>
																</div>
																<!-- 修改代码结构 -->
																<!-- <div class="am-dropdown" style="display: none;">
																		  <ul>
																			  <li @click="selectVal(positive,'positive',subset_index,group_index,$event)" v-for="(positive,positive_index) in positiveMenu"><a>{{positive.catalogueName}}</a></li>
																		  </ul>
																	  </div> -->
															</div>
															<a @click="cancelPositive($event)"
															   class="toggle-pre am-link-default am-ml-10 hideSearch">取消</a>
														</div>
														
													</div>
													<!-- 只在第一条：group_index==0&&subset_index==0
														第一个阳性项为空：firstCNisEmpty:false
														未点击保存：positiveError:false-->
													<i class="i-error" v-show="(group_index==0&&subset_index==0)&&firstCNisEmpty&&positiveError"></i>						
												</td>
												<!-- v-show="isShowOther" -->
												<td v-show="group.isOrNotShowOtherPart" class="addOther_part">
													<div class="toggle-config">
														<a class="first toggle-next " @click="addOtherFun(group_index,$event)"><i>+</i>条件其他部分</a>
													</div>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
							<!-- v-show="isShowOther" -->
							<div class="addConbination am-after-panel-btn" @click="addCombinationFun($event)">
								<a>+ 组合</a>
							</div>
						</div>
					</div>
				</div>
				<div class="am-line-panel am-mt-10" v-if="catalogue=='CCC'">
					<div class="am-panel-hd">目标</div>
					<div class="am-panel-bd">
						<div class="am-space-nl-1">
							<table class="am-tb-config-inner">
								<tr>
									<td>
										<div class="am-btn-rdo-radius delabled" style="min-height:0;padding-bottom:10px;">
											<a v-show="goalsItem.catalogueName!=''" v-for="(goalsItem,goalsItem_index) in goalsItems">{{goalsItem.catalogueName}}<i @click="delGoal(goalsItem_index)" class="i-close"></i></a>
										</div>
										<div class="toggle-config">
											<a @click.stop="addGoal($event)" v-show="isShowAddGoal"
											   class=" enterOpen first toggle-next config-plus-btn mycloseSearchPanel_goal" :class="{'disabled':diagnoseItem==''}">+目标</a>
											<div v-show="!isShowAddGoal" class="second enterClose am-search-cancel-bar">
												<div class="am-search-bar">
													<div class="am-search-picker">
														<input v-model="valGoal" @keyup="onEnter_goal" type="text" class="input-text" placeholder="搜索添加目标">
														<i class="i-search"></i>
													</div>
													<div v-if="goalsMenu!=''" class="am-dropdown hideSearch"
														 style="display: block;max-height:200px;overflow:auto;left:0;">
														<dl class="dl-op  dl-op-diagnosis">
															<dd :class="{'disabled':goal.hasAdd}"
																@click="selectVal(goal,'goal',1,1,$event)"
																v-for="goal in goalsMenu">
																{{goal.catalogueName}}
																<span class="right" v-show="goal.hasAdd">已添加</span>
															</dd>
														</dl>
													</div>
												</div>
												<a @click="cancelGoal($event)" class="toggle-pre am-link-default am-ml-10 hideSearch">取消</a>
											</div>
										</div>
										<i class="i-error" v-show="goalsItems.length==0&&goalsError"></i>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<div class="am-line-panel am-mt-10">
					<div class="am-panel-hd">护理措施</div>
					<div class="am-panel-bd">
						<div class="am-space-nl-1">
							<table class="am-tb-config-inner">
								<tr>
									<td>
										<div class="am-btn-rdo-radius delabled"
											 style="min-height:0;padding-bottom:10px;">
											<a v-show="measuresItem.catalogueName!=''"
											   v-for="(measuresItem,measuresItem_index) in measuresItems">{{measuresItem.catalogueName}}
											   <i @click="delMeasure(measuresItem_index)" class="i-close"></i>
											</a>
										</div>
										<div class="toggle-config">
											<a @click.stop="addMeasure($event)" v-show="isShowAddMea"
											   class=" enterOpen first toggle-next config-plus-btn mycloseSearchPanel_mea">+护理措施</a>
											<div v-show="!isShowAddMea" class="second enterClose am-search-cancel-bar">
												<div class="am-search-bar">
													<div class="am-search-picker">
														<input v-model="valMeasure" @keyup="onEnter_measure" type="text"
															   class="input-text"
															   placeholder="搜索添加护理措施"><i class="i-search"></i>
													</div>
													<!-- <div class="am-dropdown" style="display: block;">
															<ul>
																<li @click="selectVal(measure,'measure')" v-for="measure in measuresMenu"><a>{{measure.catalogueName}}</a></li>
															</ul>
														</div> -->
													<div v-if="measuresMenu!=''" class="am-dropdown hideSearch"
														 style="display: block;max-height:200px;overflow:auto;left:0;">
														<dl class="dl-op  dl-op-diagnosis">
															<dd @mouseover.stop="hover($event,measuresMenu,measure)"
																:class="{'disabled':measure.hasAdd,'select_first':measure.addFirst}"
																@click="selectVal(measure,'measure',1,1,$event)"
																v-for="measure in measuresMenu">
																{{measure.catalogueName}}
																<span class="right" v-show="measure.hasAdd">已添加</span>
															</dd>
														</dl>
													</div>
												</div>
												<a @click="cancelMeasure($event)"
												   class="toggle-pre am-link-default am-ml-10 hideSearch">取消</a>
											</div>
										</div>
										<i class="i-error" v-show="measuresItems.length == 0&&measuresError"></i>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<div class="am-line-panel am-mt-10" v-if="catalogue=='CCC'">
					<div class="am-panel-hd">评价</div>
					<div class="am-panel-bd">
						<div class="am-space-nl-1">
							<table class="am-tb-config-inner">
								<tr>
									<td>
										<div class="am-btn-rdo-radius delabled"
											 style="min-height:0;padding-bottom:10px;">
											<a v-show="appraisalsItem.catalogueName!=''"
											   v-for="(appraisalsItem,appraisalsItem_index) in appraisalsItems">{{appraisalsItem.catalogueName}}
											   <i @click="delAppraisals(appraisalsItem_index)" class="i-close"></i>
											</a>
										</div>
										<div class="toggle-config">
											<a @click.stop="addAppraisals($event)" v-show="isShowAddAppr"
											   class=" enterOpen first toggle-next config-plus-btn mycloseSearchPanel_appr">+评价</a>
											<div v-show="!isShowAddAppr" class="second enterClose am-search-cancel-bar">
												<div class="am-search-bar">
													<div class="am-search-picker">
														<input v-model="valAppraisals" @keyup="onEnter_appraisals" type="text" class="input-text" placeholder="搜索添加评价">
														<i class="i-search"></i>
													</div>
													<div v-if="appraisalsMenu!=''" class="am-dropdown hideSearch"
														 style="display: block;max-height:200px;overflow:auto;left:0;">
														<dl class="dl-op  dl-op-diagnosis">
															<dd :class="{'disabled':appraisals.hasAdd}"
																@click="selectVal(appraisals,'appraisals',1,1,$event)"
																v-for="appraisals in appraisalsMenu">
																{{appraisals.catalogueName}}
																<span class="right" v-show="appraisals.hasAdd">已添加</span>
															</dd>
														</dl>
													</div>
												</div>
												<a @click="cancelAppraisals($event)" class="toggle-pre am-link-default am-ml-10 hideSearch">取消</a>
											</div>
										</div>
										<i class="i-error" v-show="appraisalsItems.length == 0&&appraisalsError"></i>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			</div>
			<!--amp-bd end-->
			<div class="am-btn-fixed-area">
				<a @click="saveDiagnoseConfig" class="am-btn am-btn-info w120 am-btn-lg">保存</a>
			</div>
		</div>
	</div>
</template>

<script>
	import common from '../../util/common.js';
	import { getCatalogue } from '@/util/util';

	// import Vue from 'vue'
	// import {Select} from 'element-ui'
	// Vue.component(Select.name, Select)
	// import ElementUI from 'element-ui'
	// 　　import 'element-ui/lib/theme-default/index.css'
	// 　　Vue.use(ElementUI);
	var changeThis = "";
	export default {
		name: 'nursingConfig_edit',
		props: {},
		watch: {

			valDiagnose(val) {
				if (val != '') {
					this.valChange_diagnose(val);
				}
			},
			valPostitive(val) {
				// if(val!=''){
				// 	this.valChange_positive(val);
				// }
			},
			valMeasure(val) {
				if (val != '') {
					this.valChange_measures(val);
				}
			},

			// 监控 搜索目标值改变
			valGoal(val) {
				if (val != '') {
					this.valChange_goals(val);
				}
			},

			// 监控 搜索评价值改变
			valAppraisals(val) {
				if (val != '') {
					this.valChange_appraisals(val);
				}
			},
		},
		data() {
			return {
				diaCatalogueNames: [],
				diagnoseConfig: "",
				valDiagnose: "",
				valPostitive: "",
				valMeasure: "",
				valGoal: "",
				valAppraisals: "",
				// isOrNotShowOtherPart:"",
				isShowOther: "",
				isShowOther_part: "",
				isShowChangeVal: "",
				isShowChange: "",
				isCancel: "",
				isShowAddDia: "",
				isShowAddPos: true,
				isShowAddMea: true,
				isShowAddGoal: true,
				isShowAddAppr: true,

				// isShowAddPosFirst:"",

				// 查询字典
				diagnosesDic: [],
				measuresDic: [],
				positiveDic: [],
				// 下拉菜单
				diagnosesMenu: [],
				measuresMenu: [],
				goalsMenu: [],
				appraisalsMenu: [],
				positiveMenu: [],
				// 选中的显示的阳性项
				diagnoseItem: "",
				measuresItems: [],
				goalsItems: [],
				appraisalsItems: [],
				positiveItems: [],

				// 第一个阳性项为空时为false
				firstCNisEmpty: false,

				editMode: "",
				diagnose_catalogueCode: "",
				diagnose_catalogueName: "",
				diagnose_castalogueRule: "",
				combinationNum: 1,

				diagnoseError: false,
				positiveError: false,
				measuresError: false,
				goalsError: false,
				appraisalsError: false,

				catalogue: ""

			}
		},
		compiled() {
			alert(this.positiveItems)
			// this.isShowAddOtherFun(this.positiveItems);
		},
		ready() {

		},

		methods: {

			isShowAddOtherFun: function (positiveItems) {

				for (var i = 0; i < positiveItems.length; i++) {
					var item_everyGroup_final = "";
					var finalItems = positiveItems[i].subsets[positiveItems[i].subsets.length - 1].items

					for (var j = 0; j < finalItems.length; j++) {
						if (finalItems[j].catalogueName != "") {

							item_everyGroup_final = finalItems[j].catalogueName;
							break;
						}
					}
					if (item_everyGroup_final != "") {
						
						this.positiveError = false;
						console.log(this.positiveError);
						$(".addOther_part").eq(i).css("display", "table-cell");

					} else {

						$(".addOther_part").eq(i).css("display", "none");
					}
				}
			},

			closeSearch: function (ev) {

				// $(ev.target).parents(".am-search-cancel-bar").css("display","none")
				// $(".hideSearch").css("display","none")
				// $(ev.target).parents(".am-search-picker").css("display","none");
				// $(".config-plus-btn").css("display","inline-block");
			},
			focusFun: function (ev) {
				$(ev.target).val("");
				// bugger
				// this.diagnoseItem="";
				// this.diagnose_catalogueName = "";
				// this.diagnosesMenu=[];

			},
			hover: function (ev, menu, item) {
				// console.log(item)
				if (item.hasAdd == false) {
					for (var i = 0; i < menu.length; i++) {
						menu[i].addFirst = false;
					}
					$(ev.target).siblings().removeClass("select_first");
					$(ev.target).addClass("select_first");
				}
			},
			judgeBypositive: function (positiveItems) {

				// 判断+组合是否出现
				var judgeisShowCombi = "";

				// 判断添加组合是否显示
				var allItems_col = positiveItems[positiveItems.length - 1].subsets[0].items;
				for (var i = 0; i < allItems_col.length; i++) {
					if (allItems_col[i].catalogueName != "") {
						judgeisShowCombi = allItems_col[i].catalogueName;
						break;
					}
				}
				if (judgeisShowCombi != undefined && judgeisShowCombi == '') {
					// alert(judgeBypositive!=undefined&&judgeBypositive=='');
					// $(ev.target).parents(".controllAddCombination").siblings(".addConbination").css("display","none");
					$(".addConbination").css("display", "none");
					// 第一个阳性项为空时
					this.firstCNisEmpty = true;
				} else {
					// 第一个阳性项有值时
					this.firstCNisEmpty = false;
					$(".addConbination").css("display", "block");
				}
			},
			saveDiagnoseConfig: function () {
				
				if (this.measuresItems != "" && this.measuresItems[0].catalogueName == "") {
					this.measuresItems.splice(0, 1);
				}

				for (var i = 0; i < this.positiveItems.length; i++) {
					this.positiveItems[i].setCount = this.positiveItems[i].subsets.length;
					// this.positiveItems[i].sort=i;
				}
				// for(var i=0;i<this.measuresItems.length;i++){
				// 	this.measuresItems[i].sort=i;
				// 	this.measuresItems[i].customizeId="0";
				// 	this.measuresItems[i].type=5
				// }
				var obj = {};
				var saveType = "";
				// 排除空的对象
				var that = this;
				var positiveItems_final = [];

				// this.positiveItems.forEach(function(group,index_group,array_group){

				// 	group.subsets.forEach(function(subset,index_subset,array_subset){
				// 		 if((subset.items.length==1&&subset.items[0].catalogueName=='')||subset.items.length===0){
				// 		 		array_subset.splice(index_subset,1)
				// 		 		// index_subset
				// 			}
				// 	})
				// })
				// 去除空的阳性项
				for (var i = 0; i < this.positiveItems.length; i++) {

					for (var j = 0; j < this.positiveItems[i].subsets.length; j++) {

						for (var k = 0; k < this.positiveItems[i].subsets[j].items.length; k++) {

							if (this.positiveItems[i].subsets[j].items[k].catalogueName == "") {
								this.positiveItems[i].subsets[j].items.splice(k, 1);
								k--;
							}
						}

					}

				}
				// 去除一列
				for (var i = 0; i < this.positiveItems.length; i++) {
					for (var j = 0; j < this.positiveItems[i].subsets.length; j++) {
						if (this.positiveItems[i].subsets[j].items.length == 0) {
							this.positiveItems[i].subsets.splice(j, 1)
							j--;
						}
					}
				}

				// 去除空的阳性项组合
				for (var m = 0; m < this.positiveItems.length; m++) {

					if (this.positiveItems[m].subsets.length == 0) {
						// alert("删除"+m)
						this.positiveItems.splice(m, 1)
						m--;
					}
				}


				for (var i = 0; i < this.positiveItems.length; i++) {
					this.positiveItems[i].setCount = this.positiveItems[i].subsets.length;
					this.positiveItems[i].sort = i;
					this.positiveItems[i].name = "组合" + (i + 1);
				}
				for (var i = 0; i < this.measuresItems.length; i++) {
					this.measuresItems[i].sort = i;
					this.measuresItems[i].customizeId = "0";
					this.measuresItems[i].type = 5
				}
				// alert("zuihou"+JSON.stringify(this.positiveItems))
				if (this.editMode == "create") {
					obj = {
						"catalogueCode": this.diagnose_catalogueCode,
						"catalogueName": this.diagnose_catalogueName,
						"catalogueRule": this.diagnose_catalogueRule,
						"groups": this.positiveItems,
						"measures": this.measuresItems,
						"goals": this.goalsItems,
						"appraisals": this.appraisalsItems
					}
					saveType = "post";
				} else {
					obj = {
						"catalogueCode": this.diagnose_catalogueCode,
						"catalogueName": this.diagnose_catalogueName,
						"catalogueRule": this.diagnose_catalogueRule,
						"groups": this.positiveItems,
						"id": this.diagnoseConfig.id,
						"measures": this.measuresItems,
						"goals": this.goalsItems,
						"appraisals": this.appraisalsItems
					}
					saveType = "put";
				}

				if (this.diagnose_catalogueName != "" && this.positiveItems.length != 0 && this.measuresItems != "" && this.goalsItems.length != 0 && this.appraisalsItems.length != 0) {
					common.ajax({
						// 老接口
						//url: "knowledge-service/diagnose/config",
						// 新接口
						url: "knowledge-service/diagnosis/config",
						dataType: "json",
						type: saveType,
						data: JSON.stringify(obj),
						async: false,
						callback: function () {

							console.log("保存成功");
							// layer.closeAll();
							parent.layer.msg('保存成功！', {time: 1000}, function () {
								layer.closeAll();
								that.$emit("showNav");
							})
							that.$emit("saveDiagnoseConfig");
						},
						errorCallback: function () {

						}
					});

				} else {
					if (this.diagnose_catalogueName == "") {
						this.diagnoseError = true;
					}
					if (this.positiveItems.length == 0) {

						// 没有positiveItems时，阳性项为空
						this.firstCNisEmpty = true;
						this.positiveError = true;
					}
					if (this.measuresItems.length == 0) {
						this.measuresError = true;
					}
					if (this.goalsItems.length == 0) {
						this.goalsError = true;
					}
					if (this.appraisalsItems.length == 0) {
						this.appraisalsError = true;
					}
					if (this.diagnose_catalogueName == "" && this.positiveItems.length == 0 && this.measuresItems == "" && this.goalsItems.length == 0 && this.appraisalsItems.length == 0) {

					} else {
						for (var i = 0; i < this.positiveItems.length; i++) {
							this.positiveItems[i].isOrNotShowOtherPart = true
						}
						
					}
					$(".ui-sys-bar").css("display","none");
					layer.open({
						content: "您没有完成配置，数据还不能保存。",
						btn: ["直接离开", "继续配置"],
						yes: function () {
			
							$(".ui-sys-bar").css("display","block");
							layer.closeAll();
						},
						btn2: function () {

						}
					})
				}

				// 当阳性项的groups为0的时候给groups一个空的group这样 +阳性项这个按钮才能显示出来。
				if (this.positiveItems.length == 0) {
					var obj = {
						"name": "",
						"setCount": 0,
						"sort": 0,
						"subsets": [
							{
								"items": [
									{
										"catalogueCode": "",
										"catalogueName": "",
										"catalogueRule": "",
										"type": 3
									}
								]
							}
						]
					}
					this.positiveItems.push(obj);

				}
			},
			addCombinationFun: function (ev) {
				// this.isShowOther_part=false;
				this.combinationNum += 1;
				var obj = {
					"isOrNotShowOtherPart": false,
					"name": "组合" + this.combinationNum,
					"setCount": 0,
					"sort": 0,
					"subsets": [
						{
							"items": [
								{
									"catalogueCode": "",
									"catalogueName": "",
									"catalogueRule": "",
									"type": 3
								}
							]
						}
					]
				}
				this.positiveItems.push(obj);
				$(ev.target).parents(".addConbination").css("display", "none");
			},
			addOtherFun: function (group_index, ev) {
				var obj = {
					"items": [
						{
							"catalogueCode": "",
							"catalogueName": "",
							"catalogueRule": "",
							"type": 3
						}
					]
				}
				this.positiveItems[group_index].subsets.push(obj);
				// this.isShowOther_part=false;
				$(ev.target).parents(".addOther_part").css("display", "none");
			},
			delPositive: function (positive_index2, subset_index, group_index, ev) {
				// 点击删除阳性项
				this.positiveItems[group_index].subsets[subset_index].items.splice(positive_index2, 1);
				// 修改

				// 当是删除的时候删除到最后一个的时候把新加的那一列删掉
				if (this.positiveItems[group_index].subsets[subset_index].items.length == 0 || this.positiveItems[group_index].subsets[subset_index].items.length == 1 && this.positiveItems[group_index].subsets[subset_index].items[0].catalogueName == "") {
					this.positiveItems[group_index].subsets.splice(subset_index, 1);
				}
				// 当一个组合的subsets为空的时候删除一行
				for (var i = 0; i < this.positiveItems.length; i++) {
					if (this.positiveItems[i].subsets.length == 0) {
						this.positiveItems.splice(i, 1);
					}
				}

				// var sumSubsset=0;
				// for(var i=0;i<this.positiveItems.length;i++){
				// 		for(var j=0;j<this.positiveItems[i].subsets.length;j++)
				// 		{
				// 			for(var k=0;k<this.positiveItems[i].subsets[j].items.length;k++)
				// 			if(this.positiveItems[i].subsets[j].items[k].catalogueName!=""){
				// 				break;
				// 			}
				// 			if(k==this.positiveItems[i].subsets[j].items.length){
				// 				sumSubsset++;
				// 			}

				// 		}

				// 		if(sumSubsset==this.positiveItems[i].subsets.length){
				// 			this.positiveItems.splice(i,1);
				// 			// $(ev.target).parents(".controllAddother_part").siblings(".addOther_part").css("display","none")
				// 		}
				// 	}
				if (this.positiveItems.length == 0) {
					var obj = {
						"isOrNotShowOtherPart": false,
						"name": "",
						"setCount": 0,
						"sort": 0,
						"subsets": [
							{
								"items": [
									{
										"catalogueCode": "",
										"catalogueName": "",
										"catalogueRule": "",
										"type": ""
									}
								]
							}
						]
					}
					this.positiveItems.push(obj);
				}
				// 在删除操作之后判断最后一个组合是否有阳性项，如果有那么显示+组合否则不出现
				this.judgeBypositive(this.positiveItems);
				// 在删除操作之后判断每一组最后列是否有阳性项，如果有那么显示+条件部分否则不出现

				// for(var i=0;i<this.positiveItems.length;i++){
				// 	var item_everyGroup_final="";
				// 	var allItems_everyGroup_final=this.positiveItems[i].subsets[this.positiveItems[i].subsets.length-1].items
				// 	 for(var j=0;j<allItems_everyGroup_final.length;j++){
				// 	 	if(allItems_everyGroup_final[i].catalogueName!=""){

				// 	 		item_everyGroup_final=allItems_everyGroup_final[i].catalogueName;
				// 	 		break;
				// 	 	}
				// 	 }
				// 	 if(item_everyGroup_final!=""){
				// 	 	// for(var k=0;k<$(".addOther_part").length;k++){

				// 			// 	}
				// 			$(".addOther_part").eq(i).css("display","table-cell");

				// 	}else{
				// 		$(".addOther_part").eq(i).css("display","none");
				// 	}
				// }
				// 上面代码简化为
				this.isShowAddOtherFun(this.positiveItems);
			},
			delMeasure: function (index) {
				this.measuresItems.splice(index, 1);
			},
			// 删除目标
			delGoal: function (index) {
				this.goalsItems.splice(index, 1);
			},
			// 删除评价
			delAppraisals: function (index) {
				this.appraisalsItems.splice(index, 1);
			},

			selectVal: function (item, type, subset_index, group_index, ev, positiveMenu, positive_index) {
				if (!item.hasAdd) {
					//debugger;
					if (type == "diagnose") {
						this.diagnose_catalogueCode = item.catalogueCode;
						this.diagnose_catalogueRule = item.catalogueRule;
						this.diagnose_catalogueName = item.catalogueName;
						this.valDiagnose = item.catalogueName;
						this.diagnoseItem = item.catalogueName;
						this.isShowChangeVal = true;
						this.isCancel = false;
						this.isShowAddDia = false;
						this.isShowChange = true;
						// 更换诊断的时候清空下面的
						this.positiveItems = [];

						var obj = {
							"isOrNotShowOtherPart": false,
							"name": "",
							"setCount": 0,
							"sort": 0,
							"subsets": [
								{
									"items": [
										{
											"catalogueCode": "",
											"catalogueName": "",
											"catalogueRule": "",
											"type": ""
										}
									]
								}
							]
						}
						this.positiveItems.push(obj);
						$(".am-after-panel-btn").css("display", "none");
						$(".addOther_part").css("display", "none");
						this.measuresItems = [];
						// 更换诊断的时候清空目标和评价
						this.goalsItems = [];
						this.appraisalsItems = [];

					} else if (type == "positive") {
						var obj = {
							"catalogueCode": item.catalogueCode,
							"catalogueName": item.catalogueName,
							"catalogueRule": item.catalogueRule,
							"type": 3
						}

						this.positiveItems[group_index].subsets[subset_index].items.push(obj);

						this.isShowAddPos = true;
						// 当有内容添加之后显示添加其他条件和组合
						
						this.isShowOther = true;
						this.isShowOther_part = true;
						// if(this.positiveItems[group_index].subsets[subset_index])
						$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
						$(ev.target).parents(".am-search-cancel-bar").css("display", "none");

						// 把已经添加的那一个小词添加改为不能添加
						positiveMenu[positive_index].hasAdd = true;

						// 当选中阳性项之后+条件其他部分出现+组合出现
						$(ev.target).parents(".controllAddother_part").siblings(".addOther_part").css("display", "table-cell");

						// $(ev.target).parents(".controllAddCombination").siblings("div.addConbination").css("display","block");
						// 组合中最后一行判断是否有选中的阳性项，有的话就显示加组合\

						// 因为初始化是一个对象因此push进去的items是从第二个开始
						// var judgeBypositive="";
						// if(this.editMode=="create")
						// {
						// 	judgeBypositive=this.positiveItems[this.positiveItems.length-1].subsets[0].items[1].catalogueName;

						// }else{
						// 	judgeBypositive=this.positiveItems[this.positiveItems.length-1].subsets[0].items[0].catalogueName;

						// }
						// if(judgeBypositive!=undefined&&judgeBypositive==''){
						// 	// alert(judgeBypositive!=undefined&&judgeBypositive=='');
						// 	// $(ev.target).parents(".controllAddCombination").siblings(".addConbination").css("display","none");
						// 	$(".addConbination").css("display","none");
						// }else{
						// 	// alert(judgeBypositive);
						// 	$(".addConbination").css("display","block");
						// }
						this.judgeBypositive(this.positiveItems, group_index);
					} else if (type == "goal") {
						this.goalsItems.push(item);
						this.isShowAddGoal = true;
						$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
						$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
					} else if (type == "appraisals") {
						this.appraisalsItems.push(item);
						this.isShowAddAppr = true;
						$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
						$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
					} else {
						this.measuresItems.push(item);
						this.isShowAddMea = true;
						$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
						$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
					}
				}
			},
			closeLayer: function () {
				this.$emit("showNav")
				layer.closeAll()
			},
			init: function () {

				this.diagnoseConfig = "";
				this.valDiagnose = "";
				this.valPostitive = "";
				this.valMeasure = "";
				this.valAppraisals = "";
				this.isShowOther = "";
				this.isShowChangeVal = "";
				this.isShowChange = "";
				this.isCancel = "",
					this.isShowAddDia = "";
				this.isShowAddPos = true;
				this.isShowAddMea = true;
				this.isShowAddGoal = true;
				this.isShowAddAppr = true;
				// isShowAddPosFirst:"",
				// 查询字典
				this.diagnosesDic = [];
				this.measuresDic = [];
				this.goalsDic = [];
				this.appraisalsDic = [];
				this.positiveDic = [];
				// 下拉菜单
				this.diagnosesMenu = [];
				this.measuresMenu = [];
				this.goalsMenu = [];
				this.appraisalsMenu = [];
				this.positiveMenu = [];
				// 选中的显示的阳性项
				this.diagnoseItem = "";
				this.measuresItems = [];
				this.goalsItems = [];
				this.appraisalsItems = [];
				this.positiveItems = [];

				this.editMode = "";
				this.diagnose_catalogueCode = "";
				this.diagnose_catalogueName = "";
				this.diagnose_catalogueRule = "";
				this.combinationNum = 1;

				this.diagnoseError = false;
				this.positiveError = false;
				this.measuresError = false;
				this.goalsError = false;
				this.appraisalsError = false;

			},
			loadData: function (val, type, diaCatalogueNames, diagnosesDic, positiveDic, measuresDic, goalsDic, appraisalsDic) {

				this.init();
				this.diagnosesDic = diagnosesDic;
				this.positiveDic = positiveDic;
				this.measuresDic = measuresDic;
				// 目标
				this.goalsDic = goalsDic;
				// 评价
				this.appraisalsDic = appraisalsDic;
				this.diaCatalogueNames = diaCatalogueNames;

				// this.getDiagnose();
				// this.getPositive();
				// this.getMeasures();

				// 当已进入就关闭所有的打开的搜索
				$(".enterClose").css("display", "none");
				$(".enterOpen").css("display", "inline-block");
				$(".addOther_part").css("display", "none");
				// $(".conbination").css("color","red");Fdel
				this.diagnoseConfig = val;

				// if(this.diagnoseConfig.catalogueName){
				// 	this.isCancel=false;
				// 	this.isShowAddDia=false;
				// 	this.isShowChange=true;
				// 	this.isShowChangeVal=true
				// 	// 获得已有的数据诊断，阳性项，护理措施
				// 	this.diagnoseItem=this.diagnoseConfig.catalogueName;
				// 	this.measuresItems=this.diagnoseConfig.measures;
				// 	this.positiveItems=this.diagnoseConfig.groups;
				// }else{
				// 	this.isCancel=false;
				// 	this.isShowAddDia=true;
				// 	this.isShowChange=false;
				// 	this.isShowChangeVal=false;
				// 	this.diagnoseItem=this.diagnoseConfig.catalogueName;
				// 	this.measuresItems=this.diagnoseConfig.measures;
				// 	this.positiveItems=this.diagnoseConfig.groups;
				// }

				if (type == "create") {
					this.editMode = "create";
					// this.diagnoseConfig=val;
					this.isShowOther = false;
					// isShowAddPosFirst=true;
					this.isCancel = false;
					this.isShowAddDia = true;
					this.isShowChange = false;
					this.isShowChangeVal = false;
					this.diagnoseItem = this.diagnoseConfig.catalogueName;
					this.measuresItems = this.diagnoseConfig.measures;
					this.positiveItems = this.diagnoseConfig.groups;
					this.firstCNisEmpty = false;
					// 目标
					this.goalsItems = this.diagnoseConfig.goals;
					// 评价
					this.appraisalsItems = this.diagnoseConfig.appraisals;
					for (var i = 0; i < this.diagnoseConfig.groups.length; i++) {
						this.diagnoseConfig.groups.isOrNotShowOtherPart = false;
					}
				} else {
					// 如果是修改每一个组一定有+条件其他部分
					// this.isOrNotShowOtherPart=true;
					this.editMode = "view";
					for (var i = 0; i < this.diagnoseConfig.groups.length; i++) {
						this.diagnoseConfig.groups[i].isOrNotShowOtherPart = true;
					}
					//
					this.diagnoseConfig = val;
					this.isShowOther = true;

					this.isCancel = false;
					this.isShowAddDia = false;
					this.isShowChange = true;
					this.isShowChangeVal = true

					// 获得已有的数据诊断，阳性项，护理措施

					this.diagnoseItem = this.diagnoseConfig.catalogueName;
					this.measuresItems = this.diagnoseConfig.measures;
					this.positiveItems = this.diagnoseConfig.groups;
					// 获得已有的目标，评价
					this.goalsItems = this.diagnoseConfig.goals;
					this.appraisalsItems = this.diagnoseConfig.appraisals;

					this.diagnose_catalogueName = this.diagnoseItem;
					this.diagnose_catalogueRule = this.diagnoseConfig.catalogueRule;
					this.diagnose_catalogueCode = this.diagnoseConfig.catalogueCode;
				}
				this.judgeBypositive(this.positiveItems);
				this.isShowAddOtherFun(this.positiveItems);
				// var judgeBypositive="";
				// 	if(this.editMode=="create")
				// 	{
				// 		judgeBypositive=this.positiveItems[this.positiveItems.length-1].subsets[0].items[1].catalogueName;

				// 	}else{
				// 		judgeBypositive=this.positiveItems[this.positiveItems.length-1].subsets[0].items[0].catalogueName;

				// 	}
				// 	if(judgeBypositive!=undefined&&judgeBypositive==''){
				// 		// alert(judgeBypositive!=undefined&&judgeBypositive=='');
				// 		// $(ev.target).parents(".controllAddCombination").siblings(".addConbination").css("display","none");
				// 		$(".addConbination").css("display","none");
				// 	}else{
				// 		// alert(judgeBypositive);
				// 		$(".addConbination").css("display","block");
				// 	}
			},
			changeDiagnose: function (ev) {
				this.valDiagnose = "";
				this.isCancel = true;
				this.isShowChange = false;
				this.isShowChangeVal = false;
				this.isShowAddDia = false;
				this.valDiagnose = this.diagnoseItem;
				// 修改bug
				// this.diagnoseItem="";
				$(ev.target).parents(".toggle-config").addClass("active");
			},
			cancelDiagnose: function (ev) {
				// 清除搜索痕迹
				this.valDiagnose = "";
				// $(ev.target).parents(".toggle-config").removeClass("active");
				if (this.diagnoseItem) {
					this.isCancel = false;
					this.isShowChange = true;
					this.isShowChangeVal = true;
					this.isShowAddDia = false;

				} else {
					this.isCancel = false;
					this.isShowChange = false;
					this.isShowAddDia = true;
					this.isShowChangeVal = false;
					// 因为如果用vue isShowAddDia触发的话不能实现。所以又采用下面的代码
					$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
					$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
				}
			},
			cancelPositive: function (ev) {
				// this.isShowAddPos=true;
				$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
				$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
			},
			cancelMeasure: function (ev) {
				this.isShowAddMea = true;
				$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
				$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
			},
			// 取消添加目标
			cancelGoal: function (ev) {
				this.isShowAddGoal = true;
				$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
				$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
			},
			// 取消添加评价
			cancelAppraisals: function (ev) {
				this.isShowAddAppr = true;
				$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
				$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
			},
			// 添加诊断
			addDiagnose: function (ev) {

				// 清除搜索痕迹
				this.valDiagnose = "";
				this.isCancel = true;
				this.diagnosesMenu = [];
				$(ev.target).siblings(".am-search-cancel-bar").css("display", "inline-block")
				this.isShowChange = false;
				this.isShowChangeVal = false;
				// this.isShowAddDia=false;
				$(ev.target).css("display", "none")
				$(".mycloseSearchPanel_pos").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_pos").css("display", "inline-block");
				$(".mycloseSearchPanel_mea").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_mea").css("display", "inline-block");
				$(".mycloseSearchPanel_goal").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_goal").css("display", "inline-block");
				$(".mycloseSearchPanel_appr").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_appr").css("display", "inline-block");
			},
			// 添加阳性项
			addPositive: function (ev) {
				this.valPostitive = "";
				this.isShowAddPos = false;
				this.positiveMenu = [];
				$(ev.target).siblings(".am-search-cancel-bar").css("display", "inline-block");
				$(ev.target).css("display", "none");
				$(".mycloseSearchPanel_mea").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_mea").css("display", "inline-block");
				$(".mycloseSearchPanel_dia").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_dia").css("display", "inline-block");
				$(".mycloseSearchPanel_goal").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_goal").css("display", "inline-block");
				$(".mycloseSearchPanel_appr").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_appr").css("display", "inline-block");
				// 修改bug2 点击阳性项目 突然出现+护理诊断
				if (this.diagnoseItem != '') {
					$(".hideDiagnose").css("display", "none")
				}
				// 修改bug 点击更换再点击其他，诊断消失
				this.cancelDiagnose(ev);
			},
			addMeasure: function (ev) {

				this.valMeasure = "";
				this.measuresMenu = [];
				// bug1第一次点击+措施消失的问题
				// this.isShowAddMea=false;
				$(ev.target).siblings(".am-search-cancel-bar").css("display", "inline-block");
				$(ev.target).css("display", "none");

				$(".mycloseSearchPanel_pos").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_pos").css("display", "inline-block");
				$(".mycloseSearchPanel_dia").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_dia").css("display", "inline-block");
				$(".mycloseSearchPanel_goal").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_goal").css("display", "inline-block");
				$(".mycloseSearchPanel_appr").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_appr").css("display", "inline-block");
				// 修改bug2 点击阳性项目 突然出现+护理诊断
				if (this.diagnoseItem != '') {
					$(".hideDiagnose").css("display", "none")
				}
				// 修改bug 点击更换再点击其他，诊断消失
				this.cancelDiagnose(ev);
			},

			// 点击目标显示搜索
			addGoal: function (ev) {
				if(this.diagnoseItem != '') {
					this.valGoal = "";
					this.goalsMenu = [];
					$(ev.target).siblings(".am-search-cancel-bar").css("display", "inline-block");
					$(ev.target).css("display", "none");

					$(".mycloseSearchPanel_pos").siblings(".am-search-cancel-bar").css("display", "none");
					$(".mycloseSearchPanel_pos").css("display", "inline-block");
					$(".mycloseSearchPanel_dia").siblings(".am-search-cancel-bar").css("display", "none");
					$(".mycloseSearchPanel_dia").css("display", "inline-block");
					$(".mycloseSearchPanel_mea").siblings(".am-search-cancel-bar").css("display", "none");
					$(".mycloseSearchPanel_mea").css("display", "inline-block");
					$(".mycloseSearchPanel_appr").siblings(".am-search-cancel-bar").css("display", "none");
					$(".mycloseSearchPanel_appr").css("display", "inline-block");
					// 修改bug2 点击阳性项目 突然出现+护理诊断
					if (this.diagnoseItem != '') {
						$(".hideDiagnose").css("display", "none")
					}
				}
				// 修改bug 点击更换再点击其他，诊断消失
				this.cancelDiagnose(ev);
			},

			// 点击评价显示搜索
			addAppraisals: function (ev) {
				this.valAppraisals = "";
				this.appraisalsMenu = [];
				$(ev.target).siblings(".am-search-cancel-bar").css("display", "inline-block");
				$(ev.target).css("display", "none");

				$(".mycloseSearchPanel_pos").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_pos").css("display", "inline-block");
				$(".mycloseSearchPanel_dia").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_dia").css("display", "inline-block");
				$(".mycloseSearchPanel_mea").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_mea").css("display", "inline-block");
				$(".mycloseSearchPanel_goal").siblings(".am-search-cancel-bar").css("display", "none");
				$(".mycloseSearchPanel_goal").css("display", "inline-block");
				// 修改bug2 点击阳性项目 突然出现+护理诊断
				if (this.diagnoseItem != '') {
					$(".hideDiagnose").css("display", "none")
				}
				// 修改bug 点击更换再点击其他，诊断消失
				this.cancelDiagnose(ev);
			},

			// 当点击回车键选中第一个
			onEnter_diagnose: function (ev) {

				if (ev.keyCode == 13 && this.diagnosesMenu.length != 0) {
					// this.valDiagnose="hudachang"
					for (var i = 0; i < this.diagnosesMenu.length; i++) {

						if (!this.diagnosesMenu[i].hasAdd) {
							break;
						}
					}
					if (i < this.diagnosesMenu.length) {
						this.diagnoseItem = this.diagnosesMenu[i].catalogueName;
						// 为保存
						this.diagnose_catalogueCode = this.diagnosesMenu[i].catalogueCode;
						this.diagnose_catalogueRule = this.diagnosesMenu[i].catalogueRule;
						this.diagnose_catalogueName = this.diagnosesMenu[i].catalogueName;
						this.isCancel = false;
						this.isShowChange = true;
						this.isShowChangeVal = true;

						this.isShowAddDia = false;
					} else {

						this.isCancel = false;
						this.isShowChange = false;
						this.isShowChangeVal = false;

						// this.isShowAddDia=false;
						$(".mycloseSearchPanel_dia").css("display", "inline-block");
					}

					// 更换诊断的时候清空下面的
					this.positiveItems = [];

					var obj = {
						"isOrNotShowOtherPart": false,
						"name": "",
						"setCount": 0,
						"sort": 0,
						"subsets": [
							{
								"items": [
									{
										"catalogueCode": "",
										"catalogueName": "",
										"catalogueRule": "",
										"type": ""
									}
								]
							}
						]
					}
					this.positiveItems.push(obj);
					$(".am-after-panel-btn").css("display", "none");
					$(".addOther_part").css("display", "none");
					this.measuresItems = [];
					this.goalsItems = [];
					this.appraisalsItems = [];
				}
			},
			onEnter_positive: function (ev, subset_index, group_index) {
				// var i=0;
				// alert(JSON.stringify(this.positiveMenu[i].asAdd));
				// 	while(!this.positiveMenu[i].hasAdd){
				// 		i++;
				// 	}
				// 	alert(this.positiveMenu[i].hasAdd);

				if (ev.keyCode == 13) {
					for (var i = 0; i < this.positiveMenu.length; i++) {

						if (!this.positiveMenu[i].hasAdd) {
							break;
						}
					}

					if (i < this.positiveMenu.length) {
						var obj = {
							"catalogueCode": this.positiveMenu[i].catalogueCode,
							"catalogueName": this.positiveMenu[i].catalogueName,
							"catalogueRule": this.positiveMenu[i].catalogueRule,
							"type": 0
						}

						this.positiveItems[group_index].subsets[subset_index].items.push(obj);
						this.isShowAddPos = true;
						// this.isShowOther=true;
						// 取消阳性项菜单
						$(ev.target).parents(".am-search-cancel-bar").css("display", "none")
						$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
						// $(ev.target).css("display","none");
						//  $(ev)
						this.positiveMenu[i].hasAdd = true;
						// 当选中阳性项之后+条件其他部分出现+组合出现
						$(ev.target).parents(".controllAddother_part").siblings(".addOther_part").css("display", "table-cell");
						this.judgeBypositive(this.positiveItems);
					} else {
						$(ev.target).parents(".am-search-cancel-bar").css("display", "none")
						$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
					}
				}
			},
			onEnter_measure: function (ev) {
				if (ev.keyCode == 13) {
					for (var i = 0; i < this.measuresMenu.length; i++) {
						if (!this.measuresMenu[i].hasAdd) {
							break;
						}
					}
					// this.valDiagnose="hudachang"
					if (i < this.measuresMenu.length) {
						this.measuresItems.push(this.measuresMenu[i]);
						this.measuresMenu[i].hasAdd = true;
						this.isShowAddMea = true;
					}
					$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
					$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
				}
			},

			onEnter_goal: function (ev) {
				if (ev.keyCode == 13) {
					for (var i = 0; i < this.goalsMenu.length; i++) {
						if (!this.goalsMenu[i].hasAdd) {
							break;
						}
					}
					if (i < this.goalsMenu.length) {
						this.goalsItems.push(this.goalsMenu[i]);
						this.goalsMenu[i].hasAdd = true;
						this.isShowAddGoal = true;
					}
					$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
					$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
				}
			},

			onEnter_appraisals: function (ev) {
				if (ev.keyCode == 13) {
					for (var i = 0; i < this.appraisalsMenu.length; i++) {
						if (!this.appraisalsMenu[i].hasAdd) {
							break;
						}
					}
					if (i < this.appraisalsMenu.length) {
						this.appraisalsItems.push(this.appraisalsMenu[i]);
						this.appraisalsMenu[i].hasAdd = true;
						this.isShowAddAppr = true;
					}
					$(ev.target).parents(".am-search-cancel-bar").css("display", "none");
					$(ev.target).parents(".am-search-cancel-bar").siblings(".config-plus-btn").css("display", "inline-block");
				}
			},

			

			// 当输入值变化后搜索
			valChange_diagnose: function (value) {
				// 把获得的值向后台请求获得数据
				// 先制空
				this.diagnosesMenu = [];
				// 当进行数据库所搜后
				// this.getDiagnose();
				// var arr=[
				// 		{"name":"消化道出血222222","age":"19"},
				// 		{"name":"消化道肿瘤","age":"19"},
				// 		{"name":"消化道溃疡","age":"19"}
				// ];
				var that = this;

				// this.diagnosesDic.forEach(function(el,index,array){
				// 		if(el.catalogueSpell!=null&&el.catalogueSpell!=undefined){
				// 			if(el.catalogueSpell.indexOf(value.toUpperCase())>=0){
				// 				el.hasAdd=false;
				// 				that.diagnosesMenu.push(el);
				// 			}
				// 		}
				// 	});
				var pattern = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])*$/gi;
				if (this.diagnosesDic != "") {
					if (pattern.test(value)) {
						this.diagnosesDic.forEach(function (el, index, array) {
							if (el.catalogueName != null && el.catalogueName != undefined) {
								if (el.catalogueName.indexOf(value) >= 0) {
									el.hasAdd = false;
									that.diagnosesMenu.push(el);
								}
							}
						});
					} else {
						this.diagnosesDic.forEach(function (el, index, array) {
							if (el.catalogueSpell != null && el.catalogueSpell != undefined) {
								if (el.catalogueSpell.indexOf(value.toUpperCase()) >= 0) {
									el.hasAdd = false;
									that.diagnosesMenu.push(el);
								}
							}
						});
					}
				}
				if (this.diagnosesMenu != "") {
					this.diagnosesMenu.forEach(function (el) {
						that.diaCatalogueNames.forEach(function (val) {
							if (val == el.catalogueName) {
								el.hasAdd = true;
							}
						});
					})
				}

				// for(var i=0;i<this.diagnosesMenu.length;i++){
				// 			if(!this.diagnosesMenu[i].hasAdd)
				// 			{
				// 				break;
				// 			}
				// 		}
				// 		// alert("menu的"+i)
				for (var j = 0; j < this.diagnosesMenu.length; j++) {
					this.diagnosesMenu[j].addFirst = false;
				}
				if (this.diagnosesMenu.length != 0) {
					this.diagnosesMenu[0].addFirst = true;
				}
			},
			valChange_positive: function (group_index, ev) {
				this.positiveMenu = [];
				var that = this;
				// this.positiveDic.forEach(function(el,index,array){
				// 		if(el.catalogueSpell!=null&&el.catalogueSpell!=undefined){
				// 			if(el.catalogueSpell.indexOf(that.valPostitive.toUpperCase())>=0){
				// 				el.hasAdd=false;
				// 				// if(that.positiveItems)
				// 				that.positiveMenu.push(el);
				// 			}
				// 		}
				// 	});
				var pattern = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])*$/gi;
				if (this.positiveDic != "") {
					if (pattern.test(that.valPostitive)) {
						this.positiveDic.forEach(function (el, index, array) {
							if (el.catalogueName != null && el.catalogueName != undefined) {
								if (el.catalogueName.indexOf(that.valPostitive) >= 0) {
									el.hasAdd = false;
									that.positiveMenu.push(el);
								}
							}
						});

					} else {
						this.positiveDic.forEach(function (el, index, array) {
							if (el.catalogueSpell != null && el.catalogueSpell != undefined) {
								if (el.catalogueSpell.indexOf(that.valPostitive.toUpperCase()) >= 0) {
									el.hasAdd = false;
									that.positiveMenu.push(el);
								}
							}
						});
					}
				}

				// 获得一个组内所已经选好的阳性
				var positiveArray = [];
				if (that.positiveItems != "" && that.positiveItems[group_index].subsets != "") {
					that.positiveItems[group_index].subsets.forEach(function (el, index, array) {
						if (el.items != "") {
							el.items.forEach(function (el_2, index_2, array_2) {
								if (el_2.catalogueName != '') {
									positiveArray.push(el_2.catalogueName);
								}
							});
						}
					});
				}
				// 已经有选好的项目的时候显示已经添加
				if (that.positiveMenu != "") {
					that.positiveMenu.forEach(function (el, index, array) {
						positiveArray.forEach(function (positive) {
							if (el.catalogueName == positive) {
								el.hasAdd = true
							}
						});
					});
				}
				// 寻找第一个未添加的阳性项目加背景
				for (var i = 0; i < this.positiveMenu.length; i++) {
					if (!this.positiveMenu[i].hasAdd) {
						break;
					}
				}
				for (var j = 0; j < this.positiveMenu.length; j++) {
					this.positiveMenu[j].addFirst = false;
				}
				if (this.positiveMenu.length != 0) {
					this.positiveMenu[i].addFirst = true;
				}
				// $(ev.target).parents(".am-search-picker").siblings(".am-dropdown").children(".dl-op-diagnosis").find(".findDd").css("background","red");
			},
			valChange_measures: function (value) {
				this.measuresMenu = [];
				// this.getMeasures(value);
				var that = this;
				// this.measuresDic.forEach(function(el,index,array){
				// 		if(el.catalogueSpell!=null&&el.catalogueSpell!=undefined){
				// 			if(el.catalogueSpell.indexOf(value.toUpperCase())>=0){
				// 				el.hasAdd=false;
				// 				that.measuresMenu.push(el);
				// 			}
				// 		}
				// 	});
				var pattern = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])*$/gi;
				if (this.measuresDic != "") {
					if (pattern.test(value)) {
						this.measuresDic.forEach(function (el, index, array) {
							if (el.catalogueName != null && el.catalogueName != undefined) {
								if (el.catalogueName.indexOf(value) >= 0) {
									el.hasAdd = false;
									that.measuresMenu.push(el);
								}
							}
						});
					} else {
						this.measuresDic.forEach(function (el, index, array) {
							if (el.catalogueSpell != null && el.catalogueSpell != undefined) {
								if (el.catalogueSpell.indexOf(value.toUpperCase()) >= 0) {
									el.hasAdd = false;
									that.measuresMenu.push(el);
								}
							}
						});
					}
				}
				if (that.measuresMenu != "") {
					that.measuresMenu.forEach(function (el, index, array) {
						if (that.measuresItems != "") {
							that.measuresItems.forEach(function (measure) {
								if (el.catalogueName == measure.catalogueName) {
									el.hasAdd = true
								}
							})
						}
					});
				}
				for (var i = 0; i < this.measuresMenu.length; i++) {

					if (!this.measuresMenu[i].hasAdd) {
						break;
					}
				}
				for (var j = 0; j < this.measuresMenu.length; j++) {
					this.measuresMenu[j].addFirst = false;
				}
				if (this.measuresMenu.length != 0) {
					this.measuresMenu[i].addFirst = true;
				}
			},

			// 目标搜索列表
			valChange_goals: function (value) {
				this.goalsMenu = [];
				var that = this;
				// 中文
				var pattern = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])*$/gi;
				var diagnoseItem = "<诊断类><"+this.diagnoseItem+">";
				//debugger
				if (this.goalsDic != "") {
					if (pattern.test(value)) {
						this.goalsDic.forEach(function (el, index,) {
							if (el.catalogueName != null && el.catalogueName != undefined) {
								if (el.catalogueName.indexOf(value) >= 0&&el.catalogueRemark.indexOf(diagnoseItem)>= 0) {
									el.hasAdd = false;
									that.goalsMenu.push(el);
								}
							}
						});
					} else {
						this.goalsDic.forEach(function (el, index, array) {
							if (el.catalogueSpell != null && el.catalogueSpell != undefined) {
								if (el.catalogueSpell.indexOf(value.toUpperCase()) >= 0&&el.catalogueRemark.indexOf(diagnoseItem)>= 0) {
									el.hasAdd = false;
									that.goalsMenu.push(el);
								}
							}
						});
					}
				}
				if (that.goalsMenu != "") {
					that.goalsMenu.forEach(function (el, index, array) {
						if (that.goalsItems != "") {
							that.goalsItems.forEach(function (goal) {
								if (el.catalogueCode == goal.catalogueCode) {
									el.hasAdd = true
								}
							})
						}
					});
				}
				for (var i = 0; i < this.goalsMenu.length; i++) {

					if (!this.goalsMenu[i].hasAdd) {
						break;
					}
				}
			},

			// 评价搜索列表
			valChange_appraisals: function (value) {
				this.appraisalsMenu = [];
				var that = this;
				var pattern = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])*$/gi;

				if (this.appraisalsDic != "") {
					if (pattern.test(value)) {
						this.appraisalsDic.forEach(function (el, index, array) {
							if (el.catalogueName != null && el.catalogueName != undefined) {
								if (el.catalogueName.indexOf(value) >= 0) {
									el.hasAdd = false;
									that.appraisalsMenu.push(el);
								}
							}
						});

					} else {
						this.appraisalsDic.forEach(function (el, index, array) {
							if (el.catalogueSpell != null && el.catalogueSpell != undefined) {
								if (el.catalogueSpell.indexOf(value.toUpperCase()) >= 0) {
									el.hasAdd = false;
									that.appraisalsMenu.push(el);
								}
							}
						});
					}
				}
				if (that.appraisalsMenu != "") {
					that.appraisalsMenu.forEach(function (el, index, array) {
						if (that.appraisalsItems != "") {
							that.appraisalsItems.forEach(function (appraisals) {
								if (el.catalogueCode == appraisals.catalogueCode) {
									el.hasAdd = true
								}
							})
						}
					});
				}
				for (var i = 0; i < this.appraisalsMenu.length; i++) {

					if (!this.appraisalsMenu[i].hasAdd) {
						break;
					}
				}
			}
		},
		mounted() {
			this.catalogue = getCatalogue();
			// this.getDiagnose();
			// 		this.getPositive();
			// 		this.getMeasures();
			changeThis = this;
			var that = this;
			
			$(document).on("click", function (ev) {

				if (!$(ev.target).parents().hasClass("am-search-cancel-bar")) {
					// if($(ev.target).hasClass("replace")){
					// 	alert($(ev.target).val());
					// }else{
					$(".config-plus-btn").css("display", "inline-block")
					$(".am-search-cancel-bar").css("display", "none")
					if (that.diagnoseItem != '') {
						$(".clickOtherClose").css("display", "none");
						that.isCancel = false;
						that.isShowChange = true;
						that.isShowChangeVal = true;
						that.isShowAddDia = false;
					} else {
						$(".clickOtherClose").css("display", "inline-block")
					}
					// }
					// 	if(this.diagnoseItem!=""){
					// this.isCancel=false;
					// this.isShowChange=true;
					// this.isShowChangeVal=true;
					// this.isShowAddDia=false;
					// 	}
				}
			})
		}
	};

	// $(".layui-layer-shade").on("click",function(){
	// 		  		 // changeThis.$emit('showNav',true);
	// 		  		 alert(1);
	// 		  		 // sessionStorage.setItem("showNav",true);


	// 			 	})
</script>
