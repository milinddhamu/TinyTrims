import { GearIcon } from "@radix-ui/react-icons"

import { Toggle } from "@/components/ui/toggle"

export function ToggleOutline({setState}) {
  const handleSetState = () => setState((prev)=> !prev)
  return (
    <Toggle variant="outline" aria-label="Toggle settings" onClick={handleSetState}>
      <GearIcon className="h-4 w-4" />
    </Toggle>
  )
}
