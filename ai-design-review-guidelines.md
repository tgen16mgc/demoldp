# AI Design Agent Review Guidelines

As an AI coding and design agent, your goal is to help build **iconic, original, and highly-converting** landing pages. With the rise of LLM-generated UI, many websites have fallen into the trap of "AI Design Slop"—using ubiquitous, generic, and over-animated patterns simply because they are easy to generate. 

When reviewing or building a website, strictly evaluate it against the following principles to ensure it stands out and provides a premium user experience.

## 1. Core Philosophy: Intentionality over Capability
* **Just because you can, doesn't mean you should:** AI can easily generate complex SVGs, floating meteors, and wild animations. If an element doesn't actively help explain the product or convert a visitor, remove it.
* **Don't outsource the thinking:** The website is a customer acquisition channel. Focus on the core message: *What are we making? For whom? Why should they care?* 
* **QA Everything:** AI-generated code often has tiny visual bugs (e.g., overlapping menus, broken selection states). Review interactions carefully.

## 2. Visual Identity & "Slop" Avoidance
* **Ban the Default Purple Gradient:** Unless it is explicitly part of the established brand guidelines, avoid the default "AI startup" purple/pink gradients. Demand an original color palette.
* **Avoid the "Fake Dashboard" Cliché:** Stop generating generic dashboards with Red/Yellow/Green/Blue dots and lazy UI structures.
* **Elevate the Bento Box:** The 3x2 grid with a system emoji at the top is overused. If using a grid layout, ensure the content is meaty and the iconography is custom and on-brand.
* **The 100% Height Hero Trap:** Do not make the hero section take up exactly 100% of the viewport height. Leave a small piece (e.g., 20-40 pixels) of the next section "peeking up" from the bottom to naturally invite users to scroll.

## 3. Interaction & Motion Rules
* **No "Dumb" Hover Effects:**
  * Do not make text or buttons fade out/disappear on hover.
  * Do not add random vertical/horizontal shifting that makes clicking a moving target.
  * **Rule of thumb:** The browser already provides a hand cursor. Hover effects should be subtle (a slight pop, a lighter shade, or a soft glow) and invite the click.
* **Never Hide Critical Features Behind Hover:** Do not reveal essential information or core product functionality *only* on hover. It ruins discoverability and breaks completely on mobile devices.
* **Ban Scroll-Jacking:** Do not hijack the native browser scroll to force animations. Users should not feel like they are "scrolling through molasses" to read content.
* **Kill Pointless Fade-Ins:** Avoid fading in content on a timer as the user scrolls. Scrolling *is* the motion. Fast scrollers will blow right past your content before it even appears.
* **Remove Distracting Background Animations:** Random lines tracking the scroll or meteors shooting across the background distract users from the actual copy. Keep attention on the value proposition.

## 4. Usability & UX Standards
* **Button Integrity:** If it looks like a button and has a hover state, it must be clickable and do exactly what is expected. No "head fakes" or confusing shape-shifting buttons.
* **Typography & Hierarchy:** Keep styles tight. Do not mix 4-5 different text styles/colors in a single hero section. The H1 must be prominent, clear, and accompanied by a distinct Call to Action (CTA) above the fold.
* **Contrast & Legibility:** Ensure high contrast. If using dynamic backgrounds (like videos or moving grids), ensure that fixed navigation menus remain readable no matter what passes behind them.
* **Asset Quality:** Use only high-resolution, crisp images. Remove blurry placeholder images.

---
**Agent Instruction:** When reviewing a page, go through this checklist line by line. Point out any instances of "AI Slop" and propose refactors that simplify the design, improve readability, and restore originality to the brand.
