<template>
    <div>
        <div>
            {{ message }}
        </div>
        <div v-if='this.$store.state.page=="profile"'>
            <User />
        </div>
        <div v-if='this.$store.state.page=="create"'>
            <Publication />
        </div>
        
    </div>
</template>

<script>
import User from '../components/User.vue'
import Publication from '../components/Publication.vue'
export default {
    name:'Connected',
    data(){
        return{
            message:''
        }
    },
    components:{
        Publication,
        User
    },
    created(){
        this.$store.state.connectionStatus='connected';
        this.message=this.$store.state.message
    }
}
</script>