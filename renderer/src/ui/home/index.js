import dom from "../../api/dom/index.js";
import webpack from "../../api/modules/webpack.js";
import patcher from "../../api/patcher/index.js";
import utils from "../../api/utils/index.js";
import i18n from "../../api/i18n/index.js";

import cssText from "./style.scss";
import { getLocalized } from "../../other/utils.js";
patcher.injectCSS(cssText);

{
  let script = document.createElement("script");
  script.src = "https://unpkg.com/vue@3/dist/vue.global.js";
  document.head.appendChild(script);
}

dom.patch('a[href="/store"][data-list-item-id$="___nitro"]', (elm) => {
  utils.ifExists(
    elm.querySelector('[class*="nameAndDecorators-"] [class*="name-"]'),
    (nameElm) => {
      nameElm.textContent = i18n.format("APP_NAME");
    }
  );

  utils.ifExists(
    elm.querySelector('[class*="avatarWithText-"] [class*="avatar-"] svg'),
    fillSVGElmWithAcordLogo
  );
});

let internalVueApp = null;

const headerItemClasses = webpack.findByProperties("divider", "hamburger", "themed");
const tabBarClasses = webpack.findByProperties("tabBar", "maxWidthWithToolbar");
const headerClasses = webpack.findByProperties("topPill", "headerText");
dom.patch('[class*="applicationStore-"] [class*="homeWrapperNormal-"]', (elm) => {
  utils.ifExists(
    elm.querySelector('[class*="headerBar-"] [class*="titleWrapper-"] [class*="title-"]'),
    (titleElm) => {
      titleElm.textContent = i18n.format("APP_NAME");

      if (internalVueApp) {
        let container = dom.parents(titleElm, 2).pop();

        container.appendChild(
          dom.parse(`<div class="${headerItemClasses.divider}"></div>`)
        );

        const buttonsContainer = dom.parse(`
          <div class="${tabBarClasses.tabBar} ${headerClasses.topPill}">
          </div>
        `);

        let buttons = [];

        function buildButton(id, text, customClasses = "") {
          let elm = dom.parse(`<div id="tab-button-${id}" class="acord--tabs-tab-button ${customClasses} ${tabBarClasses.item} ${headerClasses.item} ${headerClasses.themed}">${text}</div>`);

          buttons.push(elm);

          elm.setSelected = (s) => {
            if (s) elm.classList.add(headerClasses.selected, "selected");
            else elm.classList.remove(headerClasses.selected, "selected");
          }

          elm.setSelected(internalVueApp.selectedTab === id);

          elm.onclick = () => {
            buttons.forEach((b) => b.setSelected(false));
            elm.setSelected(true);
            internalVueApp.selectedTab = id;
          }
          return elm;
        }

        buttonsContainer.appendChild(buildButton("home", i18n.format("HOME")));
        buttonsContainer.appendChild(buildButton("installed-extensions", i18n.format("INSTALLED_EXTENSIONS")));
        buttonsContainer.appendChild(buildButton("settings", i18n.format("SETTINGS")));
        buttonsContainer.appendChild(buildButton("store", i18n.format("EXTENSION_STORE"), "store-tab-button"));

        container.appendChild(buttonsContainer);
      }
    }
  );
  utils.ifExists(
    elm.querySelector('[class*="headerBar-"] [class*="iconWrapper-"] [class*="icon-"]'),
    fillSVGElmWithAcordLogo
  );
});

