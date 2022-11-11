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
      const { action, payload, questionID } = data;
      const query = `?action=${action}&payload=${payload}&question=${questionID}`;
      this.data = await fetch(this.apiUrl + query, {
        ...this.defaultConfigFetch,
        method: "GET",
      }).then((res) => res.json());
      return this.data;
    } catch (error) {
      return { ok: false, message: "Unexpected error please try again later" };
    }
  };

  postSubjectData = async (data) => {
    try {
      this.data = await fetch(this.apiUrl, {
        ...this.defaultConfigFetch,
        body: JSON.stringify(data),
      }).then((res) => res.json());
      return this.data;
    } catch (error) {
      return { ok: false, message: "Unexpected error please try again later" };
    }
  };
}

export default FetchingBlog;
