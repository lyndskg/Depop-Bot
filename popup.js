//LOGGED IN PAGE FUNCTIONS
chrome.storage.sync.get(['isLoggedIn'], function (result) {
  
  let itemsTable = document.getElementById('ItemsTable');
  
  itemsTable.addEventListener('click', async (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
      return;
    }
  
    getItemThenRefresh(event.target.id);
  })
  
  async function getItemThenRefresh(slug) {
    chrome.storage.sync.get(['username', 'bearer'], function (cookie) {
      var myHeaders = new Headers();
  
      myHeaders.append("authorization", "Bearer " + cookie.bearer);
      
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
  
      fetch("https://webapi.depop.com/api/v2/products/" + slug, requestOptions)
        .then(response => response.json())
        .then(result => refreshListing(result, cookie.bearer))
        .catch(error => console.log('error', error));
    });
  }

  
  function refreshListing(item, bearer) {
    //loop through values and created refresh request
    console.log(item);
  
    function getPictureIds() {
      let ids = [];
      for (const picture of item.pictures) {
        ids.push(picture[0].id);
      }
      console.log(ids);
      return ids;
    }
  
    var myHeaders = new Headers();
    myHeaders.append("authorization", "Bearer " + bearer);
    myHeaders.append("content-type", "application/json");
  
    var raw = JSON.stringify({
      "pictureIds":
        getPictureIds(),
      "description": item.description,
      "categoryId": item.categoryId,
      "quantity": item.quantity,
      "nationalShippingCost": item.price.nationalShippingCost,
      "internationalShippingCost": item.price.internationalShippingCost,
      "priceAmount": item.price.priceAmount,
      "brandId": item.brandId,
      "condition": item.condition,
      "colour": item.colour,
      "source": item.source,
      "age": item.age,
      "style": item.style,
      "shippingMethods": item.shippingMethods,
      "priceCurrency": item.price.currencyName,
      "address": item.address,
      "countryCode": item.countryCode,
      "attributes": item.attributes,
      "isKids": item.isKids,
      "gender": item.gender,
      "group": item.group,
      "variantSetId": item.variantSetId,
      "variants": item.variants
    });
  
    console.log(raw);
  
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    fetch("https://webapi.depop.com/api/v1/products/" + item.slug, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  let refreshListingsButton = document.getElementById("refreshListings");
  
  refreshListingsButton.addEventListener("click", async () => {
    //getUser
    console.log("refreshing...");
    refreshAllListings();
  });
  
  async function refreshAllListings() {
    //get all items
    //iternate over response passing slug to getItem
    //pause for 0.5 seconds for each item
  
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
  
    chrome.storage.sync.get(['userId'], function (result) {
      paginatedRefresh('', false, result.userId.toString());
    });
  
    function paginatedRefresh(page, end, userId) { //24 limit
      fetch("https://webapi.depop.com/api/v1/shop/" + userId + "/products/?limit=24&offset_id=" + page, requestOptions)
        .then(response => response.json())
        .then(result => {
          //refresh all items from current api call
          interateThroughItems(result.products);
  
          //keep fetching if not at end
          if (end == false) {
            return paginatedRefresh(result.meta.last_offset_id, result.meta.end, userId);
          }
        });
    }
  
    async function interateThroughItems(items) {
      let itemCount = 0;
      for (const item of items) {
        itemCount++;
        //wait 0.5 sec
        delay(500);
        getItemThenRefresh(item.slug);
      }
      console.log("Items refreshed: " + itemCount);
    }
  }
  //delay helper function
  const delay = ms => new Promise(res => setTimeout(res, ms));
})