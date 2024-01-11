import Link from 'next/link';
import React from 'react'
import RenderTags from '../shared/RenderTags';
import Metrix from '../shared/Metrix';
import { convertTime, formatNumber } from '@/lib/utils';
type QuestionCartT = {
_id:string;
author:{_id:string,name:string,picture:string};
answer:Array<object>;
views:number;
upvotes:number;
tags:{_id:string,name:string}[];
title:string;
createdAt:Date;
}
const QuestionCard = ({_id,author,answer,views,upvotes,tags,title,createdAt}:QuestionCartT) => {
    return (
        <div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
            
            <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row '>
                <div>
                    <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
                        {convertTime(new Date(createdAt))}
                    </span>
                    <Link href={`/question/${_id}`}>
                        <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
                            {title}
                        </h3>
                    </Link>
                </div>
                {/* signed in */}
            </div>
            <div className='mt-3.5 flex flex-wrap gap-2 '>
                {tags.map((item)=>(
                    <RenderTags key={item._id} _id={item._id} name={item.name}/>
                ))}
            </div>
            <div className='flex-between mt-6 w-full flex-wrap gap-3'>
                <Metrix
                    imgUrl="/assets/icons/avatar.svg"
                    alt="User"
                    value={author.name}
                    title={` - asked ${convertTime(createdAt)}`}
                    href={`/profile/${author._id}`}
                    isAuthor
                    textStyles="body-medium text-dark400_light700"
                />
                <Metrix
                    imgUrl="/assets/icons/like.svg"
                    alt="UpVotes"
                    value={formatNumber(upvotes)}
                    title=" Votes"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metrix
                    imgUrl="/assets/icons/message.svg"
                    alt="message"
                    value={formatNumber(answer.length)}
                    title=" Answers"
                    textStyles="small-medium text-dark400_light800"
                />
                <Metrix
                    imgUrl="/assets/icons/eye.svg"
                    alt="eye"
                    value={formatNumber(views)}
                    title=" Views"
                    textStyles="small-medium text-dark400_light800"
                />
            </div>
        </div>
    )
}

export default QuestionCard
