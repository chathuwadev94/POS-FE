import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

export interface ICartItem {
    itemId: number;
    name: string;
    stockId: number;
    qty: number;
    unitPrice: number;
}

type CartState = {
    iCartItem: ICartItem[];
}

const initialCartState: CartState = {
    iCartItem: []
}

export const CartStore = signalStore(
    { providedIn: 'root' },
    withState(initialCartState),
    withMethods(store => ({
        addItem(cartItem: ICartItem) {
            const existingItems = store.iCartItem();
            const itemExists = existingItems.some(item => item.itemId === cartItem.itemId);
            if (itemExists) {
                const updatedItems = existingItems.map(item => {
                    if (item.itemId === cartItem.itemId) {
                        return { ...item, qty: item.qty + cartItem.qty };
                    }
                    return item;
                });
                patchState(store, { iCartItem: updatedItems });
            } else {
                patchState(store, { iCartItem: [...existingItems, cartItem] });
            }
        }
    })),
    withComputed(({ iCartItem }) => ({
        totalItemCount: computed(() => iCartItem().length),
        totalQuantity: computed(() =>
            iCartItem().reduce((total, item) => total + item.qty, 0)
        ),
        netCartList: computed(() => iCartItem().map((item: ICartItem) => ({ ...item, amount: item.qty * item.unitPrice })))
    }))

)