<template>
  <div class='body'>
    <div class="container">
      <p class='toplogo'>
        <img src="./assets/icon-left-font-monochrome-black.svg" alt="tog logo groupomania" >
      </p>
      
      <div id="nav" class='nav'>
        <div v-if="this.$store.state.connectionStatus=='unconnected' || this.$store.state.token==''" class='grid'>
          <router-link class='link unc_grid_one' to="/" @click="toIndex"><img src="../src/assets/icon.svg" alt="logo groupomania" class='logo'>Accueil</router-link >          
          <router-link class='link unc_grid_two' to="/" @click="toConnect">Connect</router-link>
          <router-link class='link unc_grid_three' to="/" @click="toSigning">Signing</router-link>
          <router-link class='link unc_grid_four' to="/" @click="toAbout">About</router-link>
        </div>
        <div v-if="this.$store.state.connectionStatus=='connected' && this.$store.state.token!=''" class='connectedGrid'>
          <router-link class='link cnt_grid_one' to="/connected" @click="toConnected">Accueil</router-link>
          <router-link class='link cnt_grid_two' to="/connected" @click="toProfile">Voir mon profil</router-link>
          <router-link class='link cnt_grid_three' to="/connected" @click="toCreate">Ajouter une publication</router-link>
          <router-link class='link' v-if="this.$store.state.authorStatus==2" to="/connected" @click="toAdmin">Gérer</router-link>
          <router-link class='link cnt_grid_four' to="/" @click="deconnection">Deconnecter</router-link>
        </div>
      </div>
    </div>
    <div v-if="this.$store.state.wait==true" class='clearBack'>
      <Waiting />
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';
import Waiting from './components/Waiting.vue';
const defaultUrl='http://localhost:3000/api';
const instance =axios.create({ baseURL:defaultUrl});

export default {
  data(){
    return{
      token:'',
    }
  },
  components:{
    Waiting,
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
      this.token=this.$store.state.token;
      this.getUser()
    },
    toConnected(){
      this.$store.dispatch('getPublications');
      this.$store.state.page='connected'
    },
    toCreate(){
      this.$store.state.page='create'
      console.log(this.$store.state.page)
    },
    deconnection(){
      this.$store.dispatch('deconnection'); //réinitialisation du store
      this.$router.push({name:'Home'});
    },
    //R-P: voir le profil
    getUser(){      
      console.log('userVue getUser')
      let $this=this;
     
      instance.get('/auth/getMyProfile', {headers: {'Authorization': `bearer ${this.token}`}})
      .then(res=>{
        
        let user=res.data.data[0];
        console.log(user);
        localStorage.setItem('user',JSON.stringify(user));
        $this.$store.state.profileUser=user;
        this.$store.state.page='profile';
      })
      .catch(err=>console.log(err.message))
    },
  },
}
</script>


<style lang="scss">
html{
  height: fit-content;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  a {
    font-weight: bold;
    color: black;

    &.router-link-exact-active {
      color: black;
    }
  }
}

h1{
  font-size: 2rem;
}


.masked{
  display:none
}

.toplogo{
  background:pink;
  border-radius: 20px;
}



.body, .nav{
  min-width: 300px;
  margin:auto;
}

.body{
  background: silver;
  padding-bottom: 10px;
}

.nav{
  margin:auto;
  background: aqua;
  border-radius: 20px;
}

.link{
  color:black;
  background: white;
  border-radius: 5px;
}

.link:hover{
  font-size:1.5rem;
  border-radius: 5px;
}

.clearBack{
  background: white;
  padding:5px 0;
  margin: 5px 0;
}


