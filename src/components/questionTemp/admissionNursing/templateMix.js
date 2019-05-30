const templateMix = {
  data() {
    return {
      currNode: this.node.currNode,
      childList: this.node.childList,
      isShow: true,
      uniqueId: this.node.currNode.uniqueId
    }
  },
  computed: {
    /*获取评分*/
    score: function() {
      let saveValues = [];
      Object.values(this.saveValue).forEach(ev => {
        saveValues = saveValues.concat(ev);
      });
      let nowSV = saveValues.filter(sv => {
        return sv.tempQuestionId == this.currNode.uniqueId && sv.selfPropagationId == this.currNode.selfPropagationId && sv.isShow;
      });
      
      return nowSV.length==0?'-':(nowSV.reduce(function(pre, now) {
        return pre + (parseInt(now.optionScore) || 0);
      }, 0))
    }
  },
  filters: {},
  methods: {
    /**
     * [selectOption 选中的选项计算分数，同时添加到tempSaveValue中]
     * @param  {[type]} tditem [选中选项的父选项]
     * @param  {[type]} item   [选中的选项]
     * @return {[type]}        [description]
     */
    selectOption: function(tditem, node) {
      let ss = this.showNodeNames(tditem);
      if (this.mode == 'show' || !$.trim(ss)) {
        return;
      }
      tditem = $.extend(true, {}, tditem, {
        paperTemplateId: this.currNode.paperTemplateId,
        tempQuestionId: this.currNode.uniqueId,
      })
      this.tree.$emit('seleteRadio', {
        node: node,
        item: tditem,
        isCancel: true
      })
    },
    exportsData:function(){
        return this.score;
    }

  }
}

export default templateMix
