<template>
    <div class='admin'>
        <h1>Gestion</h1>
        
<!-- ce que l'on va chercher -->
        <button @click='allUsers'>Chercher un utilisateur</button>
        <button @click='allPub'>Chercher une publication</button>
<!-- la recheche d'utilisateur -->
    <form v-if='this.$store.state.page=="user"' class='user' method="PUT" action='http://localhost:3000/admin/userUpdate'>
        <div>
            <input type="radio" name="userSearching" id="alpha" @click='toAlpha'>Rechercher dans le nom, prénom ou mail
            <input type="radio" name="userSearching" id="status" @click='toStatus'>rechercher par status
        </div>

        <input name="search" id="search" v-model="search">
        <!--
        <input v-if="searchMethod=='alpha'" name="userSearch" id="userSearch" v-model="alphaSearch">
        <input v-if="searchMethod=='status'" name="statusSearch" id="statusSearch" v-model="statusSearch">-->
        <ul v-if="searchMethod=='alpha'" class='searchSmall'>
            <li v-for="user in searchingUserByAlpha" :key='user.users_id'>
                <p><span>Nom : </span> {{ user.users_name }}</p>
                <p><span>Prénom : </span> {{ user.users_firstname }}</p>
                <p><span>Mail : </span> {{ user.users_mail }} </p>
                <p><span>Status : </span> {{ stat(user.users_status) }} </p>
                <p>Option : changer le statut de l'utilisateur
                    <select :name="user.users_id" key="newStatus">
                        <option value="" selected disabled>Sélectionner</option>
                        <option value="0" >Suspendre</option>
                        <option value="1" >Normal</option>
                        <option value="2" >Admin</option>
                    </select>
                </p>
            </li>
        </ul>
        
        <ul v-if="searchMethod=='status'" class='searchSmall'>
            <li v-for="user in searchingUserByStatus" :key='user.users_id'>
                <p><span>Nom : </span> {{ user.users_name }}</p>
                <p><span>Prénom : </span> {{ user.users_firstname }}</p>
                <p><span>Mail : </span> {{ user.users_mail }} </p>
                <p><span>Status : </span> {{ user.users_status }} </p>
                <p>Option : changer le statut de l'utilisateur
                    <select :name="user.users_id" key="newStatus">
                        <option value="" selected disabled>Sélectionner</option>
                        <option value="0" >Suspendre</option>
                        <option value="1" >Normal</option>
                        <option value="2" >Admin</option>
                    </select>
                </p>
            </li>
        </ul>


        <table class='searchMedium'>
            <thead>
                <tr>
                    <th class='blockUser'>Nom</th>
                    <th class='blockUser'>Prénom</th>
                    <th class='blockUser'>Mail</th>
                    <th class='blockUser'>Status</th>
                    <th class='largeBlockUser'>Option : changer le statut de l'utilisateur</th>
                </tr>
            </thead>
            <tbody v-if='this.searchMethod=="alpha"'>
                <tr  v-for="user in searchingUserByAlpha" :key='user.users_id'>
                    <td class='blockUser' :title=user.users_name> {{ user.users_name}}</td>
                    <td class='blockUser' :title=user.users_firstname> {{ user.users_firstname}}</td>
                    <td class='blockUser' :title=user.users_mail> {{ user.users_mail}}</td>
                    <td class='blockUser' > {{ stat(user.users_status) }}</td>
                    <td class='largeBlockUser'>                        
                        <select :name="user.users_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Suspendre</option>
                            <option value="1" >Normal</option>
                            <option value="2" >Admin</option>
                        </select>
                    </td>
                </tr>
            </tbody>
            <tbody v-if='this.searchMethod=="status"'>
                <tr  v-for="user in searchingUserByStatus" :key='user.users_id'>
                    <td class='block' :title=user.users_name> {{ user.users_name}}</td>
                    <td class='block' :title=user.users_firstname> {{ user.users_firstname}}</td>
                    <td class='block' :title=user.users_mail> {{ user.users_mail}}</td>
                    <td class='block' > {{ stat(user.users_status) }}</td>
                    <td class='largeBlock'>                        
                        <select :name="user.users_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Suspendre</option>
                            <option value="1" >Normal</option>
                            <option value="2" >Admin</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click='updateUser'>Mettre à jour les utilisateurs</button>
    </form>
