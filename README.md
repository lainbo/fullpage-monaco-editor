# Fullscreen Monaco Editor

[中文文档](README.zh.md)

A lightweight fullscreen Monaco Editor implementation that supports configuration via URL parameters. Can display either a standard editor or a diff (comparison) editor.

## Features

- Fast loading Monaco Editor
- Fullscreen display
- Configure editor via URL parameters
- Support for both standard and diff editor modes
- Lightweight and fast

## Supported URL Parameters

### Common Parameters

The following parameters work in both editor modes:

- `theme`: Editor theme ('vs', 'vs-dark', 'hc-black', 'hc-light')
- `fontSize`: Font size (number)
- `editorType`: Editor type ('normal' or 'diff')
- `language`: Editor language ('javascript', 'typescript', 'html', etc.)
- `wordWrap`: Word wrap mode ('on', 'off', 'wordWrapColumn', 'bounded')
- `minimap`: Whether to show minimap ('true', 'false')

### Diff Editor Specific Parameters

When `editorType=diff`, the following parameters are valid:

- `originalEditable`: Whether the original text is editable ('true', 'false')
- `renderSideBySide`: Whether to display side by side ('true', 'false'), shows inline mode when false

## Usage Examples

### Standard Editor

```
http://localhost:5173/?theme=vs-dark&fontSize=18&editorType=normal&wordWrap=on&minimap=false&language=javascript
```

### Diff Editor

```
http://localhost:5173/?theme=vs-dark&fontSize=18&editorType=diff&originalEditable=true&renderSideBySide=true&language=javascript
```

## Special Notes

- The `fontSize`, `theme`, and `language` parameters will always appear in the URL, even if not explicitly specified
- The `language` parameter will always be at the end of the URL
- All parameters are case-insensitive

## Tech Stack

- TypeScript
- Vite
- Monaco Editor

## Development

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
``` 
