const fs = require('fs').promises;
const path = require('path');

// 将树形字符串解析为对象的函数
function parseTreeString(treeStr) {
    const lines = treeStr.split('\n').filter(line => line.trim());
    const root = { name: 'root', type: 'folder', children: [] };
    const stack = [root];
    
    for (const line of lines) {
        // 计算缩进级别 - 支持多种缩进格式
        const indentMatch = line.match(/^[\s│]*/)[0];
        // 计算实际的缩进级别：每个缩进单位（两个空格或一个制表符）算作一级
        const level = Math.floor(
            (indentMatch.match(/(\s\s)|(\t)|\│\s\s/g) || []).length
        );
        
        // 提取文件/文件夹名称 - 移除所有前缀字符
        const name = line.replace(/^[\s│]*├──\s*|^[\s│]*└──\s*|^[\s│]*/, '').trim();
        
        // 判断类型
        const type = name.endsWith('/') || name.includes('.') === false ? 'folder' : 'file';
        const cleanName = name.replace('/', '');
        
        // 创建节点
        const node = {
            name: cleanName,
            type,
            children: []
        };
        
        // 调整堆栈以匹配当前级别
        while (stack.length > level + 1) {
            stack.pop();
        }
        
        // 将节点添加到当前父节点
        const parent = stack[stack.length - 1];
        parent.children.push(node);
        
        // 如果是文件夹，将其加入堆栈
        if (type === 'folder') {
            stack.push(node);
        }
    }
    
    return root.children;
}

// 创建文件系统结构的函数
async function createFileSystem(tree, basePath = '.') {
    // 首先确保基础路径存在
    await fs.mkdir(basePath, { recursive: true });
    
    for (const node of tree) {
        const currentPath = path.join(basePath, node.name);
        
        if (node.type === 'folder') {
            // 创建文件夹
            await fs.mkdir(currentPath, { recursive: true });
            // 递归创建子文件夹和文件
            if (node.children.length > 0) {
                await createFileSystem(node.children, currentPath);
            }
        } else {
            // 创建空文件
            await fs.writeFile(currentPath, '');
        }
    }
}

// 主函数
async function main() {
    const treeString = `
├── package.json
├── tsconfig.json
├── src/
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── calculator.ts
│   │   └── cityConfigs.ts
│   ├── components/
│   │   ├── AnalyticsChart.tsx
│   │   ├── ResultCard.tsx
│   │   ├── AnimatedNumber.tsx
│   │   └── ExportButton.tsx
│   ├── App.tsx
│   ├── index.tsx
│   └── styles.css
    `;

    // 解析树形结构
    const tree = parseTreeString(treeString);
    console.log('解析后的树形结构：');
    console.log(JSON.stringify(tree, null, 2));

    // 创建文件系统
    try {
        await createFileSystem(tree,'./output');
        console.log('文件系统结构已创建成功！');
    } catch (error) {
        console.error('创建文件系统时出错：', error);
    }
}

main();

module.exports = {
  parseTreeString,
  createFileSystem
}; 