import Component from '@ember/component';
import layout from '../templates/components/focus-trapper';
import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { next } from '@ember/runloop';

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'object',
  'embed',
  '*[tabindex]:not([tabindex="-1"])',
  '*[contenteditable]'
];

export default Component.extend({
  layout,

  didInsertElement() {
    // run this on every render in case the html contents change
    this.set('allFocusableEl', this.get('element').querySelectorAll(FOCUSABLE.join(', ')));
    // move focus into the focus-trapper if focus is outside the trapper
    this.get('refocus').bind(this)();
  },

  didRender() {
    // run this on every render in case the html contents change
    this.set('allFocusableEl', this.get('element').querySelectorAll(FOCUSABLE.join(', ')));
  },

  firstFocusableEl: computed('allFocusableEl', function() {
    return this.get('allFocusableEl')[0];
  }),

  canTrapFocus: notEmpty('firstFocusableEl'),

  lastFocusableEl: computed('allFocusableEl', function () {
    let allFocusableEl = this.get('allFocusableEl');
    return allFocusableEl[allFocusableEl.length - 1];
  }),

  keyDown(event) {
    if (event.keyCode === 9) {
      this.get('handleTab').bind(this)(event);
    }
  },

  focusOut(event) {
    if (!this.get('element').contains(event.relatedTarget)) {
      this.get('refocus').bind(this)();
    }
  },

  handleTab(event) {
    let firstFocusableEl = this.get('firstFocusableEl');
    let lastFocusableEl = this.get('lastFocusableEl');
    let shouldCycleFocus = this.get('cycle');
    let shouldTrapFocus = !this.get('disable');
    let hasLostFocus = document && !this.get('element').contains(document.activeElement);

    if (shouldTrapFocus) {
      // if shift-tab and first-focusable, move focus to the last focusable
      if (event.target === firstFocusableEl && event.shiftKey) {
        event.preventDefault();
        if (shouldCycleFocus) next(lastFocusableEl, 'focus');
      }
      // if normal tab and last-focusable, move focus up to the first focusable
      if (event.target === lastFocusableEl && !event.shiftKey) {
        event.preventDefault();
        if (shouldCycleFocus) next(firstFocusableEl, 'focus');
      }

      if (hasLostFocus) {
        event.preventDefault();
        next(firstFocusableEl, 'focus');
      }
    }
  },

  refocus() {
    let shouldTrapFocus = !this.get('disable');
    let canTrapFocus = this.get('canTrapFocus');
    let hasLostFocus = document && !this.get('element').contains(document.activeElement);
    if (shouldTrapFocus && canTrapFocus && hasLostFocus) {
      next(this.get('firstFocusableEl'), 'focus');
    }
  }

});
