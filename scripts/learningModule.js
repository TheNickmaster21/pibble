function setBeforeAndAfterOnTokens(tokens) {
    if (tokens.length > 2) {
        tokens[0].after = tokens[2];
        for (let i = 1; i < tokens.length - 1; i++) {
            tokens[i].before = tokens[i - 1];
            tokens[i].after = tokens[i + 1];
        }
        tokens[tokens.length - 1].before = tokens[tokens.length - 2];
    }
}

function convertNewRuleSet(ruleSet, tokens) {
    setBeforeAndAfterOnTokens(tokens);

    _.each(ruleSet.rules, function (rule) {
        let token = tokens[rule.index];
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

            delete rule.index;
            delete rule.className;
            delete rule.innerText;
        }
    });
    delete ruleSet.isNew;
    return ruleSet;
}