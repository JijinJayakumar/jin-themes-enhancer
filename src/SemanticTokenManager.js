
// src/SemanticTokenManager.js
const vscode = require('vscode');
const { THEMES, DEFAULT_SETTINGS } = require('./constants');

class SemanticTokenManager {
    constructor(context) {
        this.context = context;
        this.disposables = [];
    }

    async initialize() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        await this.applyTokenColors(currentTheme);
    }

    async applyTokenColors(themeName) {
        try {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const tokenColors = config.get('tokenColors') || DEFAULT_SETTINGS.tokens;
            const themeTokens = tokenColors[themeName];

            if (themeTokens) {
                await vscode.workspace.getConfiguration('editor').update(
                    'semanticTokenColorCustomizations',
                    {
                        enabled: true,
                        rules: themeTokens
                    },
                    vscode.ConfigurationTarget.Global
                );
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply token colors: ${error.message}`);
        }
    }

    async showTokenConfiguration() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const config = vscode.workspace.getConfiguration('jinThemes');
        const tokenColors = config.get('tokenColors') || DEFAULT_SETTINGS.tokens;
        const themeTokens = tokenColors[currentTheme];

        if (!themeTokens) {
            vscode.window.showErrorMessage('No token configuration available for current theme.');
            return;
        }

        const tokens = Object.keys(themeTokens);
        const selected = await vscode.window.showQuickPick(
            tokens.map(token => ({
                label: token,
                description: themeTokens[token].foreground
            })),
            { placeHolder: 'Select token type to customize' }
        );

        if (selected) {
            const options = ['Change Color', 'Toggle Bold', 'Toggle Italic'];
            const action = await vscode.window.showQuickPick(options, {
                placeHolder: 'Select what to modify'
            });

            if (action === 'Change Color') {
                const color = await vscode.window.showInputBox({
                    placeHolder: 'Enter color (hex format)',
                    value: themeTokens[selected.label].foreground,
                    validateInput: text => {
                        return /^#[0-9A-Fa-f]{6}$/.test(text) ? null : 'Please enter a valid hex color';
                    }
                });

                if (color) {
                    tokenColors[currentTheme][selected.label] = {
                        ...themeTokens[selected.label],
                        foreground: color
                    };
                }
            } else if (action) {
                const styleProp = action === 'Toggle Bold' ? 'bold' : 'italic';
                tokenColors[currentTheme][selected.label] = {
                    ...themeTokens[selected.label],
                    [styleProp]: !themeTokens[selected.label][styleProp]
                };
            }

            await config.update('tokenColors', tokenColors, vscode.ConfigurationTarget.Global);
            await this.applyTokenColors(currentTheme);
        }
    }

    async resetSettings() {
        await vscode.workspace.getConfiguration('jinThemes').update(
            'tokenColors',
            DEFAULT_SETTINGS.tokens,
            vscode.ConfigurationTarget.Global
        );
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        await this.applyTokenColors(currentTheme);
    }

    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
}

module.exports = SemanticTokenManager;
