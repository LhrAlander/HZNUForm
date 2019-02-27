<template lang="pug">
.editform-widget-item
  .editform-widget-item-label {{ info.label }}
  .editform-widget-item-desc(v-if="info.desc") {{ info.desc }}
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
  }
}
</script>
