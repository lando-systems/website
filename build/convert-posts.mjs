import fs from 'fs';
import path from 'path';
import {micromark} from 'micromark';
import {gfm} from 'micromark-extension-gfm';
import {frontmatter, frontmatterHtml} from 'micromark-extension-frontmatter';

const posts_input_dir = './posts';
const posts_output_dir = './public/posts';

// match and capture the alt text and href of an image link
const markdown_image_regex = /!\[(.*)\]\((.*)\)/g;
const micromark_options = {
    extensions: [gfm(), frontmatter()],
    htmlExtensions: [frontmatterHtml()]
};

fs.readdirSync(posts_input_dir).forEach(in_file => {
    // only process markdown files
    if (path.extname(in_file) !== '.md') {
        return;
    }

    // read the markdown file content
    const in_filepath = path.join(posts_input_dir, in_file);
    const content_markdown_src = fs.readFileSync(in_filepath, 'utf-8');

    // modify the image href paths to be relative to the output directory
    // TODO - if posts are going to end up in subdirectories of /public/posts/** by category
    //   this won't be sufficient and we'll need to just extract the filename and rebuild the path
    //   based on the final output directory for each post, for now just strip the `/public` prefix
    const image_href_replacer = (match, alt_text, href) => {
        const updated_href = href.replace('/public', '');
        return `![${alt_text}](${updated_href})`;
    };
    const content_markdown = content_markdown_src.replace(markdown_image_regex, image_href_replacer);

    // convert the markdown content to html
    const content_html = micromark(content_markdown, micromark_options);

    // write the converted content
    const out_filename = in_file.replace('.md', '.html');
    const out_filepath = path.join(posts_output_dir, out_filename);
    fs.writeFileSync(out_filepath, content_html);
});
