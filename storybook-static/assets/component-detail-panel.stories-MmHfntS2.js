import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./runtime-BBgY7aNO.js";import{m as r}from"./iframe-DEKJoWpi.js";import{r as i,t as a}from"./components-DZNIQZzm.js";import{t as o}from"./jsx-dev-runtime-_DJwwTqc.js";import{n as s,t as c}from"./component-detail-panel-BG_iN0Rw.js";var l,u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{n(),l=r(),i(),s(),u=o(),t(),{expect:d,fn:f,userEvent:p,within:m}=__STORYBOOK_MODULE_TEST__,h=`/app/applet/src/features/component-matrix/component-matrix-view/partials/component-detail-panel.stories.tsx`,g=a.find(e=>e.id===`select`)??a[0],_={title:`Features/ComponentMatrix/ComponentDetailPanel`,component:c,tags:[`autodocs`],args:{component:g,isMigrated:!1,enforceNoInlineStyle:!0,onToggleMigrated:f()}},v={render:e=>{let[t,n]=(0,l.useState)(e.isMigrated);return(0,u.jsxDEV)(`div`,{className:`max-w-md`,children:(0,u.jsxDEV)(c,{...e,isMigrated:t,onToggleMigrated:t=>{n(e=>!e),e.onToggleMigrated(t)}},void 0,!1,{fileName:h,lineNumber:30,columnNumber:9},void 0)},void 0,!1,{fileName:h,lineNumber:29,columnNumber:7},void 0)},play:async({canvasElement:e,args:t})=>{let n=m(e);await d(n.getByRole(`heading`,{name:`Select`})).toBeInTheDocument(),await d(n.getByText(/--reference-width/i)).toBeInTheDocument();let r=n.getByRole(`button`,{name:`Mark Verified`});await p.click(r),await d(t.onToggleMigrated).toHaveBeenCalledWith(`select`),await d(n.getByRole(`button`,{name:`Verified Migrated`})).toBeInTheDocument()}},y=[`DynamicVarsAuditPanel`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}}})))()}b();export{v as DynamicVarsAuditPanel,y as __namedExportsOrder,_ as default};