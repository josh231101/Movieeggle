const BASE_URL = "http://www.omdbapi.com/?apikey=f33d65c8";
// getting all required elements
const searchWrapper = document.querySelector('.search-input');
const inputBox = document.querySelector('input');
const suggBox = document.querySelector('.autocom-box');
const moviesWrapper = document.querySelector('.movies');
let previousResults = [];
// if user press any key and release 

inputBox.onkeyup = async(e)=>{
    let userData = e.target.value; // user entered data
    let emptyArray = [];
    if(userData){
        // Filtering array value user char to lowercase and return only
        // those word/sentc that starts with user entered word.
        const responses = await callAPIByMovieName(userData);
        if( responses ){
            if(previousResults !== responses){
                previousResults = responses;
            }
            emptyArray = previousResults.slice(0,4).map((data)=>`<li>${data.Title}</li>`);
        }
        emptyArray = [`<li>${userData}</li>`,...emptyArray];
        showSuggestions(emptyArray);
        let allSuggestions = suggBox.querySelectorAll('li');
        for (let i = 0; i < allSuggestions.length; i++) {
            allSuggestions[i].setAttribute('onclick','select(this)');
        }
        searchWrapper.classList.add("active");
    }else{
        searchWrapper.classList.remove("active");
    }
}
async function callAPIByMovieName(name){
    const OMDB_RESPONSE = await fetch(`${BASE_URL}&s=${name}`);
    const PARSE_TO_JSON_RESPONSE = await OMDB_RESPONSE.json();
    return PARSE_TO_JSON_RESPONSE.Search; // The response of the movies
}
async function select(element){
    let selectedUserData = element.textContent;
    let movies = await callAPIByMovieName(selectedUserData);
    movies = movies.filter((movie) => movie.Poster != "N/A");
    showMovies(movies);
    inputBox.value = selectedUserData;
    searchWrapper.classList.remove('active');
    suggBox.innerHTML = "";
}
function showMovies(movies){
    const moviesData = movies.map((movie) =>MovieComponent(movie?.Poster));
    moviesWrapper.classList.add("active");
    moviesWrapper.innerHTML = moviesData.join('');
}
function MovieComponent(imgUrl){
    return `
        <div class="movie">
            <img src="${imgUrl}" alt="movie">
        </div>
    `
}
function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = `<li>${userValue}</li>`;
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}
