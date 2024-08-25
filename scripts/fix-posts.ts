import fs from "fs/promises";
import path from "path";

// Define the directory where the .md files are located
const blogDir = "./app/blog";

// Function to move and rename the files
async function moveMarkdownFiles() {
  const mdFiles = await fs.readdir(blogDir);
  for (const mdFile of mdFiles) {
    const fileName = path.basename(mdFile, ".md");
    const newDir = path.join(blogDir, fileName);
    await fs.mkdir(newDir, { recursive: true });
    const newFilePath = path.join(newDir, "page.mdx");
    await fs.rename(path.join(blogDir, mdFile), newFilePath);
    console.log(`Moved: ${mdFile} -> ${newFilePath}`);
  }
}

moveMarkdownFiles();
