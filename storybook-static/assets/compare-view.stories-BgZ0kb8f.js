import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./runtime-BBgY7aNO.js";import{m as r}from"./iframe-DEKJoWpi.js";import{c as i,d as a,n as o,o as s,r as c}from"./calculations-Do3BhYo8.js";import{t as l}from"./jsx-dev-runtime-_DJwwTqc.js";import{n as u,t as d}from"./compare-view-CmiC8ykQ.js";var f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),f=r(),a(),s(),u(),p=l(),t(),{expect:m,fn:h,userEvent:g,within:_}=__STORYBOOK_MODULE_TEST__,v=`/app/applet/src/features/architecture-compare/compare-view/compare-view.stories.tsx`,y={title:`Features/ArchitectureCompare/CompareView`,component:d,tags:[`autodocs`],args:{dimensions:i,weights:o,verdict:c(i,o),onUpdateWeights:h()}},b={render:e=>{let[t,n]=(0,f.useState)(e.weights),r=(0,f.useMemo)(()=>c(e.dimensions,t),[e.dimensions,t]);return(0,p.jsxDEV)(d,{...e,weights:t,verdict:r,onUpdateWeights:t=>{n(e=>({...e,...t})),e.onUpdateWeights(t)}},void 0,!1,{fileName:v,lineNumber:32,columnNumber:7},void 0)},play:async({canvasElement:e,args:t})=>{let n=_(e),r=n.getByRole(`button`,{name:`Bespoke Brand`});await g.click(r),await m(t.onUpdateWeights).toHaveBeenCalled(),await m(n.getByRole(`heading`,{name:/Build Greenfield on Ark UI \+ Panda v2/i})).toBeInTheDocument();let i=n.getByRole(`button`,{name:`Ship Fast`});await g.click(i),await m(n.getByText(/Time to 40 Production Components/i)).toBeInTheDocument()}},x=[`InteractiveWeightingSimulator`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: (args) => {
    const [weights, setWeights] = useState<DecisionWeights>(args.weights);
    const verdict = useMemo(
      () => calculateComparisonVerdict(args.dimensions, weights),
      [args.dimensions, weights]
    );
    return (
      <CompareView
        {...args}
        weights={weights}
        verdict={verdict}
        onUpdateWeights={(patch) => {
          setWeights((prev) => ({ ...prev, ...patch }));
          args.onUpdateWeights(patch);
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const bespokeBtn = canvas.getByRole('button', { name: 'Bespoke Brand' });
    await userEvent.click(bespokeBtn);
    await expect(args.onUpdateWeights).toHaveBeenCalled();
    await expect(
      canvas.getByRole('heading', { name: /Build Greenfield on Ark UI \\+ Panda v2/i })
    ).toBeInTheDocument();

    const shipFastBtn = canvas.getByRole('button', { name: 'Ship Fast' });
    await userEvent.click(shipFastBtn);
    await expect(canvas.getByText(/Time to 40 Production Components/i)).toBeInTheDocument();
  },
}`,...b.parameters?.docs?.source}}}})))()}S();export{b as InteractiveWeightingSimulator,x as __namedExportsOrder,y as default};