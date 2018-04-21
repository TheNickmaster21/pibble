// Return the pages inner html
function getCurrentDocumentInnerHTML(responseFunction) {
    let innerHTML = document.documentElement.innerHTML;
    responseFunction(innerHTML);
}

function setElementHighlight(token) {
    console.log(token);

    //document.querySelectorAll('*').forEach(function(node) {
    //});

    /*
    let overlay = document.querySelector('#mouseover_overlay');
    document.addEventListener('mouseover', e => {

        let elem = e.target;
        console.log(elem);
        let rect = elem.getBoundingClientRect();
        overlay.style.top = rect.top +'px';
        overlay.style.left = rect.left +'px';
        overlay.style.width = rect.width +'px';
        overlay.style.height = rect.height +'px';
    });
    */
}

// Listen for browser events
chrome.runtime.onMessage.addListener(function (message, sender, responseFunction) {
    if (message === 'get_current_document_inner_HTML') {
        getCurrentDocumentInnerHTML(responseFunction);
    }
    else if(message === 'highlight_HTML_element') {
        console.log('kbhjdesfbhjkdfgs');
        //setElementHighlight(message.token);
    }
});
