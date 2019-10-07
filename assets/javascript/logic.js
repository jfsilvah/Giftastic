var gif_themes = ["Incredibles", "Toy Story", "Inside Out", "Lion King","Aladdin","Dumbo","Snoopy","Charlie Brown","Kung Fu Panda","How to Train Your Dragon"];
var lastSearch = " ";
var limit = 10;

function renderButtons() {
    $("#buttons_div").empty();
    for (var i = 0; i < gif_themes.length; i++) {
         var a = $("<a>");
         a.attr("href","#");
         a.addClass("btn");
         a.addClass("btn-primary");
         a.addClass("gifInfo");
         a.attr("data-name", gif_themes[i]);
         a.text(gif_themes[i]);
         $("#buttons_div").append(a);
    }
}

$("#add-element").on("click", function(event) {
    event.preventDefault();
    var buttonExist = false;

    if ($("#add-input").val().trim().length === 0){
        $("#add-input").val("");
        return;
    }
    
    for(var i=0;i<gif_themes.length;i++){
        if (gif_themes[i] === $("#add-input").val().trim()){
            buttonExist = true;
            break;
        }
    }

    if (!buttonExist){
        gif_themes.push($("#add-input").val().trim());
    }

    $("#add-input").val("");
    renderButtons();
});

$(document).on("click", ".gifInfo", function(event){
    displayGifs($(this).attr("data-name"));
    displayMovieInfo($(this).attr("data-name"));
});

$(document).on("click", ".card-img-top", function(event){
    var video = $(this).attr("id");
    if ($("#"+video).get(0).paused){
        $("#"+video).get(0).play();
    }
    else{
        $("#"+video).get(0).pause();
    }
});

function displayGifs(buttonInfo){
    $(".gifSection").empty();
    if (lastSearch === buttonInfo) {
        limit = limit + 10;
    }
    else {
        limit = 10;
        lastSearch = buttonInfo;
    }
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=" + limit + "&q=" + buttonInfo;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var data = response.data;
        for (var i = 0; i < data.length; i++) {
            var newGif = $("<div>");
            var newCard = $("<div>");
            var newCardBody = $("<div>");
            newGif.addClass("col-lg-4 mb-4");
            newCard.addClass("card");
            //newCard.html("<img src=\""+data[i].images.original.url+"\" class=\"card-img-top\">");
            newCard.html("<video id=\"video" + i + "\" class=\"card-img-top\" loop><source src=\"" + data[i].images.original.mp4 + "\" type=\"video/mp4\"></video>");
            newCardBody.addClass("card-body");
            newCardBody.html("<h5 class=\"card-title\">" + data[i].title + "</h5>" +
                             "<p class=\"card-text\">Rating: " + data[i].rating + "</p>" +
                             "<a href=\"#\" class=\"btn btn-outline-danger btn-sm\"><i class=\"far fa-heart\"></i></a>");
            newCard.append(newCardBody);
            newGif.append(newCard);
            $(".gifSection").append(newGif);
        }
    });

}

function displayMovieInfo(buttonInfo) {

    $(".movieSection").empty();
    var pages = limit / 10;
    var imageDisplay;
    for (var i = 0; i < pages; i++) {
        var queryURL = "https://www.omdbapi.com/?s=" + buttonInfo + "&type=movie&apikey=trilogy&page=" + (i + 1);
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            for (var j = 0; j < response.Search.length; j++) {
                queryURL = "http://www.omdbapi.com/?i=" + response.Search[j].imdbID + "&apikey=trilogy";
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function (response2) {
                    var newMovie = $("<div>");
                    var newCard = $("<div>");
                    var newRow = $("<div>");
                    var newImage = $("<div>");
                    var newCol = $("<div>");
                    var newCardBlock = $("<div>");
                    newMovie.addClass("col-lg-6 mb-6");
                    newCard.addClass("card");
                    newRow.addClass("row no-gutters");
                    newImage.addClass("col-auto");
                    if (response2.Poster.length>5){
                        imageDisplay = "\""+response2.Poster+"\"";
                    }
                    else{
                        imageDisplay = "\"assets/images/error.jpg\" width=300 height=300 ";
                    }
                    newImage.html("<img src="+imageDisplay+" class=\"img-fluid\" alt=\"\">");
                    newCol.addClass("col");
                    newCardBlock.addClass("card-block px-2");
                    var ratings = response2.Ratings;
                    var ratingElement = " ";
                    for(var i=0;i<ratings.length;i++){
                        if (i === 0){
                            ratingElement = ratings[i].Source+": "+ratings[i].Value+"<br>";
                        }
                        else{
                           ratingElement = ratings[i].Source+": "+ratings[i].Value+"<br>"+ratingElement;
                        }
                        console.log(ratingElement);
                    }
                    newCardBlock.html("<h4 class=\"card-title\">"+response2.Title+"</h4>"+
                                      "<p class=\"card-text\">"+response2.Plot+"</p>"+
                                      "<p class=\"card-text\">Released: "+response2.Released+"</p>"+
                                      "<p class=\"card-text\">Ratings: </p>"+
                                      ratingElement
                                      );
                    newCol.append(newCardBlock);
                    newRow.append(newImage);
                    newRow.append(newCol);
                    newCard.append(newRow);
                    newMovie.append(newCard);
                    $(".movieSection").append(newMovie);
                })
            }
        })
    }
}

renderButtons();