function fillSVGElmWithAcordLogo(svgElm) {
  svgElm.setAttribute("viewBox", "0 0 813.5 1493");
  svgElm.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElm.innerHTML = `
    <defs>
      <style>
        .acord--logo-color {
          fill: currentColor;
          fill-rule: evenodd;
        }
      </style>
    </defs>
    <g>
      <path class="acord--logo-color" d="M817.266,1322.5h285v365h-285v-365Z" transform="translate(-553.25 -213.5)"/>
      <path class="acord--logo-color" d="M555.235,1523.78s91.169-319.85,92.531-319.28c114.7,47.83,160,192,160,192l-52.12,186.61s-31.129,137.71-80.88,120.39C528.026,1652.42,555.235,1523.78,555.235,1523.78Z" transform="translate(-553.25 -213.5)"/>
      <path class="acord--logo-color" d="M1364.77,1525.28s-91.17-319.85-92.54-319.28c-114.7,47.83-160,192-160,192l52.12,186.61s31.13,137.71,80.88,120.39C1391.97,1653.92,1364.77,1525.28,1364.77,1525.28Z" transform="translate(-553.25 -213.5)"/>
    </g>
    <path class="acord--logo-color" d="M874.766,275.5s14.579-61.918,87-62c80.824-.092,87,62,87,62s199.43,851.47,198,852c-210.33,77.71-146,180-146,180h-281s63.7-103.82-146-181C671.014,1125.49,874.766,275.5,874.766,275.5Z" transform="translate(-553.25 -213.5)"/>
    <g>
      <path class="acord--logo-color" d="M1238.14,897.5a53.882,53.882,0,0,1,53.88,53.875c0,24.939-20.25,46.987-43.25,53.125-4.45,1.18-10.19-39-11-39-0.58,0-27.71,3.51-31,4-5.58.828-11.93-13.876-4-20,1.93-1.491,26.62-6.959,29-7,0.62-.011-7.34-41.618-7-43C1225.64,895.944,1233.52,897.5,1238.14,897.5Z" transform="translate(-553.25 -213.5)"/>
      <path class="acord--logo-color" d="M1173.64,632.5a53.882,53.882,0,0,1,53.88,53.875c0,24.939-20.25,46.987-43.25,53.125-4.45,1.185-10.19-39-11-39-0.58,0-27.71,3.51-31,4-5.58.828-11.93-13.876-4-20,1.93-1.491,26.62-6.959,29-7,0.62-.011-7.34-41.618-7-43C1161.14,630.944,1169.02,632.5,1173.64,632.5Z" transform="translate(-553.25 -213.5)"/>
      <path class="acord--logo-color" d="M1115.16,373a53.874,53.874,0,0,1,53.87,53.875c0,24.939-20.24,46.987-43.25,53.125-4.44,1.185-10.18-39-11-39-0.58,0-27.7,3.51-31,4-5.57.828-11.92-13.876-4-20,1.93-1.491,26.62-6.959,29-7,0.62-.011-7.34-41.618-7-43C1102.65,371.444,1110.53,373,1115.16,373Z" transform="translate(-553.25 -213.5)"/>
    </g>
    <g>
      <path class="acord--logo-color" d="M683.922,897.75a53.875,53.875,0,0,0-53.875,53.875c0,24.939,20.245,46.987,43.25,53.125,4.441,1.18,10.185-39,11-39,0.576,0,27.7,3.51,31,4,5.572,0.828,11.926-13.876,4-20-1.93-1.491-26.621-6.959-29-7-0.62-.011,7.339-41.618,7-43C696.424,896.194,688.544,897.75,683.922,897.75Z" transform="translate(-553.25 -213.5)"/>
      <path class="acord--logo-color" d="M748.422,632.75a53.875,53.875,0,0,0-53.875,53.875c0,24.939,20.245,46.987,43.25,53.125,4.441,1.185,10.185-39,11-39,0.576,0,27.7,3.51,31,4,5.572,0.828,11.926-13.876,4-20-1.93-1.491-26.621-6.959-29-7-0.62-.011,7.339-41.618,7-43C760.924,631.194,753.044,632.75,748.422,632.75Z" transform="translate(-553.25 -213.5)"/>
      <path class="acord--logo-color" d="M806.906,373.25a53.875,53.875,0,0,0-53.875,53.875c0,24.939,20.245,46.987,43.25,53.125,4.442,1.185,10.185-39,11-39,0.577,0,27.7,3.51,31,4,5.572,0.828,11.926-13.876,4-20-1.93-1.491-26.621-6.959-29-7-0.62-.011,7.339-41.618,7-43C819.409,371.694,811.528,373.25,806.906,373.25Z" transform="translate(-553.25 -213.5)"/>
    </g>
  `;
}


