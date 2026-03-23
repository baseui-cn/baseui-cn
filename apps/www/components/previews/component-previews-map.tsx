"use client"

import type { ComponentType } from "react"

import { accordionPreviewMap } from "@/components/previews/accordion-previews"
import { avatarPreviewMap } from "@/components/previews/avatar-previews"
import { badgePreviewMap } from "@/components/previews/badge-previews"
import { blocksPreviewMap } from "@/components/previews/blocks-previews"
import { breadcrumbPreviewMap } from "@/components/previews/breadcrumb-previews"
import { buttonPreviewMap } from "@/components/previews/button-previews"
import { checkboxPreviewMap } from "@/components/previews/checkbox-previews"
import { collapsiblePreviewMap } from "@/components/previews/collapsible-previews"
import { commandPreviewMap } from "@/components/previews/command-previews"
import { formPreviewMap } from "@/components/previews/form-previews"
import { inputPreviewMap } from "@/components/previews/input-previews"
import { dialogPreviewMap } from "@/components/previews/dialog-previews"
import { alertDialogPreviewMap } from "@/components/previews/alert-dialog-previews"
import { drawerPreviewMap } from "@/components/previews/drawer-previews"
import { popoverPreviewMap } from "@/components/previews/popover-previews"
import { tooltipPreviewMap } from "@/components/previews/tooltip-previews"
import { dropdownMenuPreviewMap } from "@/components/previews/dropdown-menu-previews"
import { paginationPreviewMap } from "@/components/previews/pagination-previews"
import { progressPreviewMap } from "@/components/previews/progress-previews"
import { radioGroupPreviewMap } from "@/components/previews/radio-group-previews"
import { scrollAreaPreviewMap } from "@/components/previews/scroll-area-previews"
import { separatorPreviewMap } from "@/components/previews/separator-previews"
import { skeletonPreviewMap } from "@/components/previews/skeleton-previews"
import { switchPreviewMap } from "@/components/previews/switch-previews"
import { tablePreviewMap } from "@/components/previews/table-previews"
import { tabsPreviewMap } from "@/components/previews/tabs-previews"
import { textareaPreviewMap } from "@/components/previews/textarea-previews"
import { toastPreviewMap } from "@/components/previews/toast-previews"
import { cardPreviewMap } from "@/components/previews/card-previews"
import { itemPreviewMap } from "@/components/previews/item-previews"
import { menubarPreviewMap } from "@/components/previews/menubar-previews"
import { navigationMenuPreviewMap } from "@/components/previews/navigation-menu-previews"
import { spinnerPreviewMap } from "@/components/previews/spinner-previews"
import { emptyStatePreviewMap } from "@/components/previews/empty-state-previews"
import { togglePreviewMap } from "@/components/previews/toggle-previews"
import { toggleGroupPreviewMap } from "@/components/previews/toggle-group-previews"
import { previewCardPreviewMap } from "@/components/previews/preview-card-previews"
import { numberFieldPreviewMap } from "@/components/previews/number-field-previews"

export const previewMap: Record<string, ComponentType> = {
  ...buttonPreviewMap,
  ...checkboxPreviewMap,
  ...switchPreviewMap,
  ...radioGroupPreviewMap,
  ...inputPreviewMap,
  ...textareaPreviewMap,
  ...formPreviewMap,
  ...badgePreviewMap,
  ...skeletonPreviewMap,
  ...scrollAreaPreviewMap,
  ...separatorPreviewMap,
  ...avatarPreviewMap,
  ...progressPreviewMap,
  ...tablePreviewMap,
  ...breadcrumbPreviewMap,
  ...paginationPreviewMap,
  ...blocksPreviewMap,
  ...commandPreviewMap,
  ...collapsiblePreviewMap,
  ...tabsPreviewMap,
  ...accordionPreviewMap,
  ...dialogPreviewMap,
  ...alertDialogPreviewMap,
  ...drawerPreviewMap,
  ...popoverPreviewMap,
  ...tooltipPreviewMap,
  ...dropdownMenuPreviewMap,
  ...toastPreviewMap,
  ...cardPreviewMap,
  ...itemPreviewMap,
  ...menubarPreviewMap,
  ...navigationMenuPreviewMap,
  ...spinnerPreviewMap,
  ...emptyStatePreviewMap,
  ...togglePreviewMap,
  ...toggleGroupPreviewMap,
  ...previewCardPreviewMap,
  ...numberFieldPreviewMap,
}
