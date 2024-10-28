// src/BracketManager.js
const vscode = require('vscode');
const { THEMES, DEFAULT_SETTINGS } = require('./constants');

class BracketManager {
    constructor(context) {
        this.context = context;
        this.disposables = [];
    }

    async initialize() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        await this.applyBracketColors(currentTheme);
    }

    async applyBracketColors(themeName) {
        try {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const bracketColors = config.get('bracketColors') || DEFAULT_SETTINGS.brackets;
            const themeColors = bracketColors[themeName];

            if (themeColors) {
                const editorConfig = vscode.workspace.getConfiguration('editor');
                await editorConfig.update('bracketPairColorization.enabled', true, true);
                await editorConfig.update('bracketPairColorization.independentColorPoolPerBracketType', true, true);

                const colorCustomizations = {
                    ...vscode.workspace.getConfiguration('workbench').get('colorCustomizations', {}),
                    [`[${themeName}]`]: {
                        ...themeColors
                    }
                };

                await vscode.workspace.getConfiguration('workbench').update(
                    'colorCustomizations',
                    colorCustomizations,
                    vscode.ConfigurationTarget.Global
                );
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply bracket colors: ${error.message}`);
        }
    }

    async showBracketConfiguration() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const config = vscode.workspace.getConfiguration('jinThemes');
        const bracketColors = config.get('bracketColors') || DEFAULT_SETTINGS.brackets;
        const themeColors = bracketColors[currentTheme];

        if (!themeColors) {
            vscode.window.showErrorMessage('No bracket configuration available for current theme.');
            return;
        }

        const brackets = Object.keys(themeColors);
        const selected = await vscode.window.showQuickPick(
            brackets.map(bracket => ({
                label: bracket,
                description: themeColors[bracket]
            })),
            { placeHolder: 'Select bracket pair to customize' }
        );

        if (selected) {
            const color = await vscode.window.showInputBox({
                placeHolder: 'Enter color (hex format)',
                value: themeColors[selected.label],
                validateInput: text => {
                    return /^#[0-9A-Fa-f]{6}$/.test(text) ? null : 'Please enter a valid hex color';
                }
            });

            if (color) {
                bracketColors[currentTheme] = {
                    ...themeColors,
                    [selected.label]: color
                };

                await config.update('bracketColors', bracketColors, vscode.ConfigurationTarget.Global);
                await this.applyBracketColors(currentTheme);
            }
        }
    }

    async resetSettings() {
        await vscode.workspace.getConfiguration('jinThemes').update(
            'bracketColors',
            DEFAULT_SETTINGS.brackets,
            vscode.ConfigurationTarget.Global
        );
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        await this.applyBracketColors(currentTheme);
    }

    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
}
module.exports = BracketManager;
