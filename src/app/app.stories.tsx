import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import App from './app';

const meta: Meta<typeof App> = {
  title: 'App/MigrationWorkbench',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof App>;

export const EndToEndWorkstationNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/Branching Park UI to Panda v2 is/i)).toBeInTheDocument();

    const blockersNav = canvas.getByRole('button', { name: /Blockers & Code Diffs/i });
    await userEvent.click(blockersNav);
    await expect(
      canvas.getByRole('heading', { name: /Breaking-Change Blockers & Code Diffs/i })
    ).toBeInTheDocument();

    const matrixNav = canvas.getByRole('button', { name: /Component Audit & Linter/i });
    await userEvent.click(matrixNav);
    await expect(
      canvas.getByRole('heading', { name: /42-Component Audit Matrix & Style-Attribute Linter/i })
    ).toBeInTheDocument();

    const exportBtn = canvas.getByRole('button', { name: /Export Brief/i });
    await userEvent.click(exportBtn);
    await expect(
      canvas.getByRole('heading', { name: /Architecture Decision Brief \(Markdown RFC\)/i })
    ).toBeInTheDocument();

    const closeBtn = canvas.getByRole('button', { name: 'Close' });
    await userEvent.click(closeBtn);
  },
};
