<template>
    <form>
         <!-- paramètres de recherche -->
        <fieldset class='searchMode'>
            <legend>Comment voulez vous chercher ?</legend>
            <label for="alpha">            
                <input type="radio" name="publiSearching" id="alpha" @click='toAlpha'>Rechercher dans le titre, le texte, le nom d'image
            </label>
            <label for="author">
                <input type="radio" name="publiSearching" id="author" @click='toAuthor'>rechercher par user id
            </label>
            <label for="status">
                <input type="radio" name="publiSearching" id="status" @click='toStatus'>rechercher par status
            </label>
        </fieldset>

        <label for="searchArea" v-if="searchMethod!='status' && searchMethod!=''">Recherche
            <input v-if="searchMethod=='alpha'" name="publiSearch" id="searchArea" v-model="alphaSearch" aria-label='recherche textuelle'>    
            <input v-if="searchMethod=='author'" name="publiSearch" id="searchArea" v-model="authorSearch" aria-label="recherche par l'id de l'utilisateur">
        </label>

        <label for="searchAreaStatus" v-if="searchMethod=='status' && searchMethod!=''" aria-label="recherche par status de publication">Recherche
            <select  v-model="statusSearch" id='searchAreaStatus' name='publiSearch'>
                <option value="" selected disabled>Sélectionner</option>
                <option value="0" >Modérée</option>
                <option value="1" >Normal</option>
                <!--<option value="2" >Epinglée</option>-->
            </select>
        </label>

        <div class='searchSmall publicationGrid' v-for="pub in resultSearch()" :key='pub.publications_id'>
            <div class='oneOne'>Titre : </div>
            <div class='oneTwo'>{{ pub.publications_title }}</div>
            <div class='twoOne'>Texte : </div>
            <div class='twoTwo'>{{ pub.publications_texte }}</div>
            <div class='threeOne'>Image : </div>
            <div class='threeTwo'>{{ pub.publications_image }}</div>
            <div class='fourOne'>User Id : </div>
            <div class='fourTwo'>{{ pub.publications_author }}</div>
            <div class='fiveOne'>Status : </div>
            <div class='fiveTwo'>{{ pub.publications_status }}</div>
            <div class='sixOne'>Changer le status : </div>
            <label :for="pub.publications_id" class='sixTwo'>
                <select :id="pub.publications_id" key="newStatus">
                    <option value="" selected disabled>Sélectionner</option>
                    <option value="0" >Masquer</option>
                    <option value="1" >Normal</option>
                    <!--<option value="2" >Epingler</option>-->
                </select>
            </label>
        </div>


        <ul class='searchSmall' v-for="pub in resultSearch()" :key='pub.publications_id'>
            <li>Titre : {{ pub.publications_title }}</li>
            <li>Texte : {{ pub.publications_texte }}</li>
            <li>Image : {{ pub.publications_image }}</li>
            <li>User Id {{ pub.publications_author }}</li>
            <li>Status {{ pub.publications_status }} </li>
            <li>Changer le status
                    <select :name="pub.publications_id" key="newStatus" id='newStatus'>
                        <option value="" selected disabled>Sélectionner</option>
                        <option value="0" >Masquer</option>
                        <option value="1" >Normal</option>
                        <!--<option value="2" >Epingler</option>-->
                    </select>
            </li>
        </ul>

        <table class='searchMedium'>
            <thead>
                <tr>
                    <th class='blockPub'>Titre</th>
                    <th class='blockPub'>Texte</th>
                    <th class='blockPub'>Image</th>
                    <th class='blockPub'>User id</th>
                    <th class='blockPub'>Status</th>
                    <th class='largeBlockPub'>Option</th>
                </tr>
            </thead>
            <tbody>
                <tr  v-for="pub in resultSearch()" :key='pub.publications_id'>
                    <td class='blockPub' :title='"titre : "+pub.publications_title'> {{ pub.publications_title }}</td>
                    <td class='blockPub' :title='"texte : "+pub.publications_texte'> {{ pub.publications_texte }}</td>
                    <td class='blockPub' :title='"nom du fichier image : "+pub.publications_image'> {{ pub.publications_image }}</td>
                    <td class='blockPub' :title='"user id : "+pub.publications_author'> {{ pub.publications_author }}</td>
                    <td class='blockPub' title="status actuel"> {{ pub.publications_status}}</td>
                    <td class='largeBlockPub'>
                            <select :name="pub.publications_id" key="newStatus" id="newStatus">
                                <option value="" selected disabled>Sélectionner</option>
                                <option value="0" >Masquer</option>
                                <option value="1" >Normal</option>
                                <!--<option value="2" >Epingler</option>-->
                            </select>
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click='updatePublication'>Mettre à jour les publications</button>
    </form>
