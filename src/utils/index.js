export const exportExcel = (json, fileName, type) => {
  function saveAs (obj, fileName) {
    var tmpa = document.createElement('a')
    tmpa.download = fileName || '下载'
    tmpa.href = URL.createObjectURL(obj)
    tmpa.click()
    setTimeout(function () {
      URL.revokeObjectURL(obj)
    }, 100)
  }

  function s2ab (s) {
    if (typeof ArrayBuffer !== 'undefined') {
      let buf = new ArrayBuffer(s.length)
      let view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
    } else {
      let buf = new Array(s.length)
      for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff
      return buf
    }
  }

  function getCharCol (n) {
    let s = ''
    let m = 0
    while (n > 0) {
      m = (n % 26) + 1
      s = String.fromCharCode(m + 64) + s
      n = (n - m) / 26
    }
    return s
  }

  const wopts = {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary',
    cellStyles: true
  }
  let tmpdata = json[0]
  json.unshift({})
  let keyMap = []
  for (let k in tmpdata) {
    keyMap.push(k)
    json[0][k] = k
  }
  tmpdata = []
  json
    .map((v, i) =>
      keyMap.map((k, j) =>
        Object.assign(
          {},
          {
            v: v[k],
            position:
              (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) +
              (i + 1)
          }
        )
      )
    )
    .reduce((prev, next) => prev.concat(next))
    .forEach(v => {
      tmpdata[v.position] = {
        v: v.v
      }
    })
  let outputPos = Object.keys(tmpdata)
  outputPos.forEach(pos => {
    if (/[^\d]1$/.test(pos)) {
      tmpdata[pos].s = {
        font: { sz: 12, bold: true },
        alignment: {
          horizontal: 'center'
        }
      }
    }
  })
  let tmpWB = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign(
        {},
        tmpdata,
        {
          '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1]
        }
      )
    }
  }
  let tmpDown = new Blob(
    [
      s2ab(
        XLSX.write(
          tmpWB,
          {
            bookType: type === undefined ? 'xlsx' : type,
            bookSST: false,
            type: 'binary'
          }
        )
      )
    ],
    {
      type: ''
    }
  )
  saveAs(
    tmpDown,
    fileName +
      '.' +
      (wopts.bookType === 'biff2' ? 'xls' : wopts.bookType)
  )
}
