import UserAPI from "./services/UserAPI";
import Utils from "./services/Utils";

const routes = [
  // Oluşabilecek senaryo 1. authneeded olup children yok 2. authneeded olup children var. 3. authneeded yok children yok.
  // authneeded yok children var
  {
    isAuthNeeded: true,
    path: "/dashboard",
    template: "dashboard.html",
    children: [{ path: "/profile", template: "profile.html" }],
  },
  {
    path: "/login",
    template: "login.html",
  },
  {
    path: "/register",
    template: "register.html",
  },
];

const routeInitializer = async (routes) => {
  const PATH = window.location.pathname;

  for (let i = 0; i < routes.length; i++) {
    let rootPath = routes[i]["path"];
    let template = routes[i]["template"];
    let children = routes[i]["children"];
    let isAuthNeeded = routes[i]["isAuthNeeded"];
    if (rootPath === PATH) {
      if (rootPath && typeof rootPath === "string") {
        if (isAuthNeeded) {
          const response = await UserAPI.getProfile();
          if (response) {
            window.history.pushState({}, Utils.getBackendBaseURL(), rootPath);
          } else {
            window.history.pushState({}, Utils.getBackendBaseURL(), "/login");
          }
          if (Array.isArray(children) && children.length !== 0) {
            for (let j = 0; j < children.length; j++) {
              if (Object.keys(children[i].length) !== 0) {
                let childPath = children[i]["path"];
                let childTemplate = children[i]["template"];
                if (
                  childPath &&
                  typeof childPath === "string" &&
                  childTemplate &&
                  typeof childTemplate === "string"
                ) {
                  window.history.pushState(
                    {},
                    Utils.getBackendBaseURL(),
                    rootPath + childPath
                  );
                  window.location.href = childTemplate;
                }
              }
            }
          } else {
            window.history.pushState(
              {},
              Utils.getBackendBaseURL(),
              rootPath + childPath
            );
            window.location.href = childTemplate;
          }
        } else {
          window.history.pushState({}, Utils.getBackendBaseURL(), rootPath);
          window.location.href = template;
        }
      }
    } else {
    }
  }
};

window.addEventListener("popstate", routeInitializer);

var require = (function () {
  var _required = {};
  return function (url, callback) {
    if (typeof url == "object") {
      // We've (hopefully) got an array: time to chain!
      if (url.length > 1) {
        // Load the nth file as soon as everything up to the
        // n-1th one is done.
        require(url.slice(0, url.length - 1), function () {
          require(url[url.length - 1], callback);
        });
      } else if (url.length == 1) {
        require(url[0], callback);
      }
      return;
    }
    if (typeof _required[url] == "undefined") {
      // Haven't loaded this URL yet; gogogo!
      _required[url] = [];

      var script = new Element("script", {
        src: url,
        type: "text/javascript",
      });
      script.observe("load", function () {
        console.log("script " + url + " loaded.");
        _required[url].each(function (cb) {
          cb.call(); // TODO: does this execute in the right context?
        });
        _required[url] = true;
      });

      $$("head")[0].insert(script);
    } else if (typeof _required[url] == "boolean") {
      // We already loaded the thing, so go ahead.
      if (callback) {
        callback.call();
      }
      return;
    }

    if (callback) {
      _required[url].push(callback);
    }
  };
})();
