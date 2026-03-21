#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONTENTS_DIR = 'contents';
const OUTPUT_HTML = 'all_in_one.html';

// 文本长度保护函数，按段落截断
function protectTextLength(text, maxWords = 80, maxChars = 255) {
    // 判断文本是中文还是英文
    const isChinese = /[\u4e00-\u9fff]/.test(text);
    
    if (isChinese) {
        // 中文文本：按字符数限制
        if (text.length <= maxChars) {
            return text;
        }
        
        // 按段落截断：找到合适的段落结束位置
        let truncated = text.substring(0, maxChars);
        
        // 尝试在标点符号处截断
        const punctuationMarks = ['。', '！', '？', '；', '，', '.', '!', '?', ';', ','];
        let lastGoodBreak = maxChars;
        
        // 从截断点向前找最近的标点符号
        for (let i = maxChars - 1; i >= Math.max(0, maxChars - 50); i--) {
            if (punctuationMarks.includes(text[i])) {
                lastGoodBreak = i + 1;
                break;
            }
        }
        
        // 如果找到了合适的截断点，使用它
        if (lastGoodBreak < maxChars && lastGoodBreak > maxChars * 0.7) {
            truncated = text.substring(0, lastGoodBreak);
        } else {
            // 否则在单词边界截断（中文按字符）
            truncated = text.substring(0, maxChars);
        }
        
        // 确保截断后的文本以完整句子结束
        if (!punctuationMarks.some(mark => truncated.endsWith(mark))) {
            // 添加句号表示截断（中文）
            truncated += '。';
        }
        
        return truncated;
    } else {
        // 英文文本：按单词数限制
        const words = text.split(/\s+/);
        if (words.length <= maxWords) {
            return text;
        }
        
        // 取前maxWords个单词
        let truncatedWords = words.slice(0, maxWords);
        let truncated = truncatedWords.join(' ');
        
        // 尝试在句子边界截断
        const sentenceEndings = ['.', '!', '?', ';'];
        let lastGoodBreak = truncated.length;
        
        // 从截断点向前找最近的句子结束标点
        for (let i = truncated.length - 1; i >= Math.max(0, truncated.length - 100); i--) {
            if (sentenceEndings.includes(truncated[i])) {
                lastGoodBreak = i + 1;
                break;
            }
        }
        
        // 如果找到了合适的截断点，使用它
        if (lastGoodBreak < truncated.length && lastGoodBreak > truncated.length * 0.7) {
            truncated = truncated.substring(0, lastGoodBreak);
        } else {
            // 否则添加句号表示截断（英文）
            truncated += '.';
        }
        
        return truncated;
    }
}

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
                // 清理文本：移除换行符
                const cleanedText = content.replace(/\n/g, ' ').trim();
                // 应用长度保护：英文限制在80个单词左右，中文限制在255字左右
                const protectedText = protectTextLength(cleanedText, 80, 255);
                contentData[key] = protectedText;
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

module.exports = { scanContentFiles, updateHtmlFile, protectTextLength };