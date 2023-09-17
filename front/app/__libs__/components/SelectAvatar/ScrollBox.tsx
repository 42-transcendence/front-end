export function ScrollBox({ children }: React.PropsWithChildren) {
    return (
        <div className="z-20 flex snap-x snap-mandatory flex-row gap-5 overflow-auto pb-10">
            <div className="shrink-0 snap-center">
                <div className="w-9 shrink-0"></div>
            </div>
            {children}
            <div className="shrink-0 snap-center">
                <div className="w-9 shrink-0"></div>
            </div>
        </div>
    );
}
