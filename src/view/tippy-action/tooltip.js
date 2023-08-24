import tippy from "tippy.js";
import "./tippy-custom.scss";

/**
 *
 * @param node
 *
 * @param params
 */
export function tooltip(node, params)
{
    if (!tippy)
    {
        return;
    }

    const tip = tippy(node, { ...params });

    return {
        update: () => tip.setProps({ ...params }),
        destroy: () => tip.destroy()
    };
}