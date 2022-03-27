<template>
  <div id="nav">{{ texture }}
    <div v-if="this.$store.state.connectionStatus=='unconnected'">
      <router-link to="/" @click="toIndex">Accueil</router-link> |
      <router-link to="/" @click="toConnect">Connect</router-link> |
      <router-link to="/" @click="toSigning">Signing</router-link> |
      <router-link to="/test1" @click="toTest1">test1</router-link> |
      <router-link to="/" @click="toAbout">About</router-link>
    </div>
    <div v-else>
      <router-link to="/connected" @click="toConnected">Accueil</router-link> |
      <router-link to="/connected" @click="toProfile">Voir mon profil</router-link> |
      <router-link to="/connected" @click="toCreate">Signing</router-link> |
      <router-link to="/" @click="deconnection">Deconnecter</router-link>
    </div>
    
    <router-view/>
  </div>
  
</template>

<script>
export default {
  data(){
    return{
      texture:'',
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
    toTest1(){
      return this.$store.state.page='test1'
    },
    toAbout(){
      return this.$store.state.page='about'
    },
    //connected
    toProfile(){
      return this.$store.state.page='profile'
    },
    toConnected(){
      return this.$store.state.page='connected'
    },
    toCreate(){
      return this.$store.state.page='create'
    },
    deconnection(){
      this.$store.state.page='/';
      this.$store.state.connectionStatus='unconnected';
      this.$router.push({name:'Home'})
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
