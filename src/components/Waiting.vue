<template>
    <div class='fix'>
        <div >
            <p class='anim'>chargement en cours</p>
        </div>
        <span class='rotate'><img src="../assets/icon.svg" alt=""></span>
    </div>
</template>

<script>
export default {
    name:'Waiting'
}
</script>

<style scope>
.fix{
    position: relative;
}

.anim{
    position: absolute;
    top:130px;
    left:50px;
    z-index: 1;
    display: inline-block;
    width: 170px;
    height: 20px;
    border-radius: 50px 10px ;
    animation: keys 5s ;
    animation-iteration-count:infinite;
}

.rotate img{
    width:10%;
    background: none;
    border-radius: 50%;
    border:1px solid black;
}

.rotate{
    position: absolute;
    top:0;
    left:0;
    z-index: 2;
    display: inline-block;
    width: 290px;
    height: 290px;
    transform-origin: center;
    animation: rotation 5s;
    animation-iteration-count:infinite;
    animation-direction:alternate;
}




@keyframes keys{
    0%{
        background-color:red;
    }
    50%{
        background-color:silver;
    }
    75%{
        background-color: green;
    }
    100%{
        background-color: yellow;    
    }
}

@keyframes rotation{
    from {
        rotate: 10deg;
    }
    to{
        rotate:350deg;
    }
}
</style>