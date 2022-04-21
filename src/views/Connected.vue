<template>
    <div class='corps'>
        <!--{{ message }}
        state:{{ this.$store.state }}-->
        <div v-if='this.$store.state.page=="profile"'>
            <h1>Mon profil</h1>
            <User />
        </div>
        <div v-if='this.$store.state.page=="create"'>
            <h1>Ajouter une publication</h1>
            <Publication
                propsTitle='Donnez un titre à votre publication'
                propsTexte='Son texte' 
                propMessage='Créer une publication' 
            />
        </div>
<!-- modifier la publication -->
        <div v-if='this.$store.state.page=="modifier"'>
            {{ this.$store.state.selectedPublication }} / {{ this.onePublication}}
            <Publication
             
                :propsTitle=this.$store.state.selectedPublication.publications_title
                :propsTexte=this.$store.state.selectedPublication.publications_texte
                :publicationId=this.$store.state.selectedPublication.publications_id
                :propsImage=this.$store.state.selectedPublication.publications_image
                propMessage=' Modifier votre publication '             
            />
        </div>
<!-- voir la publication -->
        <div v-if='this.$store.state.page=="view"'>
            <!--{{ this.$store.state.selectedPublication }} {{ this.$store.state.commentList }}-->
            <div> 
                <div v-if='this.$store.state.selectedPublication.publications_author==this.$store.state.author'>
                    <p>Voulez vous la <button @click='toModifier'>Modifier</button> ? </p>
                    <p>Voulez vous la <button @click='supprimer' class='danger'>Supprimer</button> ? </p>
                </div>
                <Publication 
                    :propsTitle=this.$store.state.selectedPublication.publications_title
                    :propsTexte=this.$store.state.selectedPublication.publications_texte
                    :propsImage=this.$store.state.selectedPublication.publications_image
                    :publicationId=this.$store.state.selectedPublication.publications_id
                    :publicationAuthorName=this.$store.state.selectedPublication.users_name 
                    :publicationAuthorFirstname=this.$store.state.selectedPublication.users_firstname
                    :publicationAuthorId=this.$store.state.selectedPublication.publications_author

                    propMessage=' voir la publication / la commenter '
                />
    <!-- liste des commentaires -->
                <div >
                    <p v-if="this.$store.state.commentList.length==0" >Il n'y a pas de commentaires. Soyez le premier à en ajouter</p>
                    <ul v-else class='flex'>
                        <li v-for="commented in this.$store.state.commentList" :key=commented.comments_id>
                            <Comment  
                                :propAuthor={id:commented.comments_author,name:commented.users_name,firstname:commented.users_firstname,masked:masked,class:not}
                                :propDate=commented.comments_date
                                :propTexte={texte:commented.comments_texte,toDisabled:disabled}
                                :pubId={id:this.$store.state.selectedPublication.publications_id,masked:masked}
                                forAdding='masked'
                                forComments=' '
                            />
                        </li>
                    </ul>
                </div>
    <!-- ajouter un commentaire -->
                <div>
                <!--
                    {{ this.$store.state }}
                -->
                    <Comment
                        :pubId={id:this.$store.state.selectedPublication.publications_id,masked:masked}
                        :propAuthor={id:this.$store.state.author,masked:masked,class:masked}
                                
                        forAdding=''
                        forComments='masked'
                        propTexte=''                        
                    />
                </div>
<!--                
                <div  class='flex column' disabled='disabled'>
                    <p class='masked' name='publicationId' disabled='disabled' >{{ onePublication.publications_id }}</p>
                    <p class='masked' name='authorId' disabled='disabled'>{{ onePublication.publications_author }} </p>
                    <p class='author' name='authorName' disabled='disabled'>Auteur : {{ onePublication.users_name + ' ' +onePublication.users_firstname}} </p>
                    <p class='title' name='title' disabled='disabled'> Titre : {{onePublication.publications_title }}</p>
                    <p class='back justify ' name='texte' disabled='disabled' > {{ onePublication.publications_texte }} </p>
                    <img class='back' disabled='disabled' v-if="onePublication.publications_image!=''" :src="onePublication.publications_image" :alt="'image importé : '+onePublication.publications_image" >
                    <p class='back' v-else disabled='disabled'>Pas d'image</p>
                    <img :src="onePublication.link" :alt="'link :' + onePublication.link">
                </div>
-->
            </div>
        </div>
