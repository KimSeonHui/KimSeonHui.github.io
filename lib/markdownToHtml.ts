import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

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
