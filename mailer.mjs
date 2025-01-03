import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import * as nodemailer from 'nodemailer';

function getGitStatus(directory) {
  try {
    const gitStatus = execSync(`git status --porcelain ${directory}`).toString();
    return gitStatus;
  }
  catch (error) {
    console.error(error);
  }
}

// 파일의 첫 `numLines` 줄만 읽는 함수 (스트리밍 방식)
async function readFileLines(filePath, numLines = 4) {
  const lines = [];
  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    lines.push(line);
    if (lines.length >= numLines) {
      break;
    }
  }
  return lines.join('\n');
}

// listChangedFiles에서 생기는 {status, filePath}를 받아서 처리
function resolveFiles(files) {
  const resolvedFiles = files.map((file) => {
    const filePath = file.filePath;
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.md');
      if (fs.existsSync(indexPath)) {
        return indexPath;
      }
      console.log('index.md 파일이 해당 경로에 없습니다: ', filePath);
      return null;
    }
    else {
      return filePath;
    }
  }).filter(Boolean); // null 값을 제거

  return resolvedFiles;
}

async function listChangedFiles(directory) {
  const gitStatus = getGitStatus(directory);
  if (!gitStatus) {
    console.log('변경 사항이 없습니다.');
    return [];
  }

  const files = gitStatus.split('\n').map((line) => {
    // 정규식을 써서 더 강력한 공백 매칭도 가능하지만 여기서는 간단히 했다
    const [status, filePath] = line.trim().split(' ');
    return { status, filePath };
  });

  const newFiles = resolveFiles(files.filter((file) => file.status === '??'));
  const modifiedFiles = resolveFiles(files.filter((file) => file.status === 'M'));

  // 파일 내용 읽기
  const allFiles = [...newFiles, ...modifiedFiles];

  const fileContents = await Promise.all(
    allFiles.map(async (filePath) => {
      const content = await readFileLines(filePath);
      return content ? { filePath, content: content.split('\n').slice(1) } : null;
    }),
  );

  // null 값을 제거하고 반환
  return fileContents.filter(Boolean);
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailOptions = {
  from: 'soakdma37@gmail.com',
  to: 'soakdma37@gmail.com',
  subject: `${new Date().toLocaleDateString()} 블로그 글 변경 알림`,
};

async function sendMail(changedFiles) {
  if (!changedFiles || changedFiles.length === 0) {
    console.log('변경된 파일이 없습니다.');
    return;
  }

  const emailContent = `
    <h1>새로 생성되거나 변경된 글이 있습니다.</h1>
    <p>확인하고 필요하면 번역해 주세요.</p>
    <hr>
    ${changedFiles
      .map(
        ({ filePath, content }) => `
      <div>
        <h3>${filePath}</h3>
        <pre>${content.join('<br>')}</pre>
      </div>
    `,
      )
      .join('<hr>')}
  `;

  try {
    let info = await transporter.sendMail({
      ...mailOptions,
      html: emailContent,
    });
    console.log('Message sent: %s', info.messageId);
  }
  catch (error) {
    console.error(error);
  }
}

(async () => {
  const targetDirectory = 'content/posts';
  const fileContents = await listChangedFiles(targetDirectory);
  console.log('Changed Files Content:', fileContents);
  await sendMail(fileContents);
})();
