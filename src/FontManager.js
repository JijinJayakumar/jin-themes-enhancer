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

        this.lineHeightOptions = [
            { label: 'Compact', value: 1.2 },
            { label: 'Normal', value: 1.4 },
            { label: 'Relaxed', value: 1.5 },
            { label: 'Spacious', value: 1.8 },
            { label: 'Very Spacious', value: 2.0 }
        ];

        this.letterSpacingOptions = [
            { label: 'Tight', value: 0 },
            { label: 'Slight', value: 0.3 },
            { label: 'Normal', value: 0.5 },
            { label: 'Wide', value: 0.8 },
            { label: 'Very Wide', value: 1.0 }
        ];

        this.fontSizeOptions = [
            { label: 'Small', value: 12 },
            { label: 'Medium', value: 14 },
            { label: 'Large', value: 16 },
            { label: 'Extra Large', value: 18 },
            { label: 'Huge', value: 20 }
        ];
    }

    async initialize() {
        try {
            const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
            await this.applyFontSettings(currentTheme);
            this.setupFontStatusBar();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to initialize font settings: ${error.message}`);
        }
    }

    setupFontStatusBar() {
        const fontStatus = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        fontStatus.command = 'jinThemes.configureFonts';
        fontStatus.text = "$(typography) Font";
        fontStatus.tooltip = "Configure Font Settings";
        fontStatus.show();
        this.disposables.push(fontStatus);
    }

    async applyFontSettings(themeName) {
        try {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            const themeFonts = fontSettings[themeName];

            if (themeFonts) {
                const editorConfig = vscode.workspace.getConfiguration('editor');
                await Promise.all([
                    editorConfig.update('fontFamily', this.buildFontString(themeFonts.fontFamily), true),
                    editorConfig.update('fontSize', themeFonts.fontSize, true),
                    editorConfig.update('lineHeight', themeFonts.lineHeight, true),
                    editorConfig.update('fontWeight', themeFonts.fontWeight, true),
                    editorConfig.update('letterSpacing', themeFonts.letterSpacing, true),
                    editorConfig.update('fontLigatures', themeFonts.ligatures, true)
                ]);

                // Update font preview if available
                await this.updateFontPreview(themeFonts);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply font settings: ${error.message}`);
        }
    }

    buildFontString(fontFamily) {
        // Get the font info from our font definitions
        const progFonts = FONTS.PROGRAMMING.families;
        const cursiveFonts = FONTS.CURSIVE.families;
        const fontInfo = [...progFonts, ...cursiveFonts].find(f => f.name === fontFamily);

        if (fontInfo) {
            return `"${fontInfo.name}", ${fontInfo.fallback}`;
        }
        return `${fontFamily}, ${FONTS.PROGRAMMING.fallback}`;
    }

    async showFontConfiguration() {
        const options = [
            {
                label: "Select Font Family",
                description: "Choose from available programming fonts",
                detail: "Configure the main font used in the editor",
                iconPath: new vscode.ThemeIcon("typography")
            },
            {
                label: "Adjust Font Size",
                description: "Change the size of the font",
                detail: "Make text larger or smaller",
                iconPath: new vscode.ThemeIcon("text-size")
            },
            {
                label: "Configure Line Height",
                description: "Adjust spacing between lines",
                detail: "Change vertical spacing of text",
                iconPath: new vscode.ThemeIcon("line-vertical")
            },
            {
                label: "Adjust Letter Spacing",
                description: "Change spacing between characters",
                detail: "Fine-tune character spacing",
                iconPath: new vscode.ThemeIcon("whitespace")
            },
            {
                label: "Configure Font Weight",
                description: "Change the thickness of the font",
                detail: "Adjust font boldness",
                iconPath: new vscode.ThemeIcon("symbol-constant")
            },
            {
                label: "Toggle Ligatures",
                description: "Enable/disable font ligatures",
                detail: "Special character combinations",
                iconPath: new vscode.ThemeIcon("symbol-operator")
            },
            {
                label: "Preview Fonts",
                description: "See how different fonts look",
                detail: "Visual comparison of fonts",
                iconPath: new vscode.ThemeIcon("preview")
            }
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select font setting to configure',
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selected) {
            switch (selected.label) {
                case "Select Font Family":
                    await this.selectFontFamily();
                    break;
                case "Adjust Font Size":
                    await this.adjustFontSize();
                    break;
                case "Configure Line Height":
                    await this.adjustLineHeight();
                    break;
                case "Adjust Letter Spacing":
                    await this.adjustLetterSpacing();
                    break;
                case "Configure Font Weight":
                    await this.configureFontWeight();
                    break;
                case "Toggle Ligatures":
                    await this.toggleLigatures();
                    break;
                case "Preview Fonts":
                    await this.showFontPreview();
                    break;
            }
        }
    }


