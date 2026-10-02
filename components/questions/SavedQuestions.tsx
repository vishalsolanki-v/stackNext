"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { EMPTY_QUESTION } from "@/constants/states";
import { readBrowserEntries } from "@/lib/browser-db";
import { getFallbackQuestion } from "@/lib/fallback-data";

interface Props {
  success: boolean;
  error?: ActionResponse["error"];
  initialCollection: Collection[];
  initialIsNext: boolean;
  page: number;
  pageSize: number;
  query?: string;
  filter?: string;
}

const SavedQuestions = ({
  success,
  error,
  initialCollection,
  initialIsNext,
  page,
  pageSize,
  query,
  filter,
}: Props) => {
  const userId = useSession().data?.user?.id;
  const [collection, setCollection] = useState(initialCollection);
  const [isNext, setIsNext] = useState(initialIsNext);

  useEffect(() => {
    setCollection(initialCollection);
    setIsNext(initialIsNext);
  }, [initialCollection, initialIsNext]);

  useEffect(() => {
    if (!userId) return;

    readBrowserEntries(`saved:${userId}:`)
      .then((entries) => {
        const byId = new Map(
          initialCollection.map((item) => [item.question._id, item])
        );

        for (const entry of entries) {
          const questionId = entry.key.slice(`saved:${userId}:`.length);
          if (entry.value !== true) {
            byId.delete(questionId);
            continue;
          }
          const question = getFallbackQuestion(questionId);
          if (question) {
            byId.set(questionId, {
              _id: `local-${questionId}`,
              author: userId,
              question,
            });
          }
        }

        const items = [...byId.values()].filter((item) =>
          `${item.question.title} ${item.question.content}`
            .toLowerCase()
            .includes((query ?? "").toLowerCase())
        );

        items.sort((a, b) => {
          if (filter === "oldest") {
            return new Date(a.question.createdAt).getTime() - new Date(b.question.createdAt).getTime();
          }
          if (filter === "mostvoted") return b.question.upvotes - a.question.upvotes;
          if (filter === "mostviewed") return b.question.views - a.question.views;
          if (filter === "mostanswered") return b.question.answers - a.question.answers;
          return new Date(b.question.createdAt).getTime() - new Date(a.question.createdAt).getTime();
        });

        const start = (page - 1) * pageSize;
        setCollection(items.slice(start, start + pageSize));
        setIsNext(start + pageSize < items.length);
      })
      .catch(() => {});
  }, [filter, initialCollection, page, pageSize, query, userId]);

  return (
    <>
      <DataRenderer
        success={success}
        error={error}
        data={collection.map((item) => item.question)}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
      <Pagination page={String(page)} isNext={isNext} />
    </>
  );
};

export default SavedQuestions;
