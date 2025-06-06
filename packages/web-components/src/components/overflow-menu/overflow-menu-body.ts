/**
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { prefix } from '../../globals/settings';
import CDSFloatingMenu, {
  FLOATING_MENU_DIRECTION,
} from '../floating-menu/floating-menu';
import { NAVIGATION_DIRECTION, OVERFLOW_MENU_SIZE } from './defs';
import CDSOverflowMenuItem from './overflow-menu-item';
import HostListener from '../../globals/decorators/host-listener';
import { indexOf } from '../../globals/internal/collection-helpers';
import { carbonElement as customElement } from '../../globals/decorators/carbon-element';
import styles from './overflow-menu.scss?lit';

/**
 * @param index The index
 * @param length The length of the array.
 * @returns The new index, adjusting overflow/underflow.
 */
const capIndex = (index: number, length: number) => {
  if (index < 0) {
    return length - 1;
  }
  if (index >= length) {
    return 0;
  }
  return index;
};

/**
 * Overflow menu body.
 *
 * @element cds-overflow-menu-body
 */
@customElement(`${prefix}-overflow-menu-body`)
class CDSOverflowMenuBody extends CDSFloatingMenu {
  /**
   * The menu direction.
   */
  @property()
  direction = FLOATING_MENU_DIRECTION.BOTTOM;

  /**
   * How the menu is aligned to the trigger button.
   */
  @property({ type: Boolean, reflect: true })
  flipped = false;

  /**
   * `true` if the menu should be open.
   *
   * @private
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  selected: CDSOverflowMenuItem | null = null;

  /**
   * The overflow menu size.
   */
  @property({ reflect: true })
  size = OVERFLOW_MENU_SIZE.MEDIUM;

  /**
   * @param currentItem The currently selected item.
   * @param direction The navigation direction.
   * @returns The item to be selected.
   */
  protected _getNextItem(currentItem: CDSOverflowMenuItem, direction: number) {
    const { selectorItemEnabled } = this
      .constructor as typeof CDSOverflowMenuBody;
    const menuItems = this.querySelectorAll(selectorItemEnabled);
    const currentIndex = indexOf(menuItems, currentItem);
    const nextIndex = capIndex(currentIndex + direction, menuItems.length);
    return nextIndex === currentIndex ? null : menuItems[nextIndex];
  }

  /**
   * Navigates through overflow menu items.
   *
   * @param direction `-1` to navigate backward, `1` to navigate forward.
   */
  protected _navigate(direction: number) {
    if (this.selected) {
      const nextItem = this._getNextItem(this.selected, direction);
      (nextItem as HTMLElement)?.focus();
    }
  }

  /**
   * Handles `keydown` event on the menu body.
   */
  @HostListener('keydown')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  protected _handleKeydown = async (event: KeyboardEvent) => {
    const { key } = event;
    if (this.open) {
      /**
       * sets this.selected to focused menu item. the menu item is focused
       * automatically due to FocusMixin
       */
      if (this.contains(document.activeElement)) {
        this.selected = document.activeElement as CDSOverflowMenuItem;
      }

      if (key in NAVIGATION_DIRECTION) {
        event.preventDefault();
        this._navigate(NAVIGATION_DIRECTION[key]);
      }

      if (key === 'Escape') {
        this.open = false;
      }
    }
  };

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'menu');
    }
    if (!this.hasAttribute('tabindex')) {
      // TODO: Should we use a property?
      this.setAttribute('tabindex', '-1');
    }
    super.connectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has('size')) {
      const { selectorMenuItem } = this
        .constructor as typeof CDSOverflowMenuBody;
      const menuItems = this.querySelectorAll(selectorMenuItem);
      menuItems.forEach((item) => {
        item.setAttribute('size', this.size);
      });
    }

    super.updated(changedProperties);
  }

  render() {
    return html` <slot></slot> `;
  }

  /**
   * A selector that will return menu items.
   */
  static get selectorMenuItem() {
    return `${prefix}-overflow-menu-item`;
  }

  /**
   * A selector that will return enabled menu items.
   */
  static get selectorItemEnabled() {
    return `${prefix}-overflow-menu-item:not([disabled])`;
  }

  static styles = styles;
}

export default CDSOverflowMenuBody;
