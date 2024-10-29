// extension.js
const vscode = require('vscode');
const ThemeEnhancer = require('./src/ThemeEnhancer');

let themeEnhancer;

function activate(context) {
    console.log('Activating Jin Themes Enhancer');

    try {
        // Create and activate the theme enhancer
        themeEnhancer = new ThemeEnhancer(context);
        themeEnhancer.activate();

        // Register commands
        registerCommands(context);

        // Show welcome message on first install
        showWelcomeMessage(context);

    } catch (error) {
        console.error('Activation error:', error);
        vscode.window.showErrorMessage(`Failed to activate Jin Themes Enhancer: ${error.message}`);
    }
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

    // Reset commands
    context.subscriptions.push(
        vscode.commands.registerCommand('jinThemes.resetAllSettings', () => {
            themeEnhancer.resetAllSettings();
        })
    );
}

async function showWelcomeMessage(context) {
    // Check if this is first install
    const isFirstInstall = !context.globalState.get('jinThemes.welcomed');
    if (isFirstInstall) {
        const action = await vscode.window.showInformationMessage(
            'Welcome to Jin Themes Enhancer! Would you like to configure your enhancement settings?',
            'Configure Now', 'View Documentation', 'Later'
        );

        if (action === 'Configure Now') {
            vscode.commands.executeCommand('jinThemes.configureEnhancements');
        } else if (action === 'View Documentation') {
            vscode.env.openExternal(
                vscode.Uri.parse('https://github.com/JijinJayakumar/jin-themes-enhancer#readme')
            );
        }

        // Mark as welcomed
        await context.globalState.update('jinThemes.welcomed', true);
    }
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