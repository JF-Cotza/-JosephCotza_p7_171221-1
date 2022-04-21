<template>
    <div @click='consoling' class='containing'>
        <!-- /{{ message }} /-->  page store : {{ this.$store.state.page}} / disabling {{ disabling }}
        <h1> {{ propMessage }} </h1>
        <form action="" method="post" enctype="multipart/form-data" class='flex column' disabled='disabling'>
            <input type="text" name='publicationId' :value=publicationId class='masked'>
            <p>Auteur {{ publicationAuthorName }} {{ publicationAuthorFirstname }}</p>
            <input type="text" id='title'    name='title'    v-model="title"    :placeholder=propsTitle :disabled='disabling'>
            <input type="text" id='texte'    name='texte'    v-model='texte'    :placeholder=propsTexte :disabled='disabling'>
            
            not connected
            <input v-if='this.$store.state.page!="connected"' type="file" id='image'    name='image'    title="ajouter une image" @change='image' :disabled='disabling'>

            <div v-if='fileToUpdate.size>0 && imageUrl!="http://localhost:3000/images" ' class='flex column'>
                <img :src="imageUrl" alt="image importé" >
                <button @click='resetImage'>supprimer l'image</button>
            </div>

            <img v-if='propsImage!=""' :src="'http://localhost:3000/images/'+propsImage" alt="image importée">
    <!-- bouton page create -->            
            <div class='flex row' v-if="this.$store.state.page=='create'">
                <button type="reset" @click='voidImage'>Annuler</button>
                <button type="submit" :disabled='isDisabled' @click='addPublication'>Créer</button>
            </div>
    <!-- bouton page modifier -->
            <div class='flex row' v-if="this.$store.state.page=='modifier'">
                <button  type="submit" :disabled='isDisabled' @click='modifyPublication'>Modifier</button>
                <button  type="reset" @click='backToHome'>Annuler et revenir à l'accueil</button>
            </div>            
        </form>
    </div>
</template>

<script>
import FormData from 'form-data';

//definition de contantes
const defaultUrl='http://localhost:3000/api/publications';
const axios=require('axios');
const instance =axios.create({ baseURL:defaultUrl});
const MIMES_TYPES ={                
    'image/jpg' : 'jpg',           
    'image/jpeg': 'jpg',
    'image/png' : 'png'         
};

export default {
    name:'Publication',
    props:{
        propMessage:String,

        publicationId:Number,
        publicationAuthorName:String, 
        publicationAuthorFirstname:String,
        publiationAuthorId:Number,
    
        propsTitle:String,
        propsTexte:String,
        propsImage:String,
        },
    data(){
        return {
            authorId:'',
            pubId:'',

            imageUrl:'',
            fileToUpdate:{name:'', size:0},
            title:'',
            texte:'',
            
            //disabling:'',
            //message:'',
        }
    },
    created:function(){
        this.$store.state.message=this.message
        axios.defaults.headers.common = {'Authorization': `bearer ${this.$store.state.token}`}
        
    },
    computed:{
        isDisabled(){
            if(this.texte.length!=0 || this.fileToUpdate.size!=0){
                return false
            }
            if(this.$store.state.page=='modifier' && this.title.length!=0){
                return false
            }
                return true
        },
        disabling(){
            if(this.$store.state.page!='modifier' && this.$store.state.page!='create'){
                return 'disabled'
            }
            else{
                return false
            }
        },   
    },    
    methods:{
        image(e){
            this.fileToUpdate=e.target.files[0]
            if(this.fileToUpdate.size==0)
            {
                this.message='image trop petite';
                this.voidImage()
            }
            
            if(!MIMES_TYPES[this.fileToUpdate.type]){
                this.message='format non reconnu';
                this.voidImage();
            }
            else{
                console.log('mime',MIMES_TYPES[this.fileToUpdate.type])        
                
                let reader=new FileReader();
                reader.onload=e=>{
                this.imageUrl=e.target.result;      
                }   
                reader.readAsDataURL(this.fileToUpdate)
            }
        },
        voidImage(){
            document.getElementById('image').value='';
            this.fileToUpdate={name:'', size:0}
            this.imageUrl='';
        },
        resetImage(e){
            e.preventDefault();
            this.voidImage();
        },
        addPublication(e){
            e.preventDefault()
            let form=new FormData();
            let $this=this;
            form.append('title',this.title);
            form.append('texte',this.texte);
            form.append('image',this.fileToUpdate);
            form.append('id',this.$store.state.author)

            instance.post('/addPublication',form,{headers: {'Authorization': `bearer ${this.$store.state.token}`}})
                .then(res=>{
                    $this.$store.state.message=res.data.message
                    console.log('adpub',res)
                    $this.$store.dispatch('getPublications')
                    $this.$store.state.page='connected'
                    $this.$router.push('Connected')      
                })
                .catch(err=>console.log('addpub error',err.message))
        },
        modifyPublication(e){
            e.preventDefault()
            console.log('pour modifier')
            let form=new FormData();
            let $this=this;

            let title
            if(!this.title){
                title=this.propsTitle
            }
            else{
                title=this.title
            }

            form.append('title',title);
            
            let texte
            if(!this.texte){
                texte=this.propsTexte
            }
            else{
                texte=this.texte
            }

            form.append('texte',texte);
            
            let image
            if(!this.fileToUpdate){
                image=this.propsImage
            }
            else{
                image=this.fileToUpdate
            }

            form.append('image',image);
            form.append('publicationId',this.publicationId)

            console.log('titre:',this.title, this.propsTitle, ' texte:',this.texte, 'form',form)
            instance.put('/modifyPublication',form,{headers: {'Authorization': `bearer ${this.$store.state.token}`}})
                .then(res=>{
                    $this.$store.state.message=res.data.message
                    $this.$store.dispatch('getPublications')
                    $this.$store.state.page='connected'
                    $this.$router.push('Connected')      
                })
                .catch(err=>console.log('addpub error',err.message))
        },
        backToHome(e){
            e.preventDefault()
            this.$store.state.page='connected'
            this.$store.dispatch('getPublications')
        },
        consoling(e){
            if(this.$store.state.page=='modifier' || this.$store.state.page=='create'){
                return
            }
            e.preventDefault()
            
            let $this=this
            console.log('publicationId',this.publicationId,this.$store.state.token )           
            let publicationId=this.publicationId

            instance.defaults.headers.common ={'Authorization':'Bearer '+ this.$store.state.token}
            instance.get('/getOnePublication', {params:{'id':publicationId}})
            .then(function(res){
                let returned=res.data.publication[0];
                console.log('1pub then data',res.data)
                $this.$store.state.selectedPublication=returned
                $this.$store.state.commentList=res.data.comments;
                $this.$store.state.page='view';
            })
            .catch(function(err){console.log(err.message)})
        },
    }

}
</script>

<style scoped>
.containing{
    width:300px;
    background: #028ef9;
    background: -moz-linear-gradient(top,  #028ef9 0%, #ffffff 100%);
    background: -webkit-linear-gradient(top,  #028ef9 0%,#ffffff 100%);
    background: linear-gradient(to bottom,  #028ef9 0%,#ffffff 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#028ef9', endColorstr='#ffffff',GradientType=0 );
}

form input, form img {
    width: 95%;
    margin: auto;
}

form input:disabled{
    color:black;
    background: rgba(0,0,0,0);
    border:none;
}

.flex{
    display: flex;
    align-items: center;
}

.column{
    flex-direction: column;
}

.row{
    flex-direction: row;
}

.row button{
    width:100px;
}

</style>