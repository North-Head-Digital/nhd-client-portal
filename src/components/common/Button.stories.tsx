import type { Meta, StoryObj } from '@storybook/react'
import { Search, Download, Plus, Trash2, ArrowRight } from 'lucide-react'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants, sizes, and states. Follows the NHD design system with consistent styling and behavior.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows a loading spinner',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the button',
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Position of the icon relative to text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'The primary button style with gradient background. Use for main actions and CTAs.',
      },
    },
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'The secondary button style with subtle background. Use for secondary actions.',
      },
    },
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'The ghost button style with transparent background. Use for subtle actions.',
      },
    },
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
  parameters: {
    docs: {
      description: {
        story: 'The danger button style for destructive actions like delete or remove.',
      },
    },
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        <Button variant="primary" icon={<Search className="h-4 w-4" />} iconPosition="left">
          Search
        </Button>
        <Button variant="secondary" icon={<Download className="h-4 w-4" />} iconPosition="left">
          Download
        </Button>
        <Button variant="ghost" icon={<Plus className="h-4 w-4" />} iconPosition="left">
          Add Item
        </Button>
      </div>
      <div className="flex space-x-4">
        <Button variant="primary" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
          Continue
        </Button>
        <Button variant="danger" icon={<Trash2 className="h-4 w-4" />} iconPosition="left">
          Delete
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons positioned on the left or right. Icons help clarify the button action.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="secondary" size="sm">Small</Button>
        <Button variant="secondary" size="md">Medium</Button>
        <Button variant="secondary" size="lg">Large</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes. Choose the appropriate size based on your layout hierarchy.',
      },
    },
  },
}

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button in loading state with spinner. Automatically disables interaction.',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled button state. Use when the action is not available.',
      },
    },
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants displayed together for easy comparison.',
      },
    },
  },
}

export const Interactive: Story = {
  args: {
    variant: 'primary',
    children: 'Click me!',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive button example. Try clicking it!',
      },
    },
  },
}