(async () => {
  while (true) {
    if (window.Vue) break;
    await utils.sleep(100);
  }

  const baseVueElm = dom.parse(`
    <div class="acord--tabs-content-container">
      <div v-if="selectedTab === 'home'" class="tab-content home">
        <h1>Home Todo</h1>
      </div>
      <div v-if="selectedTab === 'installed-extensions'" class="tab-content installed-extensions">
        <h1>Installed Extensions</h1>
      </div>
      <div v-if="selectedTab === 'store'" class="tab-content store">
        <h1>Store</h1>
      </div>
      <div v-if="selectedTab === 'settings'" class="tab-content settings">
        <h1>Settings</h1>
      </div>
    </div>
  `);

  /** @type {import("vue").App} */
  const vueApp = Vue.createApp({
    data() {
      return {
        selectedTab: "home",
        installedExtensions: [
          {
            type: "plugin",
            url: "",
            name: {
              default: "Test Plugin",
              tr: "Deneme Plugin",
            },
            description: {
              default: "Test Plugin description..",
              tr: "Deneme Plugin açıklaması..",
            },
            previews: [
              {
                name: "Test Plugin Preview",
                image: "https://i.imgur.com/TtfjHeP.png",
              },
              {
                name: "Test Plugin Preview 2",
                image: "https://i.imgur.com/0Z0Z0Z0.png",
              }
            ],
            authors: [
              {
                id: "707309693449535599",
                name: "Armagan#2448",
                image: "https://i.imgur.com/rSLVd23.png"
              }
            ],
            version: "1.0.0",
            readme: "### Test Plugin readme..",
            installed: true
          }
        ],
      };
    },
    methods: {

    },
    computed: {
      installedPlugins() {
        return this.installedExtensions.filter((ext) => ext.type === "plugin");
      },
      installedThemes() {
        return this.installedExtensions.filter((ext) => ext.type === "theme");
      }
    },
    mounted() {
      internalVueApp = this;
    }
  });

  vueApp.component(
    "extension-card",
    {
      template: `
        <div class="extension-card">
          <div class="preview-container" :style="{ backgroundImage: 'url(' + extension.previews[selectedPreview].image + ')' }">
            <div class="go-back">&gt;</div>
            <div class="go-forward">&lt;</div>
            <div class="name">{{ getLocalized(extension.previews[selectedPreview].name) }}</div>
          </div>
          <div class="info-container">
            <div class="top">
              <div class="name-container">
                <div class="name">{{ getLocalized(extension.name) }}</div>
                <div class="version">{{ extension.version }}</div>
              </div>
              <div class="description">{{ getLocalized(extension.description) }}</div>
            </div>
            <div class="bottom">
              <div class="left">
                <div class="authors">
                  <div v-for="author in extension.authors" class="author">
                    <div :style="{ backgroundImage: 'url(' + author.image + ')' }"></div>
                    <div class="name">{{ author.name }}</div>
                  </div>
                </div>
              </div>
              <div class="right">
                <div class="buttons">
                  <div class="button" @click="installOrUninstall">{{i18nFormat(extensions.installed ? 'UNINSTALL' : 'INSTALL')}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      props: ["extension"],
      data() {
        return {
          selectedPreview: 0,
        };
      },
      methods: {
        getLocalized,
        i18nFormat: i18n.format,
        installOrUninstall() {
          if (this.extension.installed) {
            // uninstall
          } else {
            // install
          }
        }
      }
    }
  )

  vueApp.mount(baseVueElm);

  dom.patch('[class*="applicationStore-"] [class*="scrollerBase-"] [class*="subscriptionsRedirectContainer-"]', (elm) => {
    /** @type {HTMLDivElement} */
    let containerElm = dom.parents(elm, 4).pop();
    containerElm.replaceChildren(baseVueElm);
  });
})();



