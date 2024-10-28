const vscode = require('vscode');
const ThemeEnhancer = require('./src/ThemeEnhancer');

let themeEnhancer;

function activate(context) {
    themeEnhancer = new ThemeEnhancer(context);
    themeEnhancer.activate();

    // Register commands
    registerCommands(context);
}

function registerCommands(context) {
    // Main configuration command
    context.subscriptions.push(
        vscode.commands.registerCommand('jinThemes.configureEnhancements', () => {
            themeEnhancer.showConfigurationMenu();
        })
    );

    // Individual feature commands
    context.subscriptions.push(
        vscode.commands.registerCommand('jinThemes.configureBrackets', () => {
            themeEnhancer.bracketManager.showBracketConfiguration();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('jinThemes.configureTokens', () => {
            themeEnhancer.semanticTokenManager.showTokenConfiguration();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('jinThemes.configureFonts', () => {
            themeEnhancer.fontManager.showFontConfiguration();
        })
    );
}

function deactivate() {
    if (themeEnhancer) {
        themeEnhancer.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};