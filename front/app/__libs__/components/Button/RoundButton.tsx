// TODO: SquareButton 과 어떻게 어떻게 잘 추상화 혹은 리팩토링 혹은 정리 혹은
// 귀찮으면 그냥 방치

export function RoundButtonBase({
    children,
    ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
    return (
        <button
            type="button"
            className="relative flex place-items-center"
            {...props}
        >
            <div className="gradient-border back-full group relative flex w-[262px] flex-col items-start gap-2 rounded-[28px] border-transparent bg-windowGlass/30 p-px px-5 py-4 backdrop-blur-[50px] transition-colors before:pointer-events-none before:rounded-[28px] before:p-px before:backdrop-brightness-100 hover:bg-primary focus:outline-2 focus:outline-gray-100 focus:ring focus:ring-violet-300 active:bg-violet-700 hover:dark:border-purple-700 hover:dark:bg-neutral-800/30">
                <span className="text-sans text-2xl font-medium">
                    {children}
                </span>
            </div>
        </button>
    );
}
