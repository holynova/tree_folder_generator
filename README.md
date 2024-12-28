# 树形结构生成器

一个用于将树形文本结构转换为实际文件系统的 Node.js 工具。

## 功能特点

- 解析树形文本结构
- 自动创建对应的文件和文件夹
- 支持多级目录结构
- 支持不同的缩进格式
## 使用方法
```
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

```

## 例子
输入
### 类型1
```
const input = `
├── folder/
│   ├── file.txt
│   └── subfolder/
│       └── deep.txt
`;
```
### 类型2
```
const input = `
folder
  file.txt
  subfolder
    another.txt
`;
```
### 类型3
```
const input = `
folder/
  file.txt
  subfolder/
    └── another.txt
`;
```

### 类型4
```
const input = `
├── package.json
├── src/
│   ├── index.ts
│   └── utils/
│       └── helper.ts
`;
```

输出
```javascript
[
        {
          name: 'folder',
          type: 'folder',
          children: [
            {
              name: 'file.txt',
              type: 'file',
              children: []
            },
            {
              name: 'subfolder',
              type: 'folder',
              children: [
                {
                  name: 'another.txt',
                  type: 'file',
                  children: []
                }
              ]
            }
          ]
        }
      ]
```

## 使用方法