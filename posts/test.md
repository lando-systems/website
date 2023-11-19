---
title: "This is a test post"
description: "This is a test post in which we test how posts get posted and such"
author: "Testy McTestface"
category: "test"
tags: ["test", "test2"]
created: 2023-11-17
updated: 2023-11-17
---
# Post Heading

![alt text](../public/images/logo-512-min.png)

## Post content

If `src` attribute is set, all relative links within 
that markdown document should be transformed
to be **relative** to `src` instead of `location.href`.

```js
// this is a code block for javascript
const convertMarkdownFilesToHtml = async () => {
    let numPostsConverted = 0;

    const posts = [];
    const inputFiles = fs.readdirSync(postsInputDir);
    for (const inputFile of inputFiles) {
        // only process markdown files
        if (path.extname(inputFile) !== ".md") {
            continue;
        }
        // ...
    }
};
await convertMarkdownFilesToHtml();
```
