<template>
    
    <HomePageComp  @fetchUser="getUserData"/>


    <div v-show="noError==='true'" class="userDetailsContainer">

        <div id="user-details-wrapper">

            <div class="chart-and-user-details">


                <section class="user-details-section">
        
                    <div class="user-avatar">
                        
                        <!-- ONLY SHOW THE USER IMAGE IF THE USER AVATAR VARIABLE IS NOT AN EMPTY STRING -->
                        <img v-show="userAvatar!==''" :src="userAvatar" id="user-avatar-img" alt="user image">
                    </div>
                    <div class="username">
                        <!-- ONLY SHOW THE USER FULL NAME IF THE USER_FULLNAME VARIABLE IS NOT AN EMPTY STRING -->
                        <h3 v-show="userFullname!==''" id="user-name" > {{ userFullname}}</h3>
                    </div>
                    
                    <div class="userlink">
                        <!-- ONLY SHOW THE USER GITHUB LINK IF THE USER_GITHUB_LINK VARIABLE IS NOT AN EMPTY STRING -->
                        <a v-show="userGithubLink!==''"  target="_blank" id="user-github-link" :href="userGithubLink">@{{ userLoginName}}</a>
                    </div>

                    <div class="buttons-container">

                        <div class="repos-total">
                            
                            <div class="button-container">
                                <!-- ONLY SHOW THE USER PUBLIC REPOS IF THE PUBLIC_REPOS VARIABLE IS NOT AN EMPTY STRING -->
        
                                <button v-show="publicRepos!==''" id="user-total-repos">{{ publicRepos}} <span style="display:block" >public repos</span></button>
                                <!-- <button id="user-total-repos">{{ publicRepos}} <span style="display:block" >public repos</span></button> -->
                            </div>
            
                        </div>
    
                        <div class="followers-total">
                            <div class="f-div">
                                <button v-show="followers!==''" class="followers">{{followers}} <span style="display:block" >followers</span> </button>
                            </div>
                        </div>
                    </div>
                    
                </section>

                <div class="chart-container">
                    <canvas id="chart-canvas"></canvas>
                </div>

            </div>

    
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
        <!-- MESSAGE TO B DISPLAYED WHEN USER IS NOT FOUND -->
        <h1 v-show="userNotFoundError==='true'"  class="error-message" >USER NOT FOUND :(</h1>

        <!-- MESSAGE TO BE DISPALYED WHEN USER REACHES THEIR RATE LIMIT -->
        <h1 v-show="rateLimitError==='true'" class="rateLimitError">You have reached your <a class="rate-limit-link" href="https://docs.github.com/en/rest/rate-limit" target="_blank">rate limit</a>. Try again later </h1>
    </div>

</template>

<script>
    import Chart from 'chart.js/auto';  //IMPORTING THE CHART THAT WE INSTALLED WITH NPM 

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
                followers:'',

                //THE INITIAL VARIABLE HOLDING MY CHART INFO
                //SET TO NUll
                languagesChart:null,
      
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
            
            //FUNCTION TO GET USER INFO AND REPO LANGUAGES
            getUserData(argumentFromHomePageComp){
                let initialLanguagesArray=[]

                // username that is entered and passed from the homepage comp
                this.username = argumentFromHomePageComp
                //FETCHING THE USER DETAILS AND SETTING THEM TO THE VARIBALES IN DATA ABOVE
             
                fetch(`https://api.github.com/users/${this.username}`)
                .then((res) => {
                    //RESPONSE 200
                    if(res.status===200){
                        // console.log('ok',res.status)
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

                    this.followers = info.followers
                    this.userFullname = info.name
                    this.userLoginName = info.login
                    this.userGithubLink = info.html_url
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
                                
                                // console.log(repoLanguages)

                                for(let language in repoLanguages){
                                    // console.log(language)

                                    if(initialLanguagesArray.includes(language)){
                                        // console.log('')
                                        continue
                                    }
                                    else{
                                        if(initialLanguagesArray.length<8){

                                            initialLanguagesArray.push(language)
                                            // console.log(this.initialRepoLanguages)
                                        }
                                        
                                    }


                                }

                            })
                            
                        })

                        //SET TIMEOUT
                        setTimeout(() => {

                            let languagesArray = initialLanguagesArray
                            

                            //CALL THE FUNC TO DRAW THE CHART AND PASS THE LANGUAGES ARRAY AS ARGUMENT
                            this.getChart(languagesArray)
                        }, 2000);
                    })

                    .catch((error)=>{
                        console.log(error)

                    })

                })

                .catch((error)=>{
                    console.log(error)
                })

                // //FETCHING USER FOLLOWERS
                // fetch(`https://api.github.com/users/${this.username}/followers`)
                // .then((res)=>res.json())
                // .then((info)=>{
                //     console.log(info)
                // })


            },

  


            //FUNCTION TO RENDER THE CHART
            //RECEIVES THE ARRAY OF THE USER'S LANGUAGES AS AN ARGUMENT
            getChart(languagesArray){
               
                //GLOBAL 
                Chart.defaults.color='black'
                Chart.defaults.font.size = 16;
                Chart.defaults.font.weight = 500;
                Chart.defaults.font.family = 'satoshi';

                Chart.overrides['doughnut'].plugins.legend.align = 'center'
                Chart.overrides['doughnut'].plugins.legend.position = 'bottom'

               
                //ARRAY THAT WILL HOLD THE POSSIBLE DATA VALUES FOR THE LABELS
                let dataOptions = []

                //LOOPING OVER THE LANGUAGES ARRAY AND PUSHING THE VALUE 1  FOR
                //EVERY REPO LANGUAGE AVAILABLE
                let index = 0

                while(index<languagesArray.length){
                    dataOptions.push(1)
                    index++
                }

                // console.log('data',dataOptions)

                //ARRAY THAT WILL HOLD POSSIBLE BGCOLOR OPTIONS
                let bgColorOptions = ['#d1cc2a','#68e35b','#d56ceb','#8ba9d9','#c2b280','#e89c51','#8bd9a0','plum','#eedc82']
                let bgColor=[]

                //PUSHING A COLOR FROM THE COLOR OPTIONS ARRAY FOR EACH ITEM IN THE ARRAY
                for(let key in dataOptions){
                    if(key<dataOptions.length){
                        bgColor.push(bgColorOptions[key])
                    }
                }

               

                //CHECKING TO SEE IF THERE IS AN INSTANCE OF ANY CHART
                //AND REMOVING IT IF THERE IS ANY BEFORE RENDERING ANOTHER CHART
                //WITH DIFF DATA
                if(this.languagesChart!==null){
                    this.languagesChart.destroy()
                }

                let chartCanvasElement = document.querySelector('#chart-canvas')

                //
                this.languagesChart = new Chart(chartCanvasElement,{
                    type:'doughnut',
                    data:{
                        labels:languagesArray,
                        datasets:[{
                            label:'top languages ',
                            data:dataOptions,
                            backgroundColor:bgColor,
                            borderWidth:1,
                            borderColor:'black',
                            hoverBorderWidth:2,
                            hoverBorderColor:'black'
                        }],
                
                    },
                    options:{
                        responsive:true,
                        animations:{
                            duration:1200
                        },

                        plugins:{
                            //THE TITLE
                            title:{
                                display:true,
                                text:'Top Languages',
                                font:{
                                    size:20,
                                    weight:800
                                }
                            },

                            //THE LEGEND
                            legend:{ 
                                title:{

                                },
                                
                                labels:{
                                    fontcolor:'red',
                                    boxHeight:15,
                                    boxWidth:20,
                                    padding:15,

                                    font:{
                                        weight:800,
                                        size:13
                                    }
                                }
                            },

                            layout:{
                                padding:{
                                    left:8,
                                    top:10,
                    
                                }
                            },

                        }
                
                    }
                })
            
                this.languagesChart;
   
            },


        },




    }
