import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
interface userT{
    user:{
        _id:string;
    clerkId:string;
    picture:string;
    name:string;
    username:string;
    }
}
const UserCard = ({user}:userT) => {
  return (
    <Link href={`/profile/${user?.clerkId}`} className='shadow-light100_darknone w-full max-xs:min-w-full
    xs:w-[260px]'>
<article className='background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8'>
    <Image src={user?.picture} alt='user profile picture' height={100} width={100} className='w-[100px] h-[100px] rounded-full object-cover'/>

<div className='mt-4 text-center'>
    <h3 className='h3-bold text-dark200_light900 line-clamp-1'>{user?.name}</h3>
    <p className='body-regular text-dark500_light500 mt-2'>@{user?.username}</p>
</div>
</article>
    </Link>
  )
}

export default UserCard