</template>

<script>
const axios=require('axios');


export default {
    name:'AdminPublication',
    data(){
        return {
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
        //for publications
        searchingPublicationByAlpha(){
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
            console.log(this.searchMethod, this.statusSearch)
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
        toAlpha(){
            this.searchMethod='alpha';
            console.log(this.searchMethod, this.listed);
        },
        toAuthor(){
            this.searchMethod='author';
            console.log(this.searchMethod, this.listed);
        },
        toStatus(){
            this.searchMethod='status';
            console.log(this.searchMethod, this.listed);
        },
        resultSearch(){
            if(this.searchMethod=='alpha'){
                return this.searchingPublicationByAlpha;
            }
            else if(this.searchMethod=="author"){
                return this.searchingPublicationByAuthor;
            }
            else if(this.searchMethod=='status'){
                return this.searchingPublicationByStatus;
            }
            else{
                console.log('result search = erreur')
            }
        },
//mise à jour du status des publications
        updatePublication(e){
            e.preventDefault();
            let $this=this;
            let list=document.getElementsByTagName('select');
            let listed=[];
            
            console.log(list);
            for(let i=0;i<list.length;i++){
                let opt={};    
                
                opt.id=list[i].name;
                opt.value=list[i].value
                listed.push(opt)
                console.log('longueur: ',list.length,' indice: ',i,' nom: ',list[i].name, ' valeur: ',list[i].value,' objet: ',opt,'liste agrégée :',listed)
            }

            this.$store.state.wait=true;
            setTimeout(()=>(this.$store.state.wait=false),this.$store.state.time);
            let instance= axios.create({ baseURL:this.$store.state.url+'/api/admin'});
            instance.put('/publicationUpdate',{publications:listed},{headers:{'Authorization': `bearer ${this.$store.state.token}`}})
            .then(res=>{
                $this.$store.state.wait=false;
                console.log(res)
                $this.$store.state.page='connected';
                $this.$router.push('Connected');
            })
            .catch(err=>{
                console.log(err)
            })
        }, //fin update publication
    }
}
</script>

<style>
fieldset{
    text-align:left;
}

.searchMode {
    padding: 0;
    border-radius:20px;
    display:flex;
    flex-direction: column;
    align-content: flex-start;
    padding:5px 5px 5px 0;
}

.searchModelabel{
    width: 100%;
}

.searchMode label:hover {
    width: 100%;
    background: rgba(0,0,0,.5);
    color:white;
}

    @media screen and (max-width: 680px) {
        .searchSmall{
            width: 95%;
            margin: auto;
            padding: 5px 0;
            background: silver;
        }

        .searchMedium{
            display: none;
        }

        .publicationGrid{
            display: grid;
            grid-template-columns: 1fr 2fr;
            grid-template-rows: repeat(6,1fr);
            grid-gap: 2px;
            border:1px solid black;
            border-radius:20px;
        }

        .oneTwo, .twoTwo, .threeTwo, .fourTwo, .fiveTwo, .sixTwo{
            background: skyblue;
            margin: 0 5px 0 0;
            padding: 10px 0 0 5px;
            text-align: justify;
        }

        .oneTwo{
            border-radius:0 20px 0 0;
        } 
        
        .sixTwo{
            border-radius:0  0 20px 0;
        }

        .oneOne{
            grid-column: 1 / 2;
            grid-row: 1 /2;
        }

        .oneTwo{
            grid-column: 2 / 3;
            grid-row: 1 /2;
        }

        .twoOne{
            grid-column: 1 / 2;
            grid-row: 2 /3;
        }

        .twoTwo{
            grid-column: 2 / 3;
            grid-row: 2 /3;
        }

        .threeOne{
            grid-column: 1 / 2;
            grid-row: 3 / 4;
        }

        .threeTwo{
            grid-column: 2 / 3;
            grid-row: 3 /4;
        }

        .fourOne{
            grid-column: 1 / 2;
            grid-row: 4 /5;
        }

        .fourTwo{
            grid-column: 2 / 3;
            grid-row: 4 /5;
        }

        .fiveOne{
            grid-column: 1 / 2;
            grid-row: 5 / 6;
        }

        .fiveTwo{
            grid-column: 2 / 3;
            grid-row: 5 /6;
        }

        .sixOne{
            grid-column: 1 / 2;
            grid-row: 6 /7;
        }

        .sixTwo{
            grid-column: 2 / 3;
            grid-row: 6 /7;
        }
    }

    @media screen and (min-width: 681px) {
        .searchSmall{
            display: none;
        }

        .searchMedium tbody tr{
            background: lightgreen;
            width: 100%;
        }
    }
</style>