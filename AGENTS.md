# AGENTS.md - XTT Typing Practice Application

## Project Overview
**小许打字** (Xiao Xu Typing Practice) - A multi-mode typing practice web application supporting English text, Wubi (五笔) input method, and character practice.

**Technology Stack:**
- HTML5 with inline CSS and JavaScript
- Vanilla JavaScript (no frameworks)
- Custom Wubi radical font (subset from 19MB to 16KB)
- No build tools required for production
- Static content served from text files

## Project Structure
```
/opt/projects/xtt/
├── index.html              # Main typing practice (story-based)
├── local.html              # Local version with embedded content
├── english-typing.html     # English character typing practice
├── wb_radicals.html        # Wubi (五笔) radical practice with custom font
├── all_in_one.html         # Early all-in-one version (legacy)
├── contents/               # Typing practice text content
│   ├── 1.txt              # Story 1
│   ├── 2.txt              # Story 2
│   ├── ...                # Stories 3-9
│   └── 10.txt             # Story 10
├── wb_dict/                # Wubi dictionary files
├── wubi_radicals.woff2     # Optimized Wubi radical font (237 chars, 16.5KB)
├── wubi_root_font.ttf      # Original 19MB font (backup)
├── extract_font_subset.py  # Font subset extraction script
├── font-analyzer.html      # PUA character analysis tool
├── radical-mapping.txt     # PUA character mapping documentation
├── update_content.js       # Content update utility
├── update_wubi.js          # Wubi data update utility
└── AGENTS.md              # This file
```

## Main Application Pages

### 1. index.html - Story Mode
Main typing practice with 10 stories loaded from `/contents/`
- Fetches content dynamically
- Supports backspace and restart
- Shows typing speed (WPM) and accuracy

### 2. english-typing.html - Character Practice
Single-character typing practice for keyboard familiarization
- Displays random characters (letters, numbers, symbols)
- Highlights corresponding key on virtual keyboard
- Ignores control keys (Ctrl, Shift, Alt, Tab, Caps, Arrows)
- Case-insensitive for letters

### 3. wb_radicals.html - Wubi Radical Practice
Practice Wubi input method with visual radical display
- Uses custom `wubi_radicals.woff2` font for 237 PUA characters
- Displays radicals on 25 letter keys (A-Y, Z empty)
- Shows 4 radicals per row with 4px padding
- 62x62px keys with centered content
- 5-row complete keyboard layout matching English page

## Development Guidelines

### Code Style & Conventions

#### JavaScript Patterns
- **Variable Declaration**: Use `const` for constants, `let` for variables that change
  ```javascript
  // Good
  const fileCount = 10;
  let globalIdx = 1;
  
  // Avoid (legacy)
  var startTime = null;
  ```

- **Naming Conventions**:
  - camelCase for variables and functions: `globalIdx`, `startTime`, `showSpeed()`
  - PascalCase for constructor functions (if any)
  - UPPER_CASE for constants (if any)

- **Function Declarations**: Use function declarations (not arrow functions) for top-level functions
  ```javascript
  // Good
  async function initLoadData() { ... }
  function restart() { ... }
  
  // Avoid for top-level functions
  const initLoadData = async () => { ... };
  ```

- **Error Handling**: Use try/catch blocks with meaningful error messages
  ```javascript
  try {
    const response = await fetch(`contents/${randomFile}.txt`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    // Process data
  } catch (error) {
    console.error('Failed to load typing content:', error);
    // Provide user-friendly error message
    document.getElementById('typingArea').innerHTML = "数据加载失败，请刷新重试。";
  }
  ```

- **Async/Await**: Use async/await for asynchronous operations (fetch API)
  ```javascript
  async function loadContent() {
    const response = await fetch('contents/1.txt');
    const text = await response.text();
    return text;
  }
  ```

- **Keyboard Event Filtering**: Always filter control keys to prevent false errors
  ```javascript
  // Ignore control keys
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
    return;
  }
  
  // Ignore navigation keys
  if (['Tab', 'CapsLock', 'Backspace', 'Enter', 'Control', 'Alt', 'Shift',
       'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
    return;
  }
  ```

#### HTML/CSS Patterns
- **Inline Styles**: Keep CSS in `<style>` tags within HTML files
- **Semantic HTML**: Use appropriate HTML5 elements
- **Accessibility**: Ensure keyboard navigation works (already implemented with onkeydown)
- **Font Loading**: Use font-display: swap for custom fonts
  ```css
  @font-face {
    font-family: 'WubiRoot';
    src: url('wubi_radicals.woff2?v=2') format('woff2');
    font-display: swap;
  }
  ```

#### Keyboard Layout Styling
- **Standard Key Size**: 62x62px (English: 50x50px)
- **Row Gap**: 6px
- **Key Gap**: 5px
- **Flexible Keys**: Use `.flex` class for Tab, Shift, Enter, etc.
- **Wide Keys**: Use `.wide` class for Ctrl, Alt (92px)

#### Comments & Documentation
- **Chinese Comments**: This project uses Chinese comments for user-facing messages
  ```javascript
  // 获取按键的字符 (Get the character pressed)
  ```
