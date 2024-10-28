// src/FontManager.js
const vscode = require('vscode');
const { THEMES, DEFAULT_SETTINGS } = require('./constants');

class FontManager {
    constructor(context) {
        this.context = context;
        this.disposables = [];
    }

    async initialize() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        await this.applyFontSettings(currentTheme);
    }

    async applyFontSettings(themeName) {
        try {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            const themeFonts = fontSettings[themeName];

            if (themeFonts) {
                const editorConfig = vscode.workspace.getConfiguration('editor');
                await Promise.all([
                    editorConfig.update('fontFamily', themeFonts.fontFamily, true),
                    editorConfig.update('fontSize', themeFonts.fontSize, true),
                    editorConfig.update('lineHeight', themeFonts.lineHeight, true),
                    editorConfig.update('fontWeight', themeFonts.fontWeight, true),
                    editorConfig.update('letterSpacing', themeFonts.letterSpacing, true),
                    editorConfig.update('fontLigatures', themeFonts.ligatures, true)
                ]);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply font settings: ${error.message}`);
        }
    }

    async showFontConfiguration() {
        const options = [
            'Select Font Family',
            'Adjust Font Size',
            'Adjust Line Height',
            'Toggle Ligatures',
            'Adjust Letter Spacing',
            'Configure Font Weight'
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select font setting to configure'
        });

        if (selected) {
            switch (selected) {
                case 'Select Font Family':
                    await this.selectFontFamily();
                    break;
                case 'Adjust Font Size':
                    await this.adjustFontSize();
                    break;
                case 'Adjust Line Height':
                    await this.adjustLineHeight();
                    break;
                case 'Toggle Ligatures':
                    await this.toggleLigatures();
                    break;
                case 'Adjust Letter Spacing':
                    await this.adjustLetterSpacing();
                    break;
                case 'Configure Font Weight':
                    await this.configureFontWeight();
                    break;
            }
        }
    }

    async selectFontFamily() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const fonts = [...FONTS.PROGRAMMING, ...FONTS.CURSIVE];
        
        const selected = await vscode.window.showQuickPick(fonts, {
            placeHolder: 'Select font family'
        });

        if (selected) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                fontFamily: selected
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
        }
    }

    // Implement other font configuration methods...

    async resetSettings() {
        await vscode.workspace.getConfiguration('jinThemes').update(
            'fontSettings',
            DEFAULT_SETTINGS.fonts,
            vscode.ConfigurationTarget.Global
        );
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        await this.applyFontSettings(currentTheme);
    }

    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
}

// module.exports = {
//     // BracketManager,
//     // SemanticTokenManager,
//     FontManager
// };
module.exports = FontManager;
