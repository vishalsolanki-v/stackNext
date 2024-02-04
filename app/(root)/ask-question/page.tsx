import Question from '@/components/forms/Question'
import { getUserById } from '@/lib/actions/user.action';
// import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {
    // const {userId} = auth();
    const userId = "123456789";
    if(!userId) redirect('/sign-in');
    // console.info(userId)
    const mongoUser = await getUserById({userId});
    // console.info(mongoUser,'mongouser 1')
    return (
        <div>
            <h1 className='h1-bold text-dark100_light900'></h1>
            <div className='mt-9'>
                <Question mongoUserId={JSON.stringify(mongoUser._id)}/>
            </div>
        </div>
    )
}

export default Page
