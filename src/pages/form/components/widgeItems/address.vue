<template lang="pug">
.editform-widget-item
  .editform-widget-item-label {{ info.label }}
  .editform-widget-item-desc(v-if="info.desc") {{ info.desc }}
  .widget-address
    .widget-address-select
      .address-select-item.province
        el-select(disabled placeholder="省/自治区/直辖市")
      .address-select-item.city
        el-select(disabled placeholder="市")
      .address-select-item.town
        el-select(disabled placeholder="区/县")
    .widget-address-detail
      el-input(disabled placeholder="详细地址")
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
