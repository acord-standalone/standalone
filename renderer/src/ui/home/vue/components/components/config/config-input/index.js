import events from "../../../../../../../api/events/index.js";

export default {
  /** @param {import("vue").App} vueApp */
  load(vueApp) {
    vueApp.component("config-input", {
      props: ["item", "extension"],
      template: `
        <div v-show="item?.visible ?? true" class="acord--config-input acord--config-item">
          <discord-input @change="onChange" v-model="item.value" :type="item.inputType" :placeholder="item.placeholder" :maxlength="item.maxlength" />
        </div>
      `,
      methods: {
        onChange(data) {
          events.emit(
            "extension-config-interaction",
            {
              extension: this.extension,
              item: this.item,
              data
            }
          )
        }
      }
    });
  }
}