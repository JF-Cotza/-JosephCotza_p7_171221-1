<template>
    <div>
        <h1>Gestion</h1>
        <button>Chercher un utilisateur</button>
        <input name="userSearch" id="userSearch" v-model="userSearch">
        <div>
            <span class='block'>Nom</span> | 
            <span class='block'>Prénom</span> | 
            <span class='block'>Status</span>
        </div>
        <ul>
            <li v-for="user in searching" :key='user.users_id'>
                <span class='block'>{{ user.users_name}}</span> | 
                <span class='block'>{{ user.users_firstname}}</span> | 
                <span class='block'>{{ user.users_status}}</span>   
                </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:'Admin',
    data(){
        return{
            userSearch:'',
            recherche:'',
            userListed:{},
        }
    },
    created:function(){
        this.userListed=this.$store.state.userList
        console.log(this.userListed)
    },
    computed:{
        searching(){
            if(this.userSearch==''){
                return this.userListed
            }
            else{
                return {users_name:'toto',users_firstname:'tata', users_status:0} 
            }
            
        }
    }
        

}
</script>

<style scoped>
li{
    list-style: none;
}

.block{
    width:25%;
}
</style>
