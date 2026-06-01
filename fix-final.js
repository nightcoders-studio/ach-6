const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  fs.writeFileSync(filePath, content);
}

replaceInFile(path.join(__dirname, 'src/app/actions/project.ts'), [
  { from: /payload: any/g, to: 'payload: unknown' },
  { from: /submitAction: any/g, to: 'submitAction: unknown' },
  { from: /data: any/g, to: 'data: unknown' }
]);

replaceInFile(path.join(__dirname, 'src/app/api/webhook/midtrans/route.ts'), [
  { from: /req\.json\(\) as any/g, to: 'req.json() as unknown' },
  { from: /const payload = await req\.json\(\);/g, to: 'const payload = await req.json() as unknown;' },
  { from: /data: any/g, to: 'data: unknown' }
]);

replaceInFile(path.join(__dirname, 'src/app/portfolios/[projectId]/page.tsx'), [
  { from: /"Project belum diselesaikan"/g, to: '&quot;Project belum diselesaikan&quot;' },
  { from: /"Project ini belum diselesaikan oleh mahasiswa"/g, to: '&quot;Project ini belum diselesaikan oleh mahasiswa&quot;' }
]);

replaceInFile(path.join(__dirname, 'src/components/project/ProjectRoom.tsx'), [
  { from: /submitAction: any/g, to: 'submitAction: (payload: FormData) => void' },
  { from: /approveAction: any/g, to: 'approveAction: (payload: FormData) => void' },
  { from: /revisionAction: any/g, to: 'revisionAction: (payload: FormData) => void' }
]);

replaceInFile(path.join(__dirname, 'src/lib/auth.ts'), [
  { from: /payload: any/g, to: 'payload: unknown' },
  { from: /token: any/g, to: 'token: unknown' }
]);

console.log("Fixed final eslint errors");
