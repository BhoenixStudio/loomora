import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

async function buildCss() {
  const playgroundNodeModules = path.resolve(rootDir, 'playground/node_modules')
  const postcssPath = path.resolve(rootDir, 'node_modules/.pnpm/postcss@8.5.28/node_modules/postcss/lib/postcss.mjs')
  const tailwindPostcssPath = path.resolve(playgroundNodeModules, '@tailwindcss/postcss/dist/index.mjs')

  const { default: postcss } = await import(`file:///${postcssPath.replace(/\\/g, '/')}`)
  const { default: tailwindPostcss } = await import(`file:///${tailwindPostcssPath.replace(/\\/g, '/')}`)

  const tailwindInput = `
@import 'tailwindcss/theme';
@import 'tailwindcss/utilities';
@source '${path.resolve(rootDir, 'src').replace(/\\/g, '/')}';

@custom-variant dark (&:where(.dark, .dark *));

:root {
  color-scheme: light;
  --loomora-primary: #f37035;
  --loomora-secondary: #173e58;
  --loomora-success: #1a841f;
  --loomora-error: #c92020;
  --loomora-warning: #efd002;
  --loomora-info: #0c86f2;
  --loomora-star: #cdb001;
  --loomora-main: #f5f7fa;
  --loomora-second: #ffffff;
  --loomora-third: #e7ebf0;
  --loomora-title-1: #18212b;
  --loomora-title-2: #344252;
  --loomora-title-3: #485769;
  --loomora-body-1: #475569;
  --loomora-body-2: #66758a;
  --loomora-body-3: #8390a1;
}

.dark:root, :root.dark, [data-theme='dark']:root {
  color-scheme: dark;
  --loomora-secondary: #72b3cc;
  --loomora-main: #10151b;
  --loomora-second: #19212a;
  --loomora-third: #2a3440;
  --loomora-title-1: #f4f7fa;
  --loomora-title-2: #e0e7ef;
  --loomora-title-3: #c3ceda;
  --loomora-body-1: #c3ceda;
  --loomora-body-2: #a1afbe;
  --loomora-body-3: #8390a1;
}

:root, .dark:root, :root.dark, [data-theme='dark']:root {
  --color-primary: var(--loomora-primary);
  --color-secondary: var(--loomora-secondary);
  --color-success: var(--loomora-success);
  --color-error: var(--loomora-error);
  --color-warning: var(--loomora-warning);
  --color-info: var(--loomora-info);
  --color-star: var(--loomora-star);
  --color-main: var(--loomora-main);
  --color-second: var(--loomora-second);
  --color-third: var(--loomora-third);
  --color-title-1: var(--loomora-title-1);
  --color-title-2: var(--loomora-title-2);
  --color-title-3: var(--loomora-title-3);
  --color-body-1: var(--loomora-body-1);
  --color-body-2: var(--loomora-body-2);
  --color-body-3: var(--loomora-body-3);
  --switch-speed: 0.5s;
  --switch-size: 1.4em;
  --switch-padding: 0.12em;
  --checkbox-speed: 0.4s;
  --checkbox-size: 1.35em;
}

@theme {
  --color-primary: var(--loomora-primary);
  --color-secondary: var(--loomora-secondary);
  --color-success: var(--loomora-success);
  --color-error: var(--loomora-error);
  --color-warning: var(--loomora-warning);
  --color-info: var(--loomora-info);
  --color-star: var(--loomora-star);
  --color-main: var(--loomora-main);
  --color-second: var(--loomora-second);
  --color-third: var(--loomora-third);
  --color-title-1: var(--loomora-title-1);
  --color-title-2: var(--loomora-title-2);
  --color-title-3: var(--loomora-title-3);
  --color-body-1: var(--loomora-body-1);
  --color-body-2: var(--loomora-body-2);
  --color-body-3: var(--loomora-body-3);
  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
}
`

  const processed = await postcss([tailwindPostcss({ base: path.resolve(rootDir, 'playground') })]).process(
    tailwindInput,
    { from: path.resolve(rootDir, 'playground/app/globals.css') }
  )

  const componentStyles = `
/* ==========================================================================
   Loomora Component-Specific Styles & Keyframe Animations
   ========================================================================== */

/* Scoped Box-Sizing for Loomora Components */
[class*='loomora-'],
[class*='loomora-'] *,
[class*='loomora-'] *::before,
[class*='loomora-'] *::after,
.text-editor-field,
.text-editor-field *,
.range-field__input {
  box-sizing: border-box;
}

/* Accordion */
.loomora-accordion {
  --loomora-accordion-entrance-delay: 0.1s;
  opacity: 0;
  transform: translateY(20px);
}

.loomora-accordion--entered {
  animation: loomora-accordion-enter 0.5s ease-out both;
  animation-delay: var(--loomora-accordion-entrance-delay);
}

@keyframes loomora-accordion-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loomora-accordion__trigger {
  transform: rotate(180deg);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.loomora-accordion__trigger--collapsed {
  transform: rotate(0deg);
}

.loomora-accordion__title--effects {
  transition: transform 0.2s ease-in-out;
}

.loomora-accordion__title--effects:hover {
  transform: translateX(4px);
}

.loomora-accordion__title--effects:active {
  transform: translateX(4px) scale(0.995);
}

.loomora-accordion__content {
  display: grid;
  grid-template-rows: 1fr;
  overflow: hidden;
  opacity: 1;
  transition:
    grid-template-rows 0.3s ease,
    opacity 0.3s ease;
}

.loomora-accordion__content--collapsed {
  grid-template-rows: 0fr;
  opacity: 0;
}

.loomora-accordion__content-inner {
  min-height: 0;
  overflow: hidden;
}

/* Dropdown */
.loomora-dropdown--top {
  --loomora-dropdown-offset: -8px;
}

.loomora-dropdown--bottom {
  --loomora-dropdown-offset: 8px;
}

.loomora-dropdown--enter {
  animation: loomora-dropdown-enter 0.15s ease-in-out both;
}

.loomora-dropdown--exit {
  animation: loomora-dropdown-exit 0.15s ease-in-out both;
}

@keyframes loomora-dropdown-enter {
  from {
    opacity: 0;
    transform: translateY(var(--loomora-dropdown-offset)) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes loomora-dropdown-exit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(var(--loomora-dropdown-offset)) scale(0.95);
  }
}

/* Autocomplete */
.loomora-autocomplete-animate-in-bottom {
  animation: dropdownFadeInBottom 150ms ease-out forwards;
}

.loomora-autocomplete-animate-in-top {
  animation: dropdownFadeInTop 150ms ease-out forwards;
}

@keyframes dropdownFadeInBottom {
  0% {
    opacity: 0;
    transform: translateY(-4px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdownFadeInTop {
  0% {
    opacity: 0;
    transform: translateY(4px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Switch & Checkbox Keyframes */
@keyframes switch-slider {
  0% {
    width: unset;
    margin-inline-start: unset;
  }
  25%,
  90% {
    width: 100%;
    margin-inline-start: unset;
  }
  91% {
    margin-inline-start: auto;
  }
  100% {
    width: unset;
  }
}

@keyframes switch-slider-reverse {
  0% {
    width: unset;
    margin-inline-start: auto;
  }
  10%,
  75% {
    width: 100%;
    margin-inline-start: unset;
  }
  100% {
    width: unset;
    margin-inline-start: unset;
  }
}

@keyframes checkbox-ripple {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -50%) scale(20);
    opacity: 0;
  }
}

/* Range input styling */
.range-field__input {
  -webkit-appearance: none;
  appearance: none;
  height: 24px;
  margin: 0;
  padding: 0;
  background: transparent;
  outline: none;
}

.range-field__input::-webkit-slider-runnable-track,
.range-field__input::-moz-range-track {
  height: 24px;
  border: 0;
  background: transparent;
}

.range-field__input::-webkit-slider-thumb,
.range-field__input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  box-shadow: none;
  cursor: grab;
}

.range-field__input:active::-webkit-slider-thumb,
.range-field__input:active::-moz-range-thumb {
  cursor: grabbing;
}

/* Motion reduction */
@media (prefers-reduced-motion: reduce) {
  .loomora-accordion,
  .loomora-accordion--entered,
  .loomora-accordion__trigger,
  .loomora-accordion__title--effects,
  .loomora-accordion__content {
    animation: none;
    transition: none;
  }

  .loomora-dropdown--enter,
  .loomora-dropdown--exit {
    animation-duration: 0.01ms;
  }

  .loomora-accordion {
    opacity: 1;
    transform: none;
  }
}
`

  const finalCss = `/**
 * Loomora Design System Stylesheet
 * Pre-compiled Tailwind utilities, theme design tokens, and component keyframes.
 * Supports both Tailwind and Non-Tailwind consumer projects.
 */

${processed.css}

${componentStyles}
`

  const outputPath = path.resolve(rootDir, 'src/styles/index.css')
  fs.writeFileSync(outputPath, finalCss, 'utf-8')
  console.log(`Loomora CSS generated successfully -> ${outputPath} (${finalCss.length} bytes)`)

  // Also write to dist/index.css if dist exists
  const distCssPath = path.resolve(rootDir, 'dist/index.css')
  if (fs.existsSync(path.resolve(rootDir, 'dist'))) {
    fs.writeFileSync(distCssPath, finalCss, 'utf-8')
    console.log(`Updated dist/index.css (${finalCss.length} bytes)`)
  }
}

buildCss().catch((err) => {
  console.error('Error generating Loomora CSS:', err)
  process.exit(1)
})
