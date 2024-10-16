export default async function initializeRuleEngineWorker(formDef, renderHTMLForm, bUseWorker) {
  if (typeof Worker === 'undefined' || bUseWorker === false) {
    const ruleEngine = await import('./model/afb-runtime.js');
    const form = ruleEngine.createFormInstance(formDef);
    return renderHTMLForm(form, formDef.data);
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
        // myWorker.terminate();
        resolve(form);
      }
    });
  });
}
