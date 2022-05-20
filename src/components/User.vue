<template>
    <div class='containing'>
        {{ message }}
        <form :action="defaultUrl+cible" method="POST" enctype="multipart/form-data" class='flex column'>
        <!-- nom et prénom visible lors de la création et lorsque l'on est connecté sur le profile -->
            <label for="name" v-if="this.$store.state.page=='sign'" aria-label='saisissez votre nom de famille'>Votre Nom :</label>
            <label for="name" v-if="this.$store.state.page=='profile'">Votre Nom :</label>
                <input v-if="this.$store.state.page=='profile' || this.$store.state.page=='sign'" type="text" name="name" id="name" v-model='nom' placeholder="Votre nom" :required='isRequired_A' :disabled='disabledChange'>
            <label for="firstname" v-if="this.$store.state.page=='sign'" aria-label='saisissez votre prénom'>Votre Prénom</label>
            <label for="firstname" v-if="this.$store.state.page=='profile'">Votre Prénom :</label>
                <input v-if="this.$store.state.page=='sign' || this.$store.state.page=='profile'" type="text" name="firstname" id="firstname" v-model='prenom' :class='isMasked' placeholder="Votre prénom" :required='isRequired_A' :disabled='disabledChange'>
        <!-- email toujours visible et requis -->
            <label for="email" v-if="this.$store.state.page=='profile'" aria-label='votre adresse mail'>Votre mail :</label>
            <label for="email" v-if="this.$store.state.page=='connect'" aria-label='saisissez votre adresse mail'>Votre mail :</label>
            <label for="email" v-if="this.$store.state.page=='sign'" aria-label='saisissez une adresse mail qui servira a vous identifier'>Votre mail :</label>
                <input type="email" name="email" id="email" v-model='mail' placeholder="Votre mail" title='Votre mail servira à vous identifier' :rules='validMail' required :disabled='disabledChange'>
        <!-- mot de passe masqué sur l'affichage du profil mais non modification -->
            <div :class='maskPassword'>
                <label for="password" v-if="this.$store.state.page=='profile'" >Votre nouveau mot de passe </label>
                <label for="password" v-if="this.$store.state.page=='connect'" aria-label='saisissez votre mot de passe'>Le mot de passe</label>
                <label for="password" v-if="this.$store.state.page=='sign'" aria-label='créer un mot de passe'>Le mot de passe</label>
                    <input  v-on:keyup='placeholding' :type="psw" name="password" id="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[é è_çà=$ù!:;,?./§%µ£°@+]).{8,}" v-model='password' :title=pswForm placeholder='le mot de passe'>
                    <span :class='placeholder'>{{ pswForm }}</span>
                    <button @click='switching'>{{see}}</button>
            </div>
            <div :class='textPassword' >
                <p class='align'>Si vous ne saisissez pas de nouveau mot de passe, la valeur ne sera pas modifiée</p>
                <p class='align'>Après modification, vous serez déconnecté pour raison de sécurité. Vous devrez donc vous reconnecter</p>
                <div class='button flex row'>
                    <button class='send' @click='sendingModification'>Valider</button>
                    <button class='reset' @click="resetProfile">Annuler</button>
                </div>
            </div>
        <!-- les bouton de formulaire -->
            <div class='button flex row'>
            <!-- unconnected -->
                <button class='send' v-if="this.$store.state.page=='connect'" type="submit" @click='toConnectUser'>Envoyer</button>
                <button class='send' v-if="this.$store.state.page=='sign'" type="submit" @click='addUser'>Envoyer</button>
            <!-- connected -->
                <button class='send' v-if="this.$store.state.page=='profile'" @click='toAccessData' :class='masking'>Oui</button>
                <button class='send' v-if="this.$store.state.page=='profile'" :class='maskModifyButton'>Modifier</button>
                <button class='danger' v-if="this.$store.state.page=='profile'" @click='suppressProfile' :class='masking'>Supprimer mon profil</button>
            <!-- global -->
                <button class='reset' :class='masking' type="reset" @click='backHome'>Annuler</button>
            </div>
        </form>
    </div>
</template>

<script>
import FormData from 'form-data';
const axios=require('axios');
  

