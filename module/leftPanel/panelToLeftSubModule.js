const Main = imports.ui.main;
const { St } = imports.gi;
const BoxPointer = imports.ui.boxpointer;

/* exported PanelToLeftSubModule */
var PanelToLeftSubModule = class PanelToLeftSubModule {
    constructor(panel) {
        this.panel = panel;
        this.panelBox = new St.BoxLayout({
            name: 'leftPanelBox',
            vertical: true
        });
        this.dashSpacer = new St.Widget();
        this.primaryMonitor = Main.layoutManager.primaryMonitor;

        this.dashSpacer.set_size(48, Main.overview._controls._group.height);
        this.panelBox.set_size(48, this.primaryMonitor.height);
    }

    enable() {
        Main.overview._controls._group.insert_child_at_index(
            this.dashSpacer,
            0
        ); // insert on first
        Main.layoutManager.panelBox.remove_child(this.panel);
        this.panelBox.add_child(this.panel);
        Main.layoutManager.addChrome(this.panelBox, {
            affectsStruts: true,
            trackFullscreen: true
        });
        this.panelBox.set_position(
            this.primaryMonitor.x,
            this.primaryMonitor.y
        );
        Main.layoutManager.uiGroup.set_child_below_sibling(
            this.panelBox,
            Main.layoutManager.panelBox
        );

        // 4- For each menu override the opening side to match the vertical panel
        this.panel.menuManager._menus.forEach(menuData => {
            if (menuData.menu._boxPointer) {
                menuData.menu._boxPointer._calculateArrowSide = function() {
                    return St.Side.LEFT;
                };
            }
        });
    }

    disable() {
        Main.overview._controls._group.remove_child(this.dashSpacer); // insert on first
        this.panelBox.remove_child(this.panel);
        Main.layoutManager.panelBox.add_child(this.panel);
        Main.layoutManager.removeChrome(this.panelBox);

        this.panel.menuManager._menus.forEach(menuData => {
            if (menuData.menu._boxPointer) {
                menuData.menu._boxPointer._calculateArrowSide =
                    BoxPointer._calculateArrowSide;
            }
        });
    }
};