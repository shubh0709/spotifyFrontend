import { API_URL } from "../constants";

console.log({ API_URL });
export function searchTrack() {
    let timeout: NodeJS.Timeout;
    let controller: AbortController;

    return function (val: string, time: number, pageNumber: number) {
        if (controller && controller.signal) {
            controller.abort();
        }

        if (!val) {
            pageNumber = 1;
            return Promise.resolve([]);
        }

        controller = new AbortController();

        return new Promise(async (resolve, reject) => {
            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(async () => {
                try {
                    if (controller && controller?.signal?.aborted) {
                        // console.log("came here got resolved early");
                        resolve([]);
                        return;
                    }

                    const data = await fetch(
                        `${API_URL}/search?q=${encodeURIComponent(val)}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('spotify_access_token')}`,
                            },
                            signal: controller.signal,
                        }
                    );

                    if (!data.ok) {
                        throw new Error(`Request failed with status ${data.status}`);
                    }

                    // const jsonData: JsonData = await data.json();
                    // const users = jsonData.items.map((user) => ({
                    //     userName: user.login,
                    //     avatar: user.avatar_url,
                    // }));

                    // resolve(users);
                } catch (error) {
                    if (controller && controller?.signal?.aborted === false) {
                        reject(error);
                    }

                    resolve([]);
                }
            }, time);
        });
    };
}

export function checkAuthentication() {
    return fetch(`${API_URL}/check-auth`, {
        credentials: 'include' // Important for sending cookies
    })
        .then(response => {
            return response.json();
        })
        .catch(error => console.error('Error checking authentication:', error));
}


export function getRoot(): Promise<string> {
    return fetch(`${API_URL}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.text();
        })
        .catch(error => {
            console.error('Error fetching root endpoint:', error);
            return 'Error';
        });
}

export function getLogin(): Promise<void> {
    return fetch(`${API_URL}/login`)
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            window.location.href = response.url;
            const resp = await response.json();
            console.log({ login_response: resp });
        })
        .catch(error => {
            console.error('Error fetching login URL:', error);
            throw error;
        });
}

export function getCallback(code: string): Promise<{ token: any; user: any; }> {
    return fetch(`${API_URL}/callback?code=${code}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error during token exchange:', error);
            return [];
        });
}

export function searchTracks(query: string): Promise<any> {
    return fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error searching for tracks: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error searching for tracks:', error);
            return [];
        });
}


export function postComment(trackId: string, text: string, userId?: string): Promise<any> {
    return fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, text, userId }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to post comment: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error posting comment:', error);
            return [];
        });
}


export function getComments(trackId: string): Promise<any> {
    return fetch(`${API_URL}/comments/${trackId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching comments: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            return [];
        });
}

export function postReply(commentId: string, text: string, userId?: string): Promise<any> {
    return fetch(`${API_URL}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, text, userId }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to post reply: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error posting reply:', error);
            return [];
        });
}



