import fs from "fs";
import path from "path";

// 포스트 타입 정의
export interface PostType {
  id: string;
  content: string;
  title: string;
  date: string;
  [key: string]: string;
}

// content 디렉토리 경로
const postsDirectory = path.join(process.cwd(), "content/posts");

// 모든 포스트 데이터 가져오기
export function getAllPosts(): PostType[] {
  // 디렉토리가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // 파일명 배열 가져오기
  const fileNames = fs.readdirSync(postsDirectory);

  // 각 파일의 데이터 추출
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // 파일명에서 .md 확장자 제거하여 id로 사용
      const id = fileName.replace(/\.md$/, "");

      // 마크다운 파일을 문자열로 읽기
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // 파일 내용에서 메타데이터 추출 (간단한 파싱)
      const metadataLines = fileContents.split("\n").slice(0, 10);
      const metadata: { [key: string]: string } = {};

      metadataLines.forEach((line) => {
        if (line.startsWith("---") || line.trim() === "") return;
        if (line.includes(":")) {
          const [key, value] = line.split(":").map((s) => s.trim());
          if (key && value) {
            metadata[key] = value;
          }
        }
      });

      // 콘텐츠 부분 추출 (첫 번째 '---' 이후부터 두 번째 '---'까지는 메타데이터)
      const contentStartMarker =
        fileContents.indexOf("---", fileContents.indexOf("---") + 3) + 3;
      const content = fileContents.slice(contentStartMarker).trim();

      return {
        id,
        content,
        ...metadata,
        date: metadata.date || "No date",
        title: metadata.title || "No title",
      } as PostType;
    })
    // 날짜별로 정렬
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return allPostsData;
}

// 특정 포스트 가져오기
export function getPostById(id: string): PostType | null {
  const fullPath = path.join(postsDirectory, `${id}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 메타데이터 추출
    const metadataSection = fileContents.split("---")[1];
    const metadata: { [key: string]: string } = {};

    if (metadataSection) {
      metadataSection.split("\n").forEach((line) => {
        if (line.trim() === "") return;
        if (line.includes(":")) {
          const [key, value] = line.split(":").map((s) => s.trim());
          if (key && value) {
            metadata[key] = value;
          }
        }
      });
    }

    // 콘텐츠 부분 추출
    const contentStartMarker =
      fileContents.indexOf("---", fileContents.indexOf("---") + 3) + 3;
    const content = fileContents.slice(contentStartMarker).trim();

    return {
      id,
      content,
      title: metadata.title || "No title",
      date: metadata.date || "No date",
      ...metadata,
    } as PostType;
  } catch (error) {
    console.error(`포스트 ID ${id}를 읽는 중 오류 발생:`, error);
    return null;
  }
}

// 모든 포스트 ID 가져오기
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ""),
        },
      };
    });
}

// 간단한 마크다운 to HTML 변환 함수
export function markdownToHtml(markdown: string): string {
  // 제목 변환
  let html = markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // 굵은 텍스트 및 이탤릭
  html = html
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // 링크
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // 이미지
  html = html.replace(
    /!\[([^\]]+)\]\(([^)]+)\)/gim,
    '<img src="$2" alt="$1" />'
  );

  // 목록
  html = html.replace(/^\s*\n\*/gm, "<ul>\n*");
  html = html.replace(/^(\*.+)\s*\n([^\*])/gm, "$1\n</ul>\n\n$2");
  html = html.replace(/^\*(.+)/gm, "<li>$1</li>");

  // 코드 블록
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // 인라인 코드
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // 단락
  html = html.replace(/^\s*\n\s*\n/gm, "</p>\n\n<p>");
  html = "<p>" + html.trim() + "</p>";

  return html;
}
