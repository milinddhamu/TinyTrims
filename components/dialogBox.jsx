import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            I know already , just in case to confirm tiny tags.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" >Delete</Button>
          <Button variant="outline" >Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
