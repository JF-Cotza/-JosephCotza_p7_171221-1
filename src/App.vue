<template>
  <div id="nav">{{ texture }}
    <div v-if="this.$store.state.connectionStatus=='unconnected' || this.$store.state.token==''">
      <router-link to="/" @click="toIndex">Accueil</router-link> |
      <router-link to="/" @click="toConnect">Connect</router-link> |
      <router-link to="/" @click="toSigning">Signing</router-link> |
      <router-link to="/" @click="toAbout">About</router-link>
    </div>
    <div v-if="this.$store.state.connectionStatus=='connected' && this.$store.state.token!=''" >
      <router-link to="/connected" @click="toConnected">Accueil</router-link> |
      <router-link to="/connected" @click="toProfile">Voir mon profil</router-link> |
      <router-link to="/connected" @click="toCreate">Ajouter une publication</router-link> |
      <router-link v-if="this.$store.state.authorStatus==2" to="/connected" @click="toAdmin">Gérer</router-link> |
      <router-link to="/" @click="deconnection">Deconnecter</router-link>
    </div>
    
    <router-view/>
  </div>
  
</template>

<script>
const axios=require('axios');
export default {
  data(){
    return{
      texture:'',
    }
  },
  created:function(){
    console.log('created', this.$store.state.token)
    console.log('state',this.$store.state)
    if(this.$store.state.token==''){
      console.log('non connecté')
      this.$router.push('/')
    }
    else{
      console.log('ok')
      this.$router.push('Connected')
      console.log('state connected',this.$store.state)
    }
  },
  methods:{
    //unconnected
    toIndex(){
      return this.$store.state.page='/'
    },
    toConnect(){
      return this.$store.state.page='connect'
    },
    toSigning(){
      return this.$store.state.page='sign'
    },
    toAbout(){
      return this.$store.state.page='about'
    },
    //connected
    toAdmin(){
      let adminId=this.$store.state.author;
      let adminStatus=this.$store.state.authorStatus;
      let adminToken=this.$store.state.token;
      let $this=this;

      this.$store.dispatch('getAllUsers',{id:adminId, status:adminStatus, token:adminToken})
      .then(res=>{
        console.log('toAdmin',res.data.data)
        $this.$store.state.userList=res.data.data
        })
      .catch(err=>console.log(err.message))
      this.$store.state.page='admin';
      this.$router.push('Admin');
    },
    toProfile(){
      return this.$store.state.page='profile'
    },
    toConnected(){
      this.$store.dispatch('getPublication',{id:this.$store.state.token})
      this.$store.state.page='connected'
    },
    toCreate(){
      return this.$store.state.page='create'
    },
    deconnection(){
      //réinitialisation du store
      this.$store.state.connectionStatus='unconnected';
      this.$store.state.page='/';
      this.$store.state.token='';
      this.$store.state.message='';
      this.$router.push({name:'Home'});
      axios.defaults.headers.common = {'Authorization': ''}
      //suppression du contenu du local storage
      localStorage.clear();
      //pour vérifier que le store est bien vide
      console.log('state deconnecté', this.$store.state)
    }
  },
  mounted:function(){
    this.texture=this.$route.query.id
  }
}
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
