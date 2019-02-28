<template lang="pug">
.editform-form-item(v-if="info.widget" @click="$emit('selected', info)")
  text-input(v-if="info.widget.type === 1 || info.widget.type === 9 || info.widget.type === 10" :info="info")
  text-area(v-if="info.widget.type === 2" :info="info")
  radio(v-if="info.widget.type === 4 || info.widget.type === 5" :info="info")
  widget-select(v-if="info.widget.type === 6" :info="info")
  date-picker(v-if="info.widget.type === 7" :info="info")
  address-select(v-if="info.widget.type === 8" :info="info")
  .form-item-delete(@click.stop="handleDeleteWidget")
    i.el-icon-delete
</template>

<script>
import TextInput from './widgeItems/textInput'
import TextArea from './widgeItems/textArea'
import Radio from './widgeItems/radio'
import WidgetSelect from './widgeItems/select'
import DatePicker from './widgeItems/date'
import AddressSelect from './widgeItems/address'
export default {
  components: {
    TextInput,
    TextArea,
    Radio,
    WidgetSelect,
    DatePicker,
    AddressSelect
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleDeleteWidget () {
      this.$confirm(`若删除该字段，其对应的表单数据也会被清除。确定删除？`, {
        type: 'warning'
      })
        .then(() => {
          this.$message({
            message: '已删除',
            type: 'success'
          })
          this.$emit('delete', this.info)
        })
        .catch(() => {
          this.$message('取消删除')
        })
    }
  }
}
</script>

<style lang="scss">
.editform-form-item {
  padding: 5px 10px;
  position: relative;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  &.selected {
    background-color: #EBF8FB;
    border-left: 5px solid #0DB3A6;
    & .form-item-delete {
      display: block;
    }
  }
  .form-item-delete {
    cursor: pointer;
    position: absolute;
    background: #fff;
    width: 35px;
    height: 35px;
    font-size: 18px;
    border-radius: 18px;
    line-height: 35px;
    text-align: center;
    display: none;
    right: 20px;
    bottom: -20px;
    color: #d84636;
    box-shadow: 0 2px 4px 0 rgba(163, 163, 163, .5);
  }
}
</style>
