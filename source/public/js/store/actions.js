export default {
  addItem(context, payload) {
    context.commit("addItem", payload);
  },
  viewItem(context, id) {
    context.commit("viewItem", id);
  },
};
