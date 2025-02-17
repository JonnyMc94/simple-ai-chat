let originalStyles = {};  // Object to store original styles

export function disableCSSRulesBySelector(selector) {
  for (let sheet of document.styleSheets) {
      try {
          var rules = sheet.cssRules || sheet.rules;
          for (let i = 0; i < rules.length; i++) {
              let rule = rules[i];
              if (rule.type === CSSRule.STYLE_RULE && rule.selectorText.includes(selector)) {
                  // Store the original CSS text
                  originalStyles[rule.selectorText] = rule.style.cssText;

                  // Disable the rule
                  rule.style.cssText = '';
              }
          }
      } catch (e) {
          console.error('Cannot read the stylesheet rules', e);
      }
  }
}

export function enableCSSRulesBySelector(selector) {
  for (let sheet of document.styleSheets) {
      try {
          var rules = sheet.cssRules || sheet.rules;
          for (let i = 0; i < rules.length; i++) {
              let rule = rules[i];
              if (rule.type === CSSRule.STYLE_RULE && rule.selectorText.includes(selector)) {
                  // Restore the original CSS text if it was stored
                  if (originalStyles[rule.selectorText]) {
                      rule.style.cssText = originalStyles[rule.selectorText];
                  }
              }
          }
      } catch (e) {
          console.error('Cannot read the stylesheet rules', e);
      }
  }
}