# get-latest-release-tag

> A GitHub Action.

## Feature

Get the latest release tag of the specified repository.

## Example workflow

```yaml
on: [push]

jobs:
  get_latest_tag_job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Get latest release tag
        uses: dragonish/get-latest-release-tag@v1
        id: latest
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          repository: 'dragonish/get-latest-release-tag'
      - name: Get the output
        run: echo "The output was ${{ steps.latest.outputs.tag }}"
```

## Inputs

- `token`: Token with specified repository read permission.
- `repository`: Optional. The owner and name of the repository. Format: `{owner}/{repo}`. If not specified, it is the current repository.

## Outputs

- `tag`: The latest release tag.

## License

[MIT](./LICENSE) license
