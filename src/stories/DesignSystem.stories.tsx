import type { Meta } from '@storybook/react'

const meta: Meta = {
  title: 'Design System/Overview',
  parameters: {
    docs: {
      description: {
        component: 'Welcome to the North Head Digital Design System! This comprehensive guide provides everything you need to understand and implement our design principles, components, and patterns.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

export const BrandColors = {
  render: () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Brand Colors</h2>
      <p className="text-gray-600">
        Our design system is built around a carefully crafted color palette that reflects our professional, innovative, and trustworthy brand.
      </p>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Primary Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-primary-500 rounded-lg shadow-md"></div>
              <div className="text-sm">
                <div className="font-medium">Primary Blue</div>
                <div className="text-gray-500">#667eea</div>
                <div className="text-gray-500">Main brand color</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-secondary-500 rounded-lg shadow-md"></div>
              <div className="text-sm">
                <div className="font-medium">Secondary Purple</div>
                <div className="text-gray-500">#764ba2</div>
                <div className="text-gray-500">Secondary elements</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-accent-500 rounded-lg shadow-md"></div>
              <div className="text-sm">
                <div className="font-medium">Accent Red</div>
                <div className="text-gray-500">#f64f59</div>
                <div className="text-gray-500">Alerts & notifications</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Neutral Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className="space-y-2">
                <div className={`h-12 bg-gray-${shade} rounded-lg shadow-sm`}></div>
                <div className="text-sm">
                  <div className="font-medium">Gray {shade}</div>
                  <div className="text-gray-500">Variant {shade}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Our carefully crafted color palette provides consistency across all touchpoints while maintaining accessibility standards.',
      },
    },
  },
}

export const Typography = {
  render: () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Typography</h2>
      <p className="text-gray-600">
        We use the Inter font family throughout our applications for its excellent readability and modern appearance.
      </p>
      
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Heading 1 - 4xl Bold</h1>
          <p className="text-sm text-gray-500 mt-1">Use for main page titles and hero sections</p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Heading 2 - 3xl Semibold</h2>
          <p className="text-sm text-gray-500 mt-1">Use for section headers</p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Heading 3 - 2xl Semibold</h3>
          <p className="text-sm text-gray-500 mt-1">Use for subsection headers</p>
        </div>
        <div>
          <h4 className="text-xl font-medium text-gray-900">Heading 4 - xl Medium</h4>
          <p className="text-sm text-gray-500 mt-1">Use for card titles and small headers</p>
        </div>
        <div>
          <p className="text-base text-gray-700">Body text - Regular weight for optimal readability</p>
          <p className="text-sm text-gray-500 mt-1">Use for main content and descriptions</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Small text - Medium weight for emphasis</p>
          <p className="text-sm text-gray-500 mt-1">Use for labels and captions</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Typography hierarchy ensures clear information architecture and improves readability across all devices.',
      },
    },
  },
}

export const Spacing = {
  render: () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Spacing Scale</h2>
      <p className="text-gray-600">
        Our spacing system is based on a consistent scale that creates harmonious layouts and predictable spacing.
      </p>
      
      <div className="space-y-4">
        {[
          { name: 'xs', value: '4px', class: 'w-1 h-4' },
          { name: 'sm', value: '8px', class: 'w-2 h-4' },
          { name: 'md', value: '16px', class: 'w-4 h-4' },
          { name: 'lg', value: '24px', class: 'w-6 h-4' },
          { name: 'xl', value: '32px', class: 'w-8 h-4' },
          { name: '2xl', value: '48px', class: 'w-12 h-4' },
          { name: '3xl', value: '64px', class: 'w-16 h-4' },
        ].map(({ name, value, class: className }) => (
          <div key={name} className="flex items-center space-x-4">
            <div className={`bg-primary-500 rounded ${className}`}></div>
            <div className="text-sm">
              <span className="font-medium">{name}:</span>
              <span className="text-gray-500 ml-2">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Consistent spacing creates visual rhythm and improves the overall user experience.',
      },
    },
  },
}

export const DesignPrinciples = {
  render: () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Design Principles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">1. Consistency</h3>
          <p className="text-gray-600">
            Every component follows the same design patterns, ensuring a cohesive user experience across all applications.
          </p>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">2. Accessibility</h3>
          <p className="text-gray-600">
            All components are built with accessibility in mind, following WCAG guidelines for color contrast, keyboard navigation, and screen reader support.
          </p>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">3. Scalability</h3>
          <p className="text-gray-600">
            Our design system grows with your needs. Components are modular and can be easily extended or customized.
          </p>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">4. Performance</h3>
          <p className="text-gray-600">
            Lightweight and optimized components ensure fast loading times and smooth interactions.
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Our design principles guide every decision in the design system, ensuring quality and consistency.',
      },
    },
  },
}

export const ComponentStatus = {
  render: () => (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Component Status</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Component
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documentation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Button</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Stable
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.0.0</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Complete</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Logo</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Stable
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.0.0</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Complete</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Input</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  🚧 In Development
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.1.0</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Partial</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Card</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  🚧 In Development
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.1.0</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Partial</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Modal</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  📋 Planned
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Track the development status of all components in the design system.',
      },
    },
  },
}
