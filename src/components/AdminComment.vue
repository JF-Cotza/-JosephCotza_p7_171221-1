<template>
        <tr v-for="com in commentList" :key='com.comments_id'>
            <td class='commentBlock' :title=com.comments_id> {{ com.comments_id }}</td>
            <td class='commentBlock' :title=com.comments_texte> {{ com.comments_texte }}</td>
            <td class='commentBlock' :title=com.comments_publication> {{ com.comments_publication }}</td>
            <td class='commentBlock' :title="com.users_name+' '+com.users_firstname"> {{ com.users_name+' '+com.users_firstname }}</td>
            <td class='commentBlock' :title=com.comments_author> {{ com.comments_author }}</td>
            <td class='commentBlock' > {{ com.comments_status }}</td>
            <td class='largeCommentBlock'>
                <select :id="com.comments_id" key="newStatus">
                    <option value="" selected disabled>Sélectionner</option>
                    <option value="0" >Masquer</option>
                    <option value="1" >Normal</option>
                    <option value="2" >Epingler</option>
                </select>                  
            </td> 
        </tr>
</template>

<script>
export default ({
    name:'AdminComment',
    props:{
        commentList:Object,
    }
})
</script>

<style>
.commentBlock{
    width:12%;
}

.largeCommentBlock{
    width:28%;
}
</style>