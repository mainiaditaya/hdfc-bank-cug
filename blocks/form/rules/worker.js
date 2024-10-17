export default async function initializeRuleEngineWorker(formDef, renderHTMLForm) {
  if (typeof Worker === 'undefined') {
    const ruleEngine = await import('./model/afb-runtime.js');
    const form = ruleEngine.createFormInstance(formDef);
    return renderHTMLForm(form.getState(true), formDef.data);
  }
  const myWorker = new Worker('/blocks/form/rules/RuleEngineWorker.js', { type: 'module' });

  myWorker.postMessage({
    name: 'init',
    payload: formDef,
  });

  return new Promise((resolve) => {
    let form;
    myWorker.addEventListener('message', async (e) => {
      if (e.data.name === 'init') {
        form = await renderHTMLForm(e.data.payload, e.data.payload.data);
        myWorker.postMessage({
          name:'initComplete'
        }); // informing the worker that html form rendition is complete
        // myWorker.terminate();
        resolve(form);
      }

      if (e.data.name === 'fieldChanged') {
        const { fieldChanged } = await import('./index.js');
        const { generateFormRendition } = await import('../form.js');
        await fieldChanged(e.data.payload, form, null);
    }
    });
  });
}
