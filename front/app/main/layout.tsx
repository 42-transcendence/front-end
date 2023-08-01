// TODO: get login status from backend
let isLoginned = false;

export default function MainLayout({
    login,
    main,
}: {
    login: React.ReactNode;
    main: React.ReactNode;
}) {
    return <>{isLoginned ? main : login}</>;
}
