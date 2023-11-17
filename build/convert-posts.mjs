import fs from 'fs';
import path from 'path';
import {micromark} from 'micromark';
import {gfm} from 'micromark-extension-gfm';
import {frontmatter, frontmatterHtml} from 'micromark-extension-frontmatter';
import {JSDOM} from 'jsdom';
import prettier from 'prettier';

const posts_input_dir = './posts';
const posts_output_dir = './public/posts';
const post_template_file = './public/posts/post-template.html';

// match and capture the alt text and href of an image link
const markdown_image_regex = /!\[(.*)\]\((.*)\)/g;
const micromark_options = {
    extensions: [gfm(), frontmatter()],
    htmlExtensions: [frontmatterHtml()]
};

const template_html = fs.readFileSync(post_template_file, 'utf-8');
const template_dom = new JSDOM(template_html);
const template_main = template_dom.window.document.querySelector('main');

const convert_markdown_files_to_html = async () => {
    let num_posts_converted = 0;
    const in_files = fs.readdirSync(posts_input_dir);
    for (const in_file of in_files) {
        // only process markdown files
        if (path.extname(in_file) !== '.md') {
            continue;
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

        // TODO - apply frontmatter to template; update page title, etc...

        // convert the markdown content to html,
        // insert into the template main element,
        // output the prettified template html with converted markdown
        template_main.innerHTML = micromark(content_markdown, micromark_options);
        const out_content_raw = template_dom.serialize();
        const out_content = await prettier.format(out_content_raw, {parser: 'html'});

        // write the converted content
        const out_filename = in_file.replace('.md', '.html');
        const out_filepath = path.join(posts_output_dir, out_filename);
        fs.writeFileSync(out_filepath, out_content);

        num_posts_converted++;
    }
    console.log(`Converted ${num_posts_converted} markdown files in '/posts' to html and written to '/public/posts'`);
};

// start the conversion and wait for it to complete
await convert_markdown_files_to_html();
