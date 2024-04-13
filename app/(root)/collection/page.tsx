import QuestionCard from "@/components/card/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import SharedFilter from "@/components/shared/SharedFilter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { QuestionFilters } from "@/constant/filters";
import { getAllSavedQuestions, getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";


export default async function Home() {
    const {userId} = auth()
    if(!userId) redirect('/sign-in');
    const user = await getUserById({userId})
    const result = await getAllSavedQuestions({clerkId:user.clerkId});
    const Questions = result.questions;
    return (
        <>
                <h1 className="h1-bold text-dark100_light900">Saved Question</h1>
            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchBar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for Questions"
                    otherClasses="flex-1"
                />
                <SharedFilter filters={QuestionFilters} otherClasses="min-h-[56px] sm:min-w-[170px]"
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
                    )) : <NoResult title="There&apos;s no Saved question to show" description="be the first to break the silence! 
                🚀 Ask a question and Kickstart the Discussion.our Query could be the next big thing others could learn from.
                 Get Involved! 💡" link="/ask-question" linkTitle="Ask A Question"/>}
            </div>
        </>
    )
}