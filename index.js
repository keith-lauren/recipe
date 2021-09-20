let specialsList = null;

$(document).ready(() => {
  loadRecipes();
  loadSpecials();

  // $("#add-recipe-button").submit(saveRecipe);
});

function loadRecipes() {
  $.ajax({
    url: "http://localhost:3001/recipes",
    success: function (data) {
      recipesToHTML(data);
    },
    error: function (response) {
      console.log("Error in api request", response);
    },
  });
}

function loadSpecials() {
  $.ajax({
    url: "http://localhost:3001/specials",
    success: function (data) {
      specialsList = data;
    },
    error: function (response) {
      console.log("Error in api request", response);
    },
  });
}

function recipesToHTML(recipes) {
  $("#recipesList").html("");

  recipes.forEach(function (r, index) {
    const recipeElement = `
        <div class="recipe-container">
            <div class="overlay"></div>
            <img src=".${r.images ? r.images.full : "/img/no-image.jpg"}" />
            <h2 class="recipe-name">${r.title}</h2>
            <button id="recipe-${index}">get recipe</button>
        </div>`;

    $("#recipesList").append(recipeElement);

    $(`#recipe-${index}`).click(function () {
      onClickRecipe(r);
    });
  });

  hoverRecipe();
}

function hoverRecipe() {
  $(".recipe-container").hover(function () {
    $(this).find(".overlay").toggle();
    $(this).find("button").toggle();
  });
}

function onClickRecipe(r) {
  $(".details-container").show();
  $(".page-overlay").show();
  $("#recipeTitle").text(r.title);
  $("#recipeDesc").text(r.description);
  $(".details-title-container img").attr(
    "src",
    `.${r.images ? r.images.full : "/img/no-image.jpg"}`
  );
  $("#d-postDate").text(r.postDate);
  $("#d-editDate").text(r.editDate);
  $("#d-servings").text(r.servings);
  $("#d-prepTime").text(r.prepTime);
  $("#d-cookTime").text(r.cookTime);

  r.ingredients.forEach(function (i) {
    const hasSpecial = specialsList.find((s) => s.ingredientId == i.uuid);
    console.log("hasSpecial", hasSpecial);

    const ingredientElement = `
        <h3 style="margin-top: 10px; ">${i.amount} ${i.measurement} ${
      i.name
    }</h3>
        ${
          hasSpecial
            ? `<h3 style="color: green; font-size: 14px">[${hasSpecial.type}] ${hasSpecial.title} ${hasSpecial.text}</h3>`
            : ""
        }
    `;

    $(".ingredients-container").append(ingredientElement);
  });

  r.directions.forEach(function (d) {
    const directionsElement = `
        <li>
            ${d.optional ? "<strong>(optional)</strong>" : ""} ${d.instructions}
        </li>`;

    $(".directions-container ol").append(directionsElement);
  });

  console.log("specialsList", specialsList);
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function saveRecipe(e) {
  e.preventDefault();

  if (!$("#recipe-title").val()) {
    return;
  }

  console.log("test");
  $("#ingredientInputContainer input").each(function (el) {
    console.log(el);
  });

  return;

  $.ajax({
    url: "http://localhost:3001/recipes",
    method: "post",
    data: {
      uuid: generateUUID(),
      title: $("#recipe-title").val(),
      description: $("#recipe-description").val(),
      images: {},
      servings: parseInt($("#recipe-servings").val()),
      prepTime: parseInt($("#recipe-preptime").val()),
      cookTime: parseInt($("#recipe-cooktime").val()),
      postDate: $("#recipe-postdate").val(),
      editDate: $("#recipe-editdate").val(),
      ingredients: [],
      directions: [],
    },
    success: function (response) {
      console.log(response);
      loadRecipes();
    },
    error: function (response) {
      console.log("Error in api request", response);
    },
  });

  $("#recipe-title").val("");
  $("#recipe-description").val("");
  $("#recipe-servings").val("");
  $("#recipe-preptime").val("");
  $("#recipe-cooktime").val("");
  $("#recipe-postdate").val("");
  $("#recipe-editdate").val("");

  $(".page-overlay").hide();
  $(".add-window-container").hide();
}