<!-- publications -->
<form v-if='this.$store.state.page=="publication"' class='pub'>
        <div>
            <input type="radio" name="publiSearching" id="alpha" @click='toAlpha'>Rechercher dans le titre, le texte, le nom d'image
            <input type="radio" name="publiSearching" id="author" @click='toAuthor'>rechercher par user id
            <input type="radio" name="publiSearching" id="status" @click='toStatus'>rechercher par status
            
        </div>
            
        <input v-if="searchMethod=='alpha'" name="publiSearch" id="alphaPub" v-model="alphaSearch">
        <input v-if="searchMethod=='author'" name="publiSearch" id="authorPub" v-model="authorSearch">
        <input v-if="searchMethod=='status'" name="publiSearch" id="statusPub" v-model="statusSearch">
        <table>
            <thead>
                <tr>
                    <th class='block'>Titre</th>
                    <th class='block'>Texte</th>
                    <th class='block'>Image</th>
                    <th class='block'>User id</th>
                    <th class='block'>Status</th>
                    <th class='block'>Option</th>
                </tr>
            </thead>
            <tbody v-if='this.searchMethod=="alpha"'>
                <tr  v-for="pub in searchingPubicationByAlpha" :key='pub.publications_id'>
                    <td class='block' :title=pub.publications_title> {{ pub.publications_title }}</td>
                    <td class='block' :title=pub.publications_texte> {{ pub.publications_texte }}</td>
                    <td class='block' :title=pub.publications_image> {{ pub.publications_image }}</td>
                    <td class='block' :title=pub.publications_author> {{ pub.publications_author }}</td>
                    <td class='block' > {{ pub.publications_status}}</td>
                    <td class='block'></td>
                </tr>
            </tbody>
            <tbody v-if='this.searchMethod=="status"'>
                <tr  v-for="pub in searchingPublicationByStatus" :key='pub.publications_id'>
                    <td class='block' :title=pub.publications_title> {{ pub.publications_title }}</td>
                    <td class='block' :title=pub.publications_texte> {{ pub.publications_texte }}</td>
                    <td class='block' :title=pub.publications_image> {{ pub.publications_image }}</td>
                    <td class='block' :title=pub.publications_author> {{ pub.publications_author }}</td>
                    <td class='block' > {{ pub.publications_status}}</td>
                    <td class='block'></td>
                </tr>
            </tbody>
        <tbody v-if='this.searchMethod=="author"'>
                <tr  v-for="pub in searchingPublicationByAuthor" :key='pub.publications_id'>
                    <td class='block' :title=pub.publications_title> {{ pub.publications_title }}</td>
                    <td class='block' :title=pub.publications_texte> {{ pub.publications_texte }}</td>
                    <td class='block' :title=pub.publications_image> {{ pub.publications_image }}</td>
                    <td class='block' :title=pub.publications_author> {{ pub.publications_author }}</td>
                    <td class='block' > {{ pub.publications_status}}</td>
                    <td class='block'></td>
                </tr>
            </tbody>
        </table>
    </form>

    </div>
</template>

