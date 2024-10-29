// test/suite/extension.test.js
const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');
const { ThemeUtils, ConfigManager } = require('../../src/utils/helpers');

suite('Jin Themes Enhancer Test Suite', () => {
    let sandbox;

    setup(() => {
        sandbox = sinon.createSandbox();
    });

    teardown(() => {
        sandbox.restore();
    });

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('Jijin.jin-themes-enhancer'));
    });

    test('Should activate', async () => {
        const ext = vscode.extensions.getExtension('Jijin.jin-themes-enhancer');
        await ext.activate();
        assert.ok(true);
    });

    suite('ThemeUtils', () => {
        test('validateColor should validate hex colors', () => {
            assert.strictEqual(ThemeUtils.validateColor('#FF0000'), null);
            assert.strictEqual(typeof ThemeUtils.validateColor('#GG0000'), 'string');
        });

        test('generateColorPalette should generate variations', () => {
            const palette = ThemeUtils.generateColorPalette('#FF0000');
            assert.ok(palette.lighter);
            assert.ok(palette.darker);
            assert.ok(palette.alpha50);
            assert.ok(palette.alpha25);
        });
    });

    suite('ConfigManager', () => {
        test('Should backup settings', async () => {
            const result = await ConfigManager.backupSettings();
            assert.strictEqual(result, true);
        });

        test('Should restore settings', async () => {
            const backup = await ConfigManager.backupSettings();
            const result = await ConfigManager.restoreSettings();
            assert.strictEqual(result, true);
        });
    });

   
});