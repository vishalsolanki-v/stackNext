"use client"
import { downVoteAnswer, upVoteAnswer } from '@/lib/actions/answer.action';
import { downVoteQuestion, upVoteQuestion } from '@/lib/actions/question.action';
import { toggleSavedQuestion } from '@/lib/actions/user.action';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import { usePathname,useRouter } from 'next/navigation';
import React from 'react'
interface votesT {
    type: string;
    userId: string;
    itemId: string;
    hasdownVoted: boolean;
    hasupVoted: boolean;
    upvotes: number;
    downvotes: number;
    hasSaved?: boolean;
}
const Votes = ({ type, userId, itemId, hasdownVoted, hasupVoted, upvotes, downvotes, hasSaved }: votesT) => {
   const pathname = usePathname();
   const router = useRouter();
    const handleSave = async()=>{
        await toggleSavedQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname
        })
   }

    const handleVote = async (action: string) => {
        if (!userId) {
            return;
        }
        if (action === 'upvote') {
            if (type === 'Question') {
                await upVoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname
                })
            }
            else if(type==='Answer'){
                await upVoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname
                })
            }
//Todo: show toast
            return;
        }
        if (action === 'downvote') {
            if (type === 'Question') {
                await downVoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname
                })
            }
            else if(type==='Answer'){
                await downVoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname
                })
            }
//Todo: show toast
            return;
        }
    }

    return (
        <div className='flex gap-5'>
            <div className="flex-center gap-2.5">
                <div className='flex-center gap-1.5'>
                    <Image src={hasupVoted ? '/assets/icons/upvoted.svg' : '/assets/icons/upvote.svg'}
                        width={18} height={18} alt='upVote'
                        className='cursor-pointer'
                        onClick={() => handleVote('upvote')}
                    />
                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className='subtle-medium text-dark400_light900'>
                            {formatNumber(upvotes || 0)}
                        </p>
                    </div>
                </div>
                <div className='flex-center gap-1.5'>
                    <Image src={hasdownVoted ? '/assets/icons/downvoted.svg' : '/assets/icons/downvote.svg'}
                        width={18} height={18} alt='upVote'
                        className='cursor-pointer'
                        onClick={() => handleVote('downvote')}
                    />
                    <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                        <p className='subtle-medium text-dark400_light900'>
                            {formatNumber(downvotes || 0)}
                        </p>
                    </div>
                </div>
            </div>
            {type === 'Question' && <Image src={hasSaved ? '/assets/icons/star-filled.svg' : '/assets/icons/star-red.svg'}
                width={18} height={18} alt='star'
                className='cursor-pointer'
                onClick={handleSave}
            />}
        </div>
    )
}

export default Votes