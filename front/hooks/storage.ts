export function localStorageSetItem(key: string, value: string | null) {
    const oldValue_access_token = window.localStorage.getItem(key);
    if (value !== null) {
        window.localStorage.setItem(key, value);
    } else {
        window.localStorage.removeItem(key);
    }
    window.dispatchEvent(
        new StorageEvent("storage", {
            storageArea: window.localStorage,
            key: key,
            oldValue: oldValue_access_token,
            newValue: value,
        }),
    );
}
