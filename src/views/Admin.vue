<template>
    <div class='admin'>
        <h1>Gestion</h1>
        
<!-- ce que l'on va chercher -->
        <button @click='allUsers'>Chercher un utilisateur</button>
        <button @click='allPub'>Chercher une publication</button>
        <button @click='allComments'>Chercher un commentaire</button>
<!-- la recheche d'utilisateur -->
    <form v-if='this.$store.state.page=="user"' class='user'>
        <div>
            <input type="radio" name="userSearching" id="alpha" @click='toAlpha'>Rechercher dans le nom, prénom ou mail
            <input type="radio" name="userSearching" id="status" @click='toStatus'>rechercher par status
        </div>

        <input name="search" id="search" v-model="search">
        <ul v-if="searchMethod=='alpha'" class='searchSmall'>
            <li v-for="user in searchingUserByAlpha" :key='user.users_id'>
                <p><span>Nom : </span> {{ user.users_name }}</p>
                <p><span>Prénom : </span> {{ user.users_firstname }}</p>
                <p><span>Mail : </span> {{ user.users_mail }} </p>
                <p><span>Id : </span> {{ user.users_id }} </p>
                <p><span>Status : </span> {{ stat(user.users_status) }} </p>
                <p>Option : changer le statut de l'utilisateur
                    <select :name="user.users_id" key="newStatus" class='maskedIfBig'>
                        <option value="" selected disabled>Sélectionner</option>
                        <option value="0" >Suspendre</option>
                        <option value="1" >Normal</option>
                        <option value="2" >Admin</option>
                    </select>
                </p>
            </li>
        </ul>
        
        <ul v-if="searchMethod=='status'" class='searchSmall'>
            <li v-for="user in searchingUserByStatus" :key='user.users_id'>
                <p><span>Nom : </span> {{ user.users_name }}</p>
                <p><span>Prénom : </span> {{ user.users_firstname }}</p>
                <p><span>Mail : </span> {{ user.users_mail }} </p>
                <p><span>Id : </span> {{ user.users_id }} </p>
                <p><span>Status : </span> {{ user.users_status }} </p>
                <p>Option : changer le statut de l'utilisateur
                    <select :name="user.users_id" key="newStatus" class='maskedIfBig'>
                        <option value="" selected disabled>Sélectionner</option>
                        <option value="0" >Suspendre</option>
                        <option value="1" >Normal</option>
                        <option value="2" >Admin</option>
                    </select>
                </p>
            </li>
        </ul>


        <table class='searchMedium'>
            <thead>
                <tr>
                    <th class='blockUser'>Nom</th>
                    <th class='blockUser'>Prénom</th>
                    <th class='blockUser'>Mail</th>
                    <th class='blockUser'>Id</th>
                    <th class='blockUser'>Status</th>
                    <th class='largeBlockUser'>Option : changer le statut de l'utilisateur</th>
                </tr>
            </thead>
            <tbody v-if='this.searchMethod=="alpha"'>
                <tr  v-for="user in searchingUserByAlpha" :key='user.users_id'>
                    <td class='blockUser' :title=user.users_name> {{ user.users_name}}</td>
                    <td class='blockUser' :title=user.users_firstname> {{ user.users_firstname}}</td>
                    <td class='blockUser' :title=user.users_mail> {{ user.users_mail}}</td>
                    <td class='blockUser' :title=user.users_id> {{ user.users_id}}</td>
                    <td class='blockUser' > {{ stat(user.users_status) }}</td>
                    <td class='largeBlockUser'>                        
                        <select :name="user.users_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Suspendre</option>
                            <option value="1" >Normal</option>
                            <option value="2" >Admin</option>
                        </select>
                    </td>
                </tr>
            </tbody>
            <tbody v-if='this.searchMethod=="status"'>
                <tr  v-for="user in searchingUserByStatus" :key='user.users_id'>
                    <td class='blockUser' :title=user.users_name> {{ user.users_name}}</td>
                    <td class='blockUser' :title=user.users_firstname> {{ user.users_firstname}}</td>
                    <td class='blockUser' :title=user.users_mail> {{ user.users_mail}}</td>
                    <td class='blockUser' :title=user.users_id> {{ user.users_id}}</td>
                    <td class='blockUser' > {{ stat(user.users_status) }}</td>
                    <td class='largeBlockUser'>                        
                        <select :name="user.users_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Suspendre</option>
                            <option value="1" >Normal</option>
                            <option value="2" >Admin</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click='updateUser'>Mettre à jour les utilisateurs</button>
    </form>
