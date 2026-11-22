import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { BarMeter } from './bar-meter';

const meta: Meta<typeof BarMeter> = {
  title: 'Shared/UI/BarMeter',
  component: BarMeter,
  tags: ['autodocs'],
  args: {
    value: 68,
    max: 100,
    tone: 'emerald',
    label: 'Migration completion progress',
  },
};

export default meta;
type Story = StoryObj<typeof BarMeter>;

export const EmeraldProgress: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', {
      name: 'Migration completion progress',
    });
    await expect(bar).toHaveAttribute('value', '68');
    await expect(bar).toHaveAttribute('max', '100');
    await expect(bar).toHaveAttribute('data-tone', 'emerald');
    await expect(bar.getAttribute('style')).toBeNull();
  },
};

export const ClampedOverflowAmber: Story = {
  args: {
    value: 145,
    max: 100,
    tone: 'amber',
    label: 'Lint audit budget',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', { name: 'Lint audit budget' });
    await expect(bar).toHaveAttribute('value', '100');
    await expect(bar).toHaveAttribute('data-tone', 'amber');
  },
};

export const CriticalZeroCrimson: Story = {
  args: {
    value: -10,
    max: 100,
    tone: 'crimson',
    label: 'Critical risk indicator',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', {
      name: 'Critical risk indicator',
    });
    await expect(bar).toHaveAttribute('value', '0');
    await expect(bar).toHaveAttribute('data-tone', 'crimson');
  },
};
