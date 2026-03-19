# AGENTS.md - XTT Typing Practice Application

## Project Overview
**小许打字** (Xiao Xu Typing Practice) - A simple typing practice web application built with vanilla HTML, CSS, and JavaScript.

**Technology Stack:**
- HTML5 with inline CSS and JavaScript
- Vanilla JavaScript (no frameworks)
- No build tools or package managers
- Static content served from text files

## Project Structure
```
/opt/projects/xtt/
├── index.html          # Main typing practice application (fetches content from files)
├── local.html          # Local version with embedded content
├── contents/           # Typing practice text content
│   ├── 1.txt          # Story 1
│   ├── 2.txt          # Story 2
│   ├── ...            # Stories 3-9
│   └── 10.txt         # Story 10
└── AGENTS.md          # This file
```

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

#### HTML/CSS Patterns
- **Inline Styles**: Keep CSS in `<style>` tags within HTML files
- **Semantic HTML**: Use appropriate HTML5 elements
- **Accessibility**: Ensure keyboard navigation works (already implemented with onkeydown)
- **Responsive Design**: Consider adding responsive CSS if expanding the application

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

## Build & Development Commands

### Running the Application
```bash
# Simply open index.html in a browser
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

### Code Review Checklist
- [ ] No JavaScript errors in browser console
- [ ] Typing functionality works correctly
- [ ] Backspace key works as expected
- [ ] Speed calculation is accurate
- [ ] Chinese error messages are appropriate
- [ ] Code follows existing patterns
- [ ] No unnecessary dependencies added

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

## Troubleshooting

### Common Issues
1. **Content not loading**: Check browser console for fetch errors
2. **Typing not registering**: Ensure `onkeydown` event handler is properly attached
3. **Speed calculation incorrect**: Verify `showSpeed()` function logic
4. **CSS not applying**: Check for CSS specificity issues

### Debugging Tips
- Use `console.log()` for debugging (remove before committing)
- Check browser developer tools for errors
- Test with different typing content files
- Verify event key codes if adding new keyboard shortcuts

## Future Considerations

If this project grows, consider:
1. **Adding a simple build process** (e.g., minification)
2. **Separating CSS/JS into external files**
3. **Adding unit tests** with a lightweight framework
4. **Implementing a package.json** for dependency management
5. **Adding TypeScript** for type safety

However, for now, keep it simple and maintainable as a lightweight typing practice tool.

---

*Last Updated: March 17, 2026*  
*For agentic coding agents working on the XTT typing practice application.*