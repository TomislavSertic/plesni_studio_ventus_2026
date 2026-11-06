import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const origin = process.argv[2] || 'http://localhost:3338';
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const paths = [...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname))];
let checked = 0;
for (let i = 0; i < paths.length; i += 4) {
  await Promise.all(paths.slice(i, i + 4).map(async path => {
    const res = await fetch(origin + path);
    assert.equal(res.status, 200, path);
    const html = await res.text();
    assert.ok(html.includes('<h1'), `Missing heading: ${path}`);
    assert.ok(html.includes('rel="canonical"'), `Missing canonical: ${path}`);
    assert.ok(!html.includes('SADRŽAJ SE'), `Content error: ${path}`);
    checked++;
  }));
}
console.log(`PASS ${checked} published routes: HTTP 200, headings and canonical metadata`);
for (const path of ['/classes/this-does-not-exist', '/unknown-route']) assert.equal((await fetch(origin + path)).status, 404, path);
assert.equal((await fetch(origin + '/robots.txt')).status, 200);
for (const route of ['contact', 'registration', 'mail']) {
  assert.equal((await fetch(`${origin}/api/${route}`)).status, 405);
  const post = (body, headers = {}) => fetch(`${origin}/api/${route}`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body });
  assert.equal((await post('{}')).status, 400);
  assert.equal((await post('invalid-json')).status, 400);
  assert.equal((await post('{}', { origin: 'https://unrelated.example' })).status, 403);
  assert.equal((await post('{}', { origin: 'not-a-url' })).status, 403);
}
console.log('PASS API invalid input, malformed JSON, methods and cross-origin protection (no messages submitted)');
const tokens = [process.env.SANITY_API_TOKEN, process.env.NEXT_PUBLIC_SANITY_TOKEN, process.env.MAILTRAP_PASS].filter(v => v && v.length > 8);
async function scan(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) await scan(path);
    else if (/\.(js|json|map)$/.test(item.name)) {
      const content = await readFile(path, 'utf8');
      assert.ok(!tokens.some(token => content.includes(token)), 'A credential was found in a public build artifact');
    }
  }
}
await scan('.next/static');
console.log('PASS no Sanity/SMTP credential values in public production chunks');
