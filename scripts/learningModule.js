// Set metadata on the tokens to make other code easier
function setBeforeAndAfterOnTokens(tokens) {
    if (tokens.length > 2) {
        tokens[0].after = tokens[1];
        for (let i = 1; i < tokens.length - 1; i++) {
            tokens[i].before = tokens[i - 1];
            tokens[i].after = tokens[i + 1];
        }
        tokens[tokens.length - 1].before = tokens[tokens.length - 2];
    }
}

// Create a rule set given web page tokens and the rule set data from teh UI
function convertNewRuleSet(ruleSet, tokens) {
    setBeforeAndAfterOnTokens(tokens);

    _.each(ruleSet.rules, function (rule) {
        let token = tokens[rule.index];
        // If there is a token that matches the rule, make the rule with the data we have
        if (token && token.elements) {
            rule.id = token.id;
            rule.classes = token.className.split(' ');
            rule.before = token.before && {
                elements: token.before.elements,
                innerText: token.before.innerText
            };
            rule.elements = token.elements;
            rule.after = token.after && {
                elements: token.after.elements,
                innerText: token.after.innerText
            };
            // Delete leftover data we don't need
            delete rule.index;
            delete rule.className;
            delete rule.innerText;
        }
    });
    delete ruleSet.isNew;
    return ruleSet;
}