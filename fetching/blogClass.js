class FetchingBlog {
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
  getSubjectData = async (data) => {
    try {
      const { action, payload } = data;
      const query = `?action=${action}&payload=${payload}`;
      this.data = await fetch(this.apiUrl + query, {
        ...this.defaultConfigFetch,
        method: "GET",
        query: { action, payload },
      }).then((res) => res.json());
      return this.data;
    } catch (error) {
      return null;
    }
  };
  aboutData = async (data) => {
    try {
      const { action, payload } = data;
      this.data = await fetch(this.apiUrl, {
        ...this.defaultConfigFetch,
        method: "GET",
        body: JSON.stringify({
          action,
          payload,
        }),
      }).then((res) => res.json());
      console.log("Vamos");
      return this.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

export default FetchingBlog;
