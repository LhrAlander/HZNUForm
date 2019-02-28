<template lang="pug">
.set-select-items
  .set-title 选项
  .select-item(
    v-for="item in widget.items"
    :key="item.label")
    .select-item-input
      el-input(v-model="item.label" @input="changeItems")
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    widget: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    items: {
      get () {
        return this.widget.items
      },
      set (v) {
        console.log(v)
      }
    }
  },
  methods: {
    changeItems () {
      this.$emit()
    }
  }
}
</script>

<style lang="scss">
</style>
