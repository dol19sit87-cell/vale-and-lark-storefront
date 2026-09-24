# Vale & Lark — The Everyday Puffer

A responsive storefront redesign using Vale & Lark's supplied L2 product photographs. Plain HTML, CSS, and JavaScript; no build or runtime dependencies.

## Preview locally

```sh
python3 -m http.server 8765 --directory dist
```

Open http://localhost:8765.

## Shopping behavior

- Mocha and Jet Black, with sizes S, M, and L, at $69 USD.
- Five gallery photos per color, image enlargement, and swipe navigation.
- Required size selection, quantity controls, a local shopping bag, and inches/cm size chart.
- Checkout links use Shopify's documented cart permalink format with the existing live variant IDs. The live Shopify store confirms availability, totals, and payment options.
- This standalone preview does not replace the current Shopify theme or alter the live domain. The local bag is separate from a pre-existing Shopify cart.
- Product and policy facts were checked against valeandlark.com on 2026-09-24. Prices, variants, and terms in this static preview require updates if the original store changes.
- No fabricated reviews, discounts, scarcity, or temperature/waterproof ratings.

## Assets and publishing

`dist/` contains the deployable site. The first Mocha photo uses the latest user-supplied `ЧИСТОВИК-L2/studio_mocha_front.png` (updated 2026-09-24), encoded as WebP without further generative edits. Its existing filename `studio_mocha_front-v2.webp` and matching thumbnail are retained, with a content-based cache revision. Prior versions are preserved in `asset-archive/`. Original user photographs remain untouched. Google Fonts supplies DM Sans and Instrument Serif; system fallbacks are declared.

The public preview is hosted through Sites; the code is mirrored to GitHub. The live checkout and policy destinations remain on valeandlark.com. This is a design preview, with indexing disabled to avoid duplicating the existing store in search results.

## Validation

Checked JavaScript syntax, local asset references and anchor targets, color/size selection, cart totals and Shopify variant mapping, inches/cm size chart, mobile layout, image loading, and page errors. WebMCP selection tools were checked for valid input and rejection of invalid choices. No payment was submitted.

Brand assets and supplied images remain the property of their respective owner. No third-party reuse license is granted by this repository.
