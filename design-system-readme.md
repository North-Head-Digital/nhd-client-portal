# North Head Digital - Design System

A comprehensive design system built with Storybook for the North Head Digital Client Portal and related applications.

## 🚀 Quick Start

### Running Storybook

```bash
# Install dependencies
npm install

# Start Storybook development server
npm run storybook

# Build static Storybook for deployment
npm run build-storybook
```

Storybook will be available at `http://localhost:6006`

### Using Components

```tsx
import { Button } from '@/components/common/Button'
import { NHDLogo } from '@/components/common/NHDLogo'

function MyComponent() {
  return (
    <div>
      <NHDLogo variant="horizontal" size="md" />
      <Button variant="primary" size="md">
        Get Started
      </Button>
    </div>
  )
}
```

## 🎨 Design System Overview

### Brand Colors

Our design system is built around a carefully crafted color palette:

- **Primary Blue**: `#667eea` - Main brand color
- **Secondary Purple**: `#764ba2` - Secondary elements
- **Accent Red**: `#f64f59` - Alerts and notifications
- **Gray Scale**: `#f7fafc` to `#171923` - Neutral colors

### Typography

- **Font Family**: Inter (system font stack)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing Scale

- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px

## 🧩 Components

### Button Component

A versatile button component with multiple variants and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `disabled`: boolean

**Example:**
```tsx
<Button 
  variant="primary" 
  size="md" 
  icon={<Search />} 
  iconPosition="left"
>
  Search
</Button>
```

### Logo Component

The NHD logo component ensures consistent brand representation.

**Props:**
- `variant`: 'horizontal' | 'stacked' | 'symbol'
- `size`: 'sm' | 'md' | 'lg'
- `className`: string

**Example:**
```tsx
<NHDLogo variant="horizontal" size="md" />
```

## 🛠️ Development

### Adding New Components

1. **Create the component** in `src/components/common/`
2. **Add comprehensive stories** in `src/components/common/[Component].stories.tsx`
3. **Update documentation** in `src/stories/DesignSystem.mdx`
4. **Test accessibility** and responsiveness

### Story Structure

Each component story should include:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import MyComponent from './MyComponent'

const meta: Meta<typeof MyComponent> = {
  title: 'Components/Category/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Description of the component and its purpose.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for each prop
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Default props
  },
}

export const AllVariants: Story = {
  render: () => (
    // Show all variants
  ),
}
```

### Best Practices

1. **Consistent Naming**: Use descriptive, consistent names for components and stories
2. **Comprehensive Documentation**: Include descriptions for all props and variants
3. **Accessibility**: Ensure all components are keyboard navigable and screen reader friendly
4. **Responsive Design**: Test components at different screen sizes
5. **Performance**: Optimize components for fast rendering

## 📚 Storybook Features

### Addons

Our Storybook includes several useful addons:

- **@storybook/addon-docs**: Automatic documentation generation
- **@storybook/addon-a11y**: Accessibility testing
- **@storybook/addon-vitest**: Component testing
- **@chromatic-com/storybook**: Visual testing (optional)

### Controls

Interactive controls allow you to:
- Test different prop combinations
- See real-time changes
- Understand component behavior
- Debug issues quickly

### Documentation

Auto-generated documentation includes:
- Component descriptions
- Prop tables with types and descriptions
- Usage examples
- Best practices

## 🎯 Design Principles

### 1. Consistency
Every component follows the same design patterns and naming conventions.

### 2. Accessibility
All components meet WCAG 2.1 AA standards for accessibility.

### 3. Scalability
Components are modular and can be easily extended or customized.

### 4. Performance
Lightweight components ensure fast loading times and smooth interactions.

## 🚀 Deployment

### Storybook Deployment

Storybook can be deployed to various platforms:

**Netlify:**
```bash
npm run build-storybook
# Deploy the storybook-static folder
```

**GitHub Pages:**
```bash
npm run build-storybook
# Push storybook-static to gh-pages branch
```

**Chromatic (Visual Testing):**
```bash
npx chromatic --project-token=your-token
```

### Integration with CI/CD

The Storybook build is integrated into our CI/CD pipeline:

```yaml
- name: Build Storybook
  run: npm run build-storybook

- name: Deploy Storybook
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./storybook-static
```

## 🔍 Testing

### Component Testing

Use the Vitest addon for component testing:

```tsx
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './Button'

test('renders button with correct text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

### Visual Testing

Use Chromatic for visual regression testing:

```bash
npx chromatic --project-token=your-token
```

### Accessibility Testing

The a11y addon automatically tests for accessibility issues:

- Color contrast ratios
- Keyboard navigation
- Screen reader compatibility
- ARIA attributes

## 📖 Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

### Guidelines

1. **Follow existing patterns** - Maintain consistency with current components
2. **Write comprehensive stories** - Document all variants and states
3. **Test thoroughly** - Ensure components work across different scenarios
4. **Update documentation** - Keep the design system docs current

### Process

1. Create a feature branch
2. Implement the component with stories
3. Test accessibility and responsiveness
4. Update documentation
5. Submit a pull request
6. Review and merge

## 📊 Component Status

| Component | Status | Version | Documentation |
|-----------|--------|---------|---------------|
| Button | ✅ Stable | 1.0.0 | Complete |
| Logo | ✅ Stable | 1.0.0 | Complete |
| Input | 🚧 In Development | 0.1.0 | Partial |
| Card | 🚧 In Development | 0.1.0 | Partial |
| Modal | 📋 Planned | - | - |
| Table | 📋 Planned | - | - |
| Form | 📋 Planned | - | - |

## 🐛 Troubleshooting

### Common Issues

**Storybook won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run storybook
```

**Components not styled:**
- Ensure Tailwind CSS is properly configured
- Check that brand.css is imported in preview.ts
- Verify component imports are correct

**Build failures:**
- Check TypeScript errors
- Ensure all dependencies are installed
- Verify Storybook configuration

### Getting Help

1. Check the Storybook documentation
2. Review existing component implementations
3. Ask questions in the team chat
4. Create an issue for bugs or feature requests

---

*This design system is continuously evolving. Check back regularly for updates and new components.*
