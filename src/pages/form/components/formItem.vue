<template lang="pug">
.editform-form-item
  text-input(v-if="info.id === 1" :info="info")
  text-area(v-if="info.id === 2" :info="info")
</template>

<script>
import TextInput from './widgeItems/textInput'
import TextArea from './widgeItems/textArea'
export default {
  components: {
    TextInput,
    TextArea
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
