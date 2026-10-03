import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else {
            if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walk(path.join(process.cwd(), 'src'));
let issues = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            const dir = path.dirname(file);
            let resolvedPath = path.resolve(dir, importPath);
            
            // Try adding .js or .jsx if not present
            if (!fs.existsSync(resolvedPath)) {
                if (fs.existsSync(resolvedPath + '.js')) resolvedPath += '.js';
                else if (fs.existsSync(resolvedPath + '.jsx')) resolvedPath += '.jsx';
                else if (fs.existsSync(path.join(resolvedPath, 'index.js'))) resolvedPath = path.join(resolvedPath, 'index.js');
                else if (fs.existsSync(path.join(resolvedPath, 'index.jsx'))) resolvedPath = path.join(resolvedPath, 'index.jsx');
                else continue; // Probably an alias or external
            }

            // Check case sensitivity
            const basename = path.basename(resolvedPath);
            const dirname = path.dirname(resolvedPath);
            const actualFiles = fs.readdirSync(dirname);
            if (!actualFiles.includes(basename)) {
                const actualFile = actualFiles.find(f => f.toLowerCase() === basename.toLowerCase());
                console.log(`[MISMATCH] In file: ${file}`);
                console.log(`  Imported: ${importPath}`);
                console.log(`  Actual file should be: ${actualFile}`);
                issues++;
            }
        }
    }
});

if (issues === 0) {
    console.log("No case sensitivity issues found in imports.");
} else {
    console.log(`Found ${issues} issues.`);
}
