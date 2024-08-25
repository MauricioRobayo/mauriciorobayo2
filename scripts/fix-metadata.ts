import fs from "fs/promises";
import path from "path";
import prettier from "prettier";

const blogDir = "./app/blog";

async function main() {
  const mdFiles = await fs.readdir(blogDir);
  for (const mdFile of mdFiles) {
    const page = path.join(blogDir, mdFile, "page.mdx");
    const content = await fs.readFile(page, "utf-8");
    const regex = /date:\s*(\d{4}-\d{2}-\d{2})/;
    const match = regex.exec(content);
    if (match) {
      const date = match.at(1);
      const metadata = `export const metadata = { date:   "${date}" }`;
      const newContent = content.replace(/---.*---/s, metadata);
      const newFormattedContent = await prettier.format(newContent, {
        parser: "mdx",
      });
      await fs.writeFile(page, newFormattedContent);
      console.log(`Updated ${page}`);
    } else {
      console.log(`Could not find date for ${mdFile}`);
    }
  }
}

main();
