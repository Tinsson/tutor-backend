//深度比较两个对象是否相等
function compareObject(o1, o2) {
  if (typeof o1 != typeof o2)
    return false
  if (typeof o1 == 'object') {
    if (o1.length != o2.length) {
      return false
    }
    if (o1.length == undefined && o2 == undefined) {
      let o1_key = 0
      let o2_key = 0
      for (let key in o1) {
        o1_key++
      }
      for (let key in o2) {
        o2_key++
      }
      if (o1_key != o2_key) {
        return false
      }
    }
    for (let o in o1) {
      if (typeof o2[o] == 'undefined')
        return false
      if (!compareObject(o1[o], o2[o]))
        return false
    }
    return true
  } else {
    return o1 === o2
  }
}

//深度拷贝对象
function copyObj(obj,emptyObj={}) {
  for (let key in obj) {
    if(typeof obj[key] === 'object' && obj[key] !== null) {
      if(obj[key].length === undefined ){
        emptyObj[key] = copyObj(obj[key])
      }else{
        emptyObj[key] = copyObj(obj[key],[])
      }
    }else {
      emptyObj[key] = obj[key]
    }
  }
  return emptyObj;
}

//利用JSON化进行简单深拷贝
function simpleCopy(source){
  return JSON.parse(JSON.stringify(source));
}

//通用的上传图片接口
function uploadPic(file, type){
  let that = this;
  return new Promise((resolve)=>{
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (f) {
      that.axios.post('upload-img',{pic: this.result, type}).then(res=>{
        console.log(res);
        if(res.status === 1){
          resolve({
            base64: this.result,
            short_pic: res.data.list
          })
        }
      })
    };
  })
}

//通用的惰性单例
function getSingle(fn){
  let result = null;
  return function() {
    return result || (result = fn.call(this, arguments));
  }
}

export {
  compareObject,
  copyObj,
  uploadPic,
  simpleCopy,
  getSingle
}
