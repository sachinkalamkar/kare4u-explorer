/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { HeaderView } from "./HeaderView";

jest.useFakeTimers();

const setup = () => {
  const props = {
    channel: { currentChannel: 'mychannel' },
    channelList: ['mychannel'],
    channels:[  {
      "id": 3,
      "channelname": "mychannel",
      "blocks": 5,
      "genesis_block_hash": null,
      "transactions": 5,
      "createdat": "2018-06-18T14:30:32.000Z",
      "channel_hash": "3406510bd4d8105683f340451418df018b661fb8461deb4ec62e7dfd6a2a6cfc"
    }],
    classes: {
      margin: "Connect-HeaderView--margin-1",
      padding: "Connect-HeaderView--padding-2"
    },
    notification: {},
    getBlockList: jest.fn(),
    getBlocksPerHour: jest.fn(),
    getBlocksPerMin: jest.fn(),
    getChaincodeList: jest.fn(),
    getChangeChannel: jest.fn(),
    getChannelList: jest.fn(),
    getChannels: jest.fn(),
    getDashStats: jest.fn(),
    getNotification: jest.fn(),
    getPeerList: jest.fn(),
    getPeerStatus: jest.fn(),
    getTransactionByOrg: jest.fn(),
    getTransactionList: jest.fn(),
    getTransactionPerHour: jest.fn(),
    getTransactionPerMin: jest.fn(),
    refresh: jest.fn()
  };

  const wrapper = shallow(<HeaderView {...props} />);

  return {
    props,
    wrapper
  };
};

describe("HeaderView", () => {
  test("HeaderView component should render", () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
  });

  test("toggle changes the state of isOpen", () => {
    const { wrapper } = setup();
    expect(wrapper.state("isOpen")).toBe(false);
    wrapper.instance().toggle();
    expect(wrapper.state("isOpen")).toBe(true);
    wrapper.instance().toggle();
    expect(wrapper.state("isOpen")).toBe(false);
  });

  test("handleData sets notification", () => {
    const { wrapper, props } = setup();
    const notification =
      '{"title":"Block 12 Added","type":"block","message":"Block 12 established with 3 tx","time":"2018-05-30T21:15:09.000Z","txcount":3,"datahash":"07ff8fa88e8c8412daa15ae0ecec80b47293a452165d00213ec08811c9fd88e7"}';
    expect(wrapper.state("notifyCount")).toBe(0);
    wrapper.instance().handleData(notification);
    expect(wrapper.state("notifications").length).toBe(1);
    expect(wrapper.state("notifyCount")).toBe(1);
  });

  test("handleChange sets selectedChannel and calls changeChannel", async () => {
    const { wrapper, props } = setup();
    const selectedChannel = { value: "newChannel" };
    await wrapper.instance().handleChange(selectedChannel);
    expect(wrapper.state("selectedChannel").value).toBe("newChannel");
    expect(props.getChangeChannel).toHaveBeenCalled();
  });

  test("handleOpen sets modalOpen to true", () => {
    const { wrapper } = setup();
    expect(wrapper.state("modalOpen")).toBe(false);
    wrapper.instance().handleOpen();
    expect(wrapper.state("modalOpen")).toBe(true);
  });

  test("handleClose sets modalClose to false", () => {
    const { wrapper } = setup();
    expect(wrapper.state("modalOpen")).toBe(false);
    wrapper.setState({ modalopen: true });
    wrapper.instance().handleClose();
    expect(wrapper.state("modalOpen")).toBe(false);
  });

  test("handleDrawOpen sets the corresponding state to true", () => {
    const { wrapper } = setup();
    wrapper.instance().handleDrawOpen();
    expect(wrapper.state("notifyDrawer")).toBe(false);
    expect(wrapper.state("adminDrawer")).toBe(false);
    let drawer = "notifyDrawer";
    wrapper.instance().handleDrawOpen(drawer);
    expect(wrapper.state("notifyDrawer")).toBe(true);
    drawer = "adminDrawer";
    wrapper.instance().handleDrawOpen(drawer);
    expect(wrapper.state("adminDrawer")).toBe(true);
  });

  test("handleDrawClose sets the corresponding state to false", () => {
    const { wrapper } = setup();
    wrapper.instance().handleDrawClose();
    expect(wrapper.state("notifyDrawer")).toBe(false);
    expect(wrapper.state("adminDrawer")).toBe(false);
    let drawer = "notifyDrawer";
    wrapper.setState({ notifyDrawer: true });
    wrapper.instance().handleDrawClose(drawer);
    expect(wrapper.state("notifyDrawer")).toBe(false);
    drawer = "adminDrawer";
    wrapper.setState({ adminDrawer: true });
    wrapper.instance().handleDrawClose(drawer);
    expect(wrapper.state("adminDrawer")).toBe(false);
  });

  test("click on bell should set state notifyDrawer to true", () => {
    const { wrapper } = setup();
    wrapper.find(".bell").simulate("click");
    expect(wrapper.state("notifyDrawer")).toBe(true);
  });

  test("click on cog should set state adminDrawer to true", () => {
    const { wrapper } = setup();
    // To be used when admin functionality is available
    // wrapper.find('.cog').simulate('click')
    // expect(wrapper.state('adminDrawer')).toBe(true);
  });

  test("notifyDrawer onClose sets state to false", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, "handleDrawClose");
    wrapper.setState({ notifyDrawer: true });
    wrapper
      .find("WithStyles(Drawer)")
      .at(0)
      .simulate("close");
    expect(wrapper.state("notifyDrawer")).toBe(false);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("adminDrawer onClose sets state to false", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, "handleDrawClose");
    wrapper.setState({ adminDrawer: true });
    wrapper
      .find("WithStyles(Drawer)")
      .at(1)
      .simulate("close");
    expect(wrapper.state("adminDrawer")).toBe(false);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("handleThemeChange toggles isLight", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();
    // expect(wrapper.state("isLight")).toBe(true);
    instance.handleThemeChange();
    // expect(wrapper.state("isLight")).toBe(false);
  });
  // 71.19 |       75 |    72.73 |    72.41
  test("componentWillReceiveProps calls syncData", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, "syncData");
    const newChannel = "newChannel";
    wrapper.setProps({ currentChannel: newChannel });
    expect(spy).toHaveBeenCalled();
  });

  test("componentDidMount calls setInterval", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, "syncData");
    expect(setInterval).toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    expect(spy).toHaveBeenCalled();
  });

  test("switch calls handleThemeChange", () => {
    const { wrapper } = setup();
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, "handleThemeChange");
    wrapper.setState({ adminDrawer: true });
    wrapper
      .find("WithStyles(Switch)")
      .at(0)
      .simulate("change");
    expect(wrapper.state("isLight")).toBe(false);
    expect(spy).toHaveBeenCalled();
  });
});
