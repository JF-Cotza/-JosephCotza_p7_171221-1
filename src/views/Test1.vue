<template>
    <div>
        test1
        <form action="http://localhost:3000/api/auth/addUSer" method="post" enctype="multipart/form-data">
            <input type="text" name="name" id="name">
            <input type="text" name="firstname" id="firstname">
            <input type="email" name="email" id="email">
            <input type="text" name="password" id="password">
            <button type="reset">annuler</button>
            <button type="submit" @click="add">envoyer</button>
        
        </form>

    </div>
</template>

<script>
    import FormData from 'form-data';
    const defaultUrl='http://localhost:3000/api';
    const axios=require('axios');
    const instance =axios.create({
    baseURL:defaultUrl
    });


export default {
    name:'test1',
    methods:{
        add(e){            
            e.preventDefault();
            let form=new FormData();
            let $this=this;
            form.append('name',document.getElementById('name').value);
            form.append('firstname',document.getElementById('firstname').value);
            form.append('email',document.getElementById('email').value);
            form.append('password',document.getElementById('password').value);
                        
            console.log('form',form)
            //return new Promise ((resolve, reject)=>{
            instance.post('/auth/addUser', form)
                .then(function(res){
                    console.log(res.data.message) 
                    if(res.data.code==500){
                        console.log('res add if ', res)
                        $this.$router.push('http://localhost:8000/test1')
                    }
                    else{
                    console.log('res add else',res);
                    //resolve(res);
                    $this.$router.push('http://localhost:8000/')
                    }
                })
                .catch(function(error){//ne marche pas ?
                    console.log('erreur ajout ',error)
                    //reject(error);
                    $this.$router.push('http://localhost:8000/test1')
                })
           // })
        }
    }
}
</script>