<script>/*
import User from '../components/User.vue'
import Publication from '../components/Publication.vue'
import Comment from '../components/Comment.vue'
*/
const defaultUrl='http://localhost:3000/api/admin';
const axios=require('axios');
const instance =axios.create({ baseURL:defaultUrl});
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
            alt:['Suspendu','Normal','Administrateur']
        }
        
    },/*
    components:{
        User, 
        Publication, 
        Comment
    },*/
    created:function(){
        
        console.log(this.listed)
    },
    computed:{
        
    //for user
        searchingUserByAlpha(){
            let alphaSearch=this.search;
            console.log(this.searchMethod)
            if(alphaSearch==''){
                return this.listed;
            }
            else{
                return this.listed.filter(personne =>{return personne.users_firstname.toLowerCase().match(alphaSearch.toLowerCase()) !==null || personne.users_name.toLowerCase().match(alphaSearch.toLowerCase()) !==null || personne.users_mail.toLowerCase().match(alphaSearch.toLowerCase()) !==null;})
            }
        },
        searchingUserByStatus(){
            let statusSearch=this.search;
            console.log(this.searchMethod)
            if(statusSearch==''){
                return this.listed
            }
            else{
                return this.listed.filter(personne =>{return personne.users_status==statusSearch;})
            }
        },
    //for publications
        searchingPubicationByAlpha(){
            console.log(this.searchMethod)
            if(this.alphaSearch==''){
                return this.listed;
            }
            else{
                return this.listed.filter(pub =>{return pub.publications_title
            .toLowerCase().match(this.alphaSearch.toLowerCase()) !==null || pub.publications_texte.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null || pub.publications_image.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null;})
            }
        },
        searchingPublicationByStatus(){
            console.log(this.searchMethod)
            if(this.statusSearch==''){
                return this.listed
            }
            else{
                return this.listed.filter(pub =>{return pub.publications_status==this.statusSearch;})
            }
        },
        searchingPublicationByAuthor(){
            console.log(this.searchMethod)
            if(this.authorSearch==''){
                return this.listed
            }
            else{
                return this.listed.filter(pub =>{return pub.publications_author==this.authorSearch;})
            }
        },
    },
    methods:{
    //type de recherche
        toAlpha(){
            this.searchMethod='alpha';
        },
        toStatus(){
            this.searchMethod='status'
        },
        toAuthor(){
            this.searchMethod='author'
        },
    //remplacement du type de status
        stat(value){
            if(value>=0 && value<=2){
                return this.alt[value]
            }
            return 'anomalie'
        },
    //récupération des users
        allUsers(){
            this.searched='users';
            let $this=this

            this.$store.dispatch('getAllUsers')
            .then(res=>{
                
                $this.$store.state.page='user';
                $this.$router.push('Admin');
                $this.listed=this.$store.state.administredList  
                console.log('admin all user post dispatch then',res,' page ',$this.$store.state.page,' list ',$this.listed)
            })
            .catch(err=>console.log(err))
        },
        allPub(){
            this.searched='publications';
            let $this=this

            this.$store.dispatch('getAllPubs')
            .then(res=>{
                
                $this.$store.state.page='publication';
                $this.$router.push('Admin'); 
                $this.listed=this.$store.state.administredList
                console.log('admin all pub post dispatch then',res,' page ',$this.$store.state.page,' list ',$this.listed) 
            })
            .catch(err=>console.log(err))
        },
        updateUser(e){
            e.preventDefault();
            let $this=this;
            let list=document.getElementsByTagName('select');
            let listed=[];
            
            console.log(list);
            for(let i=0;i<list.length;i++){
                let opt={};    
                
                opt.name=list[i].name;
                opt.value=list[i].value
                listed.push(opt)
                console.log('longueur: ',list.length,' indice: ',i,' nom: ',list[i].name, ' valeur: ',list[i].value,' objet: ',opt,'liste agrégée :',listed)
            }
    
            instance.put('/userUpdate',{users:listed},{headers:{'Authorization': `bearer ${this.$store.state.token}`}})
            .then(res=>{
                console.log(res)
                $this.$store.state.page='connected';
                $this.$router.push('Connected');
            })
            .catch(err=>{
                console.log(err)
            })
        },
        updatePublication(e){
            e.preventDefault();
            let $this=this;
            let list=document.getElementsByTagName('select');
            let listed=[];
            
            console.log(list);
            for(let i=0;i<list.length;i++){
                let opt={};    
                
                opt.name=list[i].name;
                opt.value=list[i].value
                listed.push(opt)
                console.log('longueur: ',list.length,' indice: ',i,' nom: ',list[i].name, ' valeur: ',list[i].value,' objet: ',opt,'liste agrégée :',listed)
            }
    
            instance.put('/userUpdate',{users:listed},{headers:{'Authorization': `bearer ${this.$store.state.token}`}})
            .then(res=>{
                console.log(res)
                $this.$store.state.page='connected';
                $this.$router.push('Connected');
            })
            .catch(err=>{
                console.log(err)
            })
        }
           
    }
    

}
</script>

<style scoped>
.admin{
    width: 300px;
    margin: auto;
    background: yellow;
}

.admin div{
    width: 100%;
}

ul, li{
    margin:0;
    padding: 0;
}

li{
    list-style: none;
}



tr{
    
    margin:5px 0;
    background: grey;
}

td{
    height:20px;
    background: purple;
    overflow:auto;
    text-overflow:inherit;
}

.user{
    background: green;
}

.user td{
    background: white;
}

span{
    background: grey;
}


@media screen and (max-width: 680px) {
    .searchSmall{
        background: aqua;
    }
    
    .searchSmall li{
        width:300px;
        margin: 5px 0;
        background: wheat;
        text-align: justify;
    }

    .searchSmall li p{
        width: 100%;
    }

    .searchSmall li span{
        display: inline-block;
        width:80px;
    }

    .searchMedium{
        display: none;
    }
}

@media screen and (min-width: 681px) {
    .admin{
        width:600px;
        margin: auto;
    }
    .searchSmall{
        display: none;
    }

    .searchMedium{
        background: silver;
        width: 100%;
    }

    
    .blockUser,.largeBlockUser{
        display: inline-block;
        box-sizing: border-box;
        word-wrap: break-word;
    }

    .blockUser{
        width:15%;
    }
    .largeBlockUser{
        width:40%
    }
}
</style>
