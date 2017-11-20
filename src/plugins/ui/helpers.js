let zIndex = {
    statusbar: 100,
    sidebar: 90,
    overlayHandles: 80,
    toolbar: 60,
    altbar: 70
};

function deviceCheck(parent, child) {
    if (child.props.mobileOnly && !parent.props.appIsMobile)
        return false;
    if (child.props.desktopOnly && parent.props.appIsMobile)
        return false;
    return true;
}

export default {
    zIndex,
    deviceCheck
};
