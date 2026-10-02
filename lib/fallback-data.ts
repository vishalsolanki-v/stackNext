import seed from "@/data/fallback.json";

type PageParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
};

const seedUsers = seed.users;
const seedTags = seed.tags;
const seedQuestions = seed.questions;
const seedAnswers = seed.answers;
const createObjectId = (prefix: string, index: number) =>
  `${prefix}${String(index).padStart(21, "0")}`;

const profileNames = seed.profileFirstNames.flatMap((firstName) =>
  seed.profileLastNames.map((lastName) => `${firstName} ${lastName}`)
);
const existingNames = new Set(seedUsers.map((user) => user.name));
const generatedUsers = profileNames
  .filter((name) => !existingNames.has(name))
  .slice(0, 50)
  .map((name, index) => {
    const username = name.toLowerCase().replace(/\s+/g, "");
    return {
      _id: createObjectId("65a", index + 4),
      name,
      username,
      email: `${username}@example.dev`,
      bio: `Software developer interested in ${seed.additionalTagNames[index % seed.additionalTagNames.length]}.`,
      reputation: 15 + ((index * 17) % 280),
      createdAt: new Date(Date.UTC(2025, index % 12, (index % 27) + 1)).toISOString(),
    };
  });
const allUsers = [...seedUsers, ...generatedUsers];

const baseTags = [
  ...seedTags,
  ...seed.additionalTagNames.map((name, index) => ({
    _id: createObjectId("65b", index + seedTags.length + 1),
    name,
    questions: 0,
    createdAt: new Date(Date.UTC(2025, index % 12, (index % 27) + 1)).toISOString(),
  })),
];

const generatedQuestions = seed.questionTopics.map((title, index) => ({
  _id: createObjectId("65c", index + seedQuestions.length + 1),
  title,
  content: `${title} I want to choose a maintainable approach that works well in production. What tradeoffs, edge cases, and tests should I consider?`,
  authorId: allUsers[(index + seedUsers.length) % allUsers.length]._id,
  tagIds: [
    baseTags[index % baseTags.length]._id,
    baseTags[(index + 1) % baseTags.length]._id,
  ],
  views: 40 + ((index * 53) % 2400),
  upvotes: (index * 7) % 90,
  downvotes: index % 4,
  answers: 1,
  createdAt: new Date(Date.UTC(2025, index % 12, (index % 27) + 1)).toISOString(),
}));
const allQuestionRecords = [...seedQuestions, ...generatedQuestions];
const allTags = baseTags.map((tag) => ({
  ...tag,
  questions: allQuestionRecords.filter((question) =>
    question.tagIds.includes(tag._id)
  ).length,
}));

const generatedAnswers = generatedQuestions.map((question, index) => ({
  _id: createObjectId("65d", index + seedAnswers.length + 1),
  questionId: question._id,
  authorId: allUsers[(index + seedUsers.length + 1) % allUsers.length]._id,
  content: `${seed.answerTemplates[index % seed.answerTemplates.length]} ${question.title}`,
  upvotes: (index * 5) % 55,
  downvotes: index % 3,
  createdAt: new Date(Date.UTC(2025, index % 12, (index % 27) + 1)).toISOString(),
}));
const allAnswerRecords = [...seedAnswers, ...generatedAnswers];

const generatedJobs = seed.jobTitles.map((title, index) => {
  const locations = [
    { city: "Austin", state: "Texas", country: "US" },
    { city: "Toronto", state: "Ontario", country: "CA" },
    { city: "London", state: "England", country: "GB" },
    { city: "Berlin", state: "Berlin", country: "DE" },
    { city: "Sydney", state: "New South Wales", country: "AU" },
    { city: "Remote", state: "Remote", country: "US" },
  ];
  const location = locations[index % locations.length];
  const company = seed.jobCompanies[index % seed.jobCompanies.length];
  return {
    id: `fallback-job-${String(index + 1).padStart(3, "0")}`,
    employer_name: company,
    employer_website: "https://example.com",
    job_employment_type: index % 4 === 0 ? "Full-time" : "Full-time · Remote",
    job_title: title,
    job_description: `${company} is hiring a ${title}. Work with a collaborative engineering team to build reliable products, improve developer workflows, and deliver thoughtful user experiences.`,
    job_apply_link: "https://example.com/jobs",
    job_city: location.city,
    job_state: location.state,
    job_country: location.country,
  };
});

const matches = (value: string, query?: string) =>
  !query || value.toLowerCase().includes(query.toLowerCase());

const paginate = <T>(items: T[], page = 1, pageSize = 10) => {
  const start = (Math.max(1, page) - 1) * Math.max(1, pageSize);
  const results = items.slice(start, start + pageSize);
  return { results, isNext: start + results.length < items.length };
};

const getUserById = (id: string) => allUsers.find((user) => user._id === id);
const getTagById = (id: string) => allTags.find((tag) => tag._id === id);

