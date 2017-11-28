import axios from 'axios'

//新增门店

let addStore = (token,levelid,type,data) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append("levelid", levelid);
    formData.append("type", type);
    formData.append("data", window.JSON.stringify(data) );


    axios.post(`?controller=stores&action=create&token=${token}`,formData).then((res)=>{
      resolve(res)
    })
  })
};




export default {addStore}


