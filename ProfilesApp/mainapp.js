

//FUNCTION TO INITIALIZE THE CURSOR FOLLOWER
function InitCursor(){
    MouseFollower.registerGSAP(gsap);

    const cursor = new MouseFollower({
        el: null,
        opacity:.4,
        container: document.body,
        className: 'mf-cursor',
        innerClassName: 'mf-cursor-inner',
        textClassName: 'mf-cursor-text',
        mediaClassName: 'mf-cursor-media',
        mediaBoxClassName: 'mf-cursor-media-box',
        iconSvgClassName: 'mf-svgsprite',
        iconSvgNamePrefix: '-',
        iconSvgSrc: '',
        dataAttr: 'cursor',
        hiddenState: '-hidden',
        textState: '-text',
        iconState: '-icon',
        activeState: '-active',
        mediaState: '-media',
        stateDetection: {
            '-pointer': 'a,button',
            '-hidden': 'iframe'
        },
        visible: true,
        visibleOnState: false,
        speed: 0.55,
        ease: 'expo.out',
        overwrite: true,
        skewing: 2,
        skewingText: 2,
        skewingIcon: 2,
        skewingMedia: 2,
        skewingDelta: 0.001,
        skewingDeltaMax: 0.15,
        stickDelta: 0.15,
        showTimeout: 20,
        hideOnLeave: true,
        hideTimeout: 300,
        hideMediaTimeout: 300
    });
}

InitCursor()
//SELECTING THE DOM ELEMENTS

// const userAvatar = document.querySelector('.user-avatar')

const userName = document.querySelector('.user-name')

const userLink= document.querySelector('.user-link') //the link that goes to the users profile

//span showing the total repos
const totalRepos= document.querySelector('.total-repos')


//THE PARENT TO THE REPO ELEMENT DIVS  WHERE WE'LL APPEND THE REPO ELEMENT CONTAINER
const repoDivParent = document.querySelector('.repos-div-parent')



//FUNCTION TO GET USERNAME FROM THE FORM ON THE PREVIOUS PAGE
function getUsername(){
    //GETTING THE USERNAME FROM THE FORM INPUT 
    const user = window.location.search

    //SPLICE TO GET THE USERNAME WITHOUR THE PARAMETERS
    let username = user.slice(10, user.length+1)

    getUserDetails(username)  //CALLING THE GET USER DETAILS FUNCTION
                                //AND PASSING THE USENAME AS ARGUMENT
}

getUsername()  

//FUNCTION TO GET USER DETAILS WHEN THE BUTTON IS CLICKED
function getUserDetails(username){

     //CALLING THE FUNCTION  TO GET USER REPOS DETAILS
    userRepos(username) 

    let apiUrl = `https://api.github.com/users/${username}`


    fetch(apiUrl)
    .then(response =>response.json())

    .then((data)=>{
        
        
        //CHECKING IF THE USER IS FOUND
        //IF NOT,CREATE DIV AND APPEND ERROR MSG TO IT
        if(data.message){
        
    
            let errorDiv = document.createElement('div')
            errorDiv.setAttribute('class','user-not-found')
            errorDiv.textContent = 'USER NOT FOUND :(' 
            document.body.append(errorDiv)
        }
        

        //IF USER IS FOUND, THE FOLLOWING TO BE COMPILED
        else{
            userRepos(username)   //CALLING THE GET USER REPO FUNCTION ONLY IF THE USENAME IS FOUND


            //CREATING AN IMAGE ELEMENT FOR THE USERS AVATAR
            let userAvatar = document.createElement('img')
            userAvatar.setAttribute('class','user-avatar')
            userAvatar.src = data.avatar_url
            document.querySelector('.profile').append(userAvatar)  //APPEND THE IMAGE TO THIS DIV

            userName.textContent = data.name   //FULL NAME OF THE USER
            userLink.textContent = '@' +data.login   //USER'S GGITHUB USERNAME
            userLink.href = `https://github.com/${username}`  //LINK TO THE USER'S GITHUB PROFILE


            let button = document.createElement('button')
            button.setAttribute('id','repos')

            document.querySelector('.button-container').append(button)
      
      
            let reposNumber = document.createElement('span')
            reposNumber.setAttribute('class','total-repos')
            reposNumber.textContent = data.public_repos +' repositories'  //TOTAL REPOS OF THE USER

            button.append(reposNumber)


            // totalRepos.textContent = data.public_repos +' repositories'  //TOTAL REPOS OF THE USER

    
   
        }
    

    })


}




