# Exercise Physiology: from muscle action to glucose

Interactive teaching modules that trace how muscle uses ATP and how the body regenerates it from carbohydrate and fat.

**Live:** [alanruddock.com/atp](https://alanruddock.com/atp/)

## Modules

| Module | Covers |
|---|---|
| Metabolism 101 | Foundational glossary |
| Sarcomere | How ATP powers muscle action |
| ATP transport | How ATP reaches the cytoplasm |
| ATP synthase | How the proton gradient drives ATP production |
| Electron transport chain | How electrons build the proton gradient |
| Krebs cycle | Carbon fuels to electron carriers |
| PDH complex | Pyruvate to acetyl-CoA |
| Glycolysis | Glucose to pyruvate |
| Lactate shuttle | Lactate as a fuel, not a waste product |
| Beta-oxidation | Fat to electron carriers |
| Metabolic profile | How fuel use shifts with exercise intensity |
| Fatigue | Why muscles fail |

The home page works backwards through the energy pathway and adds up the ATP yield from one glucose molecule (about 30 to 32 ATP).

## Run locally

Plain HTML, CSS and JavaScript with no build step. Shared navigation, theme, tooltip and tutorial scripts live in `shared/`. Serve the folder and open http://localhost:8000:

```bash
python3 -m http.server 8000
```

## Author

Alan Ruddock, exercise physiologist, Sheffield Hallam University ([alanruddock.com](https://alanruddock.com)).
