let isLoginned = true;

export default function MainLayout({
    login,
    main,
}: {
    login: React.ReactNode,
    main: React.ReactNode,
}) {
    return (
        <>
            {isLoginned ? main : login}
        </>
    );
}
