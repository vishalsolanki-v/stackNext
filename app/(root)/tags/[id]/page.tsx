import QuestionCard from '@/components/card/QuestionCard'
import NoResult from '@/components/shared/NoResult'
import LocalSearchBar from '@/components/shared/search/LocalSearchBar'
import { getQuestionByTagId } from '@/lib/actions/tags.action'
import { URLProps } from '@/types'
import React from 'react'

const page = async ({params,searchParams}:URLProps) => {
const result = await getQuestionByTagId({tagId:params.id,page:1,searchQuery:searchParams.q})
const Questions = result?.questions
  return (
    <>
                <h1 className="h1-bold text-dark100_light900">{result?.tagTitle}</h1>
            <div className="mt-11 w-full">
                <LocalSearchBar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for Questions"
                    otherClasses="flex-1"
                />
            </div>
            <div className="mt-10 flex w-full flex-col gap-6 ">
                {Questions.length > 0 ?
                    Questions.map((item:any)=>(
                        <QuestionCard key={item._id}
                            _id={item._id}
                            title={item.title}
                            tags={item.tags}
                            author={item.author}
                            upvotes={item.upvotes}
                            views={item.views}
                            answer={item.answer}
                            createdAt={item.createdAt}
                        />
                    )) : <NoResult title="There&apos;s no Tag question to show" description="be the first to break the silence! 
                🚀 Ask a question and Kickstart the Discussion.our Query could be the next big thing others could learn from.
                 Get Involved! 💡" link="/ask-question" linkTitle="Ask A Question"/>}
            </div>
        </>
  )
}

export default page