<template lang="pug">
.editform-widget-item
  .editform-widget-item-label {{ info.label }}
    span.label-notnull(v-if="info.required") *
  .editform-widget-item-desc(v-if="info.desc") {{ info.desc }}
  .widget-text-input
    el-input(disabled)
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    console.log(this.info)
  }
}
</script>
