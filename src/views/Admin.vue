<template>
    <div class='admin'>
        <h1>Gestion</h1>
        
<!-- ce que l'on va chercher -->
        <button @click='allUsers'>Chercher un utilisateur</button>
        <button @click='allPub'>Chercher une publication</button>
        <button @click='allComments'>Chercher un commentaire</button>
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

//const defaultUrl='http://localhost:3000/api/admin';
//const axios=require('axios');
//const instance =axios.create({ baseURL:defaultUrl});
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
    methods:{
    
    //récupération des users
        allUsers(){
            this.searched='users';
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
