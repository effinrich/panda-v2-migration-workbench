import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { COMPONENT_AUDIT_INVENTORY } from '../../../shared/data/components';
import { DEFAULT_SCOPE, calculateEffortSummary } from '../../../shared/utils/calculations';
import type { ForkScopeConfig } from '../../../shared/types/migration';
import { OverviewView } from './overview-view';

const meta: Meta<typeof OverviewView> = {
  title: 'Features/Overview/OverviewView',
  component: OverviewView,
  tags: ['autodocs'],
  args: {
    scope: DEFAULT_SCOPE,
    effort: calculateEffortSummary(DEFAULT_SCOPE, COMPONENT_AUDIT_INVENTORY),
    mitigatedCount: 2,
    totalBlockers: 7,
    migratedCount: 12,
    totalComponents: COMPONENT_AUDIT_INVENTORY.length,
    onUpdateScope: fn(),
    onNavigate: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OverviewView>;

export const InteractiveScopeModeling: Story = {
  render: (args) => {
    const [scope, setScope] = useState<ForkScopeConfig>(args.scope);
    const effort = useMemo(() => calculateEffortSummary(scope, COMPONENT_AUDIT_INVENTORY), [scope]);
    return (
      <OverviewView
        {...args}
        scope={scope}
        effort={effort}
        onUpdateScope={(patch) => {
          setScope((prev) => ({ ...prev, ...patch }));
          args.onUpdateScope(patch);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Branching Park UI to Panda v2 is/i)).toBeInTheDocument();

    const twoEngineersBtn = canvas.getByRole('button', { name: '2 Engineers' });
    await userEvent.click(twoEngineersBtn);
    await expect(args.onUpdateScope).toHaveBeenCalledWith({ teamSize: 2 });

    const monorepoToggle = canvas.getByRole('switch', {
      name: /Multi-Package Monorepo Lockstep/i,
    });
    await userEvent.click(monorepoToggle);
    await expect(monorepoToggle).toHaveAttribute('aria-checked', 'true');

    const blockersBtn = canvas.getByRole('button', {
      name: /Inspect 7 Blockers/i,
    });
    await userEvent.click(blockersBtn);
    await expect(args.onNavigate).toHaveBeenCalledWith('blockers');
  },
};
