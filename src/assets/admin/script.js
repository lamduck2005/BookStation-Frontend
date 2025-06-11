// src/assets/admin/scrip.js
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".toggle-btn");
  const toggler = document.querySelector("#icon");
  if (hamburger && toggler) {
    hamburger.addEventListener("click", () => {
      document.querySelector("#sidebar").classList.toggle("expand");
      toggler.classList.toggle("bxs-chevrons-right");
      toggler.classList.toggle("bxs-chevrons-left");
    });
  }
  // Toggle Sidebar Dropdown
  const items = document.querySelectorAll(".has-dropdown");

  function toggle() {
    const itemToggle = this.classList.contains("active");

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("active");
    }

    if (!itemToggle) {
      this.classList.add("active");
    }
  }

  items.forEach((item) => item.addEventListener("click", toggle));

  const userProfile = document.querySelector(".user-link");
  if (userProfile) {
    userProfile.addEventListener("click", function () {
      document.querySelector(".user-link-dropdown")?.classList.toggle("show");
    });
  }

  // Chart.js Example
  const ctx = document.getElementById("myChart");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        "Đơn hàng thành công",
        "Đơn hàng đang xử lý",
        "Trả hàng",
        "Đơn hàng đã hủy",
      ],
      datasets: [
        {
          label: "My First Dataset",
          data: [300, 50, 100, 50],
          backgroundColor: [
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(255, 99, 132)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  const ctx2 = document.getElementById("mySecondChart");
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      datasets: [
        {
          label: "Doanh thu theo tháng",
          data: [
            10100000, 10500000, 11000000, 11500000, 12000000, 13000000,
            12500000, 11800000, 13500000, 14000000, 15000000, 16000000,
          ],
          backgroundColor: "#bb1b30",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  //DatatableJS
  let table = new DataTable("#main-table", {
    pageLength: 5,
  });
});
