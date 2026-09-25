const { execSync } = require('child_process');

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] }).trim();
}

try {
  console.log('Staging demo/dist...');
  run('git add -f demo/dist');

  console.log('Writing tree...');
  const tree = run('git write-tree --prefix=demo/dist');

  console.log('Creating commit...');
  const commit = run(`git commit-tree ${tree} -m "deploy: publish unified site to GitHub Pages"`);

  console.log('Updating gh-pages ref...');
  run(`git update-ref refs/heads/gh-pages ${commit}`);

  console.log('Cleaning index...');
  run('git reset HEAD demo/dist');

  console.log('Pushing gh-pages branch to origin...');
  run('git push origin gh-pages --force');

  console.log('Successfully published to gh-pages branch!');
} catch (err) {
  console.error('Failed to deploy to gh-pages:', err.message);
  process.exit(1);
}
