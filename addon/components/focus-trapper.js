import Component from "@ember/component";
import layout from "../templates/components/focus-trapper";
import { computed } from "@ember/object";
import { notEmpty } from "@ember/object/computed";
import { next } from "@ember/runloop";

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "object",
  "embed",
  '*[tabindex]:not([tabindex="-1"])',
  "*[contenteditable]"
];

export default Component.extend({
  layout,

  didInsertElement() {
    // run this on every render in case the html contents change
    this.set(
      "allFocusableEl",
      this.element.querySelectorAll(FOCUSABLE.join(", "))
    );
    // move focus into the focus-trapper if focus is outside the trapper
    this.refocus.call(this);
  },

  didRender() {
    // run this on every render in case the html contents change
    this.set(
      "allFocusableEl",
      this.element.querySelectorAll(FOCUSABLE.join(", "))
    );
  },

  firstFocusableEl: computed("allFocusableEl", function() {
    return this.allFocusableEl[0];
  }),

  canTrapFocus: notEmpty("firstFocusableEl"),

  lastFocusableEl: computed("allFocusableEl", function() {
    let allFocusableEl = this.allFocusableEl;
    return allFocusableEl[allFocusableEl.length - 1];
  }),

  keyDown(event) {
    if (event.keyCode === 9) {
      this.handleTab.call(this, event);
    }
  },

  focusOut(event) {
    if (!this.element.contains(event.relatedTarget)) {
      this.refocus.call(this);
    }
  },

  handleTab(event) {
    let shouldCycleFocus = this.cycle;
    let shouldTrapFocus = !this.disable;
    let hasLostFocus =
      document && !this.element.contains(document.activeElement);

    if (shouldTrapFocus) {
      // if shift-tab and first-focusable, move focus to the last focusable
      if (event.target === this.firstFocusableEl && event.shiftKey) {
        event.preventDefault();
        if (shouldCycleFocus) next(this.lastFocusableEl, "focus");
      }
      // if normal tab and last-focusable, move focus up to the first focusable
      if (event.target === this.lastFocusableEl && !event.shiftKey) {
        event.preventDefault();
        if (shouldCycleFocus) next(this.firstFocusableEl, "focus");
      }

      if (hasLostFocus) {
        event.preventDefault();
        next(this.firstFocusableEl, "focus");
      }
    }
  },

  refocus() {
    let shouldTrapFocus = !this.disable;
    let hasLostFocus =
      document && !this.element.contains(document.activeElement);
    if (shouldTrapFocus && this.canTrapFocus && hasLostFocus) {
      next(this.firstFocusableEl, "focus");
    }
  }
});
