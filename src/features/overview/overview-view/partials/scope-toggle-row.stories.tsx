import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ScopeToggleRow } from './scope-toggle-row';

const meta: Meta<typeof ScopeToggleRow> = {
  title: 'Features/Overview/ScopeToggleRow',
  component: ScopeToggleRow,
  tags: ['autodocs'],
  args: {
    id: 'story-toggle-lint',
    label: 'Strict Zero-Inline-Style Lint Gate',
    description:
      'Ban style={...} via Oxlint/ESLint + Omit<..., "style">; data-* attrs or JSX wrappers only.',
    checked: true,
    impactLabel: 'Enforced',
    onToggle: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ScopeToggleRow>;

export const InteractiveToggle: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return (
      <div className="max-w-lg border border-[#222B36] bg-[#11161D]">
        <ScopeToggleRow
          {...args}
          checked={checked}
          impactLabel={checked ? 'Enforced' : 'Off'}
          onToggle={() => {
            setChecked((prev) => !prev);
            args.onToggle();
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', {
      name: /Strict Zero-Inline-Style Lint Gate/i,
    });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await expect(args.onToggle).toHaveBeenCalledTimes(1);
    await expect(canvas.getByText('Off')).toBeInTheDocument();
  },
};
