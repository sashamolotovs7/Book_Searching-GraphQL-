import decode from "jwt-decode";

// Define the UserToken interface
interface UserToken {
  id: string;
  email: string;
  exp: number; // Expiration time in seconds
}

class Auth {
  // Retrieve token from local storage
  getToken(): string | null {
    return localStorage.getItem("id_token");
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded: UserToken = decode<UserToken>(token);
      return decoded.exp < Date.now() / 1000; // Token has expired
    } catch (err) {
      console.error("Error decoding token:", err);
      return false;
    }
  }

  // Check if the user is logged in
  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // Token must exist and not be expired
  }

  // Save token to local storage
  login(idToken: string): void {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  // Clear token from local storage
  logout(): void {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }
}

export default new Auth();