//les boutons
//bouton
  .danger{
    background: #fca9a1;
    background: -moz-linear-gradient(top,  #fca9a1 0%, #932613 50%, #2d0805 98%);
    background: -webkit-linear-gradient(top,  #fca9a1 0%,#932613 50%,#2d0805 98%);
    background: linear-gradient(to bottom,  #fca9a1 0%,#932613 50%,#2d0805 98%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fca9a1', endColorstr='#2d0805',GradientType=0 );
    color:red;
    font-weight: bold;  
}

  .send{
    background: #b4e391;
    background: -moz-linear-gradient(top,  #b4e391 0%, #61c419 76%, #17540a 98%);
    background: -webkit-linear-gradient(top,  #b4e391 0%,#61c419 76%,#17540a 98%);
    background: linear-gradient(to bottom,  #b4e391 0%,#61c419 76%,#17540a 98%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b4e391', endColorstr='#17540a',GradientType=0 );

  }

  .reset{
    background: #fca9a1;
    background: -moz-linear-gradient(top,  #fca9a1 0%, #bf2618 84%, #2d0805 98%);
    background: -webkit-linear-gradient(top,  #fca9a1 0%,#bf2618 84%,#2d0805 98%);
    background: linear-gradient(to bottom,  #fca9a1 0%,#bf2618 84%,#2d0805 98%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fca9a1', endColorstr='#2d0805',GradientType=0 );

  }

//masker un élément
.masked{
    display: none;
}

.toplogo{
  margin-top:0;
}

.toplogo img{
    width: 80%;
    margin:auto;
    padding-top: 5px;
    padding-bottom:5px ;
  }

.clearBack{
  width:300px;
  height: 300px;
  margin:auto;
  padding: 0;
}

@media screen and (max-width: 680px)
{
  .container{
    width: 300px;
    margin: auto;
  }

  .toplogo, .nav, .grid{
    width: 100%;  
    margin:auto;
  }

//nav déconnectée small
  .grid{
    margin: 5px 0;
    display: grid;
    grid-template-columns: repeat(2, .9fr);
    grid-gap:5px;
    grid-template-rows: repeat(2, 1fr);
    padding:1rem 0 ;
  }

  .unc_grid_one{
    grid-column: 1 / 2;
    grid-row: 1 / 2 ;
  }
  .unc_grid_two{
    grid-column: 2 / 3;
    grid-row: 1 2;
  }
  .unc_grid_three{
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }
  .unc_grid_four{
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }

//nav connectée small
  .connectedGrid{
    margin: 5px 0;
    display: grid;
    grid-template-columns: repeat(2, .9fr);
    grid-gap:5px;
    grid-template-rows: repeat(3, 1fr);
    padding:1rem 0 ;
  }

  .cnt_grid_one{
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }
  .cnt_grid_two{
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }
  .cnt_grid_three{
    grid-column: 1 / 3;
    grid-row: 3 / 4;
  }
  .cnt_grid_four{
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

//
  .link{
    margin-right:.5rem;
    margin-left:.5rem;
    font-size: 1.2rem;
  }

   .logo{
    width: 1rem;
    height: auto;
    background: transparent;
  }

  .clearBack{
    border-radius: 20px;
  }


}

@media screen and (min-width: 681px){
  .body{
    width:100%;
    margin:0;
    padding: 10px 0 0 0;
  }


//nav déconnecté 
  .grid{
    display: grid;
    grid-template-columns: repeat(4, .9fr);
  }

  .unc_grid_one{
    grid-column: 1 / 2;
    grid-row: 1
  }
  .unc_grid_two{
    grid-column: 2 / 3;
    grid-row: 1
  }
  .unc_grid_three{
    grid-column: 3 / 4;
    grid-row: 1;
  }
  .unc_grid_four{
    grid-column: 4 / 5;
    grid-row: 1;
  }

//nav connectée
  .connectedGrid{
    height: 120px;
    padding:5px 0;
    display: grid;
    grid-template-columns: repeat(2, .9fr);
    grid-gap:5px;
    grid-template-rows: repeat(2,1fr);
  }

  .cnt_grid_one{
    grid-column: 1 / 2;
    grid-row: 1/2;
  }
  .cnt_grid_two{
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
  .cnt_grid_three{
    grid-column: 2 / 3;
    grid-row: 2/3
  }
  .cnt_grid_four{
    grid-column: 1 / 2;
    grid-row: 2/3 ;
  }


  .link{
    height: 40px;
    padding: 10px 0 0 10px;
    font-size: 1rem;
  }
  .link:hover{
    font-size: 1.5rem;
  }

}


@media screen and (min-width: 681px) and (max-width: 1023px){
  .grid{
    margin: 5px 0;
    grid-gap:5px;
    grid-template-rows: 50px;
    padding:.5rem 0.5rem ;
  }
  
  .link{
    height: 40px;
    padding: 10px 0 0 10px;
    font-size: 1.2rem;
  }

  .link:hover{
    font-size: 1.7rem;
  }

 .logo{
    width: 1.5rem;
    height: auto;
    background: transparent;
  }
  
  .clearBack{
    background:rgba(0,50,10,.5);
    border-radius:30%;
  }
} 

@media screen and (min-width:1024px){
  .grid{
    margin: 5px 0;
    grid-gap:15px;
    grid-template-rows: 80px;
    padding:1rem 1rem ;
  }
  
  .link{
    height: 60px;
    padding: 20px 0 0 20px;
    font-size: 1.7rem;
  }

  .link:hover{
    font-size: 2rem;
  }

 .logo{
    width: 1.5rem;
    height: auto;
    background: transparent;
  }
  
  .clearBack{
    background:rgba(50,10,10,.5);
    border-radius:30% 50%;

  }
} 
</style>
