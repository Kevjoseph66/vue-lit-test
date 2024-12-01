import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

interface DrawerButton {
  id: string;
  icon: string;
  text: string;
  section?: string;
  path: string;
  isActive?: boolean;
}

@customElement('drawer-component')
export class DrawerComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      background: #fff;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
      transition: width 0.3s ease;
      overflow: hidden;
    }

    .drawer {
      width: 250px;
      height: 96%;
      display: flex;
      flex-direction: column;
      padding: 1rem;
    }

    .drawer.collapsed {
      width: 60px;
    }

    .header {
      padding: 1rem;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: bold;
      color: #6b46c1;
    }

     .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      margin: 0.25rem 0;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #4a5568;
      gap: 0;
      transition: gap 0.3s ease;
    }

    .drawer:not(.collapsed) .nav-item {
      gap: 16px;
    }

    .nav-item:hover {
      background: #f7fafc;
      color: #6b46c1;
    }

    .nav-item.active {
      background: #F3EEFC;
      color: #7c3aed;
    }

    .section {
      margin: 1rem 0;
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
    }

    .section-title {
      font-size: 0.875rem;
      color: #718096;
      margin-bottom: 0.5rem;
    }

    .toggle {
      margin-top: auto;
      padding: 1rem;
      display: flex;
      justify-content: center;
      cursor: pointer;
      background-color: #EFF1F5;
      border-radius: 8px;
    }

    .version {
      text-align: center;
      font-size: 0.75rem;
      color: #718096;
      padding: 0.5rem;
    }

    .nav-item .icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

    }

    .nav-item .icon svg {
      width: 100%;
      height: 100%;
    }

    .nav-item:hover .icon svg,
    .nav-item.active .icon svg {
      color: #7c3aed;
    }
    .logo {
      height: 24px;
      width: auto;
    }
  `;

  @property({ type: Array })
  buttons: DrawerButton[] = [];

  @property({ type: String })
  version = '';

  @property({ type: String })
  openLogo = '';

  @property({ type: String })
  closedLogo = '';

  @property({ type: String })
  activeButtonId = '';

  @state()
  private isOpen = true;

  constructor() {
    super();
    this.handleUrlParams();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('popstate', () => this.handleUrlParams());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleClickOutside);
  }

  private handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    this.isOpen = params.get('drawer') !== 'closed';
    this.updateUrl();
  }

  private updateUrl() {
    const params = new URLSearchParams(window.location.search);
    params.set('drawer', this.isOpen ? 'open' : 'closed');
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  }

  private handleClickOutside(event: MouseEvent) {
    if (!this.contains(event.target as Node) && this.isOpen) {
      this.toggleDrawer();
    }
  }

  private toggleDrawer() {
    this.isOpen = !this.isOpen;
    this.updateUrl();
    this.requestUpdate();
  }

  private handleButtonClick(button: DrawerButton) {
    const event = new CustomEvent('drawer-select', {
      detail: {
        id: button.id,
        text: button.text,
        section: button.section,
        route: button.path
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  render() {
    const drawerClasses = {
      drawer: true,
      collapsed: !this.isOpen
    };

    return html`
      <div class=${classMap(drawerClasses)}>
         <div class="header">
          ${this.isOpen
        ? html`<img src="${this.openLogo}" alt="Logo" class="logo">`
        : html`<img src="${this.closedLogo}" alt="Logo" class="logo">`
      }
        </div>

        ${this.renderButtons()}

        ${this.version ? html`
          <div class="version">
            ${this.isOpen ? this.version : ''}
          </div>
        ` : ''}
        <div class="toggle" @click=${this.toggleDrawer}>
          ${this.isOpen ? html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 7l-5 5m0 0l5 5"/></svg>` : html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 17l5-5l-5-5"/></svg>`}
        </div>

       
      </div>
    `;
  }

  private renderButtons() {
    const groupedButtons = this.buttons.reduce((acc, button) => {
      const section = button.section || 'default';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(button);
      return acc;
    }, {} as Record<string, DrawerButton[]>);

    return Object.entries(groupedButtons).map(([section, buttons]) => {
      if (section === 'default') {
        return buttons.map(button => this.renderButton(button));
      }

      return html`
        <div class="section">
          ${this.isOpen ? html`
            <div class="section-title">${section}</div>
          ` : ''}
          ${buttons.map(button => this.renderButton(button))}
        </div>
      `;
    });
  }

  private renderButton(button: DrawerButton) {
    const buttonClasses = {
      'nav-item': true,
      'active': button.isActive || button.id === this.activeButtonId
    };

    return html`
    <div
      class=${classMap(buttonClasses)}
      @click=${() => this.handleButtonClick(button)}
    >
      <span class="icon">
        ${unsafeHTML(button.icon)}
      </span>
      ${this.isOpen ? html`
        <span class="text">${button.text}</span>
      ` : ''}
    </div>
  `;
  }
}

