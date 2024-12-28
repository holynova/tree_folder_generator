const { parseTreeString, createFileSystem } = require('../treeParser');
const fs = require('fs').promises;
const path = require('path');

describe('树形结构解析器测试', () => {
  describe('parseTreeString', () => {
    test('应该正确解析传统树形格式', () => {
      const input = `
├── folder/
│   ├── file.txt
│   └── subfolder/
│       └── deep.txt
`;
      const expected = [
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
                  name: 'deep.txt',
                  type: 'file',
                  children: []
                }
              ]
            }
          ]
        }
      ];

      expect(parseTreeString(input)).toEqual(expected);
    });

    test('应该正确解析简单缩进格式', () => {
      const input = `
folder
  file.txt
  subfolder
    another.txt
`;
      const expected = [
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
      ];

      expect(parseTreeString(input)).toEqual(expected);
    });

    test('应该正确解析混合格式', () => {
      const input = `
folder/
  file.txt
  subfolder/
    └── another.txt
`;
      const expected = [
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
      ];

      expect(parseTreeString(input)).toEqual(expected);
    });

    test('应该正确解析项目结构格式', () => {
      const input = `
├── package.json
├── src/
│   ├── index.ts
│   └── utils/
│       └── helper.ts
`;
      const expected = [
        {
          name: 'package.json',
          type: 'file',
          children: []
        },
        {
          name: 'src',
          type: 'folder',
          children: [
            {
              name: 'index.ts',
              type: 'file',
              children: []
            },
            {
              name: 'utils',
              type: 'folder',
              children: [
                {
                  name: 'helper.ts',
                  type: 'file',
                  children: []
                }
              ]
            }
          ]
        }
      ];

      expect(parseTreeString(input)).toEqual(expected);
    });

    test('应该正确处理空行和空格', () => {
      const input = `

folder/

  file.txt
  
  subfolder/
    another.txt

`;
      const expected = [
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
      ];

      expect(parseTreeString(input)).toEqual(expected);
    });
  });

  describe('createFileSystem', () => {
    const testDir = path.join(__dirname, 'test-output');

    beforeEach(async () => {
      // 清理测试目录
      try {
        await fs.rm(testDir, { recursive: true, force: true });
      } catch (error) {
        // 忽略目录不存在的错误
      }
    });

    test('应该创建文件系统结构', async () => {
      const tree = [
        {
          name: 'test-folder',
          type: 'folder',
          children: [
            {
              name: 'test-file.txt',
              type: 'file',
              children: []
            }
          ]
        }
      ];

      await createFileSystem(tree, testDir);

      // 验证文件夹是否创建
      const folderExists = await fs.stat(path.join(testDir, 'test-folder'))
        .then(stats => stats.isDirectory())
        .catch(() => false);
      expect(folderExists).toBe(true);

      // 验证文件是否创建
      const fileExists = await fs.stat(path.join(testDir, 'test-folder', 'test-file.txt'))
        .then(stats => stats.isFile())
        .catch(() => false);
      expect(fileExists).toBe(true);
    });
  });
}); 