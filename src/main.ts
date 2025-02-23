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

  core.info(`Target repository: ${owner}/${repo}.`);

  const token = core.getInput('token', { required: true });
  const octokit = github.getOctokit(token);
  let tagName = '';

  try {
    const preRelease = core.getBooleanInput('pre-release');
    if (preRelease) {
      core.info('Allow the latest tag that may be pre-release.');
      const { data } = await octokit.rest.repos.listReleases({
        owner,
        repo,
        page: 1,
        per_page: 1,
      });

      if (data.length === 0) {
        throw new Error('No release list was obtained!');
      }
      tagName = data[0].tag_name || '';
    } else {
      const { data } = await octokit.rest.repos.getLatestRelease({
        owner,
        repo,
      });
      tagName = data.tag_name || '';
    }
  } catch (err) {
    core.error('Failed to get the latest release of the specified repository!');
    core.setFailed((<Error>err).message);
    return;
  }

  core.info(`Get tag: "${tagName}".`);
  core.setOutput('tag', tagName);
}

main();