//FUNCTION TO FETCH THE USER REPOS AND LANGUAGES FOR THE REPO
function userRepos(username){

    let userReposApi = `https://api.github.com/users/${username}/repos`


    fetch(userReposApi)
    .then(reposResponse => reposResponse.json())

    //implement this function after getting the data
    .then((info)=>{  ///info is the data for the repos


        

        //index to keep track of current iteration 
        let index = 0  

        //for each repository itreation, create the following elements
        info.forEach((item)=>{

            let activeRepo =info[index]  //current repo index. starting at 0

            //CREATING H1
            let h1 = document.createElement('h1')
            h1.setAttribute('class','repo-name')
            h1.textContent = activeRepo.name


            //CREATING P TAG
            let p = document.createElement('p')
            p.setAttribute('class','repo-description')

            if(activeRepo.description===null){
                p.textContent = 'this repository has no description'
            }
            else{
                p.textContent = activeRepo.description

            }


            //CREATING THE A TAG THAT WILL DIRECT USERS TO THE SPECIFIC REPO INSIDE GITHUB  

            let repoLink = document.createElement('a')
            repoLink.setAttribute('class','repo-link')
            repoLink.innerHTML = `<i id="icon" class="fa-solid fa-folder"></i>` //ADDING ICON INSIDE THE ANCHOR TAG

            //SETTING HREFS TO THE ANCHOR TAGS ie. 
            // THE FOLDER ICON ON THE TOP OF 
            // EACH REPO . WHEN CLICKED, WILL GO TO THIS URL
            repoLink.href = activeRepo.html_url


            //CREATING THE DIV TO WHICH THE ABOVE ELEMENTS WILL BE APPENDED
            let repoElementDiv = document.createElement('div')
            repoElementDiv.setAttribute('class','repo-element')
            repoElementDiv.append(h1,p,repoLink)


            // repoDivParent.appendChild(repoElementDiv) //append the elements to this div
            repoDivParent.append(repoElementDiv) //append the elements to this div
        
            //FETCHING THE LANGUAGES OF THE SPECIFIC REPO AND ADDING THEM TO THE CREATED LIST INSIDE THAT REPOSITORY
         
            let repoName = h1.textContent  //value of the h1 that we assigned up there

            let languageApiUrl = `https://api.github.com/repos/${username}/${repoName}/languages`

            fetch(languageApiUrl)
            .then(res => res.json())
            .then((languagesInfo)=>{
                // console.log(languagesInfo);

                for(let i in languagesInfo){

                    let li = document.createElement('li')
                    li.setAttribute('class','list-item')
                    li.textContent = i

                    // console.log(li);
                    repoElementDiv.append(li)  //APPENDING THE LIST ITEM TO THAT REPOSITORY
                }

            })


            index++ //incrementing the index until we iterate over the last repo
            
        })

    })

}







//IGNORE THIS

// function useXHR(){

//     // Get the GitHub username input form
// const gitHubForm = document.getElementById('gitHubForm');

// // Listen for submissions on GitHub username input form
// gitHubForm.addEventListener('submit', (e) => {

//     // Prevent default form submission action
//     e.preventDefault();

//     // Get the GitHub username input field on the DOM
//     let usernameInput = document.getElementById('usernameInput');

//     // Get the value of the GitHub username input field
//     let gitHubUsername = usernameInput.value;

//     // Run GitHub API function, passing in the GitHub username
//     requestUserRepos(gitHubUsername);

// })


// function requestUserRepos(username) {

//     // Create new XMLHttpRequest object
//     const xhr = new XMLHttpRequest();

//     // GitHub endpoint, dynamically passing in specified username
//     const url = `https://api.github.com/users/${username}/repos`;

//     // Open a new connection, using a GET request via URL endpoint
//     // Providing 3 arguments (GET/POST, The URL, Async True/False)
//     xhr.open('GET', url, true);

//     // When request is received
//     // Process it here
//     xhr.onload = function() {

//         // Parse API data into JSON
//         const data = JSON.parse(this.response);
//         let root = document.getElementById('userRepos');
//         while (root.firstChild) {
//             root.removeChild(root.firstChild);
//         }
//         if (data.message === "Not Found") {
//             let ul = document.getElementById('userRepos');

//             // Create variable that will create li's to be added to ul
//             let li = document.createElement('li');

//             // Add Bootstrap list item class to each li
//             li.classList.add('list-group-item')
//                 // Create the html markup for each li
//             li.innerHTML = (`
//                 <p><strong>No account exists with username:</strong> ${username}</p>`);
//             // Append each li to the ul
//             ul.appendChild(li);
//         } else {

//             // Get the ul with id of of userRepos
//             let ul = document.getElementById('userRepos');
//             let p = document.createElement('p');
//             p.innerHTML = (`<p><strong>Number of Public Repos:${data.length}</p>`)
//             ul.appendChild(p);
//             // Loop over each object in data array
//             for (let i in data) {
//                 // Create variable that will create li's to be added to ul
//                 let li = document.createElement('li');

//                 // Add Bootstrap list item class to each li
//                 li.classList.add('list-group-item')

//                 // Create the html markup for each li
//                 li.innerHTML = (`
//                 <p><strong>Repo:</strong> ${data[i].name}</p>
//                 <p><strong>Description:</strong> ${data[i].description}</p>
//                 <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
//             `);

//                 // Append each li to the ul
//                 ul.appendChild(li);

