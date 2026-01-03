const listeners = []

export function subscribe(listener) {
    listeners.push(listener)
}

export function unsubscribe(listener) {
    const i = listeners.indexOf(listener)
    if (i !== -1) listeners.splice(i, 1)
}

export function showToast(text, type = 'success', duration = 3000) {
    listeners.forEach(fn => fn({ text, type, duration }))
}
