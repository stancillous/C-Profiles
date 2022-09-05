<template>
    <div>

        <p class="prompt-msg">Enter github username</p>

        <input v-model="user" @keyup.enter="$emit('fetchUser',user)"  autofocus class="username-input" type="text" placeholder="eg  stancillous">

    </div>
</template>

<script>
    export default {
        name:'HomePage',
        data(){
            return{
                user:''
            }
        },  

        emits:['fetchUser']
        


    }
</script>

<style scoped>

    div{
        text-align: center;
        margin-top: 3rem;
    }

    .prompt-msg{
        font-size: 2rem;
        font-family: "Satoshi", sans-serif, "General Sans", sans-serif;
        font-weight: bold;
        padding: 1rem 0;

    }

    .username-input{
    padding: 1rem 2rem;
    border: 1px solid black;
    border-radius: .3rem;
    font-family: "Satoshi", sans-serif, "General Sans", sans-serif;
    font-weight: 800;
    color: black;
    background-color: whitesmoke;
    outline: none;
    border-top-style: hidden;
    border-right-style: hidden;
    border-left-style: hidden;

    }

</style>