import mitt from "mitt";
type Events = Record<string, any>;

export default defineNuxtPlugin(() => {
  const emitter = mitt<Events>();

  return {
    provide: {
      emit: emitter.emit,
      listenOn: emitter.on,
      listenOff: emitter.off,
    },
  };
});
