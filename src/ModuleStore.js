const closeRequestWindowSubscribers = [];

/**
 *
 */
export function dispatchCloseRequestWindow()
{
    closeRequestWindowSubscribers.forEach((x) => x());
}

/**
 *
 * @param subscriber
 */
export function subscribeToCloseRequestWindow(subscriber)
{
    closeRequestWindowSubscribers.push(subscriber);
}