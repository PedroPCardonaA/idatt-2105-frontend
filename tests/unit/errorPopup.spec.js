import { shallowMount } from "@vue/test-utils";
import ErrorPopup from "@/components/ErrorPopup.vue";

describe("ErrorPopup.vue", () => {
  it("Renders correctly", () => {
    const wrapper = shallowMount(ErrorPopup, {
        props: {
            message: "",
          },
      global: {
        //Simulate the $t and $i18n properties
        mocks: {
          $t: (msg) => msg, 
          $i18n: { locale: "en" }, 
        },
      },
    })

    //Checks that the component contains the expected text
    expect(wrapper.html()).toContain("error-popup")
    expect(wrapper.html()).toContain("error-popup-message")
  })

  it("Renders correctly with property message", () => {
    const wrapper = shallowMount(ErrorPopup, {
        props: {
            message: "Test message",
          },
      global: {
        //Simulate the $t and $i18n properties
        mocks: {
          $t: (msg) => msg, 
          $i18n: { locale: "en" }, 
        },
      },
    })

    //Checks that the component contains the expected text
    expect(wrapper.html()).toContain("Test message")
  })
})
