import * as core from '@actions/core';
import * as github from '@actions/github';

function readRepository(repository: string): [string, string] {
  const arr = repository
    .trim()
    .split('/')
    .map(item => item.trim())
    .filter(v => v);

  if (arr.length === 2) {
    return arr as [string, string];
  } else {
    throw new Error('The format of the repository is incorrect!');
  }
}

async function main() {
  let { owner, repo } = github.context.repo;

  const repository = core.getInput('repository');
  if (repository) {
    try {
      [owner, repo] = readRepository(repository);
    } catch (err) {
      core.setFailed((<Error>err).message);
      return;
    }
  } else {
    core.info('No repository specified, read current repository.');
  }

  core.info(`Work context: ${owner}/${repo}.`);

  const octokit = github.getOctokit(core.getInput('token'));
  try {
    const { data } = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    });
    core.setOutput('tag', data.tag_name);
  } catch (err) {
    core.error('Failed to read the specified repository information!');
    core.setFailed((<Error>err).message);
    return;
  }
}

main();
