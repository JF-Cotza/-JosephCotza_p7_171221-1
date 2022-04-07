<template>
    <div>
        {{ message }}
        <div v-if='this.$store.state.page=="profile"'>
            <User />
        </div>
        <div v-if='this.$store.state.page=="create"'>
            <Publication />
        </div>

        <div v-if='this.$store.state.page=="view"'>
            {{ onePublication }}
            <div> 
                <div v-if='onePublication.publications_author==this.$store.state.author'>
                    <p>Voulez vous la <button>Modifier</button></p>
                    <p>Voulez vous la <button @click='supprimer' class='danger'>supprimer</button></p>
                </div>
                <div  class='flex column' disabled='disabled'>
                    <p class='masked' name='publicationId' disabled='disabled' >{{ onePublication.publications_id }}</p>
                    <p class='masked' name='authorId' disabled='disabled'>{{ onePublication.publications_author }} </p>
                    <p class='author' name='authorName' disabled='disabled'>{{ onePublication.users_name }} </p>
                    <p name='title' disabled='disabled'> {{onePublication.publications_title }}</p>
                    <p name='texte' disabled=true> {{ onePublication.publications_texte }} </p>
                    <img disabled='disabled' :src="onePublication.publications_image" :alt="'image importé : '+onePublication.publications_image" disabled:disabled>
                </div>
            </div>
        </div>
        <div v-if='this.$store.state.page=="connected"'>
            <ul class='flex'>
                <li v-for="edited in list" :key="edited.publications_id" @click='consoling'>
                    <div class='flex column' disabled='disabled'>
                        <p class='masked' name='publicationId' disabled='disabled' >{{ edited.publications_id }}</p>
                        <p class='masked' name='authorId' disabled='disabled'>{{ edited.publications_author }} </p>
                        <p class='author' name='authorName' disabled='disabled'>{{ edited.users_name }} </p>
                        <p name='title' disabled='disabled'> {{edited.publications_title }}</p>
                        <p name='texte' disabled=true> {{ edited.publications_texte }} </p>
                        <img disabled='disabled' :src="edited.publications_image" :alt="'image importé : '+edited.publications_image" disabled:disabled>
                    </div>
                </li>
            </ul>
            
        </div>
        <div id='page'>
            <input type="range" min=1 :max='nombrePage' :value='page' id='listeDesPAges' @change='choixPage' step=1> {{ page }} / {{ nombrePage }}
        </div>
    </div>
</template>

<script>
import User from '../components/User.vue'
import Publication from '../components/Publication.vue'
import axios from 'axios'

const defaultUrl='http://localhost:3000/api';
//const frontDefault='http://localhost:8080'
const instance =axios.create({ baseURL:defaultUrl});

export default {
    name:'Connected',
    data(){
        return{
            message:'', 
            page:1,
            nombrePage:1,
            list:{},
            onePublication:{},
            tokenValue:'',
        }
    },
    components:{
        Publication,
        User
    },
    mounted :function(){
        this.tokenValue=this.$store.state.token;
        this.$store.state.connectionStatus='connected';
        this.message=this.$store.state.message
        console.log(' connected created')
        axios.defaults.headers.common = {'Authorization': 'bearer '+this.tokenValue}
        this.listePublication()
    },
    methods:{
        listePublication(){
            let $this=this;
            this.$store.dispatch('getPublication',{id:this.$store.state.token})
            .then(function(res){
                let data=res.data;
                $this.message+=' '+data.message;
                $this.list=data.liste;
                $this.nombrePage=Math.ceil(data.message.split(' ')[0]/5)
                console.log('nombre de page',$this.nombrePage)
            })
            .catch(function(err){console.log(err.message)})
        },
        choixPage(e){
            this.page=e.target.value
            this.$store.state.publicationPage=e.target.value;
            this.listePublication();
        },
        consoling(e){
            let $this=this;
            let cible=e.target.parentNode;
            let parent;
            console.log('cible',cible.tagName)
            
            if(cible.tagName=='DIV'){
                parent=cible
            }
            if(cible.tagName=='LI'){
                parent=cible.children[0]
            }

            let child=parent.children;
            
            /*
            console.log('div cible', cible)
            console.log('tata', child, 'size', child.length)
            for(let i=0; i<child.length; i++){
                console.log(i, child[i].innerText, child[i].getAttribute('name'))
            }
            */
            axios.defaults.headers.common = {'Authorization': 'bearer '+this.tokenValue}
            let publicationId=child[0].innerText;
            console.log('publicationId',publicationId,this.$store.state.token )           

            instance.get('/publications/getOnePublication',{params:{id:publicationId}})
            .then(function(res){
                let returned=res.data.publication[0];
                //console.log(returned)
                $this.onePublication=returned
                $this.$store.state.page='view';
                //$this.$router.push('Connected')
                //console.log('store',$this.$store.state)
                //$this.onePublication=data.publication[0];
                console.log('1pub',$this.onePublication)
                //$this.message+=' '+data.message;
                //$this.list=data.liste;
                /*
                $this.nombrePage=Math.ceil(data.message.split(' ')[0]/5)
                console.log($this.nombrePage)*/
            })
            .catch(function(err){console.log(err.message)})
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
                $this.$store.dispatch('getPublication',{id:this.$store.state.token})
            })
            .catch(err=>{
                console.log(err.message)
                $this.message='erreur lors de la suppression de la publication'
                console.log($this.message);
                $this.$store.state.page='connected'
                $this.$router.push('Connected')
                $this.$store.dispatch('getPublication',{id:this.$store.state.token})
            })


        }
    }
}
</script>

<style scoped>
.masked{
    display: none;
}

ul{
    width:50%;
    min-width: 300px;
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

li div p{
    margin:0;
    border:1px solid black;
}


.flex{
    display: flex;
    flex-direction: column;
}



</style>