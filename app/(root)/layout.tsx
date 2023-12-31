import DesktopLeftbar from "@/components/shared/navbar/DesktopLeftbar";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";
const Layout = ({children}:{children:React.ReactNode})=>{
    return(
        <main className="background-light850_dark100 relative">
            <Navbar/>
            <div className="flex">
                <DesktopLeftbar/>
                <section className="mx-md:pb-14 flex min-h-screen flex-1 flex-col px-6 pt-36 sm:px-14">
                    <div className="mx-auto w-full max-w-5xl">
                        {children}
                    </div>
                </section>
                RightSidebar
            </div>
            Toaster
        </main>

    )
}
export default Layout;