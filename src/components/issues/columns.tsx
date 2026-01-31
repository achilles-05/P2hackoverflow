"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ManageIssueDialog } from "@/components/issues/manage-issue-dialog"

export type Issue = {
    id: string
    title: string
    status: "reported" | "in_progress" | "resolved" | "closed"
    priority: "low" | "medium" | "high"
    category: string
    location: string
    isPublic: boolean
}

export const columns: ColumnDef<Issue>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <Link href={`/issues/${row.original.id}`} className="font-medium hover:underline hover:text-primary">
                    {row.getValue("title")}
                </Link>
                {row.original.isPublic && (
                    <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Public
                    </span>
                )}
            </div>
        )
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "resolved" ? "default" : status === "in_progress" ? "secondary" : "outline"}>
                    {status.replace("_", " ")}
                </Badge>
            )
        }
    },
    {
        accessorKey: "priority",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Priority
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string
            return (
                <div className="capitalize">{priority}</div>
            )
        }
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <div className="capitalize">{row.getValue("category")}</div>,
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const issue = row.original

            return (
                <div className="flex items-center gap-2">
                    {/* Replaced View Details with Assign/Manage Button */}
                    <div className="flex-1">
                        <ManageIssueDialog issueId={issue.id} currentStatus={issue.status} currentPriority={issue.priority} />
                    </div>
                </div>
            )
        },
    },
]
