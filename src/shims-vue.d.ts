declare module "*.vue" {
  import { Modal } from "vue";
  const component: Modal<{}, {}, any>;
  export default component;
}
