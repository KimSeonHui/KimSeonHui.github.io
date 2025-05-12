import { getAllPostIds, getPostById } from "../../../lib/markdown";
import markdownToHtml from "../../../lib/markdownToHtml";

export async function generateStaticParams() {
  const posts = getAllPostIds();
  return posts;
}

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    return <div>포스트를 찾을 수 없습니다.</div>;
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <main className="ios-memo-container">
      <div className="post-container">
        <div className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-date">
            {post.date !== "No date"
              ? new Date(post.date).toLocaleDateString("ko-KR")
              : "날짜 없음"}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag: string) => (
                <span key={tag} className="post-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {post.description && (
            <p className="post-description">{post.description}</p>
          )}
        </div>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </main>
  );
}
