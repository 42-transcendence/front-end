export function ButtonOnRight({
    buttonText,
    className,
}: {
    buttonText: string;
    className: string;
}) {
    return (
        <div className="relative flex min-h-fit w-full flex-shrink-0 flex-row justify-end">
            <button className={`${className}`}>{buttonText}</button>
        </div>
    );
}
