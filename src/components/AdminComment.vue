<template>
    <form>
        <!-- paramètres de recherche -->
        <fieldset>
            <legend>Comment voulez vous chercher ?</legend>
            <label for="alpha">            
                <input type="radio" name="commentSearching" id="alpha" @click='toAlpha'>Rechercher dans le texte, le nom, le prénom l'utilisateur
            </label>
            <label for="idSearch">     
                <input type="radio" name="commentSearching" id="idSearch" @click='toId'>Rechercher par comment id
            </label>
            <label for="author">     
                <input type="radio" name="commentSearching" id="author" @click='toAuthor'>Rechercher par user id
            </label>
            <label for="publication">     
                <input type="radio" name="commentSearching" id="publication" @click='toPublication'>Rechercher par publication id
            </label>
            <label for="status">     
                <input type="radio" name="commentSearching" id="status" @click='toStatus'>Rechercher par status
            </label>
        </fieldset>
          
        <label for="alphaComments" v-if="searchMethod!='status'">Recherche
            <input v-if="searchMethod=='alpha'" name="commentSearch" id="alphaComments" v-model="alphaSearch" aria-label='recherche de texte'>
            <input v-if="searchMethod=='author' || searchMethod=='publication' || searchMethod=='id'" name="commentSearch" id="authorComments" v-model="authorSearch" :aria-label=aria>
        </label>

        <label for="statusSearch">Recherche par status
            <select v-if="searchMethod=='status'" v-model="statusSearch" id='statusSearch'>
                <option value="" selected disabled>Sélectionner</option>
                <option value="0" >Modérée</option>
                <option value="1" >Normal</option>
                <!--<option value="2" >Epinglée</option>-->
            </select>
        </label>
    <!-- résultat -->
    
        <div class='searchSmall'>
            <div v-for="com in resultSearch()" :key='com.comments_id' class='comment'> 
                <div class='grilleId'>
                    <div class='IdCellOneOne'>Comment Id</div>
                    <div class='IdCellOneTwo'>Publication Id</div>
                    <div class='IdCellOneThree'>User Id</div>
                    <div class='IdCellTwoOne'>{{ com.comments_id }}</div>
                    <div class='IdCellTwoTwo'>{{ com.comments_publication }}</div>
                    <div class='IdCellTwoThree'>{{ com.comments_author }}</div>
                </div>
                <p title="texte du commentaire"> {{ com.comments_texte }}</p>
                <div class='grilleStatus'>
                    <div class='statusOneOne'>Status actuel</div>
                    <div class='statusOneTwo'>Changer le statut</div>
                    <div class='statusTwoOne'>{{ com.comments_status}}</div>
                    <div class='statusTwoTwo' title='Quel nouveau status ?'>
                        <select :id="com.comments_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Masquer</option>
                            <option value="1" >Normal</option>
                            <!--<option value="2" >Epingler</option>-->
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <table class='searchMedium'>
            <thead>
                <tr>
                    <th class='commentBlock'>Id</th>
                    <th class='commentBlock'>Texte</th>
                    <th class='commentBlock'>Publication</th>
                    <th class='commentBlock'>Auteur</th>
                    <th class='commentBlock'>User id</th>
                    <th class='commentBlock'>Status</th>
                    <th class='LargeCommentBlock'>Option</th>
                </tr>
            </thead>
            <tbody>
                <tr  v-for="com in resultSearch()" :key='com.comments_id'>
                    <td class='commentBlock' :title='"id du commentaire : "+com.comments_id'> {{ com.comments_id }}</td>
                    <td class='commentBlock' :title='"texte:"+com.comments_texte'> {{ com.comments_texte }}</td>
                    <td class='commentBlock' :title='"id de la publication : "+com.comments_publication'> {{ com.comments_publication }}</td>
                    <td class='commentBlock' :title="'auteur : '+com.users_name+' '+com.users_firstname"> {{ com.users_name+' '+com.users_firstname }}</td>
                    <td class='commentBlock' :title='"auteur id : "+com.comments_author'> {{ com.comments_author }}</td>
                    <td class='commentBlock' :title='"status actuel : "+com.comments_status'> {{ com.comments_status }}</td>
                    <td class='largeCommentBlock' title='Quel nouveau status ?'>
                        <select :id="com.comments_id" key="newStatus" >
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Masquer</option>
                            <option value="1" >Normal</option>
                            <!--<option value="2" >Epingler</option>-->
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
        
        <button @click='updateComments'>Mettre à jour les commentaires</button>
    </form>
