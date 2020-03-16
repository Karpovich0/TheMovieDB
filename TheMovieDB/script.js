setInterval("checker()", 100);
setInterval("checkClick()", 100);
setInterval("clickRec()", 100);
setInterval("getHome()", 200);

//variables will be commented partially
let arr__trending;
let arr__rec; // record all trending films
let trending = document.querySelector(".trending");
const basePosterUrl = "https://image.tmdb.org/t/p/w500"; // first part of film poster's path
const baseRecUrl1 = "https://api.themoviedb.org/3/movie/"; //using for geting recommendations
const baseRecUrl2 = "/recommendations?api_key=710ea7eb84856ff5f4c0493892b4f2db&language=en-US&page=1"; //using for geting recommendations
const baseSearchUrl1 = "https://api.themoviedb.org/3/search/movie?api_key=710ea7eb84856ff5f4c0493892b4f2db&language=en-US&query="; // using for searching
let arr__films = document.querySelectorAll(".trending__film");
let arr__img = document.querySelectorAll(".trending__poster"); // get all img tags in trending div
let arr__title = document.querySelectorAll(".trending__details");
let film = document.querySelector(".film");
let h3__rec = document.querySelector(".h3__rec"); //header of recommendations
let film__img = document.querySelector(".film__img");
let film__title = document.querySelector(".film__title");
let film__overview = document.querySelector(".film__overview");
let film__overview_text = document.querySelector(".film__overview_text");
let rec__posters = document.querySelectorAll(".rec__poster");
let rec__titles = document.querySelectorAll(".rec__title");
let film__rec_items = document.querySelectorAll(".film__rec_item");
let home = document.querySelector(".home");
let search__text = document.querySelector(".search__text");
let search__results = document.querySelector(".search__results");
let search__res = document.querySelectorAll(".search__res");

function checker() { // check on wrong characters
    if (search__text.value.charAt(0) == "#" || search__text.value.charAt(0) == "%" || search__text.value.charAt(0) == "&") { //# or % or & - if they are a first character of the request to The MovieDB - we have wrong request 
        search__text.value = search__text.value.substring(1);
    }
    getSearch(); // when we have not wrong charactes - we go to search
}

function getSearch() {

    if (search__text.value) {
        let request = new XMLHttpRequest();

        search__results.style.display = "block"; // make div with results visible

        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                search__arr = JSON.parse(request.responseText); //convert JSON response into object

                if (search__arr.results.length > 11) { // we can show mex 10 results
                    createSearchDiv(10);
                } else {
                    if (search__arr.results.length > 0) {
                        createSearchDiv(search__arr.results.length);
                    } else {
                        createSearchDiv(0);
                        search__res[0].style.display = "block";
                        search__res[0].style.color = "red";
                        search__res[0].innerHTML = "No results :("
                        search__res[0].onclick = function() {};
                    }
                }
            }
        }
        request.open("GET", baseSearchUrl1 + search__text.value);
        request.send();

    } else {
        search__results.style.display = "none"; // when input field is empty - we hide div for results
    }
}

function createSearchDiv(number) {
    search__res[0].style.color = "#424141"; //in the past if we got 0 search request - we make in first div red font.So now we make in gray again

    for (let i = 0; i < number; i++) {
        search__res[i].style.display = "block";
        search__res[i].innerHTML = search__arr.results[i].original_title;
    }

    for (let i = 9; i >= number; i--) { // if results is les than 10 - we hide empty divs
        search__res[i].style.display = "none";
    }

    getClickSearch(number); // check divs on user`s ckick

}

function getClickSearch(number) {
    getFilm(number, search__arr, search__res, 1);
}

function clickRec() {
    getFilm(10, arr__rec, film__rec_items, 0);
}

function checkClick() {
    getFilm(arr__films.length, arr__trending, arr__films, 0);
}

function getFilm(length__clicked, arr__data, arr__divOnClick, isSearch) { //length__clicked - numbers of results
    for (let i = 0; i < length__clicked; i++) { //arr__data - here stored data from servers`s response
        arr__divOnClick[i].onclick = function() { //arr__divOnClick - divs on which user can click
            //isSearch - if we have call from getClickSearch function, we should hide div with results, `cause we change page
            trending.style.display = "none";
            film.style.display = "flex";
            if (arr__data.results[i].poster_path) { //checking poster existing
                film__img.setAttribute("src", basePosterUrl + arr__data.results[i].poster_path);
            } else { //we set our custom poster
                film__img.setAttribute("src", "img/no-poster-big.png");
            }
            film__title.innerHTML = arr__data.results[i].title;
            film__overview_text.innerHTML = arr__data.results[i].overview;

            getRec(arr__data.results[i].id); //get recommendation for current movie

            if (isSearch === 1) {
                search__text.value = "";
                search__results.style.display = "none";
            }
        }
    }
}

function getRec(id) {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {

            arr__rec = JSON.parse(request.responseText);
            if (arr__rec.total_results == 0) {
                h3__rec.innerHTML = "oops... no any recommendations"; // sometimes movies have not recommendations
                for (i = 0; i < 10; i++) {
                    film__rec_items[i].style.display = "none";
                }
            } else {
                let length;
                if (arr__rec.results.length > 10) {
                    length = 10;
                } else {
                    length = arr__rec.results.length;
                }
                h3__rec.innerHTML = "Recommendations";

                for (let i = 0; i < length; i++) {
                    film__rec_items[i].style.display = "block";
                    if (arr__rec.results[i].poster_path) {
                        rec__posters[i].setAttribute("src", basePosterUrl + arr__rec.results[i].poster_path);
                    } else {
                        rec__posters[i].setAttribute("src", "img/no-poster.png");
                    }

                    rec__titles[i].innerHTML = arr__rec.results[i].title;
                }
                if (length < 10) { // if we have less than 10 recommendations - we hide empty divs
                    let length__empty = 10 - length;
                    for (i = 0; i < length__empty; i++) {
                        let a = 9 - i;
                        film__rec_items[a].style.display = "none";
                    }
                }
            }
        }
    }
    request.open("GET", baseRecUrl1 + id + baseRecUrl2);
    request.send();
}

function getTrending() { // here we will got trending films from server
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            arr__trending = JSON.parse(request.responseText);

            for (let i = 0; i < arr__img.length; i++) {
                arr__img[i].setAttribute("src", basePosterUrl + arr__trending.results[i].poster_path);
                arr__title[i].innerHTML = arr__trending.results[i].title;

            }
        }
    }
    request.open("GET", "https://api.themoviedb.org/3/trending/all/week?api_key=710ea7eb84856ff5f4c0493892b4f2db");
    request.send();
}
getTrending();

function getHome() { // if we press homeButton - we back to main page
    home.onclick = function() {
        trending.style.display = "block";
        film.style.display = "none";
    }
}