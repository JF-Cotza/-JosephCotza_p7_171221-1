<template>
    <div class='admin'>
        <h1>Gestion</h1>
        <h2>{{ what }}</h2>        
<!-- ce que l'on va chercher -->
        <fieldset id='lookingFor'>
            <legend >Elements recherchés</legend>
                <button @click='allUsers' class=''    searchKey='users'>Chercher un utilisateur</button>
                <button @click='allPub' class=''      searchKey='publications'>Chercher une publication</button>
                <button @click='allComments' class='' searchKey='comments'>Chercher un commentaire</button>
        </fieldset>
<!-- la recheche d'utilisateur -->
    <div v-if='this.$store.state.page=="user"' >
        <AdminUser />
    </div>
<!-- publications -->
    <div v-if='this.$store.state.page=="publication"' >
        <AdminPublication />
    </div>
    
<!-- commentaires -->
        <div v-if='this.$store.state.page=="comments"' >
            <AdminComment />
        </div>
    </div>
</template>

<script>
import AdminComment from '../components/AdminComment.vue';
import AdminPublication from '../components/AdminPublication.vue';
import AdminUser from '../components/AdminUser.vue';

export default {
  
    name:'Admin',
    data(){
        return{
            search:'',

            searched:'',
            searchMethod:'',
            alphaSearch:'',
            statusSearch:'',
            authorSearch:'',

            recherche:'',
            listed:{},
        }
        
    },
    components:{
        AdminComment,
        AdminPublication,
        AdminUser
    },
    created:function(){  
        console.log(this.listed)
    },
    computed:{
        what(){
            switch (this.$store.state.page){
                case "user":
                    return "D'utilisateurs";
                case "publication":
                    return "De publications";
                case "comments" :
                    return "De commentaires";
                default:
                    return "Choisir l'élément recherché";
                }
        }
    },
    methods:{
        selectingClass(){ 
            let buttons=document.querySelectorAll('#lookingFor button');
            console.log('SC',buttons)
            for(let i=0; i<buttons.length;i++){
                buttons[i].classList.remove('selected')
                console.log('SC',buttons[i].getAttribute('searchKey'));
                if(buttons[i].getAttribute('searchKey')==this.searched){
                    console.log(this.searched)
                    buttons[i].classList.add('selected')
                }
                else{
                    console.log('SC')
                }
            }
            
        },

    //récupération des users
        allUsers(){
            this.searched='users';
            this.selectingClass();
            let $this=this
            this.$store.dispatch('getAllUsers')
            .then(()=>{                
                $this.$store.state.page='user';
                $this.$router.push('Admin');  
            })
            .catch(err=>console.log(err))
        },
    //récupération des publications
        allPub(){
            this.searched='publications';
            this.selectingClass();
            let $this=this;

            this.$store.dispatch('getAllPubs')
            .then(()=>{
                $this.$store.state.page='publication';
                $this.$router.push('Admin');    
            })
            .catch(err=>console.log(err))
        },
        //récupération des commentaires
        allComments(){
            this.searched='comments';
            this.selectingClass();
            let $this=this;

            this.$store.dispatch('getAllComments')
            .then(()=>{
                $this.$store.state.page='comments';
                $this.$router.push('Admin');
            })
            .catch(err=>console.log(err))
        },//fin get all comments
    }
}
</script>

<style scoped>
#lookingFor .selected{
    color:white;
    background: black;
    font-weight: bold;
}

@media screen and (max-width: 680px) {
    .admin{
        width:300px;
        margin:auto;
    }
}

@media screen and (min-width: 681px) {
    .admin{
        width:600px;
        margin:auto;
    }
}
</style>
