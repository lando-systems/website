import fs from "fs";
import path from "path";
import { micromark } from "micromark";
import { gfm } from "micromark-extension-gfm";
import { JSDOM } from "jsdom";
import prettier from "prettier";
import matter from "gray-matter";
import moment from "moment";

const postsInputDir = "./posts";
const postsOutputDir = "./public/posts";
const postTemplateFile = "./public/posts/post-template.html";
const postsLandingPageFile = "./public/posts.html";

// match and capture the alt text and href of an image link
const markdownImageRegex = /!\[(.*)\]\((.*)\)/g;

const updatePostsTableOfContents = async (posts) => {
  const inHtml = fs.readFileSync(postsLandingPageFile, "utf-8");
  const dom = new JSDOM(inHtml);
  const toc = dom.window.document.getElementById("toc");
  const postListItems = posts.map(
    (post) =>
      `<li><a href="${post.href}">${moment(post.updated).format(
        "YYYY-MM-DD",
      )}: ${post.title}</a></li>`,
  );
  toc.innerHTML = `<ul>${postListItems.join("")}</ul>`;
  const outHtmlRaw = dom.serialize();
  const outHtml = await prettier.format(outHtmlRaw, { parser: "html" });
  fs.writeFileSync(postsLandingPageFile, outHtml, "utf-8");
};

const convertMarkdownFilesToHtml = async () => {
  let numPostsConverted = 0;

  const posts = [];
  const inputFiles = fs.readdirSync(postsInputDir);
  for (const inputFile of inputFiles) {
    // only process markdown files
    if (path.extname(inputFile) !== ".md") {
      continue;
    }

    // read the post template file, parse it, and get references to elements we'll need to modify
    const templateHtml = fs.readFileSync(postTemplateFile, "utf-8");
    const templateDom = new JSDOM(templateHtml);
    const templateElements = {
      title: templateDom.window.document.querySelector("title"),
      main: templateDom.window.document.querySelector("main"),
    };

    // read the markdown file content
    const inputFilepath = path.join(postsInputDir, inputFile);
    const markdownRaw = fs.readFileSync(inputFilepath, "utf-8");

    // modify the image href paths to be relative to the output directory
    // TODO - if posts are going to end up in subdirectories of /public/posts/** by category
    //   this won't be sufficient and we'll need to just extract the filename and rebuild the path
    //   based on the final output directory for each post, for now just strip the `/public` prefix
    const markdownSrc = markdownRaw.replace(
      markdownImageRegex,
      (match, altText, href) => {
        const updatedHref = href.replace("/public", "");
        return `![${altText}](${updatedHref})`;
      },
    );

    // extract frontmatter and markdown from parsed content
    const { data: frontmatter, content: markdown } = matter(markdownSrc);
    const html = micromark(markdown, { extensions: [gfm()] });

    // populate a post object and add it to the posts array which will be used to build the table of contents
    const outputFilename = inputFile.replace(".md", ".html");
    const href = `./posts/${outputFilename}`;
    const post = { href, ...frontmatter };
    posts.push(post);

    // apply frontmatter to template content
    templateElements.title.textContent = post.title;
    // TODO - update the template with other frontmatter props;
    //  description, author, category, tags, created, updated
    templateElements.main.innerHTML = html;

    // output the modified template dom as an html string and prettify it
    const postHtmlRaw = templateDom.serialize();
    const postHtml = await prettier.format(postHtmlRaw, { parser: "html" });

    // write the converted content to a file
    const outputFilepath = path.join(postsOutputDir, outputFilename);
    fs.writeFileSync(outputFilepath, postHtml);

    numPostsConverted++;
  }
  console.log(
    `Converted ${numPostsConverted} markdown files in '/posts' to html and written to '/public/posts'`,
  );

  // sort posts by most recently updated and update posts landing page table of contents
  posts.sort((a, b) => b.updated - a.updated);
  await updatePostsTableOfContents(posts);
  console.log(`Updated posts landing page table of contents`);
};

// start the conversion and wait for it to complete
await convertMarkdownFilesToHtml();
