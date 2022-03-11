import api from "./api"

export async function getProducts(url) {
    const res = await api.get(url);
    return res;
}

export async function postOrder(url, obj) {
    const res = await api.post(url, obj);
    return res;
}