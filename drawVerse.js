var objects = document.getElementsByClassName("objects");
var screenPos = {"x": 0.5*document.getElementById("verse-container").offsetWidth, "y": 0.5*document.getElementById("verse-container").offsetHeight};
var objectPositions = {
    "StantonStar": {"x": 0, "y": 0},
    "NyxStar": {"x": 0, "y": 300}
};
var lastMouse = {"x": null, "y": null};
var makeObjectTypesOrder = ["Star", "Planet", "Moon", "Satellite", "Landing Zone", "Outpost", "Lagrange", true];

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function makeObject(object){
    var newObject = document.createElement("DIV");
    newObject.classList.add("object-container");
    var childObjects = "";
    for(var a = 0; a < makeObjectTypesOrder.length; a++){
        for(var i = 0; i < verseData.length; i++){
            if(verseData[i].parent == object.name && verseData[i].type == makeObjectTypesOrder[a]){
                childObjects += makeObject(verseData[i]);
            }
        }
    }
    var servicesObjects = "";
    var counter = false;
    for(var i = 0; i < traders.length; i++){
        if(traders[i].parent == object.gameName){
            traders[i].type = "Trader";
            servicesObjects += makeObject(traders[i]);
            if(counter){
                servicesObjects += "<br />";
            }
            counter = !counter;
        }
    }
    for(var i = 0; i < shops.length; i++){
        if(shops[i].parent == object.gameName){
            shops[i].type = "Shop";
            servicesObjects += makeObject(shops[i]);
            if(counter){
                servicesObjects += "<br />";
            }
            counter = !counter;
        }
    }
    newObject.innerHTML = objectTemplate(object, childObjects, servicesObjects);
    if(object.parent == "none"){
        newObject.classList.add("root-object");
        document.getElementById("verse-container").appendChild(newObject);
    }else{
        if(object.type == "Shop"){
            return newObject.innerHTML;
        }else if(object.type == "Trader"){
            return newObject.innerHTML;
        }else{
            return "<div class=\"object-container\">" + newObject.innerHTML + "</div>";
        }
    }
}
function objectTemplate(object, childObjects, servicesObjects){
    var servicesContainer = "<div class=\"services-container\">" + servicesObjects + "</div>";
    var objectInfo = objectTemplates(object, servicesContainer);
    if(object.type == "Shop"){
        var childContainer = "";
    }else if(object.type == "Trader"){
        var childContainer = "";
    }else{
        var childContainer = "<div class=\"child-container\">" + childObjects + "</div>";
    }
    return objectInfo + childContainer;
}
function toggleShow(object, type){
    if(type == "Location"){
        document.getElementById(object).parentElement.getElementsByClassName("child-container")[0].classList.toggle("show-children");
        document.getElementById(object).classList.toggle("show-object");
    }
    if(type == "Shop"){
        document.getElementById(object).parentElement.parentElement.classList.toggle("show-object");
        window.open("https://bkfighter.com/traverse/services.html?sid=" + object,  "_blank", "toolbar=no,scrollbars=no,resizable=yes,top=" + (window.innerHeight - 600)/2 + ",left=" + (window.innerWidth - 1100)/2 + ",width=1100,height=600");
    }
    if(type == "Trader"){
        document.getElementById(object).parentElement.parentElement.classList.toggle("show-object");
        window.open("https://bkfighter.com/traverse/services.html?tid=" + object,  "_blank", "toolbar=no,scrollbars=no,resizable=yes,top=" + (window.innerHeight - 600)/2 + ",left=" + (window.innerWidth - 1100)/2 + ",width=1100,height=600");
    }
}

