'use strict';

const searchUrl = 'https://www.themealdb.com/api/json/v1/1/';

function combineIngredientsList(measurements, ingredients) {
  const fullIngredientsList = [];
  for (let i = 1; i < measurements.length; i++) {
    fullIngredientsList.push(`${measurements[i]} ${ingredients[i]}`);
  }
  return fullIngredientsList;
}

function getIngredientsList(responseJson) {
  let listItems = 20;
  const measurements = [];
  const ingredients = [];
  for (let i = 1; i < listItems; i++) {
    if (eval(`responseJson.meals[0].strMeasure${i}`) === '' || eval(`responseJson.meals[0].strMeasure${i}`) === ' ') {
      break;
    } else {
      measurements.push(eval(`responseJson.meals[0].strMeasure${i}`));
      ingredients.push(eval(`responseJson.meals[0].strIngredient${i}`));
    }
  }
  return combineIngredientsList(measurements, ingredients);
}

function displayFoodName(responseJson) {
  $('#food-name-h2').text(responseJson.meals[0].strMeal);
}

function displayFoodImage(responseJson) {
  $('#food-image-small')[0].src = responseJson.meals[0].strMealThumb;
  $('#food-image-small')[0].alt = 'image of food, ' + responseJson.meals[0].strMeal;
}

function removeDuplicateResults(responseJson) {
  if (responseJson[1].meals === responseJson[0].meals || responseJson[1].meals === responseJson[2].meals) {
    responseJson.splice(1,1);
  } else if (responseJson[0].meals === responseJson[2].meals) {
    responseJson.pop();
  }
  handleResults(responseJson);
}

function showTarget(target) {
  target.removeClass('hidden');
}

function handleIngredientsDisplay(ingredientsArray) {
  for (let i = 0; i < ingredientsArray.length; i++) {
    $('#food-details').children('#ingredients-list').append(`
    <li>${ingredientsArray[i]}</li>
  `);
  }
  showTarget($('#ingredients-list'));
}

function hideTarget(target) {
  target.addClass('hidden');
}

function parseUrl(url) {
  for (let i=url.length; i>0; i--) {
    if (url[i] === '=') {
      return i;
    }
  }
}

function handleFoodMedia(responseJson) {
  let videoUrl = responseJson.meals[0].strYoutube;
  let urlChar = parseUrl(videoUrl);
  let videoId = videoUrl.slice(urlChar+1);
  let videoEmbed = "https://www.youtube.com/embed/" + videoId;
  $('#food-image')[0].src = responseJson.meals[0].strMealThumb;
  $('#food-image')[0].alt = 'image of food, ' + responseJson.meals[0].strMeal;
  $('iframe')[0].src = videoEmbed;
  $('iframe')[1].src = videoEmbed;
}

function handleClose(targetFrame) {
  $('#close').click ( event => {
    hideTarget(targetFrame);
  });
}

function showFoodDetails(responseJson) {
  $('#food-details').empty();
  const ingredientsList = getIngredientsList(responseJson);
  let encodedSearch = encodeURI(responseJson.meals[0].strMeal);
  $('#food-details').append(`
    <img id="food-image-small" src="" alt="">
    <p><span class="bold big">Category: </span>${responseJson.meals[0].strCategory}</p>
    <p><span class="bold big">Culture: </span>${responseJson.meals[0].strArea}</p>
    <div id="mobile-video-frame">
      <p><span class="bold big">How to make: </span></p>
      <iframe id="small-video" src="" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" width="260" height="180" frameborder="0"></iframe>
    </div>
    <p><span class="bold big">Search:</span> <a href="https://www.google.com/search?q=${encodedSearch}">Click to Google</a></p>
    <p><span class="bold big">Source:</span> <a href="${responseJson.meals[0].strSource}">${responseJson.meals[0].strSource}</a></p>
    <p><span class="bold big" id="ingredients-header">Ingredients:</span></p>
    <ul id="ingredients-list"></ul>
    <p><span class="bold">Instructions:</span></p>
    <p id="instructions">${responseJson.meals[0].strInstructions}</p>
    <p id="api-source">Data is from www.themealdb.com</p>
  `);
  displayFoodName(responseJson);
  displayFoodImage(responseJson);
  handleIngredientsDisplay(ingredientsList);
  handleFoodMedia(responseJson);
  showTarget($('#food-details-frame'));
  handleClose($('#food-details-frame'));
}

