import Link from "next/link";
import { getAllPosts } from "../lib/markdown";
import Image from "next/image";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="ios-memo-container">
      <div className="ios-header">
        <div className="header-content">
          <h1 className="ios-title">Sunny Note</h1>
          <p className="blog-description">toward familiarity🐾</p>
        </div>
      </div>

      <div className="memo-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id} className="block">
              <div className="memo-card paper-note">
                {post.thumbnail && (
                  <div className="memo-thumbnail">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      width={100}
                      height={25}
                      className="thumbnail-image"
                    />
                  </div>
                )}
                <Image
                  src="/tape.png"
                  className="tape"
                  alt="tape"
                  width={200}
                  height={100}
                />
                <div className="memo-content">
                  <h2 className="memo-title">{post.title}</h2>
                  <div className="memo-date">{post.date}</div>
                  <div className="memo-excerpt">
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 ? "..." : ""}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="memo-card paper-note">
            <div className="tape"></div>
            <h2 className="memo-title">첫 번째 글을 작성해보세요</h2>
            <div className="memo-excerpt">
              content/posts 디렉토리에 마크다운 파일을 추가하면 이곳에
              표시됩니다.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
