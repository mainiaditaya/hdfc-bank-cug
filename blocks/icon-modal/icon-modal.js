/* eslint no-console: ["error", { allow: ["warn", "error", "debug"] }] */
import {
  buildBlock, decorateBlock, loadBlock,
} from '../../scripts/aem.js';

// eslint-disable-next-line no-unused-vars
const closeDialog = (modalClass) => {
  const modal = document.querySelector(`dialog.${modalClass}`);
  modal.close();
};

async function createMainModal(content, actionWrapClass, reqConsentAgree, dialogClass) {
  if (!content) {
    return null;
  }
  const dialog = document.createElement('dialog');
  dialog.classList.add(dialogClass);
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(content);
  dialog.append(dialogContent);
  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close">X</span>';
  closeButton.addEventListener('click', () => {
    const resultScope = {};
    resultScope[`${'closeIcon'}`] = true;
    dialog.close();
    const customEvent = new CustomEvent('modalTriggerValue', { detail: resultScope, bubbles: false });
    content?.dispatchEvent(customEvent);
  });
  if (!reqConsentAgree) {
    dialog.append(closeButton);
  }

  const buttonWrapperDivs = content.querySelectorAll(`div.${actionWrapClass}`);
  buttonWrapperDivs?.forEach((element) => {
    const actionBtns = element?.querySelectorAll('button');
    actionBtns?.forEach((button) => {
      // providing close functionalities to all the btns available
      button?.addEventListener('click', (e) => {
        const nameOfBtn = e?.target?.name;
        const resultScope = {};
        resultScope[`${nameOfBtn}`] = true;
        // dialog.close();
        const customEvent = new CustomEvent('modalTriggerValue', { detail: resultScope, bubbles: false });
        content?.dispatchEvent(customEvent);
      });
    });
  });
  const block = buildBlock('icon-modal', '');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    block.remove();
  });

  block.append(dialog);

  return {
    block,
    showModal: () => {
      dialog.showModal();
      // Google Chrome restores the scroll position when the dialog is reopened,
      // so we need to reset it.
      setTimeout(() => {
        dialogContent.scrollTop = 0;
      }, 0);

      document.body.classList.add('modal-open');
    },
  };
}

/**
   * Opens a modal dialog with the specified content, action wrapper class, and consent requirement.
   * @param {HTMLElement} content - The content to be displayed in the modal dialog.
   * @param {string} actionWrapClass - The class name of the wrapper containing action buttons.
   * @param {boolean} reqConsentAgree - Whether consent agreement is required to close the modal.
   * @returns {Promise<void>} - A promise that resolves when the modal is opened.
   */
function iconModal({
  content, actionWrapClass, reqConsentAgree, dialogClass,
}) {
  createMainModal(content, actionWrapClass, reqConsentAgree, dialogClass)
    .then((res) => {
      if (res?.showModal) {
        res?.showModal();
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

const showDialogContent = async (config) => {
  await iconModal(config);
  config?.content?.addEventListener('modalTriggerValue', (event) => {
    const receivedData = event.detail;
    if (config?.updateUI) {
      config?.updateUI(receivedData);
    }
  });
};

const showDialog = (config) => {
  if (config.triggerElement) {
    config?.triggerElement?.addEventListener('click', async (e) => {
      e.preventDefault();
      showDialogContent(config);
    });
  } else {
    showDialogContent(config);
  }
};

export {
  closeDialog,
  showDialog,
};