function handleTextClick(responseJson) {
  $('.js-food-name').click( event => {
    let thumbnailNumber = $(event.currentTarget).siblings('img')[0].attributes.id.nodeValue.slice(-1);
    showFoodDetails(responseJson[thumbnailNumber]);
  });
}

function handleImageClick(responseJson) {
  $('.thumbnail-image').click( event => {
    let thumbnailNumber = $(event.currentTarget)[0].attributes.id.nodeValue.slice(-1);
    showFoodDetails(responseJson[thumbnailNumber]);
  });
}

function changeButtonText() {
  $('#submit-button').text('Find more!')
}

/* function handleResultsLayout() {
  if ($(window).height() < 650) { // adjustment for iphone 5 and smaller displays
    $('footer').css('bottom', '-100px');
  }
} */

function handleResults(responseJson) {
  for (let i = 0; i < responseJson.length; i++) {
    $('#results-list').append(`
    <li>
      <img class="thumbnail-image" id="thumbnail-${i}" src="${responseJson[i].meals[0].strMealThumb}" alt="thumbnail image of food, ${responseJson[i].meals[0].strMeal}">
      <h3 class="js-food-name">${responseJson[i].meals[0].strMeal}</h3>
    </li>
  `);
  }
  hideTarget($('#description-text'));
  showTarget($('#results'));
  // handleResultsLayout();
  handleImageClick(responseJson);
  handleTextClick(responseJson);
  changeButtonText();
}

function getRandomFoodResults() {
  const url = searchUrl + 'random.php';
  Promise.all([
    fetch(url),
    fetch(url),
    fetch(url)
  ]).then(response => {
      if (response[0].ok && response[1].ok && response[2].ok) {
        return(Promise.all([
          response[0] = response[0].json(),
          response[1] = response[1].json(),
          response[2] = response[2].json()
        ]))
      }
      throw new Error(response.statusText);
    }).then(responseJson => {
        removeDuplicateResults(responseJson);
    }).catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });   
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getFoodDetails(idNumbers) {
  const url = searchUrl + 'lookup.php?i=';
  const url1 = url + `${idNumbers[0]}`
  const url2 = url + `${idNumbers[1]}`
  const url3 = url + `${idNumbers[2]}`
  Promise.all([
    fetch(url1),
    fetch(url2),
    fetch(url3)
  ]).then(response => {
      if (response[0].ok && response[1].ok && response[2].ok) {
        return(Promise.all([
          response[0] = response[0].json(),
          response[1] = response[1].json(),
          response[2] = response[2].json()
        ]))
      }
      throw new Error(response.statusText);
    }).then(responseJson => {
        handleResults(responseJson);
    }).catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });  
}

function getRandomUniqueNumbers(number) {
  const idNumbers = [];
  let randomNumber = Math.floor(Math.random() * number);
  idNumbers.push(randomNumber);
  while (idNumbers.length < 3) {
    randomNumber = Math.floor(Math.random() * number);
    for (let i=0; i<idNumbers.length; i++) {
      if (idNumbers.find(num => num === randomNumber)) {
        continue;
      } else {
        idNumbers.push(randomNumber);
      }
    }
  }
  return idNumbers;
}

function randomizeFoodResults(responseJson) {
  let idNumbers = [];
  const randomNumbers = getRandomUniqueNumbers(responseJson.meals.length);
  for (let i=0; i<randomNumbers.length; i++) {
    idNumbers.push(responseJson.meals[randomNumbers[i]].idMeal);
  }
  getFoodDetails(idNumbers);
}

function getFoodCategories(category) {
  const params = {
    c: category
  };
  const queryString = formatQueryParams(params)
  const url = searchUrl + 'filter.php?' + queryString;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => randomizeFoodResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function handleCategorySelection() {
  let foodCategory = $('select').val();
  if (foodCategory === "All") {
    getRandomFoodResults();
  } else {
    getFoodCategories(foodCategory);
  }
}

function handleSubmit() {
  $('#submit-button').click(event => {
    event.preventDefault();
    $('#results-list').empty();
    handleCategorySelection();
  });
}

function handleAppStart() {
  handleSubmit();
}

$(handleAppStart);
