<template>
    <div>
        {{ message }}
        <h1>publication</h1>
        <form action="" method="post" enctype="multipart/form-data" class='flex column'>
            <input type="text" id='title' v-model='title' name='title' placeholder='votre titre' >
            <input type="text" id='texte' v-model='texte' name='texte' placeholder="votre texte" >
            <input type="file" id='image' name='image' title="ajouter une image" @change='image'>
            <div v-if='fileToUpdate.size>0' class='flex column'>
                <img :src="imageUrl" alt="image importé" >
                <button @click='resetImage'>supprimer l'image</button>
            </div>
            <div class='flex row'>
                <button type="reset" @click='voidImage'>Annuler</button>
                <button type="submit" :disabled='isDisabled' @click='addPublication'>Soumettre</button>
            </div>
        </form>
    </div>
</template>

<script>
import FormData from 'form-data';

//definition de contantes
const defaultUrl='http://localhost:3000/api/publications';
//const frontDefault='http://localhost:8080'
const axios=require('axios');
const instance =axios.create({ baseURL:defaultUrl});
const MIMES_TYPES ={                
    'image/jpg' : 'jpg',           
    'image/jpeg': 'jpg',
    'image/png' : 'png'         
};

export default {
    name:'Publication',
    data(){
        return {
            imageUrl:'',
            fileToUpdate:{name:'', size:0},
            title:'',
            texte:'',
            
            message:'',
        }
    },
    created:function(){
        this.$store.state.message=this.message
    },
    computed:{
        isDisabled(){
            if(this.texte.length!=0 || this.fileToUpdate.size!=0){
                return false
        }
                return true
        }
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
            form.append('token',this.$store.state.token);
            instance.post('/addPublication',form)
                .then(res=>{
                    $this.$store.state.page='connected'
                    $this.$store.state.message=res.data.message
                    console.log('adpub',res)
                    $this.$router.push('Connected')
                })
        }
    }

}
</script>

<style scoped>
form input, form img {
    min-width: 300px;
    width: 50%;
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