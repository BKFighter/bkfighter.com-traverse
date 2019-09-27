var sheet = document.getElementById("sheet");
var renderedSheet = "";
var statSheet = [];

var commodityRow = "<tr><th>Shops</th>";
for(var i = 0; i < commodities.length; i++){
    commodityRow += "<th>" + commodities[i].name + "</th>";
}
commodityRow += "</tr>";

renderedSheet += commodityRow;

for(var i = 0; i < traders.length; i++){
    var itemRow = "<tr>";
    itemRow += "<td>" + traders[i].name + "</td>";
    for(var a = 0; a < commodities.length; a++){
        var commodityInfo = "<td>-</td>";
        for(var b = 0; b < traders[i].items.length; b++){
            if(commodities[a].id == traders[i].items[b].id){
                commodityInfo = "<td><span class=transType" + traders[i].items[b].transactionType + ">" + traders[i].items[b].transactionType + "</span> @ <span id=price-" + i + "-" + a + ">" + Math.round(100*traders[i].items[b].priceLow)/100 + " - " + Math.round(100*traders[i].items[b].priceHigh)/100 + "</span> UEC<br /><span id=refresh-" + i + "-" + a + ">" + Math.round(traders[i].items[b].refreshPerMinute)/100 + " SCU/min of " + Math.round(traders[i].items[b].maxInventory)/100 + "</span></td>";
                statSheet.push({"id": i+"-"+a, "price": traders[i].items[b].priceLow, "refresh": traders[i].items[b].refreshPerMinute, "commodity": commodities[a].id, "trader": traders[i].tid});
            }
        }
        if(commodityInfo == "<td>-</td>"){
            statSheet.push({"id": i+"-"+a, "price": false, "refresh": false, "commodity": commodities[a].id, "trader": traders[i].tid});
        }
        itemRow += commodityInfo;
    }
    renderedSheet += itemRow + "</tr>";
}

var style = document.createElement("style");
style.type = "text/css";
for(var a = 0; a < commodities.length; a++){
    var commodityStats = [];
    for(var n = 0; n < statSheet.length; n++){
        if(statSheet[n].commodity == commodities[a].id && statSheet[n].price !== false){
            commodityStats.push({"id": statSheet[n].id, "price": statSheet[n].price, "refresh": statSheet[n].refresh});
        }
    }
    var priceLow = commodityStats[0].price;
    var priceHigh = commodityStats[0].price;
    var refreshLow = commodityStats[0].refresh;
    var refreshHigh = commodityStats[0].refresh;
    for(var y = 0; y < commodityStats.length; y++){
        var cur = commodityStats[y];
        if(cur.price < priceLow){
            priceLow = cur.price;
        }
        if(priceHigh < cur.price){
            priceHigh = cur.price;
        }
        if(cur.refresh < refreshLow){
            refreshLow = cur.refresh;
        }
        if(refreshHigh < cur.refresh){
            refreshHigh = cur.refresh;
        }
    }
    var priceRange = priceHigh - priceLow;
    var refreshRange = refreshHigh - refreshLow;
    for(var y = 0; y < commodityStats.length; y++){
        var cur = commodityStats[y];
        var pricePercent = (cur.price - priceLow)/priceRange;
        var refreshPercent = (cur.refresh - refreshLow)/refreshRange;
        var priceColor = "#" + ((Math.round(pricePercent*204).toString(16).length==2) ? Math.round(pricePercent*204).toString(16) : "0"+Math.round(pricePercent*204).toString(16)) + "" + ((Math.round((1-pricePercent)*204).toString(16).length==2) ? Math.round((1-pricePercent)*204).toString(16) : "0"+Math.round((1-pricePercent)*204).toString(16)) + "00";
        var refreshColor = "#" + ((Math.round((1-refreshPercent)*204).toString(16).length==2) ? Math.round((1-refreshPercent)*204).toString(16) : "0"+Math.round((1-refreshPercent)*204).toString(16)) + "" + ((Math.round(refreshPercent*204).toString(16).length==2) ? Math.round(refreshPercent*204).toString(16) : "0"+Math.round(refreshPercent*204).toString(16)) + "00";
        style.innerHTML += "#price-"+cur.id+"{color:"+priceColor+";}";
        style.innerHTML += "#refresh-"+cur.id+"{color:"+refreshColor+";}";
    }
}
document.getElementsByTagName("head")[0].appendChild(style);

sheet.innerHTML = renderedSheet;
console.log(style);
console.log(statSheet);

window.onscroll = function(){
    document.getElementById("sheet").childNodes[0].childNodes[0].style.left = document.getElementById("sheet").childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect().width-1-window.scrollX + "px";
    for(var i = 1; i < document.getElementById("sheet").childNodes[0].childNodes.length; i++){
        document.getElementById("sheet").childNodes[0].childNodes[i].childNodes[0].style.top = document.getElementById("sheet").childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect().y + document.getElementById("sheet").childNodes[0].childNodes[0].childNodes[0].getBoundingClientRect().height + 47*(i-1)-1-window.scrollY + "px";
    }
};