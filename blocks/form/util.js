// create a string containing head tags from h1 to h5
const headings = Array.from({ length: 5 }, (_, i) => `<h${i + 1}>`).join('');
const allowedTags = `${headings}<a><b><p><i><em><strong><ul><li>`;

export function stripTags(input, allowd = allowedTags) {
  const allowed = ((`${allowd || ''}`)
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const comments = /<!--[\s\S]*?-->/gi;
  return input.replace(comments, '')
    .replace(tags, ($0, $1) => (allowed.indexOf(`<${$1.toLowerCase()}>`) > -1 ? $0 : ''));
}

/**
 * Sanitizes a string for use as class name.
 * @param {string} name The unsanitized string
 * @returns {string} The class name
 */
function toClassName(name) {
  return typeof name === 'string'
    ? name
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : '';
}

const clear = Symbol('clear');

export const getId = (function getId() {
  let ids = {};
  return (name) => {
    if (name === clear) {
      ids = {};
      return '';
    }
    const slug = toClassName(name);
    ids[slug] = ids[slug] || 0;
    const idSuffix = ids[slug] ? `-${ids[slug]}` : '';
    ids[slug] += 1;
    return `${slug}${idSuffix}`;
  };
}());

/**
 * Resets the ids for the getId function
 * @returns {void}
 */
export function resetIds() {
  getId(clear);
}

export function createLabel(fd, tagName = 'label') {
  if (fd.label && fd.label.value) {
    const label = document.createElement(tagName);
    label.setAttribute('for', fd.id);
    label.className = 'field-label';
    if (fd.label.richText === true) {
      label.innerHTML = stripTags(fd.label.value);
    } else {
      label.textContent = fd.label.value;
    }
    if (fd.label.visible === false) {
      label.dataset.visible = 'false';
    }
    if (fd.Tooltip) {
      label.title = fd.Tooltip;
    }
    return label;
  }
  return null;
}

export function getHTMLRenderType(fd) {
  return fd?.fieldType?.replace('-input', '') ?? 'text';
}

export function createFieldWrapper(fd, tagName = 'div', labelFn = createLabel) {
  const fieldWrapper = document.createElement(tagName);
  const nameStyle = fd.name ? ` field-${toClassName(fd.name)}` : '';
  const renderType = getHTMLRenderType(fd);
  const fieldId = `${renderType}-wrapper${nameStyle}`;
  fieldWrapper.className = fieldId;
  fieldWrapper.dataset.id = fd.id;
  if (fd.visible === false) {
    fieldWrapper.dataset.visible = fd.visible;
  }
  fieldWrapper.classList.add('field-wrapper');
  if (fd.label && fd.label.value && typeof labelFn === 'function') {
    const label = labelFn(fd);
    if (label) { fieldWrapper.append(label); }
  }
  return fieldWrapper;
}

export function createButton(fd) {
  const wrapper = createFieldWrapper(fd);
  if (fd.buttonType) {
    wrapper.classList.add(`${fd?.buttonType}-wrapper`);
  }
  const button = document.createElement('button');
  button.textContent = fd?.label?.visible === false ? '' : fd?.label?.value;
  button.type = fd.buttonType || 'button';
  button.classList.add('button');
  button.id = fd.id;
  button.name = fd.name;
  if (fd?.label?.visible === false) {
    button.setAttribute('aria-label', fd?.label?.value || '');
  }
  if (fd.enabled === false) {
    button.disabled = true;
    button.setAttribute('disabled', '');
  }
  wrapper.replaceChildren(button);
  return wrapper;
}

// create a function to measure performance of another function
// export function perf(fn) {
//   return (...args) => {
//     const start = performance.now();
//     const result = fn(...args);
//     const end = performance.now();
//     // eslint-disable-next-line no-console
//     console.log(`${fn.name} took ${end - start} milliseconds.`);
//     return result;
//   };
// }

function getFieldContainer(fieldElement) {
  const wrapper = fieldElement?.closest('.field-wrapper');
  let container = wrapper;
  if ((fieldElement.type === 'radio' || fieldElement.type === 'checkbox') && wrapper.dataset.fieldset) {
    container = fieldElement?.closest(`fieldset[name=${wrapper.dataset.fieldset}]`);
  }
  return container;
}

export function createHelpText(fd) {
  const div = document.createElement('div');
  div.className = 'field-description';
  div.setAttribute('aria-live', 'polite');
  div.innerHTML = fd.description;
  div.id = `${fd.id}-description`;
  return div;
}

export function updateOrCreateInvalidMsg(fieldElement, msg) {
  const container = getFieldContainer(fieldElement);
  let element = container.querySelector(':scope > .field-description');
  if (!element) {
    element = createHelpText({ id: fieldElement.id });
    container.append(element);
  }
  if (msg) {
    container.classList.add('field-invalid');
    element.textContent = msg;
  } else if (container.dataset.description) {
    container.classList.remove('field-invalid');
    element.innerHTML = container.dataset.description;
  } else if (element) {
    element.remove();
  }
  return element;
}

export function removeInvalidMsg(fieldElement) {
  return updateOrCreateInvalidMsg(fieldElement, '');
}

export const validityKeyMsgMap = {
  patternMismatch: 'patternErrorMessage',
  rangeOverflow: 'maximumErrorMessage',
  rangeUnderflow: 'minimumErrorMessage',
  tooLong: 'maxLengthErrorMessage',
  tooShort: 'minLengthErrorMessage',
  valueMissing: 'requiredErrorMessage',
};

export function getCheckboxGroupValue(name, htmlForm) {
  const val = [];
  htmlForm.querySelectorAll(`input[name="${name}"]`).forEach((x) => {
    if (x.checked) {
      val.push(x.value);
    }
  });
  return val;
}

function updateRequiredCheckboxGroup(name, htmlForm) {
  const checkboxGroup = htmlForm.querySelectorAll(`input[name="${name}"]`) || [];
  const value = getCheckboxGroupValue(name, htmlForm);
  checkboxGroup.forEach((checkbox) => {
    if (checkbox.checked || !value.length) {
      checkbox.setAttribute('required', true);
    } else {
      checkbox.removeAttribute('required');
    }
  });
}

export function checkValidation(fieldElement) {
  const wrapper = fieldElement.closest('.field-wrapper');
  const isCheckboxGroup = fieldElement.dataset.fieldType === 'checkbox-group';
  const required = wrapper?.dataset?.required;
  if (isCheckboxGroup && required === 'true') {
    updateRequiredCheckboxGroup(fieldElement.name, fieldElement.form);
  }
  if (fieldElement.validity.valid && fieldElement.type !== 'file') {
    removeInvalidMsg(fieldElement);
    return;
  }

  const [invalidProperty] = Object.keys(validityKeyMsgMap)
    .filter((state) => fieldElement.validity[state]);

  const message = wrapper.dataset[validityKeyMsgMap[invalidProperty]]
  || fieldElement.validationMessage;
  updateOrCreateInvalidMsg(fieldElement, message);
}

export function setPlaceholder(element, fd) {
  if (fd.placeholder) {
    element.setAttribute('placeholder', fd.placeholder);
  }
}

const constraintsDef = Object.entries({
  'password|tel|email|text': [['maxLength', 'maxlength'], ['minLength', 'minlength'], 'pattern'],
  'number|range|date': [['maximum', 'Max'], ['minimum', 'Min'], 'step'],
  file: ['accept', 'Multiple'],
  panel: [['maxOccur', 'data-max'], ['minOccur', 'data-min']],
}).flatMap(([types, constraintDef]) => types.split('|')
  .map((type) => [type, constraintDef.map((cd) => (Array.isArray(cd) ? cd : [cd, cd]))]));

const constraintsObject = Object.fromEntries(constraintsDef);

export function setConstraints(element, fd) {
  const renderType = getHTMLRenderType(fd);
  const constraints = constraintsObject[renderType];
  if (constraints) {
    constraints
      .filter(([nm]) => fd[nm])
      .forEach(([nm, htmlNm]) => {
        element.setAttribute(htmlNm, fd[nm]);
      });
  }
}

export function createInput(fd) {
  const input = document.createElement('input');
  input.type = getHTMLRenderType(fd);
  setPlaceholder(input, fd);
  setConstraints(input, fd);
  return input;
}

export function createRadioOrCheckbox(fd) {
  const wrapper = createFieldWrapper(fd);
  const input = createInput(fd);
  const [value, uncheckedValue] = fd.enum || [];
  input.value = value;
  if (typeof uncheckedValue !== 'undefined') {
    input.dataset.uncheckedValue = uncheckedValue;
  }
  wrapper.insertAdjacentElement('afterbegin', input);
  return wrapper;
}

export function createRadioOrCheckboxUsingEnum(fd, wrapper) {
  const legend = wrapper.querySelector('legend');
  wrapper.innerHTML = '';
  wrapper.append(legend);
  const type = fd.fieldType.split('-')[0];
  fd.enum.forEach((value, index) => {
    const label = typeof fd.enumNames?.[index] === 'object' ? fd.enumNames[index].value : fd.enumNames?.[index] || value;
    const id = getId(fd.name);
    const field = createRadioOrCheckbox({
      name: fd.name,
      id,
      label: { value: label },
      fieldType: type,
      enum: [value],
      required: fd.required,
    });
    field.classList.remove('field-wrapper', `field-${fd.name}`);
    const input = field.querySelector('input');
    input.id = id;
    input.dataset.fieldType = fd.fieldType;
    input.name = fd.id; // since id is unique across radio/checkbox group
    input.checked = Array.isArray(fd.value) ? fd.value.includes(value) : value === fd.value;
    if ((index === 0 && type === 'radio') || type === 'checkbox') {
      input.required = fd.required;
    }
    if (fd.enabled === false || fd.readOnly === true) {
      input.setAttribute('disabled', 'disabled');
    }
    wrapper.appendChild(field);
  });
}
