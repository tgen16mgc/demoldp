# Client feedback 09/06 status

Source converted to Markdown:
- `/Users/tienduonn/Downloads/LDP cmt 0906_Hanh comment (2).md`

Fixed in code:
- Banner now uses the newer final VI/EN assets with the truck shifted right: `finalvi.webp`, `finalen.webp`.
- Removed the post-banner "GIÁ TRỊ VƯỢT THỜI GIAN" content strip so the page flows directly from banner to appreciation.
- Reordered sections to Appreciation -> Video -> Milestones -> Statistics.
- Replaced the director image with the official Hino website image that includes the truck background.
- Milestones now appear before statistics, have no top A30 logo, use gradient on only one heading line, remove the duplicate red year inside each item, and split multi-event years into bullets.
- Statistics labels were shortened in VI/EN and stat cards now keep number rows aligned.
- EN headings now receive matching gradient treatment where the VI page uses it.
- EN video heading is uppercase.
- EN yearbook CTA changed to "30TH ANNIVERSARY YEARBOOK".
- EN footer address changed from "22nd Floor" to "22nd floor".
- HTML text now uses the bundled local `Geist Variable` font stack, with tests blocking unimported `Plus Jakarta Sans` and `Helvetica Neue` regressions.

Cannot fix directly / needs confirmation:
- If the client expects animated gradient text inside the raster banner artwork, that cannot be applied directly in code without the editable banner design source.
- Any further change to the banner composition beyond the available final assets needs a revised design asset from the client/designer.
