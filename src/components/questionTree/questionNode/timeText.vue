<!-- 时间题 -->
<template>
  <div class="lv-inline">
    <template v-for="item in node.currNode.optionList" v-if="pageFrom!='tableDataShow'">
      <div class="lv-item" >
        <input v-if="item.timeFlag==0" type="text" readonly="readonly" class="input-text input-date" @focus="WdatePicker({skin:'twoer', dateFmt:item.timeFormat.replace(new RegExp('hh','g'),'HH'), maxDate:getMaxDate(item),minDate:getMinDate(item),isShowClear:false,onpicked:saveDateValue},item)" value="" :disabled="isTreeDisabled" :style="{'min-width':'220px','width':(item.style&&item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px'}"/>
        <input v-else type="text" readonly="readonly" class="input-text input-date" @focus="WdatePicker({skin:'twoer', dateFmt:item.timeFormat.replace(new RegExp('hh','g'),'HH'), maxDate:getMaxDate(item),minDate:getMinDate(item),isShowClear:false,onpicked:saveDateValue},item)" :value="getValueById(item,node)" :disabled="isTreeDisabled" :style="{'min-width':'220px','width':(item.style&&item.style.width || 220)+'px','margin-left':(item.style.margin || 0) + 'px'}"/>
      </div>
    </template>
  </div>
</template>
<script>
// import '@/css/care.css';
import bus from '@/bus.js';
import questionNodeMixin from './questionNodeMix';
import { mapState } from 'vuex'
export default {
    name: 'timeText',
    data() {
        return {
            showUnit: true,
            adminationDate: (new Date()).format('yyyy-MM-dd'),
            maxDate: (new Date()).format('yyyy-MM-dd'),
            clickItem:''
        }
    },
    mixins: [questionNodeMixin],
    computed: {
        ...mapState([
            'patient', 'userfulWidth'
        ]),
    },
    created: function() {
        // this.
    },
    methods: {
        WdatePicker: function(option,item) {
            WdatePicker(option);
            this.clickItem = item;
        },
        /*限制最大时间*/
        getMaxDate: function(item) {
            if (this.patient && this.patient.dischargeTime && this.patient.status == 'out') {
                return new Date(this.patient.dischargeTime).format(item.timeFormat);
            }
            return new Date().format(item.timeFormat);
        },
        /*限制最小时间*/
        getMinDate: function(item) {
            return new Date(1900, 1, 1).format(item.timeFormat);
        },
        // 时间题
        saveDateValue: function(data) {
            console.log($dp.cal.getDateStr(this.dataFormat));
            this.tree.$emit('seleteInput', {
                'node': this.node,
                item:this.clickItem,
                'value': $dp.cal.getDateStr(this.dataFormat)
            });
        }
    },
}

</script>
<style scoped>
.bigger {
  width: 250px;
}

.normal {
  width: 120px;
}

.small {
  width: 50px;
}

</style>
