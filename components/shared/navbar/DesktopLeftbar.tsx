"use client"
import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constant';
import { SignedOut, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const DesktopLeftbar = () => {
    const pathName =  usePathname();
const {userId} = useAuth();
    return (
        <section className='custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0
         flex h-screen w-fit flex-col justify-between 
         overflow-y-auto border-r p-6 pt-36 shadow-light-300 max-sm:hidden lg:w-[266px] dark:shadow-none'>
            <div className="flex flex-1 flex-col gap-6"> 
                { sidebarLinks.map((item)=>{
                    const isActive = (pathName.includes(item.route)&&item.route.length>1)||pathName === item.route;
                    if (item?.route === '/profile') {
                        if (userId) {
                            item.route = `${item.route}/${userId}`
                        }
                        else {
                            return null;
                        }
                    }
                    return (
                        <Link href={item.route} key={item.route} className={`${isActive?
                            'primary-gradient rounded-lg text-light-900':
                            'text-dark300_light900'} flex items-center justify-start gap-4 bg-transparent p-4`}>
                            <Image className={`${isActive?"":"invert-colors"}`} 
                                src={item.imgURL} alt={item?.alt} width={20} height={20}/>
                            <p className={`${isActive? 'base-bold':'base-medium'} max-lg:hidden`}>{item.label}</p> 
                        </Link>
                    )})}
            </div> 
            <SignedOut>
                <div className='flex flex-col gap-3 pt-8'>
                    <Link href='/signin'>
                        <Button className='small-medium btn-secondary
                                     min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                            <Image src='/assets/icons/account.svg' alt='login' height={20} width={20}
                                className='invert-colors lg:hidden'/>
                            <span className='primary-text-gradient max-lg:hidden'>Log In</span>
                        </Button>
                    </Link>
                    <Link href='/signup'>
                        <Button className='small-medium btn-tertiary light-border-2
                                     text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                            <Image src='/assets/icons/sign-up.svg' alt='signup' height={20} width={20}
                                className='invert-colors lg:hidden'/>
                            <span className='max-lg:hidden'>Sign In</span>
                        </Button>
                    </Link>
                </div>
            </SignedOut>
        </section>
    )
}

export default DesktopLeftbar
