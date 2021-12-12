import splitbee from "@splitbee/web";

export default (_, inject) => {
  splitbee.init();
  inject("splitbee", splitbee);
};
