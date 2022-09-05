<template>
  <div>

    <UserDetailsComp  />  <!-- PASSING THE NAME PROP TO THE USERDETAILS COMPONENT -->

  </div>
</template>

<script>
import UserDetailsComp from './components/UserDetails.vue';

  export default {
    name:'App',

    data(){
      return{
        name:'',
       
      }
    },

    components:{
    UserDetailsComp,
   },


  }
</script>

<style scoped>

</style>