import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./runtime-BBgY7aNO.js";import{n as r,t as i}from"./live-style-linter-v2pYFzuD.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r(),t(),{expect:a,fn:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Features/ComponentMatrix/LiveStyleLinter`,component:i,tags:[`autodocs`],args:{onNotify:o()}},u={play:async({canvasElement:e})=>{let t=c(e);await a(t.getAllByText(/react\/forbid-dom-props \(no-inline-style\)/i).length).toBeGreaterThan(0);let n=t.getByRole(`button`,{name:/Compliant Progress \(Panda v2 \+ data-\*\)/i});await s.click(n),await a(t.getByText(/Zero Inline-Style & Panda v2 Violations/i)).toBeInTheDocument();let r=t.getByLabelText(/Design System Component Source \(TSX\)/i);await s.type(r,`
<div style={{ color: "red" }} />`),await a(t.getByText(/Forbidden inline style attribute detected in JSX/i)).toBeInTheDocument()}},d=[`DetectAndResolveInlineStyles`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getAllByText(/react\\/forbid-dom-props \\(no-inline-style\\)/i).length
    ).toBeGreaterThan(0);

    const compliantBtn = canvas.getByRole('button', {
      name: /Compliant Progress \\(Panda v2 \\+ data-\\*\\)/i,
    });
    await userEvent.click(compliantBtn);

    await expect(canvas.getByText(/Zero Inline-Style & Panda v2 Violations/i)).toBeInTheDocument();

    const editor = canvas.getByLabelText(/Design System Component Source \\(TSX\\)/i);
    await userEvent.type(editor, '\\n<div style={{ color: "red" }} />');
    await expect(
      canvas.getByText(/Forbidden inline style attribute detected in JSX/i)
    ).toBeInTheDocument();
  },
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as DetectAndResolveInlineStyles,d as __namedExportsOrder,l as default};