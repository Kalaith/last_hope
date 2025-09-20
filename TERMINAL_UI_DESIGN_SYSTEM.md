# Last Hope - Terminal UI Design System
## Post-Apocalyptic Wasteland Survival Interface

### Version 1.0.0
*Last Updated: September 19, 2025*

---

## 🎯 Design Vision

The Last Hope UI embodies the aesthetic of a **recovered pre-civilization terminal system** retrofitted for post-apocalyptic survival management. Think of it as finding an old military computer terminal in a bunker and repurposing it to track resources, manage survivors, and navigate the wasteland.

### Core Design Principles

1. **Authentic Terminal Feel** - Everything should feel like it's running on old computer hardware
2. **Wasteland Degradation** - Visual elements show wear, rust, and environmental damage
3. **Functional Brutalism** - Form follows function with industrial, utilitarian design
4. **Environmental Storytelling** - The UI itself tells the story of survival and decay
5. **Immersive Consistency** - Every element reinforces the post-apocalyptic atmosphere

---

## 🎨 Color Palette

### Primary Color Groups

#### Rust Tones (Primary Accent)
```css
--color-rust-300: rgba(255, 140, 105, 1); /* Light rust highlights */
--color-rust-400: rgba(255, 110, 80, 1);  /* Bright rust accents */
--color-rust-500: rgba(220, 85, 50, 1);   /* Standard rust */
--color-rust-600: rgba(180, 65, 35, 1);   /* Medium rust borders */
--color-rust-700: rgba(140, 45, 20, 1);   /* Dark rust shadows */
--color-rust-800: rgba(100, 30, 10, 1);   /* Deep rust insets */
```

#### Ash Gray Tones (Metal & Structure)
```css
--color-ash-50: rgba(45, 45, 45, 1);      /* Lightest metal */
--color-ash-100: rgba(55, 55, 55, 1);     /* Light metal panels */
--color-ash-200: rgba(70, 70, 70, 1);     /* Medium metal */
--color-ash-300: rgba(85, 85, 85, 1);     /* Standard metal text */
--color-ash-400: rgba(100, 100, 100, 1);  /* Secondary text */
--color-ash-500: rgba(120, 120, 120, 1);  /* Metal highlights */
```

#### Terminal Colors (Interface)
```css
--color-terminal-amber: rgba(255, 180, 0, 1);  /* Primary terminal text */
--color-terminal-green: rgba(0, 255, 100, 1);  /* Success/active states */
--color-terminal-red: rgba(255, 50, 50, 1);    /* Errors/warnings */
```

#### Environmental Tones
```css
/* Dirty Yellow - Radiation/Warnings */
--color-dirty-300: rgba(255, 220, 120, 1);     /* Light warning */
--color-dirty-400: rgba(240, 200, 90, 1);      /* Standard warning */
--color-dirty-500: rgba(220, 180, 60, 1);      /* Medium warning */
--color-dirty-600: rgba(180, 150, 40, 1);      /* Dark warning */

/* Irradiated Green - Radiation/Power */
--color-irradiated-300: rgba(140, 255, 120, 1); /* Bright radiation */
--color-irradiated-400: rgba(120, 235, 100, 1); /* Standard radiation */
--color-irradiated-500: rgba(100, 200, 80, 1);  /* Medium radiation */
--color-irradiated-600: rgba(80, 160, 60, 1);   /* Dark radiation */

/* Wasteland Base - Backgrounds */
--color-wasteland-900: rgba(20, 18, 15, 1);     /* Deepest background */
--color-wasteland-800: rgba(30, 25, 20, 1);     /* Standard background */
--color-wasteland-700: rgba(40, 35, 25, 1);     /* Light background */
--color-wasteland-600: rgba(50, 45, 35, 1);     /* Panel background */
```

### Semantic Color Usage

| Purpose | Color | Usage Notes |
|---------|-------|-------------|
| Primary Text | `terminal-amber` | Main readable text, data values |
| Secondary Text | `ash-400` | Labels, descriptions, metadata |
| Success States | `terminal-green` | Confirmations, positive actions |
| Error States | `terminal-red` | Errors, critical warnings |
| Warning States | `dirty-400` | Cautions, resource warnings |
| Interactive Elements | `terminal-green` | Buttons, links, active states |
| Borders | `rust-600` | Primary borders and dividers |
| Backgrounds | `wasteland-800` | Panel and card backgrounds |

---

## 🔤 Typography System

### Font Stack
```css
--font-family-base: "Courier New", "Monaco", "Menlo", "Consolas",
                    "Liberation Mono", "DejaVu Sans Mono", monospace;
```

