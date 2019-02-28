<template lang="pug">
.finalform
  .final-form-card
    .form-card-head
    .form-card-title 2019年清明节离校登记表
    .card-widget-wrapper
      .final-form-widget(v-for="item in formData" :key="item.widget.id")
        .form-widget-label {{ item.label }}
        .form-widget-desc {{ item.desc }}
        .form-widget-input
          .widget-input(v-if="isInput(item.widget.type)")
            el-input(v-model="item.widget.answer.value")
          .widget-input(v-if="item.widget.type === 2")
            el-input(v-model="item.widget.answer.value" type="textarea" :rows="5")
          .widget-radio(v-if="item.widget.type === 4")
            el-radio(
              v-for="(radio, index) in item.widget.items"
              :key="index"
              :label="radio.label"
              v-model="item.widget.answer.value") {{ radio.label }}
          .widget-checkbox(v-if="item.widget.type === 5")
            el-checkbox-group(v-model="item.widget.answer.value")
              el-checkbox(v-for="(c, index) in item.widget.items.map(_ => _.label)" :key="index" :label="c")
          .widget-select(v-if="item.widget.type === 6")
            el-select(v-model="item.widget.answer.value")
              el-option(
                v-for="(op, index) in item.widget.items"
                :key="index"
                :label="op.label"
                :value="op.value")
          .widget-date(v-if="item.widget.type === 7")
            el-date-picker(
              v-model="item.widget.answer.value"
              type="date"
              placeholder="选择日期")
          .widget-address(v-if="item.widget.type === 8")
            .widget-address-select
              .address-select-item.province
                el-select(placeholder="省/自治区/直辖市" v-model="item.widget.answer.value.province" @change="clearAddress(item.widget.answer.value, 1)")
                  el-option(
                    v-for="(province, index) in provinces"
                    :key="index"
                    :label="province.label"
                    :value="province.value")
              .address-select-item.city
                el-select(placeholder="市" v-model="item.widget.answer.value.city" @change="clearAddress(item.widget.answer.value, 2)")
                  el-option(
                    v-for="(city, index) in getCities(item.widget.answer.value.province)"
                    :key="index"
                    :label="city.label"
                    :value="city.value")
              .address-select-item.town
                el-select(placeholder="区/县" v-model="item.widget.answer.value.town")
                  el-option(
                    v-for="(town, index) in getTowns(item.widget.answer.value)"
                    :key="index"
                    :label="town.label"
                    :value="town.value")
            .widget-address-detail
              el-input(placeholder="详细地址" v-model="item.widget.answer.value.detail")
      .form-submit-btn
        el-button(type="primary" :disabled="mode==='view'") 提交
</template>

<script>
import address from '@/assets/js/address'

export default {
  data () {
    return {
      mode: 'view',
      formData: [],
      answer: []
    }
  },
  computed: {
    provinces () {
      return address.map(_ => {
        return {
          label: _.label,
          value: _.value
        }
      })
    }
  },
  created () {
    if (this.mode === 'view') {
      this.formData = JSON.parse(localStorage.getItem('viewForm'))
    }
    this.initAnswer()
  },
  mounted () {
  },
  methods: {
    isInput (type) {
      return [1, 9, 10].includes(parseInt(type))
    },
    initAnswer () {
      this.formData.forEach(_ => {
        let widget = _.widget
        const a = { widget: widget.id, value: '' }
        if (widget.items && widget.items.length) {
          a.value = widget.items[0].label
        }
        if (widget.type === 5) {
          a.value = []
        }
        if (widget.type === 8) {
          a.value = {
            province: '',
            city: '',
            town: '',
            detail: ''
          }
        }
        widget.answer = a
        this.answer.push(a)
      })
    },
    getCities (p) {
      let province = address.find(_ => _.label === p)
      if (!province || !province.children) return []
      return province.children
    },
    getTowns (v) {
      if (!v.city) return []
      let c = this.getCities(v.province)
      let t = c.find(_ => _.label === v.city)
      return t.children || []
    },
    clearAddress (value, index) {
      console.log(index)
      value.town = ''
      if (index === 1) {
        value.city = ''
      }
    }
  }
}
</script>

<style lang="scss">
.finalform {
  padding: 20px;
  .final-form-card {
    width: 780px;
    margin: 0 auto;
    background: #fff;
    box-shadow: 0 2px 9px 0 rgba(167,167,167,.5);
    .form-card-head {
      background-color: #409EFF;
      height: 20px;
    }
    .form-card-title {
      padding: 18px 30px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: rgb(31, 45, 61);
      font-size: 20px;
      text-align: left;
      font-style: normal;
      font-weight: bold;
    }
    .card-widget-wrapper {
      margin-top: 10px;
      padding-bottom: 10px;
      .final-form-widget {
        line-height: 20px;
        padding: 5px 30px;
        word-break: break-all;
        word-wrap: break-word;
        .form-widget-label {
          padding: 5px 0;
          line-height: 20px;
          color: #3d464d;
          font-weight: 600;
        }
        .form-widget-desc {
          font-size: 12px;
          line-height: 1.4;
          color: #91A1B7;
          margin-bottom: 5px;
        }
        .widget-input,
        .widget-select,
        .widget-date .el-date-editor--date {
          width: 330px;
        }
        .el-select {
          width: 330px;
        }
        .widget-checkbox {
          width: 330px;
          .el-checkbox  {
            margin: 0;
          }
          .el-checkbox-group {
            display: flex;
            flex-direction: column;
          }
        }

        .widget-address {
           width: 720px;
            &-select {
              display: flex;
              .address-select-item {
                .el-select {
                  width: 100%;
                }
                &.province {
                  width: 310px;
                }
                &.city,
                &.town {
                  width: 200px;
                  margin-left: 5px;
                }
              }
            }
            &-detail {
              width: 100%;
              margin-top: 5px;
            }
        }
      }
    }
    .form-submit-btn {
      text-align: center;
      line-height: 60px;
      margin-top: 10px;
      margin-bottom: -10px;
      border-top: solid 1px #DEDEDE;
      .el-button {
        width: 120px;
        height: 36px;
        padding: 0;
        line-height: 36px;
      }
    }
  }
}
</style>
