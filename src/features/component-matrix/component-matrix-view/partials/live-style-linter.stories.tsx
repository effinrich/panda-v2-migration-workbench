import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LiveStyleLinter } from './live-style-linter';

const meta: Meta<typeof LiveStyleLinter> = {
  title: 'Features/ComponentMatrix/LiveStyleLinter',
  component: LiveStyleLinter,
  tags: ['autodocs'],
  args: {
    onNotify: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof LiveStyleLinter>;

export const DetectAndResolveInlineStyles: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getAllByText(/react\/forbid-dom-props \(no-inline-style\)/i).length
    ).toBeGreaterThan(0);

    const compliantBtn = canvas.getByRole('button', {
      name: /Compliant Progress \(Panda v2 \+ data-\*\)/i,
    });
    await userEvent.click(compliantBtn);

    await expect(canvas.getByText(/Zero Inline-Style & Panda v2 Violations/i)).toBeInTheDocument();

    const editor = canvas.getByLabelText(/Design System Component Source \(TSX\)/i);
    await userEvent.type(editor, '\n<div style={{ color: "red" }} />');
    await expect(
      canvas.getByText(/Forbidden inline style attribute detected in JSX/i)
    ).toBeInTheDocument();
  },
};
