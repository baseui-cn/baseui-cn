---
title: Field
subtitle: A component that provides labeling and validation for form controls.
description: A high-quality, unstyled React field component that provides labeling and validation for form controls.
---

# Field

A high-quality, unstyled React field component that provides labeling and validation for form controls.

## Demo

### Tailwind

This example shows how to implement the component using Tailwind CSS.

```tsx
/* index.tsx */
import { Field } from "@base-ui/react/field"

export default function ExampleField() {
  return (
    <Field.Root className="flex w-full max-w-64 flex-col items-start gap-1">
      <Field.Label className="text-sm font-medium text-gray-900">Name</Field.Label>
      <Field.Control
        required
        placeholder="Required"
        className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
      />
      <Field.Error className="text-sm text-red-800" match="valueMissing">
        Please enter your name
      </Field.Error>

      <Field.Description className="text-sm text-gray-600">
        Visible on your profile
      </Field.Description>
    </Field.Root>
  )
}
```

### CSS Modules

This example shows how to implement the component using CSS Modules.

```css
/* index.module.css */
.Field {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.25rem;
  width: 100%;
  max-width: 16rem;
}

.Label {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--color-gray-900);
}

.Input {
  box-sizing: border-box;
  padding-left: 0.875rem;
  margin: 0;
  border: 1px solid var(--color-gray-200);
  width: 100%;
  height: 2.5rem;
  border-radius: 0.375rem;
  font-family: inherit;
  font-size: 1rem;
  background-color: transparent;
  color: var(--color-gray-900);

  &:focus {
    outline: 2px solid var(--color-blue);
    outline-offset: -1px;
  }
}

.Error {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--color-red-800);
}

.Description {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--color-gray-600);
}
```

```tsx
/* index.tsx */
import { Field } from "@base-ui/react/field"
import styles from "./index.module.css"

export default function ExampleField() {
  return (
    <Field.Root className={styles.Field}>
      <Field.Label className={styles.Label}>Name</Field.Label>
      <Field.Control required placeholder="Required" className={styles.Input} />

      <Field.Error className={styles.Error} match="valueMissing">
        Please enter your name
      </Field.Error>

      <Field.Description className={styles.Description}>Visible on your profile</Field.Description>
    </Field.Root>
  )
}
```

## Anatomy

Import the component and assemble its parts:

```jsx title="Anatomy"
import { Field } from "@base-ui/react/field"

;<Field.Root>
  <Field.Label />
  <Field.Control />
  <Field.Description />
  <Field.Item />
  <Field.Error />
  <Field.Validity />
</Field.Root>
```

## API reference

### Root

Groups all parts of the field.
Renders a `<div>` element.

**Root Props:**

| Prop           | Type                                                                                                                            | Default      | Description                                                                                                                                                                                                                                                                                    |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------ | :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name           | `string`                                                                                                                        | -            | Identifies the field when a form is submitted.&#xA;Takes precedence over the `name` prop on the `<Field.Control>` component.                                                                                                                                                                   |
| actionsRef     | `RefObject<Field.Root.Actions \| null>`                                                                                         | -            | A ref to imperative actions.\* `validate`: Validates the field when called.                                                                                                                                                                                                                    |
| dirty          | `boolean`                                                                                                                       | -            | Whether the field's value has been changed from its initial value.&#xA;Useful when the field state is controlled by an external library.                                                                                                                                                       |
| touched        | `boolean`                                                                                                                       | -            | Whether the field has been touched.&#xA;Useful when the field state is controlled by an external library.                                                                                                                                                                                      |
| disabled       | `boolean`                                                                                                                       | `false`      | Whether the component should ignore user interaction.&#xA;Takes precedence over the `disabled` prop on the `<Field.Control>` component.                                                                                                                                                        |
| invalid        | `boolean`                                                                                                                       | -            | Whether the field is invalid.&#xA;Useful when the field state is controlled by an external library.                                                                                                                                                                                            |
| validate       | `((value: unknown, formValues: Form.Values<string, any>) => string \| string[] \| Promise<string \| string[] \| null> \| null)` | -            | A function for custom validation. Return a string or an array of strings with&#xA;the error message(s) if the value is invalid, or `null` if the value is valid.&#xA;Asynchronous functions are supported, but they do not prevent form submission&#xA;when using `validationMode="onSubmit"`. |
| validationMode | `Form.ValidationMode`                                                                                                           | `'onSubmit'` | Determines when the field should be validated.&#xA;This takes precedence over the `validationMode` prop on `<Form>`.\* `onSubmit`: triggers validation when the form is submitted, and re-validates on change after submission.                                                                |

