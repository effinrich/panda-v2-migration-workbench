import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ARCHITECTURE_DIMENSIONS } from '../../../shared/data/comparison';
import { DEFAULT_WEIGHTS, calculateComparisonVerdict } from '../../../shared/utils/calculations';
import type { DecisionWeights } from '../../../shared/types/migration';
import { CompareView } from './compare-view';

const meta: Meta<typeof CompareView> = {
  title: 'Features/ArchitectureCompare/CompareView',
  component: CompareView,
  tags: ['autodocs'],
  args: {
    dimensions: ARCHITECTURE_DIMENSIONS,
    weights: DEFAULT_WEIGHTS,
    verdict: calculateComparisonVerdict(ARCHITECTURE_DIMENSIONS, DEFAULT_WEIGHTS),
    onUpdateWeights: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CompareView>;

export const InteractiveWeightingSimulator: Story = {
  render: (args) => {
    const [weights, setWeights] = useState<DecisionWeights>(args.weights);
    const verdict = useMemo(
      () => calculateComparisonVerdict(args.dimensions, weights),
      [args.dimensions, weights]
    );
    return (
      <CompareView
        {...args}
        weights={weights}
        verdict={verdict}
        onUpdateWeights={(patch) => {
          setWeights((prev) => ({ ...prev, ...patch }));
          args.onUpdateWeights(patch);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const bespokeBtn = canvas.getByRole('button', { name: 'Bespoke Brand' });
    await userEvent.click(bespokeBtn);
    await expect(args.onUpdateWeights).toHaveBeenCalled();
    await expect(
      canvas.getByRole('heading', { name: /Build Greenfield on Ark UI \+ Panda v2/i })
    ).toBeInTheDocument();

    const shipFastBtn = canvas.getByRole('button', { name: 'Ship Fast' });
    await userEvent.click(shipFastBtn);
    await expect(canvas.getByText(/Time to 40 Production Components/i)).toBeInTheDocument();
  },
};
