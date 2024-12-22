const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

async function generateCode(description) {
    const apiPath = path.join(__dirname, '../generated/api');
    await fs.ensureDir(apiPath);

    const templatePath = path.join(__dirname, '../templates/expressTemplate.ejs');
    const templateData = { description, endpoint: '/example', method: 'GET' };

    const generatedCode = await ejs.renderFile(templatePath, templateData);
    await fs.writeFile(path.join(apiPath, 'app.js'), generatedCode);

    return apiPath;
}

module.exports = { generateCode };