export const getFallbackAllUsers = () => allUsers as unknown as User[];
export const findFallbackUser = (id: string) => getUserById(id) ?? null;
export const findFallbackUserByEmail = (email: string) =>
  allUsers.find((user) => user.email === email) ?? null;

export const fallbackQuestions = () =>
  allQuestionRecords.map((question) => ({
    _id: question._id,
    title: question.title,
    content: question.content,
    author: getUserById(question.authorId),
    tags: question.tagIds.map(getTagById).filter(Boolean),
    views: question.views,
    upvotes: question.upvotes,
    downvotes: question.downvotes,
    answers: question.answers,
    createdAt: new Date(question.createdAt),
  })) as unknown as Question[];

export const fallbackAnswers = (questionId?: string) =>
  allAnswerRecords
    .filter((answer) => !questionId || answer.questionId === questionId)
    .map((answer) => ({
      _id: answer._id,
      question: answer.questionId,
      author: getUserById(answer.authorId),
      content: answer.content,
      upvotes: answer.upvotes,
      downvotes: answer.downvotes,
      createdAt: new Date(answer.createdAt),
    })) as unknown as Answer[];

export const getFallbackQuestions = ({
  page = 1,
  pageSize = 10,
  query,
  filter,
}: PageParams) => {
  let questions = fallbackQuestions().filter((question) =>
    matches(`${question.title} ${question.content}`, query)
  );

  if (filter === "unanswered") {
    questions = questions.filter((question) => question.answers === 0);
  }
  if (filter === "popular") {
    questions.sort((a, b) => b.upvotes - a.upvotes);
  } else {
    questions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const { results, isNext } = paginate(questions, page, pageSize);
  return { questions: results, isNext };
};

export const getFallbackQuestion = (questionId: string) =>
  fallbackQuestions().find((question) => question._id === questionId) ?? null;

export const getFallbackAnswers = ({
  questionId,
  page = 1,
  pageSize = 10,
  filter,
}: PageParams & { questionId: string }) => {
  const answers = fallbackAnswers(questionId);
  if (filter === "oldest") {
    answers.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  } else if (filter === "popular") {
    answers.sort((a, b) => b.upvotes - a.upvotes);
  } else {
    answers.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  const { results, isNext } = paginate(answers, page, pageSize);
  return { answers: results, isNext, totalAnswers: answers.length };
};

export const getFallbackUsers = ({
  page = 1,
  pageSize = 10,
  query,
  filter,
}: PageParams) => {
  const users = allUsers
    .filter((user) => matches(`${user.name} ${user.username} ${user.email}`, query))
    .sort((a, b) => {
      if (filter === "oldest") {
        return a.createdAt.localeCompare(b.createdAt);
      }
      if (filter === "popular") return b.reputation - a.reputation;
      return b.createdAt.localeCompare(a.createdAt);
    });
  const { results, isNext } = paginate(users, page, pageSize);
  return { users: results as unknown as User[], isNext };
};

export const getFallbackUser = (userId: string) => {
  const user = getUserById(userId) ?? allUsers[0];
  return { ...user, _id: userId } as unknown as User;
};

export const getFallbackUserQuestions = (userId: string, page = 1, pageSize = 10) => {
  const authoredQuestions = fallbackQuestions().filter(
    (question) => question.author._id === userId
  );
  const questions = authoredQuestions.length ? authoredQuestions : fallbackQuestions();
  const { results, isNext } = paginate(questions, page, pageSize);
  return { questions: results, isNext };
};

export const getFallbackUserAnswers = (userId: string, page = 1, pageSize = 10) => {
  const authoredAnswers = fallbackAnswers().filter(
    (answer) => answer.author._id === userId
  );
  const answers = authoredAnswers.length ? authoredAnswers : fallbackAnswers();
  const { results, isNext } = paginate(answers, page, pageSize);
  return { answers: results, isNext };
};

export const getFallbackTags = ({
  page = 1,
  pageSize = 10,
  query,
  filter,
}: PageParams) => {
  const tags = allTags
    .filter((tag) => matches(tag.name, query))
    .sort((a, b) => {
      if (filter === "name") return a.name.localeCompare(b.name);
      if (filter === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (filter === "recent") return b.createdAt.localeCompare(a.createdAt);
      return b.questions - a.questions;
    });
  const { results, isNext } = paginate(tags, page, pageSize);
  return { tags: results as unknown as Tag[], isNext };
};

export const getFallbackTagQuestions = ({
  tagId,
  page = 1,
  pageSize = 10,
  query,
}: PageParams & { tagId: string }) => {
  const tag = getTagById(tagId);
  const questions = fallbackQuestions().filter(
    (question) =>
      question.tags.some((questionTag) => questionTag._id === tagId) &&
      matches(question.title, query)
  );
  const { results, isNext } = paginate(questions, page, pageSize);
  return {
    tag: tag as unknown as Tag | undefined,
    questions: results,
    isNext,
  };
};

export const getFallbackHotQuestions = () =>
  fallbackQuestions()
    .sort((a, b) => b.views - a.views || b.upvotes - a.upvotes)
    .slice(0, 5);

export const getFallbackTopTags = () =>
  [...allTags]
    .sort((a, b) => b.questions - a.questions)
    .slice(0, 5) as unknown as Tag[];

export const getFallbackCollections = ({
  page = 1,
  pageSize = 10,
  query,
  filter,
}: PageParams) => {
  const collections = fallbackQuestions()
    .slice(0, 50)
    .map((question, index) => ({
      _id: createObjectId("65e", index + 1),
      author: allUsers[index % allUsers.length]._id,
      question,
    }))
    .filter((item) =>
      matches(`${item.question.title} ${item.question.content}`, query)
    );

  collections.sort((a, b) => {
    if (filter === "oldest") {
      return new Date(a.question.createdAt).getTime() - new Date(b.question.createdAt).getTime();
    }
    if (filter === "mostvoted") return b.question.upvotes - a.question.upvotes;
    if (filter === "mostviewed") return b.question.views - a.question.views;
    if (filter === "mostanswered") return b.question.answers - a.question.answers;
    return new Date(b.question.createdAt).getTime() - new Date(a.question.createdAt).getTime();
  });

  const { results, isNext } = paginate(collections, page, pageSize);
  return { collection: results as unknown as Collection[], isNext };
};

const countryNames: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  DE: "Germany",
  AU: "Australia",
};

export const getFallbackJobs = ({ query, page }: JobFilterParams) => {
  const queryTokens = query
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);
  const jobs = generatedJobs.filter((job) => {
    const searchable = [
      job.job_title,
      job.employer_name,
      job.job_city,
      job.job_state,
      job.job_country,
      countryNames[job.job_country],
    ]
      .join(" ")
      .toLowerCase();
    return !queryTokens.length || queryTokens.some((token) => searchable.includes(token));
  });
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
  const pageSize = 10;
  const start = (pageNumber - 1) * pageSize;
  return {
    jobs: jobs.slice(start, start + pageSize) as Job[],
    isNext: start + pageSize < jobs.length,
  };
};

export const getFallbackCountries = (): Country[] => [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Australia",
  "France",
  "India",
  "Ireland",
  "Netherlands",
  "Remote",
].map((common) => ({ name: { common } }));

export const searchFallbackData = (query: string, type?: string | null) => {
  const normalizedType = type?.toLowerCase();
  const results: GlobalSearchedItem[] = [];
  const addIfMatching = (
    itemType: GlobalSearchedItem["type"],
    title: string,
    id: string
  ) => {
    if (matches(title, query) && (!normalizedType || normalizedType === itemType)) {
      results.push({ type: itemType, title, id });
    }
  };

  for (const question of allQuestionRecords) {
    addIfMatching("question", question.title, question._id);
  }
  for (const user of allUsers) addIfMatching("user", user.name, user._id);
  for (const answer of allAnswerRecords) {
    if (matches(answer.content, query) && (!normalizedType || normalizedType === "answer")) {
      results.push({
        type: "answer",
        title: `Answers containing ${query}`,
        id: answer.questionId,
      });
    }
  }
  for (const tag of allTags) addIfMatching("tag", tag.name, tag._id);

  return normalizedType ? results.slice(0, 8) : results.slice(0, 8);
};

export const getFallbackUserStats = (userId: string) => {
  const userQuestions = fallbackQuestions().filter(
    (question) => question.author._id === userId
  );
  const userAnswers = fallbackAnswers().filter(
    (answer) => answer.author._id === userId
  );
  const questionCount = userQuestions.length;
  const answerCount = userAnswers.length;
  const totalUpvotes = [...userQuestions, ...userAnswers].reduce(
    (total, item) => total + item.upvotes,
    0
  );
  const totalViews = userQuestions.reduce((total, question) => total + question.views, 0);
  const badges = {
    GOLD: Number(answerCount >= 20 || questionCount >= 10),
    SILVER: Number(answerCount >= 5 || questionCount >= 3),
    BRONZE: Number(answerCount >= 1 || questionCount >= 1),
  };
  return {
    totalQuestions: questionCount,
    totalAnswers: answerCount,
    totalUpvotes,
    totalViews,
    badges,
  };
};

export const getFallbackUserTopTags = (userId: string) => {
  const counts = new Map<string, number>();
  const questions = fallbackQuestions().filter(
    (question) => question.author._id === userId
  );
  for (const question of questions) {
    for (const tag of question.tags) counts.set(tag._id, (counts.get(tag._id) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ _id: id, name: getTagById(id)?.name ?? "", count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};
