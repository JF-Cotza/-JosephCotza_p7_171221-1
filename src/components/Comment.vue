<template>
    <div >
        <form action="" method="POST" class="column">
            <input type="text" name="author" id="author"    :class=propAuthor.class  disabled=disabled  :value="'Auteur : '+propAuthor.name+' '+propAuthor.firstname">
            <input type="text" name="author" id="authorId"  :class=propAuthor.masked disabled=disabled  :value=propAuthor.id>
             
            <input type="text" name="publicationId" id="publicationId" :value=pubId.id :class=pubId.masked disabled=disabled>
            <input type="text" name="date"   id="date" :date=propDate :value=propDate :class=forComments disabled=disabled>

            <input type="text" name="texte" id="texte" :value=propTexte.texte v-if="propTexte!=''" disabled=propText.toDisabled>
            <input type="text" name="texte" id="texte" v-model='texte' v-else>
            <button :class=forAdding @click='addAComment'>Commenter</button>
        </form>
    </div>
</template>

<script>
const defaultUrl='http://localhost:3000/api/comments';
const axios=require('axios');
const instance =axios.create({ baseURL:defaultUrl});

export default {
    name:'Comment',
    data(){
        return{
            author:'',
            date:'',
            texte:'',
        }
    },
    props:{
        pubId:Object,
        propAuthor:Object,
        propDate:String,
        propTexte:Object,
        forAdding:String,
        forComments:String,
    },
    methods:{
        addAComment(e){
            e.preventDefault();
            console.log('auteur', this.propAuthor)
            let $this=this

            if(this.propTexte==''){
                console.log('texte',this.texte)    
            }
            let form=new FormData()
            form.append('auteur', this.propAuthor.id);
            form.append('texte',this.texte);
            form.append('publication',this.pubId.id);

            //axios.defaults.headers.common = {'Authorization': `bearer ${this.$store.state.token}`}
            instance.post('/addComment', form,{headers: {'Authorization': `bearer ${this.$store.state.token}`}})
                .then(res=>{
                    $this.$store.state.message=res.data.message
                    console.log('adcomment',res)
                    $this.$store.dispatch('getPublications')
                    $this.$store.state.page='connected'
                    $this.$router.push('Connected')      
                })
                .catch(err=>console.log('addComment error',err.message))
        }
    },
}
</script>

<style scoped>
.column{
    width:50%;
    min-width: 300px;
    margin:auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.masked{
    display: none;
}
</style>