import type { Meta, StoryObj } from '@storybook/react'
import NHDLogo from './NHDLogo'

const meta: Meta<typeof NHDLogo> = {
  title: 'Components/Common/NHDLogo',
  component: NHDLogo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The North Head Digital logo component with multiple variants and sizes. This component represents our brand identity and should be used consistently across the application.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['horizontal', 'stacked', 'symbol'],
      description: 'The visual layout of the logo',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the logo',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    variant: 'horizontal',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'The default horizontal layout with the symbol, "North Head", and "Digital" text in a row.',
      },
    },
  },
}

export const Stacked: Story = {
  args: {
    variant: 'stacked',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'A vertical layout with the symbol on top and text below, perfect for square or compact spaces.',
      },
    },
  },
}

export const Symbol: Story = {
  args: {
    variant: 'symbol',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Just the diamond symbol without text, ideal for favicons, small spaces, or as a watermark.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <NHDLogo variant="horizontal" size="sm" />
        <p className="text-sm text-gray-500 mt-2">Small (sm)</p>
      </div>
      <div className="text-center">
        <NHDLogo variant="horizontal" size="md" />
        <p className="text-sm text-gray-500 mt-2">Medium (md)</p>
      </div>
      <div className="text-center">
        <NHDLogo variant="horizontal" size="lg" />
        <p className="text-sm text-gray-500 mt-2">Large (lg)</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available sizes. Choose the appropriate size based on your layout and context.',
      },
    },
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center">
        <NHDLogo variant="horizontal" size="md" />
        <p className="text-sm text-gray-500 mt-2">Horizontal</p>
      </div>
      <div className="text-center">
        <NHDLogo variant="stacked" size="md" />
        <p className="text-sm text-gray-500 mt-2">Stacked</p>
      </div>
      <div className="text-center">
        <NHDLogo variant="symbol" size="md" />
        <p className="text-sm text-gray-500 mt-2">Symbol Only</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All logo variants displayed together. Each variant serves a different purpose in the design system.',
      },
    },
  },
}

export const WithCustomStyling: Story = {
  args: {
    variant: 'horizontal',
    size: 'md',
    className: 'p-4 bg-gray-100 rounded-lg shadow-md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of the logo with custom styling applied through the className prop.',
      },
    },
  },
}

export const DarkBackground: Story = {
  args: {
    variant: 'horizontal',
    size: 'md',
    className: 'p-4 bg-gray-800 rounded-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'The logo on a dark background. The text colors automatically adjust for contrast.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
}