- `onBlur`: triggers validation when the control loses focus.
- `onChange`: triggers validation on every change to the control value. |
  | validationDebounceTime | `number` | `0` | How long to wait between `validate` callbacks if&#xA;`validationMode="onChange"` is used. Specified in milliseconds. |
  | className | `string \| ((state: Field.Root.State) => string \| undefined)` | - | CSS class applied to the element, or a function that&#xA;returns a class based on the component’s state. |
  | style | `CSSProperties \| ((state: Field.Root.State) => CSSProperties \| undefined)` | - | - |
  | render | `ReactElement \| ((props: HTMLProps, state: Field.Root.State) => ReactElement)` | - | Allows you to replace the component’s HTML element&#xA;with a different tag, or compose it with another component.Accepts a `ReactElement` or a function that returns the element to render. |

**Root Data Attributes:**

| Attribute     | Type | Description                                 |
| :------------ | :--- | :------------------------------------------ |
| data-disabled | -    | Present when the field is disabled.         |
| data-valid    | -    | Present when the field is valid.            |
| data-invalid  | -    | Present when the field is invalid.          |
| data-dirty    | -    | Present when the field's value has changed. |
| data-touched  | -    | Present when the field has been touched.    |
| data-filled   | -    | Present when the field is filled.           |
| data-focused  | -    | Present when the field control is focused.  |

### Label

An accessible label that is automatically associated with the field control.
Renders a `<label>` element.

**Label Props:**

| Prop        | Type                                                                             | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :---------- | :------------------------------------------------------------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nativeLabel | `boolean`                                                                        | `true`  | Whether the component renders a native `<label>` element when replacing it via the `render` prop.&#xA;Set to `false` if the rendered element is not a label (e.g. `<div>`).This is useful to avoid inheriting label behaviors on `<button>` controls (such as `<Select.Trigger>` and `<Combobox.Trigger>`), including avoiding `:hover` on the button when hovering the label, and preventing clicks on the label from firing on the button. |
| className   | `string \| ((state: Field.Label.State) => string \| undefined)`                  | -       | CSS class applied to the element, or a function that&#xA;returns a class based on the component’s state.                                                                                                                                                                                                                                                                                                                                     |
| style       | `CSSProperties \| ((state: Field.Label.State) => CSSProperties \| undefined)`    | -       | -                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| render      | `ReactElement \| ((props: HTMLProps, state: Field.Label.State) => ReactElement)` | -       | Allows you to replace the component’s HTML element&#xA;with a different tag, or compose it with another component.Accepts a `ReactElement` or a function that returns the element to render.                                                                                                                                                                                                                                                 |

**Label Data Attributes:**

| Attribute     | Type | Description                                 |
| :------------ | :--- | :------------------------------------------ |
| data-disabled | -    | Present when the field is disabled.         |
| data-valid    | -    | Present when the field is in valid state.   |
| data-invalid  | -    | Present when the field is in invalid state. |
| data-dirty    | -    | Present when the field's value has changed. |
| data-touched  | -    | Present when the field has been touched.    |
| data-filled   | -    | Present when the field is filled.           |
| data-focused  | -    | Present when the field control is focused.  |

### Control