<!-- publications -->
    <form v-if='this.$store.state.page=="publication"' class='pub'>
        <div>
            <input type="radio" name="publiSearching" id="alpha" @click='toAlpha'>Rechercher dans le titre, le texte, le nom d'image
            <input type="radio" name="publiSearching" id="author" @click='toAuthor'>rechercher par user id
            <input type="radio" name="publiSearching" id="status" @click='toStatus'>rechercher par status
            
        </div>
            
        <input v-if="searchMethod=='alpha'" name="publiSearch" id="alphaPub" v-model="alphaSearch">
        <input v-if="searchMethod=='author'" name="publiSearch" id="authorPub" v-model="authorSearch">
        <!--<input v-if="searchMethod=='status'" name="publiSearch" id="statusPub" v-model="statusSearch">-->
        <select v-if="searchMethod=='status'" v-model="statusSearch">
            <option value="" selected disabled>Sélectionner</option>
            <option value="0" >Modérée</option>
            <option value="1" >Normal</option>
            <!--<option value="2" >Epinglée</option>-->
        </select>
        <ul class='searchSmall bordering' v-for="pub in searchingPubicationByAlpha" :key='pub.publications_id'>
            <li>Titre : {{ pub.publications_title }}</li>
            <li>Texte : {{ pub.publications_texte }}</li>
            <li>Image : {{ pub.publications_image }}</li>
            <li>User Id {{ pub.publications_author }}</li>
            <li>Status {{ pub.publications_status }} /</li>
            <li>Changer le status
                <select :id="pub.publications_id" key="newStatus">
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
            <tbody v-if='this.searchMethod=="alpha"'>
                <tr  v-for="pub in searchingPubicationByAlpha" :key='pub.publications_id'>
                    <td class='blockPub' :title=pub.publications_title> {{ pub.publications_title }}</td>
                    <td class='blockPub' :title=pub.publications_texte> {{ pub.publications_texte }}</td>
                    <td class='blockPub' :title=pub.publications_image> {{ pub.publications_image }}</td>
                    <td class='blockPub' :title=pub.publications_author> {{ pub.publications_author }}</td>
                    <td class='blockPub' > {{ pub.publications_status}}</td>
                    <td class='largeBlockPub'>
                        <select :id="pub.publications_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Masquer</option>
                            <option value="1" >Normal</option>
                            <!--<option value="2" >Epingler</option>-->
                        </select>                  
                    </td>
                </tr>
            </tbody>
            <tbody v-if='this.searchMethod=="status"'>
                <tr  v-for="pub in searchingPublicationByStatus" :key='pub.publications_id'>
                    <td class='blockPub' :title=pub.publications_title> {{ pub.publications_title }}</td>
                    <td class='blockPub' :title=pub.publications_texte> {{ pub.publications_texte }}</td>
                    <td class='blockPub' :title=pub.publications_image> {{ pub.publications_image }}</td>
                    <td class='blockPub' :title=pub.publications_author> {{ pub.publications_author }}</td>
                    <td class='blockPub' > {{ pub.publications_status}}</td>
                    <td class='largeBlockPub'>
                        <select :id="pub.publications_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Masquer</option>
                            <option value="1" >Normal</option>
                            <!--<option value="2" >Epingler</option>-->
                        </select>
                    </td>
                </tr>
            </tbody>
        <tbody v-if='this.searchMethod=="author"'>
                <tr  v-for="pub in searchingPublicationByAuthor" :key='pub.publications_id'>
                    <td class='blockPub' :title=pub.publications_title> {{ pub.publications_title }}</td>
                    <td class='blockPub' :title=pub.publications_texte> {{ pub.publications_texte }}</td>
                    <td class='blockPub' :title=pub.publications_image> {{ pub.publications_image }}</td>
                    <td class='blockPub' :title=pub.publications_author> {{ pub.publications_author }}</td>
                    <td class='blockPub' > {{ pub.publications_status}}</td>
                    <td class='largeBlockPub'>
                        <select :id="pub.publications_id" key="newStatus">
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
<!-- commentaires -->
    <form v-if='this.$store.state.page=="comments"' class='comment'>
        <!-- paramètres de recherche -->
        <div>
            <input type="radio" name="commentSearching" id="alpha" @click='toAlpha'>Rechercher dans le texte, le nom, le prénom l'utilisateur
            <input type="radio" name="commentSearching" id="author" @click='toId'>rechercher par comment id
            <input type="radio" name="commentSearching" id="author" @click='toAuthor'>rechercher par user id
            <input type="radio" name="commentSearching" id="publication" @click='toPublication'>rechercher par publication id
            <input type="radio" name="commentSearching" id="status" @click='toStatus'>rechercher par status
            
        </div>
            
        <input v-if="searchMethod=='alpha'" name="commentSearch" id="alphaComments" v-model="alphaSearch">
        <input v-if="searchMethod=='author' || searchMethod=='publication' || searchMethod=='id'" name="commentSearch" id="authorComments" v-model="authorSearch">

        <select v-if="searchMethod=='status'" v-model="statusSearch">
            <option value="" selected disabled>Sélectionner</option>
            <option value="0" >Modérée</option>
            <option value="1" >Normal</option>
            <!--<option value="2" >Epinglée</option>-->
        </select>
    <!-- résultat -->
        <div class='searchSmall'  v-if='this.searchMethod=="alpha"' >
            <div v-for="com in searchingCommentsByAlpha" :key='com.comments_id' class='commentCss'>
                <div class='grilleId'>
                    <div class='IdCellOneOne'>Comment Id</div>
                    <div class='IdCellOneTwo'>Publication Id</div>
                    <div class='IdCellOneThree'>User Id</div>
                    <div class='IdCellTwoOne'>{{ com.comments_id }}</div>
                    <div class='IdCellTwoTwo'>{{ com.comments_publication }}</div>
                    <div class='IdCellTwoThree'>{{ com.comments_author }}</div>
                </div>
                <p>Texte : {{ com.comments_texte }}</p>
                <div class='grilleStatus'>
                    <div class='statusOneOne'>Status actuel</div>
                    <div class='statusOneTwo'>Changer le statut</div>
                    <div class='statusTwoOne'>{{ com.comments_status}}</div>
                    <div class='statusTwoTwo'>
                        <select :id="com.comments_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Masquer</option>
                            <option value="1" >Normal</option>
                            <!--<option value="2" >Epingler</option>-->
                        </select>
                    </div>
                </div>
            </div>
        </div>
        
        <div class='searchSmall'  v-if='this.searchMethod=="author"' >
            <div v-for="com in searchingCommentsByAuthor" :key='com.comments_id' class='commentCss'>
                <div class='grilleId'>
                    <div class='IdCellOneOne'>Comment Id</div>
                    <div class='IdCellOneTwo'>Publication Id</div>
                    <div class='IdCellOneThree'>User Id</div>
                    <div class='IdCellTwoOne'>{{ com.comments_id }}</div>
                    <div class='IdCellTwoTwo'>{{ com.comments_publication }}</div>
                    <div class='IdCellTwoThree'>{{ com.comments_author }}</div>
                </div>
                <p>Texte : {{ com.comments_texte }}</p>
                <div class='grilleStatus'>
                    <div class='statusOneOne'>Status actuel</div>
                    <div class='statusOneTwo'>Changer le statut</div>
                    <div class='statusTwoOne'>{{ com.comments_status}}</div>
                    <div class='statusTwoTwo'>
                        <select :id="com.comments_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Masquer</option>
                            <option value="1" >Normal</option>
                            <!--<option value="2" >Epingler</option>-->
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class='searchSmall'  v-if='this.searchMethod=="publication"' >
            <div v-for="com in searchingCommentsByPublication" :key='com.comments_id' class='commentCss'>
                <div class='grilleId'>
                    <div class='IdCellOneOne'>Comment Id</div>
                    <div class='IdCellOneTwo'>Publication Id</div>
                    <div class='IdCellOneThree'>User Id</div>
                    <div class='IdCellTwoOne'>{{ com.comments_id }}</div>
                    <div class='IdCellTwoTwo'>{{ com.comments_publication }}</div>
                    <div class='IdCellTwoThree'>{{ com.comments_author }}</div>
                </div>
                <p>Texte : {{ com.comments_texte }}</p>
                <table class='grilleStatus'>
                    <tr>
                        <td>Status actuel</td>
                        <td>Changer le statut</td>
                    </tr>
                    <tr>
                        <td>{{ com.comments_status}}</td>
                        <td><select :id="com.comments_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Masquer</option>
                            <option value="1" >Normal</option>
                            <!--<option value="2" >Epingler</option>-->
                        </select></td>
                    </tr>
                </table>
            </div>
        </div>

        <div class='searchSmall'  v-if='this.searchMethod=="id"' >
            <div v-for="com in searchingCommentsById" :key='com.comments_id' class='commentCss'>
                <div class='grilleId'>
                    <div class='IdCellOneOne'>Comment Id</div>
                    <div class='IdCellOneTwo'>Publication Id</div>
                    <div class='IdCellOneThree'>User Id</div>
                    <div class='IdCellTwoOne'>{{ com.comments_id }}</div>
                    <div class='IdCellTwoTwo'>{{ com.comments_publication }}</div>
                    <div class='IdCellTwoThree'>{{ com.comments_author }}</div>
                </div>
                <p>Texte : {{ com.comments_texte }}</p>
                <div class='grilleStatus'>
                    <div class='statusOneOne'>Status actuel</div>
                    <div class='statusOneTwo'>Changer le statut</div>
                    <div class='statusTwoOne'>{{ com.comments_status}}</div>
                    <div class='statusTwoTwo'>
                        <select :id="com.comments_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Masquer</option>
                            <option value="1" >Normal</option>
                            <!--<option value="2" >Epingler</option>-->
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class='searchSmall'  v-if='this.searchMethod=="status"' >
            <div v-for="com in searchingCommentsByStatus" :key='com.comments_id' class='commentCss'>
                <div class='grilleId'>
                    <div class='IdCellOneOne'>Comment Id</div>
                    <div class='IdCellOneTwo'>Publication Id</div>
                    <div class='IdCellOneThree'>User Id</div>
                    <div class='IdCellTwoOne'>{{ com.comments_id }}</div>
                    <div class='IdCellTwoTwo'>{{ com.comments_publication }}</div>
                    <div class='IdCellTwoThree'>{{ com.comments_author }}</div>
                </div>
                <p>Texte : {{ com.comments_texte }}</p>
                <div class='grilleStatus'>
                    <div class='statusOneOne'>Status actuel</div>
                    <div class='statusOneTwo'>Changer le statut</div>
                    <div class='statusTwoOne'>{{ com.comments_status}}</div>
                    <div class='statusTwoTwo'>
                        <select :id="com.comments_id" key="newStatus">
                            <option value="" selected disabled>Sélectionner</option>
                            <option value="0" >Masquer</option>
                            <option value="1" >Normal</option>
                            <!--<option value="2" >Epingler</option>-->
                        </select>
                    </div>
                </div>
            </div>
        </div>


        <table class='searchMedium'>
            <thead>
                <tr>
                    <th class='commentBlock'>Id</th>
                    <th class='commentBlock'>Texte</th>
                    <th class='commentBlock'>Publication</th>
                    <th class='commentBlock'>Auteur</th>
                    <th class='commentBlock'>User id</th>
                    <th class='commentBlock'>Status</th>
                    <th class='LargeCommentBlock'>Option</th>
                </tr>
            </thead>
            <tbody v-if='this.searchMethod=="alpha"'>
                <tr  v-for="com in searchingCommentsByAlpha" :key='com.comments_id'>
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
                            <!--<option value="2" >Epingler</option>-->
                        </select>                  
                    </td>
                </tr>
            </tbody>
            <tbody v-if='this.searchMethod=="author"'>
                <tr  v-for="com in searchingCommentsByAuthor" :key='com.comments_id'>
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
                            <!--<option value="2" >Epingler</option>-->
                        </select>                  
                    </td>
                </tr>
            </tbody>
            <tbody v-if='this.searchMethod=="publication"'>
                <tr  v-for="com in searchingCommentsByPublication" :key='com.comments_id'>
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
                            <!--<option value="2" >Epingler</option>-->
                        </select>                  
                    </td>
                </tr>
            </tbody> 
            <tbody v-if='this.searchMethod=="id"'>
                <tr  v-for="com in searchingCommentsById" :key='com.comments_id'>
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
                            <!--<option value="2" >Epingler</option>-->
                        </select>                  
                    </td>
                </tr>
            </tbody>
            <tbody v-if='this.searchMethod=="status"'>
                <tr  v-for="com in searchingCommentsByStatus" :key='com.comments_id'>
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
                            <!--<option value="2" >Epingler</option>-->
                        </select>                  
                    </td>
                </tr>
            </tbody>
        
        </table>
        <button @click='updateComments'>Mettre à jour les commentaires</button>
    </form>
    </div>