</template>

<script>

const defaultUrl='http://localhost:3000/api/admin';
const axios=require('axios');
const instance =axios.create({ baseURL:defaultUrl});

export default ({
    name:'AdminComment',
    data(){
        return{
            listed:{},
            searchMethod:'',
            alphaSearch:'',
            authorSearch:'',        //en fait par id
            statusSearch:'',
        }
    },
    created:function(){
        console.log('created',this.$store.state.administredList)
        this.listed=this.$store.state.administredList
    },
    computed:{
        aria(){
            switch(this.searchMethod){
                case 'author':
                    return "recherche par user id";
                case 'publication':
                    return "recherche par publication id";
                case 'id':
                    return "recherche par coment id";
                default:
                    return "";
            }
        },
        //commentaires
        searchingCommentsByAlpha(){
            console.log('scBAl',this.searchMethod,this.alphaSearch)
            if(this.alphaSearch==''){
                console.log('scBAl if', this.listed)
                return this.listed;
            }
            else{
                console.log('scBAl else', this.listed.filter(com =>{return com.comments_texte.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null || com.users_name.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null || com.users_firstname.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null;}))

                return this.listed.filter(com =>{return com.comments_texte.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null || com.users_name.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null || com.users_firstname.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null;})
            }
        },
        searchingCommentsByAuthor(){
            console.log('scBAu',this.searchMethod)
            if(this.authorSearch==''){
                console.log('comments author search vide')
                return this.listed
            }
            else{
                console.log('comments author search', this.authorSearch);
                return this.listed.filter(comm =>{return comm.comments_author==this.authorSearch;})
            }
        },
        searchingCommentsByPublication(){
            console.log('scBP', this.searchMethod, this.authorSearch)
            if(this.authorSearch==''){
                console.log('comments author search vide')
                return this.listed
            }
            else{
                return this.listed.filter(comm =>{return comm.comments_publication==this.authorSearch ;})
            }
        },
        searchingCommentsById(){
            console.log('scBI', this.searchMethod, this.authorSearch)
            if(this.authorSearch==''){
                return this.listed
            }
            else{
                return this.listed.filter(comm =>{return comm.comments_id==this.authorSearch ;})
            }
        },
        searchingCommentsByStatus(){
            console.log('scBS',this.statusSearch)
            if(this.statusSearch==''){
                return this.listed;
            }
            else{
                return this.listed.filter(comm =>{return comm.comments_status==this.statusSearch;})
            }
        },
    },
    methods:{
        toAlpha(){
            this.searchMethod='alpha';
            console.log(this.searchMethod, this.listed);
        },
        toAuthor(){
            this.searchMethod='author';
            console.log(this.searchMethod, this.listed);
        },
        toPublication(){
            this.searchMethod='publication';
            console.log(this.searchMethod, this.listed);
        },
        toId(){
            this.searchMethod='id';
            console.log(this.searchMethod, this.listed);
        },
        toStatus(){
            this.searchMethod='status';
            console.log(this.searchMethod, this.listed);
        },
        resultSearch(){
            if(this.searchMethod=='alpha'){
                return this.searchingCommentsByAlpha;
            }
            else if(this.searchMethod=="author"){
                return this.searchingCommentsByAuthor;
            }
            else if(this.searchMethod=='publication'){
                return this.searchingCommentsByPublication;
            }
            else if(this.searchMethod=='id'){
                return this.searchingCommentsById;
            }
            else if(this.searchMethod=='status'){
                return this.searchingCommentsByStatus;
            }
            else{
                console.log('result search = erreur')
            }
        },
        updateComments(e){
            e.preventDefault();
            let $this=this;
            let list=document.getElementsByTagName('select');
            let listed=[];
            
            console.log(list);
            for(let i=0;i<list.length;i++){
                let opt={};    
                
                opt.id=list[i].id;
                opt.value=list[i].value
                listed.push(opt)
                console.log('longueur: ',list.length,' indice: ',i,' nom: ',list[i].name, ' valeur: ',list[i].value,' objet: ',opt,'liste agrégée :',listed)
            }

            this.$store.state.wait=true;
            instance.put('/commentsUpdate',{commentaire:listed},{headers:{'Authorization': `bearer ${this.$store.state.token}`}})
            .then(res=>{
                $this.$store.state.wait=false;
                console.log(res)
                $this.$store.state.page='connected';
                $this.$router.push('Connected');
            })
            .catch(err=>{
                console.log(err)
            })
        }, //fin update commentaires
    }
})
</script>

