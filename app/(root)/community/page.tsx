import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { getUsers } from '@/lib/actions/user.action'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
const Page = async () => {
    const allUsers = await getUsers();
  return (
    <><div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div><div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
              <LocalSearchBar
                  route="/"
                  iconPosition="left"
                  imgSrc="/assets/icons/search.svg"
                  placeholder="Search by username..."
                  otherClasses="flex-1" />
              <div>
                  <DropdownMenu>
                      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                      <DropdownMenuContent>
                          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                          {/* <DropdownMenuSeparator /> */}
                          {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                          <DropdownMenuItem>Billing</DropdownMenuItem>
                          <DropdownMenuItem>Team</DropdownMenuItem>
                          <DropdownMenuItem>Subscription</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </div>
          </div></>
  )
}

export default Page