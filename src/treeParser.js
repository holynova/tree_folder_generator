const fs = require('fs').promises;
const path = require('path');

// 将树形字符串解析为对象的函数
function parseTreeString(treeStr) {
    const lines = treeStr.split('\n').filter(line => line.trim());
    const root = { name: 'root', type: 'folder', children: [] };
    
    for (const line of lines) {
        // 计算缩进级别 - 支持多种缩进格式
        const indentMatch = line.match(/^[\s│]*(?:├──|└──|\s+)?/)[0];
        const level = Math.floor(indentMatch.length / 2); // 假设每个缩进是2个字符
        
        // 提取文件/文件夹名称 - 移除所有前缀字符
        const name = line.substring(indentMatch.length).trim();
        
        // 判断类型
        const type = name.endsWith('/') || name.includes('.') === false ? 'folder' : 'file';
        const cleanName = name.replace('/', '');
        
        // 创建节点
        const node = {
            name: cleanName,
            type,
            children: []
        };
        
        // 找到父节点并添加当前节点
        let parent = root;
        let currentLevel = 0;
        while (currentLevel < level) {
            if (!parent.children.length) {
                break; // 防止错误的缩进导致的问题
            }
            parent = parent.children[parent.children.length - 1];
            currentLevel++;
        }
        parent.children.push(node);
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