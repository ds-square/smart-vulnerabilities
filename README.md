# Smart Vulnerabilities

https://ds-square.github.io/smart-vulnerabilities/

Static website regenerated at each new commit that graphs entities saved in the database.

PoC for the paper "SoK: A Unified Data Model for Smart Contract Vulnerability Taxonomies".

## Contributing

1. Fork this repository
2. Edit the json database at `./src/data/out.json` and eventually the json schema at `./schema.json`
3. Create a pull request

## GitHub Actions

- Action to generate the website at each new commit
- Action to check the integrity of the json database on every new pull request

## Notes

- In this repository also the jaccard similarities files has been uploaded thanks to git lfs; you can find it here: `./jaccard_similarities_urls.xlsx`