//             }

//         }
//     }
//FUNCTION TO FETCH THE USER REPOS AND LANGUAGES FOR THE REPO
// function userRepos(username){

//     let userReposApi = `https://api.github.com/users/${username}/repos`


//     fetch(userReposApi)
//     .then(reposResponse => reposResponse.json())

//     //implement this function after getting the data
//     .then((info)=>{  ///info is the data for the repos


        

//         //index to keep track of current iteration 
//         let index = 0  

//         //for each repository itreation, create the following elements
//         info.forEach((item)=>{

//             let activeRepo =info[index]  //current repo index. starting at 0

//             //CREATING H1
//             let h1 = document.createElement('h1')
//             h1.setAttribute('class','repo-name')
//             h1.textContent = activeRepo.name


//             //CREATING P TAG
//             let p = document.createElement('p')
//             p.setAttribute('class','repo-description')

//             if(activeRepo.description===null){
//                 p.textContent = 'this repository has no description'
//             }
//             else{
//                 p.textContent = activeRepo.description

//             }


//             //CREATING THE A TAG THAT WILL DIRECT USERS TO THE SPECIFIC REPO INSIDE GITHUB  

//             let repoLink = document.createElement('a')
//             repoLink.setAttribute('class','repo-link')
//             repoLink.innerHTML = `<i id="icon" class="fa-solid fa-folder"></i>` //ADDING ICON INSIDE THE ANCHOR TAG

//             //SETTING HREFS TO THE ANCHOR TAGS ie. 
//             // THE FOLDER ICON ON THE TOP OF 
//             // EACH REPO . WHEN CLICKED, WILL GO TO THIS URL
//             repoLink.href = activeRepo.html_url


//             //CREATING THE DIV TO WHICH THE ABOVE ELEMENTS WILL BE APPENDED
//             let repoElementDiv = document.createElement('div')
//             repoElementDiv.setAttribute('class','repo-element')
//             repoElementDiv.append(h1,p,repoLink)

// function userRepos(username){

//     let userReposApi = `https://api.github.com/users/${username}/repos`


//     fetch(userReposApi)
//     .then(reposResponse => reposResponse.json())

//     //implement this function after getting the data
//     .then((info)=>{  ///info is the data for the repos


        

//         //index to keep track of current iteration 
//         let index = 0  

//         //for each repository itreation, create the following elements
//         info.forEach((item)=>{

//             let activeRepo =info[index]  //current repo index. starting at 0

//             //CREATING H1
//             let h1 = document.createElement('h1')
//             h1.setAttribute('class','repo-name')
//             h1.textContent = activeRepo.name


//             //CREATING P TAG
//             let p = document.createElement('p')
//             p.setAttribute('class','repo-description')

//             if(activeRepo.description===null){
//                 p.textContent = 'this repository has no description'
//             }
//             else{
//                 p.textContent = activeRepo.description

//             }


//             //CREATING THE A TAG THAT WILL DIRECT USERS TO THE SPECIFIC REPO INSIDE GITHUB  

//             let repoLink = document.createElement('a')
//             repoLink.setAttribute('class','repo-link')
//             repoLink.innerHTML = `<i id="icon" class="fa-solid fa-folder"></i>` //ADDING ICON INSIDE THE ANCHOR TAG

//             //SETTING HREFS TO THE ANCHOR TAGS ie. 
//             // THE FOLDER ICON ON THE TOP OF 
//             // EACH REPO . WHEN CLICKED, WILL GO TO THIS URL
//             repoLink.href = activeRepo.html_url


//             //CREATING THE DIV TO WHICH THE ABOVE ELEMENTS WILL BE APPENDED
//             let repoElementDiv = document.createElement('div')
//             repoElementDiv.setAttribute('class','repo-element')
//             repoElementDiv.append(h1,p,repoLink)


//             // repoDivParent.appendChild(repoElementDiv) //append the elements to this div
//             repoDivParent.append(repoElementDiv) //append the elements to this div
        
//             //FETCHING THE LANGUAGES OF THE SPECIFIC REPO AND ADDING THEM TO THE CREATED LIST INSIDE THAT REPOSITORY
         
//             let repoName = h1.textContent  //value of the h1 that we assigned up there

//             let languageApiUrl = `https://api.github.com/repos/${username}/${repoName}/languages`

//             fetch(languageApiUrl)
//             .then(res => res.json())
//             .then((languagesInfo)=>{
//                 // console.log(languagesInfo);

//                 for(let i in languagesInfo){

//                     let li = document.createElement('li')
//                     li.setAttribute('class','list-item')
//                     li.textContent = i

//                     // console.log(li);
//                     repoElementDiv.append(li)  //APPENDING THE LIST ITEM TO THAT REPOSITORY
//                 }

//             })


//             index++ //incrementing the index until we iterate over the last repo
            
//         })

//     })

// }

//     // Send the request to the server
//     xhr.send();

// }
// }

