"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Search, Ghost, UserCheck, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ReportLostItemDialog } from "@/components/lost-found/report-lost-item-dialog"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getLostItems, claimItem } from "@/app/actions/lost-found"
import { useRouter } from "next/navigation"

export default function LostFoundPage() {
    const [items, setItems] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    const fetchItems = async () => {
        setIsLoading(true)
        const data = await getLostItems()
        setItems(data || [])
        setIsLoading(false)
    }

    useEffect(() => {
        fetchItems()
    }, [])

    const handleRefresh = () => {
        fetchItems()
        router.refresh()
    }

    const filteredLostItems = items.filter(item =>
        item.type === 'lost' && item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const filteredFoundItems = items.filter(item =>
        item.type === 'found' && item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl font-extrabold tracking-tight text-primary">
                        Lost & Found
                    </h2>
                    <p className="text-muted-foreground mt-2">Report lost items or help return found ones to their owners.</p>
                </motion.div>
                <ReportLostItemDialog onReport={handleRefresh} />
            </div>

            <Tabs defaultValue="lost" className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2 p-1 bg-muted/50">
                        <TabsTrigger value="lost" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Lost Items</TabsTrigger>
                        <TabsTrigger value="found" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Found Items</TabsTrigger>
                    </TabsList>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search items..."
                            className="pl-9 w-full md:w-[300px] bg-background/50 border-white/20 focus:ring-primary/20 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="lost" className="space-y-4">
                            <ItemList items={filteredLostItems} type="lost" onRefresh={handleRefresh} />
                        </TabsContent>

                        <TabsContent value="found" className="space-y-4">
                            <ItemList items={filteredFoundItems} type="found" onRefresh={handleRefresh} />
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    )
}

function ItemList({ items, type, onRefresh }: { items: any[], type: 'lost' | 'found', onRefresh: () => void }) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                <Ghost className="h-16 w-16 mb-4" />
                <p>No items found in this section.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((thing, index) => (
                <motion.div
                    key={thing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                    <ItemCard item={thing} onRefresh={onRefresh} />
                </motion.div>
            ))}
        </div>
    )
}

function ItemCard({ item, onRefresh }: { item: any, onRefresh: () => void }) {
    const [claimOpen, setClaimOpen] = useState(false)
    const [remarks, setRemarks] = useState("")
    const [contact, setContact] = useState("")
    const [name, setName] = useState("")

    const handleAction = () => {
        setClaimOpen(true)
    }

    const submitClaim = async () => {
        if (!contact || !name) {
            toast.error("Please fill in all details")
            return
        }
        toast("Processing...", { duration: 1000 })
        const fullMessage = `Contact: ${contact} | Name: ${name} | Msg: ${remarks}`
        const result = await claimItem(item.id, fullMessage)

        if (result.success) {
            setClaimOpen(false)
            toast.success("Got it!", {
                description: "You will be contacted by the original owner soon."
            })
            onRefresh()
        } else {
            toast.error("Error", { description: result.error })
        }
    }

    return (
        <>
            <Card className="glass border-white/20 hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-300 overflow-hidden group hover:shadow-xl hover:-translate-y-1">
                <div className="h-40 bg-gradient-to-br from-primary/5 to-transparent flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 relative">
                    <span className="drop-shadow-sm">{item.image_url || ((item.type === 'lost') ? '❓' : '🧥')}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg font-semibold line-clamp-1">{item.title}</CardTitle>
                        <Badge variant={item.type === 'lost' ? 'destructive' : item.type === 'found' ? 'secondary' : 'outline'} className="uppercase text-[10px] tracking-wider px-2 py-0.5">
                            {item.type}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pb-4 space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span className="font-medium">Reported by Student</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full font-medium shadow-md hover:shadow-lg transition-all"
                        variant={item.type === 'lost' ? 'default' : 'outline'}
                        onClick={handleAction}
                        disabled={item.status === 'claimed' || item.status === 'resolved'}
                    >
                        {item.status === 'claimed' ? 'Successfully Claimed' : (item.type === 'lost' ? 'I Found This' : 'This is Mine')}
                    </Button>
                </CardFooter>
            </Card>

            <Dialog open={claimOpen} onOpenChange={setClaimOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {item.type === 'lost' ? 'Report as Found' : 'Claim Item'}
                        </DialogTitle>
                        <DialogDescription>
                            Please provide your contact details so the owner can reach you.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contact">Contact Number</Label>
                            <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+91..." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="remarks">Message / Details</Label>
                            <Textarea
                                id="remarks"
                                placeholder="Where did you find it? / Proof of ownership..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={submitClaim} className="bg-primary hover:bg-primary/90 text-primary-foreground">Submit Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}