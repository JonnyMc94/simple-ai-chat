import { verifiyEmailAddress } from "utils/emailUtils";

export default async function entry(args) {
  const command = args[0];
  const usage = "Usage: :user add [username]" + "\n" +
                "       :user set [pass/email] [value]" + "\n" +
                "       :user info" + "\n";

  // Get user info, configurations
  if (command === "info") {
    let user = null;
    try {
      const response = await fetch(`/api/user/info`, {
        method: "GET",
        credentials: 'include',
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      user = data.user;
    } catch (error) {
      console.error(error);
      return error;
    }

    if (user) {
      localStorage.setItem("user", user.username);
      localStorage.setItem("userSettings", user.settings);
      console.log(user.usage);

      return "User: " + user.username + "\n" +
             "Email: " + user.email + "\n" +
             "Settings: " + JSON.stringify(JSON.parse(user.settings), null, 2) + "\n" +
             "Usage: " + JSON.stringify(JSON.parse(user.usage), null, 2) + "\n";
    } else {
      return "User removed.";
    }
  }

  // Add user
  if (command === "add") {
    if (args.length != 2 && args.length != 3) {
      return "Usage: :user add [username] [email?]";
    }

    const username = args[1];
    const email = args[2] || "";
    if (!username) {
      return "Username is required.";
    }

    try {
      const response = await fetch("/api/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          settings: JSON.stringify({
            role:       localStorage.getItem("role") || "",
            theme:      localStorage.getItem("theme") || "light",
            speak:      localStorage.getItem("speak") || "off",
            stats:      localStorage.getItem("stats") || "on",
            fullscreen: localStorage.getItem("fullscreen") || "off",
          }),
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      if (data.success) {
        localStorage.setItem("user", username);
        localStorage.setItem("userSettings", "");
      }
      return data.message;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // Delete user
  if (command === "delete" || command === "del") {
    if (args.length != 2) {
      return "Usage: :user [del|delete] [username]";
    }

    const username = args[1];
    try {
      const response = await fetch("/api/user/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      if (data.success) {
        localStorage.removeItem("user");
        localStorage.removeItem("userSettings");
      }
      return data.message;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // Set password
  if (command === "set" && args[1] === "pass") {
    if (args.length != 3) {
      return "Usage: :user set pass [password]";
    }

    try {
      const response = await fetch("/api/user/update/password", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: args[2],
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      return "Password updated.";
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // Set email
  if (command === "set" && args[1] === "email") {
    if (args.length != 3) {
      return "Usage: :user set email [email]";
    }

    const email = args[2];
    try {
      const response = await fetch("/api/user/update/email", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.message || new Error(`Request failed with status ${response.status}`);
      }

      return data.message;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // Reset password
  if (command === "reset" && args[1] === "pass") {
    if (args.length != 4) {
      return "Usage: :user reset password [username] [email]";
    }

    const username = args[2];
    const email = args[3];

    // Check if the email is valid.
    if (!verifiyEmailAddress(email)) {
      return "Email is invalid.";
    }

    try {
      const response = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      return data.message;
    } catch (error) {
      console.error(error);
      return data.message;
    }
  }

  return usage;
}
