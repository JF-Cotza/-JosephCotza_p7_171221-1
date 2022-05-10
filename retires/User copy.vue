<template>
    <div>
        <input v-on:change='emitNom' type="text" name="name" id="name" v-model='nom' :class='isMasked' placeholder="Votre nom">
        <input v-on:change='emitPrenom' type="text" name="firstname" id="firstname" v-model='prenom' :class='isMasked' placeholder="Votre prénom">
        <input v-on:change='emitMail' type="email" name="email" id="email" v-model='mail' placeholder="Votre mail" title='Votre mail servira à vous identifier'>
        <div>
            <input v-on:change='emitPassword' :type="psw" name="password" id="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[é è_çà=$ù!:;,?./§%µ£°@+]).{8,}" v-model='password' placeholder="Saisissez le mot de passe. Il doit contenir au moins 8 caractéres, 1 majuscule, 1 minuscule,1 chiffre, 1 caractére spécial parmi: é è_çà=$ù!:;,?./§%µ£°@+ " @change='count'>
            <button @click='switching'>{{see}}</button>
        </div>
        <button v-if="this.$store.state.page=='sign'" type="submit" @click='addUser'>Envoyer</button>
        <button type="reset">Annuler</button>
        
    </div>
</template>

<script>
import FormData from 'form-data';
  const defaultUrl='http://localhost:3000/api';
  const axios=require('axios');
  const instance =axios.create({ baseURL:defaultUrl});

export default {
    name:'User',
    emits:['emitNom','prenom','mail','password'],        
    data(){
        return{
            isMasked:'',
            isDisabled:true,
            see:'Voir le mot de passe',
        }
    },
    created:function(){
        if(this.$store.state.page=='connect'){
            this.isMasked='masked';
        }
        else if(this.$store.state.page=='sign'){
            return this.isMasked='';
        }
    },
    methods:{
        switching(e){
            e.preventDefault();
            if(this.psw=='password'){
                this.psw='text';
                this.see="Voir le mot de passe"
            }
            else{
                this.psw='password';
                this.see="Masquer le mot de passe"
            }
        },
        emitNom(e){
            this.$emit('emitNom',{nom:e.target.value})
        },
        emitPrenom(e){
            this.$emit('emitPrenom',{prenom:e.target.value})
        },
        emitMail(e){
            this.$emit('emitMail',{mail:e.target.value})
        },
        emitPassword(e){
            this.$emit('emitPassword',{password:e.target.value})
        }
    }
}


</script>

<style scoped>
.masked{
    display: none;
}
</style>