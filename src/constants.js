// src/constants.js
const THEMES = {
    J_CHARCOAL: 'J charcoal',
    J_DARK_MATERIAL: 'J Dark Material v2',
    J_CHARCOAL_LIGHT: 'J Charcoal Light',
    J_FUNKY_MINIMAL_DARK: 'J Funky Minimal Dark'
};

const FONTS = {
    PROGRAMMING: {
        families: [
            {
                name: 'Fira Code',
                downloadUrl: 'https://github.com/tonsky/FiraCode/releases',
                fallback: 'Consolas, monospace',
                description: 'Popular coding font with programming ligatures',
                isPaid: false
            },
            {
                name: 'Hack',
                downloadUrl: 'https://sourcefoundry.org/hack/',
                fallback: 'Consolas, monospace',
                description: 'A typeface designed for source code',
                isPaid: false
            },
            {
                name: 'JetBrains Mono',
                downloadUrl: 'https://www.jetbrains.com/lp/mono/',
                fallback: 'Consolas, monospace',
                description: 'A font by JetBrains for developers',
                isPaid: false
            },
            {
                name: 'Source Code Pro',
                downloadUrl: 'https://github.com/adobe-fonts/source-code-pro',
                fallback: 'Consolas, monospace',
                description: 'Adobe's monospaced font family',
                isPaid: false
            }
        ],
        fallback: 'Consolas, "Courier New", monospace'
    },
    CURSIVE: {
        families: [
            {
                name: 'Victor Mono',
                downloadUrl: 'https://rubjo.github.io/victor-mono/',
                fallback: 'Consolas, monospace',
                description: 'Free font with cursive italics',
                isPaid: false
            },
            {
                name: 'Operator Mono',
                purchaseUrl: 'https://www.typography.com/fonts/operator/styles',
                fallback: 'Monaco, monospace',
                description: 'Premium coding font with beautiful italics',
                isPaid: true
            },
            {
                name: 'Dank Mono',
                purchaseUrl: 'https://dank.sh/',
                fallback: 'Monaco, monospace',
                description: 'Premium coding font with ligatures',
                isPaid: true
            }
        ],
        fallback: 'Monaco, monospace'
    }
};

