<template lang="pug">
.c-fheader
  .c-fheader-container(@click="handleHeaderClick")
    img.c-fheader-logo(src="@/assets/image/hznulogo.png" width="40" height="40")
    span.c-fheader-title FORM
      sup +
    span.c-fheader-item(
      v-for="item in menuItems"
      :data-router="item.router"
      :key="item.router"
      :class="{active: item.router === activeMenu}") {{ item.label }}
</template>

<script>
export default {
  data () {
    return {
      menuItems: [
        {
          label: '通讯录',
          router: 'contact'
        },
        {
          label: '应用',
          router: 'app'
        }
      ]
    }
  },
  computed: {
    activeMenu () {
      return this.$route.name
    }
  },
  methods: {
    handleHeaderClick (e) {
      const el = e.target
      const router = el.dataset.router
      if (!router) return
      this.$router.push({ name: router })
    }
  }
}
</script>

<style lang="scss">
.c-fheader {
  height: 60px;
  background: #222831;
  &-container {
    height: 100%;
    padding-left: 10px;
    display: flex;
    align-items: center;
    color: #e3fdfd;
  }
  &-title {
    margin-left: 5px;
    margin-right: 40px;
  }
  &-item {
    height: 100%;
    display: inline-block;
    cursor: pointer;
    color: rgba(255, 255, 255, .5);
    font-size: 14px;
    line-height: 60px;
    padding: 0 16px;
    &:hover,
    &.active {
      color: #fff;
    }
    &.active {
      position: relative;
      &::after {
        content: '';
        height: 2px;
        background: #fbeeff;
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }
}
</style>
