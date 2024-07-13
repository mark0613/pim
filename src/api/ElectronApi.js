export class ElectronApi {
    static async getData() {
        return (await window.api?.getData()) || {};
    }

    static async setData(data) {
        return window.api?.setData(data);
    }

    static async openOrCloseDevTools() {
        return window.api?.openOrCloseDevTools();
    }
}
