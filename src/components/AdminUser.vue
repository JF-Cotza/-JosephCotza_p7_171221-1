<template>
    <form v-if='this.$store.state.page=="user"' class='user'>
<!-- les options de recherche -->
    <fieldset class='userButton'> 
        <legend>Comment voulez vous chercher ?</legend>
        <label for="alpha">
            <input type="radio" name="userSearching" id="alpha" @click='toAlpha'>Rechercher dans le nom, prénom ou mail
        </label>
        <label for="toId">
            <input type="radio" name="userSearching" id="toId" @click='toId'>Rechercher par son id
        </label>
        <label for="status">
            <input type="radio" name="userSearching" id="status" @click='toStatus'>Rechercher par status
        </label>
    </fieldset>
        
<!-- zone de recherche -->
        <label for="search"> Votre recherche
            <input name="search" id="search" v-model="search">
        </label>
<!-- les résultats -->
        <ul class='searchSmall'>
            <li v-for="user in resultSearch()" :key='user.users_id' class='userGrid'>
                <div class='userOneOne'>    <span>Nom :                         </span></div>
                <div class='userOneTwo'>    <span>{{ user.users_name }}         </span></div>
                <div class='userTwoOne'>    <span>Prénom :                      </span></div>
                <div class='userTwoTwo'>    <span>{{ user.users_firstname }}    </span></div>
                <div class='userThreeOne'>  <span>Mail :                        </span></div>
                <div class='userThreeTwo'>  <span>{{ user.users_mail }}         </span></div>
                <div class='userFourOne'>   <span>Id :                          </span></div>
                <div class='userFourTwo'>   <span>{{ user.users_id }}           </span></div>
                <div class='userFiveOne'>   <span>Status :                      </span></div>
                <div class='userFiveTwo'>   <span>{{ stat(user.users_status) }} </span></div>
                <div class='userSixOne'>    <span>Changer le statut en :        </span></div>
                <div class='userSixTwo'>le nouveau status
                    <select :name="user.users_id" id="smallNewStatus" >
                        <option value="" selected disabled>Sélectionner</option>
                        <option value="0" >Suspendre</option>
                        <option value="1" >Normal</option>
                        <option value="2" >Admin</option>
                    </select>
                </div>
            
            </li>
        </ul>
        <table class='searchMedium'>
            <thead>
                <tr>
                    <th class='blockUser'>Nom</th>
                    <th class='blockUser'>Prénom</th>
                    <th class='blockUser'>Mail</th>
                    <th class='blockUser'>Id</th>
                    <th class='blockUser'>Status</th>
                    <th class='largeBlockUser'>Option : changer le statut de l'utilisateur</th>
                </tr>
            </thead>
            <tbody>
                <tr  v-for="user in resultSearch()" :key='user.users_id'>
                    <td class='blockUser' :title='"son nom : "+user.users_name'> {{ user.users_name}}</td>
                    <td class='blockUser' :title='"son prénom : "+user.users_firstname'> {{ user.users_firstname}}</td>
                    <td class='blockUser' :title='"son email :"+user.users_mail'> {{ user.users_mail}}</td>
                    <td class='blockUser' :title='"son id : "+user.users_id'> {{ user.users_id}}</td>
                    <td class='blockUser' > {{ stat(user.users_status) }}</td>
                    <td class='largeBlockUser' title="Quel nouveau status ?">                    
                        <select :name="user.users_id" key="newStatus" id='newStatus'>
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
</template>

<script>
const axios=require('axios');

