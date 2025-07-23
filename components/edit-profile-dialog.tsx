"use client"

import { useState } from "react"
import { useAuthContext } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, updateProfile } = useAuthContext()
  const { toast } = useToast()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!user || !displayName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid name",
        variant: "destructive",
      })
      return
    }

    if (displayName.trim() === user.displayName) {
      onOpenChange(false)
      return
    }

    setIsLoading(true)
    try {
      await updateProfile({ displayName: displayName.trim() })
      toast({
        title: "Success",
        description: "Your profile has been updated successfully",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setDisplayName(user?.displayName || "")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your display name. Other profile information cannot be changed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="col-span-3"
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-muted-foreground">
              Email
            </Label>
            <div className="col-span-3">
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-muted-foreground">
              Role
            </Label>
            <div className="col-span-3">
              <Input
                value={user?.role || ""}
                disabled
                className="bg-muted text-muted-foreground capitalize"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Account type cannot be changed
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={isLoading || !displayName.trim() || displayName.trim() === user?.displayName}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