const DEFAULT_SETTINGS = {
    fonts: {
        'J charcoal': {
            fontFamily: 'Fira Code',
            fontSize: 14,
            lineHeight: 1.5,
            fontWeight: '400',
            letterSpacing: 0.5,
            ligatures: true
        },
        'J Dark Material v2': {
            fontFamily: 'Hack',
            fontSize: 14,
            lineHeight: 1.5,
            fontWeight: '400',
            letterSpacing: 0.5,
            ligatures: true
        },
        'J Charcoal Light': {
            fontFamily: 'Fira Code',
            fontSize: 14,
            lineHeight: 1.5,
            fontWeight: '400',
            letterSpacing: 0.5,
            ligatures: true
        },
        'J Funky Minimal Dark': {
            fontFamily: 'Hack',
            fontSize: 14,
            lineHeight: 1.5,
            fontWeight: '400',
            letterSpacing: 0.5,
            ligatures: true
        }
    },
    tokens: {
        'J charcoal': {
            'namespace': { foreground: '#F29E74' },
            'class': { foreground: '#5CCFE6', bold: true },
            'class.declaration': { foreground: '#5CCFE6', bold: true },
            'interface': { foreground: '#FFD580', italic: true },
            'enum': { foreground: '#FF9944' },
            'function': { foreground: '#FFD580' },
            'method': { foreground: '#FFD580' },
            'variable': { foreground: '#D4BFFF' },
            'variable.readonly': { foreground: '#D4BFFF', italic: true },
            'parameter': { foreground: '#D4BFFF', italic: true },
            'property': { foreground: '#BAE67E' },
            'property.readonly': { foreground: '#BAE67E', italic: true },
            'keyword': { foreground: '#FF9944', italic: true },
            'string': { foreground: '#BAE67E' },
            'number': { foreground: '#D4BFFF' },
            'regexp': { foreground: '#95E6CB' },
            'operator': { foreground: '#F29E74' },
            'decorator': { foreground: '#FFD580', italic: true },
            'type': { foreground: '#5CCFE6' },
            'typeParameter': { foreground: '#5CCFE6', italic: true }
        },
        'J Dark Material v2': {
            'namespace': { foreground: '#82AAFF' },
            'class': { foreground: '#61AFEF', bold: true },
            'class.declaration': { foreground: '#61AFEF', bold: true },
            'interface': { foreground: '#C792EA', italic: true },
            'enum': { foreground: '#89DDFF' },
            'function': { foreground: '#82AAFF' },
            'method': { foreground: '#82AAFF' },
            'variable': { foreground: '#E06C75' },
            'variable.readonly': { foreground: '#E06C75', italic: true },
            'parameter': { foreground: '#ABB2BF', italic: true },
            'property': { foreground: '#E06C75' },
            'property.readonly': { foreground: '#E06C75', italic: true },
            'keyword': { foreground: '#C678DD', italic: true },
            'string': { foreground: '#98C379' },
            'number': { foreground: '#D19A66' },
            'regexp': { foreground: '#56B6C2' },
            'operator': { foreground: '#56B6C2' },
            'decorator': { foreground: '#61AFEF', italic: true },
            'type': { foreground: '#61AFEF' },
            'typeParameter': { foreground: '#61AFEF', italic: true }
        },
        'J Charcoal Light': {
            'namespace': { foreground: '#E67E22' },
            'class': { foreground: '#0097A7', bold: true },
            'class.declaration': { foreground: '#0097A7', bold: true },
            'interface': { foreground: '#6B2FBA', italic: true },
            'enum': { foreground: '#AF00DB' },
            'function': { foreground: '#2B5B84' },
            'method': { foreground: '#2B5B84' },
            'variable': { foreground: '#C41A16' },
            'variable.readonly': { foreground: '#C41A16', italic: true },
            'parameter': { foreground: '#4D4D4D', italic: true },
            'property': { foreground: '#2E7D32' },
            'property.readonly': { foreground: '#2E7D32', italic: true },
            'keyword': { foreground: '#AF00DB', italic: true },
            'string': { foreground: '#2E7D32' },
            'number': { foreground: '#1C00CF' },
            'regexp': { foreground: '#0097A7' },
            'operator': { foreground: '#000000' },
            'decorator': { foreground: '#CC7700', italic: true },
            'type': { foreground: '#0097A7' },
            'typeParameter': { foreground: '#0097A7', italic: true }
        },
        'J Funky Minimal Dark': {
            'namespace': { foreground: '#FF00FF' },
            'class': { foreground: '#00FFFF', bold: true },
            'class.declaration': { foreground: '#00FFFF', bold: true },
            'interface': { foreground: '#FF69B4', italic: true },
            'enum': { foreground: '#FF00FF' },
            'function': { foreground: '#FFD700' },
            'method': { foreground: '#FFD700' },
            'variable': { foreground: '#FF69B4' },
            'variable.readonly': { foreground: '#FF69B4', italic: true },
            'parameter': { foreground: '#FF69B4', italic: true },
            'property': { foreground: '#E6E6E6' },
            'property.readonly': { foreground: '#E6E6E6', italic: true },
            'keyword': { foreground: '#FF00FF', italic: true },
            'string': { foreground: '#00FF00' },
            'number': { foreground: '#FF00FF' },
            'regexp': { foreground: '#00FFFF' },
            'operator': { foreground: '#FF00FF' },
            'decorator': { foreground: '#FFD700', italic: true },
            'type': { foreground: '#00FFFF' },
            'typeParameter': { foreground: '#00FFFF', italic: true }
        }
    }
};

module.exports = {
    THEMES,
    FONTS,
    DEFAULT_SETTINGS
};