export default {
    name:'AdminUser',
    data(){
        return{
            searchMethod:'',
            search:'',
            listed:{},
            alt:['Suspendu','Normal','Administrateur']
        }
    },
    created:function(){
        this.listed=this.$store.state.administredList
    },
    computed:{
        //for user
        searchingUserByAlpha(){
            let alphaSearch=this.search;
            console.log(this.searchMethod, alphaSearch)
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
        searchingUserById(){
            let statusSearch=this.search;
            console.log(this.searchMethod)
            if(statusSearch==''){
                return this.listed
            }
            else{
                return this.listed.filter(personne =>{return personne.users_id==statusSearch;})
            }
        },
    },
    methods:{
        //remplacement du type de status
        stat(value){
            if(value>=0 && value<=2){
                return this.alt[value]
            }
            return 'anomalie'
        },
        //les recherches
        toAlpha(){
            this.searchMethod='alpha';
        },
        toStatus(){
            this.searchMethod='status'
        },
        toId(){
            this.searchMethod='id'
        },
        resultSearch(){
            if(this.searchMethod=='alpha'){
                return this.searchingUserByAlpha
            }
            if(this.searchMethod=='status'){
                return this.searchingUserByStatus
            }
            if(this.searchMethod=='id'){
                return this.searchingUserById
            }
        },//mise à jour du status des utilisateurs
        updateUser(e){
            e.preventDefault();
            let $this=this;
            let list=document.getElementsByTagName('select');
            let listed=[];
            
            //console.log(list);
            for(let i=0;i<list.length;i++){
                let opt={};    
                
                opt.name=list[i].name;
                opt.value=list[i].value
                listed.push(opt)
                //console.log('longueur: ',list.length,' indice: ',i,' nom: ',list[i].name, ' valeur: ',list[i].value,' objet: ',opt,'liste agrégée :',listed)
            }
    
            this.$store.state.wait=true;
            setTimeout(()=>(this.$store.state.wait=false),this.$store.state.time)
            axios.put(this.$store.state.url+'/admin/userUpdate',{users:listed},{headers:{'Authorization': `bearer ${this.$store.state.token}`}})
            .then(res=>{
                $this.$store.state.wait=false;
                console.log(res)
                $this.$store.state.page='connected';
                $this.$router.push('Connected');
            })
            .catch(err=>{
                console.log(err)
            })
        },//fin update user    
    }
}
</script>

<style>
th{
    background: #9C9C9C;
    color:black;
}

.masked{
    display: none;
}

.userButton{
    display: flex;
    margin:auto;
    flex-direction: column;
    justify-content: center;
    border-radius:20px;
}

.userButton label{
    width:90%;
    background: white;
    text-align: left;
    border-radius:10px;
    border:1px solid black;
    padding: 2px 0;
    margin:2px 0;       
}

.userButton span:hover{
    width:90%;
    background: lightblue;       
}

@media screen and (max-width: 680px) {
    .userButton{
        width: 300px;
    }

    .searchSmall{
        width: 300px;
    }

    .searchMedium{
        display: none;
    }

    .userGrid{
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: repeat(6,60px);
        grid-gap: 2px;
        border:1px solid black;
        border-radius: 20px;
        margin:5px auto;
        padding: 5px 0;
        background: lightblue;
    }

    .userOneOne, .userTwoOne, .userThreeOne, .userFourOne, .userFiveOne, .userSixOne{
        background: #9C9C9C;
        margin-left:5px;
        color:black;
    }

    .userOneTwo, .userTwoTwo, .userThreeTwo, .userFourTwo, .userFiveTwo, .userSixTwo{
        background: lightgreen;
        margin-right:5px;
        
    }

    .userOneOne, .userTwoOne, .userThreeOne, .userFourOne, .userFiveOne, .userSixOne, 
    .userOneTwo, .userTwoTwo, .userThreeTwo, .userFourTwo, .userFiveTwo, .userSixTwo{
        height: 60px;
        display: flex;
        align-items: center;
        padding-left: 5px;
    }

    .userOneOne{
        grid-column: 1/2;
        grid-row:1/2;
        border-radius:20px 0 0 0;
    }

    .userTwoOne{
        grid-column: 1/2;
        grid-row:2/3;
    }

    .userThreeOne{
        grid-column: 1/2;
        grid-row:3/4;
    }

    .userFourOne{
        grid-column: 1/2;
        grid-row:4/5;
    }

    .userFiveOne{
        grid-column: 1/2;
        grid-row:5/6;
    }

    .userSixOne{
        grid-column: 1/2;
        grid-row:6/7;
        border-radius:0 0 0 20px;
    }

    .userOneTwo{
        grid-column: 2/3;
        grid-row:1/2;
        border-radius:0 20px 0 0;
    }

    .userTwoTwo{
        grid-column: 2/3;
        grid-row:2/3
    }

    .userThreeTwo{
        grid-column: 2/3;
        grid-row:3/4;
    }

    .userFourTwo{
        grid-column: 2/3;
        grid-row:4/5;
    }

    .userFiveTwo{
        grid-column: 2/3;
        grid-row:5/6;
    }

    .userSixTwo{
        grid-column: 2/3;
        grid-row:6/7;
        border-radius:0 0 20px 0;
    }
}

@media screen and (min-width: 681px) {
    .userButton{
        width: 600px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .searchSmall, .searchSmall *{
        display: none;        
    }

    .searchMedium{
        width: 600px;
    }

    .blockUser{
        width: 12%;
    }

    .largeBlockUser{
        width:28%;
    }
}
</style>