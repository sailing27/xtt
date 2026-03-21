#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONTENTS_DIR = 'contents';
const OUTPUT_HTML = 'all_in_one.html';

function scanContentFiles() {
    const contentData = {};
    
    function scanDir(dirPath, prefix = '') {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const key = prefix + entry.name.replace('.txt', '');
            
            if (entry.isDirectory()) {
                scanDir(fullPath, key + '/');
            } else if (entry.name.endsWith('.txt')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                contentData[key] = content.replace(/\n/g, ' ').trim();
            }
        }
    }
    
    scanDir(CONTENTS_DIR);
    console.log(`扫描到 ${Object.keys(contentData).length} 个内容文件`);
    return contentData;
}

function updateHtmlFile(contentData) {
    let html = fs.readFileSync(OUTPUT_HTML, 'utf8');
    
    const contentJson = JSON.stringify(contentData).replace(/\n/g, '');
    
    // 查找已有的 TYPING_CONTENTS 变量
    const contentPattern = /const TYPING_CONTENTS = (\{.*?\});/s;
    
    const contentPlaceholder = '<!-- CONTENT_JSON -->';
    
    if (contentPattern.test(html)) {
        // 替换已有的 TYPING_CONTENTS 变量
        html = html.replace(contentPattern, `const TYPING_CONTENTS = ${contentJson};`);
        console.log('替换了已有的 TYPING_CONTENTS 数据');
    } else if (html.includes(contentPlaceholder)) {
        // 使用占位符
        html = html.replace(contentPlaceholder, contentJson);
        console.log('使用占位符插入了 TYPING_CONTENTS 数据');
    } else {
        // 插入新的 script 标签
        const scriptTag = `<script>\nconst TYPING_CONTENTS = ${contentJson};\n</script>`;
        const headEnd = '</head>';
        if (html.includes(headEnd)) {
            html = html.replace(headEnd, scriptTag + '\n' + headEnd);
            console.log('在 </head> 前插入了新的 script 标签');
        } else {
            const bodyStart = '<body>';
            html = html.replace(bodyStart, scriptTag + '\n' + bodyStart);
            console.log('在 <body> 前插入了新的 script 标签');
        }
    }
    
    fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
    console.log(`已更新 ${OUTPUT_HTML} 文件`);
}

function main() {
    try {
        console.log('开始处理打字练习内容...');
        
        const contentData = scanContentFiles();
        updateHtmlFile(contentData);
        
        console.log('打字练习内容处理完成！');
        
        console.log('\n统计信息：');
        console.log(`- 内容文件数量: ${Object.keys(contentData).length}`);
        
        console.log('\n示例（前5个文件）：');
        const sampleKeys = Object.keys(contentData).slice(0, 5);
        sampleKeys.forEach(key => {
            const preview = contentData[key].substring(0, 50) + '...';
            console.log(`  ${key}: ${preview}`);
        });
        
    } catch (error) {
        console.error('处理过程中发生错误：', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { scanContentFiles, updateHtmlFile };