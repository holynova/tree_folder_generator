const { parseTreeString, createFileSystem } = require('../treeParser');
const fs = require('fs').promises;
const path = require('path');

describe('树形结构解析器测试', () => {
  describe('parseTreeString', () => {
    test('应该正确解析简单的树形结构', () => {
      const input = `
├── file1.txt
├── folder1/
│   └── file2.txt
      `;
      
      const expected = [
        {
          name: 'file1.txt',
          type: 'file',
          children: []
        },
        {
          name: 'folder1',
          type: 'folder',
          children: [
            {
              name: 'file2.txt',
              type: 'file',
              children: []
            }
          ]
        }
      ];

      expect(parseTreeString(input)).toEqual(expected);
    });

    test('应该处理空输入', () => {
      expect(parseTreeString('')).toEqual([]);
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