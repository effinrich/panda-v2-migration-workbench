import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./runtime-BBgY7aNO.js";import{m as r}from"./iframe-DEKJoWpi.js";import{n as i,t as a}from"./component-matrix-view-DDVqZuAg.js";import{t as o}from"./jsx-dev-runtime-_DJwwTqc.js";var s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{n(),s=r(),i(),c=o(),t(),{expect:l,fn:u,userEvent:d,within:f}=__STORYBOOK_MODULE_TEST__,p=`/app/applet/src/features/component-matrix/component-matrix-view/component-matrix-view.stories.tsx`,m={title:`Features/ComponentMatrix/ComponentMatrixView`,component:a,tags:[`autodocs`],args:{migratedComponents:[],enforceNoInlineStyle:!0,onToggleMigrated:u(),onBulkToggleCategory:u(),onNotify:u()}},h={render:e=>{let[t,n]=(0,s.useState)(e.migratedComponents);return(0,c.jsxDEV)(a,{...e,migratedComponents:t,onToggleMigrated:t=>{n(e=>e.includes(t)?e.filter(e=>e!==t):[...e,t]),e.onToggleMigrated(t)},onBulkToggleCategory:(t,r)=>{n(e=>{let n=new Set(e);for(let e of t)r?n.add(e):n.delete(e);return Array.from(n)}),e.onBulkToggleCategory(t,r)}},void 0,!1,{fileName:p,lineNumber:26,columnNumber:7},void 0)},play:async({canvasElement:e,args:t})=>{let n=f(e),r=n.getByLabelText(`Search components`);await d.type(r,`DatePicker`),await l(n.getByText(`DatePicker`)).toBeInTheDocument();let i=n.getByLabelText(`Mark DatePicker as migrated`);await d.click(i),await l(t.onToggleMigrated).toHaveBeenCalledWith(`date-picker`);let a=n.getByRole(`tab`,{name:/Live JSX Style-Attribute Linter/i});await d.click(a),await l(n.getByText(/Lint & Policy Diagnostics/i)).toBeInTheDocument()}},g=[`SearchFilterAndSwitchToLinter`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}}})))()}_();export{h as SearchFilterAndSwitchToLinter,g as __namedExportsOrder,m as default};