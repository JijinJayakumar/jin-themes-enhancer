# Jin Themes Enhancer

A powerful VS Code extension that enhances Jin Themes with advanced bracket colorization, semantic tokens, and font management features.

## Features

### 1. Enhanced Bracket Colorization 🎨
- Custom color schemes for bracket pairs
- Theme-specific bracket colors
- Improved readability for nested structures
- Independent color pools for different bracket types

![Bracket Colorization](images/brackets.png)

### 2. Semantic Token Enhancements ✨
- Improved syntax highlighting
- Better distinction between code elements
- Theme-specific token colors
- Customizable token styles (bold, italic)

![Semantic Tokens](images/tokens.png)

### 3. Advanced Font Management 📝
- Integration with popular coding fonts
- Support for font ligatures
- Cursive italics for comments and keywords
- Customizable line height and letter spacing

![Font Management](images/fonts.png)

## Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install jijin.jin-themes-enhancer`

Or install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Jijin.jin-themes-enhancer)

## Usage

### Configure Enhancements
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Jin Themes" to see available commands:
   - Configure Bracket Colors
   - Configure Semantic Tokens
   - Configure Font Styles

### Quick Start
1. Select a Jin Theme
2. Use command `Jin Themes: Configure Enhancements`
3. Choose the feature you want to customize

## Commands

|
 Command 
|
 Description 
|
|
---------
|
-------------
|
|
`jinThemes.configureEnhancements`
|
 Open main configuration menu 
|
|
`jinThemes.configureBrackets`
|
 Configure bracket colorization 
|
|
`jinThemes.configureTokens`
|
 Configure semantic token colors 
|
|
`jinThemes.configureFonts`
|
 Configure font settings 
|

## Settings

### Bracket Colors
```json
{
    "jinThemes.enhancedBrackets": true,
    "jinThemes.bracketColors": {
        "J charcoal": {
            "()": "#FFCC66",
            "[]": "#FF9944",
            "{}": "#89DDFF"
        }
    }
}
```

### Semantic Tokens
```json
{
    "jinThemes.semanticHighlighting": true,
    "jinThemes.tokenColors": {
        "J charcoal": {
            "class": { "foreground": "#5CCFE6", "bold": true },
            "function": { "foreground": "#FFD580", "italic": true }
        }
    }
}
```

### Font Settings
```json
{
    "jinThemes.fontEnhancements": true,
    "jinThemes.fontSettings": {
        "J charcoal": {
            "fontFamily": "JetBrains Mono",
            "fontSize": 14,
            "lineHeight": 1.5
        }
    }
}
```

## Recommended Fonts
- JetBrains Mono
- Fira Code
- Cascadia Code
- Victor Mono (for cursive italics)
- Operator Mono (for cursive italics)

## Extension Requirements
- VS Code version 1.60.0 or higher
- Jin Themes installed

## Extension Settings
This extension contributes the following settings:

* `jinThemes.enhancedBrackets`: Enable/disable bracket colorization
* `jinThemes.semanticHighlighting`: Enable/disable semantic tokens
* `jinThemes.fontEnhancements`: Enable/disable font enhancements

## Known Issues
See [GitHub Issues](https://github.com/JijinJayakumar/jin-themes-enhancer/issues)

## Release Notes

### 1.0.0
- Initial release
- Added bracket colorization
- Added semantic token enhancement
- Added font management

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development
```bash
# Install dependencies
npm install

# Package extension
npm run package

# Run tests
npm test
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Author
- Jijin
- [GitHub](https://github.com/JijinJayakumar)
