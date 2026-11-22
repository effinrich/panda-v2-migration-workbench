import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,t as n}from"./runtime-BBgY7aNO.js";import{n as r,t as i}from"./bar-meter-8qtzCLPZ.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r(),t(),{expect:a,within:o}=__STORYBOOK_MODULE_TEST__,s={title:`Shared/UI/BarMeter`,component:i,tags:[`autodocs`],args:{value:68,max:100,tone:`emerald`,label:`Migration completion progress`}},c={play:async({canvasElement:e})=>{let t=o(e).getByRole(`progressbar`,{name:`Migration completion progress`});await a(t).toHaveAttribute(`value`,`68`),await a(t).toHaveAttribute(`max`,`100`),await a(t).toHaveAttribute(`data-tone`,`emerald`),await a(t.getAttribute(`style`)).toBeNull()}},l={args:{value:145,max:100,tone:`amber`,label:`Lint audit budget`},play:async({canvasElement:e})=>{let t=o(e).getByRole(`progressbar`,{name:`Lint audit budget`});await a(t).toHaveAttribute(`value`,`100`),await a(t).toHaveAttribute(`data-tone`,`amber`)}},u={args:{value:-10,max:100,tone:`crimson`,label:`Critical risk indicator`},play:async({canvasElement:e})=>{let t=o(e).getByRole(`progressbar`,{name:`Critical risk indicator`});await a(t).toHaveAttribute(`value`,`0`),await a(t).toHaveAttribute(`data-tone`,`crimson`)}},d=[`EmeraldProgress`,`ClampedOverflowAmber`,`CriticalZeroCrimson`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', {
      name: 'Migration completion progress',
    });
    await expect(bar).toHaveAttribute('value', '68');
    await expect(bar).toHaveAttribute('max', '100');
    await expect(bar).toHaveAttribute('data-tone', 'emerald');
    await expect(bar.getAttribute('style')).toBeNull();
  },
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    value: 145,
    max: 100,
    tone: 'amber',
    label: 'Lint audit budget',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', { name: 'Lint audit budget' });
    await expect(bar).toHaveAttribute('value', '100');
    await expect(bar).toHaveAttribute('data-tone', 'amber');
  },
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    value: -10,
    max: 100,
    tone: 'crimson',
    label: 'Critical risk indicator',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', {
      name: 'Critical risk indicator',
    });
    await expect(bar).toHaveAttribute('value', '0');
    await expect(bar).toHaveAttribute('data-tone', 'crimson');
  },
}`,...u.parameters?.docs?.source}}}})))()}f();export{l as ClampedOverflowAmber,u as CriticalZeroCrimson,c as EmeraldProgress,d as __namedExportsOrder,s as default};