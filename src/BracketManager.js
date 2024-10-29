// src/BracketManager.js
const vscode = require('vscode');
const { THEMES, DEFAULT_SETTINGS } = require('./constants');

class BracketManager {
    constructor(context) {
        this.context = context;
        this.disposables = [];
        this.bracketTypes = [
            { label: '()', detail: 'Parentheses', description: 'Round brackets' },
            { label: '[]', detail: 'Brackets', description: 'Square brackets' },
            { label: '{}', detail: 'Braces', description: 'Curly brackets' },
            { label: '<>', detail: 'Angles', description: 'Angle brackets' }
        ];
    }

    async initialize() {
        try {
            const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
            await this.applyBracketColors(currentTheme);
            await this.enableBracketPairColorization();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to initialize bracket colors: ${error.message}`);
        }
    }

    async enableBracketPairColorization() {
        try {
            const editorConfig = vscode.workspace.getConfiguration('editor');
            await editorConfig.update('bracketPairColorization.enabled', true, true);
            await editorConfig.update('bracketPairColorization.independentColorPoolPerBracketType', true, true);
            await editorConfig.update('guides.bracketPairs', 'active', true);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to enable bracket colorization: ${error.message}`);
        }
    }

    async applyBracketColors(themeName) {
        try {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const bracketColors = config.get('bracketColors') || DEFAULT_SETTINGS.brackets;
            const themeColors = bracketColors[themeName];

            if (themeColors) {
                const colorCustomizations = {
                    ...vscode.workspace.getConfiguration('workbench').get('colorCustomizations', {}),
                    [`[${themeName}]`]: {
                        ...themeColors,
                        "editorBracketHighlight.foreground1": themeColors['()'],
                        "editorBracketHighlight.foreground2": themeColors['[]'],
                        "editorBracketHighlight.foreground3": themeColors['{}'],
                        "editorBracketHighlight.foreground4": themeColors['<>'],
                        "editorBracketHighlight.unexpectedBracket.foreground": "#ff0000"
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

        const selected = await vscode.window.showQuickPick(
            this.bracketTypes.map(bracket => ({
                label: bracket.label,
                detail: bracket.detail,
                description: `${bracket.description} - Current color: ${themeColors[bracket.label]}`
            })),
            {
                placeHolder: 'Select bracket pair to customize',
                matchOnDetail: true,
                matchOnDescription: true
            }
        );

        if (selected) {
            const color = await vscode.window.showInputBox({
                placeHolder: 'Enter color (hex format, e.g., #FF0000)',
                value: themeColors[selected.label],
                validateInput: this.validateColor
            });

            if (color) {
                bracketColors[currentTheme] = {
                    ...themeColors,
                    [selected.label]: color
                };

                await config.update('bracketColors', bracketColors, vscode.ConfigurationTarget.Global);
                await this.applyBracketColors(currentTheme);
                
                vscode.window.showInformationMessage(
                    `Updated ${selected.detail} color to ${color}`,
                    'Configure More', 'Preview'
                ).then(selection => {
                    if (selection === 'Configure More') {
                        this.showBracketConfiguration();
                    } else if (selection === 'Preview') {
                        this.showBracketPreview(currentTheme);
                    }
                });
            }
        }
    }

    validateColor(input) {
        return /^#[0-9A-Fa-f]{6}$/.test(input) ? null : 'Please enter a valid hex color (e.g., #FF0000)';
    }

    async showBracketPreview(themeName) {
        const panel = vscode.window.createWebviewPanel(
            'bracketPreview',
            'Bracket Color Preview',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        const config = vscode.workspace.getConfiguration('jinThemes');
        const bracketColors = config.get('bracketColors') || DEFAULT_SETTINGS.brackets;
        const themeColors = bracketColors[themeName];

        panel.webview.html = this.getBracketPreviewHtml(themeColors);
    }

    getBracketPreviewHtml(colors) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        padding: 20px;
                        font-family: 'SF Mono', Monaco, Menlo, Courier, monospace;
                        line-height: 1.5;
                    }
                    .preview-container {
                        background: #1e1e1e;
                        padding: 20px;
                        border-radius: 4px;
                    }
                    .bracket-line {
                        margin: 10px 0;
                        font-size: 16px;
                    }
                    .color-info {
                        color: #888;
                        font-size: 12px;
                        margin-left: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="preview-container">
                    ${Object.entries(colors).map(([bracket, color]) => `
                        <div class="bracket-line">
                            <span style="color: ${color}">${bracket}</span>
                            <span class="color-info">${color}</span>
                        </div>
                    `).join('')}
                    <div class="bracket-line">
                        <span style="color: ${colors['()']}">((</span>
                        <span style="color: ${colors['[]']}">[</span>
                        <span style="color: ${colors['{}']}">{</span>
                        <span style="color: ${colors['<>']}"><</span>
                        code
                        <span style="color: ${colors['<>']}">></span>
                        <span style="color: ${colors['{}']}>">}</span>
                        <span style="color: ${colors['[]']}">]</span>
                        <span style="color: ${colors['()']}">))</span>
                    </div>
                </div>
            </body>
            </html>
        `;
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