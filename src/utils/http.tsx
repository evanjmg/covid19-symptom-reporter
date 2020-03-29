export const fetcher = (...args) =>
  (fetch as any)(...args).then(response => response.json());

export const fetcherWithToken = url => {
  const token = localStorage.getItem("_token");
  return fetcher(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
    }
  });
};
