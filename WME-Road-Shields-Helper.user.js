// ==UserScript==
// @name         WME Road Shield Helper Nightly
// @namespace    https://github.com/thecre8r/
// @version      2021.07.06.0101
// @description  Observes for the modal
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/editor*
// @include      https://beta.waze.com/*/editor*
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
                                        //{"version": "2021.06.01.02","changes": ""},
    const SCRIPT_HISTORY = `{"versions": [{"version": "2021.07.06.01","changes": "Added Buttons to Turn Instructions and a few more states are compatible"},{"version": "2021.06.12.01","changes": "Support for Illinois CH Road Shields, a few more SH- States, a few more SR- States, and Arkansas's Shield Name Suffixes"},{"version": "2021.06.05.01","changes": "Support for Missouri Supplemental Road Shields"},{"version": "2021.06.03.02","changes": "Support for Kansas K-xxx format"},{"version": "2021.06.03.01","changes": "Added CR support for states using hexagon type shields"},{"version": "2021.06.02.01","changes": "Added SR Shield for New Hampshire"},{"version": "2021.06.01.02","changes": "Added County Shields for Wisconsin<br>Updated Changelog Format"},{"version": "2021.06.01.01","changes": "Fixed GitHub URL"},{"version": "2021.05.31.01","changes": "Added Wisconsin and other miscellaneous fixes"},{"version": "2021.05.23.01","changes": "Initial Version"}]}`;
    const GH = {link: 'https://github.com/TheCre8r/WME-Road-Shield-Helper/', issue: 'https://github.com/TheCre8r/WME-Road-Shield-Helper/issues/new', wiki: 'https://github.com/TheCre8r/WME-Road-Shield-Helper/wiki'};
    const UPDATE_ALERT = true;

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
                settings_1: 'Enable Debug Mode',
            },
            es: {
                tab_title: `${SCRIPT_NAME}`,
                report_an_issue: 'Reportar Un Problema En GitHub',
                help: 'Ayuda',
                filter_by_state: `Filtros de Escudos Por Estado`,
                settings_1: 'Habilitar el modo de Limpiar',
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
            '.WMERSH-Button {font-family:"Rubik","Boing-light",sans-serif,FontAwesome;padding-left:10px;padding-right:10px;margin-top:0px;z-index: 3;}',
            '#WMERSH-Autofill {position:absolute;top: 14px;right: 14px;font-size:20px;}',
            '#WMERSH-panel-buttons {background: black;color: white;height: 225px;border-bottom-right-radius: 5px;border-bottom-left-radius: 5px;}',
            '#WMERSH-Message {position:absolute;top: 323px;left: 24px;font-size: 14px;}',
            '#WMERSH-Message.Error {color:red}',
            '#WMERSH-Message.Alert {color:orange}',
            '.rsh-button {padding: 2px; height: 10px; width: 10px;}',
            '#WMERSH-panel {width: 80px;background: white;border-radius: 5px;position: absolute;z-index: 4;left: 340px;margin-top: 155px;-webkit-box-shadow: 0 2px 3px 0 rgb(60 64 67 / 30%), 0 6px 10px 4px rgb(60 64 67 / 15%);box-shadow: 0 2px 3px 0 rgb(60 64 67 / 30%), 0 6px 10px 4px rgb(60 64 67 / 15%);}',
            '#WMERSH-panel-header {font-family: &quot;Boing-medium&quot;, sans-serif;font-size: 16px;line-height: 24px;font-weight: 400;height: 31px;display: -webkit-box;display: -ms-flexbox;display: flex;border-bottom: 1px solid #e8eaed;padding: 6px;text-align: center;}',
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
        new WazeWrap.Interface.Tab('WMERSH', $section.html(), function(){});
        $('a[href$="#sidepanel-wmersh"]').html(`<span>`+svglogo+`</span>`)
        $('a[href$="#sidepanel-wmersh"]').prop('title', 'WME RSF');
        log("Tab Initialized",1);
    }

    let TESTERS = ["The_Cre8r","jm6087","s18slider","locojd1","SethSpeedy28","nzahn1","doctorkb","turnertr","sketch","phuz"];

    function setChecked(checkboxId, checked) {
        $('#WMERSH-' + checkboxId).prop('checked', checked);
    }

    /*-- Start Settings --*/
    function loadSettings() {
        let loadedSettings = $.parseJSON(localStorage.getItem(STORE_NAME));
        let defaultSettings = {
            FilterByState: true,
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
        let regex = /(?:((?:(?:[A-Z]+)(?=\-))|(?:Parish Rd))(?:-|\ )((?:[A-Z]+)|(?:\d+(?:[A-Z])?(?:-\d+)?)))?(?: (BUS|ALT|BYP|CONN|SPUR|TRUCK))?(?: (N|E|S|W))?(?: • (.*))?/;
        let SHStates = ['Colorado', 'Minnesota', 'Oklahoma', 'Texas'];
        let SRStates = ['Alabama', 'Arizona', 'California', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Illinois', 'Massachusetts', 'New Hampshire', 'New Mexico', 'Ohio', 'Pennsylvania', 'Utah', 'Washington'];
        let CRStates = ['Alabama', 'Arkansas', 'Florida', 'Louisiana', 'New Jersey', 'New York'];
        let DoneStates = ["North Carolina","New Jersey"].concat(SRStates);
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
            case "CH":
                if (State == "Wisconsin") {
                    MakeShield(match,State,"County");
                } else if (State == "Illinois") {
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
                } else {
                    CreateError(`Warning: CR design for this state has not been defined. <br>Consult local guidance and <a target="_blank" href="${GH.issue}" id="WMERSH-report-an-issue">${I18n.t(`wmersh.report_an_issue`)}</a>`,`Error`);
                }
                break;
            case "H":
            case "I":
                switch (match[3] ) {
                    case "BUS":
                        document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="I-# BUS"]`).click()
                        break;
                    default:
                        document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Interstate Main"]`).click()
                        break;
                }
                break;
            case "K":
                if (State == "Kansas") {
                    MakeShield(match,State);
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
                    CreateError(`Warning: State Shield Not Verified.<br>Consult local guidance and <a target="_blank" href="${GH.issue}" id="WMERSH-report-an-issue">${I18n.t(`wmersh.report_an_issue`)}</a>`,`Error`)
                }
                if (SRStates.indexOf(State)>= 0) {
                    MakeShield(match,State);
                } else if (State == "North Carolina") {
                    CreateError(`Error: ${State} does not use road shields for Secondary Routes`,`Error`);
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
            case "US":
                if (match[3] == undefined) {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US Hwy Main"]`).click()
                } else if ((match[3] == "ALT" | match[3] == "BUS" | match[3] == "SPUR" | match[3] == "TRUCK") && State == "Arkansas"){
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US Hwy Main"]`).click()
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
            default:
                MakeShield(match)
                break;
        }
        if (!document.querySelector(`#WMERSH-Message`)){
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
                    shieldDirectionInput.value = "Eᴀsᴛ" //East
                    break;
                case "S":
                    shieldDirectionInput = "Sᴏᴜᴛʜ" //South
                    break;
                case "W":
                    shieldDirectionInput = "Wᴇsᴛ" //West
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
        let country = W.model.getTopCountry().name
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
                            document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-label").insertAdjacentHTML("beforeend", ` <i id="RSF_Test" class="fas fa-flask"></i>`)
                            document.querySelector("#RSF_Test").onclick = function(){
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

    function TIOButtons() {
        function AddTxt(character,element) {
            log(element)
            let v,textBefore,textAfter
            if (element.shadowRoot){
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

        function ButtonFunctions() {
            log("GetLastElement Ran")
            let LastInputElement;
            $(".panel-content").click(function(){
                if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "WZ-TEXTAREA") {
                    LastInputElement = document.activeElement
                    console.log(LastInputElement)
                }
            });

            $("#rsh-txt-concurrent").click(function(){AddTxt("•",LastInputElement)}); //Alt + 7
            $("#rsh-txt-towards").click(function(){AddTxt("»",LastInputElement)}); //Alt + 175
            $("#rsh-txt-north").click(function(){AddTxt("Nᴏʀᴛʜ",LastInputElement)});
            $("#rsh-txt-south").click(function(){AddTxt("Sᴏᴜᴛʜ",LastInputElement)});
            $("#rsh-txt-east").click(function(){AddTxt("Eᴀsᴛ",LastInputElement)});
            $("#rsh-txt-west").click(function(){AddTxt("Wᴇsᴛ",LastInputElement)});
            $("#rsh-txt-to").click(function(){AddTxt("ᴛᴏ",LastInputElement)});
            $("#rsh-txt-via").click(function(){AddTxt("ᴠɪᴀ",LastInputElement)});
            $("#rsh-txt-jct").click(function(){AddTxt("ᴊᴄᴛ",LastInputElement)});

        }
        let buttonstring = `<div id="WMERSH-panel" class="show wmersh-panel">
                                <div id="WMERSH-panel-header" class="panel-header">
                                    <span style="-webkit-box-flex: 1;-ms-flex-positive: 1;flex-grow: 1;">Buttons</span>
                                </div>
                                <div id="WMERSH-panel-buttons">
                                   <div style="position: absolute;z-index: 10;margin: 10px;">
                                        <wz-button class="hydrated rsh-button" id="rsh-txt-concurrent">•</wz-button><br>
                                        <wz-button class="hydrated rsh-button" id="rsh-txt-towards">»</wz-button><br>
                                        <wz-button class="hydrated rsh-button" id="rsh-txt-north">Nᴏʀᴛʜ</wz-button><br>
                                        <wz-button class="hydrated rsh-button" id="rsh-txt-south">Sᴏᴜᴛʜ</wz-button><br>
                                        <wz-button class="hydrated rsh-button" id="rsh-txt-east">Eᴀsᴛ</wz-button><br>
                                        <wz-button class="hydrated rsh-button" id="rsh-txt-west">Wᴇsᴛ</wz-button><br>
                                        <wz-button class="hydrated rsh-button" id="rsh-txt-to">ᴛᴏ</wz-button><br>
                                        <wz-button class="hydrated rsh-button" id="rsh-txt-via">ᴠɪᴀ</wz-button><br>
                                        <wz-button class="hydrated rsh-button" id="rsh-txt-jct">ᴊᴄᴛ</wz-button>
                                    </div>
                                </div>
                            </div>`
        $("#panel-container > div > div.turn-instructions-panel").before(buttonstring)
        ButtonFunctions()
    }
    function RegexMatch2() {
        if (TESTERS.indexOf(W.loginManager.user.userName) > -1) {
        let htmlstring = `<div id="WMERSH-TIO-Autofill"><wz-button class="hydrated">Autofill</wz-button></div>`
        document.querySelector("#panel-container > div > div.turn-instructions-panel").insertAdjacentHTML('afterbegin',htmlstring)
            document.querySelector("#WMERSH-TIO-Autofill").onclick = function(){
                //let exittext = document.querySelector("#panel-container > div > div > div.panel-content > div:nth-child(1) > div > div > div > span > span > input[type=text]").value
                let exittext = document.querySelector("#tts").shadowRoot.querySelector("#id").placeholder
                let regex = /(Exits?) (\d+(?:.*)?): (.*)/
                let regex2 = /(?:((?:[A-Z]+)(?=\-))-((?:[A-Z]+)|(?:\d+(?:[A-Z])?(?:-\d+)?)))?(?: (BUS|ALT|BYP|CONN|SPUR|TRUCK))?(?: (N|E|S|W))?/;
                let match = exittext.match(regex);
                let match2

                /** Start Add Exit Arrow **/
                if (match[1].includes("Exit")) {
                    if ($('.exit-sign-item').length == 0) {
                        document.querySelector("#panel-container > div > div > div.panel-content > div:nth-child(3) > div > wz-button").shadowRoot.querySelector("button").click()
                    }
                    if (document.querySelector("#turn-override-select").shadowRoot.querySelector("#select-wrapper > div > div > span").innerText == "Exit left") {
                        document.querySelector("#panel-container > div > div > div.panel-content > div:nth-child(3) > div > div > div > span > span > wz-menu > wz-menu-item:nth-child(2) > img").click()
                    } else {
                        document.querySelector("#panel-container > div > div > div.panel-content > div:nth-child(3) > div > div > div > span > span > wz-menu > wz-menu-item:nth-child(1) > img").click()
                    }
                }
                /** End Add Exit Arrow **/

                /** Start Visual Instructions **/
                document.querySelector("#text").value = match[2] //Exit signs
                let Strings = match[3].split(" / ");
                if (match[3]) {
                    match2 = match[3].match(regex2);
                    console.log(match2)
                }
                document.querySelector("#panel-container > div > div > div.panel-content > div:nth-child(1) > div > div > div > span:nth-child(1) > span > i").click()
                Strings.forEach(function(item, index){
                    let match2 = item.match(regex2);
                    if (match2[1] && match2[2]) {
                        console.log(match2)
                        document.querySelector("#panel-container > div > div > div.panel-content > div:nth-child(1) > div > wz-menu > wz-menu-item:nth-child(1)").click()
                        //document.querySelector(`#panel-container > div > div > div.panel-content > div:nth-child(1) > div > div > div > span:nth-child(${index+1}) > span > input[type=text]`).value = item;
                        document.querySelector(`#panel-container > div > div > div.panel-content > div:nth-child(1) > div > div > div > span:nth-child(${index+1}) > span > wz-menu > wz-menu-item:nth-child(1)`).click()
                        //document.querySelector("#panel-container > div > div > div.panel-content > div:nth-child(1) > div > div > div > span > span > wz-menu > wz-menu-item:nth-child(1)").click()
                        $("input#direction").trigger('input');
                    } else {
                        document.querySelector("#panel-container > div > div > div.panel-content > div:nth-child(1) > div > wz-menu > wz-menu-item:nth-child(2)").click()
                        document.querySelector(`#panel-container > div > div > div.panel-content > div:nth-child(1) > div > div > div > span:nth-child(${index+1}) > span > input[type=text]`).value = item;
                        $(`#panel-container > div > div > div.panel-content > div:nth-child(1) > div > div > div > span:nth-child(${index+1}) > span > input[type=text]`).trigger('input');
                    }
                    console.log(index);
                    console.log(item);

                });
                $('input#text').trigger('input');
                /** End Visual Instructions **/

            };
        }
    }

    function PanelObserver() {
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    if (document.querySelector("#panel-container > div > div") && document.querySelector("#panel-container > div > div").classList.contains("turn-instructions-panel")) {
                        log("TIO Panel Detected")
                        TIOButtons()
                        RegexMatch2()
                    }
                }
            });
        });
        observer.observe(document.querySelector("#panel-container"), { childList: true });
    }
    /*-- END Turn Instruction Overrides --*/

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
            }if (WazeWrap.Ready) {
                bootsequence = bootsequence.filter(bs => bs !== "WazeWrap")
                initTab();
                initializeSettings();
            }
            setTimeout(() => bootstrap(tries++), 200);
        }
    }
    bootstrap()
})();
