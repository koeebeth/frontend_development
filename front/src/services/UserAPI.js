import Utils from "../services/Utils";

const UserAPI = {
  async login() {
    // http ile /rest/auth/login e gerekli credentiallar ile istek atılacak ve kullanıcı credentiallar doğru ise dashboard sayfasına redirect edilecek.
    // Kullanıcı login olduktan sonra /dashboarda gidecek.
  },
  async register() {
    // http ile /rest/auth/register e gerekli credentiallar ile istek atılacak ve dönen veri login html ye yansıtılacak.
    // Kullanıcı register olduktan sonra login sayfasına redirect edilecek.
  },

  async changePassword() {
    // http ile /rest/auth/changePassword e gerekli credentiallar ile istek atılacak ve dönen veri changePassword html ye yansıtılacak.
  },

  // Bu fonksyionu kullanıcı /dashboard/profile a gidince kullanabilirsiniz.
  async getProfile() {
    const BASEURL = Utils.getBackendBaseURL();
    const headers = await this.getAuthHeader();
    headers.append("Content-Type", "application/json");

    const response = await fetch(`${BASEURL}/rest/auth/profile`, {
      method: "GET",
      headers,
    });
    return response.json();
  },

  async isJWTValid() {
    const BASEURL = Utils.getBackendBaseURL();
    const jwt = this.getUser();
    if (jwt) {
      try {
        const body = jwt.split(".")[1];
        const payload = JSON.parse(atob(body));
        const unvalidDate = payload.exp * 1000;
        const date = new Date();
        if (unvalidDate > date.getTime()) {
          const headers = new Headers();
          headers.append("Authorization", `Bearer ${jwt}`);
          headers.append("Content-Type", "application/json");
          const response = await fetch(`${BASEURL}/rest/auth/profile`, {
            method: "GET",
            headers,
          });

          const data = response.json();

          return !data.deleteAccount;
        }
      } catch (err) {
        return false;
      }
    }
    return false;
  },

  async getAuthHeader() {
    const valid = await this.isJWTValid();

    if (!valid) {
      this.logout();
      return new Headers();
    }

    const jwt = this.getUser();

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${jwt}`);

    return headers;
  },

  isLogin() {
    return localStorage.getItem("user") !== null;
  },

  getUser() {
    return localStorage.getItem("user");
  },

  setUser(jwt) {
    localStorage.setItem("user", jwt);
  },

  logout() {
    localStorage.removeItem("user");
    window.location.assign("/");
    window.location.reload();
  },
};

export default UserAPI;
