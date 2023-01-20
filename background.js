//LOGGED IN PAGE FUNCTIONS
  chrome.storage.sync.get(['isLoggedIn'], function (result) {
    if (result.isLoggedIn) { //logged in
      chrome.action.setPopup({popup: "popup.html"});
      // setBearer();
      // getUserItems();
    }
    else { //logged out
      chrome.action.setPopup({popup: "login.html"});
    }
  });

  chrome.storage.sync.get(['bearer'], function (result) {
    console.log('bearer is: ' + result.bearer);
  });
  
  chrome.storage.sync.get(['username'], function (result) {
    console.log('username is: ' + result.username);
  });

  chrome.storage.sync.get(['password'], function (result) {
    console.log('password is: ' + result.password);
  });
  