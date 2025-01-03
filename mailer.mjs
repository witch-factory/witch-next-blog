import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';
import * as nodemailer from 'nodemailer';

function getGitDiff(directory) {
  try {
    // 이전 커밋과 현재 커밋 사이의 변경 사항을 확인
    const gitStatus = execSync(`git diff --name-status HEAD^ HEAD ${directory}`).toString();
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

async function getChangedFilesContent(diffOutput) {
  const fileChanges = diffOutput.split('\n').map((line) => {
    const [status, filePath] = line.trim().split('\t');
    return { status, filePath };
  });
  console.log('File Changes:', fileChanges);

  const fileContents = await Promise.all(
    fileChanges.map(async ({ status, filePath }) => {
      // 파일이 .md 파일이 아니면 무시
      if (filePath && !filePath.endsWith('.md')) {
        return null;
      }
      switch (status) {
        case 'D':
          return { status, filePath, content: null };
        case 'A':
        case 'M':
          if (fs.existsSync(filePath)) {
            const content = (await readFileLines(filePath)).split('\n').slice(1);
            return { status, filePath, content };
          }
          else {
            console.warn(`File not found: ${filePath}`);
            return null;
          }
      }
    },
    ));

  return fileContents.filter(Boolean);
}

async function sendMail(changedFiles) {
  if (!changedFiles || changedFiles.length === 0) {
    console.log('변경된 파일이 없습니다.');
    return;
  }

  console.log(process.env.MAIL_PASS);

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
    subject: `${new Date().toLocaleDateString('ko-KR')} 블로그 글 변경 알림`,
  };

  const emailContent = `
    <h1>새로 생성되거나 변경된 글이 있습니다.</h1>
    <p>확인하고 필요하면 번역해 주세요.</p>
    <hr>
    ${changedFiles
      .map(
        ({ status, filePath, content }) => {
          const statusText
          = status === 'M'
            ? '파일 수정'
            : status === 'A'
              ? '파일 추가'
              : status === 'D'
                ? '파일 삭제'
                : '알 수 없는 변경';

          return `
                <div>
                  <h3>${statusText}: ${filePath}</h3>
                  ${
                    content
                      ? `<pre>${content.join('<br>')}</pre>`
                      : '<p>No content available (deleted file).</p>'
                  }
                </div>`;
        },
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
  const gitDiff = getGitDiff(targetDirectory);

  if (!gitDiff) {
    console.log('변경된 파일이 없습니다.');
    return;
  }

  const changedFiles = await getChangedFilesContent(gitDiff, targetDirectory);
  console.log('Changed Files:', changedFiles);

  await sendMail(changedFiles);
})();
