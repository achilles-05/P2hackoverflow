"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Info, Upload, Eye, EyeOff, Loader2 } from "lucide-react"
import { createIssue, getUserProfile } from "@/app/actions/issues"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    title: z.string().min(5, {
        message: "Title must be at least 5 characters.",
    }),
    category: z.string().min(1, {
        message: "Please select a category.",
    }),
    priority: z.enum(["low", "medium", "high"]),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    location: z.string().min(2, {
        message: "Room number or location is required.",
    }),
    isPublic: z.boolean(),
})

const mockExistingIssues = [
    { title: "Fan not working", location: "Room 101" },
    { title: "Tap leaking", location: "Bathroom 3" },
    { title: "Wifi slow", location: "Block A" }
]

export function ReportIssueForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            location: "",
            description: "",
            priority: "medium",
            isPublic: true,
        },
    })

    const title = useWatch({ control: form.control, name: "title" })
    const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)

    useEffect(() => {
        if (title && title.length > 3) {
            const match = mockExistingIssues.find(issue =>
                issue.title.toLowerCase().includes(title.toLowerCase())
            )
            if (match) {
                setDuplicateWarning(`Possible duplicate: "${match.title}" in ${match.location}`)
            } else {
                setDuplicateWarning(null)
            }
        } else {
            setDuplicateWarning(null)
        }
    }, [title])

    const handleUseRegisteredLocation = async () => {
        toast("Fetching profile...", { duration: 1000 })
        const profile = await getUserProfile()
        if (profile) {
            const registeredLoc = `${profile.hostel_block} - Room ${profile.room_no}`
            form.setValue("location", registeredLoc)
            toast.success("Location Auto-filled")
        } else {
            toast.error("Could not fetch profile")
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        const formData = new FormData()
        formData.append("title", values.title)
        formData.append("category", values.category)
        formData.append("priority", values.priority)
        formData.append("description", values.description)
        formData.append("location", values.location)
        formData.append("isPublic", String(values.isPublic))

        if (selectedFile) {
            formData.append("image", selectedFile)
        }

        const result = await createIssue(formData)

        if (result.success) {
            toast.success("Issue submitted successfully", {
                description: "The warden will be notified immediately.",
            })
            form.reset()
            setSelectedFile(null)
            setDuplicateWarning(null)
            router.refresh()
        } else {
            toast.error("Failed to submit issue", {
                description: result.error || "Please try again."
            })
        }
        setIsSubmitting(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {duplicateWarning && (
                    <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-lg flex items-center gap-2 text-yellow-500 animate-in fade-in slide-in-from-top-1">
                        <Info className="h-5 w-5" />
                        <div>
                            <h4 className="font-semibold text-sm">Possible Duplicate Detected</h4>
                            <p className="text-xs">{duplicateWarning}. Please check if this issue is already reported.</p>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Issue Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Leaking tap in bathroom" {...field} className="bg-white/5 border-white/10" />
                                </FormControl>
                                <FormDescription>
                                    A short summary of the problem.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-white/5 border-white/10">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="plumbing">Plumbing</SelectItem>
                                        <SelectItem value="electrical">Electrical</SelectItem>
                                        <SelectItem value="furniture">Furniture</SelectItem>
                                        <SelectItem value="cleaning">Cleaning</SelectItem>
                                        <SelectItem value="internet">Internet</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Location / Room No</FormLabel>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="h-auto p-0 text-xs text-primary"
                                        onClick={handleUseRegisteredLocation}
                                    >
                                        Use Registered Room
                                    </Button>
                                </div>
                                <FormControl>
                                    <Input placeholder="e.g. Room 302, Block A" {...field} className="bg-white/5 border-white/10" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Priority</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-4"
                                    >
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="low" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Low</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="medium" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Medium</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="high" />
                                            </FormControl>
                                            <FormLabel className="font-normal">High</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us more about the issue..."
                                    className="resize-none min-h-[120px] bg-white/5 border-white/10"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Media Upload */}
                    <div className="flex-1 space-y-4">
                        <FormLabel>Upload Evidence (Optional)</FormLabel>
                        <div className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setSelectedFile(e.target.files[0])
                                    }
                                }}
                            />
                            <div className="flex flex-col items-center">
                                <Upload className="h-8 w-8 mb-2" />
                                <span className="text-sm font-medium">
                                    {selectedFile ? selectedFile.name : "Click to upload image"}
                                </span>
                                {!selectedFile && <span className="text-xs text-gray-500 mt-1">(Max 5MB)</span>}
                            </div>
                        </div>
                    </div>

                    {/* Visibility Toggle */}
                    <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 space-y-0 flex-1 bg-white/5">
                                <div className="space-y-0.5">
                                    <FormLabel className="test-base flex items-center gap-2">
                                        {field.value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        {field.value ? "Public Issue" : "Private Issue"}
                                    </FormLabel>
                                    <FormDescription>
                                        {field.value
                                            ? "Visible to all students. Good for common issues."
                                            : "Visible only to you and the warden."}
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Report"}
                </Button>
            </form>
        </Form>
    )
}