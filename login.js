let loginButton = document.getElementById("LoginButton");

loginButton.addEventListener("click", async () => {
  //if above successfuly set logged in to true 
  let isLoggedIn = true;

  chrome.storage.sync.set({isLoggedIn}, function () {
    console.log('isLoggedIn is set to ' + isLoggedIn);
  });

  //get bearer token / username 
  setBearer();

  login(document.getElementById("UserName").value, document.getElementById("PassWord").value);
});

function login(userNameInput, passWordInput) {
  let username = userNameInput;
  let password = passWordInput;

  console.log(username, password);

  chrome.storage.sync.set({ username }, function () {
    console.log('username is set to ' + username);
  });

  chrome.storage.sync.set({ password }, function () {
    console.log('password is set to ' + password);
  });

  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch("https://depop.com/" + userNameInput, requestOptions)
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