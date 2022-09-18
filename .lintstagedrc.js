module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'npm run tsc --noEmit',

  // Lint & Prettify TS and JS files
  '**/*.(ts|tsx|js)': filenames => [`eslint --ignore-path .gitignore ${filenames.join(' ')} --fix`, `npx prettier --write ${filenames.join(' ')}`],

  // Prettify only Markdown and JSON files
  '**/*.(md|json)': filenames => `npx prettier --write ${filenames.join(' ')}`,
};