- **Error Messages**: Provide both console errors and user-friendly messages in Chinese
- **Minimal Comments**: Only comment complex logic, not obvious code

### File Organization
- **HTML Files**: Keep all HTML, CSS, and JavaScript in single files for simplicity
- **Content Separation**: Store typing content in separate `.txt` files in `/contents/`
- **No Modularization**: This is a simple app - no need for separate JS/CSS files
- **Font Files**: Keep optimized fonts in root directory with version query strings

## Font Subset Workflow

If you need to regenerate the Wubi font subset:

```bash
# Requires fonttools
pip install fonttools

# Run extraction script
python extract_font_subset.py
```

The script will:
1. Read PUA mappings from `radical-mapping.txt`
2. Extract only needed characters from `wubi_root_font.ttf`
3. Generate `wubi_radicals.woff2` (~16KB, down from 19MB)

## Build & Development Commands

### Running the Application
```bash
# Simply open HTML files in a browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

### No Build Process Required
This is a static web application with no build steps. Changes are reflected immediately upon browser refresh.

### Testing
- **Manual Testing**: Open the application and test typing functionality
- **Browser Console**: Check for JavaScript errors in browser developer tools
- **Cross-browser Testing**: Test in Chrome, Firefox, Safari
- **Font Testing**: Use `font-analyzer.html` to verify PUA characters render correctly

## Git & Version Control

### Commit Guidelines
- **Atomic Commits**: Each commit should represent a single logical change
- **Descriptive Messages**: Use clear, concise commit messages in English
- **Example Commit Messages**:
  ```
  feat: Add new typing content story
  fix: Correct backspace functionality
  style: Improve CSS styling for better readability
  docs: Update AGENTS.md with new guidelines
  feat: Add Wubi radical practice page
  feat: Extract font subset for 237 radicals
  ```

### Branch Strategy
- `main`: Production-ready code
- `feature/*`: New features or enhancements
- `fix/*`: Bug fixes

## AI Assistant Guidelines

### For Agentic Coding Agents
1. **Keep It Simple**: This is a vanilla JS project - avoid introducing unnecessary complexity
2. **Follow Existing Patterns**: Match the coding style found in existing files
3. **Test Changes**: Always test typing functionality after making changes
4. **Chinese Language Support**: Maintain Chinese comments and user messages
5. **Performance**: Keep the application lightweight and fast-loading
6. **Font Handling**: Always use the subset font, not the original 19MB file
7. **Keyboard Consistency**: Keep all keyboard pages (English, Wubi) layout consistent

### Code Review Checklist
- [ ] No JavaScript errors in browser console
- [ ] Typing functionality works correctly
- [ ] Backspace key works as expected
- [ ] Speed calculation is accurate
- [ ] Chinese error messages are appropriate
- [ ] Code follows existing patterns
- [ ] No unnecessary dependencies added
- [ ] Control keys are properly filtered (no false errors)
- [ ] Font loads correctly and characters render
- [ ] Keyboard layout is consistent across pages

## Common Tasks & How-To

### Adding New Typing Content
1. Create a new `.txt` file in `/contents/` (e.g., `11.txt`)
2. Add engaging story text (English paragraphs work best)
3. Update `fileCount` constant in `index.html` if adding beyond 10 files
4. Test that the new content loads correctly

### Modifying Styling
1. Edit CSS in the `<style>` tag of the HTML file
2. Test across different screen sizes
3. Ensure color contrast meets accessibility standards

### Adding New Features
1. Consider if the feature aligns with the simple typing practice purpose
2. Implement in vanilla JavaScript without external libraries
3. Test thoroughly before committing
4. Update this AGENTS.md if adding new patterns or conventions

### Updating Wubi Radical Mappings
1. Edit `radical-mapping.txt` with new PUA code points
2. Update `radicalData` object in `wb_radicals.html`
3. Re-run `extract_font_subset.py` if adding new characters
4. Test in `font-analyzer.html` first to verify characters exist in font

## Troubleshooting

### Common Issues
1. **Content not loading**: Check browser console for fetch errors
2. **Typing not registering**: Ensure `onkeydown` event handler is properly attached
3. **Speed calculation incorrect**: Verify `showSpeed()` function logic
4. **CSS not applying**: Check for CSS specificity issues
5. **Font not loading**: Check Network tab for 404 errors on `wubi_radicals.woff2`
6. **PUA characters showing as boxes**: Font not loaded or character not in subset

### Debugging Tips
- Use `console.log()` for debugging (remove before committing)
- Check browser developer tools for errors
- Test with different typing content files
- Verify event key codes if adding new keyboard shortcuts
- Use `font-analyzer.html` to inspect PUA characters
- Check `radical-mapping.txt` for correct code point values

## Future Considerations

If this project grows, consider:
1. **Adding a simple build process** (e.g., minification)
2. **Separating CSS/JS into external files**
3. **Adding unit tests** with a lightweight framework
4. **Implementing a package.json** for dependency management
5. **Adding TypeScript** for type safety
6. **Adding more typing modes** (e.g., code typing, number pad practice)

However, for now, keep it simple and maintainable as a lightweight typing practice tool.

---

*Last Updated: April 4, 2026*  
*For agentic coding agents working on the XTT typing practice application.*