The form control to label and validate.
Renders an `<input>` element.You can omit this part and use any Base UI input component instead. For example,
[Input](https://base-ui.com/react/components/input), [Checkbox](https://base-ui.com/react/components/checkbox),
or [Select](https://base-ui.com/react/components/select), among others, will work with Field out of the box.

**Control Props:**

| Prop          | Type                                                                               | Default | Description                                                                                                                                                                                  |
| :------------ | :--------------------------------------------------------------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultValue  | `string \| number \| string[]`                                                     | -       | -                                                                                                                                                                                            |
| onValueChange | `((value: string, eventDetails: Field.Control.ChangeEventDetails) => void)`        | -       | Callback fired when the `value` changes. Use when controlled.                                                                                                                                |
| className     | `string \| ((state: Field.Control.State) => string \| undefined)`                  | -       | CSS class applied to the element, or a function that&#xA;returns a class based on the component’s state.                                                                                     |
| style         | `CSSProperties \| ((state: Field.Control.State) => CSSProperties \| undefined)`    | -       | \*                                                                                                                                                                                           |
| render        | `ReactElement \| ((props: HTMLProps, state: Field.Control.State) => ReactElement)` | -       | Allows you to replace the component’s HTML element&#xA;with a different tag, or compose it with another component.Accepts a `ReactElement` or a function that returns the element to render. |

**Control Data Attributes:**

| Attribute     | Type | Description                                 |
| :------------ | :--- | :------------------------------------------ |
| data-disabled | -    | Present when the field is disabled.         |
| data-valid    | -    | Present when the field is in valid state.   |
| data-invalid  | -    | Present when the field is in invalid state. |
| data-dirty    | -    | Present when the field's value has changed. |
| data-touched  | -    | Present when the field has been touched.    |
| data-filled   | -    | Present when the field is filled.           |
| data-focused  | -    | Present when the field control is focused.  |

### Description

A paragraph with additional information about the field.
Renders a `<p>` element.

**Description Props:**

| Prop      | Type                                                                                   | Default | Description                                                                                                                                                                                  |
| :-------- | :------------------------------------------------------------------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | `string \| ((state: Field.Description.State) => string \| undefined)`                  | -       | CSS class applied to the element, or a function that&#xA;returns a class based on the component’s state.                                                                                     |
| style     | `CSSProperties \| ((state: Field.Description.State) => CSSProperties \| undefined)`    | -       | -                                                                                                                                                                                            |
| render    | `ReactElement \| ((props: HTMLProps, state: Field.Description.State) => ReactElement)` | -       | Allows you to replace the component’s HTML element&#xA;with a different tag, or compose it with another component.Accepts a `ReactElement` or a function that returns the element to render. |

**Description Data Attributes:**

| Attribute     | Type | Description                                 |
| :------------ | :--- | :------------------------------------------ |
| data-disabled | -    | Present when the field is disabled.         |
| data-valid    | -    | Present when the field is in valid state.   |
| data-invalid  | -    | Present when the field is in invalid state. |
| data-dirty    | -    | Present when the field's value has changed. |
| data-touched  | -    | Present when the field has been touched.    |
| data-filled   | -    | Present when the field is filled.           |
| data-focused  | -    | Present when the field control is focused.  |

### Item

Groups individual items in a checkbox group or radio group with a label and description.
Renders a `<div>` element.

**Item Props:**

| Prop      | Type                                                                            | Default | Description                                                                                                                                                                                  |
| :-------- | :------------------------------------------------------------------------------ | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disabled  | `boolean`                                                                       | `false` | Whether the wrapped control should ignore user interaction.&#xA;The `disabled` prop on `<Field.Root>` takes precedence over this.                                                            |
| className | `string \| ((state: Field.Item.State) => string \| undefined)`                  | -       | CSS class applied to the element, or a function that&#xA;returns a class based on the component’s state.                                                                                     |
| style     | `CSSProperties \| ((state: Field.Item.State) => CSSProperties \| undefined)`    | -       | -                                                                                                                                                                                            |
| render    | `ReactElement \| ((props: HTMLProps, state: Field.Item.State) => ReactElement)` | -       | Allows you to replace the component’s HTML element&#xA;with a different tag, or compose it with another component.Accepts a `ReactElement` or a function that returns the element to render. |

### Error

An error message displayed if the field control fails validation.
Renders a `<div>` element.

**Error Props:**

| Prop      | Type                                                                                                                                                                                             | Default | Description                                                                                                                                                                                                                                                                  |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| match     | `boolean \| 'valid' \| 'badInput' \| 'customError' \| 'patternMismatch' \| 'rangeOverflow' \| 'rangeUnderflow' \| 'stepMismatch' \| 'tooLong' \| 'tooShort' \| 'typeMismatch' \| 'valueMissing'` | -       | Determines whether to show the error message according to the field’s&#xA;[ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState).&#xA;Specifying `true` will always show the error message, and lets external libraries&#xA;control the visibility. |
| className | `string \| ((state: Field.Error.State) => string \| undefined)`                                                                                                                                  | -       | CSS class applied to the element, or a function that&#xA;returns a class based on the component’s state.                                                                                                                                                                     |
| style     | `CSSProperties \| ((state: Field.Error.State) => CSSProperties \| undefined)`                                                                                                                    | -       | -                                                                                                                                                                                                                                                                            |
| render    | `ReactElement \| ((props: HTMLProps, state: Field.Error.State) => ReactElement)`                                                                                                                 | -       | Allows you to replace the component’s HTML element&#xA;with a different tag, or compose it with another component.Accepts a `ReactElement` or a function that returns the element to render.                                                                                 |

**Error Data Attributes:**

| Attribute           | Type | Description                                      |
| :------------------ | :--- | :----------------------------------------------- |
| data-disabled       | -    | Present when the field is disabled.              |
| data-valid          | -    | Present when the field is in valid state.        |
| data-invalid        | -    | Present when the field is in invalid state.      |
| data-dirty          | -    | Present when the field's value has changed.      |
| data-touched        | -    | Present when the field has been touched.         |
| data-filled         | -    | Present when the field is filled.                |
| data-focused        | -    | Present when the field control is focused.       |
| data-starting-style | -    | Present when the error message is animating in.  |
| data-ending-style   | -    | Present when the error message is animating out. |

### Validity

Used to display a custom message based on the field’s validity.
Requires `children` to be a function that accepts field validity state as an argument.

**Validity Props:**

| Prop     | Type                                           | Default | Description                                                            |
| :------- | :--------------------------------------------- | :------ | :--------------------------------------------------------------------- |
| children | `((state: Field.Validity.State) => ReactNode)` | -       | A function that accepts the field validity state as an argument.```jsx |

<Field.Validity>
{(validity) => {
return <div>...</div>
}}
</Field.Validity>

```|

```
