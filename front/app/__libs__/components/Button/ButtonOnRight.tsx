export function ButtonOnRight({
    buttonText,
    className,
    onClick,
    disabled,
}: {
    buttonText: string;
    className: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    disabled?: boolean | undefined;
}) {
    return (
        <div className="relative flex min-h-fit w-full flex-shrink-0 flex-row justify-end">
            <button
                disabled={disabled}
                onClick={onClick}
                type="submit"
                className={`${className}`}
            >
                {buttonText}
            </button>
        </div>
    );
}
