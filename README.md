# Smart Vulnerabilities

PoC for the paper "SoK: A Unified Data Model for Smart Contract Vulnerability Taxonomies" - Claudia Ruggiero, Pietro Mazzini, Emilio Coppa, Simone Lenti, Silvia Bonomi at ARES 2024: Proceedings of the 18th International Conference on Availability, Reliability and Security.

Preprint of the paper at: https://github.com/ds-square/smart-vulnerabilities/blob/main/SoK__A_Unified_Data_Model_for_Smart_Contract_Vulnerability_Taxonomies_NEW.pdf

Static website regenerated at each new commit that graphs entities saved in the database.

https://ds-square.github.io/smart-vulnerabilities/

## Contributing

1. Fork this repository
2. Edit the json database at `./src/data/out.json` and eventually the json schema at `./schema.json`
3. Create a pull request

## GitHub Actions

- Action to generate the website at each new commit
- Action to check the integrity of the json database on every new pull request

## Notes

- In this repository also the jaccard similarities files has been uploaded thanks to git lfs; you can find it here: `./jaccard_similarities_urls.xlsx`

## Citation

```bibtex
@inproceedings{Ruggiero2024,
  author    = {Claudia Ruggiero and Pietro Mazzini and Emilio Coppa and Simone Lenti and Silvia Bonomi},
  title     = {{SoK: A Unified Data Model for Smart Contract Vulnerability Taxonomies}},
  booktitle = {Proceedings of the 18th International Conference on Availability, Reliability and Security},
  series    = {ARES},
  year      = {2024},
  doi       = {10.1145/3664476.3664507},
}
```
