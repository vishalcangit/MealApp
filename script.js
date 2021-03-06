// imports search bar
const search_bar = document.getElementById("search-bar");
// imports submit /search button
const search_btn = document.getElementById("search-btn");
// imports show favourite button
const favourites = document.getElementById("show-fav");
// imports meal container
const mealsContainer = document.getElementById("meals");
// imports the heading of search results
const resultHeading = document.getElementById("search-result-info");
// imports single meal container
const single_meal_el = document.getElementById("single-meal");
// imports favourite list (aside one)
const favList = document.getElementById("fav-list");
// makes an empty array of name meals 
let meals = [];

// searchh meal fn
function searchMeal(e) {
    e.preventDefault();

    // clear previous search
    single_meal_el.innerHTML = "";

    // get search meal results
    const searchValue = search_bar.value;

    // check for empty searchh bar
    if (searchValue.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`
        )
            .then((res) => res.json())
            .then((data) => {
                resultHeading.innerHTML = `<h2>Search results for : ${searchValue}</h2>`
                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>There are no such items as ${searchValue}</h2>`
                } else {
                    mealsContainer.innerHTML = data.meals.map((meal) =>
                        `<div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <div class="meal-info" data-mealID="${meal.idMeal}" onclick="openBox()">
                                <a href="#">
                                <h3 class="meal-name">${meal.strMeal}</h3>
                                </a>
                                </div>
                            <div class="fav" data-mealID="${meal.idMeal}" onclick="addToFav(event)">Add to favourites <i class="fa-regular fa-heart"></i></div>
                        </div>`
                    ).join("")
                }
            })
        // will give an alert box if the search bar is empty and button is clicked to search
    } else {
        alert("please insert some valid input")
    }
}
// getting meal by id
function getMealById(mealId) {
    fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    )
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        })
}
// adding meal to dom when clicked in meals name
function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`
            ${meal[`strIngredient${i}`]}
            -${meal[`strMeasure${i}`]
                }
                `);
        } else {
            break;
        }
    }
    single_meal_el.innerHTML = `
    <div class="single-meal-box">
        <i class="fa fa-window-close box-close-btn" onclick="closeBox()"></i>
        <div class="meal-name_img">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="meal_ins_ing">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>${ingredients.map((ing) => `<li>${ing}</li>`)}</ul>
        </div>
    </div>`
}
// function to open box when clicked in meal name
function openBox() {
    document.getElementById("single-meal").classList.remove("inactive");
}
// function to open box when clicked in close button
function closeBox() {
    document.getElementById("single-meal").classList.add("inactive");
}
// function to open favourites when clicked in show fav
function showFav() {
    document.getElementById("aside").classList.remove("inactive")
}
// function to close favourites when clicked in close button
function closeFav() {
    document.getElementById("aside").classList.add("inactive")
}
// function to add the meals to favourite list 
function addToFav(e) {
    const mealInfo = e.composedPath().find((item) => {
        if (item.classList) {
            return item.classList.contains('fav');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
            .then((res) => res.json())
            .then((data) => {
                const meal = data.meals[0];
                // store object in local store
                let storeMeal = {
                    thumbnail: meal.strMealThumb,
                    heading: meal.strMeal,
                };
                // Push to global Array
                meals.push(storeMeal);
                window.localStorage.setItem('meal', JSON.stringify(meals));
                let div = document.createElement('div');
                div.innerHTML = `
                    <div class='fav-container'>
                        <img src = '${storeMeal.thumbnail}' alt = '${storeMeal.strMeal}' />
                        <h1 class='heading'>${storeMeal.heading}</h1>
                        <span class="del-fav" onclick="deleteFav(event)"><i class="fa-regular fa-trash-can"></i></span>
                    </div>`
                // Rendering on DOM element
                favList.appendChild(div);
            });
    }
}
// this delete function will delete an item fro meal array stored in the local storage
function deleteFav(e) {
    console.log(e);
    const mealInfo = e.composedPath().find((item) => {
        if (item.classList) {
            return item.classList.contains("fav-container");
        } else {
            return false;
        }
    });
    let mealName = mealInfo.querySelector('h1').innerText;

    // returns all heading except selected one of delete button
    meals = meals.filter((meal) => {
        return meal.heading != mealName;
    });


    // Updating local storage before removing favourite meal from list
    window.localStorage.setItem('meal', JSON.stringify(meals));

    mealInfo.remove();
}

// this function will load the arra saved with meal and it willl load on refresh without getting the favourite list getting deleted
function initialize() {
    const mealsData = JSON.parse(window.localStorage.getItem('meal'));
    // spread operator used to get the meals to run in for loop
    meals = [...mealsData];
    for (let i = 0; i < meals.length; i++) {
        let getMeal = meals[i];
        console.log(getMeal);
        let div = document.createElement('div');
        div.innerHTML = `
            <div class='fav-container'>
                <img src = '${getMeal.thumbnail}'/>
                <h1 class='heading'>${getMeal.heading}</h1>
                <span class="del-fav" onclick="deleteFav(event)"><i class="fa-regular fa-trash-can"></i></span>            
            </div>
            `;
        favList.appendChild(div);
    }
};


// events listeners to search button
search_btn.addEventListener("click", searchMeal);

// event listener for meal clicked 
mealsContainer.addEventListener("click", (e) => {

    // clear previous search
    single_meal_el.innerHTML = "";

    const mealInfo = e.composedPath().find((item) => {
        if (item.classList) {
            return item.classList.contains("meal-info");
        } else {
            return false;
        }
    });
    if (mealInfo) {
        const mealId = mealInfo.getAttribute("data-mealID");
        getMealById(mealId);
    }
});