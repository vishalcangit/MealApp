const search_bar = document.getElementById("search-bar");
const search_btn = document.getElementById("search-btn");
const favourites = document.getElementById("show-fav");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("search-result-info");
const single_meal_el = document.getElementById("single-meal")


// searchh meal fn
function searchMeal(e) {
    e.preventDefault();

    // clear previous search
    single_meal_el.innerHTML = "";

    // get search meal results
    const searchValue = search_bar.value;
    console.log(searchValue);

    // check for empty searchh bar
    if (searchValue.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search results for ${searchValue}</h2>`
                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>There are no such items as ${searchValue}</h2>`
                } else {
                    mealsContainer.innerHTML = data.meals.map((meal) =>
                        `<div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <div class="meal-info" data-mealID="${meal.idMeal}" onclick="closeBox()">
                                <h3 class="meal-name">${meal.strMeal}</h3>
                                <a class="add-fav" href="">Add to favourites <i class="fa-regular fa-heart"></i></a>
                            </div>
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
            console.log(data);
            const meal = data.meals[0];

            addMealToDOM(meal);
        })
}
// adding meal to dom 
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
    </div>
    `
}

function closeBox() {
    document.getElementById("single-meal").classList.toggle("inactive");
}
// events listeners
search_btn.addEventListener("click", searchMeal);

mealsContainer.addEventListener("click", (e) => {
    const mealInfo = e.path.find((item) => {
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