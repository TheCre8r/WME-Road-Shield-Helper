// ==UserScript==
// @name         WME Road Shield Helper
// @namespace    https://github.com/thecre8r/
// @version      2023.08.27.01
// @description  Road Shield Helper
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @author       The_Cre8r
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GPLv3
// ==/UserScript==

/* global $ */
/* global W */
/* global WazeWrap */
/* global I18n */


(function() {
    const STORE_NAME = "WMERSH_Settings";
    const SCRIPT_NAME = GM_info.script.name;
    const SCRIPT_VERSION = GM_info.script.version.toString();
                                        //{"version": "2023.01.01.01","changes": ""},
    const SCRIPT_HISTORY = `{"versions": [{"version": "2023.08.27.01","changes": "Fix to turn instruuction preview for turns to unnamed segments."},{"version": "2023.08.23.01","changes": "Compatibility update with WME V2.180."},{"version": "2023.02.11.01","changes": "Compatibility update. Added Minnesota CH shield logic."},{"version": "2021.12.30.001","changes": "jm6087 additions"},{"version": "2022.11.29.01","changes": "Code Cleanup"},{"version": "2022.08.30.01","changes": "Added button panel to segment name edit panel."},{"version": "2022.03.05.01","changes": "Fixed region-specific button logic"},{"version": "2022.01.22.01","changes": "More added support for additional new shields"},{"version": "2022.01.21.01","changes": "Added support for new shields"},{"version": "2021.08.09.01","changes": "Added the preview on the turn instruction dialog box"},{"version": "2021.07.07.03","changes": "Fixed another small ꜱ in West and East."},{"version": "2021.07.07.02","changes": "Fixed small ꜱ in West and East."},{"version": "2021.07.07.01","changes": "Added Buttons to Turn Instructions and all states should be compatible. Please be sure to report an issue on GitHub if you find one that is not working."},{"version": "2021.06.12.01","changes": "Support for Illinois CH Road Shields, a few more SH- States, a few more SR- States, and Arkansas's Shield Name Suffixes"},{"version": "2021.06.05.01","changes": "Support for Missouri Supplemental Road Shields"},{"version": "2021.06.03.02","changes": "Support for Kansas K-xxx format"},{"version": "2021.06.03.01","changes": "Added CR support for states using hexagon type shields"},{"version": "2021.06.02.01","changes": "Added SR Shield for New Hampshire"},{"version": "2021.06.01.02","changes": "Added County Shields for Wisconsin<br>Updated Changelog Format"},{"version": "2021.06.01.01","changes": "Fixed GitHub URL"},{"version": "2021.05.31.01","changes": "Added Wisconsin and other miscellaneous fixes"},{"version": "2021.05.23.01","changes": "Initial Version"}]}`;
    const GH = {link: 'https://github.com/TheCre8r/WME-Road-Shield-Helper/', issue: 'https://github.com/TheCre8r/WME-Road-Shield-Helper/issues/new', wiki: 'https://github.com/TheCre8r/WME-Road-Shield-Helper/wiki'};
    const UPDATE_ALERT = true;

    // Version 2021.12.30.001 - Pushed by jm6087
    //Fixed the autofill for "Exits".  It now works with "to" ramps.  It also selects the correct shield if it is listed in the shield list.
    // It will now parse on "/", "»", and "•"
    // If there is only 1 street name/shield after "Exit ###" or "to ", it will only fill in the Visual Instructions box.
    // If there are 2 or more street names/shields, it will duplicate the information in both the Visual Instruction and Toward box
    // This will allow you to delete whichever street name/shield does not belong per field instead of having to add to the Toward box

    let _settings = {};
    let svglogo = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" width="13" height="13" viewBox="0 0 384 384" overflow="visible" enable-background="new 0 0 13384" xml:space="preserve" style="vertical-align: middle;"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M303.8720703,28.0273438l50.3662109,52.1557617    C339.7480469,97.5253906,331,119.8857422,331,144.2758789c0,20.8432617,6.4052734,40.2626953,17.3476563,56.3041992    C357.5654297,214.0683594,363,230.4316406,363,248c0,46.2294922-37.3447266,83.7363281-83.5097656,83.9990234    C247.1210938,332.0214844,217.1582031,341.6162109,192,358.0605469c-25.1884766-16.4648438-55.1953125-26.0625-87.609375-26.0625    C58.2797852,331.6728516,21,294.1904297,21,248c0-17.5673828,5.4345703-33.9316406,14.6523438-47.4199219    C46.5942383,184.5385742,53,165.1191406,53,144.2758789c0-24.390625-8.7480469-46.7504883-23.2382813-64.0927734    l50.3662109-52.1557617C96.0566406,37.9365234,114.8740234,43.6699219,135,43.6699219c21.0283203,0,40.6298828-6.2587891,57-17    c16.3701172,10.7412109,35.9716797,17,57,17C269.1259766,43.6699219,287.9433594,37.9365234,303.8720703,28.0273438z     M249,31.6699219c21.2548828,0,40.8378906-7.2177734,56.4121094-19.3222656l65.4033203,67.7265625    C353.7060547,96.1201172,343,118.9477539,343,144.2758789c0,18.3544922,5.6318359,35.425293,15.2578125,49.5375977    C368.7890625,209.2226563,375,227.9277344,375,248c0,52.8339844-42.6796875,95.6992188-95.4414063,95.9980469    c-32.8427734,0.0117188-62.9824219,10.65625-87.5585938,28.6523438    c-24.5898438-18.0048828-54.7475586-28.6523438-87.609375-28.6523438C51.6513672,343.671875,9,300.8164063,9,248    c0-20.0722656,6.2109375-38.7773438,16.7421875-54.1865234C35.3681641,179.7011719,41,162.6303711,41,144.2758789    c0-25.328125-10.706543-48.1557617-27.8154297-64.2016602l65.4033203-67.7265625    C94.1621094,24.4521484,113.7451172,31.6699219,135,31.6699219c21.5219727,0,41.3310547-7.3989258,57-19.7802734    C207.6689453,24.2709961,227.4775391,31.6699219,249,31.6699219z"></path></svg>`

    function log(msg,level) {
        var css = `font-size: 12px; display: block;`;
        if (level == 0) {css += ' color: red;'}
        else if (level == 1) {css += ' color: green;'}
        else {css += ' color: orange;'}
        console.log("%c"+GM_info.script.name+": %s", css, msg);
    }

    function initializei18n() {
        log("i18n Initialized - " +I18n.currentLocale(),1)
        var translations = {
            en: {
                tab_title: `${SCRIPT_NAME}`,
                report_an_issue: 'Report an Issue on GitHub',
                help: 'Help',
                filter_by_state: `Filter Shields By State`,
                turn_instruction_preview: "Turn Instruction Preview",
                settings_1: 'Enable Debug Mode',
            },
            es: {
                tab_title: `${SCRIPT_NAME}`,
                report_an_issue: 'Reportar Un Problema En GitHub',
                help: 'Ayuda',
                filter_by_state: `Filtros de Escudos Por Estado`,
                settings_1: 'Habilitar el modo de Limpiar',
            },
            fr: {
                tab_title: `${SCRIPT_NAME}`,
                report_an_issue: 'Signaler un problème sur GitHub',
                help: 'Aide',
                filter_by_state: `Filtrer les cartouches de localisation par région`,
                turn_instruction_preview: "Aperçu des instructions de guidage",
                settings_1: 'Activer le mode de débogage',
            }
        };
        translations['en-GB'] = translations['en-US'] = translations['en-AU'] = translations.en;
        translations['es-419'] = translations.es;
        I18n.translations[I18n.currentLocale()].wmersh = translations.en;
        Object.keys(translations).forEach(function(locale) {
            if (I18n.currentLocale() == locale) {
                addFallbacks(translations[locale], translations.en);
                I18n.translations[locale].wmersh = translations[locale];
            }
        });
        function addFallbacks(localeStrings, fallbackStrings) {
            Object.keys(fallbackStrings).forEach(function(key) {
                if (!localeStrings[key]) {
                    localeStrings[key] = fallbackStrings[key];
                } else if (typeof localeStrings[key] === 'object') {
                    addFallbacks(localeStrings[key], fallbackStrings[key]);
                }
            });
        }
    }

    function injectCss() {
        let css = [
            '#sidepanel-wmersh > div > form > div > div > label {white-space:normal}',
            '#WMERSH-header {margin-bottom:10px;}',
            '#WMERSH-title {font-size:15px;font-weight:600;}',
            '#WMERSH-version {font-size:11px;margin-left:10px;color:#aaa;}',
            '.WMERSH-report {text-align:center;padding-top:20px;}',
            '.WMERSH-button{background-color: var(--wz-button-background-color, #09f);color: rgb(255, 255, 255);border-radius: 100px;font-size: 15px;height: 25px;align-items: center;border: 1px solid transparent;cursor: pointer;display: inline-flex;font-family: Boing, Rubik, sans-serif;font-weight: 500;justify-content: center;letter-spacing: 0.3px;width: 58px;outline: none;text-align: center;text-decoration: unset;user-select: none;white-space: nowrap;}',
            '.WMERSH-button.sm {border-radius: 100px;font-size: 13px;height: 32px;padding: 0px 12px;}',
            '.WMERSH-button.xs {border-radius: 43px;font-family: Rubik, sans-serif;font-size: 10px;height: 18px;padding: 0px 8px;}',
            '.WMERSH-button.red {background-color: red}',
            '.WMERSH-button.insertChar {margin:1px}',
            '.WMERSH-button > span {position: relative;bottom: -1px;}',
            '#WMERSH-Autofill {position:absolute;top: 14px;right: 14px;font-size:20px;}',
            '#WMERSH-panel-buttons {background: black;position: absolute;z-index: 10;border: 10px;border-color: black;border-style: solid;border-bottom-right-radius: 5px;border-bottom-left-radius: 5px;}',
            '#WMERSH-Message {position:absolute;top: 323px;left: 24px;font-size: 14px;}',
            '#WMERSH-Message.Error {color:red}',
            '#WMERSH-Message.Alert {color:orange}',
            '.rsh-button {padding: 2px; height: 10px; width: 10px;}',
            '#WMERSH-panel {width: 80px;background: white; border-top-left-radius: 5px;border-top-right-radius: 5px; position: absolute;z-index: 4;left: 340px;margin-top: 155px;-webkit-box-shadow: 0 2px 3px 0 rgb(60 64 67 / 30%), 0 6px 10px 4px rgb(60 64 67 / 15%);box-shadow: 0 2px 3px 0 rgb(60 64 67 / 30%), 0 6px 10px 4px rgb(60 64 67 / 15%);}',
            '#WMERSH-panel-header {font-family: "Boing-medium", sans-serif;font-size: 16px;line-height: 24px;font-weight: 400;height: 31px;display: -webkit-box;display: -ms-flexbox;display: flex;border-bottom: 1px solid #e8eaed;padding: 6px;text-align: center;}',
            '#WMERSH-TIO-Autofill {position:absolute;top: 6px;right: 30px;font-size:20px;transform: scale(0.65);}',
            '.fa, .fas{font-family:"FontAwesome"}',
            '.fab{font-family:"Font Awesome 5 Brands"}',
            '@font-face{font-family:"Font Awesome 5 Free";font-style:normal;font-weight:400;src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.eot);src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.eot?#iefix) format("embedded-opentype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.woff2) format("woff2"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.woff) format("woff"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.ttf) format("truetype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.svg#fontawesome) format("svg")}',
            '.far{font-weight:400}',
            '@font-face{font-family:"Font Awesome 5 Free";font-style:normal;font-weight:900;src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.eot);src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.eot?#iefix) format("embedded-opentype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.woff2) format("woff2"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.woff) format("woff"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.ttf) format("truetype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.svg#fontawesome) format("svg")}',
            '.far,.fas{font-family:"Font Awesome 5 Free"}',
            '.fas{font-weight:900}',
            '.rsh-button::shadow button::shadow  {font-family: sans-serif;}'
        ].join(' ');
        $('<style type="text/css" id="wmersh-style">' + css + '</style>').appendTo('head');
        $('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/regular.css" integrity="sha384-APzfePYec2VC7jyJSpgbPrqGZ365g49SgeW+7abV1GaUnDwW7dQIYFc+EuAuIx0c" crossorigin="anonymous">').appendTo('head');
        $('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/brands.css" integrity="sha384-/feuykTegPRR7MxelAQ+2VUMibQwKyO6okSsWiblZAJhUSTF9QAVR0QLk6YwNURa" crossorigin="anonymous">').appendTo('head');
        $('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/fontawesome.css" integrity="sha384-ijEtygNrZDKunAWYDdV3wAZWvTHSrGhdUfImfngIba35nhQ03lSNgfTJAKaGFjk2" crossorigin="anonymous">').appendTo('head');
        log("CSS Injected",1);
    }

    function initTab() {
        let $section = $("<div>");
        $section.html([
            '<div>',
            '<div id="WMERSH-header">',
            `<span id="WMERSH-title">${I18n.t(`wmersh.tab_title`)}</span>`,
            `<span id="WMERSH-version">${SCRIPT_VERSION}</span>`,
            '</div>',
            '<form class="attributes-form side-panel-section">',
            '<div class="form-group">',
            '<div class="controls-container">',
            `<input type="checkbox" id="WMERSH-FilterByState" value="on"><label for="WMERSH-FilterByState">${I18n.t(`wmersh.filter_by_state`)}</label>`,
            '</div>',
            '<div class="controls-container">',
            `<input type="checkbox" id="WMERSH-TurnInstructionPreview" value="on"><label for="WMERSH-TurnInstructionPreview">${I18n.t(`wmersh.turn_instruction_preview`)}</label>`,
            '</div>',
            TESTERS.indexOf(W.loginManager.user.userName) > -1 ? `<div class="controls-container"><input type="checkbox" id="WMERSH-Debug" value="on"><label for="WMERSH-Debug">${I18n.t(`wmersh.settings_1`)}</label></div>` : '',
            '</div>',
            '<div class="form-group">',
            '<div class="WMERSH-report">',
            '<i class="fa fa-github" style="font-size: 13px; padding-right:5px"></i>',
            '<div style="display: inline-block;">',
            `<a target="_blank" href="${GH.issue}" id="WMERSH-report-an-issue">${I18n.t(`wmersh.report_an_issue`)}</a>`,
            '</div>',
            '</div>',
            `<div class="WMERSH-help" style="text-align: center;padding-top: 5px;">`,
            `<i class="fa fa-question-circle-o" style="font-size: 13px; padding-right:5px"></i>`,
            `<div style="display: inline-block;">`,
            `<a target="_blank" href="${GH.wiki}" id="WMERSH-help-link">${I18n.t(`wmersh.help`)}</a>`,
            `</div>`,
            `</div>`,
            '</div>',
            '</form>',
            '</div>'
        ].join(' '));
        WazeWrap.Interface.Tab('WMERSH', $section.html(), function(){});
        $('a[href$="#sidepanel-wmersh"]').html(`<span>`+svglogo+`</span>`)
        $('a[href$="#sidepanel-wmersh"]').prop('title', 'WME RSH');
        log("Tab Initialized",1);
    }

    let TESTERS = ["The_Cre8r","jm6087","s18slider","locojd1","SethSpeedy28","nzahn1","Harmonious4","turnertr","sketch","phuz"];

    function setChecked(checkboxId, checked) {
        $('#WMERSH-' + checkboxId).prop('checked', checked);
    }

    /*-- Start Settings --*/
    function loadSettings() {
        let loadedSettings = $.parseJSON(localStorage.getItem(STORE_NAME));
        let defaultSettings = {
            FilterByState: true,
            TurnInstructionPreview: true,
            Debug: false,
            lastVersion: 0
        };
        _settings = loadedSettings ? loadedSettings : defaultSettings;
        for (let prop in defaultSettings) {
            if (!_settings.hasOwnProperty(prop)) {
                _settings[prop] = defaultSettings[prop];
            }
        }
        log("Settings Loaded",1);
    }

    function saveSettings() {
        if (localStorage) {
            _settings.lastVersion = SCRIPT_VERSION;
            localStorage.setItem(STORE_NAME, JSON.stringify(_settings));
            log('Settings Saved',1);
        }
    }

    function initializeSettings() {
        loadSettings();
        let SCRIPT_CHANGES = ``;
        let JSON = $.parseJSON(SCRIPT_HISTORY);
        if (JSON.versions[0].version.substring(0,13) != SCRIPT_VERSION.substring(0,13)) {
            SCRIPT_CHANGES+=`No Changelog Reported<br><br>`
        }
        JSON.versions.forEach(function(item){
            if (item.version.substring(0,13) == SCRIPT_VERSION.substring(0,13)) {
                SCRIPT_CHANGES+=`${item.changes}<br><br>`
            } else {
                SCRIPT_CHANGES+=`<h6 style="line-height: 0px;">${item.version}</h6>${item.changes}<br><br>`
            }
        });
        if (UPDATE_ALERT == true){
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, SCRIPT_VERSION, SCRIPT_CHANGES,`"</a><a target="_blank" href='${GH.link}'>GitHub</a><a style="display:none;" href="`, "#");
        }
        setChecked('Debug', _settings.Debug);
        setChecked('FilterByState', _settings.FilterByState);
        setChecked('TurnInstructionPreview', _settings.TurnInstructionPreview);
        $('#WMERSH-Debug').change(function() {
            let settingName = "Debug";
            _settings[settingName] = this.checked;
            saveSettings();
        });
        $('#WMERSH-FilterByState').change(function() {
            let settingName = "FilterByState";
            _settings[settingName] = this.checked;
            saveSettings();
        });
        $('#WMERSH-TurnInstructionPreview').change(function() {
            let settingName = "TurnInstructionPreview";
            _settings[settingName] = this.checked;
            saveSettings();
        });
        log("Settings Initialized",1);
    }
    /*-- End Settings --*/

    /*-- Start Libraries --*/
    function getState() {
        if (W.selectionManager.getSelectedFeatures().length > 0) {
            let pStID = W.selectionManager._getSelectedSegments()[0].attributes.primaryStreetID;
            return WazeWrap.Model.getStateName(pStID);
        }
    }

    function abbrState(input, to){
        var states = [['Arizona', 'AZ'],['Alabama', 'AL'],['Alaska', 'AK'],['Arkansas', 'AR'],['California', 'CA'],['Colorado', 'CO'],['Connecticut', 'CT'],['Delaware', 'DE'],['District of Columbia','DC'],['Florida', 'FL'],['Georgia', 'GA'],['Hawaii', 'HI'],['Idaho', 'ID'],['Illinois', 'IL'],['Indiana', 'IN'],['Iowa', 'IA'],['Kansas', 'KS'],['Kentucky', 'KY'],['Louisiana', 'LA'],['Maine', 'ME'],['Maryland', 'MD'],['Massachusetts', 'MA'],['Michigan', 'MI'],['Minnesota', 'MN'],['Mississippi', 'MS'],['Missouri', 'MO'],['Montana', 'MT'],['Nebraska', 'NE'],['Nevada', 'NV'],['New Hampshire', 'NH'],['New Jersey', 'NJ'],['New Mexico', 'NM'],['New York', 'NY'],['North Carolina', 'NC'],['North Dakota', 'ND'],['Ohio', 'OH'],['Oklahoma', 'OK'],['Oregon', 'OR'],['Pennsylvania', 'PA'],['Rhode Island', 'RI'],['South Carolina', 'SC'],['South Dakota', 'SD'],['Tennessee', 'TN'],['Texas', 'TX'],['Utah', 'UT'],['Vermont', 'VT'],['Virginia', 'VA'],['Washington', 'WA'],['West Virginia', 'WV'],['Wisconsin', 'WI'],['Wyoming', 'WY'],];
        if (to == 'abbr'){
            input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            for(let i = 0; i < states.length; i++){
                if(states[i][0] == input){
                    return(states[i][1]);
                }
            }
        } else if (to == 'name'){
            input = input.toUpperCase();
            for(let i = 0; i < states.length; i++){
                if(states[i][1] == input){
                    return(states[i][0]);
                }
            }
        }
    }
    /*-- End Libraries --*/

    /*-- Start Road Shields --*/
    function AutoFiller() {

        let streetname = document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-header > div.street-name").innerText
        let regex = /(?:((?:(?:[A-Z]+)(?=\-))|(?:Beltway)|(?:Loop)|(?:TOLL)|(?:Parish Rd)|(?:Park Rd)|(?:Recreational Rd)|(?:Spur))(?:-|\ )((?:[A-Z]+)|(?:\d+(?:[A-Z])?(?:-\d+)?)))?(?: (ALT-TRUCK|BUS|ALT|BYP|CONN|SPUR|TRUCK|TOLL|Toll|LOOP|NASA|Park|LINK))?(?: (N|E|S|W))?(?: • (.*))?/;
        let SHStates = ['Colorado', 'Minnesota', 'Oklahoma', 'Texas'];
        let SRStates = ['Alabama', 'Arizona', 'California', 'Connecticut', 'Florida', 'Georgia', 'Illinois', 'Massachusetts', 'Maine', 'New Hampshire', 'New Mexico', 'Ohio', 'Pennsylvania', 'Utah', 'Washington'];
        let CRStates = ['Alabama', 'Arkansas', 'Florida', 'Louisiana', 'New Jersey', 'New York', 'North Dakota', 'South Dakota', 'Tennessee'];
        let DoneStates = ['Delaware', 'North Carolina', 'New Jersey', 'Virginia'].concat(SRStates);
        let match = streetname.match(regex);

        if (document.querySelector("#WMERSH-Message")) {
            document.querySelector("#WMERSH-Message").remove()
        }

        function CreateError(text,level){
            if (document.querySelector("#WMERSH-Message")) {
                document.querySelector("#WMERSH-Message").remove()
            }
            let htmlString = `<div id="WMERSH-Message" class="${level}"><span>` + text + `</span></div>`;
            document.querySelector("#WMERSH-Autofill").insertAdjacentHTML('afterend',htmlString)
        }

        if (!match[0]) {
            document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-controls > wz-button.remove-road-shield.hydrated").click()
            CreateError("Error: Road does not need a shield.",`Error`);
            return;
        } else if (streetname != match[0]) {
            CreateError("Potential Error: Please Review",`Error`);
        }

        function MakeShield(match,stateoverride,shieldoverride,suffixoverride){
            let State,Shield,Suffix;

            if (shieldoverride) {
                Shield = shieldoverride;
            } else {
                Shield = "State"
            }
            if (stateoverride) {
                State = stateoverride;
            } else {
                State = abbrState(match[1], 'name')
            }
            if (suffixoverride) {
                Suffix = suffixoverride;
            } else if (State == "Texas" && match[3] == "TOLL") {
                Suffix = "Main Toll";
            } else if (State == "Texas" && (match[3] == "BUS" || match[3] == "LOOP" || match[3] == "NASA" || match[3] == "SPUR" || match[3] == "Park")) {
                Suffix = "square " + match[3];
            } else if (State == "Florida" && (match[3] == "TOLL")) {
                Suffix = "Toll";
            } else if (State == "Alaska" && (match[3] == "BUS")) {
                Suffix = "Main " + match[3];
            } else if (match[3] !== undefined) {
                Suffix = match[3];
            } else {
                Suffix = "Main";
            }

            if (State == undefined) {
                CreateError(`Error: ${match[1]} Road Shield is not available.`,`Error`);
                return;
            }
            log("Make State Shield for "+State);
            if ((Suffix == "ALT" | Suffix == "BUS" | Suffix == "SPUR" | Suffix == "TRUCK") && State == "Arkansas") {
                document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${State} - ${Shield} Main"]`).click()
            } else if (document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${State} - ${Shield} ${Suffix}"]`)) {
                document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${State} - ${Shield} ${Suffix}"]`).click()
            } else if (!document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="${State} - ${Shield} ${Suffix}"]`) && match[3] !== undefined) {
                CreateError(`Error: ${State} - ${Shield} ${Suffix} Road Shield is not available.`,`Error`);
                return;
            } else {
                CreateError(`Error: ${match[1]} Road Shield is not available.`,`Error`);
                return;
            }
        }

        let State = getState()
        switch (match[1]) {
            case "Beltway":
                if (State == "Texas") {
                    MakeShield(match,State,undefined,'square ' + match[1].toUpperCase());
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "Loop":
                if (State == "Texas") {
                    MakeShield(match,State,undefined,'square ' + match[1].toUpperCase());
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "NASA":
                if (State == "Texas") {
                    MakeShield(match,State,undefined,'square ' + match[1].toUpperCase());
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "Spur":
                if (State == "Texas") {
                    MakeShield(match,State,undefined,'square ' + match[1].toUpperCase());
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "CH":
                if (State == "Wisconsin") {
                    MakeShield(match,State,"County");
                } else if (State == "Illinois" || State == "Minnesota") {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="CR generic Main"]`).click()
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "CR":
                if (CRStates.indexOf(State)>=0) {
                    console.log(match[1]);
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="CR generic Main"]`).click()
                } else if (State == "Illinois") {
                    CreateError(`Warning: Illinois does not use CR shields for CRs.`,`Error`);
                } else if (State == "West Virginia" & !streetname.includes("/")) {
                    MakeShield(match,State, "County" ,"Main");
                } else {
                    CreateError(`Warning: CR design for this state has not been defined. <br>Consult local guidance and <a target="_blank" href="${GH.issue}" id="WMERSH-report-an-issue">${I18n.t(`wmersh.report_an_issue`)}</a>`,`Error`);
                }
                break;
            case "FM":
                if (State == "Texas" && match[3] == "BUS"){
                    MakeShield(match,State,undefined,"(FM) BUS");
                } else if (State == "Texas") {
                    MakeShield(match,State,undefined,match[1]);
                }
                break;
            case "Recreational Rd":
                if (State == "Texas") {
                    MakeShield(match,State,undefined,'Recreational');
                }
                break;
            case "RM":
                if (State == "Texas" && match[3] == "BUS"){
                    MakeShield(match,State,undefined,"(RM) BUS");
                } else if (State == "Texas") {
                    MakeShield(match,State,undefined,match[1]);
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "H":
            case "I":
                switch (match[3] ) {
                    case "BUS":
                        document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="I-# BUS"]`).click()
                        break;
                    case "TOLL":
                        if (State == "Texas"){
                            document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Texas - State Main Toll"]`).click()
                        } else {
                            CreateError(`Error: ${match[1]}-xx ${match[3]} Road Shield is not available for ${State}`,`Error`);
                        }
                        break;
                    default:
                        document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Interstate Main"]`).click()
                        break;
                }
                break;
            case "IA":
                if (State == "Iowa") {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`).click()
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "K":
                if (State == "Kansas") {
                    MakeShield(match,State);
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "KY":
                if (State == "Kentucky") {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`).click()
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "M":
                if (State == "Michigan") {
                    MakeShield(match,State);
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "MS":
                if (State == "Mississippi") {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`).click()
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "N":
                if (State == "Nebraska") {
                    MakeShield(match,State);
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "Park Rd":
                if (State == "Texas") {
                    MakeShield(match,State,undefined,"square Park");
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
                //             case "PR":
                //                 MakeShield("Puerto Rico - Primary Roads");
                //                 break;
            case "SH":
                if (SHStates.indexOf(State)>=0) {
                    MakeShield(match,State);
                } else if (State == "Missouri") {
                    MakeShield(match,State,undefined,"Supplemental");
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "SR":
                if (DoneStates.indexOf(State) == -1 ) {
                    CreateError(`Warning: State Shield Not Verified.<br>Consult local guidance and <a target="_blank" href="${GH.issue}" id="WMERSH-report-an-issue">${I18n.t(`wmersh.report_an_issue`)}</a>`,`Alert`)
                }
                if (SRStates.indexOf(State)>= 0) {
                    MakeShield(match,State);
                } else if (State == "North Carolina") {
                    CreateError(`Error: ${State} does not use road shields for Secondary Routes`,`Error`);
                } else if (State == "Virginia") {
                    if (match[2] < 600 || match[2] == 785 || match[2] == 895) {
                        MakeShield(match,State);
                    } else {
                        CreateError(`Warning: Please verify that this road uses <b>SR Generic Main</b> and not <b>VA - State Main.</b>`,`Alert`);
                    }
                } else if (match[3] == undefined) {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`).click()
                } else if (match[3] !== undefined) {
                    CreateError(`Error: SR ${match[3]} Road Shield is not available`,`Error`);
                    return;
                } else {
                    CreateError(`Error: SR ${match[3]} Road Shield is not available`,`Error`);
                    return;
                }
                break;
            case "TOLL":
                if (State == "Texas") {
                    MakeShield(match,State,undefined,'Main Toll');
                }
                break;
            case "US":
                if (match[3] == undefined) {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US Hwy Main"]`).click()
                } else if ((match[3] == "ALT" | match[3] == "BUS" | match[3] == "SPUR" | match[3] == "TRUCK") && State == "Arkansas"){
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US Hwy Main"]`).click()
                } else if (match[3] == "TOLL" && State == "Texas"){
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Texas - State Main Toll"]`).click()
                } else if (document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# ` + match[3] + `"]`)) {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# ` + match[3] + `"]`).click()
                } else {
                    CreateError(`Error: US-# ${match[3]} Road Shield is not available or does not parse`,`Error`);
                    return;
                }
                break;
            case "WIS":
                if (State == "Wisconsin") {
                    MakeShield(match,State);
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "Parish Rd":
                if (State == "Louisiana") {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="CR generic Main"]`).click()
                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            case "VA":
                if (State == "Virginia" ) {
                    if (match[2] >= 600) {
                        document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`).click()
                    } else {
                        CreateError(`Warning: Please verify that this road uses <b>VA - State Main.</b> and not <b>SR Generic Main</b>`,`Alert`);
                    }

                } else {
                    CreateError(`Error: ${match[1]} Road Shield is not available for ${State}`,`Error`);
                }
                break;
            default:
                MakeShield(match)
                break;
        }
        if (!document.querySelector(`#WMERSH-Message`) || (document.querySelector(`#WMERSH-Message`) && !document.querySelector("#WMERSH-Message").classList.contains("Warning"))){
            let shieldTextInput = document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(2) > wz-text-input");
            let shieldDirectionInput = document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input");
            let ApplyButton = document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-controls > wz-button.apply-button.hydrated");
            if (match[2]) {
                if (match[1] == "H") {
                    shieldTextInput.value = match[1]+'-'+match[2]
                } else if ((match[3] == "ALT" | match[3] == "BUS" | match[3] == "SPUR" | match[3] == "TRUCK") && State == "Arkansas"){
                    switch (match[3]) {
                        case "ALT":
                            shieldTextInput.value = match[2]+'A'
                            break;
                        case "BUS":
                            shieldTextInput.value = match[2]+'B'
                            break;
                        case "SPUR":
                            shieldTextInput.value = match[2]+'S'
                            break;
                        case "TRUCK":
                            shieldTextInput.value = match[2]+'T'
                            break;
                    }
                }else {
                    shieldTextInput.value = match[2]
                }
            }
            switch (match[4]) {
                case "N":
                    shieldDirectionInput.value = "Nᴏʀᴛʜ" //North
                    break;
                case "E":
                    shieldDirectionInput.value = "Eᴀꜱᴛ" //East
                    break;
                case "S":
                    shieldDirectionInput.value = "Sᴏᴜᴛʜ" //South
                    break;
                case "W":
                    shieldDirectionInput.value = "Wᴇꜱᴛ" //West
                    break;
                default:
                    shieldDirectionInput.value = ""
                    break;
            }
            ApplyButton.disabled = false
        }
    }

    function RegexMatch() {
        let htmlstring = `<div id="WMERSH-Autofill"><wz-button class="hydrated">Autofill</wz-button></div>`
        document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content").insertAdjacentHTML('afterend',htmlstring)
        document.querySelector("#WMERSH-Autofill").onclick = function(){AutoFiller()};
    }

    function filterShields(state) {
        let country = W.model.getTopCountry().attributes.name
        if (country == "Canada" || country == "United States") {
            log("Filtered " + state)
            for(var j = 1; j <= document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu").childElementCount; j++){
                let lineitem = document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > wz-menu-item:nth-child(`+j+`)`)
                let iTxt = lineitem.innerText
                let SearchStrings = ['Interstate Main','US Hwy','SR generic','CR generic','I-','US-','BIA','FSR','National',state]
                let length = SearchStrings.length;
                lineitem.hidden = true;
                while(length--) {
                    if (iTxt.indexOf(SearchStrings[length])!=-1) {
                        if (state == "Virginia" && iTxt.includes("West Virginia")) {
                            //Virginia has to be weird
                        }
                        else {
                            lineitem.hidden = false;
                        }
                    }
                }

            }
        }
    }
    function BuildBRTDiv() {
        let node,turnData,JBturnData,SegmentArray;

        /* -- START Get Segment Details --*/
        SegmentArray = document.querySelector("div.arrow.turn-arrow-state-open.hover").dataset.id.split(/(f|r)/g) //forward or reverse
        SegmentArray = SegmentArray.filter(element => {
            return element != null && element != '';
        });
        let SegmentDetails = JSON.parse(`{"fromSegment": {"id":` + SegmentArray[0] + `,"direction":"` + SegmentArray[1] + `"},"toSegment": {"id":` + SegmentArray[2] + `,"direction":"` + SegmentArray[3] + `"}}`);
        let fromSeg = W.model.segments.getObjectById(SegmentDetails.fromSegment.id)
        let toSeg = W.model.segments.getObjectById(SegmentDetails.toSegment.id)
        /* -- END Get Segment Details --*/

        /* -- START Get Node Details --*/
        /**
        * This will get the node for a basic turn or if it is in a junction box but is routed normally
        */
        if (SegmentDetails.fromSegment.direction == "f") {
            node = W.model.nodes.getObjectById(W.model.segments.getObjectById(SegmentDetails.fromSegment.id).attributes.toNodeID);
        } else if (SegmentDetails.fromSegment.direction == "r"){
            node = W.model.nodes.getObjectById(W.model.segments.getObjectById(SegmentDetails.fromSegment.id).attributes.fromNodeID);
        } else {
            alert("Let The_Cre8r know about this PL. [Error 1]")
        }
        turnData = W.model.turnGraph.getTurnThroughNode(node,fromSeg,toSeg).turnData
        if (turnData && turnData.turnGuidance) {
            //            WazeWrap.Alerts.info(GM_info.script.name, ` TurnGuidance`);
            console.log(turnData)
        }
        /* -- END Get Node Details --*/

        /* -- START Get JB Details --*/
        if (node.isConnectedToBigJunction() && !(turnData && turnData.turnGuidance)) {
            log("Node is Connected to Junction Box")
            let JBpaths
            if (SegmentDetails.fromSegment.direction == "f") {
                JBpaths = W.model.bigJunctions.getObjectById(W.selectionManager._getSelectedSegments()[0].attributes.toCrossroads[0])._pathCache
            } else if (SegmentDetails.fromSegment.direction == "r"){
                JBpaths = W.model.bigJunctions.getObjectById(W.selectionManager._getSelectedSegments()[0].attributes.fromCrossroads[0])._pathCache
            } else {
                alert("Let The_Cre8r know about this PL. [Error 2]")
            }
            if (JBpaths) {
                for (let path = 0; path < JBpaths.length; path++) {
                    if (JBpaths[path].fromVertex.segmentID == SegmentDetails.fromSegment.id && JBpaths[path].toVertex.segmentID == SegmentDetails.toSegment.id) {
                        turnData = JBpaths[path].turnData
                    }
                }
            } else {
                if (SegmentDetails.toSegment.direction == "f") {
                    node = W.model.nodes.getObjectById(W.model.segments.getObjectById(SegmentDetails.toSegment.id).attributes.fromnodeID);
                } else if (SegmentDetails.toSegment.direction == "r"){
                    node = W.model.nodes.getObjectById(W.model.segments.getObjectById(SegmentDetails.toSegment.id).attributes.toNodeID);
                } else {
                    alert("Let The_Cre8r know about this PL. [Error 3]")
                }
                turnData = W.model.turnGraph.getTurnThroughNode(node,fromSeg,toSeg).turnData
            }
        }
        /* -- END Get JB Details --*/

        //console.log(turnData);
        let SignPreviewHTML = ''
        if (turnData && turnData.turnGuidance) {
            /* START Turn Arrow */
            const ContinueSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-324.000000, -120.000000)" stroke="white"><g id="big_direction_forward" transform="translate(324.000000, 120.000000)"><line x1="105" y1="171" x2="105" y2="54" id="Stroke-2" stroke-width="18"></line><polygon id="Stroke-3" stroke-width="12" fill="white" points="105.124426 33 81 60 129 59.7628647"></polygon></g></g></g></svg>`;
            const ExitLeftSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="50%" y1="-13.7465911%" x2="50%" y2="54.2487695%" id="linearGradient-1"><stop stop-color="#929292" stop-opacity="0" offset="0%"></stop><stop stop-color="#535353" offset="100%"></stop></linearGradient></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-89.000000, -363.000000)"><g id="big_direction_exit_left" transform="translate(89.000000, 363.000000)"><line x1="133" y1="166" x2="133" y2="31" id="Line-Copy" stroke="url(#linearGradient-1)" stroke-width="18"></line><path d="M133.5,60 L98.1375,94.9496104 C92.0048462,101.01039 86.9870769,112.982338 86.9870769,121.553766 L86.9870769,166.259221" id="Imported-Layers" stroke="white" stroke-width="18" transform="translate(110.243538, 113.129610) scale(-1, 1) translate(-110.243538, -113.129610) "></path><polygon id="Stroke-3-Copy-3" stroke="white" stroke-width="12" fill="white" transform="translate(74.250000, 48.750000) rotate(-45.000000) translate(-74.250000, -48.750000) " points="75.3106602 36.0220779 49.854816 61.4779221 98.645184 59.3566017"></polygon></g></g></g></svg>`
            const ExitRightSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="50%" y1="-13.7465911%" x2="50%" y2="54.2487695%" id="linearGradient-1"><stop stop-color="#929292" stop-opacity="0" offset="0%"></stop><stop stop-color="#535353" offset="100%"></stop></linearGradient></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-320.000000, -363.000000)"><g id="big_direction_exit_right" transform="translate(425.000000, 468.000000) scale(-1, 1) translate(-425.000000, -468.000000) translate(320.000000, 363.000000)"><line x1="132" y1="165" x2="132" y2="30" id="Line-Copy" stroke="url(#linearGradient-1)" stroke-width="18"></line><path d="M132,60 L96.6375,94.9496104 C90.5048462,101.01039 85.4870769,112.982338 85.4870769,121.553766 L85.4870769,166.259221" id="Imported-Layers-Copy" stroke="white" stroke-width="18" transform="translate(108.743538, 113.129610) scale(-1, 1) translate(-108.743538, -113.129610) "></path><polygon id="Stroke-3-Copy-4" stroke="white" stroke-width="12" fill="white" transform="translate(71.250000, 48.750000) rotate(-45.000000) translate(-71.250000, -48.750000) " points="72.3106602 36.0220779 46.854816 61.4779221 95.645184 59.3566017"></polygon></g></g></g></svg>`
            const KeepLeftSVG = ExitLeftSVG
            const KeepRightSVG = ExitRightSVG
            const NoneSVG = ``
            const TurnLeftSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-544.000000, -120.000000)" stroke="white"><g id="big_direction_left-copy" transform="translate(544.000000, 120.000000)"><path d="M54,60 L86.621739,60 M154.290566,171 L154.290566,125.092254 M86.3366151,60.0721694 C123.663966,59.8744286 154.08866,88.9838184 154.290566,125.092254" id="Stroke-2" stroke-width="18"></path><polygon id="Stroke-3-Copy" stroke-width="12" fill="white" transform="translate(52.500000, 60.000000) rotate(-90.000000) translate(-52.500000, -60.000000) " points="52.624426 46.5 28.5 73.5 76.5 73.2628647"></polygon></g></g></g></svg>`
            const TurnRightSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-764.000000, -120.000000)" stroke="white"><g id="big_direction_right-copy-2" transform="translate(764.000000, 120.000000)"><path d="M54,60 L86.621739,60 M154.290566,171 L154.290566,125.092254 M86.3366151,60.0721694 C123.663966,59.8744286 154.08866,88.9838184 154.290566,125.092254" id="Stroke-2-Copy" stroke-width="18" transform="translate(105.000000, 115.500000) scale(-1, 1) translate(-105.000000, -115.500000) "></path><polygon id="Stroke-3-Copy-2" stroke-width="12" fill="white" transform="translate(154.500000, 60.000000) scale(-1, 1) rotate(-90.000000) translate(-154.500000, -60.000000) " points="154.624426 46.5 130.5 73.5 178.5 73.2628647"></polygon></g></g></g></svg>`
            const UTurnSVG = `<svg width="210px" height="210px" viewBox="0 0 210 210" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g id="Artboard-6" transform="translate(-550.000000, -363.000000)" stroke="white"><g id="big_direction_u_turn" transform="translate(550.000000, 363.000000)"><path d="M63.1093667,161.533902 L63.1093667,76.082849 M144,159 L144,78 M63.0006146,78 C62.8786912,54.9287685 80.9135963,36.1263855 103.27922,36.0006339 C125.646468,35.8748823 143.878077,54.474386 144,77.5439408" id="Imported-Layers" stroke-width="18"></path><polygon id="Stroke-3-Copy-5" stroke-width="12" fill="white" transform="translate(63.000000, 154.500000) rotate(-180.000000) translate(-63.000000, -154.500000) " points="63.124426 141 39 168 87 167.762865"></polygon></g></g></g></svg>`
            const DefaultTurnHTML =`<div class="default-waze-selected"><div class="default-waze-selected-inner">Waze selected</div></div>`
            let TurnHTML;

            switch (turnData.instructionOpcode) {
                case null:
                    TurnHTML = DefaultTurnHTML
                    break;
                case "CONTINUE":
                    TurnHTML = ContinueSVG;
                    break;
                case "EXIT_LEFT":
                    TurnHTML = ExitLeftSVG;
                    break;
                case "EXIT_RIGHT":
                    TurnHTML = ExitRightSVG;
                    break;
                case "KEEP_LEFT":
                    TurnHTML = KeepLeftSVG;
                    break;
                case "KEEP_RIGHT":
                    TurnHTML = KeepRightSVG;
                    break;
                case "NONE":
                    TurnHTML = NoneSVG;
                    break;
                case "TURN_LEFT":
                    TurnHTML = TurnLeftSVG;
                    break;
                case "TURN_RIGHT":
                    TurnHTML = TurnRightSVG;
                    break;
                case "UTURN":
                    TurnHTML = UTurnSVG;
                    break;
                default:
                    TurnHTML = `<div class="default-waze-selected-inner" style="color: red;">More Stuff<br> to Fix</div>`
                    break;
            }
            /* START Exit Sign */
            let exitSigns = turnData.turnGuidance.exitSigns;
            if (exitSigns.length > 0) {
                for (let i = 0; i < exitSigns.length; i++) {
                    SignPreviewHTML += `<img class="inline-exit-sign" src="https://renderer-am.waze.com/renderer/v1/signs/${exitSigns[i].type}?text=${exitSigns[i].text}">`
                }
            }

            /* START Visual Instuctions */
            let turnGuidance =turnData.turnGuidance //"$RS-0 ᴛᴏ $RS-1 $RS-2 $RS-3"
            let viArray = turnGuidance.visualInstruction.split(' ');
            let visualInstructionHTML = ``
            for (let j = 0; j < viArray.length; j++) {
                if (viArray[j].includes("$RS-")) {
                    let Shield = turnGuidance.roadShields[viArray[j].replace('$', '')]
                    visualInstructionHTML += `<span class="inline-road-shield"><img class="sign-image" src="https://renderer-am.waze.com/renderer/v1/signs/${Shield.type}?text=${Shield.text}">&nbsp;<span>${Shield.direction ? Shield.direction : ''}</span></span>`
                } else {
                    visualInstructionHTML += `<span class="inline-free-text">${viArray[j]}</span>`
                }
            }

            /* START Toward */
            let towardsHTML = ``;
            if (turnGuidance.towards) {
                let towardsArray = turnGuidance.towards.split(' ');
                towardsHTML = `<div class="secondary-markup">`
                for (let j = 0; j < towardsArray.length; j++) {
                    if (towardsArray[j].includes("$RS-")) {
                        let Shield = turnGuidance.roadShields[towardsArray[j].replace('$', '')]
                        towardsHTML += `<span class="inline-road-shield"><img class="sign-image" src="https://renderer-am.waze.com/renderer/v1/signs/${Shield.type}?text=${Shield.text}">&nbsp;<span>${Shield.direction ? Shield.direction : ''}</span></span>`
                    } else {
                        towardsHTML += `<span class="inline-free-text">${towardsArray[j]}</span>`
                    }
                }
                towardsHTML += `<\div>`
            } else {
                towardsHTML = `<div class="secondary-markup markup-placeholder">Optional guidance for the driver</div>`
            }

            /* START HTML */
            let htmlstring = `<div class="turn-preview-wrapper" style="margin: -16px -8px 5px -16px;border-radius: 4px;"><div class="turn-preview" style="border-radius: 4px;">
                                  <div>
                                      <div class="turn-preview-inner">
                                          <span class="turn-preview-arrow-wrapper">
                                              ${TurnHTML}
                                          </span>
                                          <span class="turn-preview-content">
                                              <div>XXX feet</div>
                                              <span class="exit-signs-preview">
                                                  ${SignPreviewHTML}
                                              </span>
                                              <div class="primary-markup">
                                                  ${visualInstructionHTML}
                                              </div>
                                              ${towardsHTML}
                                          </span>
                                      </div>
                                  </div>
                              </div>`
            let AdDIV = `<div id="wmersh-pc" style="margin: -10px -8px 5px -16px;background:lightgray;" data-original-title="...and users like you." ><span style="font-size:10px; margin:auto; text-align: center;display: block;">Preview Courtesy of Road Shield Helper</span></div>`
            let AdDIV2 = `<div id="wmersh-pc" style="margin: -10px -8px 5px -16px;background:lightgray;" data-original-title="HELLO" ><span style="font-size:10px; margin:auto; text-align: center;display: block;">Preview Courtesy of Road Shield Helper</span></div>`
            let emptydiv = `<div style="background:red"></div>`
            // If the next segment has no name, the first child is blank text. Swap it out for the turn-header div that's normally present.
            let toolTipDiv = document.querySelector(".tippy-box > div > div");
            if (toolTipDiv.childNodes[0].tagName != 'DIV') {
                let headerDiv = document.createElement('div');
                headerDiv.class = 'turn-header';
                toolTipDiv.replaceChild(headerDiv, toolTipDiv.childNodes[0]);
            }
            let adjacentDiv = document.querySelector(".tippy-box > div > div > div")
            // old = document.querySelector("#big-tooltip-region > div")
            adjacentDiv.insertAdjacentHTML('afterbegin',AdDIV)
            adjacentDiv.insertAdjacentHTML('afterbegin',htmlstring)
            adjacentDiv.insertAdjacentHTML('afterbegin',emptydiv)
            //document.querySelector("#big-tooltip-region > div.turn-header").remove()
            $('#wmersh-pc').tooltip({placement: "bottom",container: "body"})

            /* Start TTS Override */
            let TTShtml
            if (turnGuidance.tts) {
                TTShtml = `<div id="wmersh-tts" data-original-title="TTS Override Active" style="display: inline-block;">
                               <i class="fa fa-volume-up" aria-hidden="true" style="color: orange;font-size: 18px;margin-left: 7px;vertical-align: middle;"></i>
                           </div>`
            } else {
                TTShtml = `<div id="wmersh-tts" data-original-title="Default TTS" style="display: inline-block;">
                               <i class="fa fa-volume-up" aria-hidden="true" style="color: #72767d;font-size: 18px;margin-left: 7px;vertical-align: middle;"></i>
                           </div>`
            }
            document.querySelector(".tippy-box > div > div.turn-arrow-tooltip > div:nth-child(3) > span > wz-button").insertAdjacentHTML('afterend',TTShtml)
            $('#wmersh-tts').tooltip()
        }
    }

    function BTRObserver(){
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].id.match("tippy*")) {
                        if (_settings.TurnInstructionPreview) {
                            BuildBRTDiv()
                        }
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true });

    }
    function RSObserver() {
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    if (document.querySelector("#wz-dialog-container > div > wz-dialog") && document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu")) {
                        log("Filter Ran")
                        RegexMatch()
                        if (_settings.FilterByState) {
                            filterShields(getState())
                        }
                        if (_settings.Debug) {
                            document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-label").insertAdjacentHTML("beforeend", ` <i id="RSH_Flask" class="fas fa-flask"></i>`)
                            document.querySelector("#RSH_Flask").onclick = function(){
                                var state = prompt("Please enter state name", "");
                                log(state)
                                if (state !== null) {
                                    filterShields(state)
                                }
                            };
                        }
                    }
                }
            });
        });
        observer.observe(document.getElementById('wz-dialog-container'), { childList: true });
    }
    /*-- END Road Shields --*/

    /*-- START Turn Instruction Overrides --*/
    /*-- Broke out AddTxt(), ButtonFunctions() from ButtonPanel() to allow them to be used for segment names as well. --*/
    function AddTxt(character,element) {
        log(element)
        let v,textBefore,textAfter
        if (element.shadowRoot){
            /*-- START Segment names are nested one shadowRoot element deeper. --*/
            if (element.shadowRoot.querySelector("#text-input"))
                element = element.shadowRoot.querySelector("#text-input");
            /*-- END segment names shadowRoot element --*/
            let cursorStart = element.shadowRoot.querySelector("#id").selectionStart;
            let cursorEnd = element.shadowRoot.querySelector("#id").selectionEnd;
            v = element.shadowRoot.querySelector("#id").value;
            textBefore = v.substring(0, cursorStart);
            textAfter = v.substring(cursorEnd, v.length);
            element.value = textBefore + character + textAfter;
            $(element).trigger('input');
            element = element.shadowRoot.querySelector("#id")
        }
        let cursorStart = element.selectionStart;
        let cursorEnd = element.selectionEnd;
        v = element.value;
        textBefore = v.substring(0, cursorStart);
        textAfter = v.substring(cursorEnd, v.length);
        element.value = textBefore + character + textAfter;
        element.focus();
        $(element).trigger('input');
        element.setSelectionRange(cursorStart+character.length,cursorStart+character.length);
    }

    /*-- Added function call element "displayFor" to both ButtonFunctions() and ButtonPanel() so jQuery can target the correct button panel for selection.
      -- "TIOButtons" (for TIOs) and "segmentNameButtons" (for Segment Names) --
      -- ".panel-content" (for TIOS), ".address-edit" (for Segment Names) --
      -- Otherwise the .click() on the WMERSH-button would get added to both panels if they are both open. So a click --
      -- would add the text to both boxes in both panels. --
      -- Further, the displayFor is used when closing the Segment Name panel only when both are open. --*/
    function ButtonFunctions(displayFor) {
        log("GetLastElement Ran")
        const rootContainer = (displayFor === "segmentNameButtons") ? ".address-edit" : (displayFor === "TIOButtons") ? ".panel-content" : false;
        if (!rootContainer)
            return;
        let LastInputElement;
        $(rootContainer).click(function(){
            if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "WZ-TEXTAREA" || document.activeElement.tagName == "WZ-AUTOCOMPLETE") {
                LastInputElement = document.activeElement
                console.log(LastInputElement)
            }
        });

        $(`.WMERSH-button.insertChar[displayFor="${displayFor}"`).click(function(){AddTxt(this.value,LastInputElement)});

    }

    function ButtonPanel(displayFor) {
        let countryName = W.selectionManager.getSegmentSelection().segments[0].model.topCountry.attributes.name
        let stateName = W.selectionManager.getSegmentSelection().segments[0].model.topState.attributes.name
        let buttonHTML = ``
        function addButton(id, value) {
            buttonHTML += `<button displayFor="${displayFor}" class="WMERSH-button insertChar" type="button" id="rsh-txt-${id}" value="${value}"><span>${value}</span></button>`
        }
        if (countryName == 'United States' || countryName == 'Canada') {
            addButton('concurrent', '•')
            addButton('towards', '»')
        }
        if (countryName == 'United States') {
            addButton('north', 'Nᴏʀᴛʜ')
            addButton('south', 'Sᴏᴜᴛʜ')
            addButton('east', 'Eᴀꜱᴛ')
            addButton('west', 'Wᴇꜱᴛ')
            addButton('to', 'ᴛᴏ')
            addButton('via', 'ᴠɪᴀ')
            addButton('jct', 'ᴊᴄᴛ')
            addButton('parking', '🅿')
            addButton('airport', '✈︎')
        } else if (countryName == 'Canada') {
            if (stateName == 'Quebec') {
                addButton('nord', 'ɴᴏʀᴅ')
                addButton('sud', 'ꜱᴜᴅ')
                addButton('est', 'ᴇꜱᴛ')
                addButton('ouest', 'ᴏᴜᴇꜱᴛ')
            } else {
                addButton('north', 'ɴᴏʀᴛʜ')
                addButton('south', 'ꜱᴏᴜᴛʜ')
                addButton('east', 'ᴇᴀꜱᴛ')
                addButton('west', 'ᴡᴇꜱᴛ')
                addButton('to', 'ᴛᴏ')
                addButton('via', 'ᴠɪᴀ')
                addButton('jct', 'ᴊᴄᴛ')
            }
        }
        return `<div id="WMERSH-panel" displayFor="${displayFor}" class="wmersh-panel">
                                <div id="WMERSH-panel-header" class="panel-header">
                                    <span style="-webkit-box-flex: 1;-ms-flex-positive: 1;flex-grow: 1;">Buttons</span>
                                </div>
                                <div>
                                    <div id="WMERSH-panel-buttons">
                                        ${buttonHTML}
                                    </div>
                                </div>
                            </div>`
    }

    function TIOButtons() {
        let TTSResetButtonhtml = `
        <button class="WMERSH-button" style="display: inline-block; position: absolute; left: 44px; font-size: 12px; font-weight: 500;cursor: pointer;" type="button" id="WMERSH-TTS-reset" value="Reset"><span>Reset</span></button>`
        document.querySelector("#panel-container > div > div.turn-instructions-panel > div.panel-content > div:nth-child(5) > wz-label").insertAdjacentHTML('afterend',TTSResetButtonhtml)
        $("#WMERSH-TTS-reset").click(function(){document.querySelector("#tts").value = null});

        $("#panel-container > div > div.turn-instructions-panel").before(ButtonPanel("TIOButtons"))
        ButtonFunctions("TIOButtons")
    }

    function PanelObserver() {
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    if (document.querySelector("#panel-container > div > div") && document.querySelector("#panel-container > div > div").classList.contains("turn-instructions-panel")) {
                        log("TIO Panel Detected")
                        let countryName = W.selectionManager.getSegmentSelection().segments[0].model.topCountry.attributes.name
                        if (countryName == 'United States' || countryName == 'Canada') {
                            TIOButtons()
                        }
//                        RegexMatch2()
                    }
                }
            });
        });
        observer.observe(document.querySelector("#panel-container"), { childList: true });
    }
    /*-- END Turn Instruction Overrides --*/

    /*-- START Segment Name Buttons --*/
    function segmentNameButtons(destroy = false) {
        if (!destroy && ($('#WMERSH-panel[displayFor="segmentNameButtons"]').length === 0)) {
            let buttonsHTML = ButtonPanel('segmentNameButtons');
            $('#segment-edit-general').prepend(buttonsHTML);
            $('#WMERSH-panel').css({ 'margin-top': '0px', left: $('#sidebar').width() + 10 });
            ButtonFunctions('segmentNameButtons');
        }
        else if (destroy && ($('wz-autocomplete.street-name, wz-autocomplete.alt-street-name').length === 0)) {
            $('#WMERSH-panel[displayFor="segmentNameButtons"]').remove();
        }
    }
    function editPanelObserver() {
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const addedNode = mutation.addedNodes[i];
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if (addedNode.querySelector('wz-autocomplete.street-name, wz-autocomplete.alt-street-name'))
                            segmentNameButtons();
                    }
                }
                for (let i = 0; i < mutation.removedNodes.length; i++) {
                    const removedNode = mutation.removedNodes[i];
                    if (removedNode.nodeType === Node.ELEMENT_NODE) {
                        if (removedNode.querySelector('wz-autocomplete.street-name, wz-autocomplete.alt-street-name')) {
                            segmentNameButtons(true);
                        }
                    }
                }
            });
        });
        observer.observe(document.querySelector('#edit-panel div.contents'), {
            childList: true, attributes: false, attributeOldValue: false, characterData: false, characterDataOldValue: false, subtree: true
        });
    }
    /*-- END Segment Name Buttons --*/

    let bootsequence = ["DOM","I18n","Waze","WazeWrap"];
    function bootstrap(tries = 1) {
        if (bootsequence.length > 0) {
            log("Waiting on " + bootsequence.join(', '),0)
            if (bootsequence.indexOf("DOM") > -1) {
                bootsequence = bootsequence.filter(bs => bs !== "DOM")
                injectCss();
            }if (I18n && bootsequence.indexOf("I18n") > -1) {
                bootsequence = bootsequence.filter(bs => bs !== "I18n")
                initializei18n();
            }if (W && W.map && W.model && bootsequence.indexOf("Waze") > -1) {
                bootsequence = bootsequence.filter(bs => bs !== "Waze")
                RSObserver();
                PanelObserver();
                BTRObserver();
            }if (WazeWrap.Ready) {
                bootsequence = bootsequence.filter(bs => bs !== "WazeWrap")
                initTab();
                initializeSettings();
                editPanelObserver();
            }
            setTimeout(() => bootstrap(tries++), 200);
        }
    }
    bootstrap()
})();
