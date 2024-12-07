document.addEventListener("DOMContentLoaded", async () => {
  const item = localStorage.getItem("userID");
  const user = JSON.parse(item);
  console.log("UserID:", user);

  getNotifications(user._id);

  const notificationList = document.querySelector("main ul");

  async function getNotifications(userID) {
    try {
      const res = await fetch(
        `http://localhost:5000/getNotifications/${userID}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      const notifications = data.sort().reverse();
      console.log(notifications);

      // Clear sub list
      const items = Array.from(notificationList.children);
      items.forEach((item) => {
        notificationList.removeChild(item);
      });

      if (Array.isArray(notifications)) {
        notifications.forEach((notification) => {
          const li = document.createElement("li");
          const img = document.createElement("img");

          // Set img source
          if (notification.service == "Prime Video") {
            img.src = `/client/assets/amazon.png`;
            img.alt = `${notification.service} logo`;
          } else if (notification.service == "HBO GO") {
            img.src = `/client/assets/hbo.png`;
            img.alt = `${notification.service} logo`;
          } else if (notification.alert == "warning") {
            img.src = `/client/assets/brand_logo.png`;
            img.alt = `MMM logo`;
          } else {
            img.src = `/client/assets/${notification.service}.png`;
            img.alt = `${notification.service} logo`;
          }

          const div1 = document.createElement("div");
          const h5 = document.createElement("h5");
          const p = document.createElement("p");
          const div2 = document.createElement("div");
          const h6 = document.createElement("h6");
          const span = document.createElement("span");

          // Insert notification information
          if (notification.alert === "expired") {
            h5.textContent = `${notification.service} Subscription has expired`;
            p.textContent = `Your ${notification.plan} Plan has expired. Pleas subscribe again to enjoy the service!`;
            h6.textContent = `EXPIRED`;
          } else if (notification.alert === "activated") {
            h5.textContent = `${notification.service} Subscription is successfully activated`;
            p.textContent = `You have successfully subscribed to ${notification.service} on a ${notification.plan} Plan. P${notification.price} will automatically be deducted from your wallet per month.`;
            h6.textContent = `ACTIVATED`;
          } else if (notification.alert === "expiration") {
            const daysLeft =
              notification.daysLeft === 7 ? "next week" : "tomorrow";
            h5.textContent = `${notification.service} Subscription is about to expire`;
            p.textContent = `${notification.plan} Plan is about to expire and P${notification.price} will automatically be deducted from your wallet ${daysLeft} to continue the service. Upgrade your plan now!`;
            h6.textContent = `${notification.daysLeft} DAY/S LEFT`;
          } else {
            h5.textContent = `You have used ${notification.budgetPercentage}% of your set budget!`;
            p.textContent = `Your monthly expenses have reached ${notification.budgetPercentage}% of your set budget limit per month.
                            Consider the services and plans you are interested to not exceed 100%.`;
            h6.textContent = `WARNING`;
          }

          div1.append(h5, p);

          span.textContent = notification.dateNotified;
          div2.append(h6, span);

          li.setAttribute("data-value", notification.userID);

          // Append the elements in the right order
          li.append(img, div1, div2);

          notificationList.appendChild(li);
        });
      } else {
        console.error("No subscriptions found or invalid data format");
      }
    } catch (error) {
      console.error("Error fetching notifications: ", error);
    }
  }
});
