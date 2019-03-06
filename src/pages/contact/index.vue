<template lang="pug">
.contact
  f-header
  .contact-cnt
    overview(
      v-if="step === 'overview'"
      @viewMember="viewMember")
    members(v-if="step === 'members'" @goback='goOverview' :id="viewId")
</template>

<script>
import FHeader from 'components/Fheader'
import Overview from './overview'
import Members from './members'

export default {
  components: {
    FHeader,
    Overview,
    Members
  },
  data () {
    return {
      step: 'overview',
      viewId: ''
    }
  },
  methods: {
    viewMember (structId) {
      console.log(structId)
      this.viewId = structId
      this.step = 'members'
    },
    goOverview () {
      this.step = 'overview'
    }
  }
}
</script>

<style lang="scss">
.contact {
  &-cnt {
    width: 1440px;
    margin: 0 auto;
  }
}
</style>
