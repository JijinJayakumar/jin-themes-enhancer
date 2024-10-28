// src/constants.js
const THEMES = {
    J_CHARCOAL: 'J charcoal',
    J_DARK_MATERIAL: 'J Dark Material v2',
    J_CHARCOAL_LIGHT: 'J Charcoal Light',
    J_FUNKY_MINIMAL_DARK: 'J Funky Minimal Dark'
};

const FONTS = {
    PROGRAMMING: [
        'JetBrains Mono',
        'Fira Code',
        'Cascadia Code',
        'Hack',
        'Source Code Pro',
        'Ubuntu Mono'
    ],
    CURSIVE: [
        'Victor Mono',
        'Dank Mono',
        'Operator Mono',
        'Comic Mono'
    ]
};

const DEFAULT_SETTINGS = {
    brackets: {
        'J charcoal': {
            '()': '#FFCC66',
            '[]': '#FF9944',
            '{}': '#89DDFF',
            '<>': '#5CCFE6'
        },
        'J Dark Material v2': {
            '()': '#89DDFF',
            '[]': '#82AAFF',
            '{}': '#C792EA',
            '<>': '#F78C6C'
        },
        'J Charcoal Light': {
            '()': '#FF9940',
            '[]': '#FF8040',
            '{}': '#FF6040',
            '<>': '#FF4040'
        },
        'J Funky Minimal Dark': {
            '()': '#FF00FF',
            '[]': '#00FFFF',
            '{}': '#FFFF00',
            '<>': '#00FF00'
        }
    },
    tokens: {
        'J charcoal': {
            'class': { foreground: '#5CCFE6', bold: true },
            'interface': { foreground: '#FFD580', italic: true },
            'enum': { foreground: '#FF9944' },
            'function': { foreground: '#FFD580' },
            'variable': { foreground: '#D4BFFF' },
            'keyword': { foreground: '#FF9944', italic: true },
            'string': { foreground: '#BAE67E' },
            'number': { foreground: '#D4BFFF' },
            'regexp': { foreground: '#95E6CB' },
            'operator': { foreground: '#F29E74' }
        },
        // Add other theme token configurations...
    },
    fonts: {
        'J charcoal': {
            fontFamily: 'JetBrains Mono',
            fontSize: 14,
            lineHeight: 1.5,
            fontWeight: '400',
            letterSpacing: 0.5,
            ligatures: true
        },
        // Add other theme font configurations...
    }
};

module.exports = {
    THEMES,
    FONTS,
    DEFAULT_SETTINGS
};