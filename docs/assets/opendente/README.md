# OpenDente portfolio assets

Local integration prepared on 26 October 2026. Source: [JulienEsbt/OpenDente](https://github.com/JulienEsbt/OpenDente), README for Personal Edition 0.8.0 (README blob 8d79c9e2b51b69f65d141982d842e90801e520ca). Product copy distinguishes this fork's additions, upstream credits, experimental native control and the documented MacBook Air M3 hardware scope.

Screenshots were provided by Julien in the OpenDente / Image Appli folder. They are resized to WebP at 360px, 720px and original width, without retouching interface content. The portfolio cover arranges the light and dark French panels on a dark background. The social image uses the same dark panel. All images are served from the site; none depends on GitHub image hosting.

The page selects French or English panels and settings to match the site language. The shared MagSafe view is in English, stated in the French caption. The original files remain untouched.

| Asset | Source file | Original SHA-256 |
| --- | --- | --- |
| panel-fr-light | Capture d’écran 2026-10-26 à 13.57.46.png | f1c4282a774ecf7f9711cefb26c4fca0c454346594cee5fb8229543f097e78e6 |
| panel-fr-dark | Capture d’écran 2026-10-26 à 13.58.09.png | 0987a8a3ea6257d590fd1c767e40606ce8be0e2a7696f6354869e49543bb55a9 |
| panel-en-light | Capture d’écran 2026-10-26 à 13.58.59.png | 522d4f635ccc8263d42f5c917c53960d49b645190c8ca405393768dd1cb4fee8 |
| panel-en-dark | Capture d’écran 2026-10-26 à 13.59.13.png | 8602d24157e8a1b71c9fb4e64893e433515e3bcdf11f77ab9ed8cc1081ac35a7 |
| charge-fr | Capture d’écran 2026-10-26 à 14.00.28.png | bb8961b012b8fdd054c69ef52ac0cda647e72da13bcf59bfba9f987168830b2f |
| charge-en | Capture d’écran 2026-10-26 à 13.59.31.png | 1d2cbf38238c0aeaefd60a62f84b06659f84e3a0138fbd1ff20dad4c848e0845 |
| menu-fr | Capture d’écran 2026-10-26 à 14.00.32.png | 99b517a096dea7b875ad4c478633e511ea0eb6d5ac6e93b61957c9bf6b181359 |
| menu-en | Capture d’écran 2026-10-26 à 13.59.51.png | 2aa8fef8a447fbf4f749e062a705b485cc322e55f1210b498d32f1f274d84334 |
| magsafe-en | Capture d’écran 2026-10-26 à 13.59.45.png | 740335457c3ffca9795c9118b27490e5fb524c1446a271ec50af96de1480543f |
| guide-fr | Capture d’écran 2026-10-26 à 14.00.40.png | 58988ccb9288645fd205bdbafbc270dd662715ffef7ad44f0825bfb09ba2c11a |
| guide-en | Capture d’écran 2026-10-26 à 14.00.09.png | c9f68842cdc1c58f8dd3f9ed3f0bbfba436a7a71f534046ef77347e3535f9ffc |

## Local review

- French: /projects/opendente
- English: /en/projects/opendente
- Home card: /#portfolio (five-project index with one visible detail panel on desktop, native accordions on phones)
- Browser checks: npx playwright test e2e/opendente.spec.js

Changes unrelated to OpenDente and the portfolio layout are excluded, including the preexisting edits within e2e/portfolio.spec.js. This integration is prepared and committed locally; publishing and deployment require a separate step.


## Portfolio navigation

On wide screens, the project index follows native page scrolling while the selected card stays in view. Manual choice and keyboard navigation remain available. The scroll scene is enabled only when the complete presentation fits above the navigation dock; reduced motion, shorter screens and phones keep manual navigation. Expanding Agora releases the scene into ordinary document flow at the current reading position.

The three case studies share their header actions: back to projects, an optional context action, and the primary GitHub repository link. Labels, order and mobile button layout are shared in both languages.
