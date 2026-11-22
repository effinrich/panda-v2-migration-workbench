import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ComponentMatrixView } from './component-matrix-view';

const meta: Meta<typeof ComponentMatrixView> = {
  title: 'Features/ComponentMatrix/ComponentMatrixView',
  component: ComponentMatrixView,
  tags: ['autodocs'],
  args: {
    migratedComponents: [],
    enforceNoInlineStyle: true,
    onToggleMigrated: fn(),
    onBulkToggleCategory: fn(),
    onNotify: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ComponentMatrixView>;

export const SearchFilterAndSwitchToLinter: Story = {
  render: (args) => {
    const [migrated, setMigrated] = useState<string[]>(args.migratedComponents);
    return (
      <ComponentMatrixView
        {...args}
        migratedComponents={migrated}
        onToggleMigrated={(id) => {
          setMigrated((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          );
          args.onToggleMigrated(id);
        }}
        onBulkToggleCategory={(ids, markDone) => {
          setMigrated((prev) => {
            const set = new Set(prev);
            for (const id of ids) {
              if (markDone) set.add(id);
              else set.delete(id);
            }
            return Array.from(set);
          });
          args.onBulkToggleCategory(ids, markDone);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const searchInput = canvas.getByLabelText('Search components');
    await userEvent.type(searchInput, 'DatePicker');
    await expect(canvas.getByText('DatePicker')).toBeInTheDocument();

    const checkBtn = canvas.getByLabelText('Mark DatePicker as migrated');
    await userEvent.click(checkBtn);
    await expect(args.onToggleMigrated).toHaveBeenCalledWith('date-picker');

    const linterTab = canvas.getByRole('tab', {
      name: /Live JSX Style-Attribute Linter/i,
    });
    await userEvent.click(linterTab);
    await expect(canvas.getByText(/Lint & Policy Diagnostics/i)).toBeInTheDocument();
  },
};
