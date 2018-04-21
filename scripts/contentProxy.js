// Return the pages inner html
function getCurrentDocumentInnerHTML(responseFunction) {
    let innerHTML = document.documentElement.innerHTML;
    responseFunction(innerHTML);
}

function setElementHighlight(token) {
    document.querySelectorAll('*').forEach(function(node) {
        if(node.innerHTML === token.innerText) {
            let overlay = document.createElement('div');
            overlay.style.cssText = 'position: fixed;z-index: 999999999999999;left: 0;top: 0;width: 0;height: 0;background: rgba(0, 100, 255, 0.3);pointer-events: none;transition: 0.2s;';
            overlay.id = 'pibble-highlight-overlay';

            if(document.body.lastChild.id !== 'pibble-highlight-overlay')
                document.body.appendChild(overlay);

            let rect = node.getBoundingClientRect();
            overlay.style.top = rect.top + 'px';
            overlay.style.left = rect.left + 'px';
            overlay.style.width = rect.width + 'px';
            overlay.style.height = rect.height + 'px';
        }
    });




}

// Listen for browser events
chrome.runtime.onMessage.addListener(function (message, sender, responseFunction) {
    if (message === 'get_current_document_inner_HTML') {
        getCurrentDocumentInnerHTML(responseFunction);
    }
    else if(message.action === 'highlight_HTML_element') {
        setElementHighlight(message.token);
    }
});
