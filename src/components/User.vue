<template>
    <div>
        {{ message }}
        <form :action="defaultUrl+cible" method="POST" enctype="multipart/form-data" class='flex column'>
            <label for="name" v-if="this.$store.state.page=='profile'">Votre Nom :</label>
                <input type="text" name="name" id="name" v-model='nom' :class='isMasked' placeholder="Votre nom" :required='isRequired_A' :disabled='disabledChange'>
            <label for="firstname" v-if="this.$store.state.page=='profile'">Votre Prénom :</label>
                <input type="text" name="firstname" id="firstname" v-model='prenom' :class='isMasked' placeholder="Votre prénom" :required='isRequired_A' :disabled='disabledChange'>
            <label for="email" v-if="this.$store.state.page=='profile'">Votre mail :</label>
                <input type="email" name="email" id="email" v-model='mail' placeholder="Votre mail" title='Votre mail servira à vous identifier' :rules='validMail' required :disabled='disabledChange'>
            <div :class='dontShow'  class='flex  row' v-if='this.$store.state.page!="forgotten"'>
               <input :type='psw'  name="password" id="password" placeholder='Saississez votre mot de passe' v-model='password' title="Saisissez le mot de passe. Il doit contenir au moins 8 caractéres, 1 majuscule, 1 minuscule,1 chiffre, 1 caractére spécial parmi: é è_çà=$ù!:;,?./§%µ£°@+" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[é è_çà=$ù!:;,?./§%µ£°@+]).{8,}" :required='isRequired_B'>  
                <button @click='switching'>{{see}}</button>
            </div>
            <div class='button flex row'>
            <!-- unconnected -->
                <button class='send' v-if="this.$store.state.page=='connect'" type="submit" @click='connectUser'>Envoyer</button>
                <button class='send' v-if="this.$store.state.page=='sign'" type="submit" @click='addUser'>Envoyer</button>
                <button class='send' v-if="this.$store.state.page=='forgotten'" type="submit" @click='resetPassword'>Envoyer</button>
                <button class='yellow' v-if="this.$store.state.page!='profile' && this.$store.state.page!='forgotten'"  @click='toForgotten'>Mot de passe oublié</button>
            <!-- connected -->
                <button class='send' v-if="this.$store.state.page=='profile'" @click='toAccessData' :class='masking'>Oui</button>
                <button class='send' v-if="this.$store.state.page=='profile'" :class='dontShow'>Modifier</button>
            <!-- global -->
                <button class='reset' :class='masking' type="reset" >Annuler</button>
            </div>
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
            //pour masquer / révéler des élément
            isMasked:'',
            dontShow:'',
            masking:'',
            see:'Voir le mot de passe',
            //status
            isDisabled:true,
            isRequires_A:false, //utilisé quand on veut toutes les infos de l'utilisateur : active ou désactive Nom et prénom
            isRequired_B:true, //utilsé pour le mot de passe. 
            disabledChange:false,
            isValidMail:false,
            isValidPassword:false,
            //variables utilisateur
            nom:'',
            prenom:'',
            mail:'',
            password:'',
            psw:'password',
            token:'',         
            //divers
            message:'',
            cible:'',
        }
    },
    created:function(){
        if(this.$store.state.page=='connect'){
            this.isMasked='masked';
            this.isRequired_A=false;
            this.cible='/auth/addUser'
        }
        else if(this.$store.state.page=='sign'){
            this.isMasked='';
            this.isRequired_A=true;
            this.cible='/auth/connectUser'
        }
        else if(this.$store.state.page=='forgotten'){
            this.isMasked='masked';
            this.isRequired_B=false;
            this.cible='/auth/connectUser'
        }
        else if(this.$store.state.page=='profile'){
            this.cible='/auth/getUser';
            this.dontShow='masked';
            this.token=this.$store.state.token;
            this.message=this.token
            this.disabledChange=true;
            this.getUser();

        }
    },
    methods:{
        toAccessData(e){
            e.preventDefault()
            this.disabledChange=false;
            this.dontShow='';
            this.masking='masked'
        },
        toForgotten(e){
            e.preventDefault()
            this.$store.state.page='forgotten'
            this.$router.push('/')
        },
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
        //C: for create user
        addUser(e){
            e.preventDefault();
            this.message='';
            this.checkValidAdding()
            if(!this.isValidMail || !this.isValidPassword){
                return this.message='Mail ou mot de passe non validé'
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
                    console.log('add res then',res) 
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
                .catch(function(){
                    $this.message="l'utilisateur existe déjà"
                    $this.$router.push('http://localhost:8000/')
                })
        },
        //R: for getting user and connect
        connectUser(e){
            e.preventDefault();
            this.message='';
            this.checkValidAdding()
            if(!this.isValidMail || !this.isValidPassword){
                return this.message+="/ valeurs d'identification incorrect"
            }

            let form=new FormData()
        
            let $this=this;
            console.log('connectuser', 'name: ',this.mail,' firstname: ',this.password)
            form.append('email',this.mail);
            form.append('password',this.password);
            
            instance.post('/auth/connectUser', form)
                .then(function(res){
                    console.log('instance then', res.data) 
                    if(res.data.code==401 || res.data.code==500){
                        console.log('res connect if ', res);
                        
                        $this.message=res.data.message;
                        $this.$store.state.page='connect';
                        $this.$router.push('/');
                    }
                    else{
                        console.log('res connect else',res.data);
                        $this.$store.state.token=res.data.id;
                        console.log($this.$store.state.token)
                        $this.$store.state.page='connected';
                        $this.$store.state.message='Connecté';
                        $this.$router.push('Connected')
                    }
                })
                .catch(function(error){//ne marche pas ?
                    $this.message='Veuillez remplir tous les champs requis'
                    console.log('erreur log ',error.message)
                    
                    $this.$router.push('http://localhost:8000/')
                })
        },
        resetPassword(e){
            this.message=''
            console.log(this.mail);
            e.preventDefault();
            let checkMail=document.getElementById('email');
            this.checkingMail(checkMail);
            if(this.isValidMail){
                instance.get('/auth/resetPassword',{params:{email:this.mail}})
                .then(res=>{
                    this.message=res.data.message
                    
                    })
                .catch(err=>{
                    console.log('reset catch err',err)
                    console.log(err.message)
                    })
            }
        },
        getUser(){
            let $this=this;
            let userInfo={id:this.$store.state.token}
            instance.get('auth/getUser',{params:userInfo})
            .then(res=>{
                let user=res.data.data[0];
                $this.nom=user.users_name;
                $this.prenom=user.users_firstname;
                $this.mail=user.users_mail,
                localStorage.setItem('user',JSON.stringify(user))
                $this.message='Vos infos. Voulez-vous les modifier ?'
            })
            .catch(err=>console.log(err.message))
        },
    }
}


</script>

<style scoped>
.masked{
    display: none;
}

form{
    min-width: 300px;
    width: 50%;
    margin:auto;
}

.flex{
    margin:auto;
    display: flex;
}

.row{
    flex-direction: row;
    justify-content: space-around;
    height: 40px;
}

.row button{
    width:100px;
}

.row input{
    flex:1;
}

.column{
    flex-direction: column;
    justify-content: flex-start;
}

.column *{
    width: 100%;
}

.button{
    width:50px;
    min-width: 300px;
}

.button * {
    border:1px solid black;
    border-radius:10px;
    margin:1px;
}

.send{
    background: green;
}

.reset{
    background: red;
}

.yellow{
    background: yellow;
}
</style>