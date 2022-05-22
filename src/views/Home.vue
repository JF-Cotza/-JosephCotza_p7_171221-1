<template>
  <div>
    <div v-if="this.$store.state.page=='/'">
      <h1>Bienvenue</h1>
      <p>Ce site est réservé aux employés de Groupomania.</p>
      <div v-if="mess!=''">{{ mess }}</div>
    </div>
    <div v-if="this.$store.state.page=='connect'">
        <h1>Se Connecter</h1>
        <p>Vous êtes déjà enregitré et voulez vous connecter</p>
        <User />
    </div>
    <div v-if="this.$store.state.page=='sign'">
        <h1>S'enregistrer</h1>
        <p>Vous travaillez pour Groupomania et voulez vous enregistrer</p>
        <User /> 
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
}
</script>
