import { buttonFunctions, buttonPanel } from "../ui/buttons";

export function segmentNameButtons(destroy = false): void {
  if (!destroy && $("#WMERSH-panel[displayFor=\"segmentNameButtons\"]").length === 0) {
    const buttonsHTML = buttonPanel("segmentNameButtons");
    $("#segment-edit-general").prepend(buttonsHTML);
    $("#WMERSH-panel").css({ "margin-top": "0px", left: $("#sidebar").width() + 10 });
    buttonFunctions("segmentNameButtons");
  } else if (destroy && $("wz-autocomplete.street-name, wz-autocomplete.alt-street-name").length === 0) {
    $('#WMERSH-panel[displayFor="segmentNameButtons"]').remove();
  }
}

export function editPanelObserver(): void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      for (let i = 0; i < mutation.addedNodes.length; i += 1) {
        const addedNode = mutation.addedNodes[i] as Element;
        if (addedNode?.nodeType === Node.ELEMENT_NODE) {
          if (addedNode.querySelector("wz-autocomplete.street-name, wz-autocomplete.alt-street-name")) {
            segmentNameButtons();
          }
        }
      }
      for (let i = 0; i < mutation.removedNodes.length; i += 1) {
        const removedNode = mutation.removedNodes[i] as Element;
        if (removedNode?.nodeType === Node.ELEMENT_NODE) {
          if (removedNode.querySelector("wz-autocomplete.street-name, wz-autocomplete.alt-street-name")) {
            segmentNameButtons(true);
          }
        }
      }
    });
  });
  const editPanel = document.querySelector("#edit-panel div.contents");
  if (editPanel) {
    observer.observe(editPanel, {
      childList: true,
      attributes: false,
      attributeOldValue: false,
      characterData: false,
      characterDataOldValue: false,
      subtree: true,
    });
  }
}
