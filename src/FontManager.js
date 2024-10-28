// src/FontManager.js
const vscode = require('vscode');
const { THEMES, FONTS, DEFAULT_SETTINGS } = require('./constants');

class FontManager {
    constructor(context) {
        this.context = context;
        this.disposables = [];
        this.fontWeightOptions = [
            { label: 'Light', value: '300' },
            { label: 'Regular', value: '400' },
            { label: 'Medium', value: '500' },
            { label: 'Semi-Bold', value: '600' },
            { label: 'Bold', value: '700' }
        ];
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
        const options = [
            { label: 'Programming Fonts', fonts: FONTS.PROGRAMMING },
            { label: 'Cursive Fonts', fonts: FONTS.CURSIVE }
        ];

        const category = await vscode.window.showQuickPick(
            options.map(opt => opt.label),
            { placeHolder: 'Select font category' }
        );

        if (category) {
            const selectedCategory = options.find(opt => opt.label === category);
            const font = await vscode.window.showQuickPick(
                selectedCategory.fonts,
                { placeHolder: 'Select font family' }
            );

            if (font) {
                const config = vscode.workspace.getConfiguration('jinThemes');
                const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
                
                fontSettings[currentTheme] = {
                    ...fontSettings[currentTheme],
                    fontFamily: font
                };

                await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
                await this.applyFontSettings(currentTheme);
                vscode.window.showInformationMessage(`Font family updated to ${font}`);
            }
        }
    }

    async adjustFontSize() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentSize = vscode.workspace.getConfiguration('editor').get('fontSize');
        
        const size = await vscode.window.showQuickPick(
            ['12', '13', '14', '15', '16', '18', '20', '22', '24'],
            {
                placeHolder: 'Select font size',
                default: currentSize.toString()
            }
        );

        if (size) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                fontSize: parseInt(size)
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            vscode.window.showInformationMessage(`Font size updated to ${size}px`);
        }
    }

    async adjustLineHeight() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentHeight = vscode.workspace.getConfiguration('editor').get('lineHeight');
        
        const height = await vscode.window.showQuickPick(
            ['1', '1.2', '1.4', '1.5', '1.6', '1.8', '2'],
            {
                placeHolder: 'Select line height',
                default: currentHeight.toString()
            }
        );

        if (height) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                lineHeight: parseFloat(height)
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            vscode.window.showInformationMessage(`Line height updated to ${height}`);
        }
    }

    async toggleLigatures() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentLigatures = vscode.workspace.getConfiguration('editor').get('fontLigatures');
        
        const choice = await vscode.window.showQuickPick(
            ['Enable', 'Disable'],
            {
                placeHolder: 'Font ligatures',
                default: currentLigatures ? 'Enable' : 'Disable'
            }
        );

        if (choice) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                ligatures: choice === 'Enable'
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            vscode.window.showInformationMessage(`Font ligatures ${choice.toLowerCase()}d`);
        }
    }

    async adjustLetterSpacing() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentSpacing = vscode.workspace.getConfiguration('editor').get('letterSpacing');
        
        const spacing = await vscode.window.showQuickPick(
            ['0', '0.5', '1', '1.5', '2'],
            {
                placeHolder: 'Select letter spacing',
                default: currentSpacing.toString()
            }
        );

        if (spacing) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                letterSpacing: parseFloat(spacing)
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            vscode.window.showInformationMessage(`Letter spacing updated to ${spacing}`);
        }
    }

    async configureFontWeight() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentWeight = vscode.workspace.getConfiguration('editor').get('fontWeight');
        
        const selected = await vscode.window.showQuickPick(
            this.fontWeightOptions.map(opt => opt.label),
            {
                placeHolder: 'Select font weight',
                default: this.fontWeightOptions.find(opt => opt.value === currentWeight)?.label
            }
        );

        if (selected) {
            const weight = this.fontWeightOptions.find(opt => opt.label === selected).value;
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                fontWeight: weight
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            vscode.window.showInformationMessage(`Font weight updated to ${selected}`);
        }
    }

    async resetSettings() {
        await vscode.workspace.getConfiguration('jinThemes').update(
            'fontSettings',
            DEFAULT_SETTINGS.fonts,
            vscode.ConfigurationTarget.Global
        );
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        await this.applyFontSettings(currentTheme);
        vscode.window.showInformationMessage('Font settings have been reset to defaults');
    }

    dispose() {
        this.disposables.forEach(d => d.dispose());
    }
}

module.exports = FontManager;