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
function getService(service, type){
    var currentServicesType;
    if(type == "sid"){
        currentServicesType = shops;
    }else if(type == "tid"){
        currentServicesType = traders;
    }
    for(var i = 0; i < currentServicesType.length; i++){
        if(currentServicesType[i][type] == service){
            return currentServicesType[i];
        }
    }
}
function displayService(){
    var currentServices = getService(currentId, serviceType);
    itemsList = currentServices.items;
    var itemObjects = "";
    for(var i = 0; i < itemsList.length; i++){
        itemsList[i].type = serviceType;
        itemsList[i].name = getItem(itemsList[i].id).name;
        if(getItem(itemsList[i].id).description){
            itemsList[i].description = getItem(itemsList[i].id).description;
        }
        if(getItem(itemsList[i].id).tags){
            itemsList[i].tags = getItem(itemsList[i].id).tags;
        }
        var displayPage;
        var displayId;
        if(serviceType == "sid"){
            displayPage = "items";
            for(var a = 0; a < items.length; a++){
                if(items[a].id == itemsList[i].id){
                    var currentDisplayId = itemsList[i].id;
                }
            }
            displayId = "id=" + currentDisplayId;
        }else{
            displayPage = "trade";
            displayId = "cid=" + itemsList[i].id;
        }
        itemObjects += "<a class='search-results-link' href='https://bkfighter.com/traverse/" + displayPage + ".html?" + displayId + "'>" + objectTemplates(itemsList[i]) + "</a>";
    }
    document.getElementById("items-container").innerHTML = itemObjects;
    
    if(serviceType == "sid"){
        var genericUrl = "./images/shops/TammanyAndSons_Lorville.jpg";
        var specificUrl = "";
        document.getElementById("service-name").innerHTML = currentServices.name + "<style>#service-info{background: url('./images/shops/" + encodeURI(currentServices.chain).replace("'", "%27") + ".jpg'), url('./images/objects/general/FileNotFound.png'), url(" + genericUrl + "); background-position: center; background-size: cover;}</style>";
    }else if(serviceType == "tid"){
        document.getElementById("service-info").style.height = "60px";
        document.getElementById("service-name").style.top = "10px";
        document.getElementById("service-name").innerHTML = currentServices.name;
    }
}


var tid = getParameterByName("tid");
var sid = getParameterByName("sid");
var currentId;
var serviceType;
var itemsList;
if(tid && sid){
    window.location.href = "404.html";
}else if(tid){
    currentId = tid;
    serviceType = "tid";
    displayService();
}else if(sid){
    currentId = sid;
    serviceType = "sid";
    displayService();
}else{
    window.location.href = "404.html";
}