/* ############################### TEMPLATING ############################### */


fetch("https://23285.wayscript.io")
  .then((resp) => resp.json()) // Transform the data into json
  .then(function(data) {
    hikingGear = data['data'];

    // Where all the card html code will be dumped
    cardHTML = "";

    // for each hiking gear item array
    for (i = 0; i < hikingGear.length; i++) {
      imageFilename = hikingGear[i]['p'];
      filterCategoryName = hikingGear[i]['f'];
      filterCategoryID = filterCategoryName.toLowerCase().replace(/ /g, "-");
      itemName = hikingGear[i]['i'].toUpperCase();
      brandName = hikingGear[i]['b'];
      productName = hikingGear[i]['n'];
      price =  hikingGear[i]['c']  !== "" ? '£' + hikingGear[i]['c'] : "";
      weight = hikingGear[i]['w'] !== "" ? ' | ' + hikingGear[i]['w'] + 'g' : "";
      longDescription = hikingGear[i]['d'].replace(/\n/g, "<br>");

      buttonCode = hikingGear[i]['u'] !== '' ?
`<button onclick="window.open('`+hikingGear[i]['u']+`', '_blank');" class="buy">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
</button>
` : "";

        // substitute in the image filename, filter category & item name
        //   into the template
        // and dump/add that code onto cardHTML
        cardHTML += `
          <div onclick="changeModalTo('` + hikingGear[i]['a'].toString() + `Modal');" class="card">
            <p id="` + filterCategoryID + `" class="card-category">` + filterCategoryName + `</p>
            <img src="` + imageFilename + `" class="card-image">
            <p class="card-itemname">` + itemName + `</p>
          </div>
          <div id="` + hikingGear[i]['a'].toString() + `Modal" data-filter="`+filterCategoryID+`" class="modal">
            <div onclick="goToNextModal(-1);" class="left">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div onclick="goToNextModal(+1);" class="right">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="modal-card">
              <svg id="close-modal" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path id="close-modal-path" stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line id="close-modal-line1" x1="18" y1="6" x2="6" y2="18" />
                <line id="close-modal-line2" x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <div class="modal-left">
                <p class="card-category" id="` + filterCategoryID + `">` + filterCategoryName + `</p>
                <div class="modal-left-info">
                  <img class="modal-card-image" src="` + imageFilename + `">
                  <p class="modal-card-name">` + itemName + `</p>
                  <p class="modal-card-brand"><b>` + brandName + `</b> ` + productName +`</p>
                  <p class="modal-price-weight">`+ price +` `+ weight +`</p>
                </div>
              </div>
              <p class="modal-right">`+ longDescription +`</p>`
              + buttonCode +
            `</div>
          </div>`;
      }


      // add the cards html to div with ID "chuckCardsHere"
      document.getElementById('chuckCardsHere').innerHTML = cardHTML;
});


/* ---------------------------------- FILTER ---------------------------------- */


function changeFilter(clickedFilterBtn) {
  currentFilter = clickedFilterBtn.className.split(' ')[1]
  $(document).ready(function() {
    // update the hidden currentFilter input value
    $("#currentFilter").val(currentFilter);
    // For each element that has the class FILTER
    $(".filter").each(function() {
      $(this).removeClass("active");
      // if the button was the clicked one
      if ($(this).is(clickedFilterBtn)) {
        $(this).addClass("active");
      }
    });
    // For each element that has the class CARD
    $(".card").each(function() {
      // If that card element contains an element with ID of the filter    OR    wantedCategory is show-all
      if ( $(this).has('#'+currentFilter).length || currentFilter === 'show-all') {
        $(this).show();
      } else { // if that element does NOT have the wanted filter, HIDE IT
        $(this).hide();
      }
    });
  });
}


/* ################################# MODALS ################################# */


function changeModalTo(newModalID) {
  document.body.style.overflow = "hidden";

  currentModalInput = document.getElementById('openModalID');
  if (currentModalInput.value !== '0') { // if a modal is already open, hide it
    document.getElementById(currentModalInput.value).style.display = "none";
  }
  currentModalInput.value = newModalID;
  if (newModalID !== '0') { // if a new modal needs to be shown
    document.getElementById(newModalID).style.display = 'flex';
    // show/hide left & right arrows
    document.getElementById(newModalID).children[0].style.display = nextModalExists(-1) ? "flex" : "none";
    document.getElementById(newModalID).children[1].style.display = nextModalExists(+1) ? "flex" : "none";
  }
}

function nextModalExists(direction) {
  openModalID = document.getElementById("openModalID").value;
  if (openModalID !== "0") {
    nextModalID = (parseInt(openModalID.slice(0,-5)) + direction).toString() + 'Modal';
    currentFilter = document.getElementById('currentFilter').value;
    // if there is a next modal in that direction
    return (document.getElementById(nextModalID) && (currentFilter === 'show-all' || currentFilter === document.getElementById(nextModalID).getAttribute('data-filter')));
  }
}

// goToNextModal(-1)  --> shows modal to the LEFT of current modal
// goToNextModal(+1)  --> shows modal to the RIGHT of current modal
function goToNextModal(direction) {
  if (nextModalExists(direction)) {
    nextModalID = (parseInt(document.getElementById("openModalID").value.slice(0,-5)) + direction).toString() + 'Modal';
    changeModalTo(nextModalID);
  }
}

// close modal
window.onclick = function(event) {
  if (event.target.id == document.getElementById("openModalID").value || event.target.id.includes("close-modal")) {
    changeModalTo('0');
    document.body.style.overflow = "visible";
  }
}


// detects when keyboard key goes UP
document.onkeyup = function(e) {
  e = e || window.event;
  if      (e.keyCode == '37') goToNextModal(-1); // left arrow, modal to left
  else if (e.keyCode == '39') goToNextModal(+1); // right arrow, modal to right
  else if (e.keyCode == '27') changeModalTo('0'); // esc button, hides modal
}
