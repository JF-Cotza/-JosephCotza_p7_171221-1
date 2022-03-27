<template>
  <div>
    <div v-if="this.$store.state.page=='/'">
      <h1>Bienvenue</h1>
      <p>Ce site est réservé aux employés de Groupomania.</p>
      <div v-if="mess!=''">{{mess}}</div>
    </div>
    <div v-if="this.$store.state.page=='connect'">
        <h1>Se Connecter</h1>
        <p>Vous êtes déjà enregitré et voulez vous connecter</p>
        <form action="http://localhost:3000/api/auth/connect" method='POST' enctype="multipart/form-data">
          <User />
          <button type="submit">Envoyer</button>
          <button type="reset">Annuler</button>
        </form>
    </div>
    <div v-if="this.$store.state.page=='sign'">
        <h1>S'enregistrer</h1>
        <p>Vous travaillez pour Groupomania et voulez vous enregistrer</p>
        <form action="http://localhost:3000/api/auth/addUSer" method='POST' enctype="multipart/form-data">
        <User />
        <!--  <User 
            v-on:emitNom='setName'
            v-on:emitPrenom='setFirstname'
            v-on:emitMail='setEmail'
            v-on:emitPassword='setPassword'
          />
          <button v-if="this.$store.state.page=='sign'" type="submit" @click='addUser'>Envoyer</button>
          <button type="reset">Annuler</button>-->
        </form>
    </div>
    <div v-if="this.$store.state.page=='about'">
        <h1>A propos</h1>
        <p>Ce site est un démonstrateur technique pour le dernier projet d'OpenClassroom. il a pour but la réalisation d'un réseau social d'entreprise</p>
    </div>
  </div>  

</template>

<script>
// @ is an alias to /src
import User from '../components/User.vue'
import FormData from 'form-data';
  const defaultUrl='http://localhost:3000/api';
  const axios=require('axios');
  const instance =axios.create({ baseURL:defaultUrl});

export default {
  name: 'Unconnected',
  components:{
    User
  },
  data(){
    return{
      mess:'',
      name:'',
      firstname:'',
      email:'',
      password:''
    }
  },
  //props:['nom', 'prenom','mail','password'],
  methods:{
    setName(payload){
      console.log('setName ',payload)
      this.name=payload.nom
    },
    setFirstname(payload){
      console.log('setFirstname ',payload)
      this.firstname=payload.prenom
    },
    setEmail(payload){
      console.log('setEmail ',payload)
      this.email=payload.mail
    },
    setPassword(payload){
      console.log('setpsw ',payload)
      this.password=payload.password
    },
    addUser(e){
      e.preventDefault();
      let form=new FormData()
      
      let $this=this;
      console.log('adduser', 'name: ',this.name,' firstname: ',this.firstname)
      form.append('name',this.name);
      form.append('firstname',this.firstname);
      form.append('email',this.email);
      form.append('password',this.password);
      instance.post('/auth/addUser', form)
        .then(function(res){
          console.log(res.data.message) 
          if(res.data.code==500){
            console.log('res add if ', res)
            $this.$router.push('http://localhost:8000/test1')
          }
          else{
            console.log('res add else',res);
            $this.$router.push('http://localhost:8000/')
          }
        })
        .catch(function(error){//ne marche pas ?
          console.log('erreur ajout ',error)
          $this.$router.push('http://localhost:8000/test1')
        })
    }    
  }
}
</script>