export default {
    name:'User',
    emits:['emitNom','prenom','mail','password'],        
    data(){
        return{
            //pour masquer / révéler des élément
            isMasked:'',            //nom et prénom lors du log
            maskPassword:'',
            maskModifyButton:'masked',
            see:'Voir le mot de passe',
            textPassword:'masked',
            placeholder:'',

            //status
            isDisabled:true,
            isRequires_A:false, //utilisé quand on veut toutes les infos de l'utilisateur : active ou désactive Nom et prénom
            isRequired_B:true, //utilsé pour le mot de passe. 
            disabledChange:false,
            isValidMail:false,
            isValidPassword:false,
            //variables utilisateur
            user:'',
            
            nom:'',
            prenom:'',
            mail:'',
            password:'',
            psw:'password',
            token:'',         
            //divers
            message:'',
            cible:'',
            pswForm:"Saisissez le mot de passe. Il doit contenir au moins 8 caractéres, 1 majuscule, 1 minuscule,1 chiffre, 1 caractére spécial parmi: é è_çà=$ù!:;,?./§%µ£°@+ ",
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
        else if(this.$store.state.page=='profile'){
            this.user=this.$store.state.profileUser;
            console.log('User created', this.user)

            this.cible='/auth/getUser';
            this.maskPassword='masked';
            this.token=this.$store.state.token;
            this.message=this.token
            this.disabledChange=true;            
            
            console.log('user profile',this.user)
            this.nom=this.user.users_name;
            this.prenom=this.user.users_firstname;
            this.mail=this.user.users_mail,
            
            this.message='Vos infos. Voulez-vous les modifier ?'
            localStorage.setItem('user',JSON.stringify(this.user))

        }
    },
    methods:{
    //global
        //afficher / masquer le mot de passe
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
        //vérifier si le mot de passe obéi au pattern
        checkingPassword(tocheck){
            if(tocheck.validity.patternMismatch){
                this.isValidPassword=false;
                this.message+=`/ format de mot de passe erroné `
            }
            else{
                this.isValidPassword=true;
            }
        },
        //vérifier si on a bien saisi une adresse mail
        checkingMail(tocheck){
            if(tocheck.validity.typeMismatch){
                this.isValidMail=false;
                this.message+=`/ adresse mail non valide `
            }
            else{
                this.isValidMail=true
            }
        },
        //pour lancer les vérification en cas d'enregistrement
        checkValidAdding(){
            this.message='';
            let checkMail=document.getElementById('email')
            let checkPassword=document.getElementById('password')
            this.checkingPassword(checkPassword)
            this.checkingMail(checkMail)
            
        },
    //unconnected
        //C-A: for create user
        addUser(e){
            e.preventDefault();
            let $this=this;
            this.message='';
            this.checkValidAdding()
            if(!this.isValidMail || !this.isValidPassword){
                return this.message='Mail ou mot de passe non validé'
            }

            let form=new FormData();
            
            console.log('adduser', 'name: ',this.nom,' firstname: ',this.prenom)
            
            form.append('name',this.nom);
            form.append('firstname',this.prenom);
            form.append('email',this.mail);
            form.append('password',this.password);
            
            this.$store.state.wait=true;
            setTimeout(()=>(this.$store.state.wait=false),this.$store.state.time);
            let instance= axios.create({ baseURL:this.$store.state.url});
            instance.post('/auth/addUser', form)
                .then(function(res){
                    $this.$store.state.wait=false;
                    console.log('add res then',res) 
                    $this.message+='ajouté'
                    $this.connectUser();
                })
                .catch(function(){
                    $this.message="l'utilisateur existe déjà"
                    $this.$router.push('/')
                })
        },
        //R-C: for getting user and connect
        toConnectUser(e){
            e.preventDefault();
            this.connectUser();
        },
        connectUser(){
            let $this=this;
            this.message='';
            this.checkValidAdding()
            if(!this.isValidMail || !this.isValidPassword){
                return this.message+="/ valeurs d'identification incorrect"
            }

            let form=new FormData()
        
            console.log('connectuser', 'name: ',this.mail,' firstname: ',this.password)
            form.append('email',this.mail);
            form.append('password',this.password);
            
            this.$store.state.wait=true;
            setTimeout(()=>(this.$store.state.wait=false),this.$store.state.time)
            let instance= axios.create({ baseURL:this.$store.state.url});
            instance.post('/auth/connectUser', form)
                .then(function(res){
                    $this.$store.state.wait=false;
                    console.log('status',res.data.authorStatus.users_status)
                    $this.$store.state.authorStatus=res.data.authorStatus.users_status;
                    if(res.data.authorStatus.users_status!=0){
                        $this.$store.state.token=res.data.id;
                        $this.$store.state.author=res.data.author;
                        sessionStorage.setItem('token',JSON.stringify({id:res.data.id,authorStatus:res.data.authorStatus.users_status, author:res.data.author}))
                        $this.$store.state.authorStatus=res.data.authorStatus.users_status;
                        console.log('connectuser ',res.data)
                        console.log($this.$store.state.token,' ',res.data.message)

                        $this.$store.state.page='connected';
                        $this.$store.state.message+='Connecté';
                        $this.$router.push('Connected')
                    }
                    else{    
                        $this.message+='Votre compte a été suspendu. Contactez un administrateur pour plus de détails'
                        return $this.message
                    }
                })
                .catch(function(error){
                    $this.message='Accés refusé'
                    if($this.$store.state.authorStatus==0){
                        $this.message+='votre compte a été suspendu contacté un administrateur pour plus de détails'
                    }
                                        
                    console.log('erreur log ',error.message, $this.message)
                    $this.$router.push('http://localhost:8000/')
                })
        },
    //connected
        backHome(e){
            e.preventDefault();
            this.$store.dispatch('getPublication');
            this.$store.state.page='connected';
            this.$router.push('Connected');
        },
        //U-R: reset du profil
        resetProfile(e){
            e.preventDefault();
            let user=JSON.parse(localStorage.getItem('user'));
            console.log('reset',user,'name',user.users_name)
            this.nom=user.users_name;
            this.prenom=user.users_firstname;
            this.mail=user.users_mail;
            this.password='';
            localStorage.removeItem('user');
            this.$store.dispatch('getPublication')
            this.$store.state.page='connected';
            this.$router.push('Connected')
        },
        //D: supprimer le profil
        suppressProfile(e){
            e.preventDefault();
            console.log('userVue suppressProfile')
            let $this=this;
            
            this.$store.state.wait=true;
            setTimeout(()=>(this.$store.state.wait=false),this.$store.state.time);
            let instance= axios.create({ baseURL:this.$store.state.url});
            instance.delete('/auth/suppressMyProfile', {headers: {'Authorization': `bearer ${this.token}`}})
            .then(res=>{
                console.log(res)
                $this.$store.state.wait=false;
                $this.message='suppress then'
                this.$store.dispatch('deconnection');
                this.$router.push({name:'Home'});
            })
            .catch(err=>console.log(err.message))
        },
        toAccessData(e){
            e.preventDefault()
            this.disabledChange=false;
            this.maskPassword='';
            this.masking='masked';
            this.password='';
            this.textPassword='';            
        },
        sendingModification(e){
            e.preventDefault()
            let $this=this;
            let form=new FormData();
            form.append('name',this.nom);
            form.append('firstname',this.prenom);
            this.checkValidAdding();//on vérifie le mail et le mot de passe
            console.log('name',this.nom,'firstname',this.prenom,'email',this.mail,'password',this.password,'localStorage',JSON.parse(localStorage.getItem('user')))
            
            //validation du mail
            if(!this.isValidMail){    //la saisie n'est pas un email
                return
            }
            else{                     //la saisie est valide
                form.append('email',this.mail)
            }

            //validation du mot de passe
            if(this.password.length!=0){    //le mot de passe n'est pas nul et doit donc être changé
                if(!this.isValidPassword){          //le mot de passe ne respecte pas le pattern
                    return
                }
                else{                               //le mot de passe respecte le pattern
                    form.append('psw',this.password)
                }
            }
            else{                           //le mot de passe est nul et ne doit ponc pas être changé
                form.append('psw','')       //on vérifiera la valeur dans le backend.
            }

            this.$store.state.wait=true;
            setTimeout(()=>(this.$store.state.wait=false),this.$store.state.time);
            let instance= axios.create({ baseURL:this.$store.state.url});
            instance.put('/auth/updateUser', form,{headers: {'Authorization': `bearer ${this.$store.state.token}`}})
            .then(res=>{
                $this.$store.state.wait=false;
                $this.$store.dispatch('deconnection');
                console.log(res)
            })    
            .catch(err=>{console.log(err)})
        },
        placeholding(){
            if(this.password.length==0){
                this.placeholder=''
            }
            else{
                this.placeholder='masked'
            }
        }
    }
}


</script>

<style scoped>
.containg{
    width:300px;
    margin:auto;
}

.psw{
    height: 80px;
}

form{
    width:100%;
    max-width: 300px;
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
    width: 300px;
    margin:auto;
    position:relative
}

.button * {
    border:1px solid black;
    border-radius:10px;
    margin:1px;
}

.align{
    text-align: left;
}

</style>