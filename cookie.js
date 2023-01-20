function setBearer() {
    (async function () {
        let bearer = await getCookie();

        //save in local storage
        chrome.storage.sync.set({ bearer }, function () {
        });
    })();
}

async function getCookie() { //get depop bearer from logged in user
    const cookies = await chrome.cookies.getAll({ "name": "access_token" });
    return cookies[0].value;
}