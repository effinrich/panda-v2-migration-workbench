import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./runtime-BBgY7aNO.js";import{m as r}from"./iframe-DEKJoWpi.js";import{t as i}from"./jsx-dev-runtime-_DJwwTqc.js";import{n as a,t as o}from"./blockers-view-CNQvgFCu.js";var s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),s=r(),a(),c=i(),t(),{expect:l,fn:u,userEvent:d,within:f}=__STORYBOOK_MODULE_TEST__,p=`/app/applet/src/features/blockers/blockers-view/blockers-view.stories.tsx`,m={title:`Features/Blockers/BlockersView`,component:o,tags:[`autodocs`],args:{mitigatedBlockers:[],onToggleMitigated:u(),onNotify:u()}},h={render:e=>{let[t,n]=(0,s.useState)(e.mitigatedBlockers);return(0,c.jsxDEV)(o,{...e,mitigatedBlockers:t,onToggleMitigated:t=>{n(e=>e.includes(t)?e.filter(e=>e!==t):[...e,t]),e.onToggleMitigated(t)}},void 0,!1,{fileName:p,lineNumber:24,columnNumber:7},void 0)},play:async({canvasElement:e,args:t})=>{let n=f(e),r=n.getByRole(`button`,{name:`Style Lint`});await d.click(r),await l(n.getByRole(`heading`,{name:/Zero-Inline-Style Lint Gate & JSX Wrapper Hygiene/i})).toBeInTheDocument();let i=n.getByRole(`button`,{name:`Mark Mitigated`});await d.click(i),await l(t.onToggleMitigated).toHaveBeenCalledWith(`zero-inline-style-lint-gate`),await l(n.getByRole(`button`,{name:`Marked Mitigated`})).toBeInTheDocument();let a=n.getByRole(`button`,{name:`Stacked Diff`});await d.click(a),await l(n.getByText(/1 of 7 mitigated/i)).toBeInTheDocument()}},g=[`FilterAndMitigateBlockers`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: (args) => {
    const [mitigated, setMitigated] = useState<string[]>(args.mitigatedBlockers);
    return (
      <BlockersView
        {...args}
        mitigatedBlockers={mitigated}
        onToggleMitigated={(id) => {
          setMitigated((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          );
          args.onToggleMitigated(id);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const styleLintBtn = canvas.getByRole('button', { name: 'Style Lint' });
    await userEvent.click(styleLintBtn);
    await expect(
      canvas.getByRole('heading', {
        name: /Zero-Inline-Style Lint Gate & JSX Wrapper Hygiene/i,
      })
    ).toBeInTheDocument();

    const mitigateBtn = canvas.getByRole('button', { name: 'Mark Mitigated' });
    await userEvent.click(mitigateBtn);
    await expect(args.onToggleMitigated).toHaveBeenCalledWith('zero-inline-style-lint-gate');
    await expect(canvas.getByRole('button', { name: 'Marked Mitigated' })).toBeInTheDocument();

    const stackedBtn = canvas.getByRole('button', { name: 'Stacked Diff' });
    await userEvent.click(stackedBtn);
    await expect(canvas.getByText(/1 of 7 mitigated/i)).toBeInTheDocument();
  },
}`,...h.parameters?.docs?.source}}}})))()}_();export{h as FilterAndMitigateBlockers,g as __namedExportsOrder,m as default};