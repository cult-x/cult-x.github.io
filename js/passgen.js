


function initPasswordOptionsForm() {
	// json file
	var myRequest = new Request('json/passGen.json');

	// create an empty object
	var elements = document.createDocumentFragment();

	// process json
	fetch(myRequest)
		.then(function (response) { return response.json(); })
		.then(function (json) {
			var objCount = json.CharacterSets.length;
			var charsetStr = "";
			for (var i = 0; i < objCount; i++) {
				var spanElem = document.createElement("div");
				var inputElem = document.createElement("input");
				inputElem.type = "checkbox";
				inputElem.checked = json.CharacterSets[i].active;
				inputElem.id = "charset-" + i;
				spanElem.appendChild(inputElem);
				var labelElem = document.createElement("label");
				labelElem.htmlFor = inputElem.id;
				labelElem.appendChild(document.createTextNode(json.CharacterSets[i].name));
				var smallElem = document.createElement("small");
				smallElem.appendChild(document.createTextNode(" (" + json.CharacterSets[i].chars + ")"));
				labelElem.appendChild(smallElem);
				spanElem.appendChild(labelElem);
				elements.appendChild(spanElem);

				if (json.CharacterSets[i].active == true) {
					charsetStr += json.CharacterSets[i].chars;
					//console.log(charsetStr);
				}

				document.getElementById("charsetStr").value = charsetStr;
			}
			var containerElem = document.getElementById("charset-checkboxes");
			containerElem.insertBefore(elements, containerElem.firstChild);
		})
		.catch(err => { throw err });
}

function initPasswordSettingsForm() {
	// json file
	var myRequest = new Request('json/passGen.json');

	// create an empty object
	var elements = document.createDocumentFragment();

	// process json
	fetch(myRequest)
		.then(function (response) { return response.json(); })
		.then(function (json) {
			//var objCount = json.CharacterSets.length;
			//for(var i = 0; i < objCount; i++) {
			//}
			var inpLength = document.getElementById("length");
			var inpEntropy = document.getElementById("entropy");

			inpLength.value = json.Settings[0].Length;
			inpEntropy.value = json.Settings[0].Entropy;

			//console.log('password Length: ' + json.Settings[0].Length);
			//console.log('password Entropy: ' + json.Settings[0].Entropy);


		})

		.catch(err => { throw err });
}

function StartPasswordGeneration() {
	var numOfPasswords = document.getElementById("numOfPasswords").value;

	document.getElementById("inpPassword").value = null;

	if (isNaN(numOfPasswords)) {
		alert(numOfPasswords + ' is not a number');
	} else {
		for (i = 0; i < numOfPasswords; i++) {
			generate();
		}
	}

	//document.getElementById("sample").value = text
}


