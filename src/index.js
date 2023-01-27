import './css/styles.css';
import debounce from 'lodash.debounce';
import { getCountry } from "./fetchCountries.js"
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const listEl = document.querySelector(".country-list");
const countryInfEl = document.querySelector(".country-info");
inputEl.addEventListener("input",debounce(onInputCountryName,DEBOUNCE_DELAY));


function onInputCountryName(e) {
    const countryName = e.target.value.trim();
    
    getCountry(countryName).then((data) => {
        
        if (inputEl.value === "") {
            countryInfEl.innerHTML = "";
            listEl.innerHTML = "";
        }
    
        if (data.length > 2) {
            const markup = data.reduce((acc, elem) => {
                return createListCountry(elem) + acc
            }, "")
            listEl.innerHTML = markup;
            countryInfEl.innerHTML = "";
        }
        if (data.length > 11) {
            const info = Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            listEl.innerHTML = "";
            return
        }
        if (data.length === 1) {
            const country = createMarkup(data[0]);
            countryInfEl.innerHTML = country;
            listEl.innerHTML = "";
        }
        if (data.status === 404) {
            const error = Notiflix.Notify.failure("Oops, there is no country with that name");
             listEl.innerHTML = "";
        }     
    })
            

            
};



function createListCountry({name,flags}) {
    return `
     <li class="list-elem">
     <img src="${flags.png}" width="100" heigth="100">
     <h2>${name}</h2>
     </li>
    `
}


function createMarkup({ name, flags, capital, languages, population }) {
    const elemLang = languages.map(lang => lang.name).join(", ");
    
    return `<ul class="list">
    <li class="list-elem">
    <img src="${flags.png}" alt="flag" width="100" heigth="100">
    <h1 class="country-name">${name}</h1>
    </li>
    <li><span>Capital: </span>${capital}</li>
    <li><span>Populatoin: </span>${population}</li>
    <li><span>Languages: </span>${elemLang}</li>
    </ul>`  
}

