#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONTENTS_ZH_DIR = 'contents/zh';
const WB_SINGLE_FILE = 'wb_dict/wb86_single.txt';
const WB_PHRASE_FILE = 'wb_dict/wb86_phrase.txt';
const OUTPUT_HTML = 'all_in_one.html';

function extractChineseCharacters() {
    const characters = new Set();
    const files = fs.readdirSync(CONTENTS_ZH_DIR).filter(f => f.endsWith('.txt'));
    
    for (const file of files) {
        const content = fs.readFileSync(path.join(CONTENTS_ZH_DIR, file), 'utf8');
        const matches = content.match(/[\u4e00-\u9fff]/g) || [];
        matches.forEach(char => characters.add(char));
    }
    
    console.log(`从 ${files.length} 个文件中提取了 ${characters.size} 个不重复汉字`);
    return Array.from(characters);
}

function filterSingleWubi(characters) {
    const charSet = new Set(characters);
    const singleWubi = {};
    const lines = fs.readFileSync(WB_SINGLE_FILE, 'utf8').split('\n');
    
    for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(' ');
        if (parts.length >= 2) {
            const code = parts[0];
            const char = parts[1];
            if (charSet.has(char)) {
                if (!singleWubi[char]) {
                    singleWubi[char] = [];
                }
                singleWubi[char].push(code);
            }
        }
    }
    
    console.log(`过滤出 ${Object.keys(singleWubi).length} 个汉字的五笔编码`);
    return singleWubi;
}

function processPhraseWubi() {
    const phraseWubi = {};
    const lines = fs.readFileSync(WB_PHRASE_FILE, 'utf8').split('\n');
    
    for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(' ');
        if (parts.length >= 2) {
            const code = parts[0];
            const phrase = parts[1];
            if (!phraseWubi[phrase]) {
                phraseWubi[phrase] = [];
            }
            phraseWubi[phrase].push(code);
        }
    }
    
    console.log(`处理了 ${Object.keys(phraseWubi).length} 个词组的五笔编码`);
    return phraseWubi;
}

function updateHtmlFile(singleWubi, phraseWubi) {
    let html = fs.readFileSync(OUTPUT_HTML, 'utf8');
    
    const singleWubiJson = JSON.stringify(singleWubi).replace(/\n/g, '');
    const phraseWubiJson = JSON.stringify(phraseWubi).replace(/\n/g, '');
    
    // 查找已有的 WB_SINGLE 变量
    const singlePattern = /const WB_SINGLE = (\{.*?\});/s;
    const phrasePattern = /const WB_PHRASE = (\{.*?\});/s;
    
    const singlePlaceholder = '<!-- WB_SINGLE_JSON -->';
    const phrasePlaceholder = '<!-- WB_PHRASE_JSON -->';
    
    if (singlePattern.test(html)) {
        // 替换已有的 WB_SINGLE 变量
        html = html.replace(singlePattern, `const WB_SINGLE = ${singleWubiJson};`);
        console.log('替换了已有的 WB_SINGLE 数据');
    } else if (html.includes(singlePlaceholder)) {
        // 使用占位符
        html = html.replace(singlePlaceholder, singleWubiJson);
        console.log('使用占位符插入了 WB_SINGLE 数据');
    } else {
        // 插入新的 script 标签
        const scriptTag = `<script>\nconst WB_SINGLE = ${singleWubiJson};\nconst WB_PHRASE = ${phraseWubiJson};\n</script>`;
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
    
    if (phrasePattern.test(html)) {
        // 替换已有的 WB_PHRASE 变量
        html = html.replace(phrasePattern, `const WB_PHRASE = ${phraseWubiJson};`);
        console.log('替换了已有的 WB_PHRASE 数据');
    } else if (html.includes(phrasePlaceholder)) {
        // 使用占位符
        html = html.replace(phrasePlaceholder, phraseWubiJson);
        console.log('使用占位符插入了 WB_PHRASE 数据');
    }
    // 注意：如果 WB_SINGLE 不存在，上面已经插入了完整的 script 标签
    
    fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
    console.log(`已更新 ${OUTPUT_HTML} 文件`);
}

function main() {
    try {
        console.log('开始处理五笔编码数据...');
        
        const characters = extractChineseCharacters();
        const singleWubi = filterSingleWubi(characters);
        const phraseWubi = processPhraseWubi();
        updateHtmlFile(singleWubi, phraseWubi);
        
        console.log('五笔编码数据处理完成！');
        
        console.log('\n统计信息：');
        console.log(`- 单字编码数量: ${Object.keys(singleWubi).length}`);
        console.log(`- 词组编码数量: ${Object.keys(phraseWubi).length}`);
        
        console.log('\n示例（前5个单字编码）：');
        const sampleChars = Object.keys(singleWubi).slice(0, 5);
        sampleChars.forEach(char => {
            console.log(`  ${char}: ${singleWubi[char].join(', ')}`);
        });
        
    } catch (error) {
        console.error('处理过程中发生错误：', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { extractChineseCharacters, filterSingleWubi, processPhraseWubi, updateHtmlFile };