</script>

<style scoped >

    /* THE DIV CONTAINING THE CHART */
    .chart-container{
        margin-top: 1rem;
        /* border: 2px solid; */
        height: 30rem;
        width: 40rem;
     
    }
    
    /* THE DIV CONTAINING THE CHART AND THE USER INFO */
    .chart-and-user-details{
        padding: 4rem 0;
        /* margin-bottom: 6rem; */
        height: 100%;
        width: 100%;
        border-top: 1px solid grey;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;

    }



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


    
      
    /* THE OUTERMOST DIV*/
    .userDetailsContainer{
        text-align: center;
    }
    
    /* the div with the buttons  */
    .button-container{
        display: flex;
        align-content: center;
        justify-content: center;
    }

    /* DIV THAT WRAPS EVERY CONTENT */
    #user-details-wrapper{
        /* border: 3px solid red; */
        max-width: 110rem;
        margin: 1rem auto;
        /* text-align: center; */
    }

    /* SECTION SHOWING USER DETAILS LIKE NAME AND IMAGE */
    .user-details-section{
        padding-top: 6rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
    

    }
    /* user's avatar */
    .user-avatar{
        /* margin: 0 auto; */
        margin-bottom: 1.5rem;
        height: 24rem;
        width: 24rem;
        position: relative;
        border-radius: 50%;
    }
    /* USER IMAGE */
    .user-avatar img{
        border: 5px double rgba(0, 0, 0,.5);
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
    /* anchor link */
    .userlink #user-github-link:hover{
        text-decoration: underline;

    }

    .buttons-container{
        /* border: 1px solid; */
        margin-top: 1rem;
        display: flex;
        align-items: center;

        
    }

    /* div with the buttons */
    .buttons-container div{
        margin: 0 .4rem;

        
    }

    /* buttons */
    .buttons-container button{
        /* background-color: black; */
        /* border: none; */
        background-color: transparent;
        border: 1px solid black;
        color: rgb(0, 0, 0);
        font-weight: 900;
        margin-top: 1.4rem;
        font-size: 1.3rem;
        padding: 1.2rem 2.4rem;
        /* margin: .3rem; */
        border-radius: .2rem;

        
    }








    /* USER REPOS SECTION */
    .user-repos-section{
        padding: 1.5rem;
        margin-top: 9rem;
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
    /* repo name */
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

    /* MEDIA QUERIES */




    


</style>

<!-- CHECK THE ICONS URL -->