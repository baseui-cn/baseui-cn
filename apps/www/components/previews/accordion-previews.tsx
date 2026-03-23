"use client"

import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function AccordionPreview() {
  return (
    <Accordion className="w-full max-w-sm">
      <AccordionItem value="q1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. Full ARIA and keyboard support via Base UI Accordion.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>Does it animate?</AccordionTrigger>
        <AccordionContent>
          Yes — smooth height transitions using CSS custom properties.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q3">
        <AccordionTrigger>Can I nest content?</AccordionTrigger>
        <AccordionContent>Absolutely — any React node works inside the panel.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function AccordionBasicPreview() {
  return (
    <Accordion className="w-full max-w-sm">
      <AccordionItem value="a1">
        <AccordionTrigger>What is it?</AccordionTrigger>
        <AccordionContent>A collapsible content section.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="a2">
        <AccordionTrigger>How does it work?</AccordionTrigger>
        <AccordionContent>Click a trigger to expand or collapse the panel.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function AccordionMultiplePreview() {
  return (
    <Accordion multiple className="w-full max-w-sm">
      <AccordionItem value="m1">
        <AccordionTrigger>Section one</AccordionTrigger>
        <AccordionContent>Both sections can be open at once.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="m2">
        <AccordionTrigger>Section two</AccordionTrigger>
        <AccordionContent>Try opening both!</AccordionContent>
      </AccordionItem>
      <AccordionItem value="m3">
        <AccordionTrigger>Section three</AccordionTrigger>
        <AccordionContent>Multiple panels open simultaneously.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function AccordionDisabledPreview() {
  return (
    <Accordion className="w-full max-w-sm">
      <AccordionItem value="d1">
        <AccordionTrigger>Enabled section</AccordionTrigger>
        <AccordionContent>This one works normally.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="d2" disabled>
        <AccordionTrigger>Disabled section</AccordionTrigger>
        <AccordionContent>You can&apos;t see this.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export const accordionPreviewMap: Record<string, React.ComponentType> = {
  accordion: AccordionPreview,
  "accordion-demo": AccordionPreview,
  "accordion-basic": AccordionBasicPreview,
  "accordion-multiple": AccordionMultiplePreview,
  "accordion-disabled": AccordionDisabledPreview,
}
