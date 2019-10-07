var gif_themes = ["The Matrix", "The Notebook", "Mr. Nobody", "The Lion King5"];
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
    for(var i=0;i<gif_themes.length;i++){
        if (gif_themes[i] === $("#add-input").val().trim()){
            buttonExist = true;
            break;
        }
    }

    if (!buttonExist){
        gif_themes.push($("#add-input").val().trim());
    }
    renderButtons();
});

$(document).on("click", ".gifInfo", function(event){
    
    $(".gifSection").empty();
    if (lastSearch === $(this).attr("data-name")){
        limit = limit+10;
    }
    else{
        limit = 10;
        lastSearch = $(this).attr("data-name");
    }
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit="+limit+"&q="+$(this).attr("data-name");
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        console.log(queryURL);
        var data=response.data;
        console.log(response);
        for(var i=0;i<data.length;i++){
            var newGif = $("<div>");
            var newCard = $("<div>");
            var newCardBody = $("<div>");
            newGif.addClass("col-lg-4 mb-4");
            newCard.addClass("card");
            //newCard.html("<img src=\""+data[i].images.original.url+"\" class=\"card-img-top\">");
            newCard.html("<video id=\"video"+i+"\" class=\"card-img-top\" loop><source src=\""+data[i].images.original.mp4+"\" type=\"video/mp4\"></video>");
            newCardBody.addClass("card-body");
            newCardBody.html("<h5 class=\"card-title\">"+data[i].title+"</h5>"+
                             "<p class=\"card-text\">Rating: "+data[i].rating+"</p>"+
                             "<a href=\"#\" class=\"btn btn-outline-danger btn-sm\"><i class=\"far fa-heart\"></i></a>");
            newCard.append(newCardBody);
            newGif.append(newCard);
            $(".gifSection").append(newGif);
        }
    });

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

renderButtons();
