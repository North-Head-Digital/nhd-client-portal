import type { Preview } from '@storybook/react-vite'
import '../src/index.css'
import '../src/styles/brand.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f7fafc',
        },
        {
          name: 'dark',
          value: '#1a202c',
        },
        {
          name: 'primary',
          value: '#667eea',
        },
        {
          name: 'secondary',
          value: '#764ba2',
        },
      ],
    },

    docs: {
      theme: {
        brandTitle: 'NHD Design System',
        brandUrl: 'https://northheaddigital.com',
        brandImage: 'https://northheaddigital.com/logo.png',
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;