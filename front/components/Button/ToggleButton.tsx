"use client";

type ToggleButtonProp = React.LabelHTMLAttributes<HTMLLabelElement> & {
    id: string;
    formID: string;
    name: string;
    bgClassName?: string;
    checked: boolean;
    setChecked: React.Dispatch<SetStateAction<boolean>>;
    icon?: ReactElement | undefined;
    children: ReactNode;
};

export function ToggleButton(props: React.PropsWithChildren<ToggleButtonProp>) {
    const {
        id,
        formID,
        name,
        icon,
        bgClassName,
        checked,
        setChecked,
        children,
        ...rest
    } = props;

    return (
        <label
            htmlFor={id}
            data-checked={checked}
            className={`group relative flex w-full flex-row items-center ${bgClassName}`}
            {...rest}
        >
            {icon}
            <input
                onChange={() => {
                    setChecked(!checked);
                }}
                checked={checked}
                form={formID}
                name={name}
                type="checkbox"
                id={id}
                className="peer hidden"
            />
            {children}
        </label>
    );
}
