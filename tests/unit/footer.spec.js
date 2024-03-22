import { shallowMount } from "@vue/test-utils";
import Footer from "@/components/Footer.vue";

describe("Footer.vue", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(Footer, {
      global: {
        //Simulate the $t and $i18n properties
        mocks: {
          $t: (msg) => msg, 
          $i18n: { locale: "en" }, 
        },
      },
    })

    //Checks that the component contains the expected text
    expect(wrapper.html()).toContain("Links")
    expect(wrapper.html()).toContain("Social")
    expect(wrapper.html()).toContain("Legal")
    expect(wrapper.html()).toContain("Instagram")
    expect(wrapper.html()).toContain("Twitter")
    expect(wrapper.html()).toContain("Facebook")
  })
})
