import highlightContent from '@focus-reactive/inline-edit';
import { contentTypeMap } from '@focus-reactive/graphql-content-layer/dist/content-type-map';
import './components/tabs';
import './components/header';
import svg4everybody from 'svg4everybody';
import msieversion from './components/detectIE';
import slider from './components/_slider';
import './components/_faq';
import noTouch from './components/noTouch';

noTouch();
$(window).resize(function() {
  $('body').css('--vh', `${window.innerHeight * 0.01}px`);
});

function touch() {
  return 'ontouchstart' in window;
}

// detect
if (!touch()) {
  $('body').addClass('no-touch');
}
svg4everybody();

// detect IE
let isIE = msieversion();
if (isIE !== 'otherbrowser') {
  $('body').addClass('is-ie');
}

if ($('.js-slider')) {
  slider();
}

highlightContent({ contentTypeMap });

window.selectGeneralTrack = () => document.querySelector('a.schedule__tab-link[data-tab="1"]').click();
window.selectNativeTrack = () => document.querySelector('a.schedule__tab-link[data-tab="2"]').click();
