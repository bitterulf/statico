const fs = require('fs');
const walker = require('walker');
const md = require('markdown-it')();

if (!fs.existsSync('./content')){
    fs.mkdirSync('./content');
}

if (!fs.existsSync('./generated')){
    fs.mkdirSync('./generated');
}

const files = [];

const template = fs.readFileSync('./template.html').toString();

walker('./content')
    .on('file', function(file) {
        if (file.indexOf('.md') > -1) {
            files.push(file);
        }
    })
    .on('end', function() {
        console.log('All files traversed.', files)

        files.forEach(function(filename) {
            const data = fs.readFileSync(filename).toString();
            const html = md.render(data).toString();

            const fullHtml = template.replace('{{BODY}}', html);
            fs.writeFileSync(filename.replace('content/', 'generated/').replace('.md', '.html'), fullHtml);
        });
    });
