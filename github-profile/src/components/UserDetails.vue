<template>
    
    <HomePageComp  @fetchUser="getUserData"/>

    <div v-show="noError==='true'" class="userDetailsContainer">

        <div id="user-details-wrapper">
            <section class="user-details-section">
    
                <div class="user-avatar">
                    <!-- <img src="../assets/githubimage.png" id="user-avatar-img" alt="user image"> -->
                    <img v-show="userAvatar!==''" :src="userAvatar" id="user-avatar-img" alt="user image">
                </div>
                <div class="username">
                    <!-- <h3 id="user-name" >Stancillous raymond</h3> -->
                    <h3 v-show="userFullname!==''" id="user-name" > {{ userFullname}}</h3>
                </div>
                
                <div class="userlink">
                    <!-- <a id="user-github-link" href="">@stancillous</a> -->
                    <a v-show="userGithubLink!==''" id="user-github-link" href="">@{{ userLoginName}}</a>
                </div>
                
                <div class="repos-total">
                    
                    <!-- <button id="user-total-repos">23 repos</button> -->
                    <div class="button-container">
    
                        <button v-show="publicRepos!==''" id="user-total-repos">{{ publicRepos}} public repos</button>
                    </div>
    
                </div>
            </section>
    
            <section class="user-repos-section">
    
                <div  class="user-repos-wrapper">

                    <div  v-for="(repo,index) in reposInfo" :key="repo.name" class="repo">

                        <a :href="repo.html_url"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                        <h3 class="repo-name">{{ repo.name}}</h3>
                        <p class="repo-description">{{ repo.description===null?'this repository has no description':repo.description }}</p>

                        
                        <ul class="languages-container" >
                            <li v-for="(key,value) in repoLang[index]" :key="key" class="language-item">{{ value }}</li>
                        </ul>

                    </div>
    
                </div>
            </section>
    
    
    
        </div>
    </div>


    <!-- THE ERRORS TO BE DISPLAUED -->
    <div class="error-div">
        <h1 v-show="userNotFoundError==='true'"  class="error-message" >USER NOT FOUND :(</h1>

        <h1 v-show="rateLimitError==='true'" class="rateLimitError">You have reached your <a class="rate-limit-link" href="https://docs.github.com/en/rest/rate-limit" target="_blank">rate limit</a>. Try again later </h1>
    </div>

</template>

<script>
    import HomePageComp from './homePage.vue'

    export default {
        name:'UserDetailsComp',
        components:{
            HomePageComp,

        },

        data(){
            return{
                // username:'',
                username:this.accountName,
                publicRepos:'',
                userAvatar:'',
                userFullname:'',
                userLoginName:'',
                userGithubLink:'',
      
                // USER REPOS INFO
                repoName:[],
                repoDescription:[],
                repoUrl:[],
                reposInfo:[],
                repoLang:[],

                noError:'true',
                //ERRORS
                userNotFoundError:'false',
                rateLimitError :'false'
  
            }
        },

        
        methods:{
            getUserData(argumentFromHomePageComp){
                this.username = argumentFromHomePageComp
                //FETCHING THE USER DETAILS AND SETTING THEM TO THE VARIBALES IN DATA ABOVE
             
                fetch(`https://api.github.com/users/${this.username}`)
                .then((res) => {

                    //RESPONSE 200
                    if(res.status===200){
                        console.log('ok',res.status)
                        this.noError = 'true'
                        this.userNotFoundError = 'false'
                        this.rateLimitError= 'false'
                        return res.json()
                    }
                    //IF USER NOT FOUND
                    else if(res.status===404){
                        this.userNotFoundError='true'
                        this.noError = 'false'
                    }
                    //REACHED RATE LIMIT ERROR
                    else if(res.status===403){
                        this.rateLimitError = 'true'
                        this.noError = 'false'
                    }
                    
                    else{
                        console.log(res.status)
                    }
                })

                .then((info) => {
                    this.userFullname = info.name
                    this.userLoginName = info.login
                    this.userGithubLink = info.url
                    this.publicRepos = info.public_repos
                    this.userAvatar = info.avatar_url


                    // FETCHING THE USER'S REPOS INFO
                    fetch(`https://api.github.com/users/${this.username}/repos`)
                    .then((res)=>res.json())
                    .then((reposData)=>{
            
                        //SETTING THE REPOSINFO ARRAY TO HAVE THE CONTENT OF REPOSDATA
                        //ie THE DATA RETURNED AFTER FETCHING THE USER REPOS
                        this.reposInfo = reposData


                        //REPOSDATA RETURNS AN ARRAY WITH ALL THE REPO INFO
                        //USE FOR EACH TO ACCESS EACH REPO ITEM INFORMATION
                        reposData.forEach((repoItem)=>{

                            this.repoName= repoItem.name

                            this.repoUrl = repoItem.html_url

                            //FETCHING LANGUAGES FOR A SPECIFIC REPO

                            fetch(`https://api.github.com/repos/${this.username}/${this.repoName}/languages`)
                            .then((res)=>res.json())
                            .then((repoLanguages)=>{

                                //EACH TIME WE ITERATE THROUGH THE LANGUAGES, IT RETURNS A SINGLE OBJECT,
                                //WE THEN ADD THE OBJECT TO THE ARRAY OF OUR REPO LANGUGES
                                this.repoLang.push(repoLanguages)
        
                            })
                            
                        })

                    })

                    .catch((error)=>{
                        console.log(error)

                    })

                })

                .catch((error)=>{
                    console.log(error)
                })



            },

        },




    }
</script>

<style scoped >

    /* ERROR MESSAGES */
    .error-div{
        text-align: center;
        margin-top: 5rem;
        /* border: 6px solid ; */
        

    }

    /* ERROS MESSAGES TO BE SHOWN */
    .error-div h1{
        font-weight: 900;
        font-size: 2rem;
        color: red;
    }

    .error-div .rateLimitError .rate-limit-link{
        color: red;
    }

    
    
    
      
    /* THIS COMPONENT'S ROOT DIV */
    .userDetailsContainer{
        text-align: center;
    }
    
    /* the div with the buttons  */
    .button-container{
        display: flex;
        align-content: center;
        justify-content: center;
    }

    #user-details-wrapper{
        /* border: 3px solid red; */
        max-width: 110rem;
        margin: 1rem auto;
        /* text-align: center; */
    }

    .user-details-section{
        padding-top: 6rem;

    }
    /* user's avatar */
    .user-avatar{
        margin: 0 auto;
        height: 16rem;
        width: 16rem;
        position: relative;
        border-radius: 50%;
    }

    .user-avatar img{

        border: 9px double rgba(0, 0, 0,.5);

        position: absolute;
        top: 0;
        left: 0;
        border-radius: inherit;

        height: 100%;
        width: 100%;
        object-fit: cover;
    }

    /* user's username */
    .username #user-name{
        font-weight: 800;
        font-size: 2.6rem;
        text-transform: capitalize;
        padding: 1rem 0;
    }

    /* anchor link */
    .userlink #user-github-link{
        color: black;
        font-weight: bold;
        text-decoration: none;
        opacity: .9;
        font-size: 1.6rem;


    }

    /* button */
    .repos-total #user-total-repos{
        background-color: black;
        color: white;
        font-weight: 900;
        margin-top: 1.4rem;
        font-size: 1.3rem;
        padding: 1.4rem 3rem;
        border: none;
        border-radius: .2rem;
    }

    /* USER REPOS SECTION */
    .user-repos-section{
        padding: 1.5rem;
        margin-top: 5rem;
        text-align: left;  

    }

    .user-repos-section .user-repos-wrapper{
        display: grid;
        /* grid-template-columns: 1fr 1fr 1fr; */
        grid-template-columns: repeat(auto-fill,minmax(30rem,1fr));
        grid-gap: 1.8rem;
    }

    /* EACH REPO DIV */
    .user-repos-section .user-repos-wrapper .repo{
        border: 1px solid rgba(3, 50, 94,.7);
        position: relative;
        padding: 1rem 3rem;
    }
    
    /* THE ICON ON THE REPO DIVS */
    .user-repos-section .user-repos-wrapper .repo a i{
        font-size: 1.8rem;
        color: black;
        position: absolute;
        left: 0;
        margin: .6rem;
        top: 0;

    }
    .user-repos-section .user-repos-wrapper .repo h3{
        padding-top: 2.5rem;
        padding-bottom: 1rem;
        font-size: 1.8rem;
        font-weight: 800;
    }
    .user-repos-section .user-repos-wrapper .repo p{
        font-weight: 600;
        font-size: 1.4rem;
    }


    /* THE UL AND LI TAGS */
    .user-repos-section .user-repos-wrapper .repo .languages-container .language-item{
        list-style: none;
        padding: 0 .5rem;
        display: inline-block;
        margin-top: 2rem;
        text-transform: uppercase;
        font-size: 1.2rem;
        padding-bottom: .1rem;

    }
    


</style>