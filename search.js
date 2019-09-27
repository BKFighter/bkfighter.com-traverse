/*window.onerror = function(message, source, lineno, colno, error){
    alert("message: " + message + " source: " + source + " lineno: " + lineno + " colno: " + colno + " error: " + error);
}*/
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function seperateWords(seperateString){
    if(seperateString.indexOf(" ") < 0){
        queryWords.push(seperateString);
    }else{
        var nextSpace = seperateString.indexOf(" ");
        if(nextSpace > 0){
            queryWords.push(seperateString.substr(0, nextSpace));
        }
        seperateWords(seperateString.replace(seperateString.substr(0, nextSpace + 1) + "", ""));
    }
}

function arrayContainsValue(value, array){
    for(var i = 0; i < array.length; i++){
        if(array[i] == value){
            return true;
        }
    }
    return false;
}
var locationObjectTypes = ["Star", "Planet", "Moon", "Lagrange", "Landing Zone", "Satellite", "Outpost"];

function findMatches(){
    for(var i = 0; i < verseData.length; i++){
        testForMatch("Location", i);
    }
    for(var i = 0; i < shops.length; i++){
        testForMatch("Shop", i);
    }
    for(var i = 0; i < traders.length; i++){
        testForMatch("Trader", i);
    }
    for(var i = 0; i < items.length; i++){
        testForMatch("sid", i);
    }
    for(var i = 0; i < commodities.length; i++){
        testForMatch("tid", i);
    }
}
function testForMatch(type, current){
    var toSearch;
    if(type == "Location"){
        toSearch = JSON.stringify(verseData[current]);
    }
    if(type == "Shop"){
        toSearch = JSON.stringify(shops[current]);
    }
    if(type == "Trader"){
        toSearch = JSON.stringify(traders[current]);
    }
    if(type == "sid"){
        toSearch = JSON.stringify(items[current]);
    }
    if(type == "tid"){
        toSearch = JSON.stringify(commodities[current]);
    }
    toSearch = toSearch.toLowerCase();
    for(var i = 0; i < queryWords.length; i++){
        if(toSearch.indexOf(queryWords[i]) >= 0){
            var currentObject;
            if(type == "Location"){
                currentObject = verseData[current];
            }
            if(type == "Shop"){
                currentObject = shops[current];
                currentObject.type = type;
            }
            if(type == "Trader"){
                currentObject = traders[current];
                currentObject.type = type;
            }
            if(type == "sid"){
                currentObject = items[current];
                currentObject.type = type;
                currentObject.priceLow = lowPrice("sid", currentObject.id, "Buy");
                currentObject.priceHigh = highPrice("sid", currentObject.id, "Buy");
            }
            if(type == "tid"){
                var buyCurrentObject;
                buyCurrentObject = JSON.parse(JSON.stringify(commodities[current])); //Buy Commodity
                buyCurrentObject.type = type;
                buyCurrentObject.transactionType = "Buy";
                buyCurrentObject.priceLow = lowPrice("tid", buyCurrentObject.id, "Buy");
                buyCurrentObject.priceHigh = highPrice("tid", buyCurrentObject.id, "Buy");
                matches.push(buyCurrentObject);
                
                currentObject = JSON.parse(JSON.stringify(commodities[current])); //Sell Commodity
                currentObject.type = type;
                currentObject.transactionType = "Sell";
                currentObject.priceLow = lowPrice("tid", currentObject.id, "Sell");
                currentObject.priceHigh = highPrice("tid", currentObject.id, "Sell");
            }
            matches.push(currentObject);
            return null;
        }
    }
}
function lowPrice(type, id, transactionType){
    var searchArray;
    if(type == "sid"){
        searchArray = shops;
    }
    if(type == "tid"){
        searchArray = traders;
    }
    
    var lowestPrice = false;
    for(var a = 0; a < searchArray.length; a++){
        currentList = searchArray[a].items;
        for(var b = 0; b < currentList.length; b++){
            if(type == "sid"){
                currentList[b].transactionType = "Buy";
            }
            if(currentList[b].id == id && (transactionType.toLowerCase() == currentList[b].transactionType.toLowerCase() || type == "sid")){
                if(!lowestPrice){
                    lowestPrice = currentList[b].priceLow;
                }else if(currentList[b].priceLow < lowestPrice){
                    lowestPrice = currentList[b].priceLow;
                }
            }
        }
    }
    return lowestPrice;
}
function highPrice(type, id, transactionType){
    var searchArray;
    if(type == "sid"){
        searchArray = shops;
    }
    if(type == "tid"){
        searchArray = traders;
    }
    
    var highestPrice = false;
    for(var a = 0; a < searchArray.length; a++){
        currentList = searchArray[a].items;
        for(var b = 0; b < currentList.length; b++){
            if(type == "sid"){
                currentList[b].transactionType = "Buy";
            }
            if(currentList[b].id == id && (transactionType.toLowerCase() == currentList[b].transactionType.toLowerCase() || type == "sid")){
                if(!highestPrice){
                    highestPrice = currentList[b].priceHigh;
                }else if(currentList[b].priceHigh > highestPrice){
                    highestPrice = currentList[b].priceHigh;
                }
            }
        }
    }
    return highestPrice;
}
function rankMatches(){
    var pointAwards = [4, 8, 4, 2, 1, 1, 1]; //Rank
    for(i = 0; i < matches.length; i++){
        var points = 0;
        for(var a = 0; a < queryWords.length; a++){
            var nextIndex = 0;
            for(var b = 0; b < pointAwards.length; b++){
                if(JSON.stringify(matches[i]).toLowerCase().indexOf(queryWords[a].toLowerCase(), nextIndex) > -1 && nextIndex < JSON.stringify(matches[i]).length){
                    nextIndex = JSON.stringify(matches[i]).toLowerCase().indexOf(queryWords[a].toLowerCase(), nextIndex) + 1;
                    points += pointAwards[b];
                }
            }
        }
        matches[i].points = points;
    }
    
    var c = matches.length; //Prune
    var minPoints = queryWords.length * 2;
    while(c > 0){
        c--;
        if(matches[c].points < minPoints){
            matches.splice(c, 1);
        }
    }

    var d = matches.length //Sort
    while(d > 0){
        d--;
        var maxPoints = matches[0].points;
        var maxIndex = 0;
        for(var i = 0; i < matches.length; i++){
            if(matches[i].points > maxPoints){
                maxIndex = i;
                maxPoints = matches[i].points;
            }
        }
        rankedMatches.push(matches.splice(maxIndex, 1)[0]);
    }
}
function displayMatches(){
    for(var i = 0; i < rankedMatches.length; i++){
        var displayPage;
        var displayId;
        
        if(rankedMatches[i].type == "Shop" || rankedMatches[i].type == "Trader"){
            displayPage = "services";
            var displayType;
            if(rankedMatches[i].type == "Shop"){
                displayType = "sid";
            }else{
                displayType = "tid";
            }
            displayId = displayType + "=" + rankedMatches[i][displayType];
        }
        if(rankedMatches[i].type == "sid"){
            displayPage = "items";
            displayId = "id=" + rankedMatches[i].id;
        }
        if(rankedMatches[i].type == "tid"){
            displayPage = "trade";
            displayId = "cid=" + rankedMatches[i].id;
        }
        if(arrayContainsValue(rankedMatches[i].type, locationObjectTypes)){
            displayPage = "verse";
            displayId = "loc=" + rankedMatches[i].gameName;
        }
        results += "<a class='search-results-link' href='https://bkfighter.com/traverse/" + displayPage + ".html?" + displayId + "'>" + objectTemplates(rankedMatches[i]) + "</a>";
    }
    document.getElementById("results-container").innerHTML = results;
}

var query;
var queryWords = [];
var matches = [];
var rankedMatches = [];
var results = "";

if(getParameterByName("query")){
    query = decodeURI(getParameterByName("query"));
}else{
    query = "Search...";
}
displayQuery = query;
query = query.replace(",", "").replace(".", "").replace("!", "").toLowerCase();
seperateWords(query);
if((queryWords.length == 1 && queryWords[0] === "") || queryWords.length === 0){
    queryWords = ["INVALID", "QUERY"];
    query = "INVALID QUERY";
    displayQuery = query;
}
document.getElementById("search-bar").value = displayQuery;
findMatches();
rankMatches();
displayMatches();