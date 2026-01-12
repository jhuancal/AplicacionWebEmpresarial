function Noty(type, title, message) {
    alert(title + ": " + message);
}

function fload(action) {
    if (action === 'show') console.log("Loading...");
    else console.log("Loaded.");
}

function callAjax(data, url, method) {
    return $.ajax({
        url: url,
        type: method,
        contentType: 'application/json',
        data: JSON.stringify(data)
    });
}

function getNro(index) { return index + 1; }