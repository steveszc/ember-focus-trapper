import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, triggerKeyEvent, render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | focus-trapper", function(hooks) {
  setupRenderingTest(hooks);

  test("it moves focus into the trapper", async function(assert) {
    await render(hbs`
      {{#focus-trapper}}
        <label>Input: <input type="text"></label>
      {{/focus-trapper}}
    `);

    assert.ok(
      this.element.contains(document.activeElement),
      "when not disabled, focus is moved into the trapper"
    );
  });

  test("disable works", async function(assert) {
    await render(hbs`
      {{#focus-trapper disable=true}}
        <label>Input: <input type="text"></label>
      {{/focus-trapper}}
    `);

    assert.ok(
      !this.element.contains(document.activeElement),
      "when disabled, focus is not moved"
    );
  });

  test("it traps focus", async function(assert) {
    await render(hbs`
      <label>Input: <input type="text" name="before"></label>
      {{#focus-trapper}}
        <label>trapped focus: <input type="text" name="trapped"></label>
      {{/focus-trapper}}
      <label>Input: <input type="text" name="after"></label>
    `);

    await triggerKeyEvent('[name="trapped"]', "keydown", "9");
    assert.ok(
      this.element.contains(document.activeElement),
      "it traps focus when tabbing out"
    );

    await triggerKeyEvent('[name="trapped"]', "keydown", "9", {
      shiftKey: true
    });
    assert.ok(
      this.element.contains(document.activeElement),
      "it traps focus when shift+tabbing out"
    );

    await click('[name="after"]');
    assert.ok(
      this.element.contains(document.activeElement),
      "it traps focus when clicking out"
    );
  });
});
