"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { createVote } from "@/lib/actions/vote.action";
import {
  isDatabaseUnavailable,
  readBrowserValue,
  writeBrowserValue,
} from "@/lib/browser-db";
import { formatNumber } from "@/lib/utils";

interface Params {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}

const Votes = ({
  upvotes,
  downvotes,
  hasVotedPromise,
  targetId,
  targetType,
}: Params) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { success, data } = use(hasVotedPromise);

  const [isLoading, setIsLoading] = useState(false);
  const [localVote, setLocalVote] = useState<"upvote" | "downvote" | null>();
  const [voteCounts, setVoteCounts] = useState({ upvotes, downvotes });
  const storageKey = userId ? `vote:${userId}:${targetType}:${targetId}` : null;

  useEffect(() => {
    if (!storageKey) return;
    readBrowserValue<"upvote" | "downvote" | null>(storageKey)
      .then((vote) => {
        if (vote !== null) setLocalVote(vote);
      })
      .catch(() => {});
  }, [storageKey]);

  const currentVote =
    localVote !== undefined
      ? localVote
      : data?.hasUpvoted
        ? "upvote"
        : data?.hasDownvoted
          ? "downvote"
          : null;
  const hasUpvoted = currentVote === "upvote";
  const hasDownvoted = currentVote === "downvote";

  const applyVote = async (voteType: "upvote" | "downvote") => {
    const nextVote = currentVote === voteType ? null : voteType;
    setLocalVote(nextVote);
    setVoteCounts((counts) => ({
      upvotes:
        counts.upvotes + Number(nextVote === "upvote") - Number(currentVote === "upvote"),
      downvotes:
        counts.downvotes + Number(nextVote === "downvote") - Number(currentVote === "downvote"),
    }));
    if (storageKey) await writeBrowserValue(storageKey, nextVote);
  };

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast({
        title: "Please login to vote",
        description: "Only logged-in users can vote.",
      });

    setIsLoading(true);

    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        if (isDatabaseUnavailable(result.error?.message) && storageKey) {
          await applyVote(voteType);
          toast({
            title: "Vote saved on this device",
            description: "It has not been synced to the community yet.",
          });
          return;
        }
        return toast({
          title: "Failed to vote",
          description: result.error?.message,
          variant: "destructive",
        });
      }

      await applyVote(voteType);

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
          : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

      toast({
        title: successMessage,
        description: "Your vote has been recorded.",
      });
    } catch {
      toast({
        title: "Failed to vote",
        description: "An error occurred while voting. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(voteCounts.upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(voteCounts.downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
