export default {
  addItem(state, payload) {
    state.entities.push(payload);
    return state;
  },
  addEvent(state, payload) {
    state.events.push(payload);
    return state;
  },
  updateEvent(state, payload) {
    state.events[payload.event.id] = payload;
  },
  updateItem(state, payload) {
    state.entities[payload.monster.id] = payload;
  },
  viewItem(state, id) {
    state.entities[id];
    return state;
  },
};
