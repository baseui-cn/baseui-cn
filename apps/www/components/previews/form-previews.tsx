"use client"

import { buttonPreviewMap } from "@/components/previews/button-previews"
import { checkboxPreviewMap } from "@/components/previews/checkbox-previews"
import { switchPreviewMap } from "@/components/previews/switch-previews"
import { radioGroupPreviewMap } from "@/components/previews/radio-group-previews"
import { inputPreviewMap } from "@/components/previews/input-previews"
import { textareaPreviewMap } from "@/components/previews/textarea-previews"
import { labelPreviewMap } from "@/components/previews/label-previews"
import { selectPreviewMap } from "@/components/previews/select-previews"
import { comboboxPreviewMap } from "@/components/previews/combobox-previews"
import { autocompletePreviewMap } from "@/components/previews/autocomplete-previews"
import { sliderPreviewMap } from "@/components/previews/slider-previews"
import { inputGroupPreviewMap } from "@/components/previews/input-group-previews"

export const formPreviewMap: Record<string, React.ComponentType> = {
  ...buttonPreviewMap,
  ...checkboxPreviewMap,
  ...switchPreviewMap,
  ...radioGroupPreviewMap,
  ...inputPreviewMap,
  ...textareaPreviewMap,
  ...labelPreviewMap,
  ...selectPreviewMap,
  ...comboboxPreviewMap,
  ...autocompletePreviewMap,
  ...sliderPreviewMap,
  ...inputGroupPreviewMap,
}
