var myRequest = new Request('json/mainMenue.json');

var content = document.getElementById('content');

fetch(myRequest)
.then(function(response) { return response.json(); })
.then(function(json) {
    var objCount = json.navigation.length;
    for(var i = 0; i < objCount; i++) {
        var navItem          = document.createElement('a');
        var blocksParent     = document.createElement('div');
        var blocksPicture    = document.createElement('div');
        var blocksText       = document.createElement('div');
        var blocksCellHeader = document.createElement('div');
        var blocksCellText   = document.createElement('div');
        var faIcon           = document.createElement('i');

        navItem.setAttribute('href', json.navigation[i].uri);
        blocksParent.setAttribute('class', 'blocksParent col-sm col-xs');
        blocksPicture.setAttribute('class', 'blocksPicture');
        blocksText.setAttribute('class', 'blocksText');
        blocksCellHeader.setAttribute('class', 'blocksCellHeader');
        blocksCellText.setAttribute('class', 'blocksCellText');
        // faIcon.setAttribute('class', 'fa ' + json.navigation[i].icon)
        faIcon.setAttribute('class', json.navigation[i].icon)
        blocksCellHeader.textContent = json.navigation[i].title;
        blocksCellText.textContent = json.navigation[i].description;

        blocksText.appendChild(blocksCellHeader);
        blocksText.appendChild(blocksCellText);
        blocksPicture.appendChild(faIcon);
        blocksParent.appendChild(blocksPicture);
        blocksParent.appendChild(blocksText);
        navItem.appendChild(blocksParent);


        content.appendChild(navItem);

        console.log('Navigation item: ' + json.navigation[i].title);
    }
})
.catch(err => { throw err });