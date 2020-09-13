# recreate-release

delete release and recreate it. then call `actions/create-release` to create it again.

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
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            Changes in this Release
            - First Change
            - Second Change
          draft: false
          prerelease: false
```
