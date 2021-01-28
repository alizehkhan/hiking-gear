if ([
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ].some(toMatchItem => {return navigator.userAgent.match(toMatchItem)}))
  document.body.innerHTML = `<img id="errorImage" src="resources/images/phone-man.png">`
