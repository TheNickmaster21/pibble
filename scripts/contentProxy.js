// Return the pages inner html
function getCurrentDocumentInnerHTML(responseFunction) {
    let innerHTML = document.documentElement.innerHTML;
    responseFunction(innerHTML);
}

function setElementHighlight(token) {
    console.log(token);
    document.querySelectorAll('*').forEach(function (node) { //TODO switch to proper for each loop
        if (node.innerHTML.trim() === token.innerText && getParents(node) === token.elements) {
            //TODO get current path and work upward to parent till reach body


            let overlay = document.createElement('div');
            //TODO make highlight fade in
            overlay.style.cssText = 'position: fixed;z-index: 999999999999999;background: rgba(0, 100, 255, 0.3);pointer-events: none;';
            overlay.id = 'pibble-highlight-overlay';
            overlay.style.left = '0';
            overlay.style.top = '0';
            overlay.style.width = '0';
            overlay.style.height = '0';

            if (document.body.lastChild.id !== 'pibble-highlight-overlay')
                document.body.appendChild(overlay);

            overlay = document.body.lastChild;
            let rect = node.getBoundingClientRect();
            overlay.style.top = rect.top + 'px';
            overlay.style.left = rect.left + 'px';
            overlay.style.width = rect.width + 'px';
            overlay.style.height = rect.height + 'px';
            setTimeout(() => {
                overlay.style.top = '0px';
                overlay.style.left = '0px';
                overlay.style.width = '0px';
                overlay.style.height = '0px';
            }, 3000);
        }
    });
}

/**
 * @return {string}
 */
function getParents(elem) {
    const parents = $(elem).parents("*");
    let selector = "";
    for (let i = parents.length - 4; i >= 0; i--) {
        selector += parents[i].localName + " ";
    }
    selector += elem.localName;
    return selector.toLowerCase();
}


// Listen for browser events
chrome.runtime.onMessage.addListener(function (message, sender, responseFunction) {
    if (message === 'get_current_document_inner_HTML') {
        getCurrentDocumentInnerHTML(responseFunction);
    }
    else if (message.action === 'highlight_HTML_element') {
        setElementHighlight(message.token);
    }
});
