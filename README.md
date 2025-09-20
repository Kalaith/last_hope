# Last Hope: Seeds of Tomorrow

A post-apocalyptic narrative survival game built with React and TypeScript, featuring a modern tabbed interface with professional UX design and branching storylines about hope, restoration, and humanity's survival.

![Last Hope Banner](https://img.shields.io/badge/Last%20Hope-Seeds%20of%20Tomorrow-brightgreen?style=for-the-badge&logo=react)
![UX Design](https://img.shields.io/badge/UX-Professional%20Design-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Ready%20for%20Expansion-green?style=flat-square)

## 🌱 About the Game

**Last Hope: Seeds of Tomorrow** is an interactive fiction game set in a post-apocalyptic world where environmental collapse has left Earth dying. Players take on the role of a survivor carrying precious seeds that might restore life to the wasteland. Through meaningful choices, resource management, and relationship building, players navigate a world where hope itself is a scarce resource.

### 🎮 Key Features

- **📖 Rich Narrative**: Branching storylines with meaningful consequences
- **🌿 Restoration Mechanics**: Plant seeds and watch ecosystems slowly recover
- **👥 Relationship System**: Build connections with other survivors
- **📊 Resource Management**: Manage hope, health, supplies, knowledge, and seeds
- **🎨 Professional UX**: Modern tabbed interface following Nielsen's usability heuristics
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎭 Multiple Backgrounds**: Choose from scientist, survivor, or community leader origins
- **🔄 Replayability**: Multiple story paths and endings based on player choices
- **⚡ Real-time Feedback**: Color-coded status indicators and progress bars
- **🏗️ Base Building**: Construct and maintain settlement structures
- **🔬 Research System**: Unlock new technologies and capabilities

## 🎨 UI/UX Design

The game features a **modern tabbed interface** with professional UX design:

### 🏗️ **Tabbed Architecture**
- **🏠 Dashboard**: Main game view with critical status and story progression
- **🌍 World**: Exploration map and ecosystem monitoring
- **🏗️ Settlement**: Base management and resource storage
- **🔬 Research**: Technology tree and scientific progress

### 🎯 **UX Principles Applied**
- **Visibility of System Status**: Color-coded alerts and real-time progress bars
- **Consistency & Standards**: Unified design system with semantic colors
- **Recognition over Recall**: Visual status indicators eliminate memory load
- **Aesthetic & Minimalist Design**: Clean information hierarchy with logical grouping
- **Error Prevention**: Clear feedback for critical resource states

### 🎨 **Visual Design System**
- **Status Colors**: Red (critical), Yellow (warning), Green (healthy)
- **Typography Scale**: Clear hierarchy with consistent spacing
- **Card-based Layout**: Logical information grouping with visual separation
- **Responsive Grid**: Adapts beautifully to all screen sizes
- **Professional Polish**: Subtle shadows, smooth transitions, modern aesthetics

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0+)
- **npm** (v8.0+)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd last_hope
   ```

2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5176/last_hope/` (or the port shown in terminal)

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
last_hope/
├── README.md                           # This file
├── TERMINAL_UI_DESIGN_SYSTEM.md        # Complete UI design specification
├── frontend/                           # React TypeScript frontend
│   ├── src/
│   │   ├── components/                  # React components
│   │   │   ├── ui/                     # Reusable UI components (TabNavigation, etc.)
│   │   │   ├── game/                   # Game-specific components & tabs
│   │   │   └── layout/                 # Layout components
│   │   ├── data/                       # Game data and configuration
│   │   │   ├── scenes/                 # Story scenes organized by theme
│   │   │   ├── characterBackgrounds.ts # Character creation options
│   │   │   ├── endingConditions.ts    # Game ending definitions
│   │   │   └── initialGameState.ts    # Default game state
│   │   ├── stores/                     # Zustand state management
│   │   ├── types/                      # TypeScript type definitions
│   │   ├── styles/                     # CSS and styling
│   │   │   ├── terminal.css            # Original terminal theme
│   │   │   ├── tabs.css               # Tab navigation styles
│   │   │   └── ux-system.css          # Professional design system
│   │   ├── hooks/                      # Custom React hooks
│   │   └── utils/                      # Utility functions
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── style.css                          # Legacy styles (being phased out)
├── index.html                         # Legacy HTML (superseded by React)
└── app.js                            # Legacy JavaScript (superseded by React)
```

## 🎯 Game Mechanics

### Character Creation

Choose from three background archetypes, each with unique starting stats and resources:

- **🔬 Environmental Scientist**: High science and knowledge, starts with seeds
- **⚔️ Wasteland Survivor**: High survival skills, more resources, lower hope
- **👥 Community Organizer**: High leadership and empathy, moderate resources

### Core Resources

The game features a streamlined resource system with clear visual feedback:

- **✨ Hope**: Mental resilience (game ends if this reaches zero)
- **❤️ Health**: Physical condition affecting survival
- **📦 Supplies**: Essential materials for daily survival and construction
- **📚 Knowledge**: Unlocks research and better decision options
- **🌱 Seeds**: Precious genetic material for world restoration

**Visual Indicators**: All resources feature color-coded progress bars:
- 🟢 **Green**: Healthy levels (60-100%)
- 🟡 **Yellow**: Warning levels (20-60%)
- 🔴 **Red**: Critical levels (0-20%)

### Story Progression

The game features multiple branching storylines organized into thematic categories:

- **Core Story**: Main narrative progression
- **Planting Scenes**: Environmental restoration and gardening
- **Community Scenes**: Social interactions and relationship building
- **Research Scenes**: Scientific discovery and collaboration

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
npm run ci           # Run all checks (lint + type + test)

# Testing
npm run test:run     # Run tests once
npm run test         # Run tests in watch mode
```

### Technology Stack

- **Framework**: React 19 with TypeScript 5.x
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS 4.x + Custom Terminal CSS
- **State Management**: Zustand 5.x with persistence
- **Testing**: Vitest with React Testing Library
- **Code Quality**: ESLint + Prettier

### Architecture Patterns

- **Component Composition**: Reusable UI components with clear interfaces
- **State Management**: Centralized game state with Zustand
- **Type Safety**: Comprehensive TypeScript coverage
- **File Organization**: Modular structure by feature and responsibility

## 📱 Responsive Design

The tabbed interface adapts beautifully across all devices:

- **Desktop**: Full tab navigation with multi-column card layouts
- **Tablet**: Touch-friendly tabs with responsive grid layouts
- **Mobile**: Icon-only tabs with single-column card stacks

**Accessibility Features**:
- High contrast color schemes for visual clarity
- Large touch targets for mobile interactions
- Clear visual hierarchy with proper heading structure
- Semantic HTML for screen reader compatibility

## 🎨 Customization

### Adding New Story Content

1. **Create new scenes** in appropriate files under `src/data/scenes/`
2. **Define choices** with consequences, requirements, and relationships
3. **Add TypeScript types** for any new data structures
4. **Test story flow** to ensure proper navigation

### Customizing the Design System

The UX design system is fully customizable through CSS variables in `src/styles/ux-system.css`:

```css
:root {
  /* Status Colors */
  --status-critical: #dc2626;    /* Red - Danger */
  --status-warning: #f59e0b;     /* Amber - Warning */
  --status-success: #059669;     /* Green - Success */

  /* Spacing System */
  --spacing-sm: 0.5rem;          /* 8px */
  --spacing-md: 1rem;            /* 16px */
  --spacing-lg: 1.5rem;          /* 24px */

  /* Typography Scale */
  --text-sm: 0.875rem;           /* 14px */
  --text-base: 1rem;             /* 16px */
  --text-lg: 1.125rem;           /* 18px */
}
```

**Available Themes**:
- `ux-system.css` - Modern professional design (current)
- `terminal.css` - Original post-apocalyptic terminal theme
- `tabs.css` - Tab navigation and layout system

## 🧪 Testing

Run the test suite:

```bash
npm run test:run
```

The project includes:
- **Unit Tests**: Component functionality and game logic
- **Integration Tests**: User interactions and state management
- **Type Checking**: Compile-time error detection

## 🐛 Troubleshooting

### Common Issues

**Development server won't start**:
- Ensure Node.js v18+ is installed
- Delete `node_modules` and run `npm install`
- Check for port conflicts (default: 5173)

**TypeScript errors**:
- Run `npm run type-check` for detailed error information
- Ensure all imports use correct file paths
- Check that all required types are properly defined

**Styling issues**:
- Verify CSS imports in components (especially `ux-system.css`)
- Check browser developer tools for CSS conflicts
- Ensure proper CSS cascade order: base → tabs → ux-system
- Use `!important` sparingly, prefer CSS specificity

**Tab navigation issues**:
- Check that `TabNavigation` component is properly imported
- Verify tab state management in `GameScreen.tsx`
- Ensure all tab components import `ux-system.css`

## 📈 Performance

The game is optimized for performance with:

- **Modern Architecture**: React 19 with efficient state management
- **CSS Optimization**: Minimal runtime styles with CSS variables
- **Code Splitting**: Lazy loading of non-critical components
- **Memoization**: React.memo for expensive renders
- **State Optimization**: Efficient Zustand store updates
- **Bundle Optimization**: Vite's production optimizations
- **Responsive Images**: Optimized for various screen densities

**Performance Metrics**:
- Initial load: < 2 seconds on modern browsers
- Tab switching: < 100ms transition time
- Memory usage: Optimized for long gaming sessions

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the existing code style
4. **Add tests** for new functionality
5. **Run quality checks**: `npm run ci`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Functional components with hooks
- **Naming**: Use descriptive names for variables and functions
- **Comments**: Document complex logic and game mechanics
- **Testing**: Write tests for new features and bug fixes

## 📄 License

This project is part of the WebHatchery game collection. See the main repository for license information.

## 🙏 Acknowledgments

- **Inspiration**: Post-apocalyptic fiction and terminal interfaces
- **UI Design**: Influenced by Fallout terminals and retro-futuristic aesthetics
- **Community**: Thanks to all players and contributors

## 🔗 Related Projects

Part of the **WebHatchery** collection of web-based games and applications. Check out other projects in the collection for more interactive experiences.

---

## 🆕 Recent Updates

### **Version 2.0 - Professional UX Redesign (September 2025)**

**Major UI/UX Overhaul**:
- ✅ **Tabbed Interface**: Organized content into logical tabs (Dashboard, World, Settlement, Research)
- ✅ **Professional Design System**: Implemented Nielsen's usability heuristics
- ✅ **Visual Hierarchy**: Clear information prioritization with color-coded status indicators
- ✅ **Responsive Design**: Mobile-first approach with touch-friendly interactions
- ✅ **Accessibility**: High contrast colors, semantic HTML, proper focus management

**Technical Improvements**:
- ✅ **Modern React Patterns**: Updated to React 19 with TypeScript 5.x
- ✅ **Component Architecture**: Modular, reusable UI components
- ✅ **CSS Architecture**: Scalable design system with CSS variables
- ✅ **Build Optimization**: Vite 6.x with hot module replacement

**Game Ready For**: Major gameplay expansion - the UX foundation is now solid and professional.

See `GAME_REVIEW_AND_UPGRADE_PLAN_V2.md` for detailed roadmap of next development phase.

---

## 📞 Support

For questions, bug reports, or feature requests:

1. **Check existing issues** in the repository
2. **Create a new issue** with detailed description
3. **Include reproduction steps** for bugs
4. **Provide system information** (OS, browser, Node.js version)

---

**Last Hope: Seeds of Tomorrow** - *Where hope grows, so does the future.* 🌱