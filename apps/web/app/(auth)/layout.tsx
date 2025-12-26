
interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {

    return (
        <div className="flex h-screen items-center justify-center p-4">
            {children}
        </div>
    )

}
export default Layout