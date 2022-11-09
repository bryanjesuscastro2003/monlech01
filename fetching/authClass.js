class FetchingAuth {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.data = null;
    this.response = {};
    this.defaultConfigFetch = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
  }
  signIn = async (data) => {
    try {
      this.data = await fetch(this.apiUrl, {
        ...this.defaultConfigFetch,
        body: JSON.stringify({
          action: "signin",
          payload: data,
        }),
      }).then(res => res.json());
      return this.data;
    } catch (error) {
      return null;
    }
  };
  signUp = async (data) => {
    try {
      this.data = await fetch(this.apiUrl, {
        ...this.defaultConfigFetch,
        body: JSON.stringify({
          action: "signup",
          payload: data,
        }),
      }).then(res => res.json());
      return this.data;
    } catch (error) {
      return null;
    }
  };
  getInfoJWT = async (token) => {
    try {
      this.data = await fetch(this.apiUrl, {
        ...this.defaultConfigFetch,
        body: JSON.stringify({
          action: "jwt",
          payload: {token },
        }),
      }).then(res => res.json());
      return this.data;
    } catch (error) {
      return null;
    }
  };
}

export default FetchingAuth
