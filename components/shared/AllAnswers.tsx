import React from 'react'
import SharedFilter from './SharedFilter';
import { AnswerFilters } from '@/constant/filters';
import { getAnswer } from '@/lib/actions/answer.action';
import Link from 'next/link';
import Image from 'next/image';
import { convertTime } from '@/lib/utils';
import ParseHTML from './ParseHTML';
interface AnswerT{
    questionId:string;
    userId:string;
    totalAnswers:number;
    page?: number;
    filters?: number;
}

const AllAnswers = async ({questionId,userId,totalAnswers}:AnswerT) => {
    const results = await getAnswer({questionId})
  return (
    <div className='mt-11'>
        <div className="flex items-center justify-between">
            <h3 className='primary-text-gradient'>{totalAnswers} Answers</h3>
            <SharedFilter
            filters={AnswerFilters}
            />
        </div>
        <div>
{results?.answers?.map((answer)=>(
    <article key={answer?._id} className='light-border border-b py-10'>
<div className="flex items-center justify-between">
    <div className='mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'> <Link href={`/profile/${answer?.author?.clerkId}`}
    className='flex flex-1 items-start gap-1 sm:items-center'>
        <Image
        src={answer?.author?.picture}
        width={18}
        height={18}
        alt='profile'
        className='rounded-full object-cover max-sm:mt-0.5'
        />
    <div className='flex flex-col sm:flex-row sm:items-center '>
        <p className='body-semibold text-dark300_light700'>{answer?.author?.name}</p>
        <p className='small-regular text-light400_light500 mt-0.5 line-clamp-1 ml-0.5'><span className='max-sm:hidden0'>{" "}-</span> answerd {" "} {convertTime(answer?.createdAt)}</p>
    </div>
    </Link> 
    <div className='flex justify-end'>
VOTING
    </div>
    </div>
</div>
    <ParseHTML
    data={answer?.content}
    />
    </article>
))}
        </div>
    </div>
  )
}

export default AllAnswers