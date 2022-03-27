<template>
    <div>
        connecté !
    </div>
</template>

<script>
export default {
    name:'Connected',
    created(){
        this.$store.state.connectionStatus='connected';
    }
}
</script>