<template>
    <div class='corps'>
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
            <!--{{ this.$store.state.selectedPublication }} / {{ this.onePublication}}-->
            <Publication
                :propsTitle=this.$store.state.selectedPublication.publications_title
                :propsTexte=this.$store.state.selectedPublication.publications_texte
                :publicationId=this.$store.state.selectedPublication.publications_id
                :propsImage=this.$store.state.selectedPublication.publications_image
                :publicationAuthorName=this.$store.state.selectedPublication.users_name 
                :publicationAuthorFirstname=this.$store.state.selectedPublication.users_firstname
                propMessage=' Modifier votre publication '             
            />
        </div>
<!-- voir la publication -->
        <div v-if='this.$store.state.page=="view"'>
            <div>
                <div v-if='this.$store.state.selectedPublication.publications_author==this.$store.state.author'>
                    <p>Voulez vous la <button @click='toModifier'>Modifier</button> ? </p>
                    <p>Voulez vous la <button @click='supprimer' class='danger' :value=this.$store.state.selectedPublication.publications_id>Supprimer</button> ? </p>
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
                            <div v-if="commented.users_status==0" class='userSuspend'>
                                Cet utilisateur a été suspendu et ses commentaires ne sont plus visible
                            </div>
                            <div v-if="commented.comments_status==0" class='publicationModerated relative'>
                                 <button v-if='this.$store.state.authorStatus==2' class='moderate' act='reveal' :value="commented.comments_id" ><img src="../assets/modere_valid.png" alt="demasquer un commentaire" @click='forCommentsActing'></button>
                                Ce commentaire a été modéré et n'est plus visible
                            </div>
                            <div v-if='commented.comments_status!=0 && commented.users_status!=0' class='relative'>
                                <button v-if='this.$store.state.authorStatus==2' class='moderate' act='block' :value="commented.comments_id" ><img src="../assets/modere_refus.png" alt="masquer un commentaire" @click='forCommentsActing'></button>
                                <Comment
                                    :propAuthor={id:commented.comments_author,name:commented.users_name,firstname:commented.users_firstname,masked:masked,class:not}
                                    :propDate=commented.comments_date
                                    :propTexte={texte:commented.comments_texte,toDisabled:disabled}
                                    :pubId={id:this.$store.state.selectedPublication.publications_id,masked:masked}
                                    forAdding='masked'
                                    forComments=' '
                                />
                            </div>
                        </li>
                    </ul>
                </div>
    <!-- ajouter un commentaire -->
                <div class='addingComment'>
                <!--
                    {{ this.$store.state }}
                -->
                    <p>Ajouter un commentaire</p>
                    <Comment
                        :pubId={id:this.$store.state.selectedPublication.publications_id,masked:masked}
                        :propAuthor={id:this.$store.state.author,masked:masked,class:masked}
                                
                        forAdding=''
                        forComments='masked'
                        propTexte=''                        
                    />
                </div>
            </div>
        </div>