<style>
    fieldset{
        border-radius:20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    fieldset label{
        width: 95%;
        box-sizing: border-box;
    }

    fieldset label:hover{
        width: 95%;
        background: black;
        color:white;
        font-size:1.3rem;
    }
    
    .IdCellOneOne, .IdCellOneTwo,.IdCellOneThree, .statusOneOne,.statusOneTwo, th {
        background: grey;
    }


    .IdCellTwoOne, .IdCellTwoTwo,.IdCellTwoThree, .statusOneOne,.statusOneTwo, .comment p, tr{
        background: silver;
        margin:2px;
        
    }

@media screen and (max-width: 680px) {
    .searchSmall{
        background: silver;
    }

    .searchMedium{
        display: none;
    }

    .grilleId, .grilleStatus{
        width: 100%;
        text-align: center;
    }

    .comment{
        width: 95%;

        border:1px solid black;
        border-radius: 20px;
        margin:3px auto;
    }

    .grilleId{
        display: grid;
        grid-template-columns: repeat(3,1fr);
        grid-template-rows: repeat(2,1fr);
        grid-gap: 5px;
        border-bottom: 1px solid black;
    }

   

    .IdCellOneOne{
        border-radius: 20px 0 0 0;
        grid-column: 1 / 2;
        grid-row: 1 / 2;
    }
    .IdCellOneTwo{
        grid-column: 2 / 3;
        grid-row: 1 / 2;
    }
    .IdCellOneThree{
        border-radius: 0 20px 0 0;
        grid-column: 3 / 4;
        grid-row: 1 / 2;
    }
    .IdCellTwoOne{
        grid-column: 1 / 2;
        grid-row: 2 / 3;
    }
    .IdCellTwoTwo{
        grid-column: 2 / 3;
        grid-row: 2 / 3;
    }
    .IdCellTwoThree{
        grid-column: 3 / 4;
        grid-row: 2 / 3;
    }

    .grilleStatus{
        display: grid;
        grid-template-columns: repeat(2,1fr);
        grid-template-rows: repeat(2,1fr);
        border-top: 1px solid black;
    }
    .statusOneOne{
        grid-column: 1 / 2;
        grid-row: 1 / 2;
    }
    .statusOneTwo{
        grid-column: 2 / 3;
        grid-row: 1 / 2;
    }
    .statusTwoOne{
        border-radius: 0 0 0 20px;
        grid-column: 1 / 2;
        grid-row: 2 / 3;
    }
    .statusTwoTwo{
        border-radius: 0 0 20px 0;
        grid-column: 2 / 3;
        grid-row: 2 / 3;
    }

    }

    @media screen and (min-width: 681px) {
        .searchSmall{
            display: none;
        }

        .searchMedium{
            background: silver;
            width: 100%;
        }

        th, td{
            border: 1px solid black;
            margin:0
        }
    }

</style>