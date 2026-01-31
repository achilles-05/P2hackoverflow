"use client"

import { useEffect, useState } from "react"
import { getComments, addComment } from "@/app/actions/issues"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

export function CommentsSection({ issueId }: { issueId: string }) {
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState("")
    const [sending, setSending] = useState(false)

    const loadComments = async () => {
        const data = await getComments(issueId)
        setComments(data)
    }

    useEffect(() => {
        loadComments()
    }, [issueId])

    const handleSend = async () => {
        if (!newComment.trim()) return
        setSending(true)
        const res = await addComment(issueId, newComment)
        if (res.success) {
            setNewComment("")
            loadComments()
            toast.success("Comment posted")
        } else {
            toast.error("Failed to post comment")
        }
        setSending(false)
    }

    return (
        <div className="space-y-4">
            <div className="h-[200px] w-full rounded-md border border-white/10 bg-black/20 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-xs text-center text-muted-foreground py-4">No comments yet. Be the first!</p>
                    ) : comments.map((c) => (
                        <div key={c.id} className="flex flex-col space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-primary">{c.profiles?.full_name || 'User'}</span>
                                <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                            </div>
                            <p className="text-sm text-white/90">{c.content}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-2">
                <Input
                    placeholder="Add a helpful comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-white/5 border-white/10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button size="icon" onClick={handleSend} disabled={sending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    )
}