function addDrag(mouse){
    document.getElementById('verse-container').addEventListener("mousemove", doDrag);
    lastMouse.x = mouse.clientX;
    lastMouse.y = mouse.clientY;
    return false;
}
function removeDrag(){
    document.getElementById('verse-container').removeEventListener("mousemove", doDrag);
}
function doDrag(e){
    var mouse = {"x": e.clientX, "y": e.clientY};
    var difference = {"x": mouse.x - lastMouse.x, "y": mouse.y - lastMouse.y};
    screenPos.x += difference.x;
    screenPos.y += difference.y;
    
    setObjectCoordinates();
    
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
}
function setObjectCoordinates(){
    var rootObjects = document.getElementsByClassName("root-object");
    for(var i = 0; i < rootObjects.length; i++){
        var object = rootObjects[i];
        var position = objectPositions[object.childNodes[0].getAttribute('id')];

        object.style.top = screenPos.y + position.y + "px";
        object.style.left = screenPos.x + position.x + "px";
    }
    document.getElementById('verse-container').style.backgroundPositionX = screenPos.x + "px";
    document.getElementById('verse-container').style.backgroundPositionY = screenPos.y + "px";
}

function keyDown(e){
    if(e.key == "Shift"){
        shiftPressed = true;
    }
    var differenceSpeed = arrowSpeed * (1 + shiftPressed * (shiftModifier - 1));
    switch(e.key){
        case "ArrowLeft":
            arrowDirections.x = 1;
            break;
        case "ArrowRight":
            arrowDirections.x = -1;
            break;
        case "ArrowUp":
            arrowDirections.y = 1;
            break;
        case "ArrowDown":
            arrowDirections.y = -1;
            break;
    }
    screenPos.x += arrowDirections.x * differenceSpeed;
    screenPos.y += arrowDirections.y * differenceSpeed;
    //document.getElementById('output').innerHTML = "x: " + arrowDirections.x + " y: " + arrowDirections.y;
    setObjectCoordinates();
}
function keyUp(e){
    if(e.key == "Shift"){
        shiftPressed = false;
    }
    switch(e.key){
        case "ArrowLeft":
            arrowDirections.x = 0;
            break;
        case "ArrowRight":
            arrowDirections.x = 0;
            break;
        case "ArrowUp":
            arrowDirections.y = 0;
            break;
        case "ArrowDown":
            arrowDirections.y = 0;
            break;
    }
}
var arrowSpeed = 5;
var shiftModifier = 10;
var shiftPressed = false;
var arrowDirections = {"x": 0, "y": 0};

var elem = document.getElementById("verse-container");
function openFullscreen() { //w3schools
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

function goToLocation(location){
    var theresMore = true;
    var currentObject = location;
    while(theresMore){
        if(document.getElementById(currentObject)){
            document.getElementById(currentObject).parentElement.getElementsByClassName("child-container")[0].classList.add("show-children");
            document.getElementById(currentObject).classList.add("show-object");

            if(document.getElementById(currentObject).parentElement.parentElement.classList.contains("root-object")){
                currentObject = document.getElementById(currentObject).parentElement.parentElement.parentElement.childNodes[0].id;
                
                document.getElementById(currentObject).parentElement.getElementsByClassName("child-container")[0].classList.add("show-children");
                document.getElementById(currentObject).classList.add("show-object");
                
                theresMore = false;
            }else{
                currentObject = document.getElementById(currentObject).parentElement.parentElement.parentElement.childNodes[0].id;
            }
        }else{
            theresMore = false;
        }
    }
    var rect = document.getElementById(location).getBoundingClientRect();
console.log(rect.top, rect.right, rect.bottom, rect.left);
    var positionX = (rect.left + rect.right)/4;
    var positionY = (rect.top + rect.bottom)/4;

    screenPos = {"x": 0.5*document.getElementById("verse-container").offsetWidth - positionX,"y": 0.5*document.getElementById("verse-container").offsetHeight - positionY};
    setObjectCoordinates();
}

makeObject(verseData[110]);
makeObject(verseData[111]);

setObjectCoordinates();
document.getElementById('verse-container').addEventListener("mousedown", addDrag);
document.getElementById('verse-container').addEventListener("mouseup", removeDrag);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
if(getParameterByName("loc")){
    goToLocation(decodeURI(getParameterByName("loc")));
}