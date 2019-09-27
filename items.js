function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getItem(id){
    for(var i = 0; i < items.length; i++){
        if(items[i].id == id){
            return items[i];
        }
    }
    for(var i = 0; i < commodities.length; i++){
        if(commodities[i].id == id){
            return commodities[i];
        }
    }
    console.log("ERROR: " + id + " not found as Item or Commodity.");
    return {"id": id.replace(" ", "_"), "type": "sid", "description": "404 ERROR - ITEM NOT FOUND", "name": id, "tags": ["404ERROR"]};
}
function displayService(){
    var itemObjects = "";
    var toSort = [];
    for(var i = 0; i < shops.length; i++){
        for(var a = 0; a < shops[i].items.length; a++){
            if(shops[i].items[a].id == currentId){
                toSort.push({"shopIndex": i, "itemIndex": a, "price": shops[i].items[a].priceLow});
            }
        }
    }
    while(toSort.length > 0){
        var lowPrice = toSort[0].price;
        var lowIndex = 0;
        for(var i = 0; i < toSort.length; i++){
            if(toSort[i].price < lowPrice){
                lowPrice = toSort[i].price;
                lowIndex = i;
            }
        }
        var currentObject = shops[toSort[lowIndex].shopIndex];
        currentObject.priceLow = shops[toSort[lowIndex].shopIndex].items[toSort[lowIndex].itemIndex].priceLow;
        currentObject.priceHigh = shops[toSort[lowIndex].shopIndex].items[toSort[lowIndex].itemIndex].priceHigh;
        currentObject.type="Shop";
        var displayPage = "services";
        var displayId = "sid=" + shops[toSort[lowIndex].shopIndex].sid;
        itemObjects += "<a class='search-results-link' href='https://bkfighter.com/traverse/" + displayPage + ".html?" + displayId + "'>" + objectTemplates(currentObject) + "</a>";
        toSort.splice(lowIndex, 1);
    }
    
    document.getElementById("services-container").innerHTML = itemObjects;
    
    var genericUrl = "./images/items/1.jpg";
    var specificUrl = "./images/items/" + currentId + ".jpg";
    var displayName;
    for(var i = 0; i < items.length; i++){
        if(items[i].id == currentId){
            displayName = items[i].name;
        }
    }
    document.getElementById("item-name").innerHTML = displayName + "<style>#item-info{background: url(" + specificUrl + "), url('./images/objects/general/FileNotFound.png'), url(" + genericUrl + "); background-position: center; background-size: cover;}</style>";
}


var currentId;
if(getParameterByName("id")){
    currentId = getParameterByName("id");
    displayService();
}else{
    window.location.href = "404.html";
}