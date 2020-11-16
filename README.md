# recreate-release

Delete previous release by `tag_name` or `release_name`. Then call `actions/create-release` to create it again.

# Params:
[actions/create-release](https://github.com/actions/create-release)

# Example:
```yaml
jobs:
  build:
    name: Recreate Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Recreate Release
        uses: GongT/actions-recreate-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: latest
          release_name: Release at ${{ github.ref }}
          body: |
            Changes in this Release
            - First Change
            - Second Change
          draft: false
          prerelease: false
```
