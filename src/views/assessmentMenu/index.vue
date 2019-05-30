<template>
  <div>
    <div class="am-page-rside bg-main" ref="bgMain">
    <menuTemplate :currentPage="currentPage"></menuTemplate>
    <div class="am-page-rcont bg-main">
    <noConfigedMenu v-show="!haveConfigedData"></noConfigedMenu>
    <!-- <input type="text"   id="curDomain" style="display:none;">  -->
    <div class="haveConfiged" v-show="haveConfigedData" style="overflow:hidden;">
    <div class="am-pd-20" style="padding:20px 0px 0px 0px; overflow:hidden">
      <div class="condition-strip-top am-nmtlr-20">
        <!-- <a class="am-btn am-btn-primary" style="margin-top:10px;" @click="openLoadFileLayer">菜单数据源导入</a> -->
          <ul :class="{'strip-top-close':true,'am-ml-20':true}">
            <li :class="{'active':index==topMenuActiveNum}" v-for='(configedItem,index) in havaConfigDataList' :key='index' @click="chooseTopMenu(configedItem,index)">{{configedItem.appName}}</li>
          </ul>
      </div>
      <div class="am-condition" style="padding:10px 0 0 20px;">
          <div class="am-btn-rdo">
            <a :class="{active:menuType=='pc'}" @click="choosemenuType('pc')">PC</a>
            <a :class="{active:menuType=='app'}" @click="choosemenuType('app')">APP</a>
            <a :class="{active:menuType=='pad'}" @click="choosemenuType('pad')">PAD</a>
          </div>
        <!--<a class="right am-btn am-btn-plain-primary">编辑</a>-->
          <div class="right">
            <a class="am-btn am-btn-primary" @click="editFunc" v-show="!editStatus">编辑</a>
            <a class="am-btn am-btn-primary" v-show="editStatus" @click="saveData">保存</a>
            <a class="am-btn am-btn-default am-ml-10" v-show="editStatus" @click="cancleEdit">取消</a>
            <a class="am-btn am-btn-primary" @click="returnList">返回首页</a>
          </div>
      </div>
     <div :class="{'menu-ltr-cont':true ,'menu-ltr-edit-status':editStatus}" ref="ltrCont">
       <div class="lside">
        <div class="strip-half-cont">
          <ul class="strip-half">
            <li :class="{active: category===1}" @click="chooseCategory(1)">病区</li>
            <li :class="{active: category===2}" @click="chooseCategory(2)">患者</li>
          </ul>
        </div>
        <div class="" style="top: 40px;" ref="scroll" :class="{'inner-scroll-bar':true, 'editBottom':editStatus}">
          <ul class="menu-tree" style="display: block;" ref="menuTree">
          <!-- <ul class="menu-tree" style="display: block;" v-show="category===1"> -->
            <li v-for="(menu,index) in leftMenuData" :key="index" @click.stop="chooseLeftEditMenu(menu,index,'first')"  :class="{active:index==leftMenuNum&&leftTwoMenu==-1&&leftThreeMenu==-1}" >
                <input type="text" class="input-text"  v-model="menu.menuName" v-show="editStatus" maxlength="20"/>
                  <div class="menu-sort-tool-list" v-show="editStatus">
                            <i class="i-menu-sort-up" @click.stop="moveUp(leftMenuData,index)" v-if="index!=0"></i>
                            <i class="i-menu-sort-down" @click.stop="moveDown(leftMenuData,index)" v-if="index!=leftMenuData.length-1"></i>
                            <i class="i-menu-sort-plus" @click.stop="addChildrenMenu(menu,index,leftMenuData)"></i>
                            <i class="i-menu-sort-close" @click.stop="deleteChildrenMenu(menu,index,leftMenuData,'first')"></i>
                  </div>
                <span class="txt"  v-show="!editStatus">{{menu.menuName}}</span>
                <!-- <ul class="ul-1" v-if="menu.subMenuList&&menu.subMenuList.length"> -->
                  <ul class="ul-1" v-if="menu.subMenuList&&menu.subMenuList.length">
                  <li v-for="(childMenu,menuIndex) in menu.subMenuList" :key="menuIndex" :class="{active:menuIndex==leftTwoMenu&&index==parentIndex}" @click.stop="chooseLeftEditMenu(childMenu,menuIndex,'two',index,'',leftMenuData)"  :id="index+'_'+menuIndex">
                    <input type="text" class="input-text"  v-model="childMenu.menuName" v-show="editStatus"  maxlength="20"/>
                        <div class="menu-sort-tool-list" v-show="editStatus">
                            <i class="i-menu-sort-up" @click.stop="moveUp(menu.subMenuList,menuIndex)" v-if="menuIndex!=0"></i>
                            <i class="i-menu-sort-down" @click.stop="moveDown(menu.subMenuList,menuIndex)" v-if="menuIndex!=menu.subMenuList.length-1"></i>
                            <i class="i-menu-sort-plus" @click.stop="addChildrenMenu(childMenu,menuIndex,menu.subMenuList,'creatTChild',index)"></i>
                            <i class="i-menu-sort-close" @click.stop="deleteChildrenMenu(childMenu,menuIndex,menu.subMenuList,'two',index,'')"></i>
                        </div>
                        <span class="txt"  v-show="!editStatus">{{childMenu.menuName}}</span>
                        <ul class="ul-2" v-if="childMenu.subMenuList&&childMenu.subMenuList.length" >
                        <!-- <ul name="flip-list" tag="ul" class="ul-2" v-if="childMenu.subMenuList&&childMenu.subMenuList.length"> -->
                          <li v-for="(TChildMenu,TMenuIndex) in childMenu.subMenuList" :key="TMenuIndex" :class="{active:TMenuIndex==leftThreeMenu&&index==parentIndex&&menuIndex==secondIndex}" @click.stop="chooseLeftEditMenu(TChildMenu,TMenuIndex,'three',index,menuIndex,menu.subMenuList)" :id="index+'_'+menuIndex+'_'+TMenuIndex">
                            <input type="text" class="input-text"  v-model="TChildMenu.menuName"  v-show="editStatus"  maxlength="20"/>
                                <div class="menu-sort-tool-list" v-show="editStatus">
                                    <i class="i-menu-sort-up" @click.stop="moveUp(childMenu.subMenuList,TMenuIndex)" v-if="TMenuIndex!=0"></i>
                                    <i class="i-menu-sort-down" @click.stop="moveDown(childMenu.subMenuList,TMenuIndex)" v-if="TMenuIndex!=childMenu.subMenuList.length-1"></i>
                                    <i class="i-menu-sort-close" @click.stop="deleteChildrenMenu(TChildMenu,TMenuIndex,childMenu.subMenuList,'three',index,menuIndex)"></i>
                                </div>
                             <span class="txt"  v-show="!editStatus">{{TChildMenu.menuName}}</span>
                          </li>
                        </ul>
                  </li>
                </ul>
            </li>
          </ul>
        </div>
        <a class="btn-menu-plus" v-show="editStatus" @click="newParentMenu">+ 一级菜单</a>
      </div>
       <!-- lside -->
        <div class="rcont">
            <onlyShow :rightData="showRightData" v-if="leftMenuData.length&&!editStatus"></onlyShow>
            <div class="am-form" style="max-width: 800px;margin-top: 40px;" v-if="leftMenuData.length&&editStatus">
              <!--am-form-item-->
              <div class="am-form-item">
                <div class="am-form-label am-col-4">图片</div>
              <div class="am-col-20">
                <el-upload
                  class="avatar-uploader am-file-menu-img"
                  :action="upLoadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <div class="txt" v-show="editRightData.logo">更换</div>
                  <img v-if="editRightData.logo" :src="editRightData.logo" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="am-file-menu-img active" style="display:none">
                  <!-- <img src="../../common/image/t-01.jpg"/> -->
                  <div class="txt">更换</div>
                    <input type="file"/>
                  </div>
                </div>
              </div>
            <!--am-form-item end-->
            <!--am-form-item-->
            <div class="am-form-item">
              <div class="am-form-label am-col-4">url地址</div>
                <div class="am-col-20">
                  <input type="text" class="input-text" placeholder="输入url地址" style="width:300px;" v-model="editRightData.menuUrl"/><a class="am-btn am-btn-primary" style="border-radius:0 2px 2px 0;" @click="openChooseUrl">菜单数据源</a>
                  <div class="am-ctr-sel w160 am-mr-10">
                    <a class="caption" href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                      {{editRightData.menuUrlType==='1'?'URL+参数映射':'webservece配置一个接口地址+参数映射'}}
                    </a>
                    <div class="am-dropdown" style="width: 280px;border-top: 1px solid #D2D2D2;">
                      <ul>
                        <li @click="chooseurlType('1',editRightData)">URL+参数映射</li>
                        <li @click="chooseurlType('2',editRightData)">webservece配置一个接口地址+参数映射</li>
                      </ul>
                    </div>
                  </div>
                  <div class="control-row-editabeld">
                    <div class="control-row" v-for="(mapping,index) in editRightData.mappingList" :key="index">
                      <div class="control-explain">
                        <input type="text" class="input-text w160" v-model="mapping.remoteColumn"/>
                      </div>
                      <div class="control-explain">-</div>
                      <div class="control-explain">
                        <div class="am-ctr-sel w160 am-mr-10">
                          <a class="caption" href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            {{mapping.localColumn!=''?mapping.localColumn:'请选择对应的参数'}}
                          </a>
                          <div class="am-dropdown" style="border-top: 1px solid #D2D2D2;">
                            <ul>
                              <li v-for="(key,index) in keyCode"  v-if="haveSelectedWard.indexOf(key)>=0" :key="index" :class="{active:key===mapping.localColumn,disabled:haveSelectedWard.indexOf(key)>=0}">{{key}}</li>
                              <li v-for="(key,index) in keyCode"   v-if="haveSelectedWard.indexOf(key)<0" :key="index" @click="chooseWardKey(key,index,mapping)" :class="{active:key===mapping.localColumn,disabled:haveSelectedWard.indexOf(key)>=0}">{{key}}</li>
                            </ul>
                          </div>
                      </div>
                      </div>
                      <a class="i-row-plus am-ml-10" @click="addMappingList(index,editRightData.mappingList)"></a>
                      <a class="i-row-minus am-ml-10"  @click="removeMappingList(index,editRightData.mappingList)"></a>
                    </div>
                    <!--control-row end-->
                  </div>
                  <div style="margin-top:20px" v-if="editRightData.menuUrlType=='2'">
                      <input type="text" class="input-text" placeholder="输入出参" style="width:332px;" v-model="editRightData.outputNode"/>
                  </div>
                </div>
              </div>
              <!--am-form-item end-->
              <!--am-form-item-->
              <div class="am-form-item" >
                <div class="am-form-label am-col-4">科室权限</div>
                <div class="am-col-20">
                  <div class="control-collapse" :class="{open:isOpen}">
                    <div class="hd" @click="showDepartment" v-if="editRightData.wardCode.length!==wardList.length"><i class="i-collapse-angle"></i>{{editRightData.wardCode.length?'科室选择'+editRightData.wardCode.length:'请选择科室'}}</div>
                    <div class="hd" @click="showDepartment" v-if="editRightData.wardCode.length===wardList.length"><i class="i-collapse-angle"></i>全院</div>
                    <div class="bd chk-panel">
                      <div class="hd">
                        <div class="am-ctr-native-chk" @click="chooseDepartment('all',editRightData)" :class="{active:!parentWardCode.length?editRightData.wardCode.length==wardList.length:editRightData.wardCode.length==parentWardCode.length}"><span>全部</span></div>
                      </div>
                      <div class="bd" style="max-height: 206px;">
                        <ul>
                          <li v-for="(ward,index) in wardList" :key='index' v-if="!parentWardCode.length||parentWardCode.indexOf(ward.wardCode)>=0">
                            <div class="am-ctr-native-chk" @click="chooseDepartment('single',editRightData,ward,index)" :class="{active:editRightData.wardCode!=null&&editRightData.wardCode.indexOf(ward.wardCode)>=0}" ><span>{{ward.wardName}}</span></div>
                          </li>
                        </ul>
                      </div>
                      <div class="ft">
                        <a class="am-btn am-btn-primary am-mr-10" @click="sureDepartment(editRightData)">确定</a>
                        <a class="am-btn am-btn-plain-primary am-mr-10" @click="resetDepartment(editRightData)">重置</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--am-form-item end-->
              <!--am-form-item-->
              <div class="am-form-item" >
                <div class="am-form-label am-col-4">角色权限</div>
                <div class="am-col-20">
                  <div class="control-collapse" :class="{open:isRoleOpen}">
                    <div class="hd"  @click="showRole"><i class="i-collapse-angle"></i>{{editRightData.assignedRole&&editRightData.assignedRole.length?'已选权限'+editRightData.assignedRole.length:'请选择权限'}}<span class="am-ml-5"></span></div>
                    <div class="bd chk-panel">
                      <div class="hd" >
                        <div class="am-ctr-native-chk" @click="chooseRole('all',editRightData)" :class="{active:!parentRole.length?editRightData.assignedRole.length==roleList.length:editRightData.assignedRole.length==parentRole.length}"><span>全部角色</span></div>
                      </div>
                      <div class="bd" style="max-height: 206px;">
                        <ul>
                          <li v-for="(role,index) in roleList" :key="index" v-if="!parentRole.length||parentRole.indexOf(role.roleCode)>=0">
                            <div class="am-ctr-native-chk" @click="chooseRole('single',editRightData,role,index)" :class="{active:editRightData.assignedRole!=null&&editRightData.assignedRole.indexOf(role.roleCode)>=0}"><span>{{role.roleName}}</span></div>
                          </li>
                        </ul>
                      </div>
                      <div class="ft">
                        <a class="am-btn am-btn-primary am-mr-10" @click="sureRole">确定</a>
                        <a class="am-btn am-btn-plain-primary am-mr-10" @click="resetRole(editRightData)">重置</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--am-form-item end-->
              <!--am-form-item-->
              <div class="am-form-item">
                <div class="am-form-label am-col-4 static">可见性</div>
                <div class="am-col-20">
                  <div class="am-ctr-native-rdo am-mr-10" @click="chooseIsshow('show',editRightData)" :class="{active:editRightData.activeFlag===1}"><span>显示</span></div>
                  <div class="am-ctr-native-rdo am-mr-10" @click="chooseIsshow('hide',editRightData)" :class="{active:editRightData.activeFlag===0}"><span>隐藏</span></div>
                </div>
              </div>
              <div class="am-form-item">
                <div class="am-form-label am-col-4 static">是否第三方调用</div>
                <div class="am-col-20">
                  <div class="am-ctr-native-rdo am-mr-10" @click="chooseIsThird(1,editRightData)" :class="{active:editRightData.thirdPartyInvoke===1}"><span>是</span></div>
                  <div class="am-ctr-native-rdo am-mr-10" @click="chooseIsThird(0,editRightData)" :class="{active:editRightData.thirdPartyInvoke!==1}"><span>否</span></div>
                </div>
              </div>
              <!--am-form-item end-->
            </div>
          </div>
        </div>
      </div>
     <!-- rcont -->
     </div>
     <!-- menu-ltr-cont -->
    <!-- haveConfiged -->
    <chooseApp id="chooseApp" style="display:none;" :appList="allAppList" @indexPageInit="getConfigedMenu" :loadedFlag="loaded"></chooseApp>
    <loadFile id="loadFileLayer"   @showUpload="openUpload" ref="loadFiles" :menuData="menuListArr"></loadFile>
    <uploadChoose style="display:none;" id="uploadChoose" @closeUploadLayer='closeUplayer' ref="uploadChoose" @updateConfigMenu='getConfigMenu'></uploadChoose>
    <chooseUrl id="chooseUrl" ref='chooseUrl' @changeUrl="changeUrlAdress"></chooseUrl>
    </div>
    </div>
  </div>
