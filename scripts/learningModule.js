
function convertNewRuleSet(ruleSet, tokens){
    if (tokens.length > 2) {
        tokens[0].after = tokens[2];
        for (let i = 1; i < tokens.length - 1; i++) {
            tokens[i].before = tokens[i - 1];
            tokens[i].after = tokens[i + 1];
        }
        tokens[tokens.length - 1].before = tokens[tokens.length - 2];
    }

    _.each(ruleSet.rules, function(rule){
       let token = tokens[rule.id];
        rule.elements = {
            before: token.before && token.before.elements,
            at: token.elements,
            after: token.after && token.after.elements
        };
    });
    delete ruleSet.new;
    return ruleSet;
}