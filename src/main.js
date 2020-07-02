import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {},
  intro: true,
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("service-worker.js").then(
      function(registration) {
        console.log(
          `%cService-Worker%c Registered for scope: ${registration.scope}`,
          "background:#eee;color:#333;padding:0.5em",
          ""
        );
      },
      function(err) {
        console.error(
          `%cService-Worker%c Registration failed`,
          "background:#eee;color:#333;padding:0.5em",
          ""
        );
        console.error(err);
      }
    );
  });
}

export default app;