</template>

<script>/*
import Admin from '../../../groupomania/src/views/Admin.vue';
import User from '../components/User.vue'
import Publication from '../components/Publication.vue'
import AdminComment from '../components/AdminComment.vue'
*/
const defaultUrl='http://localhost:3000/api/admin';
const axios=require('axios');
const instance =axios.create({ baseURL:defaultUrl});
export default {
    name:'Admin',
    data(){
        return{
            search:'',

            searched:'',
            searchMethod:'',
            alphaSearch:'',
            statusSearch:'',
            authorSearch:'',

            recherche:'',
            listed:{},
            alt:['Suspendu','Normal','Administrateur']
        }
        
    },
/*    components:{
        AdminComment,
    },
*/
    created:function(){  
        console.log(this.listed)
    },
    computed:{
    //for user
        searchingUserByAlpha(){
            let alphaSearch=this.search;
            console.log(this.searchMethod)
            if(alphaSearch==''){
                return this.listed;
            }
            else{
                return this.listed.filter(personne =>{return personne.users_firstname.toLowerCase().match(alphaSearch.toLowerCase()) !==null || personne.users_name.toLowerCase().match(alphaSearch.toLowerCase()) !==null || personne.users_mail.toLowerCase().match(alphaSearch.toLowerCase()) !==null;})
            }
        },
        searchingUserByStatus(){
            let statusSearch=this.search;
            console.log(this.searchMethod)
            if(statusSearch==''){
                return this.listed
            }
            else{
                return this.listed.filter(personne =>{return personne.users_status==statusSearch;})
            }
        },
    //for publications
        searchingPubicationByAlpha(){
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

    //commentaires
        searchingCommentsByAlpha(){
            console.log(this.searchMethod)
            if(this.alphaSearch==''){
                return this.listed;
            }
            else{
                return this.listed.filter(com =>{return com.comments_texte.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null || com.users_name.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null || com.users_firstname.toLowerCase().match(this.alphaSearch.toLowerCase()) !==null;})
            }
        },
        searchingCommentsByAuthor(){
            console.log(this.searchMethod)
            if(this.authorSearch==''){
                console.log('comments author search vide')
                return this.listed
            }
            else{
            
                console.log('comments author search', this.authorSearch);
                return this.listed.filter(comm =>{return comm.comments_author==this.authorSearch;})
            }
        },
        searchingCommentsByPublication(){
            console.log('comment pub :', this.searchMethod, this.authorSearch)
            if(this.authorSearch==''){
                console.log('comments author search vide')
                return this.listed
            }
            else{
                return this.listed.filter(comm =>{return comm.comments_publication==this.authorSearch ;})
            }
        },
        searchingCommentsById(){
            if(this.authorSearch==''){
                return this.listed
            }
            else{
                return this.listed.filter(comm =>{return comm.comments_id==this.authorSearch ;})
            }
        },
        searchingCommentsByStatus(){
            console.log('searching status',this.statusSearch)
            if(this.statusSearch==''){
                return this.listed;
            }
            else{
                return this.listed.filter(comm =>{return comm.comments_status==this.statusSearch;})
            }
        },
    },
    methods:{
    //type de recherche
        toAlpha(){
            this.searchMethod='alpha';
        },
        toStatus(){
            this.searchMethod='status'
        },
        toAuthor(){
            this.searchMethod='author'
        },
        toPublication(){
            this.searchMethod='publication'
        },
        toId(){
            this.searchMethod='id'
        },
    //remplacement du type de status
        stat(value){
            if(value>=0 && value<=2){
                return this.alt[value]
            }
            return 'anomalie'
        },
    //récupération des users
        allUsers(){
            this.searched='users';
            let $this=this
            this.$store.dispatch('getAllUsers')
            .then(res=>{
                
                $this.$store.state.page='user';
                $this.$router.push('Admin');
                $this.listed=this.$store.state.administredList  
                console.log('admin all user post dispatch then',res,' page ',$this.$store.state.page,' list ',$this.listed)
            })
            .catch(err=>console.log(err))
        },
    //récupération des publications
        allPub(){
            this.searched='publications';
            let $this=this

            this.$store.dispatch('getAllPubs')
            .then(res=>{
                $this.$store.state.page='publication';
                $this.$router.push('Admin'); 
                $this.listed=this.$store.state.administredList
                console.log('admin all pub post dispatch then',res,' page ',$this.$store.state.page,' list ',$this.listed) 
            })
            .catch(err=>console.log(err))
        },
    //récupération des commentaires
        allComments(){
            this.searched='comments';
            let $this=this

            this.$store.dispatch('getAllComments')
            .then(res=>{
                $this.$store.state.page='comments';
                $this.$router.push('Admin');
                $this.listed=this.$store.state.administredList  
                console.log('admin all user post dispatch then',res,' page ',$this.$store.state.page,' list ',$this.listed)
            })
            .catch(err=>console.log(err))
        },//fin get all comments
    //mise à jour du status des utilisateurs
        updateUser(e){
            e.preventDefault();
            let $this=this;
            let list=document.getElementsByTagName('select');
            let listed=[];
            
            console.log(list);
            for(let i=0;i<list.length;i++){
                let opt={};    
                
                opt.name=list[i].name;
                opt.value=list[i].value
                listed.push(opt)
                console.log('longueur: ',list.length,' indice: ',i,' nom: ',list[i].name, ' valeur: ',list[i].value,' objet: ',opt,'liste agrégée :',listed)
            }
    
            instance.put('/userUpdate',{users:listed},{headers:{'Authorization': `bearer ${this.$store.state.token}`}})
            .then(res=>{
                console.log(res)
                $this.$store.state.page='connected';
                $this.$router.push('Connected');
            })
            .catch(err=>{
                console.log(err)
            })
        },//fin update user
        //mise à jour du status des publications
        updatePublication(e){
            e.preventDefault();
            let $this=this;
            let list=document.getElementsByTagName('select');
            let listed=[];
            
            console.log(list);
            for(let i=0;i<list.length;i++){
                let opt={};    
                
                opt.id=list[i].id;
                opt.value=list[i].value
                listed.push(opt)
                console.log('longueur: ',list.length,' indice: ',i,' nom: ',list[i].name, ' valeur: ',list[i].value,' objet: ',opt,'liste agrégée :',listed)
            }
    
            instance.put('/publicationUpdate',{publications:listed},{headers:{'Authorization': `bearer ${this.$store.state.token}`}})
            .then(res=>{
                console.log(res)
                $this.$store.state.page='connected';
                $this.$router.push('Connected');
            })
            .catch(err=>{
                console.log(err)
            })
        }, //fin update publication     
        updateComments(e){
            e.preventDefault();
            let $this=this;
            let list=document.getElementsByTagName('select');
            let listed=[];
            
            console.log(list);
            for(let i=0;i<list.length;i++){
                let opt={};    
                
                opt.id=list[i].id;
                opt.value=list[i].value
                listed.push(opt)
                console.log('longueur: ',list.length,' indice: ',i,' nom: ',list[i].name, ' valeur: ',list[i].value,' objet: ',opt,'liste agrégée :',listed)
            }
    
            instance.put('/commentsUpdate',{commentaire:listed},{headers:{'Authorization': `bearer ${this.$store.state.token}`}})
            .then(res=>{
                console.log(res)
                $this.$store.state.page='connected';
                $this.$router.push('Connected');
            })
            .catch(err=>{
                console.log(err)
            })
        }, //fin update commentaires
    }
}
</script>

<style scoped>
.admin{
    width: 300px;
    margin: auto;
    background: silver;
}

.admin div{
    width: 100%;
}

ul, li{
    margin:0;
    padding: 0;
}

li{
    list-style: none;
}



tr{
    
    margin:5px 0;
    background: grey;
}

td{
    height:20px;
    overflow:auto;
    text-overflow:inherit;
}

.user{
    background: greenyellow;
}

.user td{
    background: white;
}

span{
    background: grey;
}

.bordering{
    border:1px solid black;
    margin:5px 0;
    background: none;
}


@media screen and (max-width: 680px) {
    .searchSmall{
        background: silver;
    }
    
    .searchSmall li{
        width:100%;
        margin: 5px 0;
        background: wheat;
        text-align: justify;
    }

    .searchSmall li p{
        width: 95%;
    }

    .searchSmall li span{
        display: inline-block;
        width:80px;
    }

    .commentCss{
        background: white;
        margin:5px 0;
        text-align: justify;
        border:1px solid black;
        border-radius:20px;
    }

    .commentCss p{
        margin:0;
        padding: 0;
    }

    .grilleId, .grilleStatus{
        width: 100%;
        text-align: center;
    }


    .grilleId{
        display: grid;
        grid-template-columns: repeat(3,1fr);
        grid-template-rows: repeat(2,1fr);
        grid-gap: 5px;
    }

    .IdCellOneOne, .IdCellOneTwo,.IdCellOneThree, .statusOneOne,.statusOneTwo{
        background: silver;
    }

    .IdCellOneOne{
        border-radius: 20px 0 0 0;
        grid-column: 1 / 2;
        grid-row: 1 / 2;
    }
    .IdCellOneTwo{
        grid-column: 2 / 3;
        grid-row: 1 / 2;
    }
    .IdCellOneThree{
        border-radius: 0 20px 0 0;
        grid-column: 3 / 4;
        grid-row: 1 / 2;
    }
    .IdCellTwoOne{
        grid-column: 1 / 2;
        grid-row: 2 / 3;
    }
    .IdCellTwoTwo{
        grid-column: 2 / 3;
        grid-row: 2 / 3;
    }
    .IdCellTwoThree{
        grid-column: 3 / 4;
        grid-row: 2 / 3;
    }

    .grilleStatus{
        display: grid;
        grid-template-columns: repeat(2,1fr);
        grid-template-rows: repeat(2,1fr);
    }
    .statusOneOne{
        grid-column: 1 / 2;
        grid-row: 1 / 2;
    }
    .statusOneTwo{
        grid-column: 2 / 3;
        grid-row: 1 / 2;
    }
    .statusTwoOne{
        border-radius: 0 0 0 20px;
        grid-column: 1 / 2;
        grid-row: 2 / 3;
    }
    .statusTwoTwo{
        border-radius: 0 0 20px 0;
        grid-column: 2 / 3;
        grid-row: 2 / 3;
    }

    .searchMedium{
        display: none;
    }
}

@media screen and (min-width: 681px) {
    .admin{
        width:600px;
        margin: auto;
    }
    .searchSmall,.maskedIfBig{
        display: none;
    }

    .searchMedium{
        background: silver;
        width: 100%;
    }

    
    .blockUser,.largeBlockUser{
        display: inline-block;
        box-sizing: border-box;
        word-wrap: break-word;
        
    }   

    .blockUser, .blockPub{
        width:15%;
    }
    .largeBlockUser, .largeBlockPub{
        width:25%
    }

    tbody .blockUser, tbody .largeBlockUser{
        background: pink;
    }

    tbody .blockPub, tbody .largeBlockPub{
        background: greenyellow;
    }
}
</style>
