const fs = require('fs-extra');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');
const CleanCSS = require('clean-css');
const { minify } = require('html-minifier-terser');

const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

async function build() {
    console.log('Starting build process...');

    if (fs.existsSync(distDir)) {
        fs.emptyDirSync(distDir);
    } else {
        fs.mkdirSync(distDir);
    }

    const filesToCopy = ['favicon.svg'];
    for (const file of filesToCopy) {
        const srcPath = path.join(srcDir, file);
        if (fs.existsSync(srcPath)) {
            fs.copySync(srcPath, path.join(distDir, file));
        }
    }

    console.log('Obfuscating script.js...');
    const jsContent = fs.readFileSync(path.join(srcDir, 'script.js'), 'utf8');

    const obfuscationResult = JavaScriptObfuscator.obfuscate(jsContent, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: false,
        debugProtectionInterval: 4000,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.5,
        stringArrayEncoding: ['base64', 'rc4'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: 'variable',
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
    });
    fs.writeFileSync(path.join(distDir, 'script.js'), obfuscationResult.getObfuscatedCode(), 'utf8');

    console.log('Minifying style.css...');
    const cssContent = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
    const minifiedCss = new CleanCSS({ level: 2 }).minify(cssContent);
    fs.writeFileSync(path.join(distDir, 'style.css'), minifiedCss.styles, 'utf8');

    console.log('Minifying index.html...');
    const htmlContent = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
    const minifiedHtml = await minify(htmlContent, {
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true,
        minifyJS: true,
        minifyCSS: true
    });
    fs.writeFileSync(path.join(distDir, 'index.html'), minifiedHtml, 'utf8');

    console.log('Build completed successfully! Outputs are in the "dist" directory.');
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