### Typography Scale
| Element | Size | Weight | Transform | Spacing | Color |
|---------|------|--------|-----------|---------|-------|
| H1 | 30px | Bold | Uppercase | 2px | `terminal-green` |
| H2 | 24px | Bold | Uppercase | 2px | `terminal-amber` |
| H3 | 20px | Bold | Uppercase | 2px | `terminal-green` |
| H4 | 18px | Bold | Uppercase | 2px | `terminal-amber` |
| H5 | 16px | Bold | Uppercase | 2px | `dirty-400` |
| H6 | 14px | Bold | Uppercase | 2px | `ash-300` |
| Body | 14px | Normal | None | 0px | `terminal-amber` |
| Small | 12px | Normal | None | 0px | `ash-400` |

### Typography Effects
- **Text Shadows**: All headings have glowing effects using their respective colors
- **Letter Spacing**: Headers use 2px spacing for terminal authenticity
- **Text Transform**: All headers are uppercase for computer terminal feel

---

## 🔲 Component Library

### Panel System

#### Base Panel (.card)
```css
/* Distressed metal panel with jagged corners */
clip-path: polygon(
  0% 0%, calc(100% - 8px) 0%, 100% 8px,
  100% calc(100% - 8px), calc(100% - 8px) 100%,
  8px 100%, 0% calc(100% - 8px)
);
```

**Visual Elements:**
- Rust-colored borders (2px solid)
- Gradient backgrounds (wasteland-800 to wasteland-700)
- Inset shadows for depth
- Diagonal stripe overlay patterns
- Hover effects with terminal-green glow

#### Interactive Panels (.background-card)
- **Default State**: Rust borders, subtle glow
- **Hover State**: Terminal-green borders, enhanced glow
- **Selected State**: Bright terminal-green border with outer glow

### Button System

#### Primary Button (.btn--primary)
```css
/* Terminal-style button with angled corners */
clip-path: polygon(
  0% 0%, calc(100% - 4px) 0%, 100% 4px,
  100% calc(100% - 4px), calc(100% - 4px) 100%,
  4px 100%, 0% calc(100% - 4px)
);
```

**States:**
- **Default**: Terminal-green gradient background
- **Hover**: Brighter green with glow effect, slight lift
- **Active**: Darker green, pressed appearance
- **Focus**: Terminal-green outline glow

**Typography**: Uppercase, monospace, 1px letter-spacing

#### Secondary Buttons
- Ash-gray backgrounds with rust borders
- Same geometric clipping as primary
- Hover states use ash-400 backgrounds

### Progress Bars

#### Base Progress Bar
```css
.progress-bar {
  background: var(--color-secondary);
  border-radius: 0; /* No rounded corners */
  height: 8px;
  overflow: hidden;
}
```

#### Progress Fill Variations
- **Hope Bar**: Terminal-green solid
- **Health Bar**: Terminal-green solid
- **Sanity Bar**: Ash-300 (info color)
- **World Status**: Gradient from red through yellow to green
- **Restoration**: Gradient from dirty-400 to terminal-green

### Form Elements

#### Input Fields (.form-control)
- **Background**: Wasteland-800
- **Border**: 1px solid rust-600
- **Focus State**: Terminal-green border with glow
- **Typography**: Monospace font, terminal-amber text
- **No Border Radius**: Sharp, industrial corners

---

## ✨ Animation & Effects System

### Screen Effects

#### CRT Scan Lines
```css
/* Applied to body::before */
background: repeating-linear-gradient(
  0deg, transparent, transparent 2px,
  rgba(terminal-green-rgb, 0.02) 2px,
  rgba(terminal-green-rgb, 0.02) 4px
);
animation: scanlines 0.1s linear infinite;
```

#### Terminal Flicker
```css
/* Applied to .screen::before */
animation: terminal-flicker 3s infinite;
/* Subtle opacity changes: 1 → 0.8 → 1 → 0.9 → 1 */
```

#### Static Noise
```css
/* Applied to .screen::after */
/* Random radial gradients with micro-movements */
animation: static-noise 0.1s infinite;
```

### Interactive Animations

#### Button Interactions
- **Hover**: `translateY(-1px)` with enhanced glow
- **Active**: `translateY(0px)` pressed state
- **Focus**: Pulsing glow effect

#### Card Interactions
- **Hover**: `translateY(-2px)` with border color change
- **Selection**: Instant glow application

### Critical State Animations

#### Critical Warning (.critical-choice)
```css
animation: critical-warning 1.5s infinite;
/* Pulsing red glow with intensity variation */
```

#### Hope Critical (.hope-critical)
```css
animation: hope-critical-pulse 1s infinite;
/* Rapid red pulsing for low hope states */
```

#### Glitch Effect (.glitch-effect)
```css
animation: glitch 0.3s infinite;
/* Rapid micro-movements with hue rotation */
```

#### Radiation Warning (.radiation-warning)
```css
animation: radiation-flicker 2s infinite;
/* Subtle irradiated-green flicker */
```

---

## 📐 Layout System

### Container Hierarchy

1. **Game Container** (`.game-container`)
   - Full viewport height
   - Centered content
   - Z-index: 2 (above scan lines)

