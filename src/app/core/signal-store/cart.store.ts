import { computed, effect, inject } from "@angular/core";
import { getState, patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { environment } from "../../../environments/environment.development";

export interface ICartItem {
    itemId: number;
    name: string;
    stockId: number;
    qty: number;
    unitPrice: number;
}

export interface ICartMemory {
    slot: number;
    cart: ICartItem[]
}

type CartState = {
    iCartItem: ICartItem[];
    cartList: ICartMemory[];
}

const initialCartState: CartState = {
    iCartItem: [],
    cartList: []
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
        },

        removeItem(id: number) {
            const existCartItems: ICartItem[] = store.iCartItem();
            const selectedItems: ICartItem[] = existCartItems.filter(item => item.itemId === id);
            let updatedCartItems: ICartItem[] = [];
            if (selectedItems.length > 0 && selectedItems[0].qty === 1) {
                updatedCartItems = existCartItems.filter(item => item.itemId !== id);
            } else {
                updatedCartItems = existCartItems.map(item => (item.itemId === id ? { ...item, qty: item.qty - 1 } : item));
            }
            patchState(store, { iCartItem: updatedCartItems });
        },

        incrementItem(cartItem: ICartItem) {
            const existCartItem: ICartItem[] = store.iCartItem().filter(item => item.itemId !== cartItem.itemId);
            patchState(store, { iCartItem: [...existCartItem, cartItem] });
        },

        clearCart() {
            localStorage.removeItem(environment.localStorageKeys.cartKey);
            patchState(store, { iCartItem: [] });
        },

        saveCartList(slotNo: number) {
            const cart: ICartMemory[] = store.cartList().filter(c => c.slot !== slotNo) || [];
                patchState(store, { cartList: [...cart, { slot: slotNo, cart: store.iCartItem() }] })
        },
        removeCartFromCartList(slotNo: number) {
            const selectCart: ICartMemory | undefined = store.cartList().find(c => c.slot === slotNo);
            if (selectCart) {
                const cart: ICartMemory[] = store.cartList().filter(c => c.slot !== slotNo);
                patchState(store, { iCartItem: selectCart.cart, cartList: cart })
            }
        }
    })),
    withComputed(({ iCartItem }) => ({
        totalItemCount: computed(() => iCartItem().length),
        totalQuantity: computed(() =>
            iCartItem().reduce((total, item) => total + item.qty, 0)
        ),
        netAmmount: computed(() =>
            iCartItem().reduce((total, item) => total + (item.qty * item.unitPrice), 0)
        ),
        netCartList: computed(() => iCartItem().map((item: ICartItem) => ({ ...item, amount: item.qty * item.unitPrice })))
    })),
    withHooks({
        onInit(store) {
            const temp = JSON.parse(localStorage.getItem(environment.localStorageKeys.cartKey) || '{}')
            patchState(store, temp)
            effect(() => {
                const cartState = getState(store);
                localStorage.setItem(environment.localStorageKeys.cartKey, JSON.stringify(cartState))
            })
        },
    })

)