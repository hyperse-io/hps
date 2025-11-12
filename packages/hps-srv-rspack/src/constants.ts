import process from 'node:process';
import { type EvolveEntryItemOption } from './types/types-entry-map.js';

export const moduleName = `@hyperse/hps-srv-rspack`;

/**
 * the configuration file of `hps-evolve`
 * hps-evolve.config.ts,.mjs,.mts
 */
export const configFileName = `hps-evolve`;

/**
 * `viewport.js`, Used to support the mobile `rem` adaptive solution.
 *  The viewport code is dynamically inserted to `html` file via `html-plugin`
 */
export const viewportScripts = `(function(d){var j;var b=1;var i=1;var h=750;var c=100;function e(s,o){var q=d.document;var l=q.documentElement;var k=navigator.userAgent;var m=k.toLowerCase().indexOf("android")>-1;i=d.devicePixelRatio||1;if(i>3){i=3}if(m){i=1}console.log("current devicePixelRatio:",i);l.setAttribute("data-dpr",i.toString());var p=q.querySelector('meta[name="viewport"]');if(!p){b=1/i;p=q.createElement("meta");p.setAttribute("name","viewport");q.head.appendChild(p);p.setAttribute(["content","width=device-width,user-scalable=no,initial-scale=",b,",maximum-scale=",b,",minimum-scale=",b].join(""))}function n(){var t=document.documentElement.clientWidth;j=t/o*(s/i)*i;q.documentElement.style.fontSize=String(j)+"px"}var r;d.addEventListener("resize",function(){clearTimeout(r);r=setTimeout(n,300)},false);d.addEventListener("onload",n,false);n()}e(c,h);window.fabricViewport={currRem:j,currDpr:i,currScale:b,dpiPX2px:function f(k){return parseFloat(k.toString())/j*100+"px"},px2DPIpx:function a(k){return parseFloat(k.toString())/100*j+"px"},px2rem:function g(k){return parseFloat(k.toString())/100+"rem"}}})(window);`;

/**
 * Array of keys to ignore in the verifyGroupEntryOptions step
 */
export const ignoreEntryOptionKeys: Array<keyof EvolveEntryItemOption> = [
  'title',
];

/**
 * The spinner frames used for build progress indicator
 * Different frames for Windows and Unix-like systems
 * Windows: simple ASCII characters
 * Unix: Braille patterns for smoother animation
 */
export const buildProgressSpinnerFrames =
  process.platform === 'win32'
    ? ['-', '\\', '|', '/']
    : ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
