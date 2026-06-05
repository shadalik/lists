"use strict";
(function () {
    if (window.LampaCardsFinalCssDotsV2) return;
    window.LampaCardsFinalCssDotsV2 = true;

    var STYLE_ID = 'lampa-cards-final-css-dots-style-v2';
    var MENU_STYLE_ID = 'lampa-cards-final-css-dots-menu-style-v2';
    var SETTINGS_STYLE_ID = 'lampa-cards-final-css-dots-settings-style-v2';
    var HEAD_STYLE_ID = 'lampa-cards-final-css-dots-head-style-v2';
    var FULL_STYLE_ID = 'lampa-cards-final-css-dots-full-style-v2';
    var TIMETABLE_STYLE_ID = 'lampa-cards-final-css-dots-timetable-style-v2';
    var PERFORMANCE_STYLE_ID = 'lampa-cards-final-css-dots-performance-style-v2';
    var COLOR_STYLE_ID = 'lampa-cards-final-css-dots-color-style-v2';
    var SETTINGS_COMPONENT = 'themex';
    var SETTINGS_FIELD_MAIN = 'temav_home';
    var SETTINGS_FIELD_MENU = 'temav_left_menu';
    var SETTINGS_FIELD_SETTINGS = 'temav_settings_panel';
    var SETTINGS_FIELD_HEAD = 'temav_head';
    var SETTINGS_FIELD_FULL = 'temav_full_page';
    var SETTINGS_FIELD_TIMETABLE = 'temav_timetable';
    var SETTINGS_FIELD_PERFORMANCE = 'temav_performance';
    var SETTINGS_FIELD_QUALITY = 'temav_quality';
    var SETTINGS_FIELD_RATINGS = 'temav_ratings';
    var SETTINGS_FIELD_RELEASE_YEAR = 'temav_show_release_year';
    var SETTINGS_FIELD_EPISODE_NUMBER = 'temav_show_episode_number';
    var SETTINGS_FIELD_GENRES = 'temav_show_genres';
    var SETTINGS_FIELD_REPLACE_POSTER = 'temav_replace_poster';
    var SETTINGS_FIELD_THEME_COLOR = 'temav_theme_color';
    var SETTINGS_FIELD_LOGO_TITLES = 'logo_glav';
    var settingsRegistered = false;
    var themeEnabled = true;
    var menuEnabled = true;
    var settingsPanelEnabled = true;
    var headEnabled = true;
    var fullPageEnabled = true;
    var timetableEnabled = true;
    var performanceMode = 'full';
    var qualityMode = 'color';
    var ratingsMode = 'show';
    var showReleaseYear = true;
    var showEpisodeNumber = true;
    var showGenres = true;
    var replacePoster = true;
    var themeColor = 'emerald';
    var logoTitlesEnabled = true;
    var menuClockTimer = null;
    var menuShellTimer = null;
    var settingsWasOpen = false;
    var selectboxWasOpen = false;
    var menuWasOpen = false;
    var panelBootTimer = null;
    var started = false;
    var episodeDetailsCache = {};
    var episodeDetailsPending = {};
    var episodeDetailsQueue = [];
    var episodeDetailsActive = 0;
    var episodeDetailsLimit = 2;
    var qualityCache = null;
    var qualityPending = {};
    var qualityQueue = [];
    var qualityActive = 0;
    var qualityLimit = 4;
    var qualityApi = {
        apn: [''],
        sources: [{
            url: 'https://api.apbugall.org',
            token: '8da1c9beda9545174264dc9f63a77d'
        }, {
            url: 'https://upn.stull.xyz',
            token: 'd317441359e505c343c2063edc97e7'
        }]
    };

    function upsertStyle(id, css) {
        var old = document.getElementById(id);
        var current = '';
        var style;
        var head;

        if (old) {
            try {
                current = old.styleSheet ? old.styleSheet.cssText : (old.textContent || old.innerText || '');
            } catch (e) {
                current = '';
            }
            if (current === css) return;
            if (old.parentNode) old.parentNode.removeChild(old);
        }

        style = document.createElement('style');
        style.id = id;
        style.type = 'text/css';
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));
        head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        head.appendChild(style);
    }

    function injectStyle() {
        var old = document.getElementById('lampa-cards-final-css-dots-style');
        if (old && old.parentNode) old.parentNode.removeChild(old);

        var css = [
            ".card.beauty-card-final {",
            "    position: relative !important;",
            "    overflow: visible !important;",
            "    transform: none !important;",
            "}",
            "",
            ".card.beauty-card-final > .card__title,",
            ".card.beauty-card-final > .card__age {",
            "    visibility: hidden !important;",
            "    opacity: 0 !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".card.beauty-card-final .card__view {",
            "    position: relative !important;",
            "    overflow: hidden !important;",
            "    margin-bottom: 1em !important;",
            "    border-radius: .82em !important;",
            "    background-color: #050608 !important;",
            "    background-size: cover !important;",
            "    background-position: center top !important;",
            "    background-repeat: no-repeat !important;",
            "    box-shadow: 0 .56em 1.25em rgba(0,0,0,.24), 0 0 0 .06em rgba(110,132,255,.10);",
            "    transform: translateZ(0) !important;",
            "    transform-origin: center center;",
            "}",
            "",
            ".card.beauty-card-final .card__img {",
            "    display: block !important;",
            "    opacity: 1 !important;",
            "    visibility: visible !important;",
            "    width: 100% !important;",
            "    height: 100% !important;",
            "    object-fit: cover;",
            "    object-position: center top;",
            "    border-radius: .82em !important;",
            "    background-color: #050608 !important;",
            "    z-index: 1 !important;",
            "}",
            ".card.beauty-card-final .card__img[src*='img_load'],",
            ".card.beauty-card-final .card__img[src*='img_broken'],",
            ".card.beauty-card-final .card__img[src*='placeholder'] {",
            "    opacity: 0 !important;",
            "}",
            "",
            ".card.beauty-card-final.beauty-bg-active .card__img {",
            "    opacity: 0 !important;",
            "}",
            "",
            ".card.beauty-card-final.beauty-img-ready .card__img {",
            "    opacity: 1 !important;",
            "}",
            "",
            ".card.beauty-card-final .card__view > .card__vote,",
            ".card.beauty-card-final .card__view > .card__quality,",
            ".card.beauty-card-final .card__view > .card__type {",
            "    display: none !important;",
            "}",
            "",
            ".card.beauty-card-final .beauty-overlay {",
            "    position: absolute;",
            "    left: 0;",
            "    top: 0;",
            "    right: 0;",
            "    bottom: 0;",
            "    z-index: 5;",
            "    pointer-events: none;",
            "    border-radius: .82em;",
            "    overflow: hidden;",
            "}",
            "",
            ".card.beauty-card-final .beauty-overlay::before {",
            "    content: '';",
            "    position: absolute;",
            "    left: 0;",
            "    top: 0;",
            "    right: 0;",
            "    bottom: 0;",
            "    z-index: 1;",
            "    background: linear-gradient(to top, rgba(6,9,16,.98) 0%, rgba(6,9,16,.78) 18%, rgba(6,9,16,.30) 42%, rgba(6,9,16,.08) 68%, rgba(6,9,16,.18) 100%);",
            "}",
            "",
            ".card.beauty-card-final .beauty-overlay::after {",
            "    content: '';",
            "    position: absolute;",
            "    left: 0;",
            "    top: 0;",
            "    right: 0;",
            "    bottom: 0;",
            "    z-index: 2;",
            "    border-radius: .82em;",
            "    box-shadow: inset 0 0 0 .06em rgba(124,148,255,.18);",
            "}",
            "",
            ".card.beauty-card-final .beauty-top {",
            "    position: absolute;",
            "    left: .72em;",
            "    top: .58em;",
            "    right: .72em;",
            "    z-index: 3;",
            "    display: flex;",
            "    align-items: flex-start;",
            "    justify-content: space-between;",
            "}",
            "",
            ".card.beauty-card-final .beauty-year {",
            "    min-width: 2.7em;",
            "    min-height: 1.55em;",
            "    padding: .22em .62em;",
            "    border-radius: .46em;",
            "    background: rgba(43,25,14,.74);",
            "    border: .06em solid rgba(255,125,31,.18);",
            "    color: #ff8a1f;",
            "    font-size: .72em;",
            "    line-height: 1.1;",
            "    font-weight: 800;",
            "    text-shadow: 0 .08em .16em rgba(0,0,0,.65);",
            "    box-shadow: 0 .22em .72em rgba(0,0,0,.24), inset 0 0 0 .06em rgba(255,145,41,.10);",
            "}",
            "",
            ".card.beauty-card-final .beauty-year:empty {",
            "    display: none !important;",
            "}",
            "",
            ".card.beauty-card-final .beauty-quality {",
            "    display: none;",
            "    margin-left: auto;",
            "    padding: .22em .52em;",
            "    border-radius: .38em;",
            "    color: #ffffff;",
            "    background: rgba(6,9,16,.62);",
            "    border: .06em solid rgba(255,255,255,.24);",
            "    font-size: .72em;",
            "    line-height: 1.1;",
            "    font-weight: 900;",
            "    text-transform: uppercase;",
            "    box-shadow: 0 .22em .72em rgba(0,0,0,.22);",
            "}",
            "",
            ".card.beauty-card-final.beauty-has-quality .beauty-quality {",
            "    display: inline-flex;",
            "}",
            "",
            ".card.beauty-card-final .beauty-quality--4k {",
            "    color: #81c784;",
            "    border-color: rgba(76,175,80,.44);",
            "}",
            "",
            ".card.beauty-card-final .beauty-quality--hd {",
            "    color: #64b5f6;",
            "    border-color: rgba(33,150,243,.44);",
            "}",
            "",
            ".card.beauty-card-final .beauty-quality--ts {",
            "    color: #e57373;",
            "    border-color: rgba(244,67,54,.44);",
            "}",
            "",
            ".card.beauty-card-final .beauty-quality--no-color {",
            "    color: #ffffff !important;",
            "    border-color: rgba(255,255,255,.28) !important;",
            "}",
            "",
            ".card.beauty-card-final .beauty-play {",
            "    display: none !important;",
            "}",
            "",
            ".card.beauty-card-final .beauty-bottom {",
            "    position: absolute;",
            "    left: .78em;",
            "    right: .78em;",
            "    bottom: .58em;",
            "    z-index: 3;",
            "    color: #fff;",
            "}",
            "",
            ".card.beauty-card-final .beauty-title {",
            "    font-size: .86em;",
            "    line-height: 1.22;",
            "    font-weight: 700;",
            "    max-height: 2.48em;",
            "    overflow: hidden;",
            "    text-shadow: 0 .14em .5em rgba(0,0,0,.65);",
            "    word-break: normal;",
            "}",
            "",
            ".card.beauty-card-final .beauty-genres {",
            "    display: none;",
            "    margin-bottom: .22em;",
            "    color: rgba(255,255,255,.78);",
            "    font-size: .72em;",
            "    line-height: 1.15;",
            "    font-weight: 650;",
            "    overflow: hidden;",
            "    white-space: nowrap;",
            "    text-overflow: ellipsis;",
            "    text-shadow: 0 .12em .42em rgba(0,0,0,.62);",
            "}",
            "",
            ".card.beauty-card-final.beauty-has-genres .beauty-genres {",
            "    display: block;",
            "}",
            "",
            ".card.beauty-card-final .beauty-info {",
            "    margin-top: .36em;",
            "    min-height: 1.15em;",
            "    display: flex;",
            "    align-items: center;",
            "    justify-content: space-between;",
            "    gap: .58em;",
            "    font-size: .78em;",
            "    line-height: 1;",
            "    font-weight: 800;",
            "}",
            "",
            ".card.beauty-card-final .beauty-rating {",
            "    display: inline-flex;",
            "    align-items: center;",
            "    gap: .36em;",
            "    color: #f5f7fb;",
            "}",
            "",
            ".card.beauty-card-final .beauty-rating.rating-excellent { color: #81c784; }",
            ".card.beauty-card-final .beauty-rating.rating-good { color: #64b5f6; }",
            ".card.beauty-card-final .beauty-rating.rating-average { color: #ff9800; }",
            ".card.beauty-card-final .beauty-rating.rating-poor { color: #ff7043; }",
            ".card.beauty-card-final .beauty-rating.rating-terrible { color: #e53935; }",
            ".card.beauty-card-final .beauty-rating.rating-excellent .beauty-star,",
            ".card.beauty-card-final .beauty-rating.rating-good .beauty-star,",
            ".card.beauty-card-final .beauty-rating.rating-average .beauty-star,",
            ".card.beauty-card-final .beauty-rating.rating-poor .beauty-star,",
            ".card.beauty-card-final .beauty-rating.rating-terrible .beauty-star {",
            "    color: currentColor;",
            "}",
            "",
            ".card.beauty-card-final .beauty-star {",
            "    color: #5cff84;",
            "    font-size: 1.18em;",
            "    line-height: 1;",
            "}",
            "",
            ".card.beauty-card-final .beauty-episode {",
            "    display: none;",
            "    margin-left: auto;",
            "    padding: .34em .58em;",
            "    border-radius: .42em;",
            "    color: #78ff91;",
            "    background: rgba(34,197,94,.12);",
            "    border: .06em solid rgba(92,255,132,.36);",
            "    font-size: .72em;",
            "    line-height: 1;",
            "    font-weight: 900;",
            "    letter-spacing: 0;",
            "}",
            "",
            ".card.beauty-card-final.beauty-has-episode .beauty-episode {",
            "    display: inline-flex;",
            "}",
            "",
            ".card.beauty-card-final.focus .card__view::after,",
            ".card.beauty-card-final.hover .card__view::after,",
            ".card.beauty-card-final.selector.focus .card__view::after,",
            ".card.beauty-card-final.selector.hover .card__view::after,",
            ".card.beauty-card-final.selector.traverse .card__view::after {",
            "    display: none !important;",
            "    content: none !important;",
            "}",
            "",
            ".card.beauty-card-final.focus .card__view,",
            ".card.beauty-card-final.hover .card__view,",
            ".card.beauty-card-final.selector.focus .card__view,",
            ".card.beauty-card-final.selector.hover .card__view,",
            ".card.beauty-card-final.selector.traverse .card__view {",
            "    box-shadow: 0 .88em 1.75em rgba(0,0,0,.34), 0 0 0 .06em rgba(124,148,255,.20), 0 0 1.12em rgba(76,103,255,.16);",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".card.beauty-card-final.focus .card__img,",
            ".card.beauty-card-final.hover .card__img,",
            ".card.beauty-card-final.selector.focus .card__img,",
            ".card.beauty-card-final.selector.hover .card__img,",
            ".card.beauty-card-final.selector.traverse .card__img {",
            "    transform: scale(1.08) !important;",
            "    filter: saturate(1.12) contrast(1.05);",
            "}",
            "",
            ".card.beauty-card-final .card__img,",
            ".card.beauty-card-final .card__view {",
            "    transition: transform .28s cubic-bezier(.2,0,.2,1), box-shadow .24s ease, filter .24s ease;",
            "}",
            "",
            "body.platform--orsay .card.beauty-card-final .card__img,",
            "body.platform--netcast .card.beauty-card-final .card__img,",
            "body.platform--webos .card.beauty-card-final .card__img,",
            "body.platform--tizen .card.beauty-card-final .card__img {",
            "    transition: transform .22s cubic-bezier(.2,0,.2,1);",
            "}",
            "",
            ".items-line.temav-line-cards {",
            "    min-height: 0 !important;",
            "    padding-bottom: 1.05em !important;",
            "}",
            "",
            ".items-line.temav-line-cards .items-line__head {",
            "    margin-bottom: 1.05em !important;",
            "}",
            "",
            ".items-line.temav-line-cards .items-line__body {",
            "    min-height: 0 !important;",
            "}",
            "",
            ".scroll__body.mapping--grid > .card.beauty-card-final,",
            ".mapping--grid > .card.beauty-card-final,",
            ".category-full > .card.beauty-card-final {",
            "    box-sizing: border-box;",
            "}",
            "",
            ".scroll__body.mapping--grid > .card.beauty-card-final .card__view,",
            ".mapping--grid > .card.beauty-card-final .card__view,",
            ".category-full > .card.beauty-card-final .card__view {",
            "    margin-left: 0 !important;",
            "    margin-right: 0 !important;",
            "    margin-bottom: .35em !important;",
            "}",
            "",
            ".scroll__body.mapping--grid > .card.beauty-card-final > .card__title,",
            ".scroll__body.mapping--grid > .card.beauty-card-final > .card__age,",
            ".mapping--grid > .card.beauty-card-final > .card__title,",
            ".mapping--grid > .card.beauty-card-final > .card__age,",
            ".category-full > .card.beauty-card-final > .card__title,",
            ".category-full > .card.beauty-card-final > .card__age {",
            "    display: none !important;",
            "    height: 0 !important;",
            "    min-height: 0 !important;",
            "    max-height: 0 !important;",
            "    margin: 0 !important;",
            "    padding: 0 !important;",
            "}",
            "",
            ".scroll__body.mapping--grid > .card.beauty-card-final,",
            ".mapping--grid > .card.beauty-card-final,",
            ".category-full > .card.beauty-card-final {",
            "    padding-bottom: .45em !important;",
            "}",
            "",
            ".items-line__more {",
            "    margin-left: 1em !important;",
            "    padding: .42em .92em .44em 1.02em !important;",
            "    border-radius: 999em !important;",
            "    background: rgba(5,7,10,.50) !important;",
            "    color: rgba(255,255,255,.88) !important;",
            "    font-size: .92em !important;",
            "    line-height: 1 !important;",
            "    font-weight: 600 !important;",
            "    box-shadow: inset 0 0 0 .055em rgba(255,255,255,.07), 0 .24em .7em rgba(0,0,0,.18) !important;",
            "    transition: background-color .16s ease, color .16s ease, box-shadow .16s ease, transform .16s ease !important;",
            "}",
            "",
            ".items-line__more::after {",
            "    content: '›' !important;",
            "    margin-left: .42em !important;",
            "    color: currentColor !important;",
            "    opacity: .64 !important;",
            "}",
            "",
            ".items-line__more.focus,",
            ".items-line__more.hover,",
            ".items-line__more.traverse {",
            "    color: rgba(6,30,29,.96) !important;",
            "    background: linear-gradient(100deg, rgba(82,255,179,.98), rgba(105,183,226,.96)) !important;",
            "    box-shadow: 0 .28em .78em rgba(65,218,188,.16), inset 0 0 0 .06em rgba(255,255,255,.20) !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".card-more {",
            "    overflow: visible !important;",
            "    padding-bottom: .45em !important;",
            "}",
            "",
            ".card-more__box {",
            "    border-radius: .82em !important;",
            "    overflow: hidden !important;",
            "    background: linear-gradient(145deg, rgba(14,18,24,.95), rgba(6,8,13,.98)) !important;",
            "    box-shadow: 0 .56em 1.25em rgba(0,0,0,.24), inset 0 0 0 .06em rgba(124,148,255,.14) !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".card-more__box::before {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    bottom: 0 !important;",
            "    background: radial-gradient(circle at 50% 35%, rgba(82,255,179,.20), rgba(105,183,226,.10) 32%, rgba(0,0,0,0) 68%), linear-gradient(180deg, rgba(255,255,255,.035), rgba(0,0,0,.20)) !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".card-more__title {",
            "    top: 50% !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    margin-top: -.62em !important;",
            "    color: rgba(255,255,255,.92) !important;",
            "    font-size: 1.18em !important;",
            "    line-height: 1.16 !important;",
            "    font-weight: 700 !important;",
            "    text-shadow: 0 .08em .24em rgba(0,0,0,.70) !important;",
            "}",
            "",
            ".card-more__title::after {",
            "    content: '›' !important;",
            "    display: inline-block !important;",
            "    margin-left: .35em !important;",
            "    color: rgba(93,244,190,.95) !important;",
            "}",
            "",
            ".card-more.focus .card-more__box,",
            ".card-more.hover .card-more__box,",
            ".card-more.traverse .card-more__box {",
            "    box-shadow: 0 .88em 1.75em rgba(0,0,0,.34), 0 0 0 .06em rgba(124,148,255,.20), 0 0 1.12em rgba(76,103,255,.16) !important;",
            "}",
            "",
            ".card-more.focus .card-more__box::after,",
            ".card-more.hover .card-more__box::after,",
            ".card-more.traverse .card-more__box::after {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    bottom: 0 !important;",
            "    border: .06em solid rgba(93,244,190,.34) !important;",
            "    border-radius: .82em !important;",
            "    z-index: 2 !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".register.register--line {",
            "    position: relative !important;",
            "    box-sizing: border-box !important;",
            "    min-width: 9.8em !important;",
            "    min-height: 6.2em !important;",
            "    padding: .9em 1.05em !important;",
            "    border-radius: .82em !important;",
            "    border: .06em solid rgba(255,255,255,.07) !important;",
            "    background: linear-gradient(145deg, rgba(14,18,24,.86), rgba(6,8,13,.92)) !important;",
            "    box-shadow: 0 .42em 1em rgba(0,0,0,.20), inset 0 0 0 .06em rgba(255,255,255,.04) !important;",
            "    color: rgba(255,255,255,.90) !important;",
            "    overflow: hidden !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".register.register--line::before {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    bottom: 0 !important;",
            "    background: radial-gradient(circle at 18% 18%, rgba(82,255,179,.16), rgba(105,183,226,.08) 34%, rgba(0,0,0,0) 68%) !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".register.register--line::after {",
            "    display: none !important;",
            "    content: none !important;",
            "}",
            "",
            ".register.register--line .register__name,",
            ".register.register--line .register__counter {",
            "    position: relative !important;",
            "    z-index: 1 !important;",
            "}",
            "",
            ".register.register--line .register__name {",
            "    max-width: 8em !important;",
            "    font-size: 1.02em !important;",
            "    line-height: 1.16 !important;",
            "    font-weight: 700 !important;",
            "    color: rgba(255,255,255,.86) !important;",
            "    white-space: nowrap !important;",
            "    overflow: hidden !important;",
            "    text-overflow: ellipsis !important;",
            "}",
            "",
            ".register.register--line .register__counter {",
            "    margin-top: .3em !important;",
            "    font-size: 2.02em !important;",
            "    line-height: 1 !important;",
            "    font-weight: 800 !important;",
            "    text-align: center !important;",
            "    color: rgba(255,255,255,.96) !important;",
            "}",
            "",
            ".register.register--line .register__limit {",
            "    font-size: .5em !important;",
            "    color: rgba(255,255,255,.62) !important;",
            "}",
            "",
            ".register.register--line.focus,",
            ".register.register--line.hover,",
            ".register.register--line.traverse {",
            "    color: rgba(6,30,29,.96) !important;",
            "    border-color: rgba(255,255,255,.22) !important;",
            "    background: linear-gradient(100deg, rgba(82,255,179,.98), rgba(105,183,226,.96)) !important;",
            "    box-shadow: 0 .44em 1em rgba(65,218,188,.18), inset 0 0 0 .06em rgba(255,255,255,.22) !important;",
            "}",
            "",
            ".register.register--line.focus::before,",
            ".register.register--line.hover::before,",
            ".register.register--line.traverse::before {",
            "    opacity: .18 !important;",
            "}",
            "",
            ".register.register--line.focus .register__name,",
            ".register.register--line.hover .register__name,",
            ".register.register--line.traverse .register__name,",
            ".register.register--line.focus .register__counter,",
            ".register.register--line.hover .register__counter,",
            ".register.register--line.traverse .register__counter {",
            "    color: rgba(6,30,29,.96) !important;",
            "}",
            "",
            ".bookmarks-folder {",
            "    overflow: visible !important;",
            "    padding-bottom: .45em !important;",
            "}",
            "",
            ".bookmarks-folder__inner {",
            "    position: relative !important;",
            "    overflow: hidden !important;",
            "    border-radius: .82em !important;",
            "    background: linear-gradient(145deg, rgba(14,18,24,.95), rgba(6,8,13,.98)) !important;",
            "    box-shadow: 0 .56em 1.25em rgba(0,0,0,.24), inset 0 0 0 .06em rgba(124,148,255,.14) !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".bookmarks-folder__inner::before {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    bottom: 0 !important;",
            "    background: radial-gradient(circle at 24% 18%, rgba(82,255,179,.20), rgba(105,183,226,.10) 34%, rgba(0,0,0,0) 68%), linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.22)) !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".bookmarks-folder__layer {",
            "    background: transparent !important;",
            "    border-radius: .82em !important;",
            "    color: rgba(255,255,255,.92) !important;",
            "}",
            "",
            ".bookmarks-folder__head {",
            "    position: relative !important;",
            "    z-index: 2 !important;",
            "    display: flex !important;",
            "    align-items: flex-start !important;",
            "    justify-content: space-between !important;",
            "    gap: .65em !important;",
            "    padding: .92em .98em .7em !important;",
            "}",
            "",
            ".bookmarks-folder__title {",
            "    min-width: 0 !important;",
            "    font-size: 1.08em !important;",
            "    line-height: 1.16 !important;",
            "    font-weight: 800 !important;",
            "    color: rgba(255,255,255,.94) !important;",
            "    text-shadow: 0 .12em .42em rgba(0,0,0,.48) !important;",
            "}",
            "",
            ".bookmarks-folder__num {",
            "    display: inline-flex !important;",
            "    align-items: center !important;",
            "    flex-shrink: 0 !important;",
            "    margin-top: .03em !important;",
            "    padding: .22em .54em !important;",
            "    border-radius: 999em !important;",
            "    background: rgba(82,255,179,.13) !important;",
            "    border: .06em solid rgba(82,255,179,.30) !important;",
            "    color: rgba(120,255,145,.96) !important;",
            "    font-size: .82em !important;",
            "    line-height: 1 !important;",
            "    font-weight: 900 !important;",
            "}",
            "",
            ".bookmarks-folder__body {",
            "    position: relative !important;",
            "    z-index: 1 !important;",
            "    margin: 0 .72em .72em !important;",
            "    border-radius: .66em !important;",
            "    background: linear-gradient(145deg, rgba(255,255,255,.10), rgba(255,255,255,.025)) !important;",
            "    box-shadow: inset 0 0 0 .06em rgba(255,255,255,.055) !important;",
            "}",
            "",
            ".bookmarks-folder__body::before,",
            ".bookmarks-folder__body::after {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 13% !important;",
            "    right: 13% !important;",
            "    height: .22em !important;",
            "    border-radius: 999em !important;",
            "    background: rgba(255,255,255,.16) !important;",
            "}",
            "",
            ".bookmarks-folder__body::before {",
            "    top: 38% !important;",
            "}",
            "",
            ".bookmarks-folder__body::after {",
            "    top: 56% !important;",
            "    opacity: .58 !important;",
            "}",
            "",
            ".bookmarks-folder.focus .bookmarks-folder__inner::after,",
            ".bookmarks-folder.hover .bookmarks-folder__inner::after,",
            ".bookmarks-folder.traverse .bookmarks-folder__inner::after {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    bottom: 0 !important;",
            "    border: .06em solid rgba(93,244,190,.38) !important;",
            "    border-radius: .82em !important;",
            "    z-index: 3 !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".bookmarks-folder.focus .bookmarks-folder__inner,",
            ".bookmarks-folder.hover .bookmarks-folder__inner,",
            ".bookmarks-folder.traverse .bookmarks-folder__inner {",
            "    box-shadow: 0 .88em 1.75em rgba(0,0,0,.34), 0 0 0 .06em rgba(124,148,255,.20), 0 0 1.12em rgba(76,103,255,.16) !important;",
            "}",
            "",
            ".items-line--type-look,",
            ".items-line--type-scheduled,",
            ".items-line--type-book,",
            ".items-line--type-like,",
            ".items-line--type-wath,",
            ".items-line--type-viewed,",
            ".items-line--type-continued,",
            ".items-line--type-thrown {",
            "    padding-bottom: 1.35em !important;",
            "}",
            "",
            ".items-line--type-look .items-line__head,",
            ".items-line--type-scheduled .items-line__head,",
            ".items-line--type-book .items-line__head,",
            ".items-line--type-like .items-line__head,",
            ".items-line--type-wath .items-line__head,",
            ".items-line--type-viewed .items-line__head,",
            ".items-line--type-continued .items-line__head,",
            ".items-line--type-thrown .items-line__head {",
            "    margin-bottom: .82em !important;",
            "}",
            "",
            ".register.register--line {",
            "    position: relative !important;",
            "    min-width: 8.8em !important;",
            "    min-height: 5.4em !important;",
            "    box-sizing: border-box !important;",
            "    padding: .82em .92em !important;",
            "    border-radius: .82em !important;",
            "    border: .06em solid rgba(255,255,255,.07) !important;",
            "    background: linear-gradient(145deg, rgba(14,18,24,.78), rgba(6,8,13,.68)) !important;",
            "    box-shadow: 0 .42em 1em rgba(0,0,0,.20), inset 0 0 0 .06em rgba(255,255,255,.035) !important;",
            "    color: rgba(255,255,255,.88) !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".register.register--line::before {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    bottom: 0 !important;",
            "    background: radial-gradient(circle at 22% 15%, rgba(82,255,179,.13), rgba(105,183,226,.07) 36%, rgba(0,0,0,0) 72%) !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".register.register--line::after {",
            "    display: none !important;",
            "    content: none !important;",
            "}",
            "",
            ".register.register--line .register__name,",
            ".register.register--line .register__counter {",
            "    position: relative !important;",
            "    z-index: 1 !important;",
            "}",
            "",
            ".register.register--line .register__name {",
            "    max-width: 7.4em !important;",
            "    font-size: .98em !important;",
            "    line-height: 1.16 !important;",
            "    font-weight: 650 !important;",
            "    color: rgba(255,255,255,.84) !important;",
            "}",
            "",
            ".register.register--line .register__counter {",
            "    margin-top: .18em !important;",
            "    font-size: 2.05em !important;",
            "    line-height: 1 !important;",
            "    font-weight: 800 !important;",
            "    text-align: center !important;",
            "    color: rgba(255,255,255,.96) !important;",
            "}",
            "",
            ".register.register--line .register__limit {",
            "    color: rgba(255,255,255,.58) !important;",
            "}",
            "",
            ".register.register--line.focus,",
            ".register.register--line.hover,",
            ".register.register--line.traverse {",
            "    border-color: rgba(91,239,179,.58) !important;",
            "    background: linear-gradient(145deg, rgba(16,25,39,.92), rgba(8,11,17,.78)) !important;",
            "    box-shadow: 0 .68em 1.45em rgba(0,0,0,.30), 0 0 0 .075em rgba(91,239,179,.32), inset 0 0 0 .06em rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".register.register--line.focus .register__name,",
            ".register.register--line.hover .register__name,",
            ".register.register--line.traverse .register__name {",
            "    color: rgba(255,255,255,.92) !important;",
            "}",
            "",
            ".register.register--line.focus .register__counter,",
            ".register.register--line.hover .register__counter,",
            ".register.register--line.traverse .register__counter {",
            "    color: rgba(120,255,145,.98) !important;",
            "}",
            "",
            ".empty {",
            "    color: rgba(246,248,255,.88) !important;",
            "}",
            "",
            ".empty__title {",
            "    font-weight: 800 !important;",
            "    letter-spacing: 0 !important;",
            "    text-shadow: none !important;",
            "}",
            "",
            ".empty__descr {",
            "    color: rgba(255,255,255,.62) !important;",
            "    line-height: 1.42 !important;",
            "}",
            "",
            ".empty__img,",
            ".empty__icon {",
            "    opacity: .88 !important;",
            "    filter: drop-shadow(0 .28em .7em rgba(0,0,0,.28)) !important;",
            "}",
            "",
            ".card-episode {",
            "    width: 24.6em !important;",
            "    margin-right: 1.25em !important;",
            "    overflow: visible !important;",
            "}",
            "",
            ".card-episode .card-episode__body {",
            "    margin-bottom: .78em !important;",
            "}",
            "",
            ".card-episode .full-episode {",
            "    position: relative !important;",
            "    border-radius: .82em !important;",
            "    overflow: hidden !important;",
            "    background: #050608 !important;",
            "    transform: translateZ(0) !important;",
            "    box-shadow: 0 .7em 1.55em rgba(0,0,0,.26), inset 0 0 0 .06em rgba(124,148,255,.10);",
            "}",
            "",
            ".card-episode .full-episode__img {",
            "    margin: 0 !important;",
            "    padding-bottom: 57% !important;",
            "    border-radius: .82em !important;",
            "    overflow: hidden !important;",
            "    background-color: #050608 !important;",
            "}",
            "",
            ".card-episode .full-episode__img img {",
            "    border-radius: .82em !important;",
            "    object-fit: cover !important;",
            "    transform: translateZ(0);",
            "    transition: transform .26s cubic-bezier(.2,0,.2,1), filter .24s ease;",
            "}",
            "",
            ".card-episode .full-episode::before {",
            "    content: '';",
            "    position: absolute;",
            "    left: 0;",
            "    top: 0;",
            "    right: 0;",
            "    bottom: 0;",
            "    z-index: 2;",
            "    pointer-events: none;",
            "    background: linear-gradient(to top, rgba(5,7,11,.88) 0%, rgba(5,7,11,.58) 28%, rgba(5,7,11,.16) 60%, rgba(5,7,11,.22) 100%);",
            "}",
            "",
            ".card-episode .full-episode__body {",
            "    display: -webkit-box !important;",
            "    -webkit-box-orient: vertical !important;",
            "    -webkit-box-pack: end !important;",
            "    display: flex !important;",
            "    flex-direction: column !important;",
            "    justify-content: flex-end !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    top: 0 !important;",
            "    right: 0 !important;",
            "    bottom: 0 !important;",
            "    z-index: 3 !important;",
            "    padding: 1.05em 1.15em !important;",
            "    color: #fff !important;",
            "    background: transparent !important;",
            "}",
            "",
            ".card-episode .full-episode__num {",
            "    order: 1;",
            "    margin: 0 0 .62em 0 !important;",
            "    font-size: 2.1em !important;",
            "    line-height: 1 !important;",
            "    font-weight: 500 !important;",
            "    text-shadow: 0 .08em .2em rgba(0,0,0,.62);",
            "}",
            "",
            ".card-episode .full-episode__name {",
            "    order: 2;",
            "    margin: 0 !important;",
            "    font-size: 1.18em !important;",
            "    line-height: 1.14 !important;",
            "    font-weight: 600 !important;",
            "    white-space: nowrap !important;",
            "    overflow: hidden !important;",
            "    text-overflow: ellipsis !important;",
            "    text-shadow: 0 .08em .2em rgba(0,0,0,.66);",
            "}",
            "",
            ".card-episode .full-episode__date {",
            "    order: 3;",
            "    margin-top: .28em !important;",
            "    font-size: .96em !important;",
            "    line-height: 1.1 !important;",
            "    font-weight: 500 !important;",
            "    color: rgba(255,255,255,.94) !important;",
            "    text-shadow: 0 .08em .2em rgba(0,0,0,.66);",
            "}",
            "",
            ".card-episode .card-episode__footer {",
            "    display: -webkit-box !important;",
            "    display: flex !important;",
            "    align-items: flex-start !important;",
            "    min-height: 4.3em;",
            "}",
            "",
            ".card-episode .card-episode__footer .card__imgbox {",
            "    width: 4.45em !important;",
            "    flex-shrink: 0 !important;",
            "}",
            "",
            ".card-episode .card-episode__footer .card__view {",
            "    margin: 0 !important;",
            "    padding-bottom: 150% !important;",
            "    border-radius: .56em !important;",
            "    overflow: hidden !important;",
            "    background-color: #050608 !important;",
            "    box-shadow: 0 .38em .85em rgba(0,0,0,.22);",
            "}",
            "",
            ".card-episode .card-episode__footer .card__img {",
            "    border-radius: .56em !important;",
            "}",
            "",
            ".card-episode .card-episode__footer .card__left {",
            "    padding: .5em 0 0 .86em !important;",
            "}",
            "",
            ".card-episode .card-episode__footer .card__title {",
            "    color: rgba(255,255,255,.94) !important;",
            "    font-size: 1.14em !important;",
            "    line-height: 1.18 !important;",
            "    font-weight: 500 !important;",
            "    white-space: nowrap !important;",
            "    overflow: hidden !important;",
            "    text-overflow: ellipsis !important;",
            "}",
            "",
            ".card-episode.focus .full-episode::after,",
            ".card-episode.hover .full-episode::after {",
            "    display: none !important;",
            "    content: none !important;",
            "}",
            "",
            ".card-episode.focus .full-episode,",
            ".card-episode.hover .full-episode {",
            "    box-shadow: 0 .95em 1.9em rgba(0,0,0,.34), 0 0 0 .06em rgba(255,255,255,.20), 0 0 1.05em rgba(76,103,255,.16);",
            "}",
            "",
            ".card-episode.focus .full-episode__img img,",
            ".card-episode.hover .full-episode__img img {",
            "    transform: scale(1.045) translateZ(0);",
            "    filter: saturate(1.1) contrast(1.04);",
            "}",
            "",
            ".card-episode {",
            "    position: relative !important;",
            "}",
            "",
            ".card-episode .card-episode__body {",
            "    margin-bottom: 0 !important;",
            "}",
            "",
            ".card-episode .card-episode__footer {",
            "    position: absolute !important;",
            "    left: 1.15em !important;",
            "    top: .9em !important;",
            "    right: 1.15em !important;",
            "    z-index: 5 !important;",
            "    display: block !important;",
            "    min-height: 0 !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".card-episode .card-episode__footer .card__imgbox,",
            ".card-episode .card-episode__footer .card__view {",
            "    display: none !important;",
            "}",
            "",
            ".card-episode .card-episode__footer .card__left {",
            "    padding: 0 !important;",
            "    width: 100% !important;",
            "}",
            "",
            ".card-episode .card-episode__footer .card__title {",
            "    display: block !important;",
            "    max-width: 78% !important;",
            "    color: rgba(255,255,255,.96) !important;",
            "    font-size: 1.08em !important;",
            "    line-height: 1.12 !important;",
            "    font-weight: 600 !important;",
            "    white-space: nowrap !important;",
            "    overflow: hidden !important;",
            "    text-overflow: ellipsis !important;",
            "    text-shadow: 0 .08em .22em rgba(0,0,0,.72);",
            "}"
        ].join("\n");

        upsertStyle(STYLE_ID, css);
    }

    function injectMenuStyle() {
        var css = [
            ".wrap__left {",
            "    width: 18.8em !important;",
            "    margin-left: -18.8em !important;",
            "    background: linear-gradient(180deg, rgba(24,25,27,.98), rgba(15,16,18,.98)) !important;",
            "    box-shadow: 0 1em 2.7em rgba(0,0,0,.36), inset 0 0 0 .07em rgba(255,255,255,.10) !important;",
            "    border-radius: 1.22em !important;",
            "    padding: 0 0 1.05em 0 !important;",
            "    box-sizing: border-box !important;",
            "    overflow: hidden !important;",
            "    z-index: 120 !important;",
            "    height: calc(100vh - 2.7em) !important;",
            "    max-height: calc(100vh - 2.7em) !important;",
            "    top: 1.35em !important;",
            "}",
            "",
            "body.menu--open .head {",
            "    z-index: 40 !important;",
            "}",
            "",
            "body.menu--open .head__body {",
            "    opacity: 0 !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".wrap__left > .scroll,",
            ".wrap__left .scroll__body,",
            ".wrap__left .scroll__content {",
            "    width: 18.8em !important;",
            "    mask-image: none !important;",
            "    -webkit-mask-image: none !important;",
            "}",
            "",
            ".wrap__left > .scroll {",
            "    height: calc(100% - 4.95em) !important;",
            "    max-height: calc(100% - 4.95em) !important;",
            "    margin-top: 4.95em !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".wrap__left .scroll__content {",
            "    height: auto !important;",
            "    min-height: 100% !important;",
            "    padding: 0 !important;",
            "    box-sizing: border-box !important;",
            "}",
            "",
            "body.menu--open:not(.light--version):not(.settings--open):not(.selectbox--open) .wrap__left {",
            "    transform: translate3d(19.35em, 0, 0) !important;",
            "    z-index: 260 !important;",
            "}",
            "",
            "body.menu--open:not(.light--version) .wrap__content {",
            "    transform: translate3d(0, 0, 0) !important;",
            "}",
            "",
            ".wrap__left .menu {",
            "    width: 18.8em !important;",
            "    padding: 0 .95em .2em !important;",
            "    box-sizing: border-box !important;",
            "    overflow: visible !important;",
            "    border-radius: 0 !important;",
            "    color: rgba(246,248,255,.88) !important;",
            "    background: transparent !important;",
            "    box-shadow: none !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".wrap__left .temav-menu-head {",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    z-index: 4 !important;",
            "    display: flex !important;",
            "    align-items: center !important;",
            "    justify-content: space-between !important;",
            "    min-height: 4.95em !important;",
            "    padding: .92em 1.05em .86em !important;",
            "    box-sizing: border-box !important;",
            "    border-bottom: .07em solid rgba(255,255,255,.08) !important;",
            "    background: radial-gradient(circle at 18% 0%, rgba(82,255,179,.10), rgba(255,255,255,0) 48%), linear-gradient(90deg, rgba(255,255,255,.035), rgba(255,255,255,.015)) !important;",
            "}",
            "",
            ".wrap__left .temav-menu-user {",
            "    display: none !important;",
            "}",
            "",
            ".wrap__left .temav-menu-avatar {",
            "    display: none !important;",
            "}",
            "",
            ".wrap__left .temav-menu-login {",
            "    display: none !important;",
            "}",
            "",
            ".wrap__left .temav-menu-avatar {",
            "    width: 2.28em !important;",
            "    height: 2.28em !important;",
            "    margin-right: .72em !important;",
            "    border-radius: 50% !important;",
            "    display: none !important;",
            "    align-items: center !important;",
            "    justify-content: center !important;",
            "    color: rgba(255,255,255,.86) !important;",
            "    background: rgba(255,255,255,.10) !important;",
            "    box-shadow: inset 0 0 0 .06em rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".wrap__left .temav-menu-avatar svg {",
            "    width: 1.18em !important;",
            "    height: 1.18em !important;",
            "}",
            "",
            ".wrap__left .temav-menu-clock {",
            "    position: relative !important;",
            "    flex: 1 1 auto !important;",
            "    width: 100% !important;",
            "    min-width: 0 !important;",
            "    display: flex !important;",
            "    align-items: center !important;",
            "    justify-content: space-between !important;",
            "    text-align: left !important;",
            "    padding: 0 !important;",
            "}",
            "",
            ".wrap__left .temav-menu-clock::before {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 50% !important;",
            "    top: .18em !important;",
            "    bottom: .18em !important;",
            "    width: .08em !important;",
            "    border-radius: 2em !important;",
            "    background: linear-gradient(180deg, rgba(82,255,179,.18), rgba(105,183,226,.78), rgba(255,138,31,.18)) !important;",
            "    box-shadow: 0 0 .55em rgba(105,183,226,.22) !important;",
            "}",
            "",
            ".wrap__left .temav-menu-time {",
            "    flex: 0 0 48% !important;",
            "    display: flex !important;",
            "    align-items: center !important;",
            "    justify-content: center !important;",
            "    font-size: 1.86em !important;",
            "    line-height: 1 !important;",
            "    font-weight: 850 !important;",
            "    text-align: center !important;",
            "    color: rgba(255,255,255,.98) !important;",
            "    letter-spacing: 0 !important;",
            "    text-shadow: 0 .08em .22em rgba(0,0,0,.58), 0 0 .55em rgba(82,255,179,.10) !important;",
            "}",
            "",
            ".wrap__left .temav-menu-date {",
            "    flex: 0 0 44% !important;",
            "    margin-top: 0 !important;",
            "    padding-left: 0 !important;",
            "    font-size: .88em !important;",
            "    line-height: 1.2 !important;",
            "    font-weight: 650 !important;",
            "    text-align: right !important;",
            "    color: rgba(235,241,250,.72) !important;",
            "    text-shadow: 0 .08em .22em rgba(0,0,0,.48) !important;",
            "}",
            "",
            ".wrap__left .menu__list {",
            "    padding: .72em 0 0 !important;",
            "}",
            "",
            ".wrap__left .menu__split {",
            "    width: auto !important;",
            "    margin: .72em .95em .42em !important;",
            "    border-top: .08em solid rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".wrap__left .menu__item {",
            "    margin: .08em 0 !important;",
            "    padding: .67em .78em !important;",
            "    border-radius: .54em !important;",
            "    color: rgba(245,248,255,.76) !important;",
            "    background: transparent !important;",
            "    box-shadow: none !important;",
            "    transform: translateZ(0) !important;",
            "    transition: background-color .16s ease, color .16s ease, box-shadow .16s ease, transform .16s ease !important;",
            "}",
            "",
            ".wrap__left .menu__item + li {",
            "    margin-top: .16em !important;",
            "}",
            "",
            ".wrap__left .menu__ico {",
            "    width: 1.24em !important;",
            "    height: 1.24em !important;",
            "    margin-right: .94em !important;",
            "    opacity: .92 !important;",
            "}",
            "",
            ".wrap__left .menu__ico svg,",
            ".wrap__left .menu__ico img {",
            "    width: 1.24em !important;",
            "    height: 1.24em !important;",
            "}",
            "",
            ".wrap__left .menu__ico [stroke] {",
            "    stroke: currentColor !important;",
            "}",
            "",
            ".wrap__left .menu__ico path[fill],",
            ".wrap__left .menu__ico rect[fill],",
            ".wrap__left .menu__ico circle[fill] {",
            "    fill: currentColor !important;",
            "}",
            "",
            ".wrap__left .menu__text {",
            "    font-size: 1.02em !important;",
            "    line-height: 1.06 !important;",
            "    font-weight: 600 !important;",
            "    margin-top: 0 !important;",
            "    white-space: nowrap !important;",
            "    overflow: hidden !important;",
            "    text-overflow: ellipsis !important;",
            "}",
            "",
            ".wrap__left .menu__item.focus,",
            ".wrap__left .menu__item.hover,",
            ".wrap__left .menu__item.traverse {",
            "    color: rgba(6,30,29,.96) !important;",
            "    background: linear-gradient(100deg, rgba(82,255,179,.98), rgba(105,183,226,.96)) !important;",
            "    box-shadow: 0 .62em 1.35em rgba(65,218,188,.20), inset 0 0 0 .06em rgba(255,255,255,.22) !important;",
            "    transform: translateX(.16em) translateZ(0) !important;",
            "}",
            "",
            ".wrap__left .menu__item.focus .menu__ico,",
            ".wrap__left .menu__item.hover .menu__ico,",
            ".wrap__left .menu__item.traverse .menu__ico {",
            "    opacity: 1 !important;",
            "}",
            "",
            ".wrap__left .menu__item.focus .menu__ico > img,",
            ".wrap__left .menu__item.hover .menu__ico > img,",
            ".wrap__left .menu__item.traverse .menu__ico > img {",
            "    filter: none !important;",
            "}",
            "",
            ".wrap__left .menu__item.traverse::before,",
            ".wrap__left .menu__item.traverse::after {",
            "    color: rgba(255,255,255,.72) !important;",
            "    left: 50% !important;",
            "}",
            "",
            "body.touch-device .wrap__left > .scroll {",
            "    overflow-x: hidden !important;",
            "    overflow-y: auto !important;",
            "    -webkit-overflow-scrolling: touch !important;",
            "}",
            "",
            "body.touch-device .wrap__left .scroll__body {",
            "    overflow: visible !important;",
            "}",
            "",
            "body.true--mobile.menu--open .navigation-bar {",
            "    opacity: 0 !important;",
            "    visibility: hidden !important;",
            "    pointer-events: none !important;",
            "    -webkit-transform: translate3d(0, 110%, 0) !important;",
            "    transform: translate3d(0, 110%, 0) !important;",
            "}",
            "",
            "body.true--mobile .wrap__left {",
            "    width: 18.2em !important;",
            "    margin-left: -18.2em !important;",
            "    top: 1em !important;",
            "    height: calc(100vh - 2em) !important;",
            "    max-height: calc(100vh - 2em) !important;",
            "    padding-top: 0 !important;",
            "    padding-bottom: .72em !important;",
            "    border-radius: 1.05em !important;",
            "}",
            "",
            "body.true--mobile.menu--open:not(.light--version) .wrap__left {",
            "    transform: translate3d(18.75em, 0, 0) !important;",
            "}",
            "",
            "body.true--mobile .wrap__left > .scroll,",
            "body.true--mobile .wrap__left .scroll__body,",
            "body.true--mobile .wrap__left .scroll__content,",
            "body.true--mobile .wrap__left .menu {",
            "    width: 18.2em !important;",
            "}",
            "",
            "body.true--mobile .wrap__left > .scroll {",
            "    height: calc(100% - 4.75em) !important;",
            "    max-height: calc(100% - 4.75em) !important;",
            "    margin-top: 4.75em !important;",
            "}",
            "",
            "body.true--mobile .wrap__left .scroll__content {",
            "    height: auto !important;",
            "    min-height: 100% !important;",
            "    box-sizing: border-box !important;",
            "}",
            "",
            "body.true--mobile .wrap__left .temav-menu-head {",
            "    min-height: 4.75em !important;",
            "    padding: .78em .92em .74em !important;",
            "}",
            "",
            "body.true--mobile .wrap__left .menu {",
            "    padding-left: .78em !important;",
            "    padding-right: .78em !important;",
            "}",
            "",
            "body.true--mobile .wrap__left .menu__item {",
            "    padding-top: .56em !important;",
            "    padding-bottom: .56em !important;",
            "}",
            "",
            "body.true--mobile.orientation--landscape .wrap__left {",
            "    height: calc(100vh - 2em) !important;",
            "    max-height: calc(100vh - 2em) !important;",
            "}",
            "",
            "@media screen and (max-width: 48em) {",
            "    .wrap__left {",
            "        width: 18.2em !important;",
            "        margin-left: -18.2em !important;",
            "        top: 1em !important;",
            "        height: calc(100vh - 2em) !important;",
            "        max-height: calc(100vh - 2em) !important;",
            "        padding-top: 0 !important;",
            "        padding-bottom: .72em !important;",
            "        border-radius: 1.05em !important;",
            "    }",
            "    body.menu--open:not(.light--version):not(.settings--open):not(.selectbox--open) .wrap__left {",
            "        transform: translate3d(18.75em, 0, 0) !important;",
            "    }",
            "    .wrap__left > .scroll,",
            "    .wrap__left .scroll__body,",
            "    .wrap__left .scroll__content,",
            "    .wrap__left .menu {",
            "        width: 18.2em !important;",
            "    }",
            "    .wrap__left > .scroll {",
            "        height: calc(100% - 4.75em) !important;",
            "        max-height: calc(100% - 4.75em) !important;",
            "        margin-top: 4.75em !important;",
            "    }",
            "    .wrap__left .scroll__content {",
            "        height: auto !important;",
            "        min-height: 100% !important;",
            "        box-sizing: border-box !important;",
            "    }",
            "    .wrap__left .temav-menu-head {",
            "        min-height: 4.75em !important;",
            "        padding: .78em .92em .74em !important;",
            "    }",
            "    .wrap__left .menu {",
            "        padding-left: .78em !important;",
            "        padding-right: .78em !important;",
            "    }",
            "    .wrap__left .menu__item {",
            "        padding-top: .56em !important;",
            "        padding-bottom: .56em !important;",
            "    }",
            "}"
        ].join("\n");

        upsertStyle(MENU_STYLE_ID, css);
    }

    function removeStyle() {
        var old = document.getElementById(STYLE_ID);
        if (old && old.parentNode) old.parentNode.removeChild(old);
        old = document.getElementById('lampa-cards-final-css-dots-style');
        if (old && old.parentNode) old.parentNode.removeChild(old);
    }

    function removeMenuStyle() {
        var old = document.getElementById(MENU_STYLE_ID);
        if (old && old.parentNode) old.parentNode.removeChild(old);
    }

    function injectSettingsStyle() {
        var css = [
            ".settings {",
            "    z-index: 130 !important;",
            "}",
            "",
            ".selectbox {",
            "    z-index: 160 !important;",
            "}",
            "",
            ".modal {",
            "    z-index: 190 !important;",
            "}",
            "",
            "body.settings--open .head,",
            "body.selectbox--open .head {",
            "    z-index: 40 !important;",
            "}",
            "",
            "body.settings--open .head__body,",
            "body.selectbox--open .head__body {",
            "    opacity: 0 !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            "body.temav-panel-boot .settings,",
            "body.temav-panel-boot .selectbox {",
            "    opacity: 0 !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            "body.temav-panel-boot .settings__content,",
            "body.temav-panel-boot .selectbox__content {",
            "    transition: none !important;",
            "}",
            "",
            ".settings__layer {",
            "    background: rgba(0,0,0,.42) !important;",
            "}",
            "",
            ".selectbox__layer {",
            "    background: rgba(0,0,0,.46) !important;",
            "}",
            "",
            ".settings__content,",
            ".selectbox__content {",
            "    left: auto !important;",
            "    right: 1.25em !important;",
            "    top: 1.35em !important;",
            "    width: 29em !important;",
            "    max-width: calc(100vw - 2.5em) !important;",
            "    height: auto !important;",
            "    color: rgba(246,248,255,.9) !important;",
            "    background: #101113 !important;",
            "    border-radius: 1.22em !important;",
            "    overflow: hidden !important;",
            "    max-height: calc(100vh - 2.7em) !important;",
            "    box-shadow: 0 1em 2.7em rgba(0,0,0,.38), inset 0 0 0 .07em rgba(255,255,255,.10) !important;",
            "    transform: translate3d(110%, 0, 0) !important;",
            "    transition: transform .22s ease !important;",
            "}",
            "",
            ".settings__content::before,",
            ".selectbox__content::before {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    bottom: 0 !important;",
            "    z-index: 0 !important;",
            "    background: linear-gradient(180deg, rgba(28,29,32,.98), rgba(13,14,16,1)) !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".settings__content > *,",
            ".selectbox__content > * {",
            "    position: relative !important;",
            "    z-index: 1 !important;",
            "}",
            "",
            "body.settings--open .settings__content {",
            "    transform: translate3d(0, 0, 0) !important;",
            "}",
            "",
            ".pincode {",
            "    position: fixed !important;",
            "    z-index: 220 !important;",
            "}",
            "",
            "body.selectbox--open .selectbox__content {",
            "    transform: translate3d(0, 0, 0) !important;",
            "}",
            "",
            ".settings__head,",
            ".selectbox__head {",
            "    position: relative !important;",
            "    padding: 1.35em 1.45em .95em !important;",
            "    border-bottom: .07em solid rgba(255,255,255,.08) !important;",
            "    background: radial-gradient(circle at 25% 0%, rgba(255,255,255,.07), rgba(255,255,255,0) 56%) !important;",
            "}",
            "",
            ".settings__title,",
            ".selectbox__title {",
            "    font-size: 1.58em !important;",
            "    line-height: 1.12 !important;",
            "    font-weight: 700 !important;",
            "    color: rgba(255,255,255,.96) !important;",
            "}",
            "",
            ".settings__body,",
            ".selectbox__body {",
            "    min-height: 0 !important;",
            "    height: auto !important;",
            "    max-height: calc(100vh - 7.1em) !important;",
            "    overflow: hidden !important;",
            "    background: transparent !important;",
            "}",
            "",
            ".settings__body > .scroll,",
            ".selectbox__body > .scroll {",
            "    height: auto !important;",
            "    max-height: calc(100vh - 7.1em) !important;",
            "    background: transparent !important;",
            "}",
            "",
            ".settings__body .scroll__body,",
            ".selectbox__body .scroll__body {",
            "    height: auto !important;",
            "    max-height: calc(100vh - 7.1em) !important;",
            "    overflow-y: auto !important;",
            "    overflow-x: hidden !important;",
            "    -webkit-overflow-scrolling: touch !important;",
            "    background: transparent !important;",
            "}",
            "",
            ".settings__body .scroll__content,",
            ".selectbox__body .scroll__content {",
            "    padding: .9em .72em 1.08em !important;",
            "    background: transparent !important;",
            "}",
            "",
            ".selectbox__content {",
            "    height: calc(100vh - 2.7em) !important;",
            "    display: -webkit-box !important;",
            "    display: flex !important;",
            "    -webkit-box-orient: vertical !important;",
            "    flex-direction: column !important;",
            "}",
            "",
            ".selectbox__body {",
            "    -webkit-box-flex: 1 !important;",
            "    flex: 1 1 auto !important;",
            "    height: auto !important;",
            "    max-height: none !important;",
            "    display: -webkit-box !important;",
            "    display: flex !important;",
            "}",
            "",
            ".selectbox__body > .scroll {",
            "    height: 100% !important;",
            "    max-height: none !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".selectbox__body .scroll__content {",
            "    height: 100% !important;",
            "    max-height: none !important;",
            "}",
            "",
            ".settings__body > .scroll,",
            ".selectbox__body > .scroll {",
            "    overflow: hidden !important;",
            "}",
            "",
            ".settings__body .scroll__body,",
            ".selectbox__body .scroll__body {",
            "    height: auto !important;",
            "    max-height: none !important;",
            "    overflow: visible !important;",
            "}",
            "",
            "body.touch-device .settings__body > .scroll,",
            "body.touch-device .selectbox__body > .scroll {",
            "    overflow-x: hidden !important;",
            "    overflow-y: auto !important;",
            "}",
            "",
            "body.touch-device .settings__body .scroll__content,",
            "body.touch-device .selectbox__body .scroll__content {",
            "    height: auto !important;",
            "    max-height: none !important;",
            "}",
            "",
            "body.touch-device .settings__body .scroll__body,",
            "body.touch-device .selectbox__body .scroll__body {",
            "    height: auto !important;",
            "    max-height: none !important;",
            "    overflow: visible !important;",
            "    -webkit-transform: none !important;",
            "    transform: none !important;",
            "}",
            "",
            ".settings-folder,",
            ".settings-param,",
            ".selectbox-item {",
            "    position: relative !important;",
            "    box-sizing: border-box !important;",
            "    width: 100% !important;",
            "    margin: 0 !important;",
            "    padding: .9em 2.55em .9em .92em !important;",
            "    border-radius: .64em !important;",
            "    color: rgba(245,248,255,.78) !important;",
            "    background: transparent !important;",
            "    box-shadow: none !important;",
            "    transition: background-color .16s ease, color .16s ease, transform .16s ease, box-shadow .16s ease !important;",
            "}",
            "",
            ".settings-folder + .settings-folder,",
            ".settings-folder + .settings-param,",
            ".settings-param + .settings-folder,",
            ".settings-param + .settings-param,",
            ".selectbox-item + .selectbox-item {",
            "    border-top: .06em solid rgba(255,255,255,.055) !important;",
            "}",
            "",
            ".settings-folder::after {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    right: 1.02em !important;",
            "    top: 50% !important;",
            "    width: .48em !important;",
            "    height: .48em !important;",
            "    border-top: .12em solid currentColor !important;",
            "    border-right: .12em solid currentColor !important;",
            "    opacity: .64 !important;",
            "    transform: translateY(-50%) rotate(45deg) !important;",
            "}",
            "",
            ".settings-folder.focus::after {",
            "    opacity: .86 !important;",
            "}",
            "",
            ".settings-folder.focus,",
            ".settings-param.focus,",
            ".selectbox-item.focus {",
            "    color: rgba(6,30,29,.96) !important;",
            "    background: linear-gradient(100deg, rgba(82,255,179,.98), rgba(105,183,226,.96)) !important;",
            "    box-shadow: 0 .12em .38em rgba(65,218,188,.08), inset 0 0 0 .06em rgba(255,255,255,.20) !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".selectbox-item--checkbox {",
            "    min-height: 3.55em !important;",
            "    padding-right: 3.35em !important;",
            "}",
            "",
            ".selectbox-item__checkbox {",
            "    top: 50% !important;",
            "    right: .95em !important;",
            "    margin: 0 !important;",
            "    transform: translateY(-50%) !important;",
            "    border-radius: .35em !important;",
            "    border-color: rgba(255,255,255,.36) !important;",
            "    background: rgba(255,255,255,.06) !important;",
            "}",
            "",
            ".selectbox-item.focus .selectbox-item__checkbox,",
            ".selectbox-item.hover .selectbox-item__checkbox {",
            "    top: 50% !important;",
            "    transform: translateY(-50%) !important;",
            "}",
            "",
            ".selectbox-item--checked .selectbox-item__checkbox {",
            "    border-color: rgba(82,255,179,.96) !important;",
            "    background: rgba(82,255,179,.96) !important;",
            "}",
            "",
            ".settings-folder__icon {",
            "    width: 1.52em !important;",
            "    height: 1.52em !important;",
            "    margin-right: .86em !important;",
            "    opacity: .9 !important;",
            "    flex-shrink: 0 !important;",
            "}",
            "",
            ".settings-folder__icon > *,",
            ".settings-folder__icon svg {",
            "    width: 1.52em !important;",
            "    height: 1.52em !important;",
            "}",
            "",
            ".settings-folder__icon [stroke] {",
            "    stroke: currentColor !important;",
            "}",
            "",
            ".settings-folder__icon path[fill],",
            ".settings-folder__icon rect[fill],",
            ".settings-folder__icon circle[fill] {",
            "    fill: currentColor !important;",
            "}",
            "",
            ".settings-folder__name,",
            ".settings-param__name,",
            ".selectbox-item__title {",
            "    font-size: 1.05em !important;",
            "    line-height: 1.16 !important;",
            "    font-weight: 600 !important;",
            "    margin-bottom: 0 !important;",
            "}",
            "",
            ".settings-param__value {",
            "    margin-top: .42em !important;",
            "    font-size: .94em !important;",
            "    line-height: 1.18 !important;",
            "    color: rgba(255,255,255,.58) !important;",
            "}",
            "",
            ".settings-folder.focus .settings-param__value,",
            ".settings-param.focus .settings-param__value {",
            "    color: rgba(6,30,29,.72) !important;",
            "}",
            "",
            ".settings-param__descr {",
            "    margin-top: .58em !important;",
            "    font-size: .86em !important;",
            "    line-height: 1.25 !important;",
            "    color: rgba(255,255,255,.48) !important;",
            "    opacity: 1 !important;",
            "}",
            "",
            ".settings-param.focus .settings-param__descr {",
            "    color: rgba(6,30,29,.66) !important;",
            "}",
            "",
            ".selectbox-item__subtitle {",
            "    margin-top: .42em !important;",
            "    font-size: .9em !important;",
            "    line-height: 1.22 !important;",
            "    color: rgba(255,255,255,.5) !important;",
            "    opacity: 1 !important;",
            "}",
            "",
            ".selectbox-item.focus .selectbox-item__subtitle {",
            "    color: rgba(6,30,29,.66) !important;",
            "}",
            "",
            ".settings-param-title {",
            "    padding: 1em .92em .45em !important;",
            "    color: rgba(255,143,47,.92) !important;",
            "}",
            "",
            ".settings-param-title > span {",
            "    font-size: .88em !important;",
            "    line-height: 1.1 !important;",
            "    font-weight: 700 !important;",
            "    color: rgba(255,143,47,.92) !important;",
            "    text-transform: uppercase !important;",
            "}",
            "",
            ".settings-param__label {",
            "    border-radius: .4em !important;",
            "    color: rgba(6,30,29,.96) !important;",
            "    background: rgba(82,255,179,.98) !important;",
            "}",
            "",
            ".settings-param-text {",
            "    padding: .9em .92em !important;",
            "    line-height: 1.35 !important;",
            "    color: rgba(245,248,255,.72) !important;",
            "}",
            "",
            ".settings-input__content {",
            "    background: #101113 !important;",
            "    width: 100% !important;",
            "    max-width: none !important;",
            "    margin: 0 !important;",
            "    border-radius: 0 !important;",
            "    box-shadow: none !important;",
            "}",
            "",
            ".settings-input {",
            "    z-index: 210 !important;",
            "    background: #101113 !important;",
            "}",
            "",
            ".settings-input--free .settings-input__content {",
            "    margin: 0 !important;",
            "}",
            "",
            ".settings-input__links {",
            "    background: rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".modal {",
            "    background: rgba(0,0,0,.54) !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__content {",
            "    color: rgba(246,248,255,.9) !important;",
            "    background: #101113 !important;",
            "    border-radius: 1.22em !important;",
            "    padding: 0 !important;",
            "    overflow: hidden !important;",
            "    box-shadow: 0 1em 2.7em rgba(0,0,0,.38), inset 0 0 0 .07em rgba(255,255,255,.10) !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__content::before {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    bottom: 0 !important;",
            "    z-index: 0 !important;",
            "    background: linear-gradient(180deg, rgba(28,29,32,.98), rgba(13,14,16,1)) !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__content > * {",
            "    position: relative !important;",
            "    z-index: 1 !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__head {",
            "    margin: 0 !important;",
            "    padding: 1.35em 1.45em .95em !important;",
            "    border-bottom: .07em solid rgba(255,255,255,.08) !important;",
            "    background: radial-gradient(circle at 25% 0%, rgba(255,255,255,.07), rgba(255,255,255,0) 56%) !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__title {",
            "    font-size: 1.58em !important;",
            "    line-height: 1.12 !important;",
            "    font-weight: 700 !important;",
            "    color: rgba(255,255,255,.96) !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__body {",
            "    padding: 1em 1.05em 0 !important;",
            "    color: rgba(245,248,255,.74) !important;",
            "    line-height: 1.42 !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__body .scroll__content {",
            "    max-height: calc(100vh - 13em) !important;",
            "    padding: .35em 0 !important;",
            "}",
            "",
            ".modal:not(.modal--full) .about,",
            ".modal:not(.modal--full) .modal-pending,",
            ".modal:not(.modal--full) .modal-loading,",
            ".modal:not(.modal--full) .account-modal {",
            "    color: rgba(245,248,255,.78) !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal-pending__text,",
            ".modal:not(.modal--full) .account-modal__desc {",
            "    color: rgba(245,248,255,.74) !important;",
            "    line-height: 1.42 !important;",
            "}",
            "",
            ".modal:not(.modal--full) input:not([type]),",
            ".modal:not(.modal--full) input[type='text'],",
            ".modal:not(.modal--full) input[type='password'],",
            ".modal:not(.modal--full) input[type='search'],",
            ".modal:not(.modal--full) input[type='url'],",
            ".modal:not(.modal--full) textarea {",
            "    box-sizing: border-box !important;",
            "    width: 100% !important;",
            "    border: .06em solid rgba(255,255,255,.10) !important;",
            "    border-radius: .72em !important;",
            "    background: rgba(255,255,255,.055) !important;",
            "    color: rgba(255,255,255,.92) !important;",
            "    box-shadow: inset 0 .08em .22em rgba(0,0,0,.22) !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__footer {",
            "    display: -webkit-box !important;",
            "    display: flex !important;",
            "    gap: 0 !important;",
            "    padding: 1em 1.05em 1.05em !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__button,",
            ".modal:not(.modal--full) .simple-button {",
            "    box-sizing: border-box !important;",
            "    border-radius: .64em !important;",
            "    background: rgba(255,255,255,.06) !important;",
            "    color: rgba(245,248,255,.82) !important;",
            "    box-shadow: inset 0 0 0 .055em rgba(255,255,255,.075) !important;",
            "    transition: background-color .16s ease, color .16s ease, transform .16s ease, box-shadow .16s ease !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__button + .modal__button,",
            ".modal:not(.modal--full) .simple-button + .simple-button {",
            "    margin-left: .7em !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__button.focus,",
            ".modal:not(.modal--full) .modal__button.hover,",
            ".modal:not(.modal--full) .simple-button.focus,",
            ".modal:not(.modal--full) .simple-button.hover {",
            "    color: rgba(6,30,29,.96) !important;",
            "    background: linear-gradient(100deg, rgba(82,255,179,.98), rgba(105,183,226,.96)) !important;",
            "    box-shadow: 0 .12em .38em rgba(65,218,188,.08), inset 0 0 0 .06em rgba(255,255,255,.20) !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".modal:not(.modal--full) .modal__button.disabled,",
            ".modal:not(.modal--full) .simple-button.disabled {",
            "    opacity: .45 !important;",
            "}",
            "",
            ".modal__close-button {",
            "    background: rgba(255,255,255,.08) !important;",
            "    color: rgba(255,255,255,.86) !important;",
            "    box-shadow: inset 0 0 0 .055em rgba(255,255,255,.10), 0 .25em .65em rgba(0,0,0,.24) !important;",
            "}",
            "",
            ".notice {",
            "    border-radius: .82em !important;",
            "    background: rgba(255,255,255,.045) !important;",
            "    box-shadow: inset 0 0 0 .055em rgba(255,255,255,.075) !important;",
            "}",
            "",
            ".notice.focus {",
            "    background: rgba(255,255,255,.075) !important;",
            "}",
            "",
            ".notice__title,",
            ".notice__author-name {",
            "    color: rgba(255,255,255,.94) !important;",
            "    font-weight: 700 !important;",
            "}",
            "",
            ".notice__descr,",
            ".notice__author-text {",
            "    color: rgba(245,248,255,.66) !important;",
            "}",
            "",
            ".noty {",
            "    background: rgba(16,17,19,.94) !important;",
            "    border-radius: .92em .92em 0 0 !important;",
            "    box-shadow: 0 .7em 1.8em rgba(0,0,0,.34), inset 0 0 0 .06em rgba(255,255,255,.09) !important;",
            "}",
            "",
            ".noty__body {",
            "    padding: 1.2em 1.45em !important;",
            "}",
            "",
            ".noty__text {",
            "    color: rgba(255,255,255,.9) !important;",
            "    font-weight: 600 !important;",
            "    line-height: 1.32 !important;",
            "}",
            "",
            ".extensions {",
            "    z-index: 150 !important;",
            "    color: rgba(246,248,255,.9) !important;",
            "    background: radial-gradient(circle at 80% 0%, rgba(92,210,220,.18), rgba(92,210,220,0) 34%), radial-gradient(circle at 8% 100%, rgba(82,255,179,.12), rgba(82,255,179,0) 32%), linear-gradient(180deg, #15181d, #0d0e10) !important;",
            "}",
            "",
            ".extensions__body > .scroll > .scroll__content {",
            "    padding: 1.05em 1.3em 1.6em !important;",
            "}",
            "",
            ".extensions .head-backward {",
            "    margin: 0 0 1.15em !important;",
            "    color: rgba(255,255,255,.94) !important;",
            "}",
            "",
            ".extensions__block-head {",
            "    padding: 0 .2em !important;",
            "    margin-bottom: .78em !important;",
            "}",
            "",
            ".extensions__block-title {",
            "    font-size: 1.34em !important;",
            "    line-height: 1.15 !important;",
            "    font-weight: 700 !important;",
            "    color: rgba(255,255,255,.94) !important;",
            "}",
            "",
            ".extensions__block + .extensions__block {",
            "    margin-top: 1.8em !important;",
            "}",
            "",
            ".extensions__block-body {",
            "    min-height: 9.4em !important;",
            "}",
            "",
            ".extensions__block-empty,",
            ".extensions__block-add,",
            ".extensions__item {",
            "    box-sizing: border-box !important;",
            "    width: 19.2em !important;",
            "    min-height: 9.4em !important;",
            "    border-radius: .92em !important;",
            "    background: linear-gradient(145deg, rgba(27,34,42,.92), rgba(12,13,16,.96)) !important;",
            "    box-shadow: inset 0 0 0 .06em rgba(255,255,255,.075), 0 .55em 1.4em rgba(0,0,0,.26) !important;",
            "    color: rgba(246,248,255,.86) !important;",
            "}",
            "",
            ".extensions__block-empty.focus:after,",
            ".extensions__block-add.focus:after,",
            ".extensions__item.focus:after {",
            "    display: none !important;",
            "}",
            "",
            ".extensions__block-empty.focus,",
            ".extensions__block-add.focus,",
            ".extensions__item.focus {",
            "    background: linear-gradient(145deg, rgba(30,49,58,.98), rgba(13,19,25,.98)) !important;",
            "    box-shadow: inset 0 0 0 .12em rgba(82,255,179,.72), 0 .7em 1.8em rgba(82,255,179,.16), 0 .55em 1.6em rgba(0,0,0,.34) !important;",
            "    color: rgba(255,255,255,.96) !important;",
            "}",
            "",
            ".extensions__block-add {",
            "    margin-right: .85em !important;",
            "    font-weight: 700 !important;",
            "    color: rgba(255,255,255,.88) !important;",
            "}",
            "",
            ".extensions__item + .extensions__item {",
            "    margin-left: .85em !important;",
            "}",
            "",
            ".extensions__item-author,",
            ".extensions__item-status {",
            "    color: rgba(245,248,255,.56) !important;",
            "}",
            "",
            ".extensions__item-name {",
            "    font-weight: 700 !important;",
            "    color: rgba(255,255,255,.95) !important;",
            "}",
            "",
            ".extensions__item-descr {",
            "    color: rgba(245,248,255,.66) !important;",
            "}",
            "",
            ".extensions__item-code,",
            ".extensions__item-disabled,",
            ".extensions__item-premium,",
            ".extensions__cub {",
            "    border-radius: .42em !important;",
            "    background: rgba(255,255,255,.08) !important;",
            "    box-shadow: inset 0 0 0 .05em rgba(255,255,255,.07) !important;",
            "}",
            "",
            ".extensions__item-included {",
            "    background: rgba(82,255,179,.95) !important;",
            "    color: rgba(6,30,29,.96) !important;",
            "}",
            "",
            ".extensions__item-check {",
            "    background-color: rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".extensions__item-imagebox,",
            ".extensions__item-image,",
            ".extensions__item-overlay {",
            "    border-radius: .92em .92em 0 0 !important;",
            "}",
            "",
            ".extensions__item-imagebox {",
            "    background-color: rgba(255,255,255,.055) !important;",
            "}",
            "",
            ".extensions__item-overlay {",
            "    background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(7,9,12,.88)) !important;",
            "}",
            "",
            ".extensions__item.active:before {",
            "    background: rgba(82,255,179,.95) !important;",
            "    color: rgba(6,30,29,.96) !important;",
            "    box-shadow: 0 .25em .8em rgba(82,255,179,.22) !important;",
            "}",
            "",
            ".extensions-info {",
            "    color: rgba(245,248,255,.78) !important;",
            "}",
            "",
            ".extensions-info__image {",
            "    border-radius: .82em !important;",
            "}",
            "",
            ".extensions-info__label {",
            "    color: rgba(245,248,255,.5) !important;",
            "}",
            "",
            ".plugins-catalog__title {",
            "    color: rgba(255,255,255,.94) !important;",
            "    font-weight: 700 !important;",
            "}",
            "",
            ".plugins-catalog__descr {",
            "    color: rgba(245,248,255,.58) !important;",
            "}",
            "",
            ".plugins-catalog__line {",
            "    border-radius: .72em !important;",
            "    background: rgba(255,255,255,.045) !important;",
            "    box-shadow: inset 0 0 0 .055em rgba(255,255,255,.07) !important;",
            "}",
            "",
            ".plugins-catalog__line + .plugins-catalog__line {",
            "    margin-top: .55em !important;",
            "}",
            "",
            ".plugins-catalog__line.focus {",
            "    background: linear-gradient(100deg, rgba(82,255,179,.98), rgba(105,183,226,.96)) !important;",
            "    color: rgba(6,30,29,.96) !important;",
            "}",
            "",
            "@media screen and (max-width: 48em) {",
            "    .settings__content,",
            "    .selectbox__content {",
            "        width: calc(100vw - 2em) !important;",
            "        max-width: calc(100vw - 2em) !important;",
            "        right: 1em !important;",
            "        left: auto !important;",
            "        top: 1em !important;",
            "        height: auto !important;",
            "        max-height: calc(100vh - 2em) !important;",
            "        border-radius: 1.1em !important;",
            "    }",
            "    .modal:not(.modal--full) .modal__content {",
            "        left: 1em !important;",
            "        right: 1em !important;",
            "        bottom: 1em !important;",
            "        width: auto !important;",
            "        max-width: calc(100vw - 2em) !important;",
            "        border-radius: 1.1em !important;",
            "    }",
            "    .modal:not(.modal--full) .modal__head {",
            "        padding: 1.6em 1.1em .82em !important;",
            "    }",
            "    .modal:not(.modal--full) .modal__head::before {",
            "        content: '' !important;",
            "        position: absolute !important;",
            "        left: 50% !important;",
            "        top: .52em !important;",
            "        width: 2.7em !important;",
            "        height: .28em !important;",
            "        margin-left: -1.35em !important;",
            "        border-radius: 1em !important;",
            "        background: rgba(255,255,255,.18) !important;",
            "    }",
            "    .modal:not(.modal--full) .modal__body {",
            "        padding: .82em .82em 0 !important;",
            "    }",
            "    .modal:not(.modal--full) .modal__body .scroll__content {",
            "        max-height: calc(100vh - 13em) !important;",
            "    }",
            "    .modal:not(.modal--full) .modal__footer {",
            "        display: block !important;",
            "        padding: .82em .82em .9em !important;",
            "    }",
            "    .modal:not(.modal--full) .modal__button + .modal__button,",
            "    .modal:not(.modal--full) .simple-button + .simple-button {",
            "        margin-left: 0 !important;",
            "        margin-top: .7em !important;",
            "    }",
            "    .settings__head,",
            "    .selectbox__head {",
            "        padding: 1.6em 1.1em .82em !important;",
            "    }",
            "    .settings__head::before,",
            "    .selectbox__head::before {",
            "        content: '' !important;",
            "        position: absolute !important;",
            "        left: 50% !important;",
            "        top: .52em !important;",
            "        width: 2.7em !important;",
            "        height: .28em !important;",
            "        margin-left: -1.35em !important;",
            "        border-radius: 1em !important;",
            "        background: rgba(255,255,255,.18) !important;",
            "    }",
            "    .settings__body,",
            "    .selectbox__body {",
            "        height: auto !important;",
            "        max-height: calc(100vh - 6.25em) !important;",
            "    }",
            "    .settings__body > .scroll,",
            "    .settings__body .scroll__body {",
            "        height: auto !important;",
            "        max-height: calc(100vh - 6.25em) !important;",
            "    }",
            "    .selectbox__content {",
            "        height: calc(100vh - 2em) !important;",
            "    }",
            "    .selectbox__body,",
            "    .selectbox__body > .scroll,",
            "    .selectbox__body .scroll__content {",
            "        height: 100% !important;",
            "        max-height: none !important;",
            "    }",
            "    .selectbox__body .scroll__body {",
            "        height: auto !important;",
            "        max-height: none !important;",
            "        overflow: visible !important;",
            "    }",
            "    .settings__body .scroll__content,",
            "    .selectbox__body .scroll__content {",
            "        padding: .72em .72em .9em !important;",
            "    }",
            "    .settings-folder,",
            "    .settings-param,",
            "    .selectbox-item {",
            "        min-height: 3.95em !important;",
            "        padding: .92em 2.55em .92em .92em !important;",
            "    }",
            "}"
        ].join("\n");

        upsertStyle(SETTINGS_STYLE_ID, css);
    }

    function removeSettingsStyle() {
        var old = document.getElementById(SETTINGS_STYLE_ID);
        if (old && old.parentNode) old.parentNode.removeChild(old);
    }

    function injectHeadStyle() {
        var css = [
            ".head {",
            "    background: linear-gradient(180deg, rgba(17,18,21,.94), rgba(17,18,21,.72) 64%, rgba(17,18,21,0)) !important;",
            "    box-shadow: 0 .75em 1.8em rgba(0,0,0,.22) !important;",
            "    -webkit-backdrop-filter: blur(.9em) !important;",
            "    backdrop-filter: blur(.9em) !important;",
            "}",
            "",
            ".head::after {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 1.15em !important;",
            "    right: 1.15em !important;",
            "    bottom: 0 !important;",
            "    height: .06em !important;",
            "    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.12), rgba(255,255,255,0)) !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".head__body {",
            "    padding: .56em 1.15em .64em !important;",
            "    min-height: 3.55em !important;",
            "    align-items: center !important;",
            "}",
            "",
            "body.menu--open .head,",
            "body.settings--open .head,",
            "body.selectbox--open .head {",
            "    background: transparent !important;",
            "    box-shadow: none !important;",
            "    -webkit-backdrop-filter: none !important;",
            "    backdrop-filter: none !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            "body.menu--open .head::after,",
            "body.settings--open .head::after,",
            "body.selectbox--open .head::after {",
            "    opacity: 0 !important;",
            "}",
            "",
            "body.menu--open .head__body,",
            "body.settings--open .head__body,",
            "body.selectbox--open .head__body {",
            "    opacity: 0 !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".head__split {",
            "    width: 1.05em !important;",
            "    flex-shrink: 0 !important;",
            "}",
            "",
            ".head__title {",
            "    font-weight: 500 !important;",
            "    line-height: 1.08 !important;",
            "    color: rgba(255,255,255,.94) !important;",
            "    text-shadow: 0 .08em .35em rgba(0,0,0,.42) !important;",
            "    letter-spacing: 0 !important;",
            "}",
            "",
            ".head__action,",
            ".head__menu-icon,",
            ".head__backward {",
            "    border-radius: .72em !important;",
            "    background: rgba(255,255,255,.035) !important;",
            "    box-shadow: inset 0 0 0 .055em rgba(255,255,255,.06) !important;",
            "    transition: background-color .16s ease, color .16s ease, box-shadow .16s ease, transform .16s ease !important;",
            "}",
            "",
            ".head__menu-icon,",
            ".head__backward {",
            "    background: rgba(255,255,255,.018) !important;",
            "    box-shadow: none !important;",
            "}",
            "",
            ".head__backward {",
            "    width: 1.38em !important;",
            "    min-width: 1.38em !important;",
            "    height: 2.18em !important;",
            "    margin-right: .18em !important;",
            "    display: flex !important;",
            "    align-items: center !important;",
            "    justify-content: center !important;",
            "    color: rgba(255,255,255,.82) !important;",
            "    border-radius: 0 !important;",
            "    background: transparent !important;",
            "    box-shadow: none !important;",
            "    opacity: .92 !important;",
            "}",
            "",
            ".head__backward svg {",
            "    width: 1.14em !important;",
            "    height: 1.14em !important;",
            "    filter: drop-shadow(0 .06em .14em rgba(0,0,0,.42)) !important;",
            "}",
            "",
            ".head__menu-icon {",
            "    position: relative !important;",
            "    width: 2.18em !important;",
            "    height: 2.18em !important;",
            "    min-width: 2.18em !important;",
            "    margin-left: .04em !important;",
            "    margin-right: .56em !important;",
            "    border-radius: 50% !important;",
            "    background: rgba(8,10,14,.56) !important;",
            "    box-shadow: inset 0 0 0 .07em rgba(255,255,255,.12), 0 .18em .5em rgba(0,0,0,.26) !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".head__menu-icon svg {",
            "    opacity: 0 !important;",
            "}",
            "",
            ".head__menu-icon::before {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: .32em !important;",
            "    right: .32em !important;",
            "    top: .32em !important;",
            "    bottom: .32em !important;",
            "    border-radius: 50% !important;",
            "    background: radial-gradient(circle at 68% 34%, rgba(120,106,255,.95), rgba(120,106,255,0) 33%), radial-gradient(circle at 32% 68%, rgba(82,255,179,.94), rgba(82,255,179,0) 36%), linear-gradient(135deg, rgba(46,232,255,.95), rgba(75,76,255,.72)) !important;",
            "    box-shadow: 0 0 .5em rgba(82,255,179,.22), inset 0 0 0 .1em rgba(0,0,0,.34) !important;",
            "}",
            "",
            ".head__menu-icon::after {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: .58em !important;",
            "    right: .58em !important;",
            "    top: .58em !important;",
            "    bottom: .58em !important;",
            "    border-radius: 50% !important;",
            "    background: rgba(8,10,14,.72) !important;",
            "    box-shadow: inset 0 0 0 .08em rgba(255,255,255,.10) !important;",
            "}",
            "",
            ".head__action.focus,",
            ".head__action.hover {",
            "    color: rgba(6,30,29,.96) !important;",
            "    background: linear-gradient(100deg, rgba(82,255,179,.98), rgba(105,183,226,.96)) !important;",
            "    box-shadow: 0 .22em .62em rgba(65,218,188,.14), inset 0 0 0 .06em rgba(255,255,255,.20) !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".head__menu-icon.focus,",
            ".head__menu-icon.hover,",
            ".head__backward.focus,",
            ".head__backward.hover {",
            "    color: rgba(93,244,190,.98) !important;",
            "    background: rgba(255,255,255,.055) !important;",
            "    box-shadow: inset 0 0 0 .055em rgba(93,244,190,.16) !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".head__menu-icon.focus,",
            ".head__menu-icon.hover {",
            "    background: rgba(8,12,16,.72) !important;",
            "    box-shadow: inset 0 0 0 .08em rgba(93,244,190,.30), 0 0 .85em rgba(82,255,179,.18) !important;",
            "}",
            "",
            ".head__menu-icon.focus::before,",
            ".head__menu-icon.hover::before {",
            "    box-shadow: 0 0 .8em rgba(82,255,179,.34), inset 0 0 0 .1em rgba(0,0,0,.30) !important;",
            "}",
            "",
            ".head__action svg,",
            ".head__menu-icon svg,",
            ".head__backward svg {",
            "    filter: drop-shadow(0 .06em .16em rgba(0,0,0,.35)) !important;",
            "}",
            "",
            ".head__time {",
            "    min-width: 7.8em !important;",
            "    padding-left: .75em !important;",
            "    text-align: left !important;",
            "}",
            "",
            ".head__time-now {",
            "    font-weight: 800 !important;",
            "    line-height: .94 !important;",
            "    color: rgba(255,255,255,.98) !important;",
            "    text-shadow: 0 .08em .35em rgba(0,0,0,.48) !important;",
            "}",
            "",
            ".head__time-date,",
            ".head__time-week {",
            "    font-weight: 500 !important;",
            "    line-height: 1.12 !important;",
            "    color: rgba(255,255,255,.78) !important;",
            "}",
            "",
            "@media screen and (max-width: 48em) {",
            "    .head__body {",
            "        padding: .52em .8em .62em !important;",
            "        min-height: 3.45em !important;",
            "    }",
            "    .head__title {",
            "        font-size: 1.38em !important;",
            "    }",
            "    .head__time {",
            "        min-width: 5.8em !important;",
            "        padding-left: .45em !important;",
            "    }",
            "}"
        ].join("\n");

        upsertStyle(HEAD_STYLE_ID, css);
    }

    function removeHeadStyle() {
        var old = document.getElementById(HEAD_STYLE_ID);
        if (old && old.parentNode) old.parentNode.removeChild(old);
    }

    function injectFullStyle() {
        var css = [
            ".full-start,",
            ".full-start-new {",
            "    position: relative !important;",
            "}",
            "",
            ".full-start__background.loaded {",
            "    opacity: .42 !important;",
            "}",
            "",
            ".full-start__background.dim {",
            "    opacity: .22 !important;",
            "}",
            "",
            ".full-start__poster,",
            ".full-start-new__poster {",
            "    border-radius: 1.05em !important;",
            "    overflow: hidden !important;",
            "    background-color: rgba(7,10,16,.78) !important;",
            "    box-shadow: 0 .72em 1.8em rgba(0,0,0,.32), inset 0 0 0 .06em rgba(118,140,255,.18) !important;",
            "    transform: translateZ(0);",
            "}",
            "",
            ".full-start__img,",
            ".full-start-new__img {",
            "    border-radius: 1.05em !important;",
            "    background-color: #070a10 !important;",
            "}",
            "",
            ".full-start__poster.focus img,",
            ".full-start-new__poster.focus img,",
            ".full-start-new__poster.focus {",
            "    box-shadow: 0 0 0 .18em rgba(255,255,255,.94), 0 .88em 2.2em rgba(0,0,0,.38) !important;",
            "}",
            "",
            ".full-start-new__poster:after {",
            "    content: '';",
            "    position: absolute;",
            "    left: 0;",
            "    top: 0;",
            "    right: 0;",
            "    bottom: 0;",
            "    pointer-events: none;",
            "    border-radius: 1.05em;",
            "    box-shadow: inset 0 0 0 .06em rgba(255,255,255,.08), inset 0 -6em 5em rgba(3,6,12,.36);",
            "}",
            "",
            ".full-start__title,",
            ".full-start-new__title {",
            "    font-weight: 700 !important;",
            "    letter-spacing: 0 !important;",
            "    text-shadow: none !important;",
            "    background: transparent !important;",
            "}",
            "",
            ".full-start-new__title .themex-title-logo {",
            "    display: block;",
            "    max-width: 100%;",
            "    max-height: 7.8em;",
            "    width: auto;",
            "    height: auto;",
            "    margin-top: .28em;",
            "    object-fit: contain;",
            "    object-position: left center;",
            "    filter: drop-shadow(0 .18em .5em rgba(0,0,0,.52));",
            "}",
            "",
            ".full-start-new__right {",
            "    background: transparent !important;",
            "}",
            "",
            ".full-start__title-original,",
            ".full-start-new__head,",
            ".full-start-new__tagline,",
            ".full-start__descr,",
            ".full-start-new__description,",
            ".full-descr__text {",
            "    color: rgba(255,255,255,.78) !important;",
            "}",
            "",
            ".full-start-new__head span {",
            "    color: #fff !important;",
            "}",
            "",
            ".full-start__pg,",
            ".full-start__status,",
            ".full-start__tag,",
            ".full-start .info__rate,",
            ".full-start__rate,",
            ".full-start-new__details > *,",
            ".full-descr__tag {",
            "    border-radius: .34em !important;",
            "    border: .06em solid rgba(255,255,255,.08) !important;",
            "    background: rgba(7,10,16,.54) !important;",
            "    box-shadow: inset 0 0 0 .06em rgba(255,255,255,.04) !important;",
            "    color: rgba(255,255,255,.88) !important;",
            "}",
            "",
            ".full-start-new__details > *,",
            ".full-start__tag,",
            ".full-descr__tag {",
            "    padding: .16em .42em .20em !important;",
            "    line-height: 1.22 !important;",
            "}",
            "",
            ".full-start__pg,",
            ".full-start__status {",
            "    padding: .18em .42em !important;",
            "    line-height: 1.14 !important;",
            "}",
            "",
            ".full-start .info__rate,",
            ".full-start__rate {",
            "    border-radius: .42em !important;",
            "}",
            "",
            ".full-start-new__split {",
            "    display: none !important;",
            "}",
            "",
            ".full-start__tag.tag--quality {",
            "    background: rgba(43,25,14,.76) !important;",
            "    border-color: rgba(255,125,31,.22) !important;",
            "    color: #ff8a1f !important;",
            "}",
            "",
            ".full-start__rate > div:first-child,",
            ".full-start .info__icon {",
            "    color: #55f28d !important;",
            "    background: rgba(37,255,142,.10) !important;",
            "}",
            "",
            ".full-start__button,",
            ".full-start .simple-button,",
            ".full-start-new .simple-button,",
            ".full-descr .simple-button {",
            "    border-radius: .82em !important;",
            "    border: .06em solid rgba(255,255,255,.08) !important;",
            "    background: rgba(12,15,22,.56) !important;",
            "    box-shadow: 0 .18em .42em rgba(0,0,0,.14), inset 0 0 0 .06em rgba(255,255,255,.045) !important;",
            "    color: rgba(255,255,255,.88) !important;",
            "}",
            "",
            ".full-start__button.focus,",
            ".full-start__button.hover,",
            ".full-start .simple-button.focus,",
            ".full-start .simple-button.hover,",
            ".full-start-new .simple-button.focus,",
            ".full-start-new .simple-button.hover,",
            ".full-descr .simple-button.focus,",
            ".full-descr .simple-button.hover,",
            ".full-descr__tag.focus,",
            ".full-descr__tag.hover {",
            "    background: linear-gradient(100deg, #52f5a4 0%, #63b9f1 100%) !important;",
            "    color: #071016 !important;",
            "    border-color: rgba(255,255,255,.16) !important;",
            "    box-shadow: 0 .5em 1.25em rgba(77,231,184,.24), inset 0 0 0 .06em rgba(255,255,255,.20) !important;",
            "}",
            "",
            ".full-descr__line-name,",
            ".full-descr__info-name {",
            "    color: rgba(255,255,255,.92) !important;",
            "    font-weight: 700 !important;",
            "}",
            "",
            ".full-descr__info-body,",
            ".full-descr__line-body {",
            "    color: rgba(255,255,255,.76) !important;",
            "}",
            "",
            ".full-person {",
            "    border-radius: .95em !important;",
            "    border: .06em solid transparent !important;",
            "    background: rgba(9,12,18,.24) !important;",
            "}",
            "",
            ".full-person__photo {",
            "    border-radius: .82em !important;",
            "    background-color: rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".full-person.focus,",
            ".full-person.hover {",
            "    background: rgba(255,255,255,.10) !important;",
            "    border-color: rgba(255,255,255,.14) !important;",
            "    color: #fff !important;",
            "}",
            "",
            ".full-review,",
            ".full-review-add {",
            "    border-radius: 1em !important;",
            "    border: .06em solid rgba(255,255,255,.08) !important;",
            "    background: rgba(9,12,18,.62) !important;",
            "    box-shadow: 0 .62em 1.55em rgba(0,0,0,.24), inset 0 0 0 .06em rgba(255,255,255,.035) !important;",
            "}",
            "",
            ".full-review.focus,",
            ".full-review.hover,",
            ".full-review-add.focus,",
            ".full-review-add.hover {",
            "    background: rgba(255,255,255,.12) !important;",
            "    color: #fff !important;",
            "}",
            "",
            ".full-review-add.focus::after {",
            "    border-color: rgba(255,255,255,.78) !important;",
            "}",
            "",
            ".full-episode__img,",
            ".full-episode__body {",
            "    border-radius: .95em !important;",
            "}",
            "",
            ".full-episode__img {",
            "    background-color: rgba(7,10,16,.68) !important;",
            "    box-shadow: inset 0 0 0 .06em rgba(118,140,255,.14) !important;",
            "}",
            "",
            ".full-episode__img img {",
            "    border-radius: .95em !important;",
            "}",
            "",
            ".full-episode__body {",
            "    background: linear-gradient(to top, rgba(4,7,13,.92) 0%, rgba(4,7,13,.52) 45%, rgba(4,7,13,.12) 100%) !important;",
            "}",
            "",
            ".full-episode.focus::after {",
            "    border: .16em solid rgba(255,255,255,.88) !important;",
            "    border-radius: 1.15em !important;",
            "    left: -.34em !important;",
            "    top: -.34em !important;",
            "    right: -.34em !important;",
            "    bottom: -.34em !important;",
            "}",
            "",
            ".full-episode__num {",
            "    font-weight: 700 !important;",
            "    color: rgba(255,255,255,.96) !important;",
            "}",
            "",
            ".full-episode__name {",
            "    font-weight: 700 !important;",
            "    color: #fff !important;",
            "}",
            "",
            ".full-episode__date {",
            "    color: rgba(255,255,255,.78) !important;",
            "}",
            "",
            ".full-episode--next .full-episode__img:after {",
            "    border-color: rgba(255,255,255,.18) !important;",
            "    border-radius: .95em !important;",
            "}",
            "",
            ".files {",
            "    position: relative !important;",
            "}",
            "",
            ".files__left {",
            "    color: rgba(255,255,255,.88) !important;",
            "}",
            "",
            ".files__left .full-start__poster {",
            "    border-radius: .88em !important;",
            "    overflow: hidden !important;",
            "    box-shadow: 0 .55em 1.25em rgba(0,0,0,.26), inset 0 0 0 .06em rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".files__left .full-start__img {",
            "    border-radius: .88em !important;",
            "}",
            "",
            ".files__title {",
            "    font-weight: 800 !important;",
            "    line-height: 1.16 !important;",
            "    letter-spacing: 0 !important;",
            "    text-shadow: none !important;",
            "}",
            "",
            ".files__title-original,",
            ".files__info {",
            "    color: rgba(255,255,255,.74) !important;",
            "}",
            "",
            ".explorer__files-head .simple-button,",
            ".explorer__files .torrent-filter .simple-button {",
            "    border-radius: .72em !important;",
            "    border: .06em solid rgba(255,255,255,.08) !important;",
            "    background: rgba(12,15,22,.56) !important;",
            "    box-shadow: 0 .32em .9em rgba(0,0,0,.18), inset 0 0 0 .06em rgba(255,255,255,.04) !important;",
            "    color: rgba(255,255,255,.88) !important;",
            "}",
            "",
            ".explorer__files-head .simple-button.focus,",
            ".explorer__files-head .simple-button.hover,",
            ".explorer__files .torrent-filter .simple-button.focus,",
            ".explorer__files .torrent-filter .simple-button.hover {",
            "    background: linear-gradient(100deg, #52f5a4 0%, #63b9f1 100%) !important;",
            "    color: #071016 !important;",
            "    box-shadow: 0 .44em 1.05em rgba(77,231,184,.22), inset 0 0 0 .06em rgba(255,255,255,.18) !important;",
            "}",
            "",
            ".files__body > .selector,",
            ".files__body .scroll__body > .selector,",
            ".files__body [class*='online'].selector {",
            "    border-radius: .72em !important;",
            "    border: .06em solid rgba(255,255,255,.07) !important;",
            "    background: rgba(8,11,17,.54) !important;",
            "    box-shadow: 0 .36em .95em rgba(0,0,0,.18), inset 0 0 0 .06em rgba(255,255,255,.035) !important;",
            "    color: rgba(255,255,255,.92) !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".files__body > .selector.focus,",
            ".files__body > .selector.hover,",
            ".files__body .scroll__body > .selector.focus,",
            ".files__body .scroll__body > .selector.hover,",
            ".files__body [class*='online'].selector.focus,",
            ".files__body [class*='online'].selector.hover {",
            "    border-color: rgba(91,239,179,.66) !important;",
            "    background: rgba(16,25,39,.86) !important;",
            "    box-shadow: 0 .68em 1.45em rgba(0,0,0,.34), 0 0 0 .12em rgba(91,239,179,.34), inset .22em 0 0 rgba(91,239,179,.95), inset 0 0 0 .06em rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".files__body > .selector.focus::after,",
            ".files__body .scroll__body > .selector.focus::after,",
            ".files__body [class*='online'].selector.focus::after {",
            "    display: none !important;",
            "    content: none !important;",
            "}",
            "",
            ".files__body > .selector > svg,",
            ".files__body .scroll__body > .selector > svg,",
            ".files__body [class*='online'].selector > svg {",
            "    color: rgba(255,255,255,.96) !important;",
            "}",
            "",
            ".online {",
            "    border-radius: .72em !important;",
            "    border: .06em solid rgba(255,255,255,.07) !important;",
            "    background: rgba(8,11,17,.54) !important;",
            "    box-shadow: 0 .48em 1.15em rgba(0,0,0,.18), inset 0 0 0 .06em rgba(255,255,255,.035) !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".online + .online {",
            "    margin-top: .82em !important;",
            "}",
            "",
            ".online.focus,",
            ".online.hover {",
            "    margin-left: 0 !important;",
            "    margin-right: 0 !important;",
            "    padding: 1.2em !important;",
            "    border-color: rgba(91,239,179,.66) !important;",
            "    background: rgba(16,25,39,.86) !important;",
            "    box-shadow: 0 .68em 1.45em rgba(0,0,0,.34), 0 0 0 .12em rgba(91,239,179,.34), inset .22em 0 0 rgba(91,239,179,.95), inset 0 0 0 .06em rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".online img {",
            "    border-radius: .52em !important;",
            "}",
            "",
            ".online__title {",
            "    font-weight: 600 !important;",
            "    line-height: 1.18 !important;",
            "    color: rgba(255,255,255,.96) !important;",
            "    text-shadow: none !important;",
            "}",
            "",
            ".online__quality {",
            "    color: rgba(255,255,255,.78) !important;",
            "}",
            "",
            ".online .time-line {",
            "    background-color: rgba(255,255,255,.28) !important;",
            "    border-radius: 2em !important;",
            "}",
            "",
            ".online .time-line > div {",
            "    background: #63b9f1 !important;",
            "    border-radius: 2em !important;",
            "}",
            "",
            ".online-prestige,",
            ".online-prestige-watched {",
            "    position: relative !important;",
            "    border-radius: .72em !important;",
            "    border: .06em solid rgba(255,255,255,.07) !important;",
            "    background: rgba(8,11,17,.54) !important;",
            "    box-shadow: 0 .42em 1em rgba(0,0,0,.18), inset 0 0 0 .06em rgba(255,255,255,.035) !important;",
            "    color: rgba(255,255,255,.92) !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".online-prestige.focus,",
            ".online-prestige.hover,",
            ".online-prestige-watched.focus,",
            ".online-prestige-watched.hover {",
            "    border-color: rgba(91,239,179,.66) !important;",
            "    background: rgba(16,25,39,.86) !important;",
            "    box-shadow: 0 .68em 1.45em rgba(0,0,0,.34), 0 0 0 .12em rgba(91,239,179,.34), inset .22em 0 0 rgba(91,239,179,.95), inset 0 0 0 .06em rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".online-prestige.focus::after,",
            ".online-prestige.hover::after,",
            ".online-prestige-watched.focus::after,",
            ".online-prestige-watched.hover::after {",
            "    display: none !important;",
            "    content: none !important;",
            "}",
            "",
            ".online-prestige__imgbox {",
            "    border-radius: .52em !important;",
            "    overflow: hidden !important;",
            "    background: rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".online-prestige__imgbox img {",
            "    border-radius: .52em !important;",
            "}",
            "",
            ".online-prestige__title {",
            "    color: rgba(255,255,255,.96) !important;",
            "    font-weight: 600 !important;",
            "    line-height: 1.18 !important;",
            "    text-shadow: none !important;",
            "}",
            "",
            ".online-prestige__body,",
            ".online-prestige__details,",
            ".online-prestige__details span,",
            ".online-prestige-watched__body {",
            "    color: rgba(255,255,255,.78) !important;",
            "}",
            "",
            ".online-prestige__split,",
            ".online-prestige-watched__split {",
            "    color: rgba(255,255,255,.58) !important;",
            "}",
            "",
            ".online-prestige__timeline,",
            ".online-prestige .time-line {",
            "    background-color: rgba(255,255,255,.26) !important;",
            "    border-radius: 2em !important;",
            "}",
            "",
            ".online-prestige__timeline > div,",
            ".online-prestige .time-line > div {",
            "    background: #63b9f1 !important;",
            "    border-radius: 2em !important;",
            "}",
            "",
            ".online-prestige__icon,",
            ".online-prestige-watched__icon {",
            "    color: rgba(255,255,255,.96) !important;",
            "}",
            "",
            ".torrent-list {",
            "    padding-left: 1em !important;",
            "    padding-right: 1em !important;",
            "}",
            "",
            ".torrent-item,",
            ".torrent-file {",
            "    position: relative !important;",
            "    border-radius: .72em !important;",
            "    border: .06em solid rgba(255,255,255,.07) !important;",
            "    background: rgba(8,11,17,.54) !important;",
            "    box-shadow: 0 .42em 1em rgba(0,0,0,.18), inset 0 0 0 .06em rgba(255,255,255,.035) !important;",
            "    color: rgba(255,255,255,.92) !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".torrent-item.focus,",
            ".torrent-item.hover,",
            ".torrent-file.focus,",
            ".torrent-file.hover {",
            "    border-color: rgba(91,239,179,.66) !important;",
            "    background: rgba(16,25,39,.86) !important;",
            "    box-shadow: 0 .62em 1.28em rgba(0,0,0,.30), 0 0 0 .055em rgba(91,239,179,.42), inset 0 0 0 .06em rgba(255,255,255,.08) !important;",
            "}",
            "",
            ".torrent-item.focus::after,",
            ".torrent-item.hover::after {",
            "    display: none !important;",
            "    content: none !important;",
            "}",
            "",
            ".torrent-item + .torrent-item,",
            ".torrent-files .torrent-file + .torrent-file,",
            ".torrent-files .torrent-file + .torrent-serial,",
            ".torrent-files .torrent-serial + .torrent-file,",
            ".torrent-files .torrent-serial + .torrent-serial {",
            "    margin-top: .82em !important;",
            "}",
            "",
            ".torrent-item__title,",
            ".torrent-file__title {",
            "    color: rgba(255,255,255,.96) !important;",
            "    font-weight: 600 !important;",
            "    line-height: 1.22 !important;",
            "    text-shadow: none !important;",
            "}",
            "",
            ".torrent-item__details,",
            ".torrent-item__date,",
            ".torrent-item__tracker,",
            ".torrent-item__bitrate,",
            ".torrent-item__grabs,",
            ".torrent-item__seeds {",
            "    color: rgba(255,255,255,.66) !important;",
            "}",
            "",
            ".torrent-item__bitrate > span,",
            ".torrent-item__grabs > span,",
            ".torrent-item__seeds > span {",
            "    color: rgba(255,255,255,.92) !important;",
            "}",
            "",
            ".torrent-item__size,",
            ".torrent-file__size,",
            ".torrent-file__title .exe {",
            "    border-radius: .42em !important;",
            "    border: .06em solid rgba(255,255,255,.08) !important;",
            "    background: rgba(255,255,255,.10) !important;",
            "    color: rgba(255,255,255,.94) !important;",
            "    box-shadow: inset 0 0 0 .06em rgba(255,255,255,.04) !important;",
            "}",
            "",
            ".torrent-item__ffprobe > div,",
            ".torrent-item__stat {",
            "    border-radius: .42em !important;",
            "    border: .06em solid rgba(255,255,255,.08) !important;",
            "    background: rgba(255,255,255,.11) !important;",
            "    color: rgba(255,255,255,.88) !important;",
            "    box-shadow: inset 0 0 0 .06em rgba(255,255,255,.035) !important;",
            "}",
            "",
            ".torrent-item__viewed {",
            "    background: #63b9f1 !important;",
            "    color: #071016 !important;",
            "}",
            "",
            ".torrent-file .time-line {",
            "    background-color: rgba(255,255,255,.26) !important;",
            "    border-radius: 2em !important;",
            "}",
            "",
            ".torrent-file .time-line > div {",
            "    background: #63b9f1 !important;",
            "    border-radius: 2em !important;",
            "}",
            "",
            "@media screen and (max-width: 48em) {",
            "    .full-start,",
            "    .full-start-new,",
            "    .full-descr {",
            "        padding-left: 1em !important;",
            "        padding-right: 1em !important;",
            "    }",
            "    .full-start-new__left {",
            "        width: auto !important;",
            "        margin: 0 !important;",
            "    }",
            "    .full-start-new__poster {",
            "        padding-bottom: 100% !important;",
            "        border-radius: 1.05em 1.05em 0 0 !important;",
            "        overflow: hidden !important;",
            "        background: transparent !important;",
            "        -webkit-mask-image: -webkit-linear-gradient(top, #fff 0%, #fff 72%, rgba(255,255,255,.82) 84%, rgba(255,255,255,0) 100%) !important;",
            "        mask-image: linear-gradient(to bottom, #fff 0%, #fff 72%, rgba(255,255,255,.82) 84%, rgba(255,255,255,0) 100%) !important;",
            "    }",
            "    .full-start-new__poster:after {",
            "        border-radius: 1.05em 1.05em 0 0 !important;",
            "        background: linear-gradient(to bottom, rgba(5,7,11,0) 54%, rgba(5,7,11,.26) 78%, rgba(5,7,11,.58) 100%) !important;",
            "        box-shadow: none !important;",
            "    }",
            "    .full-start-new__poster.with-out img,",
            "    .full-start-new__img {",
            "        -webkit-mask-image: none !important;",
            "        mask-image: none !important;",
            "        -webkit-transform: none !important;",
            "        transform: none !important;",
            "        border-radius: 1.05em 1.05em 0 0 !important;",
            "        object-position: center top !important;",
            "    }",
            "    .full-start-new__right {",
            "        position: relative !important;",
            "        z-index: 2 !important;",
            "        margin: -9.8em 0 0 !important;",
            "        padding: 1.35em 1em 0 !important;",
            "        border-radius: 0 !important;",
            "        overflow: visible !important;",
            "        background: transparent !important;",
            "        -webkit-backdrop-filter: none !important;",
            "        backdrop-filter: none !important;",
            "        box-shadow: none !important;",
            "    }",
            "    .full-start-new__title {",
            "        background: transparent !important;",
            "        text-shadow: 0 .08em .32em rgba(0,0,0,.42) !important;",
            "    }",
            "    .full-start__button,",
            "    .full-start .simple-button,",
            "    .full-start-new .simple-button {",
            "        background: rgba(12,15,22,.50) !important;",
            "        box-shadow: 0 .12em .32em rgba(0,0,0,.12), inset 0 0 0 .06em rgba(255,255,255,.05) !important;",
            "    }",
            "    .full-start-new__description,",
            "    .full-descr__text {",
            "        width: 100% !important;",
            "    }",
            "}"
        ].join("\n");

        upsertStyle(FULL_STYLE_ID, css);
    }

    function removeFullStyle() {
        var old = document.getElementById(FULL_STYLE_ID);
        if (old && old.parentNode) old.parentNode.removeChild(old);
    }

    function injectTimetableStyle() {
        var css = [
            ".timetable {",
            "    padding: 1.2em 1.8em 2.2em !important;",
            "    color: rgba(255,255,255,.92) !important;",
            "}",
            "",
            ".timetable:after {",
            "    content: '' !important;",
            "    display: block !important;",
            "    clear: both !important;",
            "}",
            "",
            ".timetable__item {",
            "    width: 25% !important;",
            "    height: 8.7em !important;",
            "    padding: .46em !important;",
            "    box-sizing: border-box !important;",
            "    color: rgba(255,255,255,.86) !important;",
            "}",
            "",
            ".timetable__item:before {",
            "    display: none !important;",
            "    content: none !important;",
            "}",
            "",
            ".timetable__inner {",
            "    position: relative !important;",
            "    min-height: 0 !important;",
            "    height: 100% !important;",
            "    padding: 1em 1.08em !important;",
            "    padding-bottom: 1em !important;",
            "    box-sizing: border-box !important;",
            "    border-radius: .9em !important;",
            "    border: .06em solid rgba(255,255,255,.10) !important;",
            "    background: linear-gradient(145deg, rgba(14,18,24,.72), rgba(6,8,13,.62)) !important;",
            "    box-shadow: 0 .5em 1.15em rgba(0,0,0,.22), inset 0 0 0 .06em rgba(255,255,255,.035) !important;",
            "    overflow: hidden !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            ".timetable__inner:before {",
            "    content: '' !important;",
            "    position: absolute !important;",
            "    left: 0 !important;",
            "    right: 0 !important;",
            "    top: 0 !important;",
            "    bottom: 0 !important;",
            "    background: radial-gradient(circle at 18% 14%, rgba(82,255,179,.13), rgba(105,183,226,.08) 34%, rgba(0,0,0,0) 72%) !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            ".timetable__item--any .timetable__inner {",
            "    border-color: rgba(91,239,179,.28) !important;",
            "    background: linear-gradient(145deg, rgba(18,28,40,.82), rgba(8,11,17,.72)) !important;",
            "}",
            "",
            ".timetable__date {",
            "    position: relative !important;",
            "    top: auto !important;",
            "    left: auto !important;",
            "    z-index: 2 !important;",
            "    display: block !important;",
            "    margin-bottom: .72em !important;",
            "    padding-bottom: .62em !important;",
            "    border-bottom: .06em solid rgba(255,255,255,.12) !important;",
            "    color: rgba(255,255,255,.96) !important;",
            "    font-size: 1.18em !important;",
            "    line-height: 1.05 !important;",
            "    font-weight: 800 !important;",
            "    text-shadow: 0 .08em .2em rgba(0,0,0,.36) !important;",
            "}",
            "",
            ".timetable__body {",
            "    position: relative !important;",
            "    left: auto !important;",
            "    right: auto !important;",
            "    bottom: auto !important;",
            "    z-index: 2 !important;",
            "    display: block !important;",
            "    max-height: 3.35em !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".timetable__body > div {",
            "    position: relative !important;",
            "    display: block !important;",
            "    color: rgba(255,255,255,.76) !important;",
            "    font-size: .95em !important;",
            "    line-height: 1.32 !important;",
            "    font-weight: 600 !important;",
            "    min-height: 1.34em !important;",
            "    padding-right: 7.4em !important;",
            "    margin-bottom: .12em !important;",
            "    padding-left: .08em !important;",
            "    white-space: nowrap !important;",
            "    overflow: hidden !important;",
            "    text-overflow: ellipsis !important;",
            "}",
            "",
            ".timetable__body > div > span {",
            "    display: inline-block !important;",
            "    width: .52em !important;",
            "    height: .52em !important;",
            "    margin-right: .46em !important;",
            "    margin-left: .02em !important;",
            "    margin-bottom: .05em !important;",
            "    border-radius: 999em !important;",
            "    vertical-align: middle !important;",
            "    box-shadow: 0 0 .28em currentColor !important;",
            "}",
            "",
            ".temav-tt-badges {",
            "    position: absolute !important;",
            "    right: 0 !important;",
            "    top: 50% !important;",
            "    display: inline-flex !important;",
            "    transform: translateY(-50%) !important;",
            "    gap: .32em !important;",
            "    max-width: 7em !important;",
            "    overflow: hidden !important;",
            "}",
            "",
            ".temav-tt-code {",
            "    display: inline-block !important;",
            "    min-width: 2.65em !important;",
            "    padding: .18em .38em !important;",
            "    box-sizing: border-box !important;",
            "    border-radius: .32em !important;",
            "    background: rgba(255,255,255,.10) !important;",
            "    border: .06em solid rgba(255,255,255,.10) !important;",
            "    color: rgba(255,255,255,.86) !important;",
            "    font-size: .82em !important;",
            "    line-height: 1.1 !important;",
            "    font-weight: 700 !important;",
            "    text-align: center !important;",
            "}",
            "",
            ".timetable__preview {",
            "    display: none !important;",
            "    margin: 0 !important;",
            "}",
            "",
            ".timetable__preview > img {",
            "    display: block !important;",
            "    width: 100% !important;",
            "    height: 4.8em !important;",
            "    margin: 0 0 .44em !important;",
            "    border-radius: .62em !important;",
            "    object-fit: cover !important;",
            "    opacity: .88 !important;",
            "}",
            "",
            ".timetable__preview > div {",
            "    color: rgba(255,255,255,.92) !important;",
            "    font-size: .92em !important;",
            "    line-height: 1.18 !important;",
            "    font-weight: 700 !important;",
            "    white-space: nowrap !important;",
            "    overflow: hidden !important;",
            "    text-overflow: ellipsis !important;",
            "}",
            "",
            ".timetable__item.focus,",
            ".timetable__item.hover,",
            ".timetable__item.traverse {",
            "    color: rgba(255,255,255,.96) !important;",
            "}",
            "",
            ".timetable__item.focus .timetable__inner,",
            ".timetable__item.hover .timetable__inner,",
            ".timetable__item.traverse .timetable__inner {",
            "    border-color: rgba(91,239,179,.72) !important;",
            "    background: linear-gradient(145deg, rgba(26,40,58,.94), rgba(9,13,22,.82)) !important;",
            "    box-shadow: 0 .62em 1.25em rgba(0,0,0,.30), 0 0 0 .07em rgba(91,239,179,.34), inset 0 0 0 .06em rgba(255,255,255,.10) !important;",
            "}",
            "",
            ".timetable__item.focus .timetable__date,",
            ".timetable__item.hover .timetable__date,",
            ".timetable__item.traverse .timetable__date {",
            "    color: rgba(110,255,212,.98) !important;",
            "}",
            "",
            ".timetable__item.focus .timetable__body > div,",
            ".timetable__item.hover .timetable__body > div,",
            ".timetable__item.traverse .timetable__body > div {",
            "    color: rgba(255,255,255,.92) !important;",
            "}",
            "",
            "@media screen and (max-width: 75em) {",
            "    .timetable__item {",
            "        width: 33.333% !important;",
            "    }",
            "}",
            "",
            "@media screen and (max-width: 42em) {",
            "    .timetable {",
            "        padding: .8em .72em 1.4em !important;",
            "    }",
            "    .timetable__item {",
            "        width: 50% !important;",
            "        height: 8.2em !important;",
            "        padding: .34em !important;",
            "    }",
            "    .timetable__inner {",
            "        min-height: 0 !important;",
            "        padding: .82em .88em !important;",
            "    }",
            "    .timetable__date {",
            "        font-size: 1.02em !important;",
            "    }",
            "    .timetable__body > div {",
            "        padding-right: 6.5em !important;",
            "    }",
            "    .temav-tt-badges {",
            "        max-width: 6.2em !important;",
            "        gap: .22em !important;",
            "    }",
            "    .temav-tt-code {",
            "        min-width: 2.35em !important;",
            "        padding: .16em .28em !important;",
            "        font-size: .76em !important;",
            "    }",
            "}"
        ].join("\n");

        upsertStyle(TIMETABLE_STYLE_ID, css);
    }

    function removeTimetableStyle() {
        var old = document.getElementById(TIMETABLE_STYLE_ID);
        if (old && old.parentNode) old.parentNode.removeChild(old);
    }

    function injectPerformanceStyle() {
        var css = [
            "body.temav-perf-balanced .card.beauty-card-final.focus .card__view,",
            "body.temav-perf-balanced .card.beauty-card-final.hover .card__view,",
            "body.temav-perf-balanced .card.beauty-card-final.selector.focus .card__view,",
            "body.temav-perf-balanced .card.beauty-card-final.selector.hover .card__view,",
            "body.temav-perf-balanced .card.beauty-card-final.selector.traverse .card__view {",
            "    box-shadow: 0 .56em 1.15em rgba(0,0,0,.30), 0 0 0 .055em rgba(124,148,255,.16) !important;",
            "}",
            "",
            "body.temav-perf-balanced .card.beauty-card-final.focus .card__img,",
            "body.temav-perf-balanced .card.beauty-card-final.hover .card__img,",
            "body.temav-perf-balanced .card.beauty-card-final.selector.focus .card__img,",
            "body.temav-perf-balanced .card.beauty-card-final.selector.hover .card__img,",
            "body.temav-perf-balanced .card.beauty-card-final.selector.traverse .card__img {",
            "    filter: none !important;",
            "}",
            "",
            "body.temav-perf-balanced .wrap__left,",
            "body.temav-perf-balanced .settings__content,",
            "body.temav-perf-balanced .selectbox__content,",
            "body.temav-perf-balanced .modal:not(.modal--full) .modal__content,",
            "body.temav-perf-balanced .noty,",
            "body.temav-perf-balanced .full-start__poster,",
            "body.temav-perf-balanced .full-start-new__poster,",
            "body.temav-perf-balanced .full-review,",
            "body.temav-perf-balanced .full-review-add,",
            "body.temav-perf-balanced .online,",
            "body.temav-perf-balanced .files__body > .selector,",
            "body.temav-perf-balanced .files__body .scroll__body > .selector,",
            "body.temav-perf-balanced .files__body [class*='online'].selector,",
            "body.temav-perf-balanced .online-prestige,",
            "body.temav-perf-balanced .online-prestige-watched,",
            "body.temav-perf-balanced .torrent-item,",
            "body.temav-perf-balanced .torrent-file,",
            "body.temav-perf-balanced .files__left .full-start__poster {",
            "    box-shadow: 0 .72em 1.85em rgba(0,0,0,.34), inset 0 0 0 .06em rgba(255,255,255,.08) !important;",
            "}",
            "",
            "body.temav-perf-balanced .head {",
            "    -webkit-backdrop-filter: blur(.45em) !important;",
            "    backdrop-filter: blur(.45em) !important;",
            "}",
            "",
            "body.temav-perf-balanced.menu--open .head,",
            "body.temav-perf-light.menu--open .head {",
            "    background: transparent !important;",
            "    box-shadow: none !important;",
            "    -webkit-backdrop-filter: none !important;",
            "    backdrop-filter: none !important;",
            "    opacity: 0 !important;",
            "    visibility: hidden !important;",
            "    pointer-events: none !important;",
            "    z-index: 1 !important;",
            "}",
            "",
            "body.temav-perf-balanced.menu--open .head::before,",
            "body.temav-perf-balanced.menu--open .head::after,",
            "body.temav-perf-light.menu--open .head::before,",
            "body.temav-perf-light.menu--open .head::after {",
            "    display: none !important;",
            "    opacity: 0 !important;",
            "}",
            "",
            "body.temav-perf-balanced.menu--open .head__body,",
            "body.temav-perf-light.menu--open .head__body {",
            "    opacity: 0 !important;",
            "    visibility: hidden !important;",
            "    pointer-events: none !important;",
            "}",
            "",
            "body.temav-perf-balanced .card-more.focus .card-more__box,",
            "body.temav-perf-balanced .card-more.hover .card-more__box,",
            "body.temav-perf-balanced .card-more.traverse .card-more__box {",
            "    box-shadow: 0 .56em 1.15em rgba(0,0,0,.30), 0 0 0 .055em rgba(124,148,255,.16) !important;",
            "}",
            "",
            "body.temav-perf-light .card.beauty-card-final .card__img,",
            "body.temav-perf-light .card.beauty-card-final .card__view,",
            "body.temav-perf-light .card-more__box,",
            "body.temav-perf-light .items-line__more,",
            "body.temav-perf-light .wrap__left .menu__item,",
            "body.temav-perf-light .settings-folder,",
            "body.temav-perf-light .settings-param,",
            "body.temav-perf-light .selectbox-item,",
            "body.temav-perf-light .modal__button,",
            "body.temav-perf-light .simple-button,",
            "body.temav-perf-light .full-start__button,",
            "body.temav-perf-light .full-descr__tag,",
            "body.temav-perf-light .full-person,",
            "body.temav-perf-light .full-review,",
            "body.temav-perf-light .full-review-add,",
            "body.temav-perf-light .online,",
            "body.temav-perf-light .files__body > .selector,",
            "body.temav-perf-light .files__body .scroll__body > .selector,",
            "body.temav-perf-light .files__body [class*='online'].selector,",
            "body.temav-perf-light .online-prestige,",
            "body.temav-perf-light .online-prestige-watched,",
            "body.temav-perf-light .torrent-item,",
            "body.temav-perf-light .torrent-file,",
            "body.temav-perf-light .head__action,",
            "body.temav-perf-light .head__menu-icon,",
            "body.temav-perf-light .head__backward {",
            "    transition-duration: .10s !important;",
            "}",
            "",
            "body.temav-perf-light .card.beauty-card-final.focus .card__view,",
            "body.temav-perf-light .card.beauty-card-final.hover .card__view,",
            "body.temav-perf-light .card.beauty-card-final.selector.focus .card__view,",
            "body.temav-perf-light .card.beauty-card-final.selector.hover .card__view,",
            "body.temav-perf-light .card.beauty-card-final.selector.traverse .card__view {",
            "    box-shadow: 0 .34em .78em rgba(0,0,0,.28), 0 0 0 .055em rgba(124,148,255,.14) !important;",
            "}",
            "",
            "body.temav-perf-light .card.beauty-card-final.focus .card__img,",
            "body.temav-perf-light .card.beauty-card-final.hover .card__img,",
            "body.temav-perf-light .card.beauty-card-final.selector.focus .card__img,",
            "body.temav-perf-light .card.beauty-card-final.selector.hover .card__img,",
            "body.temav-perf-light .card.beauty-card-final.selector.traverse .card__img {",
            "    transform: scale(1.035) !important;",
            "    filter: none !important;",
            "}",
            "",
            "body.temav-perf-light .card-episode.focus .full-episode__img img,",
            "body.temav-perf-light .card-episode.hover .full-episode__img img {",
            "    transform: scale(1.025) translateZ(0) !important;",
            "    filter: none !important;",
            "}",
            "",
            "body.temav-perf-light .wrap__left,",
            "body.temav-perf-light .settings__content,",
            "body.temav-perf-light .selectbox__content,",
            "body.temav-perf-light .modal:not(.modal--full) .modal__content,",
            "body.temav-perf-light .noty,",
            "body.temav-perf-light .full-start__poster,",
            "body.temav-perf-light .full-start-new__poster,",
            "body.temav-perf-light .full-review,",
            "body.temav-perf-light .full-review-add,",
            "body.temav-perf-light .online,",
            "body.temav-perf-light .files__body > .selector,",
            "body.temav-perf-light .files__body .scroll__body > .selector,",
            "body.temav-perf-light .files__body [class*='online'].selector,",
            "body.temav-perf-light .online-prestige,",
            "body.temav-perf-light .online-prestige-watched,",
            "body.temav-perf-light .torrent-item,",
            "body.temav-perf-light .torrent-file,",
            "body.temav-perf-light .files__left .full-start__poster {",
            "    -webkit-backdrop-filter: none !important;",
            "    backdrop-filter: none !important;",
            "    box-shadow: 0 .45em 1.1em rgba(0,0,0,.32), inset 0 0 0 .055em rgba(255,255,255,.07) !important;",
            "}",
            "",
            "body.temav-perf-light .head {",
            "    -webkit-backdrop-filter: none !important;",
            "    backdrop-filter: none !important;",
            "    box-shadow: 0 .42em 1em rgba(0,0,0,.18) !important;",
            "}",
            "",
            "body.temav-perf-balanced.menu--open:not(.settings--open):not(.selectbox--open) .wrap__left,",
            "body.temav-perf-light.menu--open:not(.settings--open):not(.selectbox--open) .wrap__left {",
            "    z-index: 260 !important;",
            "}",
            "",
            "body.temav-perf-light .wrap__left .menu__item.focus,",
            "body.temav-perf-light .wrap__left .menu__item.hover,",
            "body.temav-perf-light .wrap__left .menu__item.traverse,",
            "body.temav-perf-light .settings-folder.focus,",
            "body.temav-perf-light .settings-param.focus,",
            "body.temav-perf-light .selectbox-item.focus,",
            "body.temav-perf-light .modal__button.focus,",
            "body.temav-perf-light .simple-button.focus,",
            "body.temav-perf-light .full-start__button.focus,",
            "body.temav-perf-light .full-descr__tag.focus,",
            "body.temav-perf-light .full-person.focus,",
            "body.temav-perf-light .full-review.focus,",
            "body.temav-perf-light .full-review-add.focus,",
            "body.temav-perf-light .online.focus,",
            "body.temav-perf-light .files__body > .selector.focus,",
            "body.temav-perf-light .files__body .scroll__body > .selector.focus,",
            "body.temav-perf-light .files__body [class*='online'].selector.focus,",
            "body.temav-perf-light .online-prestige.focus,",
            "body.temav-perf-light .online-prestige-watched.focus,",
            "body.temav-perf-light .torrent-item.focus,",
            "body.temav-perf-light .torrent-file.focus,",
            "body.temav-perf-light .items-line__more.focus,",
            "body.temav-perf-light .items-line__more.hover,",
            "body.temav-perf-light .items-line__more.traverse {",
            "    box-shadow: inset 0 0 0 .06em rgba(255,255,255,.18) !important;",
            "    transform: translateZ(0) !important;",
            "}",
            "",
            "body.temav-perf-light .card-more.focus .card-more__box,",
            "body.temav-perf-light .card-more.hover .card-more__box,",
            "body.temav-perf-light .card-more.traverse .card-more__box {",
            "    box-shadow: 0 .34em .78em rgba(0,0,0,.28), 0 0 0 .055em rgba(124,148,255,.14) !important;",
            "}"
        ].join("\n");

        upsertStyle(PERFORMANCE_STYLE_ID, css);
        var style = document.getElementById(PERFORMANCE_STYLE_ID);
        var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        if (style && style.parentNode && head) head.appendChild(style);
    }

    function storageGet(name, fallback) {
        try {
            if (typeof Lampa !== 'undefined' && Lampa.Storage && Lampa.Storage.get) return Lampa.Storage.get(name, fallback);
        } catch (e) {}
        try {
            if (window.Storage && window.Storage.get) return window.Storage.get(name, fallback);
        } catch (e2) {}
        return fallback;
    }

    function storageSet(name, value) {
        try {
            if (typeof Lampa !== 'undefined' && Lampa.Storage && Lampa.Storage.set) {
                Lampa.Storage.set(name, value);
                return;
            }
        } catch (e) {}
        try {
            if (window.Storage && window.Storage.set) window.Storage.set(name, value);
        } catch (e2) {}
    }

    function normalizeEnabled(value) {
        return value === true || value === 'true' || value === 1 || value === '1';
    }

    function normalizePerformanceMode(value) {
        value = String(value || 'full');
        if (value === 'balanced' || value === 'light') return value;
        return 'full';
    }

    function normalizeQualityMode(value) {
        value = String(value || 'color');
        if (value === 'show' || value === 'off') return value;
        return 'color';
    }

    function normalizeRatingsMode(value) {
        value = String(value || 'color');
        if (value === 'color' || value === 'off') return value;
        return 'show';
    }

    function normalizeThemeColor(value) {
        value = String(value || 'emerald');
        if (value === 'blue' || value === 'purple' || value === 'red' || value === 'orange') return value;
        return 'emerald';
    }

    function themePalette(name) {
        var palettes = {
            emerald: {
                a: '82,255,179',
                b: '105,183,226',
                text: '120,255,145',
                ring: '93,244,190'
            },
            blue: {
                a: '74,163,255',
                b: '76,218,255',
                text: '116,210,255',
                ring: '99,179,255'
            },
            purple: {
                a: '174,120,255',
                b: '104,158,255',
                text: '197,155,255',
                ring: '178,132,255'
            },
            red: {
                a: '255,92,118',
                b: '255,136,86',
                text: '255,126,144',
                ring: '255,95,120'
            },
            orange: {
                a: '255,166,82',
                b: '255,215,105',
                text: '255,188,104',
                ring: '255,169,82'
            }
        };
        return palettes[normalizeThemeColor(name)] || palettes.emerald;
    }

    function injectColorStyle() {
        var p = themePalette(themeColor);
        var css = [
            ":root {",
            "    --themex-accent-a: " + p.a + ";",
            "    --themex-accent-b: " + p.b + ";",
            "    --themex-accent-text: " + p.text + ";",
            "    --themex-accent-ring: " + p.ring + ";",
            "}",
            "",
            ".items-line__more.focus, .items-line__more.hover, .items-line__more.traverse,",
            ".register.register--line.focus, .register.register--line.hover, .register.register--line.traverse,",
            ".wrap__left .menu__item.focus, .wrap__left .menu__item.hover, .wrap__left .menu__item.traverse,",
            ".settings-folder.focus, .settings-param.focus, .selectbox-item.focus,",
            ".modal__button.focus, .simple-button.focus, .full-start__button.focus,",
            ".full-descr__tag.focus, .full-person.focus, .full-review.focus, .full-review-add.focus {",
            "    background: linear-gradient(100deg, rgba(var(--themex-accent-a),.98), rgba(var(--themex-accent-b),.96)) !important;",
            "}",
            "",
            ".card.beauty-card-final .beauty-star,",
            ".card.beauty-card-final .beauty-episode,",
            ".register.register--line.focus .register__counter,",
            ".wrap__left .menu__item.focus .menu__ico,",
            ".wrap__left .menu__item.hover .menu__ico,",
            ".wrap__left .menu__item.traverse .menu__ico,",
            ".bookmarks-folder__num, .temav-tt-code {",
            "    color: rgb(var(--themex-accent-text)) !important;",
            "}",
            "",
            ".card.beauty-card-final .beauty-episode, .bookmarks-folder__num, .temav-tt-code {",
            "    border-color: rgba(var(--themex-accent-ring),.36) !important;",
            "    background-color: rgba(var(--themex-accent-a),.12) !important;",
            "}",
            "",
            ".card.beauty-card-final.focus .card__view,",
            ".card.beauty-card-final.hover .card__view,",
            ".card.beauty-card-final.selector.focus .card__view,",
            ".card.beauty-card-final.selector.hover .card__view,",
            ".card.beauty-card-final.selector.traverse .card__view,",
            ".card-more.focus .card-more__box, .card-more.hover .card-more__box, .card-more.traverse .card-more__box {",
            "    box-shadow: 0 .88em 1.75em rgba(0,0,0,.34), 0 0 0 .06em rgba(var(--themex-accent-ring),.24), 0 0 1.12em rgba(var(--themex-accent-b),.18) !important;",
            "}",
            "",
            ".card-more.focus .card-more__box::after, .card-more.hover .card-more__box::after, .card-more.traverse .card-more__box::after,",
            ".bookmarks-folder.focus .bookmarks-folder__inner::after, .bookmarks-folder.hover .bookmarks-folder__inner::after, .bookmarks-folder.traverse .bookmarks-folder__inner::after {",
            "    border-color: rgba(var(--themex-accent-ring),.38) !important;",
            "}",
            "",
            ".card-more__title::after {",
            "    color: rgba(var(--themex-accent-ring),.95) !important;",
            "}",
            "",
            ".wrap__left .temav-menu-head {",
            "    background: radial-gradient(circle at 18% 0%, rgba(var(--themex-accent-a),.10), rgba(255,255,255,0) 48%), linear-gradient(90deg, rgba(255,255,255,.035), rgba(255,255,255,.015)) !important;",
            "}",
            "",
            ".wrap__left .temav-menu-clock::before {",
            "    background: linear-gradient(180deg, rgba(var(--themex-accent-a),.18), rgba(var(--themex-accent-b),.78), rgba(var(--themex-accent-a),.18)) !important;",
            "    box-shadow: 0 0 .55em rgba(var(--themex-accent-b),.22) !important;",
            "}",
            "",
            ".wrap__left .temav-menu-time {",
            "    text-shadow: 0 .08em .22em rgba(0,0,0,.58), 0 0 .55em rgba(var(--themex-accent-a),.16) !important;",
            "}",
            "",
            ".head {",
            "    background: linear-gradient(180deg, rgba(17,18,21,.94), rgba(var(--themex-accent-a),.08) 48%, rgba(17,18,21,0)) !important;",
            "}",
            "",
            ".head::after {",
            "    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(var(--themex-accent-ring),.28), rgba(255,255,255,0)) !important;",
            "}",
            "",
            ".head__action, .head__menu-icon, .head__backward {",
            "    box-shadow: inset 0 0 0 .055em rgba(var(--themex-accent-ring),.10) !important;",
            "}",
            "",
            ".head__action svg, .head__menu-icon svg, .head__backward svg {",
            "    color: rgba(var(--themex-accent-text),.92) !important;",
            "}",
            "",
            ".head__menu-icon::before {",
            "    background: radial-gradient(circle at 68% 34%, rgba(var(--themex-accent-b),.95), rgba(var(--themex-accent-b),0) 33%), radial-gradient(circle at 32% 68%, rgba(var(--themex-accent-a),.94), rgba(var(--themex-accent-a),0) 36%), linear-gradient(135deg, rgba(var(--themex-accent-b),.95), rgba(var(--themex-accent-a),.72)) !important;",
            "    box-shadow: 0 0 .5em rgba(var(--themex-accent-a),.22), inset 0 0 0 .1em rgba(0,0,0,.34) !important;",
            "}",
            "",
            ".head__action.focus, .head__action.hover {",
            "    background: linear-gradient(100deg, rgba(var(--themex-accent-a),.98), rgba(var(--themex-accent-b),.96)) !important;",
            "    box-shadow: 0 .22em .62em rgba(var(--themex-accent-a),.16), inset 0 0 0 .06em rgba(255,255,255,.20) !important;",
            "}",
            "",
            ".head__menu-icon.focus, .head__menu-icon.hover, .head__backward.focus, .head__backward.hover {",
            "    color: rgba(var(--themex-accent-ring),.98) !important;",
            "    box-shadow: inset 0 0 0 .055em rgba(var(--themex-accent-ring),.20) !important;",
            "}",
            "",
            ".head__menu-icon.focus, .head__menu-icon.hover {",
            "    box-shadow: inset 0 0 0 .08em rgba(var(--themex-accent-ring),.34), 0 0 .85em rgba(var(--themex-accent-a),.20) !important;",
            "}",
            "",
            ".head__menu-icon.focus::before, .head__menu-icon.hover::before {",
            "    box-shadow: 0 0 .8em rgba(var(--themex-accent-a),.34), inset 0 0 0 .1em rgba(0,0,0,.30) !important;",
            "}",
            "",
            ".head__time-now {",
            "    text-shadow: 0 .08em .35em rgba(0,0,0,.48), 0 0 .55em rgba(var(--themex-accent-a),.12) !important;",
            "}",
            "",
            ".card.beauty-card-final .beauty-rating.rating-excellent .beauty-star,",
            ".card.beauty-card-final .beauty-rating.rating-good .beauty-star,",
            ".card.beauty-card-final .beauty-rating.rating-average .beauty-star,",
            ".card.beauty-card-final .beauty-rating.rating-poor .beauty-star,",
            ".card.beauty-card-final .beauty-rating.rating-terrible .beauty-star {",
            "    color: currentColor !important;",
            "}"
        ].join('\n');
        upsertStyle(COLOR_STYLE_ID, css);
    }

    function applyColorState() {
        injectColorStyle();
    }

    function readThemeEnabled() {
        themeEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_MAIN, true));
        return themeEnabled;
    }

    function readMenuEnabled() {
        menuEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_MENU, true));
        return menuEnabled;
    }

    function readSettingsPanelEnabled() {
        settingsPanelEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_SETTINGS, true));
        return settingsPanelEnabled;
    }

    function readHeadEnabled() {
        headEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_HEAD, true));
        return headEnabled;
    }

    function readFullPageEnabled() {
        fullPageEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_FULL, true));
        return fullPageEnabled;
    }

    function readTimetableEnabled() {
        timetableEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_TIMETABLE, true));
        return timetableEnabled;
    }

    function readPerformanceMode() {
        performanceMode = normalizePerformanceMode(storageGet(SETTINGS_FIELD_PERFORMANCE, 'full'));
        return performanceMode;
    }

    function readHomeOptions() {
        qualityMode = normalizeQualityMode(storageGet(SETTINGS_FIELD_QUALITY, 'color'));
        ratingsMode = normalizeRatingsMode(storageGet(SETTINGS_FIELD_RATINGS, 'color'));
        showReleaseYear = normalizeEnabled(storageGet(SETTINGS_FIELD_RELEASE_YEAR, true));
        showEpisodeNumber = normalizeEnabled(storageGet(SETTINGS_FIELD_EPISODE_NUMBER, true));
        showGenres = normalizeEnabled(storageGet(SETTINGS_FIELD_GENRES, true));
        replacePoster = normalizeEnabled(storageGet(SETTINGS_FIELD_REPLACE_POSTER, true));
        themeColor = normalizeThemeColor(storageGet(SETTINGS_FIELD_THEME_COLOR, 'emerald'));
        logoTitlesEnabled = String(storageGet(SETTINGS_FIELD_LOGO_TITLES, '0')) !== '1';
    }

    function refreshHomeCards() {
        var cards = qa(document, '.beauty-card-final');
        var i;
        for (i = 0; i < cards.length; i++) dataSet(cards[i], 'beautySignature', '');
        scheduleScan(getActiveRoot());
    }

    function resetCard(card) {
        var view;
        var overlay;
        if (!card) return;

        removeClass(card, 'beauty-card-final');
        removeClass(card, 'beauty-bg-active');
        removeClass(card, 'beauty-img-ready');
        removeClass(card, 'beauty-has-episode');
        removeClass(card, 'beauty-has-quality');
        removeClass(card, 'beauty-has-genres');
        dataSet(card, 'beautyReady', '');
        dataSet(card, 'beautySignature', '');
        dataSet(card, 'beautyBg', '');

        view = q(card, '.card__view');
        if (view) {
            view.style.backgroundImage = '';
            overlay = q(view, '.beauty-overlay');
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }

        cleanupOldLayers(card);
    }

    function removeTheme() {
        var cards = qa(document, '.beauty-card-final');
        var overlays = qa(document, '.beauty-overlay');
        var i;

        removeStyle();
        for (i = 0; i < cards.length; i++) resetCard(cards[i]);
        for (i = 0; i < overlays.length; i++) {
            if (overlays[i].parentNode) overlays[i].parentNode.removeChild(overlays[i]);
        }
    }

    function applyThemeState() {
        if (themeEnabled) {
            injectStyle();
            scheduleScan(getActiveRoot());
        } else {
            removeTheme();
        }
    }

    function padTime(value) {
        return value < 10 ? '0' + value : value + '';
    }

    function menuDateText(date) {
        var months = [
            '\u042f\u043d\u0432\u0430\u0440\u044f',
            '\u0424\u0435\u0432\u0440\u0430\u043b\u044f',
            '\u041c\u0430\u0440\u0442\u0430',
            '\u0410\u043f\u0440\u0435\u043b\u044f',
            '\u041c\u0430\u044f',
            '\u0418\u044e\u043d\u044f',
            '\u0418\u044e\u043b\u044f',
            '\u0410\u0432\u0433\u0443\u0441\u0442\u0430',
            '\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044f',
            '\u041e\u043a\u0442\u044f\u0431\u0440\u044f',
            '\u041d\u043e\u044f\u0431\u0440\u044f',
            '\u0414\u0435\u043a\u0430\u0431\u0440\u044f'
        ];
        var days = [
            '\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435',
            '\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a',
            '\u0432\u0442\u043e\u0440\u043d\u0438\u043a',
            '\u0441\u0440\u0435\u0434\u0430',
            '\u0447\u0435\u0442\u0432\u0435\u0440\u0433',
            '\u043f\u044f\u0442\u043d\u0438\u0446\u0430',
            '\u0441\u0443\u0431\u0431\u043e\u0442\u0430'
        ];
        return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + '<br>' + days[date.getDay()];
    }

    function updateMenuClock() {
        var head = q(document, '.temav-menu-head');
        var timeEl;
        var dateEl;
        var now;
        if (!head) return;
        now = new Date();
        timeEl = q(head, '.temav-menu-time');
        dateEl = q(head, '.temav-menu-date');
        if (timeEl) timeEl.textContent = padTime(now.getHours()) + ':' + padTime(now.getMinutes());
        if (dateEl) dateEl.innerHTML = menuDateText(now);
    }

    function syncMenuShell() {
        var wrap;
        var menu;
        var head;
        if (!menuEnabled) return;
        wrap = q(document, '.wrap__left');
        menu = q(wrap || document, '.menu');
        if (!wrap || !menu) return;
        head = q(wrap, '.temav-menu-head');
        if (!head) {
            head = document.createElement('div');
            head.className = 'temav-menu-head';
            if (wrap.firstChild) wrap.insertBefore(head, wrap.firstChild);
            else wrap.appendChild(head);
        }
        if (!q(head, '.temav-menu-clock') || q(head, '.temav-menu-user')) {
            head.innerHTML = '<div class="temav-menu-clock"><div class="temav-menu-time"></div><div class="temav-menu-date"></div></div>';
        }
        updateMenuClock();
    }

    function removeMenuShell() {
        var heads = qa(document, '.temav-menu-head');
        var i;
        for (i = 0; i < heads.length; i++) {
            if (heads[i].parentNode) heads[i].parentNode.removeChild(heads[i]);
        }
    }

    function startMenuClock() {
        if (menuClockTimer) return;
        updateMenuClock();
        menuClockTimer = setInterval(updateMenuClock, 30000);
    }

    function stopMenuClock() {
        if (menuClockTimer) {
            clearInterval(menuClockTimer);
            menuClockTimer = null;
        }
    }

    function scheduleMenuShell() {
        if (!menuEnabled || menuShellTimer) return;
        menuShellTimer = setTimeout(function () {
            menuShellTimer = null;
            syncMenuShell();
        }, 120);
    }

    function applyMenuState() {
        if (menuEnabled) {
            injectMenuStyle();
            syncMenuShell();
            startMenuClock();
        } else {
            removeMenuStyle();
            removeMenuShell();
            stopMenuClock();
        }
    }

    function applySettingsPanelState() {
        if (settingsPanelEnabled) injectSettingsStyle();
        else removeSettingsStyle();
    }

    function applyHeadState() {
        if (headEnabled) injectHeadStyle();
        else removeHeadStyle();
    }

    function applyFullPageState() {
        if (fullPageEnabled) injectFullStyle();
        else removeFullStyle();
    }

    function applyTimetableState() {
        removeTimetableEnhancement();
        if (timetableEnabled) {
            injectTimetableStyle();
            scheduleTimetableBadges();
        }
        else removeTimetableStyle();
    }

    function applyPerformanceState() {
        var body = document.body;
        injectPerformanceStyle();
        if (!body) return;
        toggleBodyClass('temav-perf-full', performanceMode === 'full');
        toggleBodyClass('temav-perf-balanced', performanceMode === 'balanced');
        toggleBodyClass('temav-perf-light', performanceMode === 'light');
    }

    function scheduleSettingsPanelStyle() {
        if (!settingsPanelEnabled) return;
        setTimeout(function () {
            if (settingsPanelEnabled) injectSettingsStyle();
        }, 80);
    }

    function registerSettings() {
        var Settings;
        if (settingsRegistered || typeof Lampa === 'undefined') return;
        Settings = Lampa.SettingsApi || Lampa.Settings;
        if (!Settings || !Settings.addComponent || !Settings.addParam) return;

        try {
            Settings.addComponent({
                component: SETTINGS_COMPONENT,
                after: 'interface',
                icon: '<svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="7" width="29" height="25" rx="7" stroke="white" stroke-width="3"/><path d="M12 25L18 14L23 22L26 18L30 25H12Z" fill="white"/></svg>',
                name: 'ThemeX'
            });
        } catch (e) {}

        try {
            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_MAIN,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u0413\u043b\u0430\u0432\u043d\u0430\u044f',
                    description: '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 ThemeX \u043d\u0430 \u0433\u043b\u0430\u0432\u043d\u043e\u0439'
                },
                onChange: function () {
                    themeEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_MAIN, true));
                    readHomeOptions();
                    applyThemeState();
                    applyPerformanceState();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_THEME_COLOR,
                    type: 'select',
                    values: {
                        emerald: '\u0418\u0437\u0443\u043c\u0440\u0443\u0434\u043d\u044b\u0439',
                        blue: '\u0421\u0438\u043d\u0438\u0439',
                        purple: '\u0424\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439',
                        red: '\u041a\u0440\u0430\u0441\u043d\u044b\u0439',
                        orange: '\u041e\u0440\u0430\u043d\u0436\u0435\u0432\u044b\u0439'
                    },
                    default: 'emerald'
                },
                field: {
                    name: '\u0426\u0432\u0435\u0442 \u0442\u0435\u043c\u044b'
                },
                onChange: function () {
                    readHomeOptions();
                    applyColorState();
                    refreshHomeCards();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_MENU,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u041b\u0435\u0432\u0430\u044f \u043f\u0430\u043d\u0435\u043b\u044c',
                    description: '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0441\u0442\u0438\u043b\u044c ThemeX \u0434\u043b\u044f \u0431\u043e\u043a\u043e\u0432\u043e\u0433\u043e \u043c\u0435\u043d\u044e'
                },
                onChange: function () {
                    menuEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_MENU, true));
                    applyMenuState();
                    applyPerformanceState();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_QUALITY,
                    type: 'select',
                    values: {
                        color: '\u0421 \u0446\u0432\u0435\u0442\u0430\u043c\u0438',
                        show: '\u0412\u043a\u043b\u044e\u0447\u0435\u043d\u043e',
                        off: '\u041e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u043e'
                    },
                    default: 'color'
                },
                field: {
                    name: '\u041a\u0430\u0447\u0435\u0441\u0442\u0432\u043e'
                },
                onChange: function () {
                    readHomeOptions();
                    refreshHomeCards();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_RATINGS,
                    type: 'select',
                    values: {
                        color: '\u0421 \u0446\u0432\u0435\u0442\u0430\u043c\u0438',
                        show: '\u0412\u043a\u043b\u044e\u0447\u0435\u043d\u043e',
                        off: '\u041e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u043e'
                    },
                    default: 'color'
                },
                field: {
                    name: '\u0420\u0435\u0439\u0442\u0438\u043d\u0433'
                },
                onChange: function () {
                    readHomeOptions();
                    refreshHomeCards();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_EPISODE_NUMBER,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u043d\u043e\u043c\u0435\u0440 \u0441\u0435\u0440\u0438\u0438'
                },
                onChange: function () {
                    readHomeOptions();
                    refreshHomeCards();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_REPLACE_POSTER,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u041c\u0438\u043d\u0438\u043c\u0430\u043b\u0438\u0441\u0442\u0438\u0447\u043d\u044b\u0439 \u043f\u043e\u0441\u0442\u0435\u0440'
                },
                onChange: function () {
                    readHomeOptions();
                    refreshHomeCards();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_GENRES,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0436\u0430\u043d\u0440\u044b'
                },
                onChange: function () {
                    readHomeOptions();
                    refreshHomeCards();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_RELEASE_YEAR,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0433\u043e\u0434 \u0432\u044b\u043f\u0443\u0441\u043a\u0430'
                },
                onChange: function () {
                    readHomeOptions();
                    refreshHomeCards();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_LOGO_TITLES,
                    type: 'select',
                    values: {
                        0: '\u041e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c',
                        1: '\u0421\u043a\u0440\u044b\u0442\u044c'
                    },
                    default: '0'
                },
                field: {
                    name: '\u041b\u043e\u0433\u043e\u0442\u0438\u043f\u044b \u0432\u043c\u0435\u0441\u0442\u043e \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0439',
                    description: '\u041e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0435\u0442 \u043b\u043e\u0433\u043e\u0442\u0438\u043f\u044b \u0444\u0438\u043b\u044c\u043c\u043e\u0432 \u0438 \u0441\u0435\u0440\u0438\u0430\u043b\u043e\u0432 \u0432\u043c\u0435\u0441\u0442\u043e \u0442\u0435\u043a\u0441\u0442\u0430'
                },
                onChange: function () {
                    readHomeOptions();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_SETTINGS,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u041f\u0440\u0430\u0432\u0430\u044f \u043f\u0430\u043d\u0435\u043b\u044c',
                    description: '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0441\u0442\u0438\u043b\u044c ThemeX \u0434\u043b\u044f \u043f\u0430\u043d\u0435\u043b\u0438 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043a'
                },
                onChange: function () {
                    settingsPanelEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_SETTINGS, true));
                    applySettingsPanelState();
                    applyPerformanceState();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_HEAD,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u0428\u0430\u043f\u043a\u0430',
                    description: '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0441\u0442\u0438\u043b\u044c ThemeX \u0434\u043b\u044f \u0432\u0435\u0440\u0445\u043d\u0435\u0439 \u043f\u0430\u043d\u0435\u043b\u0438'
                },
                onChange: function () {
                    headEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_HEAD, true));
                    applyHeadState();
                    applyPerformanceState();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_FULL,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u0424\u0438\u043b\u044c\u043c/\u0441\u0435\u0440\u0438\u0430\u043b',
                    description: '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0441\u0442\u0438\u043b\u044c ThemeX \u0434\u043b\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0444\u0438\u043b\u044c\u043c\u0430 \u0438 \u0441\u0435\u0440\u0438\u0430\u043b\u0430'
                },
                onChange: function () {
                    fullPageEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_FULL, true));
                    applyFullPageState();
                    applyPerformanceState();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_TIMETABLE,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: '\u0420\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435',
                    description: '\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0441\u0442\u0438\u043b\u044c ThemeX \u0434\u043b\u044f \u0440\u0430\u0437\u0434\u0435\u043b\u0430 \u0420\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435'
                },
                onChange: function () {
                    timetableEnabled = normalizeEnabled(storageGet(SETTINGS_FIELD_TIMETABLE, true));
                    applyTimetableState();
                    applyPerformanceState();
                }
            });

            Settings.addParam({
                component: SETTINGS_COMPONENT,
                param: {
                    name: SETTINGS_FIELD_PERFORMANCE,
                    type: 'select',
                    values: {
                        full: '\u041f\u043e\u043b\u043d\u0430\u044f',
                        balanced: '\u0421\u0431\u0430\u043b\u0430\u043d\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u0430\u044f',
                        light: '\u041b\u0451\u0433\u043a\u0430\u044f'
                    },
                    default: 'full'
                },
                field: {
                    name: '\u041f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c',
                    description: '\u0423\u043c\u0435\u043d\u044c\u0448\u0430\u0435\u0442 \u0442\u044f\u0436\u0451\u043b\u044b\u0435 \u0442\u0435\u043d\u0438, blur \u0438 \u0444\u0438\u043b\u044c\u0442\u0440\u044b \u0431\u0435\u0437 \u043e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f \u0441\u0442\u0438\u043b\u044f ThemeX'
                },
                onChange: function () {
                    performanceMode = normalizePerformanceMode(storageGet(SETTINGS_FIELD_PERFORMANCE, 'full'));
                    applyPerformanceState();
                }
            });
            settingsRegistered = true;
        } catch (e2) {}
    }

    function q(root, selector) {
        try { return root && root.querySelector ? root.querySelector(selector) : null; } catch (e) { return null; }
    }

    function qa(root, selector) {
        var out = [];
        var nodes;
        try {
            nodes = root && root.querySelectorAll ? root.querySelectorAll(selector) : [];
            for (var i = 0; i < nodes.length; i++) out.push(nodes[i]);
        } catch (e) {}
        return out;
    }

    function arrayHas(list, item) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === item) return true;
        }
        return false;
    }

    function trim(value) {
        return String(value || '').replace(/^\s+|\s+$/g, '');
    }

    function text(el) {
        return trim(el && (el.textContent || el.innerText));
    }

    function hasClass(el, name) {
        if (!el) return false;
        if (el.classList) return el.classList.contains(name);
        return new RegExp('(^|\\s)' + name + '(\\s|$)').test(el.className || '');
    }

    function addClass(el, name) {
        if (!el || hasClass(el, name)) return;
        if (el.classList) el.classList.add(name);
        else el.className = (el.className ? el.className + ' ' : '') + name;
    }

    function removeClass(el, name) {
        if (!el) return;
        if (el.classList) el.classList.remove(name);
        else el.className = trim(String(el.className || '').replace(new RegExp('(^|\\s)' + name + '(?=\\s|$)', 'g'), ' '));
    }

    function closestByClass(el, name) {
        while (el && el !== document) {
            if (hasClass(el, name)) return el;
            el = el.parentNode;
        }
        return null;
    }

    function dataName(name) {
        return 'data-' + String(name).replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    function dataGet(el, name) {
        if (!el) return '';
        if (el.dataset && el.dataset[name] !== undefined) return el.dataset[name];
        return el.getAttribute ? (el.getAttribute(dataName(name)) || '') : '';
    }

    function dataSet(el, name, value) {
        if (!el) return;
        if (el.dataset) el.dataset[name] = value;
        else if (el.setAttribute) el.setAttribute(dataName(name), value);
    }

    function dataRemove(el, name) {
        if (!el) return;
        if (el.dataset) {
            try { delete el.dataset[name]; } catch (e) { el.dataset[name] = ''; }
        } else if (el.removeAttribute) {
            el.removeAttribute(dataName(name));
        }
    }

    function safeJson(value) {
        try { return JSON.parse(value); } catch (e) { return null; }
    }

    function contains(el) {
        if (!el || !document.body) return false;
        if (document.body.contains) return document.body.contains(el);
        while (el) {
            if (el === document.body) return true;
            el = el.parentNode;
        }
        return false;
    }

    function validYear(value) {
        var match = String(value || '').match(/\b(19\d{2}|20\d{2}|21\d{2})\b/);
        return match ? match[1] : '';
    }

    var genreMap = {
        movie: {
            28: '#{filter_genre_ac}', 12: '#{filter_genre_ad}', 16: '#{filter_genre_mv}',
            35: '#{filter_genre_cm}', 80: '#{filter_genre_cr}', 99: '#{filter_genre_dc}',
            18: '#{filter_genre_dr}', 10751: '#{filter_genre_fm}', 14: '#{filter_genre_fe}',
            36: '#{filter_genre_hi}', 27: '#{filter_genre_ho}', 10402: '#{filter_genre_mu}',
            9648: '#{filter_genre_de}', 10749: '#{filter_genre_md}', 878: '#{filter_genre_fa}',
            10770: '#{filter_genre_tv}', 53: '#{filter_genre_tr}', 10752: '#{filter_genre_mi}',
            37: '#{filter_genre_ve}'
        },
        tv: {
            10759: '#{filter_genre_aa}', 16: '#{filter_genre_mv}', 35: '#{filter_genre_cm}',
            80: '#{filter_genre_cr}', 99: '#{filter_genre_dc}', 18: '#{filter_genre_dr}',
            10751: '#{filter_genre_fm}', 10762: '#{filter_genre_ch}', 9648: '#{filter_genre_de}',
            10763: '#{filter_genre_nw}', 10764: '#{filter_genre_rs}', 10765: '#{filter_genre_hf}',
            10766: '#{filter_genre_op}', 10767: '#{filter_genre_tc}', 10768: '#{filter_genre_mp}',
            37: '#{filter_genre_ve}'
        }
    };

    function translateGenre(value) {
        try {
            if (window.Lampa && Lampa.Lang && Lampa.Lang.translate) return Lampa.Utils && Lampa.Utils.capitalizeFirstLetter ? Lampa.Utils.capitalizeFirstLetter(Lampa.Lang.translate(value)) : Lampa.Lang.translate(value);
        } catch (e) {}
        return value;
    }

    function getGenres(data, card) {
        var type = isTv(card, data) ? 'tv' : 'movie';
        var ids = data && data.genre_ids;
        var names = [];
        var i;
        var name;
        if (data && data.genres && data.genres.length) {
            for (i = 0; i < data.genres.length && names.length < 2; i++) {
                name = data.genres[i] && (data.genres[i].name || data.genres[i].title);
                if (name) names.push(name);
            }
        }
        if (!names.length && ids && ids.length) {
            for (i = 0; i < ids.length && names.length < 2; i++) {
                name = genreMap[type] && genreMap[type][ids[i]];
                if (name) names.push(translateGenre(name));
            }
        }
        return names.join(', ');
    }

    function getCardData(card) {
        var data = card && card.card_data;
        if (!data && dataGet(card, 'movie')) data = safeJson(dataGet(card, 'movie'));
        if (!data && dataGet(card, 'card')) data = safeJson(dataGet(card, 'card'));
        if (!data && dataGet(card, 'item')) data = safeJson(dataGet(card, 'item'));
        if (!data && typeof window.$ !== 'undefined') {
            try { data = window.$(card).data('movie') || window.$(card).data('card') || window.$(card).data('item'); } catch (e) {}
        }
        if (!data) data = {};
        return data;
    }

    function getTitle(card, data) {
        return trim(data.title || data.name || data.original_title || data.original_name || data.Title || text(q(card, '.card__title')) || text(q(card, '.card__name')) || text(q(card, '.card__text')));
    }

    function getYear(card, data) {
        return validYear(data.release_year || data.year || data.release_date || data.first_air_date || data.birthday || text(q(card, '.card__age')) || text(q(card, '.card__year')));
    }

    function getRating(data, card) {
        var value = data.cub_hundred_fire || data.cub_hundred_rating || data.vote_average || data.rating || data.imdb_rating || data.kp_rating || text(q(card, '.card__vote'));
        var number = parseFloat(String(value || '').replace(',', '.'));
        if (isFinite(number) && number > 0) return number >= 10 ? '10' : number.toFixed(1);
        return '-';
    }

    function ratingClass(value) {
        var number = parseFloat(String(value || '').replace(',', '.'));
        if (!isFinite(number)) return '';
        if (number >= 8 && number <= 10) return 'rating-excellent';
        if (number >= 6.5) return 'rating-good';
        if (number >= 5) return 'rating-average';
        if (number >= 3) return 'rating-poor';
        if (number >= 0) return 'rating-terrible';
        return '';
    }

    function isTv(card, data) {
        if (hasClass(card, 'card--tv')) return true;
        if (!data) return false;
        if (data.media_type === 'tv' || data.method === 'tv' || data.card_type === 'tv') return true;
        if (data.original_name || data.first_air_date || data.number_of_seasons) return true;
        return !!(data.name && !data.title && !data.release_date && !data.known_for_department);
    }

    function pad2(value) {
        value = parseInt(value, 10);
        return value > 0 && value < 10 ? '0' + value : String(value || '');
    }

    function firstNumber() {
        var i;
        var value;
        for (i = 0; i < arguments.length; i++) {
            value = arguments[i];
            if (value !== undefined && value !== null && value !== '') {
                value = parseInt(value, 10);
                if (isFinite(value) && value > 0) return value;
            }
        }
        return 0;
    }

    function readEpisodeObject(source) {
        if (!source) return null;
        return {
            season: firstNumber(source.season, source.season_number, source.number_of_season, source.seasonNumber, source.s),
            episode: firstNumber(source.episode, source.episode_number, source.number_of_episode, source.episodeNumber, source.e)
        };
    }

    function parseEpisodeText(value) {
        var textValue = trim(value);
        var match;
        if (!textValue) return null;

        match = textValue.match(/\bS\s*0*(\d{1,2})\s*E\s*0*(\d{1,3})\b/i);
        if (!match) match = textValue.match(/\b0*(\d{1,2})\s*[xх]\s*0*(\d{1,3})\b/i);
        if (!match) match = textValue.match(/\bseason\s+0*(\d{1,2})\s+episode\s+0*(\d{1,3})\b/i);
        if (!match) match = textValue.match(/\bсезон\s+0*(\d{1,2})\s+сер(?:ия|ии|і[яї])\s+0*(\d{1,3})\b/i);
        if (match) return { season: firstNumber(match[1]), episode: firstNumber(match[2]) };

        match = textValue.match(/\bS\s*0*(\d{1,2})\b/i) || textValue.match(/\bseason\s+0*(\d{1,2})\b/i) || textValue.match(/\bсезон\s+0*(\d{1,2})\b/i);
        if (match) return { season: firstNumber(match[1]), episode: 0 };

        match = textValue.match(/\bE\s*0*(\d{1,3})\b/i) || textValue.match(/\bepisode\s+0*(\d{1,3})\b/i) || textValue.match(/\bсер(?:ия|ии|і[яї])\s+0*(\d{1,3})\b/i);
        if (match) return { season: 0, episode: firstNumber(match[1]) };

        return null;
    }

    function storedEpisode(data) {
        var store;
        var key;
        var item;
        try {
            if (!window.Lampa || !Lampa.Storage || !Lampa.Utils || !Lampa.Utils.hash) return null;
            store = Lampa.Storage.get('online_watched_last', '{}');
            if (!store) return null;
            if (typeof store === 'string') store = safeJson(store);
            key = Lampa.Utils.hash(data.original_title || data.original_name || data.title || data.name || '');
            item = key && store[key];
            return item ? { season: firstNumber(item.season), episode: firstNumber(item.episode) } : null;
        } catch (e) {
            return null;
        }
    }

    function getEpisode(data, card) {
        if (!isTv(card, data)) return '';
        var direct = readEpisodeObject(data);
        var season = direct ? direct.season : 0;
        var episode = direct ? direct.episode : 0;
        var nested;
        var textEpisode;

        if (!season || !episode) {
            nested = readEpisodeObject(data.last_episode_to_air) || readEpisodeObject(data.next_episode_to_air) || readEpisodeObject(data.episode_data) || readEpisodeObject(data.episode_info);
            if (nested) {
                if (!season) season = nested.season;
                if (!episode) episode = nested.episode;
            }
        }

        if ((!season || !episode) && data.viewed && data.viewed.ep) {
            nested = readEpisodeObject(data.viewed.ep);
            if (nested) {
                if (!season) season = nested.season;
                if (!episode) episode = nested.episode;
            }
        }

        if ((!season || !episode) && data.ep) {
            nested = readEpisodeObject(data.ep);
            if (nested) {
                if (!season) season = nested.season;
                if (!episode) episode = nested.episode;
            }
        }

        if ((!season || !episode) && data.episodes && typeof data.episodes === 'object') {
            nested = readEpisodeObject(data.episodes) || readEpisodeObject(data.episodes.next) || readEpisodeObject(data.episodes.last);
            if (!nested && data.episodes.episodes && data.episodes.episodes.length) nested = readEpisodeObject(data.episodes.episodes[data.episodes.episodes.length - 1]);
            if (!nested && data.episodes.episodes_original && data.episodes.episodes_original.length) nested = readEpisodeObject(data.episodes.episodes_original[data.episodes.episodes_original.length - 1]);
            if (nested) {
                if (!season) season = nested.season || firstNumber(data.episodes.seasons_count);
                if (!episode) episode = nested.episode;
            }
        }

        if (!season || !episode) {
            nested = storedEpisode(data);
            if (nested) {
                if (!season) season = nested.season;
                if (!episode) episode = nested.episode;
            }
        }

        if (!season || !episode) {
            textEpisode = parseEpisodeText(data.episode_title || data.subtitle || data.name || data.title || text(q(card, '.card-watched')) || text(q(card, '.card__text')));
            if (textEpisode) {
                if (!season) season = textEpisode.season;
                if (!episode) episode = textEpisode.episode;
            }
        }

        if (season && episode) return 'S' + pad2(season) + 'E' + pad2(episode);
        if (season) return 'S' + pad2(season);
        if (episode) return 'E' + pad2(episode);
        return '';
    }

    function hasEpisodeNumber(value) {
        return !!(value && /E\d+/i.test(value));
    }

    function episodeCacheKey(data) {
        if (!data || !data.id) return '';
        return 'tv:' + data.id;
    }

    function mergeEpisodeDetails(data, details) {
        if (!data || !details) return data || {};
        if (details.last_episode_to_air) data.last_episode_to_air = details.last_episode_to_air;
        if (details.next_episode_to_air) data.next_episode_to_air = details.next_episode_to_air;
        if (details.number_of_seasons) data.number_of_seasons = details.number_of_seasons;
        if (details.seasons) data.seasons = details.seasons;
        return data;
    }

    function refreshEpisodeOverlay(card) {
        var data;
        var episode;
        var overlay;
        var episodeEl;
        if (!themeEnabled) return;
        if (!card || !contains(card)) return;
        if (!showEpisodeNumber) {
            removeClass(card, 'beauty-has-episode');
            return;
        }
        data = getCardData(card);
        episode = getEpisode(data, card);
        overlay = q(card, '.beauty-overlay');
        episodeEl = overlay && q(overlay, '.beauty-episode');
        if (episodeEl) episodeEl.textContent = episode || '';
        if (episode) addClass(card, 'beauty-has-episode');
        else removeClass(card, 'beauty-has-episode');
        dataSet(card, 'beautySignature', '');
    }

    function runEpisodeQueue() {
        var item;
        var api;
        if (episodeDetailsActive >= episodeDetailsLimit || !episodeDetailsQueue.length) return;
        item = episodeDetailsQueue.shift();
        episodeDetailsActive++;

        api = window.Lampa && Lampa.Api && Lampa.Api.sources && Lampa.Api.sources.tmdb;
        if (api && api.get) {
            api.get('tv/' + item.id, {}, function (json) {
                episodeDetailsActive--;
                episodeDetailsCache[item.key] = json || {};
                episodeDetailsPending[item.key] = false;
                item.done(episodeDetailsCache[item.key]);
                runEpisodeQueue();
            }, function () {
                episodeDetailsActive--;
                episodeDetailsCache[item.key] = {};
                episodeDetailsPending[item.key] = false;
                runEpisodeQueue();
            }, { life: 60 * 24 * 3 });
        } else {
            episodeDetailsActive--;
            episodeDetailsPending[item.key] = false;
            runEpisodeQueue();
        }
    }

    function requestEpisodeDetails(card, data, currentEpisode) {
        var key;
        var cached;
        if (!themeEnabled) return;
        if (!showEpisodeNumber) return;
        if (!isTv(card, data) || !data || !data.id || hasEpisodeNumber(currentEpisode)) return;
        key = episodeCacheKey(data);
        if (!key) return;

        cached = episodeDetailsCache[key];
        if (cached !== undefined) {
            mergeEpisodeDetails(data, cached);
            if (hasEpisodeNumber(getEpisode(data, card))) refreshEpisodeOverlay(card);
            return;
        }

        if (episodeDetailsPending[key]) return;
        episodeDetailsPending[key] = true;
        episodeDetailsQueue.push({
            id: data.id,
            key: key,
            done: function (details) {
                mergeEpisodeDetails(data, details);
                refreshEpisodeOverlay(card);
            }
        });
        runEpisodeQueue();
    }

    function qualityStorage() {
        var data;
        if (qualityCache) return qualityCache;
        data = storageGet('temav_quality_cache', {});
        if (!data || typeof data !== 'object') data = {};
        qualityCache = data;
        return qualityCache;
    }

    function saveQualityStorage() {
        storageSet('temav_quality_cache', qualityStorage());
    }

    function qualityKey(data, card) {
        if (data && data.id) return (isTv(card, data) ? 'tv' : 'movie') + '_' + data.id;
        return '';
    }

    function normalizeQuality(data) {
        var quality;
        if (!data || !data.quality) return '';
        quality = data.uhd ? '4K' : 'HD';
        if (/(^|,\s*)ts(\s*,|$)/i.test(data.quality)) quality = 'TS';
        return quality;
    }

    function qualityUrl(data, card) {
        var api = qualityApi.sources[0];
        var apn = qualityApi.apn[0] || '';
        var url = (apn + api.url).replace(/\s+/g, '') + '?token=' + api.token;
        if (data.kinopoisk_id) url += '&kp=' + encodeURIComponent(data.kinopoisk_id);
        else if (data.imdb_id) url += '&imdb=' + encodeURIComponent(data.imdb_id);
        else if (data.id) url += '&tmdb=' + encodeURIComponent(data.id);
        if (isTv(card, data)) url += '&method=tv';
        return url;
    }

    function runQualityQueue() {
        var item;
        if (qualityActive >= qualityLimit || !qualityQueue.length) return;
        item = qualityQueue.shift();
        qualityActive++;

        if (window.Lampa && Lampa.Network && Lampa.Network.silent) {
            Lampa.Network.silent(item.url, function (json) {
                var quality = json && json.status === 'success' ? normalizeQuality(json.data) : '';
                qualityActive--;
                qualityPending[item.key] = false;
                if (quality) {
                    qualityStorage()[item.key] = { value: quality, timestamp: Date.now() };
                    saveQualityStorage();
                }
                item.done(quality);
                runQualityQueue();
            }, function () {
                qualityActive--;
                qualityPending[item.key] = false;
                item.done('');
                runQualityQueue();
            });
        } else {
            qualityActive--;
            qualityPending[item.key] = false;
            runQualityQueue();
        }
    }

    function requestQuality(card, data, done) {
        var key;
        var cache;
        var item;
        if (qualityMode === 'off' || !data || !data.id) return;
        key = qualityKey(data, card);
        if (!key) return;
        cache = qualityStorage()[key];
        if (cache && cache.value && Date.now() - (cache.timestamp || 0) < 86400000) {
            done(cache.value);
            return;
        }
        if (qualityPending[key]) return;
        qualityPending[key] = true;
        item = {
            key: key,
            url: qualityUrl(data, card),
            done: done
        };
        qualityQueue.push(item);
        runQualityQueue();
    }

    function applyQuality(card, quality) {
        var el = q(card, '.beauty-quality');
        if (!el) return;
        if (!quality) {
            el.textContent = '';
            removeClass(card, 'beauty-has-quality');
            return;
        }
        el.className = 'beauty-quality beauty-quality--' + String(quality).toLowerCase();
        if (qualityMode !== 'color') addClass(el, 'beauty-quality--no-color');
        el.textContent = quality;
        addClass(card, 'beauty-has-quality');
    }

    function renderLogoTitle(event) {
        var data;
        var type;
        var url;
        var activity;
        if (!logoTitlesEnabled || !event || event.type !== 'complite') return;
        data = event.data && event.data.movie;
        if (!data || !data.id || !window.Lampa || !Lampa.TMDB || !Lampa.TMDB.api || !Lampa.TMDB.key || !Lampa.TMDB.image) return;
        type = data.name || data.original_name || data.first_air_date ? 'tv' : 'movie';
        url = Lampa.TMDB.api(type + '/' + data.id + '/images?api_key=' + Lampa.TMDB.key() + '&language=' + storageGet('language', ''));

        function apply(json) {
            var logo = json && json.logos && json.logos[0] && json.logos[0].file_path;
            var root;
            var title;
            var img;
            if (!logo || !event.object || !event.object.activity || !event.object.activity.render) return;
            try { activity = event.object.activity.render(); } catch (e) { activity = null; }
            root = activity && activity.find ? activity.find('.full-start-new__title') : null;
            title = root && root.length !== undefined ? root[0] : root;
            if (!title) title = q(document, '.full-start-new__title');
            if (!title) return;
            img = document.createElement('img');
            img.className = 'themex-title-logo';
            img.src = Lampa.TMDB.image('/t/p/w300' + logo.replace('.svg', '.png'));
            img.alt = data.title || data.name || '';
            title.innerHTML = '';
            title.appendChild(img);
        }

        if (window.$ && $.get) {
            $.get(url, apply);
        } else if (Lampa.Network && Lampa.Network.silent) {
            Lampa.Network.silent(url, apply);
        }
    }

    function apiImg(path, size) {
        if (!path) return '';
        if (/^(https?:)?\/\//i.test(path) || path.indexOf('./') === 0 || path.indexOf('/') !== 0) return path;
        try { if (window.Lampa && Lampa.Api && Lampa.Api.img) return Lampa.Api.img(path, size); } catch (e) {}
        try { if (window.Api && window.Api.img) return window.Api.img(path, size); } catch (e) {}
        return 'https://image.tmdb.org/t/p/' + (size || 'w500') + path;
    }

    function cssUrl(url) {
        return 'url("' + String(url || '').replace(/["\\]/g, '\\$&') + '")';
    }

    function formatDateYMD(date) {
        return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
    }

    function getTimetableCardsMap() {
        var cards = [];
        var map = {};
        var i;
        try {
            if (window.Lampa && Lampa.Account && Lampa.Account.Permit && Lampa.Account.Permit.sync && Lampa.Account.Bookmarks && Lampa.Account.Bookmarks.all) cards = Lampa.Account.Bookmarks.all() || [];
            else if (window.Lampa && Lampa.Favorite && Lampa.Favorite.full) cards = (Lampa.Favorite.full() || {}).card || [];
        } catch (e) {}
        for (i = 0; i < cards.length; i++) {
            if (cards[i] && cards[i].id !== undefined) map[String(cards[i].id)] = cards[i];
        }
        return map;
    }

    function getTimetableEpisodes(item) {
        var result = [];
        var episodes = (item && item.episodes) || [];
        var i;
        for (i = 0; i < episodes.length; i++) result.push(episodes[i]);
        if (item && item.next) {
            for (i = 0; i < result.length; i++) {
                if (result[i] && result[i].air_date === item.next.air_date) return result;
            }
            result.push(item.next);
        }
        return result;
    }

    function buildTimetableEntryMap(table, cards) {
        var map = {};
        var i;
        var j;
        var item;
        var card;
        var episodes;
        var ep;
        for (i = 0; i < table.length; i++) {
            item = table[i];
            card = item && cards[String(item.id)];
            if (!card) continue;
            episodes = getTimetableEpisodes(item);
            for (j = 0; j < episodes.length; j++) {
                ep = episodes[j];
                if (!ep || !ep.air_date) continue;
                if (!map[ep.air_date]) map[ep.air_date] = [];
                map[ep.air_date].push(ep);
            }
        }
        return map;
    }

    function getTimetableRows(item) {
        var body = q(item, '.timetable__body');
        var out = [];
        var child;
        var i;
        if (!body || !body.children) return out;
        for (i = 0; i < body.children.length; i++) {
            child = body.children[i];
            if (!hasClass(child, 'timetable__preview')) out.push(child);
        }
        return out;
    }

    function addTimetableEpisodeBadges(row, ep) {
        var wrap;
        var code;
        var season;
        var episode;
        if (!row || !ep || q(row, '.temav-tt-badges')) return;
        season = firstNumber(ep.season_number, ep.season);
        episode = firstNumber(ep.episode_number, ep.episode);
        if (!season && !episode) return;
        wrap = document.createElement('div');
        wrap.className = 'temav-tt-badges';
        if (season) {
            code = document.createElement('span');
            code.className = 'temav-tt-code';
            code.textContent = 'S - ' + season;
            wrap.appendChild(code);
        }
        if (episode) {
            code = document.createElement('span');
            code.className = 'temav-tt-code';
            code.textContent = 'E - ' + episode;
            wrap.appendChild(code);
        }
        row.appendChild(wrap);
    }

    function enhanceTimetableBadges(root) {
        var tables;
        var tableData = [];
        var cards;
        var now;
        var t;
        var i;
        var j;
        var items;
        var rows;
        var date;
        var entryMap;
        var entries;
        if (!timetableEnabled || !root) return;
        tables = hasClass(root, 'timetable') ? [root] : qa(root, '.timetable');
        if (!tables.length) return;
        try { tableData = window.Lampa && Lampa.TimeTable && Lampa.TimeTable.all ? (Lampa.TimeTable.all() || []) : []; } catch (e) {}
        if (!tableData.length) return;
        cards = getTimetableCardsMap();
        entryMap = buildTimetableEntryMap(tableData, cards);
        for (t = 0; t < tables.length; t++) {
            items = qa(tables[t], '.timetable__item');
            if (!items.length || dataGet(tables[t], 'temavTtBadges') === '1') continue;
            now = new Date();
            now.setHours(0, 0, 0, 0);
            for (i = 0; i < items.length; i++) {
                date = new Date(now.getTime());
                date.setDate(now.getDate() + i);
                entries = entryMap[formatDateYMD(date)] || [];
                if (!entries.length) continue;
                rows = getTimetableRows(items[i]);
                for (j = 0; j < rows.length && j < entries.length && j < 3; j++) addTimetableEpisodeBadges(rows[j], entries[j]);
            }
            dataSet(tables[t], 'temavTtBadges', '1');
        }
    }

    function badImg(src) {
        src = String(src || '').toLowerCase();
        return !src || src.indexOf('img_load') >= 0 || src.indexOf('img_broken') >= 0 || src.indexOf('loader') >= 0 || src.indexOf('blank') >= 0 || src.indexOf('placeholder') >= 0 || src.indexOf('data:image/svg') === 0;
    }

    function getNativeImg(card) {
        return q(card, '.card__img') || q(card, '.card__view img') || q(card, 'img');
    }

    function getPoster(card, data) {
        var img;
        var src;
        if (!replacePoster) {
            img = getNativeImg(card);
            src = img && (img.getAttribute('src') || img.src);
            if (!badImg(src)) return src;
        }
        if ((hasClass(card, 'card--wide') || hasClass(card, 'card--collection')) && data.backdrop_path) return apiImg(data.backdrop_path, hasClass(card, 'card--wide') ? 'w780' : 'w500');
        if (data.poster_path) return apiImg(data.poster_path);
        if (data.profile_path) return apiImg(data.profile_path);
        if (data.poster) return data.poster;
        if (data.img) return data.img;
        if (data.background_image) return data.background_image;
        if (data.backdrop_path) return apiImg(data.backdrop_path, 'w500');
        if (data.cover) return data.cover;

        img = getNativeImg(card);
        src = img && (img.getAttribute('src') || img.src);
        return badImg(src) ? '' : src;
    }

    function removeTimetableEnhancement() {
        var nodes = qa(document, '.temav-tt-line, .temav-tt-count, .temav-timetable-detail, .temav-tt-badges');
        var pages = qa(document, '.temav-timetable-page');
        var tables = qa(document, '.timetable');
        var i;
        for (i = 0; i < nodes.length; i++) if (nodes[i].parentNode) nodes[i].parentNode.removeChild(nodes[i]);
        for (i = 0; i < pages.length; i++) removeClass(pages[i], 'temav-timetable-page');
        for (i = 0; i < tables.length; i++) dataRemove(tables[i], 'temavTtBadges');
    }

    function syncPoster(card, data) {
        var img = getNativeImg(card);
        var view = q(card, '.card__view');
        var poster = getPoster(card, data);
        var current = img && (img.getAttribute('src') || img.src);
        var currentGood = !!(current && !badImg(current));
        var loaded = currentGood || imageLoaded(img, current);

        if (view) {
            if (!badImg(poster) && dataGet(card, 'beautyBg') !== poster) {
                view.style.backgroundImage = cssUrl(poster);
                dataSet(card, 'beautyBg', poster);
            }

            if (currentGood) {
                removeClass(card, 'beauty-bg-active');
                addClass(card, 'beauty-img-ready');
            } else if (!loaded && !badImg(poster)) {
                addClass(card, 'beauty-bg-active');
                removeClass(card, 'beauty-img-ready');
            }
        }

        if (img && poster && !badImg(poster)) {
            bindImageEvents(card, img);
            if (img.setAttribute) {
                img.setAttribute('loading', 'eager');
                img.setAttribute('decoding', 'async');
            }
            if (!currentGood && current !== poster) {
                addClass(card, 'beauty-bg-active');
                removeClass(card, 'beauty-img-ready');
                img.src = poster;
            }
            if (currentGood || imageLoaded(img, img.getAttribute('src') || img.src)) {
                removeClass(card, 'beauty-bg-active');
                addClass(card, 'beauty-img-ready');
            }
        }
    }

    function imageLoaded(img, src) {
        if (!img || badImg(src)) return false;
        if (img.complete === false) return false;
        if (typeof img.naturalWidth === 'number') return img.naturalWidth > 0;
        return !!img.complete;
    }

    function bindImageEvents(card, img) {
        if (!card || !img || dataGet(card, 'beautyImgBound') === '1') return;
        dataSet(card, 'beautyImgBound', '1');

        var done = function () {
            var src = img.getAttribute('src') || img.src;
            if (!badImg(src)) {
                removeClass(card, 'beauty-bg-active');
                addClass(card, 'beauty-img-ready');
            }
        };

        var fail = function () {
            if (dataGet(card, 'beautyBg')) {
                addClass(card, 'beauty-bg-active');
                removeClass(card, 'beauty-img-ready');
            }
        };

        if (img.addEventListener) {
            img.addEventListener('load', done, false);
            img.addEventListener('error', fail, false);
        } else if (img.attachEvent) {
            img.attachEvent('onload', done);
            img.attachEvent('onerror', fail);
        }
    }

    function makeEl(className, textValue) {
        var el = document.createElement('div');
        el.className = className;
        if (textValue !== undefined && textValue !== null) el.textContent = textValue;
        return el;
    }

    function createOverlay(card) {
        var view = q(card, '.card__view');
        if (!view) return null;

        var overlay = q(view, '.beauty-overlay');
        if (overlay) return overlay;

        overlay = makeEl('beauty-overlay');
        var top = makeEl('beauty-top');
        var year = makeEl('beauty-year');
        var quality = makeEl('beauty-quality');
        var bottom = makeEl('beauty-bottom');
        var genres = makeEl('beauty-genres');
        var title = makeEl('beauty-title');
        var info = makeEl('beauty-info');
        var rating = makeEl('beauty-rating');
        var star = makeEl('beauty-star', '\u2605');
        var rate = makeEl('beauty-rate');
        var episode = makeEl('beauty-episode');

        top.appendChild(year);
        top.appendChild(quality);
        rating.appendChild(star);
        rating.appendChild(rate);
        info.appendChild(rating);
        info.appendChild(episode);
        bottom.appendChild(genres);
        bottom.appendChild(title);
        bottom.appendChild(info);
        overlay.appendChild(top);
        overlay.appendChild(bottom);
        view.appendChild(overlay);
        return overlay;
    }

    function updateCard(card) {
        var line;
        if (!themeEnabled) return;
        if (!card || !contains(card) || hasClass(card, 'card--advert') || hasClass(card, 'card--small')) return;

        line = closestByClass(card, 'items-line');
        if (line && !hasClass(card, 'card-episode') && !hasClass(card, 'card-more')) addClass(line, 'temav-line-cards');

        var view = q(card, '.card__view');
        if (!view) return;
        bindCardEvents(card);

        var data = getCardData(card);
        var title = getTitle(card, data);
        if (!title) return;
        var poster = getPoster(card, data);
        var year = showReleaseYear ? getYear(card, data) : '';
        var rating = ratingsMode !== 'off' ? getRating(data, card) : '';
        var episode = showEpisodeNumber ? getEpisode(data, card) : '';
        var genres = showGenres ? getGenres(data, card) : '';
        var signature = [title, poster, year, rating, episode, genres, qualityMode, ratingsMode, replacePoster].join('|');
        var overlayReady = q(view, '.beauty-overlay');

        if (overlayReady && dataGet(card, 'beautySignature') === signature) {
            syncPoster(card, data);
            requestEpisodeDetails(card, data, episode);
            requestQuality(card, data, function (quality) { applyQuality(card, quality); });
            return;
        }

        addClass(card, 'beauty-card-final');
        syncPoster(card, data);
        cleanupOldLayers(card);

        var overlay = createOverlay(card);
        if (!overlay) return;

        var yearEl = q(overlay, '.beauty-year');
        var qualityEl = q(overlay, '.beauty-quality');
        var genresEl = q(overlay, '.beauty-genres');
        var titleEl = q(overlay, '.beauty-title');
        var ratingEl = q(overlay, '.beauty-rating');
        var rateEl = q(overlay, '.beauty-rate');
        var episodeEl = q(overlay, '.beauty-episode');

        if (yearEl) yearEl.textContent = year || '';
        if (qualityEl) {
            qualityEl.textContent = '';
            qualityEl.className = 'beauty-quality';
        }
        removeClass(card, 'beauty-has-quality');
        if (genresEl) genresEl.textContent = genres || '';
        if (genres) addClass(card, 'beauty-has-genres');
        else removeClass(card, 'beauty-has-genres');
        if (titleEl) titleEl.textContent = title;
        if (ratingEl) {
            ratingEl.className = 'beauty-rating';
            if (ratingsMode !== 'off' && ratingClass(rating)) addClass(ratingEl, ratingClass(rating));
            ratingEl.style.display = ratingsMode === 'off' ? 'none' : '';
        }
        if (rateEl) rateEl.textContent = rating || '-';
        if (episodeEl) episodeEl.textContent = episode || '';
        if (episode) addClass(card, 'beauty-has-episode');
        else removeClass(card, 'beauty-has-episode');
        requestEpisodeDetails(card, data, episode);
        requestQuality(card, data, function (quality) { applyQuality(card, quality); });

        dataSet(card, 'beautyReady', '1');
        dataSet(card, 'beautySignature', signature);
    }

    function cleanupOldLayers(card) {
        var old = qa(card, '.beauty-fixed-layer');
        for (var i = 0; i < old.length; i++) {
            if (old[i].parentNode) old[i].parentNode.removeChild(old[i]);
        }
    }

    function bindCardEvents(card) {
        if (!card || dataGet(card, 'beautyBound') === '1' || !card.addEventListener) return;
        dataSet(card, 'beautyBound', '1');

        var update = function () {
            updateCard(card);
        };

        card.addEventListener('visible', update, false);
        card.addEventListener('update', update, false);
        card.addEventListener('hover:focus', update, false);
        card.addEventListener('hover:enter', update, false);
        card.addEventListener('hover:hover', update, false);
        card.addEventListener('hover:touch', update, false);
    }

    var scanTimer = null;
    var keyScanTimer = null;
    var scanRoot = null;
    var pendingNodes = [];
    var pendingNodesTimer = null;
    var timetableBadgesTimer = null;

    function getActiveRoot() {
        return q(document, '.activity--active .scroll__content') || q(document, '.scroll__content') || document;
    }

    function scan(root) {
        var cards;
        var i;
        if (!themeEnabled) return;
        if (root && hasClass(root, 'card')) updateCard(root);
        cards = qa(root || document, '.card');
        for (i = 0; i < cards.length; i++) updateCard(cards[i]);
    }

    function scanNode(root) {
        var cards;
        var i;
        if (!themeEnabled) return;
        if (!root) return;
        if (root.nodeType && root.nodeType !== 1 && root.nodeType !== 9) return;
        if (hasClass(root, 'card')) updateCard(root);
        cards = qa(root, '.card');
        for (i = 0; i < cards.length; i++) updateCard(cards[i]);
    }

    function flushPendingNodes() {
        var nodes = pendingNodes;
        var i;
        pendingNodes = [];
        pendingNodesTimer = null;
        if (!themeEnabled) return;
        for (i = 0; i < nodes.length; i++) {
            if (nodes[i] && nodes[i].nodeType === 1) dataRemove(nodes[i], 'beautyScanQueued');
            scanNode(nodes[i]);
        }
    }

    function scheduleNodeScan(root) {
        if (!themeEnabled || !root) return;
        if (shouldSkipThemeScan(root)) return;
        if (root.nodeType === 1) {
            if (dataGet(root, 'beautyScanQueued') === '1') return;
            dataSet(root, 'beautyScanQueued', '1');
        } else if (arrayHas(pendingNodes, root)) {
            return;
        }
        pendingNodes.push(root);
        if (nodeHasClass(root, 'timetable') || nodeInsideClass(root, 'timetable')) scheduleTimetableBadges();
        if (pendingNodesTimer) return;
        pendingNodesTimer = setTimeout(flushPendingNodes, 70);
    }

    function scheduleTimetableBadges() {
        if (!themeEnabled || !timetableEnabled || timetableBadgesTimer) return;
        timetableBadgesTimer = setTimeout(function () {
            timetableBadgesTimer = null;
            enhanceTimetableBadges(document);
        }, 160);
    }

    function scheduleScan(root) {
        if (!themeEnabled) return;
        scanRoot = root || scanRoot || getActiveRoot();
        if (scanTimer) return;
        scanTimer = setTimeout(function () {
            var root = scanRoot || getActiveRoot();
            scanRoot = null;
            scanTimer = null;
            scan(root);
        }, 120);
    }

    function scheduleKeyScan() {
        if (!themeEnabled) return;
        if (keyScanTimer) return;
        keyScanTimer = setTimeout(function () {
            var focused;
            keyScanTimer = null;
            focused = q(document, '.card.focus') || q(document, '.card.hover') || q(document, '.card.traverse');
            if (focused) updateCard(focused);
            else scheduleScan(getActiveRoot());
        }, 90);
    }

    function bindGlobalEvents() {
        var keyHandler = function () { scheduleKeyScan(); };

        if (document.addEventListener) {
            document.addEventListener('keydown', keyHandler, false);
        } else if (document.attachEvent) {
            document.attachEvent('onkeydown', keyHandler);
        }
    }

    function bindLampaEvents() {
        if (typeof Lampa === 'undefined' || !Lampa.Listener) return;
        Lampa.Listener.follow('complete', function () {
            registerSettings();
            scheduleMenuShell();
            scheduleSettingsPanelStyle();
            scheduleScan(getActiveRoot());
        });
        Lampa.Listener.follow('settings', function () {
            scheduleSettingsPanelStyle();
            schedulePanelScrollReset('.settings__body');
        });
        Lampa.Listener.follow('resize_end', function () {
            scheduleMenuShell();
            scheduleSettingsPanelStyle();
            scheduleScan(getActiveRoot());
        });
        Lampa.Listener.follow('full', renderLogoTitle);
    }

    function toggleBodyClass(name, enabled) {
        var body = document.body;
        if (!body) return;
        if (body.classList) {
            if (enabled) body.classList.add(name);
            else body.classList.remove(name);
        } else {
            var className = ' ' + body.className + ' ';
            var exists = className.indexOf(' ' + name + ' ') >= 0;
            if (enabled && !exists) body.className = (body.className ? body.className + ' ' : '') + name;
            if (!enabled && exists) body.className = className.replace(' ' + name + ' ', ' ').replace(/^\s+|\s+$/g, '');
        }
    }

    function guardPanelsOnBoot() {
        toggleBodyClass('temav-panel-boot', true);
        if (panelBootTimer) clearTimeout(panelBootTimer);
        panelBootTimer = setTimeout(function () {
            panelBootTimer = null;
            toggleBodyClass('temav-panel-boot', false);
        }, 1400);
    }

    function nodeHasClass(node, name) {
        if (!node || node.nodeType !== 1) return false;
        if (node.classList) return node.classList.contains(name);
        return (' ' + node.className + ' ').indexOf(' ' + name + ' ') >= 0;
    }

    function shouldSkipThemeScan(node) {
        var skip = ['settings', 'selectbox', 'modal', 'settings-input', 'pincode', 'extensions', 'wrap__left', 'head'];
        var i;
        if (!node || node.nodeType !== 1) return false;
        if (nodeHasClass(node, 'timetable') || nodeInsideClass(node, 'timetable')) return false;
        for (i = 0; i < skip.length; i++) {
            if (nodeHasClass(node, skip[i]) || nodeInsideClass(node, skip[i])) return true;
        }
        return false;
    }

    function nodeInsideClass(node, name) {
        while (node && node !== document) {
            if (nodeHasClass(node, name)) return true;
            node = node.parentNode;
        }
        return false;
    }

    function hasBodyClass(name) {
        var body = document.body;
        if (!body) return false;
        if (body.classList) return body.classList.contains(name);
        return (' ' + body.className + ' ').indexOf(' ' + name + ' ') >= 0;
    }

    function resetPanelScroll(selector) {
        var panels = document.querySelectorAll ? document.querySelectorAll(selector) : [];
        for (var i = 0; i < panels.length; i++) {
            var scroll = panels[i].querySelector ? panels[i].querySelector('.scroll') : null;
            var body = scroll && scroll.querySelector ? scroll.querySelector('.scroll__body') : null;

            try {
                if (scroll && scroll.Scroll && scroll.Scroll.reset) scroll.Scroll.reset();
            } catch (e) {}

            if (scroll) {
                scroll.scrollTop = 0;
                scroll.scrollLeft = 0;
            }

            if (body) {
                body.scrollTop = 0;
                body.scrollLeft = 0;
                body.scroll_position = 0;
                body.style.webkitTransform = 'translate3d(0, 0, 0)';
                body.style.transform = 'translate3d(0, 0, 0)';
            }
        }
    }

    function schedulePanelScrollReset(selector) {
        setTimeout(function () { resetPanelScroll(selector); }, 0);
        setTimeout(function () { resetPanelScroll(selector); }, 90);
    }

    function scrollMenuToFocus() {
        var wrap = q(document, '.wrap__left');
        var scroll = wrap && wrap.querySelector ? wrap.querySelector('.scroll') : null;
        var active = wrap && wrap.querySelector ? wrap.querySelector('.menu__item.focus, .menu__item.hover, .menu__item.traverse') : null;
        var body;
        var target;

        if (!wrap || !scroll || !active) return;

        try {
            if (scroll.Scroll && scroll.Scroll.immediate) {
                scroll.Scroll.immediate(active, true);
                return;
            }
        } catch (e) {}

        body = scroll.querySelector ? scroll.querySelector('.scroll__body') : null;
        target = Math.max(0, active.offsetTop - Math.round((scroll.clientHeight - active.offsetHeight) / 2));

        scroll.scrollTop = target;
        if (body) body.scroll_position = Math.round(target / Math.max(1, active.offsetHeight));
    }

    function scheduleMenuFocusScroll() {
        setTimeout(scrollMenuToFocus, 0);
        setTimeout(scrollMenuToFocus, 90);
    }

    function syncPanelOpenState() {
        var settingsOpen = hasBodyClass('settings--open');
        var selectboxOpen = hasBodyClass('selectbox--open');
        var menuOpen = hasBodyClass('menu--open');
        if (settingsPanelEnabled && settingsOpen && !settingsWasOpen) schedulePanelScrollReset('.settings__body');
        if (settingsPanelEnabled && selectboxOpen && !selectboxWasOpen) schedulePanelScrollReset('.selectbox__body');
        if (menuEnabled && menuOpen && !menuWasOpen) scheduleMenuFocusScroll();

        settingsWasOpen = settingsOpen;
        selectboxWasOpen = selectboxOpen;
        menuWasOpen = menuOpen;
    }

    function start() {
        if (!document.body) {
            setTimeout(start, 50);
            return;
        }
        if (started) return;
        started = true;
        guardPanelsOnBoot();
        registerSettings();
        readThemeEnabled();
        readMenuEnabled();
        readSettingsPanelEnabled();
        readHeadEnabled();
        readFullPageEnabled();
        readTimetableEnabled();
        readPerformanceMode();
        readHomeOptions();
        applyThemeState();
        applyMenuState();
        applySettingsPanelState();
        applyHeadState();
        applyFullPageState();
        applyTimetableState();
        applyPerformanceState();
        applyColorState();
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(function (mutations) {
                var resetSettings = false;
                var resetSelectbox = false;
                for (var i = 0; i < mutations.length; i++) {
                    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                        var added = mutations[i].addedNodes[j];
                        scheduleNodeScan(added);
                        if (nodeInsideClass(added, 'settings__body')) resetSettings = true;
                        if (nodeInsideClass(added, 'selectbox__body')) resetSelectbox = true;
                    }
                }
                scheduleMenuShell();
                if (resetSettings && hasBodyClass('settings--open')) schedulePanelScrollReset('.settings__body');
                if (resetSelectbox && hasBodyClass('selectbox--open')) schedulePanelScrollReset('.selectbox__body');
            });
            observer.observe(document.body, { childList: true, subtree: true });

            var bodyObserver = new MutationObserver(function () {
                syncPanelOpenState();
            });
            bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        } else {
            setInterval(function () { scan(getActiveRoot()); }, 3000);
            setInterval(syncPanelOpenState, 300);
        }

        bindLampaEvents();
        bindGlobalEvents();
        syncPanelOpenState();
    }

    if (window.appready) start();
    else if (typeof Lampa !== 'undefined' && Lampa.Listener) {
        Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
    } else {
        start();
    }
})();
