import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import hljs from "highlight.js";

export default async function markdownToHtml(
  markdown: string
): Promise<string> {
  const result = await remark()
    .use(gfm, {
      singleTilde: false,
      strikethrough: true,
      checkbox: true,
    })
    .use(html, {
      sanitize: false,
    })
    .process(markdown);

  let content = result.toString();

  // 코드 블록에 구문 강조 적용
  content = content.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code) => {
      const validLang = hljs.getLanguage(lang) ? lang : "javascript";
      const decodedCode = code
        .replace(/&#x3C;/g, "<")
        .replace(/&#x3E;/g, ">")
        .replace(/&#x26;/g, "&");
      const highlighted = hljs.highlight(validLang, decodedCode).value;
      return `<pre><code class="language-${validLang} hljs">${highlighted}</code></pre>`;
    }
  );

  content = content.replace(
    /<li>\s*<input type="checkbox"/g,
    '<li class="task-list-item"><input type="checkbox"'
  );
  content = content.replace(
    /<ul>\s*<li class="task-list-item">/g,
    '<ul class="contains-task-list"><li class="task-list-item">'
  );

  return content;
}
