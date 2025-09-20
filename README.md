# Last Hope: Seeds of Tomorrow

A post-apocalyptic narrative survival game built with React and TypeScript, featuring a terminal-inspired UI design and branching storylines about hope, restoration, and humanity's survival.

![Last Hope Banner](https://img.shields.io/badge/Last%20Hope-Seeds%20of%20Tomorrow-brightgreen?style=for-the-badge&logo=react)

## 🌱 About the Game

**Last Hope: Seeds of Tomorrow** is an interactive fiction game set in a post-apocalyptic world where environmental collapse has left Earth dying. Players take on the role of a survivor carrying precious seeds that might restore life to the wasteland. Through meaningful choices, resource management, and relationship building, players navigate a world where hope itself is a scarce resource.

### 🎮 Key Features

- **📖 Rich Narrative**: Branching storylines with meaningful consequences
- **🌿 Restoration Mechanics**: Plant seeds and watch ecosystems slowly recover
- **👥 Relationship System**: Build connections with other survivors
- **📊 Resource Management**: Manage hope, health, sanity, and survival resources
- **🖥️ Terminal UI**: Authentic post-apocalyptic computer terminal aesthetic
- **🎭 Multiple Backgrounds**: Choose from scientist, survivor, or community leader origins
- **🔄 Replayability**: Multiple story paths and endings based on player choices

## 🎨 UI Design

The game features a unique **post-apocalyptic terminal interface** with:

- **Color Palette**: Rust reds, ash grays, dirty yellows, irradiated greens
- **Visual Effects**: CRT scan lines, terminal flicker, static noise
- **Typography**: Monospace fonts with glowing text effects
- **Interactive Elements**: Distressed metal panels with jagged borders
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

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

4. **Open your browser** to `http://localhost:5173`

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
│   │   │   ├── ui/                     # Reusable UI components
│   │   │   ├── game/                   # Game-specific components
│   │   │   └── layout/                 # Layout components
│   │   ├── data/                       # Game data and configuration
│   │   │   ├── scenes/                 # Story scenes organized by theme
│   │   │   ├── characterBackgrounds.ts # Character creation options
│   │   │   ├── endingConditions.ts    # Game ending definitions
│   │   │   └── initialGameState.ts    # Default game state
│   │   ├── stores/                     # Zustand state management
│   │   ├── types/                      # TypeScript type definitions
│   │   ├── styles/                     # CSS and styling
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

- **🧠 Hope**: Mental resilience (game ends if this reaches zero)
- **❤️ Health**: Physical condition affecting survival
- **🧘 Sanity**: Mental stability influencing decision quality
- **🍎 Food**: Essential for survival and energy
- **💧 Water**: Critical for all biological functions
- **⚡ Energy**: Required for actions and exploration
- **📚 Knowledge**: Unlocks better choices and research options
- **🌱 Seeds**: Precious genetic material for world restoration

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

The game is fully responsive and optimized for:

- **Desktop**: Full grid layout with three-column interface
- **Tablet**: Stacked layout with touch-friendly interactions
- **Mobile**: Single-column layout with optimized typography

## 🎨 Customization

### Adding New Story Content

1. **Create new scenes** in appropriate files under `src/data/scenes/`
2. **Define choices** with consequences, requirements, and relationships
3. **Add TypeScript types** for any new data structures
4. **Test story flow** to ensure proper navigation

### Modifying UI Theme

The terminal UI is fully customizable through CSS variables in `src/styles/terminal.css`:

```css
:root {
  --color-terminal-green: rgba(0, 255, 100, 1);
  --color-terminal-amber: rgba(255, 180, 0, 1);
  --color-terminal-red: rgba(255, 50, 50, 1);
  /* ... more variables */
}
```

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
- Verify CSS imports in components
- Check browser developer tools for CSS conflicts
- Ensure terminal.css is properly loaded

## 📈 Performance

The game is optimized for performance with:

- **Code Splitting**: Lazy loading of non-critical components
- **Memoization**: React.memo for expensive renders
- **State Optimization**: Efficient Zustand store updates
- **Bundle Optimization**: Vite's production optimizations

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

## 📞 Support

For questions, bug reports, or feature requests:

1. **Check existing issues** in the repository
2. **Create a new issue** with detailed description
3. **Include reproduction steps** for bugs
4. **Provide system information** (OS, browser, Node.js version)

---

**Last Hope: Seeds of Tomorrow** - *Where hope grows, so does the future.* 🌱