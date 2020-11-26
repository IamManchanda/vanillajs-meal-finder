const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsElement = document.getElementById("meals");
const resultHeadingElement = document.getElementById("result-heading");
const singleMealElement = document.getElementById("single-meal");

async function fetcher(resource) {
  const apiUrl = "https://www.themealdb.com/api/json/v1/1";
  const path = `${apiUrl}/${resource}`;
  const res = await fetch(path);
  const data = await res.json();
  return data;
}

async function searchMeal(event) {
  event.preventDefault();
  singleMealElement.innerHTML = "";
  const term = search.value;

  if (term.trim()) {
    const data = await fetcher(`search.php?s=${term}`);
    resultHeadingElement.innerHTML = `<h2>Search results for '${term}':</h2>`;
    if (data.meals === null) {
      resultHeadingElement.innerHTML = `<p>There are no search results. Try again!<p>`;
    } else {
      mealsElement.innerHTML = data.meals
        .map(
          (meal) => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-meal-id="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
        `,
        )
        .join("");
    }
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

async function getMealById(mealID) {
  const data = await fetcher(`lookup.php?i=${mealID}`);
  const meal = data.meals[0];
  addMealToDOM(meal);
}

async function getRandomMeal() {
  mealsElement.innerHTML = "";
  resultHeadingElement.innerHTML = "";
  const data = await fetcher("random.php");
  const meal = data.meals[0];
  addMealToDOM(meal);
}

function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`,
      );
    } else {
      break;
    }
  }

  singleMealElement.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

function handleMealsClick(event) {
  const mealInfo = event.path.find((item) =>
    item.classList ? item.classList.contains("meal-info") : false,
  );

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-meal-id");
    getMealById(mealID);
  }
}

submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);
mealsElement.addEventListener("click", handleMealsClick);
