import Answer from '@/components/forms/Answer';
import AllAnswers from '@/components/shared/AllAnswers';
import Metrix from '@/components/shared/Metrix';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTags from '@/components/shared/RenderTags';
import Votes from '@/components/shared/Votes';
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserById } from '@/lib/actions/user.action';
import { convertTime, formatNumber } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Page = async ({ params, searchParams }: any) => {
  // console.info(params, searchParams)
  const result = await getQuestionById({ questionId: params.id });
  const { userId: clerkId } = auth();
  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId })
  }
  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <Link href={`/profile/${result?.author?.clerkId}`} className='flex items-center justify-start gap-1'>
            <Image
              src={result?.author?.picture}
              width={22}
              height={22}
              className='rounded-full w-[22px] h-[22px]'
              alt='author profile picture'
            />
            <p className='paragraph-semibold text-dark300_light700'>{result?.author?.name}</p>
          </Link>
          <div className='flex justify-end'>
            <Votes
              type="Question"
              itemId={JSON.stringify(result?._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={result?.upvotes?.length}
              hasupVoted={result?.upvotes?.includes(mongoUser?._id)}
              downvotes={result?.downvotes?.length}
              hasdownVoted={result?.downvotes?.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved?.includes(result._id)}
            />
          </div>
        </div>
        <p className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>{result?.title} </p>

      </div>
      <div className='mb-8 mt-5 flex flex-wrap gap-4'>
        <Metrix
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${convertTime(result?.createdAt)}`}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metrix
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatNumber(result?.answer?.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metrix
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumber(result?.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result?.content} />
      <div className='mt-8 flex flex-wrap gap-2'>
        {result?.tags?.map((tag: any) => (
          <RenderTags _id={tag?._id} showCount={false} key={tag?._id} name={tag?.name} />
        ))}
      </div>

      <AllAnswers questionId={result?._id} userId={JSON.stringify(mongoUser?._id)} totalAnswers={result?.answers?.length} />

      <Answer question={result?.content} questionId={JSON.stringify(result?._id)} authorId={JSON.stringify(mongoUser?._id)} />
    </>
  )
}

export default Page