import fs from "fs";
import path from "path";
import matter from "gray-matter";
import removeMd from "remove-markdown";

// 포스트 타입 정의
export interface PostType extends Record<string, unknown> {
  id: string;
  content: string;
  rawContent: string;
  title: string;
  date: string;
  description?: string;
  author?: string;
  tags?: string[];
  thumbnail?: string;
}

// content 디렉토리 경로
const postsDirectory = path.join(process.cwd(), "content/posts");

const readFile = (fileName: string) => {
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    content: removeMd(content),
    rawContent: content,
    title: data.title || "No title",
    date: data.date ? new Date(data.date).toISOString() : "No date",
    description: data.description || "",
    author: data.author || "",
    tags: data.tags || [],
    thumbnail: data.thumbnail || "",
    ...data,
  };
};

// 모든 포스트 데이터 가져오기
export function getAllPosts(): PostType[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const id = fileName.replace(/\.mdx$/, "");

      const post = readFile(fileName);

      return {
        id,
        ...post,
      } as PostType;
    })
    .sort((a, b) => {
      if (a.date === "No date" || b.date === "No date") return 0;
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    });

  return allPostsData;
}

// 특정 포스트 가져오기
export function getPostById(id: string): PostType | null {
  try {
    const fileName = `${id}.mdx`;
    const post = readFile(fileName);

    return {
      id,
      ...post,
    } as PostType;
  } catch (error) {
    console.error(`포스트 ID ${id}를 읽는 중 오류 발생:`, error);
    return null;
  }
}

// 모든 포스트 ID 가져오기
export function getAllPostIds() {
  // 디렉토리가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      return {
        id: fileName.replace(/\.mdx$/, ""),
      };
    });
}
