enum faqStatuses {
    Draft = 'draft',
    Deleted = 'deleted',
    Published = 'published'
}

async function getFaqs(req: {
    topicId: number,
    status?: faqStatuses,
}): Promise<Array<{
    question: string,
    answer: string,
    tags: Array<string>,
    likes: number,
    status: faqStatuses,
}>> {
    const res = await fetch('/faqs', {
        method: 'POST',
        body: JSON.stringify(req),
    });

    return await res.json();
}
