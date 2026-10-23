"use client"

import * as React from "react"
import { Field, FieldDescription, FieldError, FieldItem, FieldLabel } from "@/components/ui/field"
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxGroup } from "@/components/ui/checkbox-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from "@/components/ui/number-field"
import { Slider } from "@/components/ui/slider"
import { OTPField, OTPFieldInput } from "@/components/ui/otp-field"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Label } from "@/components/ui/label"

export function Phase2SystemPreview() {
  const [quantity, setQuantity] = React.useState<number | null>(3)
  const [range, setRange] = React.useState<readonly number[]>([20, 70])
  const [reference, setReference] = React.useState("INVALID")
  const [submitted, setSubmitted] = React.useState("")

  return (
    <Form
      id="phase2-system"
      aria-label="Forms and persistent controls specimen"
      onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
      style={{
        maxWidth: 760,
        fontSize: "calc(14 * var(--component-unit,.0625rem))",
        lineHeight: "calc(20 * var(--component-unit,.0625rem))",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: "calc(24 * var(--component-unit,.0625rem))",
        }}
      >
        <Fieldset>
          <FieldsetLegend>Field and validation</FieldsetLegend>
          <Field name="email">
            <FieldLabel>
              Email <span data-slot="field-required">(required)</span>
            </FieldLabel>
            <Input type="email" placeholder="you@example.com" required />
            <FieldDescription>A working address for receipts.</FieldDescription>
            <FieldError match="valueMissing">Enter an email address.</FieldError>
            <FieldError match="typeMismatch">Enter a valid email address.</FieldError>
          </Field>
          <Field invalid={reference === "INVALID"} name="reference">
            <FieldLabel>Reference</FieldLabel>
            <Input value={reference} onValueChange={setReference} />
            <FieldError match={reference === "INVALID"}>
              Reference could not be verified.
            </FieldError>
          </Field>
          <Field name="account">
            <FieldLabel>Account (read only)</FieldLabel>
            <Input readOnly defaultValue="Personal workspace" />
            <FieldDescription>Readable and selectable.</FieldDescription>
          </Field>
          <Field disabled>
            <FieldLabel>Managed by your organization</FieldLabel>
            <Input defaultValue="Organization account" />
            <FieldDescription>Disabled once at the owner.</FieldDescription>
          </Field>
        </Fieldset>
        <Fieldset>
          <FieldsetLegend>Choices</FieldsetLegend>
          <Field name="consent">
            <FieldLabel>
              <Checkbox name="consent" /> Receive updates
            </FieldLabel>
            <FieldDescription>Click the entire label row.</FieldDescription>
          </Field>
          <Label>
            <Checkbox indeterminate /> Partially selected
          </Label>
          <Label>
            <Checkbox defaultChecked disabled /> Checked and disabled
          </Label>
          <Field name="channels">
            <FieldLabel nativeLabel={false} render={<span />}>
              Channels
            </FieldLabel>
            <CheckboxGroup defaultValue={["email"]}>
              <FieldItem>
                <FieldLabel>
                  <Checkbox value="email" /> Email
                </FieldLabel>
              </FieldItem>
              <FieldItem>
                <FieldLabel>
                  <Checkbox value="push" /> Push notifications
                </FieldLabel>
              </FieldItem>
            </CheckboxGroup>
          </Field>
          <Field name="plan">
            <FieldLabel nativeLabel={false} render={<span />}>
              Plan
            </FieldLabel>
            <RadioGroup defaultValue="personal">
              <FieldItem>
                <FieldLabel>
                  <RadioGroupItem value="personal" /> Personal
                </FieldLabel>
              </FieldItem>
              <FieldItem>
                <FieldLabel>
                  <RadioGroupItem value="team" /> Team
                </FieldLabel>
              </FieldItem>
            </RadioGroup>
          </Field>
          <Field name="notifications">
            <FieldLabel>
              <Switch defaultChecked name="notifications" /> Notifications
            </FieldLabel>
          </Field>
          <Label>
            <Switch disabled defaultChecked /> Checked and disabled
          </Label>
        </Fieldset>
        <Fieldset>
          <FieldsetLegend>Numbers and verification</FieldsetLegend>
          <Field name="quantity">
            <FieldLabel>Quantity</FieldLabel>
            <NumberField min={1} max={5} value={quantity} onValueChange={setQuantity}>
              <NumberFieldGroup>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>
            <FieldDescription>1–5, controlled value: {quantity}</FieldDescription>
          </Field>
          <Field name="budget">
            <FieldLabel>Budget range</FieldLabel>
            <Slider
              value={range}
              onValueChange={(value) => setRange(Array.isArray(value) ? value : [value])}
              aria-label="Budget"
            />
            <FieldDescription>{range.join(" – ")}</FieldDescription>
          </Field>
          <Field name="verification">
            <FieldLabel>Verification code</FieldLabel>
            <OTPField length={6} className="otp-wrap-layout">
              {Array.from({ length: 6 }, (_, index) => (
                <OTPFieldInput key={index} aria-label={`Code character ${index + 1}`} />
              ))}
            </OTPField>
            <FieldDescription>
              Six full-size slots in an explicit compact two-row layout.
            </FieldDescription>
          </Field>
        </Fieldset>
        <Fieldset>
          <FieldsetLegend>Persistent actions</FieldsetLegend>
          <div className="flex flex-wrap gap-2">
            <Toggle variant="outline" defaultPressed>
              Pin
            </Toggle>
            <Toggle variant="outline">Watch</Toggle>
            <Toggle variant="outline" defaultPressed disabled>
              Locked
            </Toggle>
          </div>
          <ToggleGroup variant="outline" defaultValue={["list"]} aria-label="View">
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            variant="outline"
            orientation="vertical"
            defaultValue={["daily"]}
            aria-label="Frequency"
          >
            <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
          </ToggleGroup>
          <Fieldset disabled>
            <FieldsetLegend size="sm">Disabled group</FieldsetLegend>
            <Field>
              <FieldItem>
                <Checkbox id="phase2-group-disabled" defaultChecked />
                <Label htmlFor="phase2-group-disabled">Email reports</Label>
              </FieldItem>
            </Field>
            <Field>
              <FieldLabel>
                <Switch defaultChecked /> Sync
              </FieldLabel>
            </Field>
            <Field>
              <RadioGroup defaultValue="fixed" aria-label="Disabled plan">
                <Label>
                  <RadioGroupItem value="fixed" /> Fixed plan
                </Label>
              </RadioGroup>
            </Field>
          </Fieldset>
        </Fieldset>
      </div>
      <Button type="submit" className="self-start">
        Save preferences
      </Button>
      <output aria-live="polite" className="break-all text-xs">
        {submitted && `Submitted: ${submitted}`}
      </output>
    </Form>
  )
}
