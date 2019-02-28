<template lang="pug">
.editform-widget-item
  .editform-widget-item-label {{ info.label }}
    span.label-notnull(v-if="info.required") *
  .editform-widget-item-desc(v-if="desc") {{ desc }}
  .widget-text-textarea
    el-input(
      disabled
      type="textarea")
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    desc () {
      return this.info.desc
    }
  }
}
</script>
