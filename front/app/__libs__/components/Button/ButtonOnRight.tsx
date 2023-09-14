export function ButtonOnRight({
    buttonText,
    className,
    onClick,
}: {
    buttonText: string;
    className: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) {
    return (
        <div className="relative flex min-h-fit w-full flex-shrink-0 flex-row justify-end">
            <button onClick={onClick} type="submit" className={`${className}`}>
                {buttonText}
            </button>
        </div>
    );
}
