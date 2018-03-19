ember-focus-trapper
==============================================================================

This is an ember addon for trapping keyboard focus.

Installation
------------------------------------------------------------------------------

```
ember install ember-focus-trapper
```


Usage
------------------------------------------------------------------------------
This is a block-only component, intended to be wrapped around a chunk of html that includes focusable elements.
As soon as the `focus-trapper` is rendered, it will only allow focusable elements within the yielded block to be focused.
Take care not to render more than one `focus-trapper` at any given time... you'll have a bad time.
```
{{#focus-trapper disable=false}}
  <form action="">
    <label>You must fill out this input field: <input type="text"></label>
    <label>And this input field: <input type="text"></label>
  </form>
{{/focus-trapper}}

```

## Options:
- disable (boolean, defaults to false) : When disable=true, the focus-trapper does nothing.
- cycle (boolean, defaults to false) : When enabled, focus-trapper will cycle focus to the first focusable element when tabbing from the last focusable element, and will cycle focus to the last focusable element when shift-tabbing from the first focusable element. When disabled, tabbing from the last focusable element keeps focus on that element, and shift-tabbing from the first focusable element keeps focus on that element.

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-focus-trapper`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
