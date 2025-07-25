import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { writeClient } from '../sanity/lib/write-client';

// Define and enforce a strict schema for incoming post data
const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(2000),
  authorId: z.string().uuid(),
});

type PostInput = z.infer<typeof postSchema>;

export async function createPost(data: unknown) {
  // Authenticate the request
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('401 - Unauthorized');
  }

  // Validate and sanitize input
  const parsed: PostInput = postSchema.parse(data);

  // Authorize based on session user id or admin role
  if (session.user.id !== parsed.authorId && session.user.role !== 'admin') {
    throw new Error('403 - Forbidden');
  }

  // Perform a parameterized write via the Sanity client
  const newPost = await writeClient.create({
    _type: 'post',
    title: parsed.title,
    content: parsed.content,
    author: { _type: 'reference', _ref: parsed.authorId },
  });

  return newPost;
}