<!-- page d'accueil -->
        <div v-if='this.$store.state.page=="connected"'>
            <ul class='flex'>
                <li v-for="onePublication in this.$store.state.publicationListe" :key="onePublication.publications_id" >
                    <Publication
                        :propsTitle=onePublication.publications_title
                        :propsTexte=onePublication.publications_texte
                        :propsImage=onePublication.publications_image
                        :publicationId=onePublication.publications_id
                        :publicationAuthorName=onePublication.users_name 
                        :publicationAuthorFirstname=onePublication.users_firstname
                        :publicationAuthorId=onePublication.publications_author
                    />
                </li>
            </ul>
        </div>
        <div id='page' v-if="this.$store.state.page=='connected'">
            <p v-if="this.$store.state.nombrePage==0">Il n'y a pas de publications, soyez le premier à publier</p>
            <input v-else type="range" min=1 :max='this.$store.state.nombrePage' :value='page' id='listeDesPAges' @change='choixPage' step=1> {{ page }} / {{ this.$store.state.nombrePage }}
        </div>
    </div>
</template>

<script>
import User from '../components/User.vue'
import Publication from '../components/Publication.vue'
import Comment from '../components/Comment.vue'
import axios from 'axios'
;
const defaultLink='http://localhost:3000/';
const defaultUrl=defaultLink+'/api';
const instance =axios.create({ baseURL:defaultUrl});

export default {
    name:'Connected',
    data(){
        return{
            imageBasisUrl:'http://localhost:3000/images/',
            message:'', 
            page:1,
            nombrePage:1,
            list:{},
            onePublication:{},
            tokenValue:'',

            masked:'masked',
            toDisabled:'disabled',
            not:'',
        }
    },
    components:{
        Publication,
        User,
        Comment,
    },
    created :function(){
        this.tokenValue=this.$store.state.token;
        this.$store.state.connectionStatus='connected';
        this.message=this.$store.state.message
        console.log(' connected created')
        axios.defaults.headers.common = {'Authorization': 'Bearer '+this.tokenValue}
        this.listePublication()
    },
    methods:{
        listePublication(){
            this.$store.dispatch('getPublications')
        },
        choixPage(e){
            this.page=e.target.value
            this.$store.state.publicationPage=this.page;
            console.log('choixpage/ page',this.page,' / publicationPage', this.$store.state.publicationPage)
            //this.listePublication();
            this.$store.dispatch('getPublications')
        },
        
        supprimer(){
            let publicationId=this.onePublication.publications_id;
            let authorId=this.$store.state.author;
            console.log('supprimer la publication',this.onePublication, publicationId)
            let data={id:publicationId,author:authorId}
            let $this=this;

            instance.delete('/publications/suppressOne',{params:data})
            .then(res=>{
                $this.message=res.data.message;
                $this.$store.state.page='connected'
                $this.$router.push('Connected')
                $this.$store.dispatch('getPublications')
                .then(function(res){
                    console.log('connected then then ',res)
                })
                .catch(function(err){
                    console.log('connected then catch ',err)
                })
            })
            .catch(err=>{
                console.log(err.message)
                $this.message='erreur lors de la suppression de la publication'
                console.log($this.message);
                $this.$store.state.page='connected'
                $this.$router.push('Connected')
                $this.$store.dispatch('getPublications')
                .then(function(res){
                    console.log('connected catch then ',res)
                })
                .catch(function(err){
                    console.log('connected catch catch ',err)
                })
            })
        },
        toModifier(){
            console.log('modifier')
            this.$store.state.page='modifier';
        },
        addComment(){
            console.log('pour ajouter un commentaire, state',this.$store.state)
        },
    }
}
</script>

<style scoped>
.corps{
    width: 300px;
    margin:auto;
}

.masked{
    display: none;
}



ul{
    width: 300px;
    margin:auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.author{
    background-color: blue;
    color:white;
    font-weight: bold;
}

li{
    margin:0;
    list-style: none;
    text-align: justify ;
}

li div{   
    background: green;
    padding-top: 20px;
    margin-top: 10px;
    border:1px solid white;
    border-radius:20px;
}

div p{
    margin:0;
    border:1px solid black;
}


.flex{
    width:100%;
    padding: 0;
    display: flex;
    flex-direction: column;
}

span{
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

.justify{
    text-align: justify;
}
.title{
    background: aqua;
}
.back{
    background: silver;
}

</style>