<!-- page d'accueil -->
        <div v-if='this.$store.state.page=="connected"' class='publicationList'>
            <h1>Les publications</h1>
            <ul class='flex'>
                <li v-for="onePublication in this.$store.state.publicationListe" :key="onePublication.publications_id" >
                    <p class='userSuspend' v-if='onePublication.users_status==0' @mouseover='popAuthor' @mouseleave="pop=false" :author='onePublication.users_id'>Cet utilisateur a été suspendu et ses publications ne sont plus visibles</p>
                    <div class='popup' v-if="this.$store.state.authorStatus==2 && onePublication.users_status==0 && pop && toPop==onePublication.users_id" >
                        <p>l'utilisateur : {{ onePublication.users_name }} {{ onePublication.users_firstname }} </p>
                        <p> son id : {{ onePublication.users_id }}</p>
                    </div>
                    
                    <div v-if='onePublication.publications_status==0 && onePublication.users_status!=0' class='relative'>
                        <button v-if='this.$store.state.authorStatus==2' class='moderate' act='reveal' :value="onePublication.publications_id" @mouseover="poping" @mouseleave="hover=false"><img src="../assets/modere_valid.png" alt="demasquer une publication" @click='forActing' ></button>
                        <p class='publicationModerated'>Cet publication a été modérée et n'est donc plus visible</p>
                        <div v-if='hover && toPop==onePublication.publications_id' class='popup position'>
                            <p>Le texte modéré : {{ onePublication.publications_texte }}</p>
                            <p v-if="onePublication.publications_image!=''"> le nom de l'image : {{ onePublication.publications_image }}</p>
                            <img v-if="onePublication.publications_image!=''" :src="imageBasisUrl+onePublication.publications_image" alt="" class='smallImage'>
                        </div>
                    </div>
                    <div v-if='onePublication.publications_status!=0 && onePublication.users_status!=0' class='relative'>
                        <button v-if='this.$store.state.authorStatus==2' class='moderate' act='block' :value="onePublication.publications_id" @click='forActing'><img src="../assets/modere_refus.png" alt="masquer une publication"></button>
                        
                        <Publication
                            :propsTitle=onePublication.publications_title
                            :propsTexte=onePublication.publications_texte
                            :propsImage=onePublication.publications_image
                            :publicationId=onePublication.publications_id
                            :publicationAuthorName=onePublication.users_name 
                            :publicationAuthorFirstname=onePublication.users_firstname
                            :publicationAuthorId=onePublication.publications_author
                        />
                    </div>
                    <p v-if="onePublication.counted" class='commentaires'> Nombre de commentaires : {{ onePublication.counted }} </p>
                    <p v-else class='commentaires'>Pas de commentaires</p>  
                </li>
            </ul>
        </div>
        <div id='page' v-if="this.$store.state.page=='connected'">
            <p v-if="this.$store.state.nombrePage==0">Il n'y a pas de publications, soyez le premier à publier</p>
            <label for="listeDesPages" v-else>Changer de page
                <input  type="range" min=1 :max='this.$store.state.nombrePage' :value='page' id='listeDesPages' name='listeDesPages' @change='choixPage' step=1 > {{ page }} / {{ this.$store.state.nombrePage }}
            </label>
        </div>
    </div>
</template>

<script>
import User from '../components/User.vue'
import Publication from '../components/Publication.vue'
import Comment from '../components/Comment.vue'
import axios from 'axios';

