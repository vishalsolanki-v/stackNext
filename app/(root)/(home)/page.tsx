import HomeFilters from "@/components/Home/HomeFilters";
import QuestionCard from "@/components/card/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import SharedFilter from "@/components/shared/SharedFilter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constant/filters";
import { getQuestion } from "@/lib/actions/question.action";
import Link from "next/link";
import React from "react";


export default async function Home() {
    const result = await getQuestion({});
    const Questions = result?.questions;
    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Question</h1> 
                <Link href='/ask-question' className="flex justify-end max-sm:w-full">
                    <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                        Ask a Question
                    </Button>
                </Link>
            </div>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchBar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for Questions"
                    otherClasses="flex-1"
                />
                <SharedFilter filters={HomePageFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"
                    containerClasses="hidden max-md:flex"/> 
                
            </div>
            <HomeFilters/>
            <div className="mt-10 flex w-full flex-col gap-6 ">
                {Questions.length > 0 ? 
                    Questions.map((item)=>(
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
                    )) : <NoResult title="There&apos;s no question to show" description="be the first to break the silence! 
                🚀 Ask a question and Kickstart the Discussion.our Query could be the next big thing others could learn from.
                 Get Involved! 💡" link="/ask-question" linkTitle="Ask A Question"/>}
            </div>
        </>
    )
}