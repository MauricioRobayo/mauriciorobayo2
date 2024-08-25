import fs from "fs/promises";
import path from "path";
import prettier from "prettier";

const blogDir = "./app/blog";

async function main() {
  const mdFiles = await fs.readdir(blogDir);
  for (const mdFile of mdFiles) {
    const page = path.join(blogDir, mdFile, "page.mdx");
    const content = await fs.readFile(page, "utf-8");
    const dateRegex = /date:\s*(\d{4}-\d{2}-\d{2})/;
    const dateMatch = dateRegex.exec(content);
    const titleRegex = /title: (.*)/;
    const titleMatch = titleRegex.exec(content);
    if (dateMatch && titleMatch) {
      const date = dateMatch.at(1);
      const title = titleMatch.at(1);
      const metadata = `export const metadata = { date:   "${date}", title: "${title}" }\n\n# ${title}\n\n`;
      const newContent = content.replace(/---.*---/s, metadata);
      const newFormattedContent = await prettier.format(newContent, {
        parser: "mdx",
      });
      await fs.writeFile(page, newFormattedContent);
      console.log(`Updated ${page}`);
    } else {
      console.log(`Could not find metadata for ${mdFile}`);
    }
  }
}

main();