</template>
<script>
/**
 * @file 菜单配置界面 2018-05-11
 * @author zhishunwen(zhishunwen@ewell.cc)
 */
import common from '../../util/common.js';
import noConfigedMenu from './noConfigedMenu'
import chooseApp from './chooseApp'
import onlyShow from './onlyShow'
import loadFile from './uploadMenuFile'
import uploadChoose from './uploadChoose'
import chooseUrl from './chooseUrl'
import Bus from '@/bus.js';
import menuTemplate from '@/components/menu.vue';
export default {
  name: 'editMenu',
  data () {
    return {
      currentPage: "createMenuList",
      haveConfigedData: true,
      allAppList: [],
      loaded: false, // 选择应用的数据是否加载完的标识
      havaConfigDataList: [],
      topMenuActiveNum: 0,
      appCode: '',
      category: 1, // 病区1 患者2
      menuType: 'pc', // 菜单类型
      appPatientType: '',
      leftMenuData: [], // 病区左侧菜单列表
      editStatus: false, // 是否编辑
      leftMenuNum: 0,
      leftTwoMenu: -1,
      leftThreeMenu: -1,
      parentIndex: -1, // 子菜单的第一层菜单
      secondIndex: -1, // 子菜单的第二层菜单
      editRightData: {},
      menuUrlType: '1',
      isOpen: false, // 科室选择弹窗
      isRoleOpen: false, // 角色选择弹窗
      wardList: [], // 全院科室
      isAllDepartment: false, // 全选
      imageUrl: '',
      upLoadUrl: 'base-service/file/upload?size=1024MB&projectName=fileName&optionName=file', // 图片上传地址
      roleList: [], // 角色数据
      parentWardCode: [], // 父菜单选中的科室
      parentRole: [], // 父菜单选中的角色
      keyCode: [], // 病区对应关键字
      keyCodeStr: '',
      haveSelectedWard: [],
      notSaved: false,
      add: false,
      layerIndex: '',
      excleList: [], // 上传的excle
      menuListArr: [], // 上传界面 已配置的菜单
      curDomain: "",
      curIframeIndex: ''
    }
  },
  computed: {
    showRightData: function () {
      return this.editRightData
    }
  },
  methods: {
    returnList: function () {
      if(this.editStatus) {
        layer.alert('编辑模式不允许返回文书首页,请先保存或取消!')
        return false
      }
      this.$router.push({path:'/'})
    },
    // 获取顶端所有配置的应用菜单
    getConfigedMenu: function (msg) {
      if (msg === 'add') {
        this.add = true // 是否是编辑添加顶层菜单
      }
      common.ajax({
        url: 'system-setting-service/topMenu/all',
        type: 'get',
        data: {},
        callback: (res) => {
          let newConfigDataList = [];
          let patientinfo = null;
          this.havaConfigDataList = res
          // 知识库菜单只支持住院护理配置，筛选appCode为‘patientinfo’菜单
          if(this.havaConfigDataList && this.havaConfigDataList.length > 0) {
            patientinfo = this.havaConfigDataList.find(
              function(currentValue, index, arr) {
                return currentValue.appCode == 'patientinfo';
              }
            )
          }

          this.havaConfigDataList = [ patientinfo ];
          if (res.length || (this.havaConfigDataList.length > 0 && this.havaConfigDataList[0] != null)) {
            this.haveConfigedData = true
          } else {
            this.haveConfigedData = false
          }
          this.chooseTopMenu()
        }
      })
    },
    // 打开添加顶层菜单弹窗
    openAddLayer: function () {
      layer.open({
        type: 1,
        title: '添加应用',
        area: ['700px', ''],
        shadeClose: true,
        content: $('#chooseApp'),
        success: (layero, ind) => {
          this.loaded = false
          common.ajax({
            url: 'order-service/openapp/enabled',
            type: 'get',
            data: {
              hospitalId: $.cookie('_organCode_')
            },
            callback: (res) => {
              this.loaded = true
              this.allAppList = res.filter((el, index) => {
                return !this.havaConfigDataList.some((item, index) => {
                  return el.appName === item.appName
                })
              })
              // console.log(this.allAppList)
            }
          })
        },
        end: () => {
        }
      })
    },
    // 顶层菜单点击切换
    chooseTopMenu: function (item = this.havaConfigDataList[0], index = 0) {
      if (!this.editStatus || this.add) {
        this.topMenuActiveNum = index
        this.appCode = item.appCode
      }
      this.getMenuList()
    },
    // 切换病区 患者
    chooseCategory: function (category) {
      if (!this.editStatus) {
        this.category = category
      }
      this.getMenuList()
    },
    // 获取菜单配置列表
    getMenuList: function (flag) {
      var menuParams = {}
      if (this.menuType === 'app' && this.category === 2) {
        menuParams = {
          category: this.category,
          menuType: this.menuType,
          parentMenuId: 0,
          topMenuCode: this.appCode
          // appPatientType: this.appPatientType
        }
      } else {
        menuParams = {
          category: this.category,
          menuType: this.menuType,
          parentMenuId: 0,
          topMenuCode: this.appCode
        }
      }
      if (flag !== 'cancle' && this.editStatus && !this.add) { // 不是点击保存 而且是编辑状态
        layer.alert('编辑模式不允许切换,请先保存或取消!')
        return false
      }
      this.add = false // 重置状态
      let that = this
      common.ajax({
        url: 'system-setting-service/menu/all',
        type: 'post',
        data: JSON.stringify(menuParams),
        callback: (res) => {
          this.leftMenuData = res
          if (this.leftMenuData.length) {
            if (!Object.keys(this.editRightData).length && this.leftMenuData.length) {
              this.editRightData = this.leftMenuData[0]
              if (!this.editRightData.mappingList || !this.editRightData.mappingList.length) {
                this.editRightData.mappingList = [{'localColumn': '', 'remoteColumn': ''}]
              }
            }
          } else {
            this.editRightData = {}
          }
          if (flag === 'cancle') {
            if (this.leftMenuData.length) {
              if (this.leftMenuNum !== -1) {
                this.chooseLeftEditMenu(this.leftMenuData[this.leftMenuNum], this.leftMenuNum, 'first')
              }
              if (this.leftTwoMenu !== -1) {
                // (childMenu,menuIndex,'two',index,'',leftMenuData)
                this.chooseLeftEditMenu(that.leftMenuData[that.parentIndex].subMenuList[that.leftTwoMenu], that.leftTwoMenu, 'two', this.parentIndex, '', that.leftMenuData)
              }
              if (this.leftThreeMenu !== -1) {
                this.chooseLeftEditMenu(this.leftMenuData[this.parentIndex].subMenuList[this.secondIndex].subMenuList[this.leftThreeMenu], this.leftThreeMenu, 'three', this.parentIndex, this.secondIndex, this.leftMenuData[this.parentIndex].subMenuList) // [menuIndex].subMenuList
              }
            }
          } else {
            this.leftTwoMenu = -1
            this.leftThreeMenu = -1
            this.parentIndex = -1
            this.secondIndex = -1
            if (this.leftMenuData.length) {
              this.chooseLeftEditMenu(this.leftMenuData[0], 0, 'first')
            }
          }
        }
      })
    },
    // 切换菜单类型
    choosemenuType: function (type) {
      if (!this.editStatus) {
        this.menuType = type
      }
      this.getMenuList('change')
    },
    // 点击编辑
    editFunc: function () {
      this.editStatus = true
      this.getKeyCode()
    },
    // 新建一个菜单
    newParentMenu: function () {
      this.leftMenuData.push({
        menuName: '',
        activeFlag: 1,
        appPatientType: '',
        assignedRole: [],
        isGlobal: 0,
        logo: '',
        mappingList: [{'localColumn': '', 'remoteColumn': ''}],
        menuUrl: '',
        menuUrlType: '1', // 普通1 webser 2
        outputNode: '', // 当webser2 设置的出参节点
        parentMenuId: 0,
        roleName: '',
        wardCode: [], // 分配的病区权限
        wardName: '',
        thirdPartyInvoke: 0
      })
      if (!Object.keys(this.editRightData).length || this.leftMenuData.length === 1) {
        this.editRightData = this.leftMenuData[0]
      }
      this.haveSelectedWard = []
      this.$nextTick(() => {
        this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight + 40
      })
    },
    // 新建子菜单
    addChildrenMenu: function (item, itemIndex, arr, creatTChild, firstIndex) {
      this.curDomain = this.$route.query.assessmentDomain;
      let length;
      arr.forEach((el, index) => {
        if (itemIndex === index) {
          if (!el.subMenuList) {
            this.$set(el, 'subMenuList', [])
          }
          el.subMenuList.push({
            menuName: '',
            activeFlag: 1,
            appPatientType: '',
            assignedRole: [],
            isGlobal: 0,
            logo: '',
            mappingList: [{'localColumn': '', 'remoteColumn': ''}],
            menuUrl: this.curDomain,
            menuUrlType: '1', // 普通1 webser 2
            outputNode: '', // 当webser2 设置的出参节点
            // parentMenuId: pId,
            roleName: '',
            wardCode: [], // 分配的病区权限
            wardName: '',
            thirdPartyInvoke: el.thirdPartyInvoke
          })
          length = el.subMenuList.length - 1
        }
      })
      let totalId = ''
      if (creatTChild) {
        totalId = firstIndex + '_' + itemIndex + '_' + length
      } else {
        totalId = itemIndex + '_' + length
      }
      this.$nextTick(() => {
        let top = this.findRoot(document.getElementById(totalId), 0)
        this.$refs.scroll.scrollTop = top
      })
      console.log(arr)
      console.log(this.leftMenuData)
    },
    findRoot (el, top) {
      top += el.offsetTop
      if (el.offsetParent.classList.contains('editBottom') === true) {
        return top
      }
      return this.findRoot(el.offsetParent, top)
    },
    // 选择左侧编辑菜单
    chooseLeftEditMenu: function (item, index, flag, parentIndex, secondIndex, parentData) {
      console.log(this.leftMenuData)
      this.isOpen = false
      if (flag === 'first') {
        if (!item.mappingList || !item.mappingList.length) {
          item.mappingList = [{'localColumn': '', 'remoteColumn': ''}]
        }
        this.parentWardCode = []
        this.parentRole = []
        this.leftMenuNum = index
        this.leftTwoMenu = -1
        this.leftThreeMenu = -1
        if (item.wardCode === null) {
          item.wardCode = []
        }
        this.editRightData = item
      }
      if (flag === 'two') {
        if (!item.mappingList || !item.mappingList.length) {
          item.mappingList = [{'localColumn': '', 'remoteColumn': ''}]
        }
        this.parentWardCode = [...parentData[parentIndex].wardCode]
        if ((!item.wardCode || !item.wardCode.length) && this.editStatus) {
          item.wardCode = [...parentData[parentIndex].wardCode]
          item.wardName = parentData[parentIndex].wardName
        }
        this.parentRole = [...parentData[parentIndex].assignedRole]
        if ((!item.assignedRole || !item.assignedRole.length) && this.editStatus) {
          item.assignedRole = [...parentData[parentIndex].assignedRole]
          item.roleName = parentData[parentIndex].roleName
        }
        this.leftMenuNum = -1
        this.leftTwoMenu = index
        this.leftThreeMenu = -1
        this.parentIndex = parentIndex
        this.editRightData = item
        console.log(this.leftTwoMenu)
      }
      if (flag === 'three') {
        if (!item.mappingList || !item.mappingList.length) {
          item.mappingList = [{'localColumn': '', 'remoteColumn': ''}]
        }
        this.parentWardCode = [...parentData[secondIndex].wardCode]
        if ((!item.wardCode || !item.wardCode.length) && this.editStatus) {
          item.wardCode = [...parentData[secondIndex].wardCode]
          item.wardName = parentData[secondIndex].wardName
        }
        this.parentRole = [...parentData[secondIndex].assignedRole]
        if ((!item.assignedRole || !item.assignedRole.length) && this.editStatus) {
          item.assignedRole = [...parentData[secondIndex].assignedRole]
          item.roleName = parentData[secondIndex].roleName
        }
        this.leftMenuNum = -1
        this.leftTwoMenu = -1
        this.leftThreeMenu = index
        this.parentIndex = parentIndex
        this.secondIndex = secondIndex
        this.editRightData = item
        console.log(this.leftThreeMenu)
      }
      this.getIsGlobal()
      // this.queryRole()
      // if (this.category === 1) {
      //   this.getKeyCode()
      // } else {
      //   this.getPatiensCode()
      // }
      if (this.editRightData.mappingList && this.editRightData.mappingList.length) {
        this.haveSelectedWard = []
        this.editRightData.mappingList.forEach((el) => {
          this.haveSelectedWard.push(el.localColumn)
        })
      } else {
        this.haveSelectedWard = []
      }
    },
    // 删除子菜单
    deleteChildrenMenu: function (item, itemIndex, arr, flag, FIndex, menuIndex) {
      let that = this
      arr.forEach((el, index) => {
        if (itemIndex === index) {
          if (el.subMenuList && el.subMenuList.length) {
            layer.confirm('确定删除本菜单及下属子菜单？', function (i) {
              arr.splice(index, 1)
              layer.close(i)
              if (that.leftMenuData.length) {
                that.choosePreMenu(item, itemIndex, flag, arr, FIndex, menuIndex)
              }
            })
          } else {
            arr.splice(index, 1)
            if (that.leftMenuData.length) {
              that.choosePreMenu(item, itemIndex, flag, arr, FIndex, menuIndex)
            }
          }
        }
      })
    },
    choosePreMenu (objData, index, flag, arrData, FIndex, menuIndex) {
      if (this.leftMenuData.length) {
        if (flag === 'first') {
          if (this.FIndex === index || this.leftMenuNum === index) {
            this.chooseLeftEditMenu(this.leftMenuData[index - 1], index - 1, 'first')
          }
        } else if (flag === 'two') {
          if (this.secondIndex === '' || this.secondIndex === -1) { // secondIndex 三级菜单的父级序号
            if (this.leftTwoMenu === index && this.parentIndex === FIndex) {
              if (arrData.length) {
                this.chooseLeftEditMenu(this.leftMenuData[FIndex].subMenuList[index - 1], index - 1, 'two', FIndex, '', this.leftMenuData)
              } else {
                this.chooseLeftEditMenu(this.leftMenuData[FIndex], FIndex, 'first')
              }
            }
          } else {
            if (this.secondIndex === index && this.parentIndex === FIndex) { // 选中项是第三项 且在这个二级子菜单下
              if (arrData.length) {
                this.chooseLeftEditMenu(this.leftMenuData[FIndex].subMenuList[index - 1], index - 1, 'two', FIndex, '', this.leftMenuData)
              } else {
                this.chooseLeftEditMenu(this.leftMenuData[FIndex], FIndex, 'first')
              }
            }
          }
        } else {
          if (this.leftThreeMenu === index && this.parentIndex === FIndex && this.secondIndex === menuIndex) {
            if (arrData.length) { // 本级菜单还有
              this.chooseLeftEditMenu(this.leftMenuData[FIndex].subMenuList[menuIndex].subMenuList[index - 1], index - 1, 'three', FIndex, menuIndex, this.leftMenuData[FIndex].subMenuList) // [menuIndex].subMenuList
            } else { // 没有本级 去找上级
              this.chooseLeftEditMenu(this.leftMenuData[FIndex].subMenuList[menuIndex], menuIndex, 'two', FIndex, '', this.leftMenuData)
            }
          }
        }
      }
    },
    // 选择url类型
    chooseurlType: function (type, editRightData) {
      if (type === '1') {
        editRightData.menuUrlType = '1'
      } else {
        editRightData.menuUrlType = '2'
      }
    },
    // 查询全院科室列表
    queryAllWards: function () {
      common.ajax({
        url: 'sys-service/sys/v1/units',
        type: 'get',
        async: false,
        dataType: 'json',
        data: {
          organCode: common.getOrganCode()
        },
        callback: (result) => {
          var wardList = []
          for (var ward in result) {
            wardList = wardList.concat(result[ward])
          }
          this.wardList = wardList
        }
      })
    },
    // 显示科室
    showDepartment: function () {
      // this.queryAllWards()
      this.isOpen ? this.isOpen = false : this.isOpen = true
    },
    changeChildMenuDepartment: function (data, codeArr, nameStr, datalistArr) {
      // 点击改变子菜单科室权限
      if (data.subMenuList && data.subMenuList.length) {
        data.subMenuList.forEach((list) => {
          if (!list.wardCode) list.wardCode = []
          if (data.wardCode && data.wardCode.length) {
            list.wardCode = list.wardCode.filter((el, index) => {
              return data.wardCode.some((item) => {
                return el === item
              })
            })
          } else {
            list.wardCode = []
          }
          if (list.wardCode.length === datalistArr.length) {
            list.isGlobal = 1
          } else {
            list.isGlobal = 0
          }
          list.wardName = ''
          let arr = datalistArr.filter((item) => {
            return list.wardCode.some((el) => {
              return el === item.wardCode
            })
          })
          console.log(arr)
          arr.forEach((el, index) => {
            if (index > 0) {
              list.wardName += '|' + el.wardName
            } else {
              list.wardName += el.wardName
            }
          })
          if (list.subMenuList && list.subMenuList.length) {
            list.subMenuList.forEach((childList) => {
              if (!childList.wardCode) childList.wardCode = []
              if (list.wardCode.length) {
                childList.wardCode = childList.wardCode.filter((el, index) => {
                  return list.wardCode.some((item) => {
                    return el === item
                  })
                })
              } else {
                childList.wardCode = []
              }
              if (childList.wardCode.length === datalistArr.length) {
                childList.isGlobal = 1
              } else {
                childList.isGlobal = 0
              }
              childList.wardName = ''
              let arr = datalistArr.filter((item) => {
                return childList.wardCode.some((el) => {
                  return el === item.wardCode
                })
              })
              arr.forEach((el, index) => {
                if (index > 0) {
                  childList.wardName += '|' + el.wardName
                } else {
                  childList.wardName += el.wardName
                }
              })
            })
          }
        })
      }
    },
    changeChildMenuRole: function (data, codeArr, nameStr, datalistArr) {
      // 点击改变子菜单角色
      if (data.subMenuList && data.subMenuList.length) {
        data.subMenuList.forEach((list) => {
          if (!list.assignedRole) list.assignedRole = []
          if (data.assignedRole && data.assignedRole.length) {
            list.assignedRole = list.assignedRole.filter((el, index) => {
              return data.assignedRole.some((item) => {
                return el === item
              })
            })
          } else {
            list.assignedRole = []
          }
          list.roleName = ''
          let arr = datalistArr.filter((item) => {
            return list.assignedRole.some((el) => {
              return el === item.roleCode
            })
          })
          console.log(arr)
          arr.forEach((el, index) => {
            if (index > 0) {
              list.roleName += '|' + el.roleName
            } else {
              list.roleName += el.roleName
            }
          })
          if (list.subMenuList && list.subMenuList.length) {
            list.subMenuList.forEach((childList) => {
              if (!childList.assignedRole) childList.assignedRole = []
              if (list.assignedRole.length) {
                childList.assignedRole = childList.assignedRole.filter((el, index) => {
                  return list.assignedRole.some((item) => {
                    return el === item
                  })
                })
              } else {
                childList.assignedRole = []
              }
              childList.roleName = ''
              let arr = datalistArr.filter((item) => {
                return childList.assignedRole.some((el) => {
                  return el === item.roleCode
                })
              })
              arr.forEach((el, index) => {
                if (index > 0) {
                  childList.roleName += '|' + el.roleName
                } else {
                  childList.roleName += el.roleName
                }
              })
            })
          }
        })
      }
    },
    // 科室选择
    chooseDepartment: function (flag, data, item, index) {
      if (flag === 'all') {
        if (data.wardCode === null) {
          data.wardCode = []
        }
        if (this.parentWardCode.length) {
          if (data.wardCode.length === this.parentWardCode.length) {
            data.wardCode = []
            data.wardName = ''
          } else {
            data.wardCode = [...this.parentWardCode]
            data.wardName = ''
            let arr = this.wardList.filter((item) => {
              return data.wardCode.some((el) => {
                return el === item.wardCode
              })
            })
            console.log(arr)
            arr.forEach((el, index) => {
              if (index > 0) {
                data.wardName += '|' + el.wardName
              } else {
                data.wardName += el.wardName
              }
            })
          }
          if (data.wardCode.length === this.wardList.length) {
            data.isGlobal = 1
          } else {
            data.isGlobal = 0
          }
        } else {
          if (data.wardCode.length === this.wardList.length) {
            data.wardCode = []
            data.wardName = ''
            data.isGlobal = 0
            return false
          }
          data.wardCode = []
          data.wardName = ''
          this.wardList.forEach((el) => {
            data.wardCode.push(el.wardCode)
            if (data.wardCode.length > 1) {
              data.wardName += '|' + el.wardName
            } else {
              data.wardName += el.wardName
            }
          })
          data.isGlobal = 1
        }
        this.changeChildMenuDepartment(data, 'wardCode', 'wardName', this.wardList)
      }
      if (flag === 'single') {
        if (data.wardCode === null) {
          data.wardCode = []
        }
        if (data.wardCode.indexOf(item.wardCode) < 0) {
          data.wardCode.push(item.wardCode)
        } else {
          data.wardCode.splice(data.wardCode.indexOf(item.wardCode), 1)
        }
        this.changeChildMenuDepartment(data, 'wardCode', 'wardName', this.wardList)
        // 是否全院
        if (data.wardCode.length === this.wardList.length) {
          data.isGlobal = 1
        } else {
          data.isGlobal = 0
        }
        data.wardName = ''
        let arr = this.wardList.filter((item) => {
          return data.wardCode.some((el) => {
            return el === item.wardCode
          })
        })
        console.log(arr)
        arr.forEach((el, index) => {
          if (index > 0) {
            data.wardName += '|' + el.wardName
          } else {
            data.wardName += el.wardName
          }
        })
        console.log(data.wardName)
        console.log(data.wardCode)
        console.log(this.leftMenuData)
      }
    },
    // 角色选择
    chooseRole (flag, data, item, index) {
      if (flag === 'all') {
        if (data.assignedRole === null) {
          data.assignedRole = []
        }
        if (this.parentRole.length) {
          if (data.assignedRole.length !== this.parentRole.length) {
            data.assignedRole = [...this.parentRole]
            data.roleName = ''
            let arr = this.roleList.filter((item) => {
              return data.assignedRole.some((el) => {
                return el === item.roleCode
              })
            })
            arr.forEach((el, index) => {
              if (index > 0) {
                data.roleName += '|' + el.roleName
              } else {
                data.roleName += el.roleName
              }
            })
          } else {
            data.assignedRole = []
            data.roleName = ''
          }
        } else {
          if (data.assignedRole.length !== this.roleList.length) {
            data.assignedRole = []
            data.roleName = ''
            this.roleList.forEach((el, index) => {
              data.assignedRole.push(el.roleCode)
              if (index > 0) {
                data.roleName += '|' + el.roleName
              } else {
                data.roleName += el.roleName
              }
            })
          } else {
            data.assignedRole = []
            data.roleName = ''
          }
        }
      }
      this.changeChildMenuRole(data, 'assignedRole', 'roleName', this.roleList)
      if (flag === 'single') {
        if (data.assignedRole === null) {
          data.assignedRole = []
        }
        if (data.assignedRole.indexOf(item.roleCode) < 0) {
          data.assignedRole.push(item.roleCode)
          if (data.assignedRole.length > 1) {
            data.roleName += '|' + item.roleName
          } else {
            data.roleName += item.roleName
          }
        } else {
          let deleteIndex = data.assignedRole.indexOf(item.roleCode)
          data.assignedRole.splice(data.assignedRole.indexOf(item.roleCode), 1)
          let nameArr = data.roleName.split('|')
          nameArr.splice(deleteIndex, 1)
          data.roleName = nameArr.join('|')
        }
        this.changeChildMenuRole(data, 'assignedRole', 'roleName', this.roleList)
        console.log(data.roleName)
        console.log(data.assignedRole)
        console.log(this.leftMenuData)
      }
    },
    // 确定科室选择
    sureDepartment: function (data) {
      this.isOpen = false
    },
    // 确认角色选择
    sureRole: function (data) {
      this.isRoleOpen = false
    },
    // 重置科室选择
    resetDepartment: function (data) {
      data.wardCode = []
      data.wardName = ''
      data.isGlobal = 0
      this.changeChildMenuDepartment(data, 'wardCode', 'wardName', this.wardList)
    },
    // 重置角色选择
    resetRole: function (data) {
      data.assignedRole = []
      data.roleName = ''
      this.changeChildMenuRole(data, 'assignedRole', 'roleName', this.roleList)
    },
    // 是否显示
    chooseIsshow: function (type, data) {
      if (type === 'show') {
        data.activeFlag = 1
      } else if (type === 'hide') {
        data.activeFlag = 0
      }
    },
    // 是否第三方调用
    chooseIsThird: function (type, data) {
      data.thirdPartyInvoke = type
    },
    // 菜单下一
    moveDown: function (data, index) {
      console.log(data)
      if (data[index + 1]) {
        data.splice(index, 1, ...data.splice(index + 1, 1, data[index]))
      }
      console.log(data)
    },
    // 菜单上移
    moveUp: function (data, index) {
      if (data[index - 1]) {
        data.splice(index - 1, 1, ...data.splice(index, 1, data[index - 1]))
      }
    },
    // 图片上传成功
    handleAvatarSuccess (res, file) {
      console.log(res)
      // this.editRightData.logo = URL.createObjectURL(file.raw)
      this.editRightData.logo = res.data
    },
    beforeAvatarUpload (file) {
      let isJPG = false
      let lastindex = file.name.lastIndexOf('.')
      if (file.name.substring(lastindex + 1) === 'jpeg' || file.name.substring(lastindex + 1) === 'png' || file.name.substring(lastindex + 1) === 'svg') {
        isJPG = true
      }
      // if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml') {
      //   isJPG = true
      // }
      const isLt2M = file.size / 1024 / 1024 < 3
      if (!isJPG) {
        layer.msg('上传头像图片只能是 JPG或者PNG,svg 格式!')
      }
      if (!isLt2M) {
        layer.msg('上传头像图片大小不能超过 3MB!')
      }
      return isJPG && isLt2M
    },
    // 参数增加
    addMappingList (index, data) {
      data.splice(index + 1, 0, {'localColumn': '', 'remoteColumn': ''})
    },
    // 删除参数选项
    removeMappingList (index, data) {
      if (index > 0) {
        data.splice(index, 1)
      } else {
        data[0].localColumn = ''
        data[0].remoteColumn = ''
      }
      if (this.editRightData.mappingList && this.editRightData.mappingList.length) {
        this.haveSelectedWard = []
        this.editRightData.mappingList.forEach((el) => {
          this.haveSelectedWard.push(el.localColumn)
        })
      } else {
        this.haveSelectedWard = []
      }
    },
    // 所有角色权限查询
    queryRole: function () {
      common.ajax({
        url: 'sys-service/sys/v1/roles',
        type: 'get',
        dataType: 'json',
        async: false,
        data: {},
        callback: (result) => {
          this.roleList = result
          // console.log(result)
        }
      })
    },
    // 角色选择
    showRole () {
      this.isRoleOpen ? this.isRoleOpen = false : this.isRoleOpen = true
    },
    // 科室对应字段
    getKeyCode () {
      let params = {
        type: this.category
      }
      common.ajax({
      //  url: 'sys-service/unit/struct',
        url: 'system-setting-service/mapping/query',
        type: 'post',
        data: JSON.stringify(params),
        callback: (res) => {
          console.log(res)
          this.keyCode = []
          res.forEach((el) => {
            this.keyCode.push(el.columnName)
          })
        }
      })
    },
    // 患者对应字段
    getPatiensCode: function () {
      common.ajax({
        url: 'user-service/v2baseinfo/baseinfo2.0/struct/allPatients',
        type: 'get',
        data: {},
        callback: (res) => {
          console.log(res)
          this.keyCode = []
          for (let key in res) {
            this.keyCode.push(key)
          }
        }
      })
    },
    // 选择本地字段
    chooseWardKey (key, index, data) {
      data.localColumn = key
      this.haveSelectedWard = []
      this.editRightData.mappingList.forEach((el) => {
        this.haveSelectedWard.push(el.localColumn)
      })
    },
    // 取消
    cancleEdit: function () {
      this.editStatus = false
      this.getMenuList('cancle')
    },
    // 删除多余字段
    // deletSome (params) {
    //   if (params.subMenuList && params.subMenuList.length) {
    //     for (let i = 0; i<params.subMenuList.length; i++) {
    //       if (params.subMenuList[i].resetDepartment) {
    //         delete params.subMenuList[i].resetDepartment
    //       }
    //       if (params.subMenuList[i].resetRole) {
    //         delete params.subMenuList[i].resetRole
    //       }
    //       if (params.subMenuList[i].subMenuList) {
    //         deleteSome(params.subMenuList[i])
    //       } else {
    //         continue
    //       }
    //     }
    //   }
    // },
    // 保存
    saveData: function () {
      let params = {
        // 'appPatientType': this.appPatientType,
        'category': this.category,
        'menuType': this.menuType,
        'subMenuList': this.leftMenuData,
        'topMenuCode': this.appCode
      }
      console.log(params)
      common.ajax({
        url: 'system-setting-service/menu/save',
        type: 'post',
        data: JSON.stringify(params),
        callback: (res) => {
          console.log(res)
          if (res === 0) {
            layer.msg('保存成功')
            this.getMenuList('cancle')
            this.editStatus = false
          }
        }
      })
    },
    // 是否全院
    getIsGlobal () {
      if (this.editRightData.isGlobal === 1) {
        if (this.editRightData.wardCode.length !== this.wardList.length) {
          this.editRightData.wardCode = []
          this.wardList.forEach((el) => {
            this.editRightData.wardCode.push(el.wardCode)
            if (this.editRightData.wardCode.length > 1) {
              this.editRightData.wardName += '|' + el.wardName
            } else {
              this.editRightData.wardName += el.wardName
            }
          })
        }
      } else {
        if (this.editRightData.wardCode.length !== this.wardList.length) {
          this.editRightData.isGlobal = 0
        } else {
          this.editRightData.isGlobal = 1
        }
      }
    },
    // 删除顶级菜单
    deleteTopMenu (item) {
      console.log(item)
      layer.confirm('确定删除此菜单及菜单下包含的数据？', (i) => {
        common.ajax({
          url: `system-setting-service/topMenu/delete/${item.serialNo}`,
          type: 'delete',
          data: {},
          callback: (res) => {
            layer.close(i)
            layer.msg('删除成功')
            this.getConfigedMenu('add')
            console.log(res)
          }
        })
      })
    },
    getConfigMenu: function (dom) {
      let that = this
      common.ajax({
        url: 'system-setting-service/menu/configed',
        data: {},
        async: true,
        type: 'get',
        callback: (res) => {
          console.log(res)
          that.menuListArr = res
        }
      })
    },
    openLoadFileLayer: function () {
      let that = this
      layer.open({
        type: 1,
        title: '导入菜单数据源',
        content: $('#loadFileLayer'),
        area: ['800px', '100%'],
        offset: 'rb',
        success: () => {
          that.getConfigMenu()
        }
      })
    },
    openUpload () {
      let that = this
      this.layerIndex = layer.open({
        type: 1,
        content: $('#uploadChoose'),
        area: ['600px', ''],
        zIndex: layer.zIndex,
        success: () => {
        },
        end: () => {
          that.$refs.uploadChoose.reset()
        }
      })
    },
    closeUplayer () {
      layer.close(this.layerIndex)
    },
    openChooseUrl () {
      let that = this
      layer.open({
        type: '1',
        content: $('#chooseUrl'),
        area: ['600px', ''],
        success: () => {
          that.$refs.chooseUrl.getUrlChoose(that.menuType, that.editRightData.menuUrl)
        },
        end: () => {
        }
      })
    },
    changeUrlAdress (item) {
      this.editRightData.menuUrl = item.menuUrl
      this.editRightData.menuUrlType = item.menuUrlType
      layer.closeAll()
    }
  },
  components: {
    noConfigedMenu,
    chooseApp,
    onlyShow,
    loadFile,
    uploadChoose,
    chooseUrl,
    menuTemplate
  },
  created: function(){

  },
  mounted () {

    this.queryAllWards()
    this.queryRole()
    this.getConfigedMenu()
    this.$refs.ltrCont.style.height = this.$refs.bgMain.offsetHeight - 170 + 'px'


  }
}
</script>
<style scoped>
@import '../../css/menuList.css';
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.flip-list-move {
  transition: transform 1s;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    max-width:80px;
    max-height:80px;
    display: inline-block;
  }
  .editBottom{
    bottom:40px;
  }
  .hd {
    height: auto;
    background: none;
  }
  .am-ctr-sel {
    width: auto;
  }
  .hd:before {
    border-bottom: none;
  }
  .bg-main {
    background: none;
  }
</style>
