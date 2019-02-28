<template lang="pug">
.editform-widget-item
  .editform-widget-item-label {{ info.label }}
    span.label-notnull(v-if="info.required") *
  .editform-widget-item-desc(v-if="info.desc") {{ info.desc }}
  .widget-radio
    .widget-radio-item(v-for="(item, index) in info.widget.items" :key="index")
      i.radio-item-circle(v-if="info.widget.type === 4")
      i.radio-item-square(v-else-if="info.widget.type === 5")
      span.radio-item-label {{ item.label }}
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'info.widget.items': {
      deep: true,
      handler: function (v) {
        console.log('itemsChange', v)
      }
    }
  }
}
</script>
