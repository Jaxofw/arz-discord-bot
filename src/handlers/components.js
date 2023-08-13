const { readdirSync } = require('node:fs');
const { join } = require('node:path');

module.exports = (client) => {
    const foldersPath = join(__dirname, '../components');
    const componentFolders = readdirSync(foldersPath);

    for (const folder of componentFolders) {
        const componentsPath = join(foldersPath, folder);
        const componentFiles = readdirSync(componentsPath).filter(file => file.endsWith('.js'));

        for (const file of componentFiles) {
            const filePath = join(componentsPath, file);
            const component = require(filePath);

            if ('name' in component && 'execute' in component) {
                if (folder === 'selectMenus') {
                    client.selectMenus.set(component.name, component);
                }
            } else {
                console.log(`[WARNING] The component at ${filePath} is missing a required "name" or "execute" property.`);
            }
        }
    }
};