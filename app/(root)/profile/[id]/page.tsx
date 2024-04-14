import { Button } from '@/components/ui/button'
import { getUserById, getUserInfo } from '@/lib/actions/user.action'
import { URLProps } from '@/types'
import { SignedIn } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { joinMonthAndYear } from '@/lib/utils'
import ProfileLink from '@/components/shared/ProfileLink'
import Stats from '@/components/shared/Stats'

const Page = async ({ params, searchParams }: URLProps) => {
    const userInfo = await getUserInfo({ userId: params?.id })
    // console.log(result,'result')
    return (
        <><div className="flex flex-col-reverse items-start justify-between sm:flex-row">
            <div className="flex flex-col items-start  gap-4 lg:flex-row">
                <Image
                    src={userInfo?.user.picture}
                    alt='profile-image'
                    height={140}
                    width={140}
                    className='rounded-full object-cover w-[140px] h-[140px]'
                />
                <div className="mt-3">
                    <h2 className='h2-bold text-dark100_light900'>{userInfo?.user?.name}</h2>
                    <p className='paragraph-regular text-dark200_light800'>@{userInfo?.user?.username}</p>
                    <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                        {userInfo?.user?.portfolioWebsite && (
                            <ProfileLink
                                imgUrl="/assets/icons/location.svg"
                                href={userInfo?.user?.portfolioWebsite}
                                title='Portfolio'
                            />
                        )}
                        {userInfo?.user?.location && (
                            <ProfileLink
                                imgUrl="/assets/icons/location.svg"
                                title={userInfo?.user?.location}
                            />
                        )}
                        <ProfileLink
                            imgUrl="/assets/icons/calendar.svg"
                            title={joinMonthAndYear(userInfo?.user?.joinedAt)}
                        />
                    </div>
                    {userInfo?.user.bio && (
                        <p className='paragraph-regular text-dark400_light800 mt-8'>{userInfo?.user?.bio}</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
                <SignedIn>
                    {params?.id === userInfo?.user.clerkId && (
                        <Link href="/profile/edit">
                            <Button className='paragraph-medium btn-secondary text-dark300_ligth900 min-h-[46px] min-w-[175px] px-4 py-3'>
                                Edit Profile
                            </Button>
                        </Link>
                    )}
                </SignedIn>
            </div>
        </div>
            {console.info(userInfo, 'userInfo')}
            <Stats
                totalQuestions={userInfo?.totalQuestions || 0}
                totalAnswers={userInfo?.totalAnswers || 0}
            />
            <div className="mt-10 flex gap-10">
                <Tabs defaultValue="top-posts" className="flex-1">
                    <TabsList className='background_light800_dark400  min-h-[42px] p-1'>
                        <TabsTrigger value="top-posts" className='tab'>Top Posts</TabsTrigger>
                        <TabsTrigger value="answer" className='tab'>Answers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="top-posts">Posts</TabsContent>
                    <TabsContent value="answer">Answer</TabsContent>
                </Tabs>

            </div>
        </>
    )
}

export default Page