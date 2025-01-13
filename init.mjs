import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

// 생성할 JSON 파일과 기본 내용 정의
const files = [
  {
    name: 'enPostMetadata.json',
    content: [],
  },
  {
    name: 'enPostTags.json',
    content: [],
  },
  {
    name: 'enPosts.json',
    content: [],
  },
  {
    name: 'postMetadata.json',
    content: [],
  },
  {
    name: 'postTags.json',
    content: [],
  },
  {
    name: 'posts.json',
    content: [],
  },
  {
    name: 'translations.json',
    content: [],
  },
  {
    name: 'translationsMetadata.json',
    content: [],
  },
];

// JSON 파일 생성 함수
function createJsonFiles() {
  files.forEach((file) => {
    const filePath = path.join(__dirname, '.velite', file.name);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(file.content, null, 2));
      console.log(`✅ Created: ${file.name}`);
    }
    else {
      console.log(`⚠️ File already exists: ${file.name}`);
    }
  });
}

// 실행
createJsonFiles();
