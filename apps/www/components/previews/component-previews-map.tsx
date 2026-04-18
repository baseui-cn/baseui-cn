"use client"

import type { ComponentType } from "react"

import { accordionPreviewMap } from "@/components/previews/accordion-previews"
import { alertPreviewMap } from "@/components/previews/alert-previews"
import { alertDialogPreviewMap } from "@/components/previews/alert-dialog-previews"
import { autocompletePreviewMap } from "@/components/previews/autocomplete-previews"
import { avatarPreviewMap } from "@/components/previews/avatar-previews"
import { badgePreviewMap } from "@/components/previews/badge-previews"
import { blocksPreviewMap } from "@/components/previews/blocks-previews"
import { breadcrumbPreviewMap } from "@/components/previews/breadcrumb-previews"
import { buttonPreviewMap } from "@/components/previews/button-previews"
import { cardPreviewMap } from "@/components/previews/card-previews"
import { checkboxPreviewMap } from "@/components/previews/checkbox-previews"
import { collapsiblePreviewMap } from "@/components/previews/collapsible-previews"
import { comboboxPreviewMap } from "@/components/previews/combobox-previews"
import { commandPreviewMap } from "@/components/previews/command-previews"
import { dataGridPreviewMap } from "@/components/previews/data-grid-previews"
import { dialogPreviewMap } from "@/components/previews/dialog-previews"
import { drawerPreviewMap } from "@/components/previews/drawer-previews"
import { dropdownMenuPreviewMap } from "@/components/previews/dropdown-menu-previews"
import { emptyStatePreviewMap } from "@/components/previews/empty-state-previews"
import { fieldPreviewMap } from "@/components/previews/field-previews"
import { fieldsetPreviewMap } from "@/components/previews/fieldset-previews"
import { framePreviewMap } from "@/components/previews/frame-previews"
import { formPreviewMap } from "@/components/previews/form-previews"
import { inputPreviewMap } from "@/components/previews/input-previews"
import { inputGroupPreviewMap } from "@/components/previews/input-group-previews"
import { itemPreviewMap } from "@/components/previews/item-previews"
import { labelPreviewMap } from "@/components/previews/label-previews"
import { menubarPreviewMap } from "@/components/previews/menubar-previews"
import { navigationMenuPreviewMap } from "@/components/previews/navigation-menu-previews"
import { numberFieldPreviewMap } from "@/components/previews/number-field-previews"
import { otpFieldPreviewMap } from "@/components/previews/otp-field-previews"
import { paginationPreviewMap } from "@/components/previews/pagination-previews"
import { popoverPreviewMap } from "@/components/previews/popover-previews"
import { previewCardPreviewMap } from "@/components/previews/preview-card-previews"
import { progressPreviewMap } from "@/components/previews/progress-previews"
import { radioGroupPreviewMap } from "@/components/previews/radio-group-previews"
import { scrollAreaPreviewMap } from "@/components/previews/scroll-area-previews"
import { selectPreviewMap } from "@/components/previews/select-previews"
import { separatorPreviewMap } from "@/components/previews/separator-previews"
import { skeletonPreviewMap } from "@/components/previews/skeleton-previews"
import { sliderPreviewMap } from "@/components/previews/slider-previews"
import { spinnerPreviewMap } from "@/components/previews/spinner-previews"
import { switchPreviewMap } from "@/components/previews/switch-previews"
import { tablePreviewMap } from "@/components/previews/table-previews"
import { tabsPreviewMap } from "@/components/previews/tabs-previews"
import { textareaPreviewMap } from "@/components/previews/textarea-previews"
import { toastPreviewMap } from "@/components/previews/toast-previews"
import { togglePreviewMap } from "@/components/previews/toggle-previews"
import { toggleGroupPreviewMap } from "@/components/previews/toggle-group-previews"
import { tooltipPreviewMap } from "@/components/previews/tooltip-previews"

export const previewMap: Record<string, ComponentType> = {
  // Display
  ...alertPreviewMap,
  ...avatarPreviewMap,
  ...badgePreviewMap,
  ...cardPreviewMap,
  ...emptyStatePreviewMap,
  ...itemPreviewMap,
  ...previewCardPreviewMap,
  ...progressPreviewMap,
  ...separatorPreviewMap,
  ...skeletonPreviewMap,
  ...spinnerPreviewMap,

  // Form
  ...autocompletePreviewMap,
  ...buttonPreviewMap,
  ...checkboxPreviewMap,
  ...comboboxPreviewMap,
  ...fieldPreviewMap,
  ...fieldsetPreviewMap,
  ...formPreviewMap,
  ...inputPreviewMap,
  ...inputGroupPreviewMap,
  ...labelPreviewMap,
  ...numberFieldPreviewMap,
  ...otpFieldPreviewMap,
  ...radioGroupPreviewMap,
  ...selectPreviewMap,
  ...sliderPreviewMap,
  ...switchPreviewMap,
  ...textareaPreviewMap,
  ...togglePreviewMap,
  ...toggleGroupPreviewMap,

  // Overlays
  ...alertDialogPreviewMap,
  ...dialogPreviewMap,
  ...drawerPreviewMap,
  ...dropdownMenuPreviewMap,
  ...popoverPreviewMap,
  ...toastPreviewMap,
  ...tooltipPreviewMap,

  // Layout & Navigation
  ...accordionPreviewMap,
  ...breadcrumbPreviewMap,
  ...collapsiblePreviewMap,
  ...commandPreviewMap,
  ...dataGridPreviewMap,
  ...framePreviewMap,
  ...menubarPreviewMap,
  ...navigationMenuPreviewMap,
  ...paginationPreviewMap,
  ...scrollAreaPreviewMap,
  ...tablePreviewMap,
  ...tabsPreviewMap,

  // Blocks
  ...blocksPreviewMap,
}
