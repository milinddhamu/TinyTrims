import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { GearIcon } from "@radix-ui/react-icons"
import { Textarea } from "@/components/ui/textarea"
export function PopoverDemo({
      metaDataState,
      handleMetaDataChange,

}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="px-[.75em]"><GearIcon className="h-4 w-4" /></Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col justify-start w-full gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="meta-title">Meta data: Title</Label>
              <Input 
                value={metaDataState.title} 
                onChange={handleMetaDataChange}
                type="text"
                name="title" 
                id="meta-title" 
                placeholder="Meta Title"
              />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="meta-description">Meta data: Description</Label>
              <Textarea 
                value={metaDataState.description}                
                onChange={handleMetaDataChange}
                type="text"
                name="description"
                id="meta-description" 
                placeholder="Meta Description"
              />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="opengraph-image">Meta data: Opengraph Image</Label>
              <Input 
                type="text"
                name="opengraphImageLink"
                value={metaDataState.opengraphImageLink}
                onChange={handleMetaDataChange}
                placeholder="Opengraph Image Link"
                id="opengraph-image" 
              />
          </div>

        </div>
      </PopoverContent>
    </Popover>
  )
}
