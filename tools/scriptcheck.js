// scriptcheck.js — розбирає кожен <script> із зібраного HTML так, як це
// зробить браузер (справжній JS-движок Node, vm.Script), і шукає конфлікти
// імен: два файли core/ оголосили одну й ту саму const/let/function —
// у браузері це «SyntaxError: Identifier has already been declared».
const fs = require("fs");
const vm = require("vm");

const file = process.argv[2] || "dist/index.html";
const html = fs.readFileSync(file, "utf8");
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let bad = 0;

scripts.forEach((code, i) => {
  try {
    new vm.Script(code, { filename: `${file} <script #${i + 1}>` });
    console.log(`   ✅ <script #${i + 1}> (${code.split("\n").length} рядків)`);
  } catch (e) {
    bad++;
    console.log(`   ❌ <script #${i + 1}>: ${e.message}`);
  }
});

const seen = {};
scripts.join("\n").split("\n").forEach(l => {
  const m = l.match(/^(?:async\s+)?(?:function\s+|const\s+|let\s+|class\s+)([A-Za-z_$][\w$]*)/);
  if (m) seen[m[1]] = (seen[m[1]] || 0) + 1;
});
const dup = Object.entries(seen).filter(([, n]) => n > 1).map(([k]) => k);
if (dup.length) { bad++; console.log("   ❌ оголошено двічі: " + dup.join(", ")); }
else console.log("   ✅ імена верхнього рівня не конфліктують");

process.exit(bad ? 1 : 0);
