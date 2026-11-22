import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ExportBriefModal } from './export-brief-modal';

const SAMPLE_MARKDOWN = `# Architecture Brief: Park UI Fork (Panda v2) vs. Greenfield Ark UI + Panda v2

## 1. Executive Verdict
- **Target Scope**: 42 React components
- **Migration Difficulty**: Moderate (~32h / 5 days)
- **Style Policy**: Zero inline style attributes enforced via Oxlint/ESLint`;

const meta: Meta<typeof ExportBriefModal> = {
  title: 'Features/BriefExport/ExportBriefModal',
  component: ExportBriefModal,
  tags: ['autodocs'],
  args: {
    markdown: SAMPLE_MARKDOWN,
    onClose: fn(),
    onNotify: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ExportBriefModal>;

export const PreviewAndCloseDialog: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');
    await expect(dialog).toBeInTheDocument();
    await expect(
      canvas.getByText(/Architecture Decision Brief \(Markdown RFC\)/i)
    ).toBeInTheDocument();

    const closeBtn = canvas.getByRole('button', { name: 'Close' });
    await userEvent.click(closeBtn);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
