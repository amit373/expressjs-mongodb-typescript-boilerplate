module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'tsc --noEmit',

  // Lint & Prettify TS and JS files
  '**/*.(ts|tsx|js)': filenames => [`npm run lint:fix`],

  // Prettify only Markdown and JSON files
  '**/*.(md|json)': filenames => `npx prettier --write ${filenames.join(' ')}`,
};
