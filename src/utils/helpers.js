// src/utils/helpers.js
const vscode = require('vscode');

class ThemeUtils {
    static validateColor(color) {
        return /^#[0-9A-Fa-f]{6}$/.test(color) ? null : 'Invalid hex color format (use #RRGGBB)';
    }

    static async showQuickPickWithProgress(items, options, progressText) {
        let result = null;
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: progressText,
            cancellable: false
        }, async () => {
            result = await vscode.window.showQuickPick(items, options);
        });
        return result;
    }

    static getSystemFonts() {
        const platform = process.platform;
        switch (platform) {
            case 'win32':
                return ['Consolas', 'Courier New', 'Arial'];
            case 'darwin':
                return ['Menlo', 'Monaco', 'SF Mono'];
            default:
                return ['Ubuntu Mono', 'DejaVu Sans Mono', 'Liberation Mono'];
        }
    }

    static async checkFontAvailability(fontName) {
        const document = await vscode.workspace.openTextDocument({
            content: 'Font Test',
            language: 'plaintext'
        });
        const editor = await vscode.window.showTextDocument(document);
        
        try {
            await vscode.workspace.getConfiguration('editor').update(
                'fontFamily',
                fontName,
                vscode.ConfigurationTarget.Global
            );
            // Wait for font to load
            await new Promise(resolve => setTimeout(resolve, 100));
            return true;
        } catch {
            return false;
        } finally {
            await editor.hide();
            await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        }
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static async openSystemFontDirectory() {
        const platform = process.platform;
        let fontPath;
        
        switch (platform) {
            case 'win32':
                fontPath = 'C:\\Windows\\Fonts';
                break;
            case 'darwin':
                fontPath = '/Library/Fonts';
                break;
            default:
                fontPath = '/usr/share/fonts';
                break;
        }

        await vscode.env.openExternal(vscode.Uri.file(fontPath));
    }

    static generateColorPalette(baseColor) {
        // Convert hex to RGB
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);

        // Generate variations
        return {
            lighter: this.rgbToHex(
                Math.min(255, r + 40),
                Math.min(255, g + 40),
                Math.min(255, b + 40)
            ),
            darker: this.rgbToHex(
                Math.max(0, r - 40),
                Math.max(0, g - 40),
                Math.max(0, b - 40)
            ),
            alpha50: `${baseColor}80`,
            alpha25: `${baseColor}40`
        };
    }

    static rgbToHex(r, g, b) {
        return '#' + [r, g, b]
            .map(x => Math.round(x).toString(16).padStart(2, '0'))
            .join('');
    }
}

class ConfigManager {
    static async updateConfiguration(section, value, target = vscode.ConfigurationTarget.Global) {
        try {
            const config = vscode.workspace.getConfiguration('jinThemes');
            await config.update(section, value, target);
            return true;
        } catch (error) {
            console.error(`Failed to update configuration: ${error.message}`);
            return false;
        }
    }

    static async backupSettings() {
        const config = vscode.workspace.getConfiguration('jinThemes');
        const backup = {
            timestamp: new Date().toISOString(),
            settings: {
                bracketColors: config.get('bracketColors'),
                tokenColors: config.get('tokenColors'),
                fontSettings: config.get('fontSettings')
            }
        };

        try {
            await this.updateConfiguration('settingsBackup', backup);
            return true;
        } catch {
            return false;
        }
    }

    static async restoreSettings() {
        const config = vscode.workspace.getConfiguration('jinThemes');
        const backup = config.get('settingsBackup');

        if (!backup) {
            return false;
        }

        try {
            for (const [key, value] of Object.entries(backup.settings)) {
                await this.updateConfiguration(key, value);
            }
            return true;
        } catch {
            return false;
        }
    }
}

class NotificationManager {
    static async showConfigurationSuccess(feature, action = 'updated') {
        const response = await vscode.window.showInformationMessage(
            `${feature} settings have been ${action} successfully.`,
            'Configure More',
            'Done'
        );

        if (response === 'Configure More') {
            await vscode.commands.executeCommand('jinThemes.configureEnhancements');
        }
    }

    static async showError(message, error) {
        const detail = error?.message || 'Unknown error';
        const response = await vscode.window.showErrorMessage(
            `${message}: ${detail}`,
            'Try Again',
            'Get Help'
        );

        if (response === 'Get Help') {
            await vscode.env.openExternal(
                vscode.Uri.parse('https://github.com/JijinJayakumar/jin-themes-enhancer/issues')
            );
        }
        return response === 'Try Again';
    }

    static showProgress(title, task) {
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title,
            cancellable: false
        }, task);
    }
}

module.exports = {
    ThemeUtils,
    ConfigManager,
    NotificationManager
};