import axios from 'axios';

export default {
  getLanguage : (url)=>{
    var language = localStorage.getItem('language') || 'en-us'
    return axios.get('/language/'+language+'/'+url)
  }
}