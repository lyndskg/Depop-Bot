let loginButton = document.getElementById("LoginButton");

loginButton.addEventListener("click", async () => {
  //if above successfuly set logged in to true 
  let isLoggedIn = true;

  chrome.storage.sync.set({isLoggedIn}, function () {
    console.log('isLoggedIn is set to ' + isLoggedIn);
  });

  //get bearer token / username 
  setBearer();

  login(document.getElementById("UserName").value);
});

function login(userNameInput) {
  let username = userNameInput;
  console.log(username);

  chrome.storage.sync.set({ username }, function () {
    console.log('username is set to ' + username);
  });

  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch("https://webapi.depop.com/api/v1/shop/" + userNameInput, requestOptions)
    .then(response => response.json())
    .then(result => {
      userId = result.id;
      
      chrome.storage.sync.set({ userId }, function () {
        console.log('userId is set to ' + userId);

        chrome.action.setPopup({ popup: "popup.html" });
        window.location.href = "popup.html";
      })
    });
}