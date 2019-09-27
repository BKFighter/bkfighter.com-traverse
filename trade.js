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
    var itemObjectsBuy = "";
    var itemObjectsSell = "";
    var toSort = [];
    for(var i = 0; i < traders.length; i++){
        for(var a = 0; a < traders[i].items.length; a++){
            if(traders[i].items[a].id == currentId){
                toSort.push({"shopIndex": i, "itemIndex": a, "price": traders[i].items[a].priceLow, "transactionType": traders[i].items[a].transactionType});
            }
        }
    }
    var itemsLeft = true;
    while(toSort.length > 0 && itemsLeft){
        var lowPrice = toSort[0].price;
        var lowIndex = 0;
        for(var i = 0; i < toSort.length; i++){
            if(toSort[i].price < lowPrice && toSort[i].transactionType == "Buy"){
                lowPrice = toSort[i].price;
                lowIndex = i;
            }
        }
        if(toSort[lowIndex].transactionType == "Buy"){
            var currentObject = traders[toSort[lowIndex].shopIndex];
            currentObject.priceLow = traders[toSort[lowIndex].shopIndex].items[toSort[lowIndex].itemIndex].priceLow;
            currentObject.priceHigh = traders[toSort[lowIndex].shopIndex].items[toSort[lowIndex].itemIndex].priceHigh;
            currentObject.refreshPerMinute = traders[toSort[lowIndex].shopIndex].items[toSort[lowIndex].itemIndex].refreshPerMinute;
            currentObject.maxInventory = traders[toSort[lowIndex].shopIndex].items[toSort[lowIndex].itemIndex].maxInventory;
            currentObject.transactionType = "Buy";
            currentObject.type="Trader";
            var displayPage = "services";
            var displayId = "tid=" + traders[toSort[lowIndex].shopIndex].tid;
            itemObjectsBuy += "<a class='search-results-link' href='https://bkfighter.com/traverse/" + displayPage + ".html?" + displayId + "'>" + objectTemplates(currentObject) + "</a>";
            toSort.splice(lowIndex, 1);
        }else{
            itemsLeft = false;
        }
    }
    while(toSort.length > 0){
        var highPrice = toSort[0].price;
        var highIndex = 0;
        for(var i = 0; i < toSort.length; i++){
            if(toSort[i].price > highPrice && toSort[i].transactionType == "Sell"){
                highPrice = toSort[i].price;
                highIndex = i;
            }
        }
        var currentObject = traders[toSort[highIndex].shopIndex];
        currentObject.priceLow = traders[toSort[highIndex].shopIndex].items[toSort[highIndex].itemIndex].priceLow;
        currentObject.priceHigh = traders[toSort[highIndex].shopIndex].items[toSort[highIndex].itemIndex].priceHigh;
        currentObject.refreshPerMinute = traders[toSort[lowIndex].shopIndex].items[toSort[lowIndex].itemIndex].refreshPerMinute;
        currentObject.maxInventory = traders[toSort[lowIndex].shopIndex].items[toSort[lowIndex].itemIndex].maxInventory;
        currentObject.transactionType = "Sell";
        currentObject.type="Trader";
        var displayPage = "services";
        var displayId = "tid=" + traders[toSort[highIndex].shopIndex].tid;
        itemObjectsSell += "<a class='search-results-link' href='https://bkfighter.com/traverse/" + displayPage + ".html?" + displayId + "'>" + objectTemplates(currentObject) + "</a>";
        toSort.splice(highIndex, 1);
    }
    
    document.getElementById("services-container-buy").innerHTML = itemObjectsBuy;
    document.getElementById("services-container-sell").innerHTML = itemObjectsSell;
    
    var genericUrl = "./images/items/1.jpg";
    var specificUrl = "./images/commodities/" + currentId + ".jpg";
    var displayName;
    for(var i = 0; i < commodities.length; i++){
        if(commodities[i].id == currentId){
            displayName = commodities[i].name;
        }
    }
    document.getElementById("commodity-name").innerHTML = displayName + "<style>#commodity-info{background: url(" + specificUrl + "), url('./images/objects/general/FileNotFound.png'), url(" + genericUrl + "); background-position: center; background-size: cover;}</style>";
}


var currentId;
if(getParameterByName("cid")){
    currentId = getParameterByName("cid");
    displayService();
}else{
    window.location.href = "404.html";
}