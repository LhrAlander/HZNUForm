<template lang="pug">
.editform-form-item(v-if="info.widget")
  text-input(v-if="info.widget.type === 1" :info="info")
  text-area(v-if="info.widget.type === 2" :info="info")
  radio(v-if="info.widget.type === 4 || info.widget.type === 5" :info="info")
  widget-select(v-if="info.widget.type === 6" :info="info")
  date-picker(v-if="info.widget.type === 7" :info="info")
</template>

<script>
import TextInput from './widgeItems/textInput'
import TextArea from './widgeItems/textArea'
import Radio from './widgeItems/radio'
import WidgetSelect from './widgeItems/select'
import DatePicker from './widgeItems/date'
export default {
  components: {
    TextInput,
    TextArea,
    Radio,
    WidgetSelect,
    DatePicker
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss">
.editform-form-item {
  padding: 5px 10px;
  margin-left: 5px;
}
</style>
