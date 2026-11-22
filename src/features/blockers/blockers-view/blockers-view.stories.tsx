import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { BlockersView } from './blockers-view';

const meta: Meta<typeof BlockersView> = {
  title: 'Features/Blockers/BlockersView',
  component: BlockersView,
  tags: ['autodocs'],
  args: {
    mitigatedBlockers: [],
    onToggleMitigated: fn(),
    onNotify: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof BlockersView>;

export const FilterAndMitigateBlockers: Story = {
  render: (args) => {
    const [mitigated, setMitigated] = useState<string[]>(args.mitigatedBlockers);
    return (
      <BlockersView
        {...args}
        mitigatedBlockers={mitigated}
        onToggleMitigated={(id) => {
          setMitigated((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          );
          args.onToggleMitigated(id);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const styleLintBtn = canvas.getByRole('button', { name: 'Style Lint' });
    await userEvent.click(styleLintBtn);
    await expect(
      canvas.getByRole('heading', {
        name: /Zero-Inline-Style Lint Gate & JSX Wrapper Hygiene/i,
      })
    ).toBeInTheDocument();

    const mitigateBtn = canvas.getByRole('button', { name: 'Mark Mitigated' });
    await userEvent.click(mitigateBtn);
    await expect(args.onToggleMitigated).toHaveBeenCalledWith('zero-inline-style-lint-gate');
    await expect(canvas.getByRole('button', { name: 'Marked Mitigated' })).toBeInTheDocument();

    const stackedBtn = canvas.getByRole('button', { name: 'Stacked Diff' });
    await userEvent.click(stackedBtn);
    await expect(canvas.getByText(/1 of 7 mitigated/i)).toBeInTheDocument();
  },
};
