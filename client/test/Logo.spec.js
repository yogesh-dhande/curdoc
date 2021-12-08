import Card from "@/components/Card.vue";
import { mount } from "@vue/test-utils";

describe("Card", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(Card);
    expect(wrapper.vm).toBeTruthy();
  });
});
