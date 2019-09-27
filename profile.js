function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



function allowEdit(){ //Allows edit
    if(canEdit){
        document.getElementById("edit-profile").style.display = "inline";
    }
}



function changeUsername(newName){ //Change Username
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://bkfighter.com/traverse/changeUsername.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if(xhr.responseText != "Success"){
            alert("Change Username Error: " + xhr.responseText);
        }
    };
    xhr.send('newName=' + encodeURI(newName));
}



function changePicture(newPicture){ //Change Username
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://bkfighter.com/traverse/changePicture.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if(xhr.responseText != "Success"){
            alert("Change Picture Error: " + xhr.responseText);
        }
    };
    xhr.send('newLink=' + encodeURI(newPicture));
}



getPublicData(getParameterByName("user"), function(e){ //Finds profile user's info
    if(e.id !== false){
        document.getElementById("user-username").innerHTML = e.username;
        document.getElementById("user-picture").src = e.picture;
    }
});

var canEdit = false

getUserData(function(e){ //Is this current owner?
    if(e.id == getParameterByName("user")){
        canEdit = true;
    }
    allowEdit();
});