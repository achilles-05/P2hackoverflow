export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 opacity-20 animate-pulse pointer-events-none" />
            <div className="w-full max-w-md relative z-10">{children}</div>
        </div>
    )
}
