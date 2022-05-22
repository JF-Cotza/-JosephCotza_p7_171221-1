<template>
    <div class='fix'>
        <div>
            <h2 class='anim'>chargement en cours</h2>
        </div>
        <span class='rotate'><img src="../assets/icon.svg" alt="patienter"></span>
    </div>
</template>

<script>
export default {
    name:'Waiting'
}
</script>

<style scope>
.fix{
    height: 300px;
    width: 300px;
    position: relative;
}

.fix div{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.anim{
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    z-index: 1;
    
    width: 170px;
    height: fit-content;
    border-radius: 50px 10px ;
    animation: keys;
    animation-duration: 1000;
    animation-iteration-count:4;
    display: inline-block;
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
    animation: rotation;
    animation-duration: 1500ms;
    animation-iteration-count:3;
    animation-direction:alternate;
    animation-timing-function: ease-in-out;
}

@keyframes keys{
    0%{
        background-color:red;
        color:black;
    }
    50%{
        background-color:silver;
        color:black
    }
    75%{
        background-color: green;
        color:black;
    }
    100%{
        background-color: yellow;   
        color:black; 
    }
}

@keyframes rotation{
    from {
        transform:rotate(10deg);
    }
    to{
        transform:rotate(350deg)
    }
}
</style>