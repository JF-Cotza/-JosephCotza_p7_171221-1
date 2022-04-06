import { createStore } from 'vuex'
import axios from 'axios'

const defaultUrl='http://localhost:3000/api';
//const frontDefault='http://localhost:8080'
const instance =axios.create({ baseURL:defaultUrl});
//

export default createStore({
  state: {
    connectionStatus:'unconnected',   //connecté ou non
    page:'/',
                             //page correspondant à la route
    token:'',
    author:'',
    authorStatus:'',

    publication:'',
    publicationPage:1,
    message:'',
  },
  mutations: {
  },
  actions: {
    getPublication({commit},userInfo){
      instance.defaults.headers.common['Authorization']='bearers '+userInfo.id
      console.log('store getpub,' , userInfo.id)
      //this.publication='getPublication'
      //this.message+=' '+this.token;
      return new Promise((resolve, reject)=>{
        console.log(commit)
        instance.get('/publications/getAllPublications', {params:{'page':this.state.publicationPage}}) 
          .then(function(res){
            console.log('then',res);
            resolve(res);
          })
          .catch(function(err){
            console.log('err',err.message)
            reject(err)
          })
      })
    }
  },
  modules: { 
  }
})