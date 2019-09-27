function objectTemplates(object, extra){
    if(arrayContainsValue(object.type, locationObjectTypes)){
        
        var genericUrl = "'./images/objects/general/" + object.type + ".jpg'";
        if(object.name.indexOf("R&R") > -1){
            genericUrl = "./images/objects/general/RandR.jpg";
        }
        
        var servicesContainer = "";
        if(extra){
            servicesContainer = extra;
        }
        
        return "<div class=\"objects\" id=\"" + object.gameName + "\" onclick=\"toggleShow('" + object.gameName + "', 'Location')\" ><h2 class='object-name'>" + object.name + "</h2><h3 class='object-type'>" + object.type + "</h3><p class='object-description'>" + object.description + "</p>" + servicesContainer + "</div><style>#"+object.gameName+"{background: url('./images/objects/specific/" + object.gameName.replace("'", "%27") + ".jpg'), url('./images/objects/general/FileNotFound.png'), url(" + genericUrl + "); background-position: center; background-size: cover;}</style>";
    }

    if(arrayContainsValue(object.type, shopTypes)){
        var genericUrl = "";
        var associatedPrices = "";
        if(object.priceLow){
            firstPrice = "<span class='buy-low'>" + Math.round(object.priceLow*100)/100 + "</span>";
            secondPrice = "";
            if(object.priceLow != object.priceHigh){
                secondPrice = " - <span class='buy-high'>" + Math.round(object.priceHigh*100)/100 + "</span>";
            }
            associatedPrices = "<br />" + firstPrice + secondPrice + " UEC";
        }
        return "<div class=\"shops\" id=\"" + object.sid + "\" onclick=\"toggleShow('" + object.sid + "', 'Shop')\" ><h2 class='services-name'>" + object.name + associatedPrices + "</h2></div><style>#"+object.sid+"{background: url('./images/shops/" + object.chain.replace("'", "%27") + ".jpg'), url('./images/objects/general/FileNotFound.png'), url(" + genericUrl + "); background-position: center; background-size: cover;}</style>";
    }
    
    if(arrayContainsValue(object.type, traderTypes)){
        var genericUrl = "";
        var associatedPrices = "";
        if(object.priceLow != undefined){
            firstPrice = "<span class='" + object.transactionType.toLowerCase() + "-low'>" + Math.round(object.priceLow*100)/100 + "</span>";
            secondPrice = "";
            if(object.priceLow != object.priceHigh){
                secondPrice = " - <span class='" + object.transactionType.toLowerCase() + "-high'>" + Math.round(object.priceHigh*100)/100 + "</span>";
            }
            associatedPrices = "<br /><span class='" + object.transactionType.toLowerCase() + "-low'>" + object.transactionType.toUpperCase() + "</span> " + firstPrice + secondPrice + " UEC";
        }
        var refreshRate = "";
        var maxInventory = "";
        var midCharacter = "";
        if(object.refreshPerMinute != undefined){
            refreshRate = "Refresh Rate: " + Math.round(object.refreshPerMinute)/100 + " SCU/min";
        }
        if(object.maxInventory != undefined){
            maxInventory = "Max Inventory: " + Math.round(object.maxInventory)/100 + " SCU";
        }
        if(object.refreshPerMinute != undefined && object.maxInventory != undefined){
            midCharacter = "<br />";
        }
        return "<div class=\"shops\" id=\"" + object.tid + "\" onclick=\"toggleShow('" + object.tid + "', 'Trader')\" ><h2 class='services-name'>" + object.name + associatedPrices + "</h2><h3 class='description'>" + refreshRate + midCharacter + maxInventory + "</h3></div><style>#"+object.tid+"{background: url('./images/traders/" + /*object.chain.replace("'", "%27") +*/ ".jpg'), url('./images/objects/general/FileNotFound.png'), url(" + genericUrl + "); background-position: center; background-size: cover;}</style>";
    }
    
    if(arrayContainsValue(object.type, shopsTypes)){
        var genericUrl = "./images/items/2.jpg";
        var first = true;
        var secondPrice = "";
        if(object.priceLow != object.priceHigh){
            secondPrice = " - <span class='buy-high'>" + Math.round(object.priceHigh*100)/100 + "</span>";
        }
        return "<div class=\"items\" id=\"item_" + object.id + "\"><h2 class='item-name'>" + object.name + "<br /><span class='buy-low'>" + Math.round(object.priceLow*100)/100 + "</span>" + secondPrice + " UEC</h2><h3 class='description'>" + object.description.trunc(125) + "</h3></div><style>#item_"+object.id+"{background: url('./images/items/" + object.id + ".jpg'), url('./images/objects/general/FileNotFound.png'), url(" + genericUrl + "); background-position: center; background-size: cover;}</style>";
    }
    if(arrayContainsValue(object.type, tradersTypes)){
        var genericUrl = "";
        var refreshRate = "";
        var maxInventory = "";
        var midCharacter = "";
        if(object.refreshPerMinute != undefined){
            refreshRate = "Refresh Rate: " + Math.round(object.refreshPerMinute)/100 + " SCU/min";
        }
        if(object.maxInventory != undefined){
            maxInventory = "Max Inventory: " + Math.round(object.maxInventory)/100 + " SCU";
        }
        if(object.refreshPerMinute != undefined && object.maxInventory != undefined){
            midCharacter = "<br />";
        }
        return "<div class=\"items\" id=\"commodity_" + object.id + "\"><h2 class='item-name'>" + object.name + "<br /><span class='" + object.transactionType.toLowerCase() + "-low'>" + object.transactionType.toUpperCase() + "</span> <span class='" + object.transactionType.toLowerCase() + "-low'>" + Math.round(object.priceLow*100)/100 + "</span> - <span class='" + object.transactionType.toLowerCase() + "-high'>" + Math.round(object.priceHigh*100)/100 + "</span> UEC</h2><h3 class='description'>" + refreshRate + midCharacter + maxInventory + "</h3></div><style>#commodity_"+object.id+"{background: url('./images/commodities/" + /*object.id.replace("'", "%27") +*/ ".jpg'), url('./images/objects/general/FileNotFound.png'), url(" + genericUrl + "); background-position: center; background-size: cover;}</style>";
    }
    
    return "<b>ERROR: OBJECT TYPE HAS NO TEMPLATE</b>";
}

function arrayContainsValue(value, array){
    for(var i = 0; i < array.length; i++){
        if(array[i] == value){
            return true;
        }
    }
    return false;
}
String.prototype.trunc = String.prototype.trunc ||
    function(n){
        return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
    }; //Thanks Kooilnc (stackoverflow)
var locationObjectTypes = ["Star", "Planet", "Moon", "Lagrange", "Landing Zone", "Satellite", "Outpost"];
var shopTypes = ["Shop"];
var traderTypes = ["Trader"];
var shopsTypes = ["sid"];
var tradersTypes = ["tid"];