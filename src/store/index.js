import { createStore } from 'vuex'
import axios from 'axios'

const port='5000';
const defaultUrl='http://localhost:'+port;
const instance =axios.create({ baseURL:defaultUrl+'/api'});
//

export default createStore({
  state: {
    urlBasis:defaultUrl,
    url:defaultUrl+'/api',
    connectionStatus:'unconnected',   //connecté ou non
    page:'/',                         //page correspondant à la route
  //l'animation d'attente
    wait:false,
    time:4000,                        //temps en ms
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
    administredList:{},
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
      instance.get('/kill');
      localStorage.clear();
      sessionStorage.clear();
      state.connectionStatus='unconnected';
      state.page='/';
      state.token='';
      state.message='';
      
      axios.defaults.headers.common = {'Authorization': ''}
      //suppression du contenu du local storage
      
      //pour vérifier que le store est bien vide
      console.log('state deconnecté', state)
    },
    waiting(state,value){
      state.wait=value;
    },
    commentsCount(state,count){
      state.countedComment=count;
    },
    page(state,cible){
      if(cible=='admin'){
        state.page=cible

      }
    },
    users(state,users){
      state.administredList=users.data
    },
    pubs(state,pub){
      state.administredList=pub.data;
    },
    comments(state,comments){
      state.administredList=comments.data;
    },
    setUser(state,user){
      state.token=user.id
      state.authorStatus=user.authorStatus;
      state.author=user.author;
      console.log('commit set user',user, state.token, state.authorStatus);
      state.page='connected';
      state.connectionStatus='connected';
    }
  },
  actions: {
    getPublications({commit}){
      console.log('store getpub,' , this.state.token, 'page', this.state.publicationPage) 

      return new Promise((resolve, reject)=>{
        commit('waiting',true);
        setTimeout(()=>commit('waiting',false),this.state.time)
        instance.defaults.headers.common={'Authorization':'Bearers '+this.state.token}
        instance.get('/publications/getAllPublications', {params:{'page':this.state.publicationPage}}) //attention à l'ordre si l'on met le headers après le params, il n'est pas pris en compte
          .then(function(res){
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
    getAllUsers({commit}){
      return new Promise((resolve, reject)=>{
        //console.log(commit)
        commit('waiting',true);
        setTimeout(()=>commit('waiting',false),this.state.time)
        instance.get('/admin/getAllusers', {headers:{'Authorization': `bearer ${this.state.token}`}}) 
          .then(function(res){
            commit('waiting',false)
            commit('users',res.data)
            commit('page','admin')
            console.log('get all users then',res.data);
          
            resolve(res);
          })
          .catch(function(err){
            console.log('err',err.message)
            reject(err)
          })
      })
    },
    getAllPubs({commit}){
      return new Promise((resolve, reject)=>{
        //console.log(commit)
        commit('waiting',true);
        setTimeout(()=>commit('waiting',false),this.state.time)
        instance.get('/admin/getAllPubs', {headers:{'Authorization': `bearer ${this.state.token}`}}) 
          .then(function(res){
            commit('waiting',false)
            commit('pubs',res.data)
            commit('page','admin')
            console.log('get all pub then',res.data);
          
            resolve(res);
          })
          .catch(function(err){
            console.log('err',err.message)
            reject(err)
          })
      })
    },
    getAllComments({commit}){
      console.log('index admin get all comments')
      return new Promise((resolve, reject)=>{
        //console.log(commit)
        commit('waiting',true);
        setTimeout(()=>commit('waiting',false),this.state.time)
        instance.get('/admin/getAllComments', {headers:{'Authorization': `bearer ${this.state.token}`}}) 
          .then(function(res){
            commit('waiting',false)
            commit('comments',res.data)
            commit('page','admin')
            console.log('get all comments then',res.data);
          
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
    tokenChecking({commit}){//,value){
      //console.log('tokenCheking call by',value,'  ',sessionStorage.getItem('token'))
      //console.log(commit);
      if(sessionStorage.getItem('token')){
        let user=JSON.parse(sessionStorage.getItem('token'))
        commit('setUser',user)
      }
    }
  },
  
})