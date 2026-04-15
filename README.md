# Flutter Lingua Stream 🎵🌍

A modern, real-time audio translation web application built with React, TypeScript, and Tailwind CSS. This project provides cross-platform multilingual audio translation with real-time speech processing capabilities.

## 🚀 Features

- **Real-Time Audio Translation**: Convert and translate audio streams in real-time across multiple languages
- **Cross-Platform Support**: Works seamlessly on web browsers with responsive design
- **Modern UI Components**: Leverages shadcn/ui and Radix UI for accessible, polished components
- **Audio Processing**: Advanced audio visualization and real-time speech processing
- **Dark Mode Support**: Built-in theme switching with light and dark mode support
- **Responsive Design**: Mobile-first responsive layout using Tailwind CSS
- **Type-Safe Development**: Full TypeScript support for robust code quality
- **State Management**: React Query for efficient server state management
- **Form Handling**: React Hook Form with Zod validation for reliable form management

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3+**: Modern UI library with hooks and functional components
- **TypeScript 5.8+**: Type-safe JavaScript for better developer experience
- **Vite 5.4+**: Lightning-fast build tool and development server

### UI & Styling
- **Tailwind CSS 3.4+**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible React components
- **Radix UI**: Unstyled, accessible primitives for building design systems
- **Lucide React**: Beautiful, consistent icon library

### Forms & Validation
- **React Hook Form 7.61+**: Performant, flexible form library
- **Zod 3.25+**: TypeScript-first schema validation
- **@hookform/resolvers**: Form validation resolver support

### Data & State Management
- **React Router DOM 6.30+**: Client-side routing
- **TanStack React Query 5.83+**: Server state management and data fetching
- **Recharts 2.15+**: Composable chart library for data visualization

### Audio & Media
- **Web Audio API Integration**: For audio capture and processing
- **Real-time Audio Visualization**: Visual feedback for audio streams

### Development Tools
- **ESLint**: Code quality and linting
- **TypeScript ESLint**: TypeScript-specific linting rules
- **Lovable Tagger**: Component tagging for Lovable integration

## 📋 Prerequisites

- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher (or Bun for alternative package management)
- **Git**: For version control

## 🚦 Getting Started

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ramdevarmaa/flutter-lingua-stream.git
   cd flutter-lingua-stream
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or with Bun
   bun install
   ```

### Development

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

Features:
- Fast refresh for instant feedback
- Component tagging for Lovable integration
- Full TypeScript support
- Source maps for debugging

### Production Build

Build the application for production:

```bash
npm run build
```

Build with development mode configuration:

```bash
npm run build:dev
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check and lint code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
flutter-lingua-stream/
├── src/                      # Source code directory
│   ├── components/          # Reusable React components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and helpers
│   ├── styles/              # Global styles
│   └── main.jsx            # Application entry point
├── public/                  # Static assets
├── index.html               # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
└── README.md               # This file
```

## 🎨 Styling & Theming

The project uses Tailwind CSS with a comprehensive theming system:

### Color Variables
- **Primary, Secondary, Accent**: Brand colors
- **Success, Warning, Destructive**: Status indicators
- **Audio-specific colors**: For audio visualization (active, inactive, peak)
- **Sidebar colors**: For navigation and layout

### Custom Features
- Dark mode support using CSS classes
- Custom gradient backgrounds
- Glow and shadow effects
- Smooth transitions and spring animations

Configure themes by modifying `tailwind.config.ts`

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
VITE_API_URL=your_api_endpoint_here
# Add other environment variables as needed
```

### Vite Configuration
- Development server runs on `http://localhost:8080`
- Hot Module Replacement (HMR) enabled
- Path alias `@` points to `./src` for clean imports

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| typescript | ^5.8.3 | Type safety |
| tailwindcss | ^3.4.17 | Styling |
| react-hook-form | ^7.61.1 | Form management |
| zod | ^3.25.76 | Schema validation |
| @tanstack/react-query | ^5.83.0 | Server state |
| recharts | ^2.15.4 | Data visualization |
| react-router-dom | ^6.30.1 | Routing |

## 🚀 Deployment

### Lovable Platform

1. Open [Lovable Project Dashboard](https://lovable.dev)
2. Navigate to your project
3. Click **Share → Publish**
4. Follow the deployment wizard

### Custom Domain

1. Go to **Project Settings → Domains**
2. Click **Connect Domain**
3. Follow DNS configuration steps
4. Reference: [Custom Domain Setup](https://docs.lovable.dev/features/custom-domain)

### Traditional Hosting

Build and deploy to any static hosting service:

```bash
npm run build
# Deploy the 'dist' directory to your hosting provider
```

Compatible with:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Any static hosting service

## 🔄 Integration with Lovable

This project is generated with Lovable, an AI-assisted web development platform:

### Editing Options

1. **Via Lovable Platform**: Visit [your project](https://lovable.dev/projects/b4819a8d-cf06-47d8-9345-7cc6ba625f7e)
2. **Local IDE**: Clone and use your preferred code editor
3. **GitHub**: Edit files directly and commit changes
4. **GitHub Codespaces**: Cloud-based development environment

All changes sync automatically across platforms.

## 🐛 Troubleshooting

### Common Issues

**Port 8080 already in use**
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3000
```

**Build failing**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**TypeScript errors**
```bash
# Ensure TypeScript is properly installed
npm install typescript --save-dev
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Ramdev Arma** - [@ramdevarmaa](https://github.com/ramdevarmaa)

## 📧 Support

For issues, questions, or suggestions:
- Open an [GitHub Issue](https://github.com/ramdevarmaa/flutter-lingua-stream/issues)
- Check existing documentation and FAQs
- Consult Lovable platform support

---

**Last Updated**: 2026-04-15 11:29:05  
**Repository**: [flutter-lingua-stream](https://github.com/ramdevarmaa/flutter-lingua-stream)