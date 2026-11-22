import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./runtime-BBgY7aNO.js";import{m as r}from"./iframe-DEKJoWpi.js";import{t as i}from"./jsx-dev-runtime-_DJwwTqc.js";import{n as a,t as o}from"./scope-toggle-row-DVRmvBUC.js";var s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),s=r(),a(),c=i(),t(),{expect:l,fn:u,userEvent:d,within:f}=__STORYBOOK_MODULE_TEST__,p=`/app/applet/src/features/overview/overview-view/partials/scope-toggle-row.stories.tsx`,m={title:`Features/Overview/ScopeToggleRow`,component:o,tags:[`autodocs`],args:{id:`story-toggle-lint`,label:`Strict Zero-Inline-Style Lint Gate`,description:`Ban style={...} via Oxlint/ESLint + Omit<..., "style">; data-* attrs or JSX wrappers only.`,checked:!0,impactLabel:`Enforced`,onToggle:u()}},h={render:e=>{let[t,n]=(0,s.useState)(e.checked);return(0,c.jsxDEV)(`div`,{className:`max-w-lg border border-[#222B36] bg-[#11161D]`,children:(0,c.jsxDEV)(o,{...e,checked:t,impactLabel:t?`Enforced`:`Off`,onToggle:()=>{n(e=>!e),e.onToggle()}},void 0,!1,{fileName:p,lineNumber:29,columnNumber:9},void 0)},void 0,!1,{fileName:p,lineNumber:28,columnNumber:7},void 0)},play:async({canvasElement:e,args:t})=>{let n=f(e),r=n.getByRole(`switch`,{name:/Strict Zero-Inline-Style Lint Gate/i});await l(r).toHaveAttribute(`aria-checked`,`true`),await d.click(r),await l(r).toHaveAttribute(`aria-checked`,`false`),await l(t.onToggle).toHaveBeenCalledTimes(1),await l(n.getByText(`Off`)).toBeInTheDocument()}},g=[`InteractiveToggle`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return (
      <div className="max-w-lg border border-[#222B36] bg-[#11161D]">
        <ScopeToggleRow
          {...args}
          checked={checked}
          impactLabel={checked ? 'Enforced' : 'Off'}
          onToggle={() => {
            setChecked((prev) => !prev);
            args.onToggle();
          }}
        />
      </div>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', {
      name: /Strict Zero-Inline-Style Lint Gate/i,
    });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await expect(args.onToggle).toHaveBeenCalledTimes(1);
    await expect(canvas.getByText('Off')).toBeInTheDocument();
  },
}`,...h.parameters?.docs?.source}}}})))()}_();export{h as InteractiveToggle,g as __namedExportsOrder,m as default};