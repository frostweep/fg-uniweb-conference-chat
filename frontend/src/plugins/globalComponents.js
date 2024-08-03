import { FormGroupInput, Card, DropDown, Button } from "../components/index";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */
import { GooglePayButton } from 'vue-google-pay'

const GlobalComponents = {
  install(Vue) {
    Vue.component("fg-input", FormGroupInput);
    Vue.component("drop-down", DropDown);
    Vue.component("card", Card);
    Vue.component("p-button", Button);
    Vue.component("google-pay-button", GooglePayButton);
  }
};

export default GlobalComponents;
