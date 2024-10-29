// src/SemanticTokenManager.js
const vscode = require('vscode');
const { THEMES, DEFAULT_SETTINGS } = require('./constants');

class SemanticTokenManager {
    constructor(context) {
        this.context = context;
        this.disposables = [];
        
        this.tokenTypes = [
            { label: 'class', detail: 'Class declarations and references' },
            { label: 'interface', detail: 'Interface declarations and references' },
            { label: 'enum', detail: 'Enum declarations' },
            { label: 'function', detail: 'Function declarations and calls' },
            { label: 'variable', detail: 'Variable declarations and references' },
            { label: 'keyword', detail: 'Language keywords' },
            { label: 'string', detail: 'String literals' },
            { label: 'number', detail: 'Numeric literals' },
            { label: 'regexp', detail: 'Regular expressions' },
            { label: 'operator', detail: 'Operators' },
            { label: 'decorator', detail: 'Decorators/annotations' },
            { label: 'parameter', detail: 'Function parameters' },
            { label: 'type', detail: 'Type annotations' },
            { label: 'property', detail: 'Object properties' }
        ];

        this.styleOptions = [
            { label: 'Regular', value: '' },
            { label: 'Bold', value: 'bold' },
            { label: 'Italic', value: 'italic' },
            { label: 'Bold Italic', value: 'bold italic' }
        ];
    }

    async initialize() {
        try {
            const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
            await this.applyTokenColors(currentTheme);
            await this.enableSemanticHighlighting();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to initialize semantic tokens: ${error.message}`);
        }
    }

    async enableSemanticHighlighting() {
        try {
            await vscode.workspace.getConfiguration('editor').update(
                'semanticHighlighting.enabled',
                true,
                vscode.ConfigurationTarget.Global
            );
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to enable semantic highlighting: ${error.message}`);
        }
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

        const selected = await vscode.window.showQuickPick(
            this.tokenTypes.map(token => ({
                label: token.label,
                detail: token.detail,
                description: `Current color: ${themeTokens[token.label]?.foreground || 'Not set'}`
            })),
            {
                placeHolder: 'Select token type to customize',
                matchOnDetail: true
            }
        );

        if (selected) {
            const action = await this.showTokenActionMenu(selected.label, themeTokens[selected.label]);
            if (action) {
                await this.handleTokenAction(action, selected.label, currentTheme, themeTokens);
            }
        }
    }

    async showTokenActionMenu(tokenType, currentSettings) {
        const actions = [
            {
                label: 'Change Color',
                detail: `Current: ${currentSettings?.foreground || 'Not set'}`,
                action: 'color'
            },
            {
                label: 'Change Style',
                detail: `Current: ${currentSettings?.fontStyle || 'Regular'}`,
                action: 'style'
            },
            {
                label: 'Preview Token',
                detail: 'Show how this token looks in code',
                action: 'preview'
            }
        ];

        const selected = await vscode.window.showQuickPick(actions, {
            placeHolder: `Customize ${tokenType}`,
            matchOnDetail: true
        });

        return selected?.action;
    }

    async handleTokenAction(action, tokenType, themeName, currentTokens) {
        switch (action) {
            case 'color':
                await this.changeTokenColor(tokenType, themeName, currentTokens);
                break;
            case 'style':
                await this.changeTokenStyle(tokenType, themeName, currentTokens);
                break;
            case 'preview':
                await this.showTokenPreview(tokenType, currentTokens[tokenType]);
                break;
        }
    }

    async changeTokenColor(tokenType, themeName, currentTokens) {
        const color = await vscode.window.showInputBox({
            placeHolder: 'Enter color (hex format, e.g., #FF0000)',
            value: currentTokens[tokenType]?.foreground || '#FFFFFF',
            validateInput: this.validateColor
        });

        if (color) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const tokenColors = config.get('tokenColors') || DEFAULT_SETTINGS.tokens;
            
            tokenColors[themeName] = {
                ...currentTokens,
                [tokenType]: {
                    ...currentTokens[tokenType],
                    foreground: color
                }
            };

            await config.update('tokenColors', tokenColors, vscode.ConfigurationTarget.Global);
            await this.applyTokenColors(themeName);
        }
    }

    async changeTokenStyle(tokenType, themeName, currentTokens) {
        const selected = await vscode.window.showQuickPick(
            this.styleOptions,
            {
                placeHolder: 'Select font style',
                default: currentTokens[tokenType]?.fontStyle || 'Regular'
            }
        );

        if (selected) {
            const config = vscode.workspace.getConfiguration('jinThemes');
            const tokenColors = config.get('tokenColors') || DEFAULT_SETTINGS.tokens;
            
            tokenColors[themeName] = {
                ...currentTokens,
                [tokenType]: {
                    ...currentTokens[tokenType],
                    fontStyle: selected?.value || 'Regular'
                }
            };

            await config.update('tokenColors', tokenColors, vscode.ConfigurationTarget.Global);
            await this.applyTokenColors(themeName);
        }
    }

    async showTokenPreview(tokenType, tokenSettings) {
        const panel = vscode.window.createWebviewPanel(
            'tokenPreview',
            `Token Preview: ${tokenType}`,
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = this.getTokenPreviewHtml(tokenType, tokenSettings);
    }

    getTokenPreviewHtml(tokenType, settings) {
        const sampleCode = this.getSampleCode(tokenType);
        const style = `color: ${settings.foreground}; font-style: ${settings.fontStyle || 'normal'};`;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        padding: 20px;
                        background-color: #1e1e1e;
                        color: #d4d4d4;
                        font-family: 'SF Mono', Monaco, Menlo, Courier, monospace;
                    }
                    .preview-container {
                        background-color: #252526;
                        padding: 20px;
                        border-radius: 4px;
                    }
                    .token-sample {
                        ${style}
                    }
                    .info {
                        margin-top: 20px;
                        color: #888;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="preview-container">
                    <pre><code>${sampleCode.replace(
                        new RegExp(`(${tokenType}|function|class|interface|type)`, 'g'),
                        match => `<span class="token-sample">${match}</span>`
                    )}</code></pre>
                </div>
                <div class="info">
                    <p>Color: ${settings.foreground}</p>
                    <p>Style: ${settings.fontStyle || 'regular'}</p>
                </div>
            </body>
            </html>
        `;
    }

    getSampleCode(tokenType) {
        const samples = {
            class: `class Example {
    constructor() { }
}`,
            interface: `interface IExample {
    property: string;
    method(): void;
}`,
            function: `function example() {
    return true;
}`,
            variable: `const example = "value";
let dynamic = 42;`,
            keyword: `if (condition) {
    return true;
}`,
            string: `const message = "Hello, World!";`,
            number: `const value = 42;
const float = 3.14;`,
            regexp: `const pattern = /^example$/;`,
            operator: `const result = a + b * c;`,
            decorator: `@Component({})
class Example { }`,
            parameter: `function example(param1: string, param2: number) { }`,
            type: `type Example = string | number;`,
            property: `const obj = {
    property: "value"
};`
        };

        return samples[tokenType] || `// No preview available for ${tokenType}`;
    }

    validateColor(input) {
        return /^#[0-9A-Fa-f]{6}$/.test(input) ? null : 'Please enter a valid hex color (e.g., #FF0000)';
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