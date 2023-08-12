const closeSelectionWindowSubscribers = [];

/**
 *
 */
export function dispatchCloseSelectionWindow()
{
    closeSelectionWindowSubscribers.forEach((x) => x());
}

/**
 *
 * @param subscriber
 */
export function subscribeToCloseSelectionWindow(subscriber)
{
    closeSelectionWindowSubscribers.push(subscriber);
}