export default {
    name:'Connected',
    data(){
        return{
            imageBasisUrl:this.$store.state.urlBasis+'/images/',
            message:'', 
            page:1,
            nombrePage:1,
            list:{},
            onePublication:{},
            tokenValue:'',
            counted:'',
            masked:'masked',
            toDisabled:'disabled',
            not:'',

            hover:false,
            toPop:'',
            pop:false,
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
            //console.log('choixpage/ page',this.page,' / publicationPage', this.$store.state.publicationPage)
            this.$store.dispatch('getPublications')
        },
        supprimer(e){
            let publicationId=e.target.value;
            let authorId=this.$store.state.author;
            console.log('supprimer la publication',this.onePublication, publicationId, this.tokenValue)
            let data={id:publicationId,author:authorId}
            let $this=this;
            this.$store.state.wait=true;
            setTimeout(()=>(this.$store.state.wait=false),this.$store.state.time)
            axios.defaults.headers.common = {'Authorization': 'Bearer '+this.tokenValue}
            let instance= axios.create({ baseURL:this.$store.state.url});
            instance.delete('/publications/suppressOne', {params:data})//, {headers:{'Authorization': 'Bearer '+this.tokenValue}})
            .then(res=>{
                $this.message=res.data.message;
                $this.$store.state.wait=false;
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
        forActing(e){
            let cible=e.target;
            let $this=this;
            if(cible.tagName=='img' || cible.tagName=='IMG'){
                cible=e.target.parentNode
            }
            
            console.log('to show',cible.value,cible.getAttribute('act'))
            let toDo={id:cible.value,action:cible.getAttribute('act')}
            this.$store.state.wait=true;
            setTimeout(()=>(this.$store.state.wait=false),this.$store.state.time)
            let instance= axios.create({ baseURL:this.$store.state.url});
            instance.put('/admin/publicationUpdateOne',toDo,{headers:{'Authorization': 'Bearer '+this.tokenValue}})
            .then(res=>{
                console.log(res)
                $this.$store.state.wait=false;
                
                console.log('go')
                $this.$store.state.page='connected'
                $this.$router.go()
                
            })
            .catch(err=>console.log(err))
        },
        forCommentsActing(e){
            let cible=e.target;
            let $this=this;

            if(cible.tagName=='img' || cible.tagName=='IMG'){
                cible=e.target.parentNode
            }
            
            let action=cible.getAttribute('act')

            let toDo={id:cible.value,action:action}
            this.$store.state.wait=true;
            setTimeout(()=>(this.$store.state.wait=false),this.$store.state.time)
            let instance= axios.create({ baseURL:this.$store.state.url});
            instance.put('/admin/commentsUpdateOne',toDo,{headers:{'Authorization': 'Bearer '+this.tokenValue}})
            .then(res=>{
                console.log(res)
                $this.$store.state.wait=false;
                
                console.log('go')
                $this.$router.go() //déconnecte
                
            })
            .catch(err=>console.log(err))
        },
        poping(e){
            if(e.target.tagName=='BUTTON'){
                this.toPop=e.target.value
            }    
            if(e.target.tagName=='IMG'){
                this.toPop=e.target.parentNode.value
            }
            this.hover=true;
        },
        popAuthor(e){
            console.log(e.target)
            this.toPop=e.target.getAttribute('author')
            this.pop=true;
        }
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
    width:100%;
    margin:0;
    list-style: none;
    text-align: left ;
}

li div{   
    border:1px solid white;
    border-radius:20px;
}

div p{
    margin:0;
    border:1px solid black;
}

.popup{
    background: lightcoral;
    padding-left: 10px;
    width: 300px;
    box-sizing: border-box;
}

.popup p{
    border:none;
    box-sizing: border-box;
}

.addingComment{
    background: #ffffff;
    background: -moz-linear-gradient(top,  #ffffff 0%, #79f5fc 7%, #db36a4 23%, #ff0000 88%, #000000 100%);
    background: -webkit-linear-gradient(top,  #ffffff 0%,#79f5fc 7%,#db36a4 23%,#ff0000 88%,#000000 100%);
    background: linear-gradient(to bottom,  #ffffff 0%,#79f5fc 7%,#db36a4 23%,#ff0000 88%,#000000 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#000000',GradientType=0 );
    border-radius:10px;
    border:1px solid grey;
    margin:5px 0;
}

.addingComment p{
    border:none;
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
    text-align: left;
}
.title{
    background: aqua;
}
.back{
    background: silver;
}


.userSuspend,.publicationModerated{
    opacity: 75%;
    width: 300px;
    border-radius:20px;
    padding:10px 0;
    box-sizing: border-box;
}

.userSuspend{
    background: black;
    color:red;
    padding-left:10px;
}

.publicationModerated{
    background: black;
    box-sizing: border-box;
    color:white;
}

.relative{
  position: relative;
  width:100%;
  box-sizing: border-box;
}

.moderate{
    z-index: 1;
    position: absolute;
    top:0px;
    right: 0px;
}

.moderate img{
    height: 20px;
    width: auto;
}

.publicationList li{
    margin:5px;
}

.commentaires{
    width: 300px;
    box-sizing: border-box;
    border-radius: 20px;
    padding:5px;
}

.smallImage{
    margin:auto;
    max-width: 200px;
    max-height: 200px;
}

.popup.position{
    position: fixed;
    z-index:1;
    top:0;
    left:50%-150px;
}
</style>