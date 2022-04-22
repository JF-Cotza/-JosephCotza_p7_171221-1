import { createStore } from 'vuex'
import axios from 'axios'

const defaultUrl='http://localhost:3000/api';
//const frontDefault='http://localhost:8080'
const instance =axios.create({ baseURL:defaultUrl});
//

export default createStore({
  state: {
    connectionStatus:'unconnected',   //connecté ou non
    page:'/',                         //page correspondant à la route
    wait:true,
  // utilisateur                             
    token:'',
    author:'',
    authorStatus:'',
  //les publication
    publication:'',
    publicationPage:1,
    publicationListe:{},
    nombrePage:0,
    selectedPublication:{},
    commentList:[],
    countedComment:'',

    message:'',
    userList:{},
    
    profileUser:''
  },
  mutations: {
    listOfPublication(state,publication){
      console.log('liste of ',publication)
      state.publicationListe=publication.liste
      
      let nombrePage=Math.ceil(publication.message.split(' ')[0]/5)
      state.nombrePage=nombrePage
      if(nombrePage==0){
        state.message="Il n'y a pas encore de publication. Soyez le premier à le faire"
      }
      else{
        state.message=publication.message
      }
    },
    resetConnexion(state){
      state.connectionStatus='unconnected';
      state.page='/';
      state.token='';
      state.message='';
      
      axios.defaults.headers.common = {'Authorization': ''}
      //suppression du contenu du local storage
      localStorage.clear();
      //pour vérifier que le store est bien vide
      console.log('state deconnecté', state)
    },
    waiting(state,value){
      state.wait=value;
    },
    commentsCount(state,count){
      state.countedComment=count;
    }
  },
  actions: {
    getPublications({commit}){
      console.log('store getpub,' , this.state.token, 'page', this.state.publicationPage)
      //this.publication='getPublication'
      //this.message+=' '+this.token;
      return new Promise((resolve, reject)=>{
        commit('waiting',true)

        instance.defaults.headers.common={'Authorization':'bearers '+this.state.token}
        instance.get('/publications/getAllPublications', {params:{'page':this.state.publicationPage}}) //attention à l'ordre si l'on met le headers après le params, il n'est pas pris en compte
          .then(function(res){
            console.log('then',res.data);
            console.log(res.data.counted)
            commit('waiting',false);
            commit('listOfPublication',res.data)
            commit('commentsCount',res.data.counted)
            resolve(res);
          })
          .catch(function(err){
            console.log('err',err.message)
            reject(err)
          })
      })
    },
    getAllUsers({commit},admin){
      instance.defaults.headers.common['Authorization']='bearers '+admin.token
      console.log('getAllUsers,' , admin)

      return new Promise((resolve, reject)=>{
        console.log(commit)
        instance.get('/admin/getAllusers', {params:admin}) 
          .then(function(res){
            console.log('then',res);
            resolve(res);
          })
          .catch(function(err){
            console.log('err',err.message)
            reject(err)
          })
      })
    },
    deconnection({commit}){
      //réinitialisation du store
      console.log('deco',commit)

      commit('resetConnexion')
    },
  },
  modules: { 
  }
})