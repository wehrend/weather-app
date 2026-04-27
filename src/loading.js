import { rootElement } from "./main";

export function renderLoadingScreen(message = "Lade...") {
  rootElement.innerHTML = getLoadingHtml(message);
}

function getLoadingHtml(message) {
  return `      
    <div class="loading">
        <div class="loading__message">Lade ${message}...</div>
        <div class="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      `;
}
