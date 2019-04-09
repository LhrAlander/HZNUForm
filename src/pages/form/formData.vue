<template lang="pug">
.formdata
  .formdata-head
    .formdata-head-left
      .formdata-head-left-goback
        i.el-icon-arrow-left(@click="goback")
        span.app-name {{ formName }}
    .formdata-head-mid
      .formdata-head-form(@click="goEditForm") 表单设计
      .formdata-head-data 数据管理
    .formdata-head-right
      my-avatar
  .formdata-cnt
    .formdata-operate
      el-button(type="success" @click="selectColumn=true") 显示字段
      el-button(type="primary" @click="exportData") 导出excel
      .formdata-search
        el-input(prefix-icon="el-icon-search" placeholder="搜索填写人手机号/邮箱")
    .formdata-table
      el-table(
        :data="resultData"
        style="width: 100%")
        el-table-column(
          v-for="c in selectedColumns"
          :key="c.prop"
          :prop="c.prop"
          :label="c.label"
          :formatter="resultFormatter"
          :min-width="c.width")
        el-table-column(
          fixed="right"
          label="操作"
          width="100")
          template(slot-scope="scope")
            el-button(type="text" size="small" @click="deleteData(scope.row)") 删除
  el-dialog(
    title="显示字段"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="selectColumn"
    width="500px")
    el-checkbox-group(v-model='showColumns')
      el-checkbox(v-for="c in formColumns" :key="c.prop" :label="c.prop") {{ c.label }}
</template>

<script>
import MyAvatar from '@/components/Avatar'
import { exportExcel } from '@/utils/index.js'

import {
  resultListAPI,
  deleteResultAPI,
  getFormDetailAPI
} from '@/api/index.js'

export default {
  components: {
    MyAvatar
  },
  data () {
    return {
      mode: 'mock',
      formData: [],
      resultData: [],
      showColumns: [],
      selectColumn: false,
      formName: ''
    }
  },
  computed: {
    formColumns () {
      if (!this.formData.length) return []
      return this.formData.map(item => {
        return {
          label: item.label,
          prop: item.widget.id,
          type: item.widget.type
        }
      })
    },
    selectedColumns () {
      let c = [
        {
          label: '提交人',
          prop: 'user',
          width: '150px'
        },
        {
          label: '提交时间',
          prop: 'time',
          width: '150px'
        }
      ]
      this.showColumns.forEach(id => {
        let column = this.formColumns.find(_ => _.prop === id)
        if (column) {
          let item = {
            label: column.label,
            prop: column.prop,
            width: '150px'
          }
          if (column.type === 2 || column.type === 5 || column.type === 8) {
            item.width = '300px'
          }
          c.push(item)
        }
      })
      return c
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      let formDetail = await getFormDetailAPI(this.$route.params.formId)
      this.formName = formDetail.data.name
      let resArr = await resultListAPI(this.$route.params.formId)
      this.flushResData(resArr)
    },
    exportData () {
      let idMap = {user: '提交人', time: '提交时间'}
      this.formData.forEach(({ widget, label }) => {
        idMap[widget.id] = label
      })
      let data = this.resultData.map(_ => {
        let row = {}
        for (let k in _) {
          if (k === 'id') continue
          let label = idMap[k]
          let value = _[k]
          row[label] = value
        }
        return row
      })
      exportExcel(data, this.formName)
    },
    goback () {
      this.$router.push({ name: 'editApp', params: { id: this.$route.params.appId } })
    },
    resultFormatter (r, c, cv) {
      if (cv === null || cv === undefined) return ''
      if (typeof cv === 'string') return cv
      const keys = Object.keys(cv)
      const values = []
      keys.forEach(k => {
        values.push(cv[k])
      })
      return values.join('')
    },
    goEditForm () {
      this.$router.push({ name: 'editForm', params: { appId: this.$route.params.appId, groupId: this.$route.params.groupId, formId: this.$route.params.formId } })
    },
    async deleteData (formData) {
      let res = await deleteResultAPI(formData.id)
      console.log(res)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
    },
    flushResData ({ data }) {
      this.formData = JSON.parse(data.formData)
      let dataArr = data.resultData.map(result => {
        let a = {
          user: result.name,
          id: result.id,
          time: new Date(result.updateTime).format('yyyy-MM-dd hh:mm')
        }
        let resultData = JSON.parse(result.resultData)
        resultData.forEach(widget => {
          a[widget.widget] = widget.value
        })
        return a
      })
      this.resultData = dataArr
      this.formData.forEach(_ => {
        _.widget.id = _.widget.id + ''
        this.showColumns.push(_.widget.id)
      })
    }
  }
}
</script>

<style lang="scss">
.formdata {
  height: 100%;
  position: relative;
  &-head {
    height: 60px;
    line-height: 60px;
    position: relative;
    z-index: 3;
    padding: 0 20px;
    color: #333;
    font-size: 18px;
    font-weight: bold;
    background: #fff;
    box-shadow: 0 2px 5px 0 hsla(0,0%,39%,.15);
    display: flex;
    justify-content: space-between;
    .icon-avatar {
      font-size: 30px;
    }
    &-mid {
      display: flex;
      font-size: 16px;
      font-weight: normal;
      .formdata-head-data {
        margin-left: 10px;
        border-bottom: solid 4px #409EFF;
        color: #409EFF;
      }
      .formdata-head-form,
      .formdata-head-data {
        cursor: pointer;
      }
    }
    .el-icon-arrow-left {
      font-size: 20px;
      font-weight: bold;
      margin-right: 10px;
      cursor: pointer;
    }
    .el-icon-edit {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  &-cnt {
    padding: 20px;
    .formdata-operate {
      display: flex;
    }
    .formdata-search {
      width: 316px;
      margin: 0 10px;
    }
    .formdata-table {
      margin: 20px auto;
      .el-table {
        border-radius: 4px;
        th {
          padding: 0;
          height: 50px;
          line-height: 50px;
          font-size: 14px;
          color: #909399;
          background: #f3f3f3;
        }
        thead {
          height: 50px;
        }
      }
    }
  }
  .el-dialog {
    border-radius: 10px;
    &__header {
      height:49px;
      padding: 0 14px;
      line-height: 49px;
      background:#2d353c;
      border-radius: 10px 10px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__title {
      color: #fff;
      font-size:16px;
    }
    &__headerbtn {
      width:26px;
      height:26px;
      position: inherit;
      border-radius: 13px;
      background:#fff;
      .el-dialog__close {
        color: #2d353c;
        font-weight: bold;
      }
    }
  }
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .el-checkbox {
      margin-right: 30px;
      margin-bottom: 10px;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
}
</style>
