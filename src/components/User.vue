<template>
    <div>
        {{ message }}
        <form :action="cible" method="POST" enctype="multipart/form-data">
            <input type="text" name="name" id="name" v-model='nom' :class='isMasked' placeholder="Votre nom" :required='isRequired'>
            <input type="text" name="firstname" id="firstname" v-model='prenom' :class='isMasked' placeholder="Votre prénom" :required='isRequired'>
            <input type="email" name="email" id="email" v-model='mail' placeholder="Votre mail" title='Votre mail servira à vous identifier' :rules='validMail' required>
            <div>
               <input :type='psw' name="password" id="password" v-model='password' placeholder="Saisissez le mot de passe. Il doit contenir au moins 8 caractéres, 1 majuscule, 1 minuscule,1 chiffre, 1 caractére spécial parmi: é è_çà=$ù!:;,?./§%µ£°@+" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[é è_çà=$ù!:;,?./§%µ£°@+]).{8,}"> 
                
                <button @click='switching'>{{see}}</button>
            </div>
            <button v-if="this.$store.state.page=='sign'" type="submit" @click='addUser'>Envoyer</button>
            <button type="reset">Annuler</button>
        </form>
    </div>
</template>

<script>
import FormData from 'form-data';
  const defaultUrl='http://localhost:3000/api';
  const frontDefault='http://localhost:8080'
  const axios=require('axios');
  const instance =axios.create({ baseURL:defaultUrl});

export default {
    name:'User',
    emits:['emitNom','prenom','mail','password'],        
    data(){
        return{
            isMasked:'',
            isDisabled:true,
            isRequired:false,
            nom:'',
            prenom:'',
            mail:'',
            password:'',
            psw:'password',
            
            see:'Voir le mot de passe',
            message:'',
            cible:'http://localhost:3000/api',
            
            isValidMail:false,
            isValidPassword:false,           
        }
    },
    created:function(){
        if(this.$store.state.page=='connect'){
            this.isMasked='masked';
            this.isRequired=false;
        }
        else if(this.$store.state.page=='sign'){
            this.isMasked='';
            this.isRequired=true;
            this.cible+='/auth/addUser'
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
        checkingPassword(tocheck){
            if(tocheck.validity.patternMismatch){
                this.isValidPassword=false;
                this.message+=`/ format de mot de passe erroné `
            }
            else{
                this.isValidPassword=true;
            }
        },
        checkingMail(tocheck){
            if(tocheck.validity.typeMismatch){
                this.isValidMail=false;
                this.message+=`/ adresse mail non valide `
            }
            else{
                this.isValidMail=true
            }
        },
        checkValidAdding(){
            this.message='';
            let checkMail=document.getElementById('email')
            let checkPassword=document.getElementById('password')
            this.checkingPassword(checkPassword)
            this.checkingMail(checkMail)
            
        },

        addUser(e){
            e.preventDefault();
            this.message='';
            this.checkValidAdding()
            if(!this.isValidMail || !this.isValidPassword){
                return
            }

            let form=new FormData()
        
            let $this=this;
            console.log('adduser', 'name: ',this.nom,' firstname: ',this.prenom)
            form.append('name',this.nom);
            form.append('firstname',this.prenom);
            form.append('email',this.mail);
            form.append('password',this.password);
            instance.post('/auth/addUser', form)
                .then(function(res){
                    console.log(res.data.message) 
                    if(res.data.code==401){
                        console.log('res add if ', res)
                        $this.message=res.data.message,
                        $this.$router.push(frontDefault)
                    }
                    else{
                        console.log('res add else',res);
                        $this.$store.state.page='connected';
                        $this.$router.push('Connected')
                    }
                    $this.message=res.data.message;
                })
                .catch(function(error){//ne marche pas ?
                    $this.message='Veuillez remplir tous les champs requis'
                    console.log('erreur ajout ',error)
                    
                    $this.$router.push('http://localhost:8000/')
                })
        }
    }
}


</script>

<style scoped>
.masked{
    display: none;
}
</style>