async selectFontFamily() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        
        // First choose font category
        const category = await vscode.window.showQuickPick(
            [
                {
                    label: "Programming Fonts",
                    description: "Monospaced fonts optimized for coding",
                    detail: "Includes Fira Code, Hack, JetBrains Mono, etc."
                },
                {
                    label: "Cursive Fonts",
                    description: "Fonts with cursive italics",
                    detail: "Includes Victor Mono, Operator Mono, etc."
                }
            ],
            { placeHolder: 'Select font category' }
        );

        if (!category) return;

        // Get fonts for selected category
        const fonts = category.label === "Programming Fonts" ? 
            FONTS.PROGRAMMING.families : 
            FONTS.CURSIVE.families;

        // Create QuickPick items with details
        const fontItems = fonts.map(font => ({
            label: font.name,
            description: font.isPaid ? '$(tag) Premium Font' : '$(check) Free',
            detail: font.description,
            font: font
        }));

        const selected = await vscode.window.showQuickPick(fontItems, {
            placeHolder: 'Select font family',
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selected) {
            const font = selected.font;

            // If it's a paid font, show purchase info
            if (font.isPaid) {
                const action = await vscode.window.showInformationMessage(
                    `${font.name} is a premium font. Would you like to learn more?`,
                    'Visit Website', 'Use Fallback Font', 'Cancel'
                );

                if (action === 'Visit Website') {
                    vscode.env.openExternal(vscode.Uri.parse(font.purchaseUrl));
                    return;
                } else if (action === 'Cancel') {
                    return;
                }
            }

            // Apply font with fallback
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                fontFamily: font.name
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);

            // Show font installation guidance if needed
            if (!font.isPaid) {
                const action = await vscode.window.showInformationMessage(
                    `Font applied! Don't have ${font.name} installed?`,
                    'Install Font', 'Learn More'
                );

                if (action) {
                    vscode.env.openExternal(vscode.Uri.parse(font.downloadUrl));
                }
            }
        }
    }

    async adjustFontSize() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentSize = vscode.workspace.getConfiguration('editor').get('fontSize');
        
        const selected = await vscode.window.showQuickPick(
            this.fontSizeOptions.map(option => ({
                label: option.label,
                description: `${option.value}px`,
                value: option.value,
                picked: option.value === currentSize
            })),
            {
                placeHolder: 'Select font size',
            }
        );

        if (selected) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                fontSize: selected.value
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            await this.updateFontPreview(fontSettings[currentTheme]);
        }
    }

    async adjustLineHeight() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentHeight = vscode.workspace.getConfiguration('editor').get('lineHeight');
        
        const selected = await vscode.window.showQuickPick(
            this.lineHeightOptions.map(option => ({
                label: option.label,
                description: `${option.value}`,
                value: option.value,
                picked: option.value === currentHeight
            })),
            {
                placeHolder: 'Select line height',
            }
        );

        if (selected) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                lineHeight: selected.value
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            await this.updateFontPreview(fontSettings[currentTheme]);
        }
    }

    async adjustLetterSpacing() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentSpacing = vscode.workspace.getConfiguration('editor').get('letterSpacing');
        
        const selected = await vscode.window.showQuickPick(
            this.letterSpacingOptions.map(option => ({
                label: option.label,
                description: `${option.value}px`,
                value: option.value,
                picked: option.value === currentSpacing
            })),
            {
                placeHolder: 'Select letter spacing',
            }
        );

        if (selected) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                letterSpacing: selected.value
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            await this.updateFontPreview(fontSettings[currentTheme]);
        }
    }

    async configureFontWeight() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentWeight = vscode.workspace.getConfiguration('editor').get('fontWeight');
        
        const selected = await vscode.window.showQuickPick(
            this.fontWeightOptions.map(option => ({
                label: option.label,
                description: option.value,
                value: option.value,
                picked: option.value === currentWeight
            })),
            {
                placeHolder: 'Select font weight',
            }
        );

        if (selected) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                fontWeight: selected.value
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            await this.updateFontPreview(fontSettings[currentTheme]);
        }
    }

    async toggleLigatures() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentLigatures = vscode.workspace.getConfiguration('editor').get('fontLigatures');
        
        const selected = await vscode.window.showQuickPick(
            [
                { label: 'Enable Ligatures', value: true },
                { label: 'Disable Ligatures', value: false }
            ],
            {
                placeHolder: 'Configure font ligatures',
                description: currentLigatures ? 'Currently enabled' : 'Currently disabled'
            }
        );

        if (selected) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
            
            fontSettings[currentTheme] = {
                ...fontSettings[currentTheme],
                ligatures: selected.value
            };

            await config.update('fontSettings', fontSettings, vscode.ConfigurationTarget.Global);
            await this.applyFontSettings(currentTheme);
            await this.updateFontPreview(fontSettings[currentTheme]);
        }
    }

    async updateFontPreview(fontSettings) {
        if (this.fontPreviewPanel) {
            this.fontPreviewPanel.webview.html = this.getFontPreviewHtml(fontSettings);
        }
    }

    getFontPreviewHtml(fontSettings) {
        const sampleCode = `// Sample code with ligatures
function example() {
    return x !== null && y >= 0;
}

// Special characters
->  =>  !=  <=  >=  ==  ===
<!--  -->  </div>  /* */

// Numbers and symbols
$100  @user  #tag  %value
`;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        padding: 20px;
                        background-color: var(--vscode-editor-background);
                        color: var(--vscode-editor-foreground);
                    }
                    .preview {
                        font-family: ${fontSettings.fontFamily};
                        font-size: ${fontSettings.fontSize}px;
                        line-height: ${fontSettings.lineHeight};
                        font-weight: ${fontSettings.fontWeight};
                        letter-spacing: ${fontSettings.letterSpacing}px;
                        font-feature-settings: ${fontSettings.ligatures ? '"liga" 1' : '"liga" 0'};
                    }
                    .info {
                        margin-top: 20px;
                        font-family: var(--vscode-font-family);
                        font-size: 12px;
                        color: var(--vscode-descriptionForeground);
                    }
                </style>
            </head>
            <body>
                <pre class="preview"><code>${sampleCode}</code></pre>
                <div class="info">
                    <p>Font: ${fontSettings.fontFamily}</p>
                    <p>Size: ${fontSettings.fontSize}px</p>
                    <p>Line Height: ${fontSettings.lineHeight}</p>
                    <p>Weight: ${fontSettings.fontWeight}</p>
                    <p>Letter Spacing: ${fontSettings.letterSpacing}px</p>
                    <p>Ligatures: ${fontSettings.ligatures ? 'Enabled' : 'Disabled'}</p>
                </div>
            </body>
            </html>
        `;
    }

    async showFontPreview(forceNew = false) {
        if (this.fontPreviewPanel && !forceNew) {
            this.fontPreviewPanel.reveal();
            return;
        }

        this.fontPreviewPanel = vscode.window.createWebviewPanel(
            'fontPreview',
            'Font Preview',
            vscode.ViewColumn.Two,
            { enableScripts: true }
        );

        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const config = vscode.workspace.getConfiguration('jinThemes');
        const fontSettings = config.get('fontSettings') || DEFAULT_SETTINGS.fonts;
        
        this.fontPreviewPanel.webview.html = this.getFontPreviewHtml(fontSettings[currentTheme]);

        this.fontPreviewPanel.onDidDispose(() => {
            this.fontPreviewPanel = undefined;
        });
    }

    async resetSettings() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        await vscode.workspace.getConfiguration('jinThemes').update(
            'fontSettings',
            DEFAULT_SETTINGS.fonts,
            vscode.ConfigurationTarget.Global
        );
        await this.applyFontSettings(currentTheme);
    }

    dispose() {
        this.disposables.forEach(d => d.dispose());
        if (this.fontPreviewPanel) {
            this.fontPreviewPanel.dispose();
        }
    }
}

module.exports = FontManager;