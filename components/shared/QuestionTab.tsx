import { SearchParams } from '@/lib/actions/shared.types'
import { getUserQuestions } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import React from 'react'
import QuestionCard from '../card/QuestionCard'
interface QuestionT extends SearchParamsProps{
userId:string,
  clerkId?:string,
}
const QuestionTab = async ({searchParams,userId,clerkId}:QuestionT) => {
  const result =  await getUserQuestions({
    userId:userId,
    page:1
  })
  return (
   <>
   {
    result?.questions?.map(item=>(
      <QuestionCard key={item._id}
      _id={item._id}
      clerkId={clerkId}
      title={item.title}
      tags={item.tags}
      author={item.author}
      upvotes={item.upvotes}
      views={item.views}
      answer={item.answer}
      createdAt={item.createdAt}
  />
    ))
   }
   </>
  )
}

export default QuestionTab