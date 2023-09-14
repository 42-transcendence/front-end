export function GlassWindow({ children }: { children: React.ReactNode }) {
    return (
        <div className="gradient-border relative flex w-80 flex-col items-start rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[20px] backdrop-brightness-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-['']">
            {children}
        </div>
    );
}
