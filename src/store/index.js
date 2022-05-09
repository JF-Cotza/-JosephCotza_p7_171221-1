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
      //state.page='connected';
      state.connectionStatus='connected';
    }
  },
  actions: {
    getPublications({commit}){
      console.log('store getpub,' , this.state.token, 'page', this.state.publicationPage)
      //this.publication='getPublication'
      //this.message+=' '+this.token;
      return new Promise((resolve, reject)=>{
        commit('waiting',true)

        instance.defaults.headers.common={'Authorization':'Bearers '+this.state.token}
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
    getAllUsers({commit}){
      console.log('index admin get all users')
      return new Promise((resolve, reject)=>{
        //console.log(commit)
        instance.get('/admin/getAllusers', {headers:{'Authorization': `bearer ${this.state.token}`}}) 
          .then(function(res){
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
      console.log('index admin get all pubs')
      return new Promise((resolve, reject)=>{
        //console.log(commit)
        instance.get('/admin/getAllPubs', {headers:{'Authorization': `bearer ${this.state.token}`}}) 
          .then(function(res){
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
        instance.get('/admin/getAllComments', {headers:{'Authorization': `bearer ${this.state.token}`}}) 
          .then(function(res){
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
    tokenChecking({commit},value){
      console.log('tokenCheking call by',value,'  ',sessionStorage.getItem('token'))
      console.log(commit);
      if(sessionStorage.getItem('token')){
        let user=JSON.parse(sessionStorage.getItem('token'))
        commit('setUser',user)
      //this.$router.push('Connected')
      //console.log('state connected',this.$store.state)
      }
    /*
    if(this.$store.state.token==''){
      console.log('non connecté')
      this.$router.push('/')
    }
    else{
      console.log('ok')
      this.$router.push('Connected')
      console.log('state connected',this.$store.state)
    }*/
    }
  },
  modules: { 
  }
})