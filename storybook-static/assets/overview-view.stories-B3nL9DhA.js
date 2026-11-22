import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./runtime-BBgY7aNO.js";import{m as r}from"./iframe-DEKJoWpi.js";import{n as i,t as a}from"./overview-view-CSdKsfd-.js";import{r as o,t as s}from"./components-DZNIQZzm.js";import{i as c,o as l,t as u}from"./calculations-Do3BhYo8.js";import{t as d}from"./jsx-dev-runtime-_DJwwTqc.js";var f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),f=r(),o(),l(),i(),p=d(),t(),{expect:m,fn:h,userEvent:g,within:_}=__STORYBOOK_MODULE_TEST__,v=`/app/applet/src/features/overview/overview-view/overview-view.stories.tsx`,y={title:`Features/Overview/OverviewView`,component:a,tags:[`autodocs`],args:{scope:u,effort:c(u,s),mitigatedCount:2,totalBlockers:7,migratedCount:12,totalComponents:s.length,onUpdateScope:h(),onNavigate:h()}},b={render:e=>{let[t,n]=(0,f.useState)(e.scope),r=(0,f.useMemo)(()=>c(t,s),[t]);return(0,p.jsxDEV)(a,{...e,scope:t,effort:r,onUpdateScope:t=>{n(e=>({...e,...t})),e.onUpdateScope(t)}},void 0,!1,{fileName:v,lineNumber:33,columnNumber:7},void 0)},play:async({canvasElement:e,args:t})=>{let n=_(e);await m(n.getByText(/Branching Park UI to Panda v2 is/i)).toBeInTheDocument();let r=n.getByRole(`button`,{name:`2 Engineers`});await g.click(r),await m(t.onUpdateScope).toHaveBeenCalledWith({teamSize:2});let i=n.getByRole(`switch`,{name:/Multi-Package Monorepo Lockstep/i});await g.click(i),await m(i).toHaveAttribute(`aria-checked`,`true`);let a=n.getByRole(`button`,{name:/Inspect 7 Blockers/i});await g.click(a),await m(t.onNavigate).toHaveBeenCalledWith(`blockers`)}},x=[`InteractiveScopeModeling`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: (args) => {
    const [scope, setScope] = useState<ForkScopeConfig>(args.scope);
    const effort = useMemo(() => calculateEffortSummary(scope, COMPONENT_AUDIT_INVENTORY), [scope]);
    return (
      <OverviewView
        {...args}
        scope={scope}
        effort={effort}
        onUpdateScope={(patch) => {
          setScope((prev) => ({ ...prev, ...patch }));
          args.onUpdateScope(patch);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Branching Park UI to Panda v2 is/i)).toBeInTheDocument();

    const twoEngineersBtn = canvas.getByRole('button', { name: '2 Engineers' });
    await userEvent.click(twoEngineersBtn);
    await expect(args.onUpdateScope).toHaveBeenCalledWith({ teamSize: 2 });

    const monorepoToggle = canvas.getByRole('switch', {
      name: /Multi-Package Monorepo Lockstep/i,
    });
    await userEvent.click(monorepoToggle);
    await expect(monorepoToggle).toHaveAttribute('aria-checked', 'true');

    const blockersBtn = canvas.getByRole('button', {
      name: /Inspect 7 Blockers/i,
    });
    await userEvent.click(blockersBtn);
    await expect(args.onNavigate).toHaveBeenCalledWith('blockers');
  },
}`,...b.parameters?.docs?.source}}}})))()}S();export{b as InteractiveScopeModeling,x as __namedExportsOrder,y as default};