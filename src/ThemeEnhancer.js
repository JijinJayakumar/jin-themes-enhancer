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
        this.initializeManagers();
        
        // Watch for theme changes
        this.watchThemeChanges();

        // Register status bar items
        this.createStatusBarItems();
    }

    initializeManagers() {
        try {
            this.bracketManager.initialize();
            this.semanticTokenManager.initialize();
            this.fontManager.initialize();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to initialize theme enhancer: ${error.message}`);
        }
    }

    watchThemeChanges() {
        this.disposables.push(
            vscode.workspace.onDidChangeConfiguration(async (event) => {
                if (event.affectsConfiguration('workbench.colorTheme')) {
                    const newTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
                    await this.onThemeChange(newTheme);
                }
            })
        );
    }

    createStatusBarItems() {
        const themeStatus = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        themeStatus.command = 'jinThemes.configureEnhancements';
        themeStatus.text = "$(paintcan) Jin Theme";
        themeStatus.tooltip = "Configure Jin Theme Enhancements";
        themeStatus.show();
        this.disposables.push(themeStatus);
    }

    async onThemeChange(newTheme) {
        try {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Applying theme enhancements...",
                cancellable: false
            }, async (progress) => {
                progress.report({ increment: 0 });

                // Apply bracket colors
                progress.report({ increment: 33, message: "Configuring brackets..." });
                await this.bracketManager.applyBracketColors(newTheme);

                // Apply token colors
                progress.report({ increment: 33, message: "Configuring semantic tokens..." });
                await this.semanticTokenManager.applyTokenColors(newTheme);

                // Apply font settings
                progress.report({ increment: 34, message: "Configuring fonts..." });
                await this.fontManager.applyFontSettings(newTheme);
            });

            vscode.window.showInformationMessage(
                `Theme enhancements applied for ${newTheme}`,
                'Configure', 'Restore Defaults'
            ).then(selection => {
                if (selection === 'Configure') {
                    this.showConfigurationMenu();
                } else if (selection === 'Restore Defaults') {
                    this.resetAllSettings();
                }
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply theme settings: ${error.message}`);
        }
    }

    async showConfigurationMenu() {
        const options = [
            {
                label: "Configure Bracket Colors",
                detail: "Customize bracket pair colorization",
                iconPath: new vscode.ThemeIcon("bracket")
            },
            {
                label: "Configure Semantic Tokens",
                detail: "Customize syntax highlighting",
                iconPath: new vscode.ThemeIcon("symbol-color")
            },
            {
                label: "Configure Font Styles",
                detail: "Customize fonts and typography",
                iconPath: new vscode.ThemeIcon("text-size")
            },
            {
                label: "Reset All Settings",
                detail: "Restore default enhancement settings",
                iconPath: new vscode.ThemeIcon("clear-all")
            }
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select enhancement to configure',
            matchOnDetail: true
        });

        if (selected) {
            switch (selected.label) {
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
            { modal: true },
            'Reset', 'Cancel'
        );

        if (confirmation === 'Reset') {
            try {
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Resetting enhancements...",
                    cancellable: false
                }, async (progress) => {
                    progress.report({ increment: 0 });

                    // Reset each manager
                    progress.report({ increment: 33, message: "Resetting brackets..." });
                    await this.bracketManager.resetSettings();

                    progress.report({ increment: 33, message: "Resetting tokens..." });
                    await this.semanticTokenManager.resetSettings();

                    progress.report({ increment: 34, message: "Resetting fonts..." });
                    await this.fontManager.resetSettings();
                });

                vscode.window.showInformationMessage('All enhancement settings have been reset to defaults.');
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to reset settings: ${error.message}`);
            }
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