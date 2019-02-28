<template lang="pug">
.widget-set(v-if="info")
  .set-title 标题
  .set-input
    el-input(v-model="info.label")
  .set-split
  .set-title 描述信息
  .set-input
    el-input(v-model="info.desc" type="textarea" :rows="3")
  .set-split
  .set-title 校验
  .set-input
    el-checkbox(v-model="info.required") 必填
  .set-split
  .set-select-items(v-if="needSelectItems")
    .set-title 选项
    draggable(
      v-model="info.widget.items"
      :options="{ group: 'selectItem'}")
      .select-item(
        v-for="i in info.widget.items.length"
        :key="i")
        .select-item-input
          el-input(v-model="info.widget.items[i - 1].label")
          i.el-icon-rank
          i.el-icon-remove(@click="removeItem(i - 1)")
    .set-new-selection
      el-button(plain @click="handleAddSelection") 添加选项
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    needSelectItems () {
      let type = this.info.widget.type
      console.log(this.info.widget.items)
      return type === 4 || type === 5 || type === 6
    }
  },
  methods: {
    removeItem (i) {
      this.info.widget.items.splice(i, 1)
    },
    handleAddSelection () {
      this.info.widget.items.push({
        label: '新选项',
        value: '新选项'
      })
    }
  }
}
</script>

<style lang="scss">
.widget-set {
  margin: 8px 0;
  padding: 0 10px;
  .set-title {
    margin-bottom: 10px;
    font-weight: 700;
    font-size: 14px;
  }
  .set-split {
    border-top: solid 1px #e1e1e1;
    height: 0;
    margin: 15px 0;
  }
  .select-item-input {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    .el-icon-remove,
    .el-icon-rank {
      font-size: 18px;
      margin-left: 5px;
      color: #d84636;
      cursor: pointer;
    }
    .el-icon-rank {
      color: #979797;
    }
  }
  .set-new-selection {
    width: 233px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
