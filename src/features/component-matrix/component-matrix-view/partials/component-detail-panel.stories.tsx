import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { COMPONENT_AUDIT_INVENTORY } from '../../../../shared/data/components';
import { ComponentDetailPanel } from './component-detail-panel';

const selectComponent =
  COMPONENT_AUDIT_INVENTORY.find((c) => c.id === 'select') ?? COMPONENT_AUDIT_INVENTORY[0];

const meta: Meta<typeof ComponentDetailPanel> = {
  title: 'Features/ComponentMatrix/ComponentDetailPanel',
  component: ComponentDetailPanel,
  tags: ['autodocs'],
  args: {
    component: selectComponent,
    isMigrated: false,
    enforceNoInlineStyle: true,
    onToggleMigrated: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ComponentDetailPanel>;

export const DynamicVarsAuditPanel: Story = {
  render: (args) => {
    const [migrated, setMigrated] = useState(args.isMigrated);
    return (
      <div className="max-w-md">
        <ComponentDetailPanel
          {...args}
          isMigrated={migrated}
          onToggleMigrated={(id) => {
            setMigrated((prev) => !prev);
            args.onToggleMigrated(id);
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Select' })).toBeInTheDocument();
    await expect(canvas.getByText(/--reference-width/i)).toBeInTheDocument();

    const verifyBtn = canvas.getByRole('button', { name: 'Mark Verified' });
    await userEvent.click(verifyBtn);
    await expect(args.onToggleMigrated).toHaveBeenCalledWith('select');
    await expect(canvas.getByRole('button', { name: 'Verified Migrated' })).toBeInTheDocument();
  },
};