2. **Screen** (`.screen`)
   - Max-width: 1200px
   - Terminal monitor frame styling
   - Jagged clip-path borders
   - Multiple shadow layers for depth

3. **Content Areas**
   - **Character Panel**: Left sidebar on desktop
   - **Story Area**: Center content area
   - **Progress Section**: Right sidebar on desktop

### Responsive Behavior

#### Desktop (1024px+)
```css
.game-interface {
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
}
```

#### Tablet (768px - 1024px)
```css
.game-interface {
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr auto;
}
```

#### Mobile (< 768px)
- Single column layout
- Reduced padding
- Simplified shadow effects
- Smaller clipping angles for touch interfaces

---

## 🎮 Game-Specific Components

### World Status Panel
- **Background**: Dark rust tones (bg-4)
- **Border**: Terminal-red for danger emphasis
- **Progress Bar**: Multi-color gradient showing world state
- **Typography**: System status headers with terminal indicators

### Character Stats
- **Vital Stats**: Individual progress bars with colored fills
- **Resources**: List-style display with rust/green highlighting
- **Seeds Resource**: Special green border treatment

### Story Content
- **Scene Titles**: Large terminal-green headers with glow
- **Story Text**: Justified text in bordered content area
- **Choice Buttons**: Full-width interactive buttons with hover states

### Relationship System
- **Status Indicators**: Small panels with character names and levels
- **Color Coding**: Terminal-green for positive relationships
- **Empty State**: Italicized ash-400 text

---

## 🔧 Implementation Guidelines

### CSS Architecture

#### File Organization
```
style.css structure:
├── CSS Variables (Color Palette)
├── Base Styles (HTML/Body)
├── Typography System
├── Component Library
├── Animation Definitions
├── Game-Specific Styles
└── Responsive Breakpoints
```

#### Naming Conventions
- **Colors**: `--color-{group}-{intensity}` (e.g., `--color-rust-500`)
- **Components**: `.{component-name}` (e.g., `.background-card`)
- **Modifiers**: `.{component}--{modifier}` (e.g., `.btn--primary`)
- **States**: `.{component}.{state}` (e.g., `.background-card.selected`)

#### Browser Support
- **Primary**: Modern browsers with CSS Grid and custom properties
- **Fallbacks**: Monospace font stack, basic box model
- **Progressive Enhancement**: Advanced effects degrade gracefully

### Performance Considerations

#### Animation Performance
- Use `transform` and `opacity` for 60fps animations
- Limit simultaneous complex animations
- Use `will-change` sparingly for critical animations

#### Asset Optimization
- No external font dependencies (system fonts only)
- CSS-only visual effects (no images)
- Minimal DOM manipulation required

---

## 🚀 Future Enhancement Roadmap

### Phase 1: Polish & Refinement
- [ ] Add sound effect integration points (data attributes)
- [ ] Implement theme variants (different terminal colors)
- [ ] Add accessibility improvements (reduced motion, high contrast)
- [ ] Create print stylesheet for documentation

### Phase 2: Advanced Effects
- [ ] Particle system integration for dust/smoke effects
- [ ] Advanced glitch effects for system failures
- [ ] Dynamic background patterns based on game state
- [ ] Morse code blinking for easter eggs

### Phase 3: Interaction Enhancements
- [ ] Keyboard navigation with terminal-style focus indicators
- [ ] Command line interface overlay
- [ ] Typewriter text effects for story content
- [ ] Context-sensitive cursor styling

### Phase 4: Immersion Features
- [ ] Dynamic lighting effects based on time of day
- [ ] Weather system visual integration
- [ ] Resource-dependent UI degradation effects
- [ ] Community mood visual indicators

---

## 📝 Development Notes

### Code Standards
- Use CSS custom properties for all colors and spacing
- Maintain consistent component naming
- Document complex animations with comments
- Test on multiple screen sizes and devices

### Testing Checklist
- [ ] All interactive elements have hover/focus states
- [ ] Animations perform at 60fps
- [ ] Text remains readable at all screen sizes
- [ ] Color contrast meets accessibility standards
- [ ] Components work with dynamic content

### Maintenance
- Update this document when adding new components
- Version control major design system changes
- Keep component examples updated
- Document any breaking changes

---

## 📚 Resources & References

### Design Inspiration
- Alien: Isolation computer terminals
- Fallout series Pip-Boy interface
- Metro series menu systems
- Retro-futuristic military computers

### Technical References
- CSS Grid Layout Module
- CSS Custom Properties specification
- CSS Animations and Transitions
- CSS Clip-path specification

### Typography
- Terminal/Monospace font characteristics
- ASCII art and terminal graphics
- Computer readout aesthetic principles

---

*This design system document is a living specification that should be updated as the Last Hope UI evolves. It serves as the single source of truth for maintaining visual consistency and guiding future development.*