
const form = document.querySelector('#github-form');
form.addEventListener('submit', handleSubmit);

const toggleButton = document.createElement('button');


toggleButton.textContent = "search Repos";
toggleButton.addEventListener('click', handleToggle);
document.getElementById('title').appendChild(toggleButton);

function handleToggle(){
    if(toggleButton.textContent === 'search Repos'){
        toggleButton.textContent = 'search Users'
    }
    else{
        toggleButton.textContent = 'search Repos'
    }
}

function handleSubmit(event){
    event.preventDefault();
    const searchInput = event.target.search.value;
    if (toggleButton.textContent === 'search Repos'){
        fetchInfo(searchInput);
    }
    else {
        fetchRepoWithoutUser(searchInput);
    }
}

function fetchInfo(searchedName){
    fetch(`https://api.github.com/search/users?q=${searchedName}`, {
        headers: {
            Accept: "application/vnd.github.v3+json"
        }
    })
    .then(resp => resp.json())
    .then(json => json.items.forEach(renderInfo))

    document.querySelector('#user-list').innerHTML = '';
}

function fetchRepoWithoutUser(keyword){
    fetch(`https://api.github.com/search/repositories?q=${keyword}`, {
        headers: {
            Accept: "application/vnd.github.v3+json"
        }
    })
    .then(resp => resp.json())
    .then(json => json.items.forEach(renderRepos))

    document.querySelector('#repos-list').innerHTML = '';
    document.querySelector('#user-list').innerHTML = '';
}

function renderInfo(userInfo){
    //clear repo list
    document.querySelector('#repos-list').innerHTML = '';
    //login
    const name = document.createElement('h2');
    name.textContent = userInfo.login;
    //click on name to fetch repos
    name.addEventListener('click', () => fetchRepos(userInfo.login))

    //avatar
    const avatar = document.createElement('img');
    avatar.src = userInfo.avatar_url;
    //profile link
    const profile = document.createElement('a');
    profile.textContent = "Profile"
    profile.href = userInfo.html_url;

    const pageBreak = document.createElement('br');


    document.querySelector('#user-list').append(name, profile, pageBreak, avatar)

}

function fetchRepos(name){
    fetch(`https://api.github.com/users/${name}/repos`, {
        headers: {
            Accept: "application/vnd.github.v3+json"
        }
    })
    .then(resp => resp.json())
    .then(json => {
        //debugger;
        const heading = document.createElement('h3')
        heading.textContent = name;
        document.querySelector('#repos-list').append(heading);
        json.forEach(renderRepos);
    })

    document.querySelector('#repos-list').innerHTML = '';
}

function renderRepos(repo){

    const li = document.createElement('li');
    const repoLink = document.createElement('a');
    repoLink.href = repo.html_url;
    repoLink.innerText = repo.name;

    li.append(repoLink)
    document.querySelector('#repos-list').append(li)
}