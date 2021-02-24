function encodeUri() {
    var obj = document.getElementById('url');
    var unencoded = obj.value;
    obj.value = encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");	
}

function decodeUri() {
    var obj = document.getElementById('url');
    var encoded = obj.value;
    obj.value = decodeURIComponent(encoded.replace(/\+/g,  " "));
}

function decodeUriAndOpen() {
    var obj = document.getElementById('url');
    var encoded = obj.value;
    obj.value = decodeURIComponent(encoded.replace(/\+/g,  " "));
    if(obj.value != "") {
        var win = window.open(obj.value, '_blank');
    }
    
}