// The one and only function called from the HTML code
function generate() {
	// Gather the character set
	var charsetStr = "";

	// json file
	var myRequest = new Request('json/passGen.json');

	// process json
	fetch(myRequest)
		.then(function (response) { return response.json(); })
		.then(function (json) {
			var objCount = json.CharacterSets.length;
			document.getElementById("charsetStr").value = "";
			var charsetStr = "";
			for (var i = 0; i < objCount; i++) {
				if (document.getElementById("charset-" + i).checked) {
					charsetStr += json.CharacterSets[i].chars;
					//console.log(charsetStr);
				}

			}
			//console.log(charsetStr);
			document.getElementById("charsetStr").value = charsetStr;
			//return charsetStr;
		})
		.catch(err => { throw err });
	charsetStr = document.getElementById("charsetStr").value;
	//console.log('>>' + charsetStr + '<<');

	if (document.getElementById("custom").checked)
		charsetStr += document.getElementById("customchars").value;
	charsetStr = charsetStr.replace(/ /, "\u00A0");  // Replace space with non-breaking space

	// Convert to array and remove duplicate characters
	var charset = [];
	for (var i = 0; charsetStr.length > i; i++) {
		var c = charsetStr.charCodeAt(i);
		var s = null;
		if (0xD800 > c || c >= 0xE000)  // Regular UTF-16 character
			s = charsetStr.charAt(i);
		else if (c >= 0xD800 ? 0xDC00 > c : false) {  // High surrogate
			if (charsetStr.length > i + 1) {
				var d = charsetStr.charCodeAt(i + 1);
				if (d >= 0xDC00 ? 0xE000 > d : false) {
					// Valid character in supplementary plane
					s = charsetStr.substr(i, 2);
					i++;
				}
				// Else discard unpaired surrogate
			}
		} else if (d >= 0xDC00 ? 0xE000 > d : false)  // Low surrogate
			i++;  // Discard unpaired surrogate
		else
			throw "Assertion error";
		if (s != null ? charset.indexOf(s) == -1 : false)
			charset.push(s);
	}

	var password = "";
	var statistics = "";
	if (charset.length == 0)
		alert("Error: Character set is empty");
	else if (document.getElementById("by-entropy").checked ? charset.length == 1 : false)
		alert("Error: Need at least 2 distinct characters in set");
	else {
		var length;
		if (document.getElementById("by-length").checked)
			length = parseInt(document.getElementById("length").value, 10);
		else if (document.getElementById("by-entropy").checked)
			length = Math.ceil(parseFloat(document.getElementById("entropy").value) * Math.log(2) / Math.log(charset.length));
		else
			throw "Assertion error";

		if (0 > length)
			alert("Negative password length");
		else if (length > 10000)
			alert("Password length too large");
		else {
			for (var i = 0; length > i; i++)
				password += charset[randomInt(charset.length)];

			var entropy = Math.log(charset.length) * length / Math.log(2);
			var entropystr;
			if (70 > entropy)
				entropystr = entropy.toFixed(2);
			else if (200 > entropy)
				entropystr = entropy.toFixed(1);
			else
				entropystr = entropy.toFixed(0);
			statistics = "Length = " + length + " chars, \u00A0\u00A0Charset size = " + charset.length + " symbols, \u00A0\u00A0Entropy = " + entropystr + " bits";
		}
	}
	if (document.getElementById("inpPassword").value == "") {
		document.getElementById("inpPassword").value = password;
	} else {
		document.getElementById("inpPassword").value = document.getElementById("inpPassword").value + "\n" + password;
	}

	//passwordText.data = password;
	//statisticsText.data = statistics;
}

// Returns a random integer in the range [0, n) using a variety of methods
function randomInt(n) {
	var x = randomIntMathRandom(n);
	x = (x + randomIntBrowserCrypto(n)) % n;
	return x;
}

// Not secure or high quality, but always available
function randomIntMathRandom(n) {
	var x = Math.floor(Math.random() * n);
	if (0 > x || x >= n)
		throw "Arithmetic exception";
	return x;
}

var cryptoObject = null;

// Uses a secure, unpredictable random number generator if available; otherwise returns 0
function randomIntBrowserCrypto(n) {
	if (cryptoObject == null)
		return 0;
	// Generate an unbiased sample
	var x = new Uint32Array(1);
	do cryptoObject.getRandomValues(x);
	while (x[0] - x[0] % n > 4294967296 - n);
	return x[0] % n;
}

function initCrypto() {
	var textNode = document.createTextNode("\u2717");
	//document.getElementById("crypto-getrandomvalues-entropy").appendChild(textNode);

	if ("crypto" in window)
		cryptoObject = crypto;
	else if ("msCrypto" in window)
		cryptoObject = msCrypto;
	else
		return;

	if (!("getRandomValues" in cryptoObject) || !("Uint32Array" in window) || typeof Uint32Array != "function")
		cryptoObject = null;
	else
		textNode.data = "\u2713";
}

initCrypto();

function doNothing() { }

// sleep time expects milliseconds
function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function copyPwdToClip() {
	var pwd = document.getElementById("inpPassword");
	pwd.select();
	document.execCommand("copy");
	var statusText = document.getElementById("statusText");
	//statusText.value = 'copy successfull';
	//statusText.appendChild(document.createTextNode("copy successfull"));
	statusText.innerHTML = "copy successfull";
	// Usage!
	sleep(3500).then(() => {
		statusText.innerHTML = "";
	});

}