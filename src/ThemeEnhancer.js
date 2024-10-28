// src/ThemeEnhancer.js
const vscode = require('vscode');
const BracketManager = require('./BracketManager');
const SemanticTokenManager = require('./SemanticTokenManager');
const FontManager = require('./FontManager');



class ThemeEnhancer {
    constructor(context) {
        this.context = context;
        this.bracketManager = new BracketManager(context);
        this.semanticTokenManager = new SemanticTokenManager(context);
        this.fontManager = new FontManager(context);
        this.disposables = [];
    }

    activate() {
        // Initialize all managers
        this.bracketManager.initialize();
        this.semanticTokenManager.initialize();
        this.fontManager.initialize();

        // Watch for theme changes
        this.disposables.push(
            vscode.workspace.onDidChangeConfiguration(async (event) => {
                if (event.affectsConfiguration('workbench.colorTheme')) {
                    const newTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
                    await this.onThemeChange(newTheme);
                }
            })
        );
    }

    async onThemeChange(newTheme) {
        try {
            await Promise.all([
                this.bracketManager.applyBracketColors(newTheme),
                this.semanticTokenManager.applyTokenColors(newTheme),
                this.fontManager.applyFontSettings(newTheme)
            ]);
        } catch (error) {
            vscode.window.showErrorMessage(`Error applying theme settings: ${error.message}`);
        }
    }

    async showConfigurationMenu() {
        const options = [
            'Configure Bracket Colors',
            'Configure Semantic Tokens',
            'Configure Font Styles',
            'Reset All Settings'
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select enhancement to configure'
        });

        if (selected) {
            switch (selected) {
                case 'Configure Bracket Colors':
                    await this.bracketManager.showBracketConfiguration();
                    break;
                case 'Configure Semantic Tokens':
                    await this.semanticTokenManager.showTokenConfiguration();
                    break;
                case 'Configure Font Styles':
                    await this.fontManager.showFontConfiguration();
                    break;
                case 'Reset All Settings':
                    await this.resetAllSettings();
                    break;
            }
        }
    }

    async resetAllSettings() {
        const confirmation = await vscode.window.showWarningMessage(
            'Are you sure you want to reset all enhancement settings?',
            'Yes', 'No'
        );

        if (confirmation === 'Yes') {
            await Promise.all([
                this.bracketManager.resetSettings(),
                this.semanticTokenManager.resetSettings(),
                this.fontManager.resetSettings()
            ]);
            vscode.window.showInformationMessage('All enhancement settings have been reset.');
        }
    }

    dispose() {
        this.disposables.forEach(d => d.dispose());
        this.bracketManager.dispose();
        this.semanticTokenManager.dispose();
        this.fontManager.dispose();
    }
}

module.exports = ThemeEnhancer;