

console.log("Tripuram Dashboard Loaded");

let allUsers = [];

async function loadUsers() {
  try {
    document.getElementById("loader").classList.remove("hidden");

    let res = await fetch("https://jsonplaceholder.typicode.com/users");
    let data = await res.json();

    allUsers = data;

    renderUsers(data);
    populateCityFilter(data);
    generateAnalytics(data);
  }
  catch (err) {
    console.error("Error fetching users:", err);
  }
  finally {
    document.getElementById("loader").classList.add("hidden");
  }
}


function populateCityFilter(users) {
  let select = document.getElementById("cityFilter");

  // Get unique city list using reduce
  let cities = users.reduce((acc, user) => {
    let city = user.address.city;
    if (!acc.includes(city)) acc.push(city);
    return acc;
  }, []);

  cities.forEach(city => {
    let option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    select.appendChild(option);
  });
}


function renderUsers(users) {
  let ul = document.getElementById("userList");
  ul.innerHTML = "";  

  users.forEach(user => {
    let li = document.createElement("li");
    li.classList.add("user-card");

    li.innerHTML = `
    <h3>${user.name}</h3>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>City:</strong> ${user.address.city}</p>
    <p><strong>Phone:</strong> ${user.phone}</p>
    `;
    ul.appendChild(li);
  });
}

function generateAnalytics(users) {
  let analytics = document.getElementById("analytics");

  // Count users per city using reduce
  let cityCount = users.reduce((acc, user) => {
    let city = user.address.city;
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  // Find most common city
  let mostCity = Object.keys(cityCount).reduce((max, city) => {
    return cityCount[city] > cityCount[max] ? city : max;
  });

  analytics.innerHTML = `
    <h2>Analytics</h2>
    <p><strong>Total Users:</strong> ${users.length}</p>
    <p><strong>Most Common City:</strong> ${mostCity}</p>
    <h3>Users Per City:</h3>
    <pre>${JSON.stringify(cityCount, null, 2)}</pre>
  `;
}


document.getElementById("search").addEventListener("input", function(e){
    let text = e.target.value.toLowerCase();

    let filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(text)
    );
    renderUsers(filtered);
})

document.getElementById("cityFilter").addEventListener("change", function(e) {
  let selectedCity = e.target.value;

  if (selectedCity === "") {
    renderUsers(allUsers);  // Show all again
    return;
  }

  let filtered = allUsers.filter(user =>
    user.address.city === selectedCity
  );

  renderUsers(filtered);
});
document.getElementById("darkModeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});


loadUsers();
