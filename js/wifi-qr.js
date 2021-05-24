function escape_string(string) {
    var to_escape = ["\\", ";", ",", ":", '"'];
    var hex_only = /^[0-9a-f]+$/i;
    var output = "";
    for (var i = 0; i < string.length; i++) {
        if ($.inArray(string[i], to_escape) != -1) {
            output += "\\" + string[i];
        } else {
            output += string[i];
        }
    }
    return output;
}

function generate() {
    var ssid = $("#ssid").val();
    var hidden = $("#hidden").is(":checked");
    var enc = $("#enc").val();
    if (enc != "nopass") {
        var key = $("#key").val();
        $("#showkey").text(enc + " Passphrase: " + key);
    } else {
        var key = "";
        $("#showkey").text("");
    }
    var qrstring =
        "WIFI:S:" +
        escape_string(ssid) +
        ";T:" +
        enc +
        ";P:" +
        escape_string(key) +
        ";";
    if (hidden) {
        qrstring += "H:true";
    }
    qrstring += ";";
    $("#qrcode").empty();
    $("#qrcode").qrcode(qrstring);
    $("#showssid").text("SSID: " + ssid);
    $("#save").show();
    $("#print").css("display", "inline-block");

    var canvas = $("#qrcode canvas");
    if (canvas.length == 1) {
        var data = canvas[0].toDataURL("image/png");
        var e = $("#export");
        e.attr("href", data);
        e.attr("download", "wifi-qrcode-" + ssid + ".png");
        e.css("display", "inline-block");
    }
}

$(document).ready(function () {
    $("#form").submit(function () {
        generate();
        return false;
    });
    $("#save").click(function () {
        save();
    });
    $("#display-key").click(function () {
        var $key = $("#key");
        if ($key.attr("type") === "password") {
            $key.attr("type", "text");
            $("#display-key-icon").attr(
                "class",
                "glyphicon glyphicon-eye-close"
            );
        } else {
            $key.attr("type", "password");
            $("#display-key-icon").attr(
                "class",
                "glyphicon glyphicon-eye-open"
            );
        }
    });
    $("#enc").change(function () {
        if ($(this).val() != "nopass") {
            $("#key-p").show();
            $("#key").attr("required", "required");
        } else {
            $("#key-p").hide();
            $("#key").removeAttr("required");
        }
    });
    $("#form").tooltip({
        selector: "[data-toggle=tooltip]",
    });
    loadhistory();
});

// Service Worker installation
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/sw.js", { scope: "./" })
            .then(function (registration) {
                console.log("[Service Worker] Successfully installed");
            })
            .catch(function (error) {
                console.log("[Service Worker] Installation failed:", error);
            });
    });
}