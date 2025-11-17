"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAdminUser, useAdminActions } from "@/hooks/use-admin"
import { Loader2 } from "lucide-react"

interface EditUserLimitsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  onSuccess?: () => void
}

export function EditUserLimitsDialog({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: EditUserLimitsDialogProps) {
  const { user, isLoading, refetch } = useAdminUser(userId)
  const { updateUserLimits, isUpdatingLimits } = useAdminActions()
  const [maxTopics, setMaxTopics] = useState<number>(0)
  const [maxQuizzes, setMaxQuizzes] = useState<number>(0)
  const [maxDocuments, setMaxDocuments] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && open) {
      setMaxTopics(user.subscription?.maxTopics ?? 0)
      setMaxQuizzes(user.subscription?.maxQuizzes ?? 0)
      setMaxDocuments(user.subscription?.maxDocuments ?? 0)
      setError(null)
    }
  }, [user, open])

  const handleSave = async () => {
    if (!user) return

    setError(null)

    try {
      await updateUserLimits(userId, {
        maxTopics: maxTopics > 0 ? maxTopics : undefined,
        maxQuizzes: maxQuizzes > 0 ? maxQuizzes : undefined,
        maxDocuments: maxDocuments > 0 ? maxDocuments : undefined,
      })
      await refetch()
      onSuccess?.()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to update user limits")
    }
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User Limits</DialogTitle>
          <DialogDescription>
            Update limits for {user?.name || user?.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="maxTopics">Max Topics</Label>
            <Input
              id="maxTopics"
              type="number"
              min="0"
              value={maxTopics}
              onChange={(e) => setMaxTopics(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-gray-500">
              Current: {user?.subscription?.maxTopics || 0} • Used:{" "}
              {user?.usage.topicsCount || 0}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxQuizzes">Max Quizzes</Label>
            <Input
              id="maxQuizzes"
              type="number"
              min="0"
              value={maxQuizzes}
              onChange={(e) => setMaxQuizzes(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-gray-500">
              Current: {user?.subscription?.maxQuizzes || 0} • Used:{" "}
              {user?.usage.quizzesCount || 0}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxDocuments">Max Documents</Label>
            <Input
              id="maxDocuments"
              type="number"
              min="0"
              value={maxDocuments}
              onChange={(e) => setMaxDocuments(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-gray-500">
              Current: {user?.subscription?.maxDocuments ?? 0} • Used:{" "}
              {user?.usage.documentsCount ?? 0}
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdatingLimits}>
            {isUpdatingLimits ? (
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
