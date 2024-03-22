import { shallowMount } from "@vue/test-utils"
import Title from "@/components/Title.vue"

const $t = () => {}

//Mocks tests for the title component
describe("Title.vue", () => {
  it("Renders the title component correctly", () => {

    const wrapper = shallowMount(Title, {
      global: {
        //Simulate the $t and $i18n properties
        mocks: {
          $t: (msg) => msg, 
          $i18n: { locale: "en" }, 
        },
      },
    })
    expect(wrapper.html()).toContain("<h1")
  });
  
});