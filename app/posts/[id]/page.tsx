import Link from "next/link";
import {
  getPostById,
  markdownToHtml,
  getAllPostIds,
} from "../../../lib/markdown";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getAllPostIds();
  return posts.map((post) => post.params);
}

export default function Post({ params }: { params: { id: string } }) {
  const post = getPostById(params.id);

  if (!post) {
    notFound();
  }

  const contentHtml = markdownToHtml(post.content);

  return (
    <main className="ios-memo-container">
      <div className="post-container">
        <div className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-date">{post.date}</div>
        </div>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>

      <Link href="/" className="back-link">
        ← 모든 메모
      </Link>
    </main>
  );
}
