import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./runtime-BBgY7aNO.js";import{n as r,t as i}from"./export-brief-modal-BMyApUuH.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r(),t(),{expect:a,fn:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Features/BriefExport/ExportBriefModal`,component:i,tags:[`autodocs`],args:{markdown:`# Architecture Brief: Park UI Fork (Panda v2) vs. Greenfield Ark UI + Panda v2

## 1. Executive Verdict
- **Target Scope**: 42 React components
- **Migration Difficulty**: Moderate (~32h / 5 days)
- **Style Policy**: Zero inline style attributes enforced via Oxlint/ESLint`,onClose:o(),onNotify:o()}},u={play:async({canvasElement:e,args:t})=>{let n=c(e),r=n.getByRole(`dialog`);await a(r).toBeInTheDocument(),await a(n.getByText(/Architecture Decision Brief \(Markdown RFC\)/i)).toBeInTheDocument();let i=n.getByRole(`button`,{name:`Close`});await s.click(i),await a(t.onClose).toHaveBeenCalledTimes(1)}},d=[`PreviewAndCloseDialog`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog');
    await expect(dialog).toBeInTheDocument();
    await expect(
      canvas.getByText(/Architecture Decision Brief \\(Markdown RFC\\)/i)
    ).toBeInTheDocument();

    const closeBtn = canvas.getByRole('button', { name: 'Close' });
    await userEvent.click(closeBtn);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as PreviewAndCloseDialog,d as __namedExportsOrder,l as default};