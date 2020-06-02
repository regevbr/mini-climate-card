import { LitElement, html, css } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import './dropdown';
import ICON from '../const';

class ModeMenu extends LitElement {
  static get properties() {
    return {
      climate: Object,
    };
  }

  get calcIcon() {
    if (this.source) {
      if (this.source.icon)
        return this.source.icon;

      const id = this.source.id.toUpperCase();

      if (id in ICON)
        return ICON[id];
    }

    return '';
  }

  get source() {
    return this.climate.mode || {};
  }

  get sources() {
    return this.climate.hvac_modes
      .filter(s => !s.hide)
      .map(s => ({ name: s.name, id: s.id, type: 'source' }));
  }

  render() {
    let style = {};
    if (this.climate.config.hvac_mode.functions.style)
      style = this.climate.config.hvac_mode.functions.style(this.climate.mode.id,
        this.climate.entity) || {};

    return html`
      <mc-dropdown
        @change=${this.handleSource}
        .climate=${this.climate}
        .items=${this.sources}
        .icon=${this.calcIcon}
        style=${styleMap(style)}
        .active=${this.climate.isOn} 
        .selected=${this.source.id}>
      </mc-dropdown>
    `;
  }

  handleSource(ev) {
    ev.stopPropagation();
    const { id } = ev.detail;
    this.climate.setHvacMode(id);
  }

  static get styles() {
    return css`
      :host {
        min-width: calc(var(--mc-unit) * .85);
        --mc-dropdown-unit: calc(var(--mc-unit) * .75);
        --paper-item-min-height: var(--mc-unit);
      }
    `;
  }
}

customElements.define('mc-mode-menu', ModeMenu);
