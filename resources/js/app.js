console.log("SKP");
console.log("SMP");
console.log("SAP");

import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import { searchBox } from './search';
import moment from 'moment'

/* =========== Show Navbar =========== */
const navbar = document.querySelector(".navbar");
const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", () => {
  navbar.classList.toggle("show");
});

/* =========== Scroll Position =========== */

const header = document.querySelector(".header");
const scrollLink = document.querySelectorAll(".navbar a:not(:last-child)");

/* =========== Smooth Scroll =========== */
Array.from(scrollLink).map((link) => {
  link.addEventListener("click", (e) => {
    // Prevent Default
    e.preventDefault();

    const id = e.currentTarget.getAttribute("href").slice(1);
    const element = document.getElementById(id);
    let position = element.offsetTop - 90;

    window.scrollTo({
      left: 0,
      top: position,
      behavior: "smooth",
    });
    navbar.classList.remove("show");
  });
});


/* =========== Preloader =========== */
const preloader = document.querySelector(".preloader");

const hasPreloaderShown = sessionStorage.getItem('preloaderShown');

if (!hasPreloaderShown) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.display = "none"; 
      sessionStorage.setItem('preloaderShown', 'true');
    }, 2000);
  });
} else {
  // If the preloader has already been shown in this session, hide it immediately
  preloader.style.display = "none";
}



let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(food) {
   axios.post('/update-cart', food).then(res => {
       cartCounter.innerText = res.data.totalQty
       new Noty({
           type: 'success',
           timeout: 1000,
           text: 'Item added to cart',
           progressBar: false,
       }).show();
   }).catch(err => {
       new Noty({
           type: 'error',
           timeout: 1000,
           text: 'Something went wrong',
           progressBar: false,
       }).show();
   })
}


addToCart.forEach((btn,index) => {
    btn.addEventListener('click', (e) => {
      let foodData = JSON.parse(btn.dataset.pizza);
      const currentQuntity = document.getElementsByClassName('numberDisplay');
      console.log(currentQuntity[index].textContent)
      console.log(foodData);
      const food={
        foodDetails:foodData,
        quantity:Number(currentQuntity[index].textContent),
      }
      // Now you can work with infoData here
      updateCart(food);

    });
  });

//increasing the number of the food item
// Select all elements with class names
const numberDisplay = document.querySelectorAll('.numberDisplay');
const decreaseButton = document.querySelectorAll('.decreaseButton');
const increaseButton = document.querySelectorAll('.increaseButton');

// Initialize an array to keep track of quantities for each item
const quantities = Array.from(numberDisplay).map(() => 1);

decreaseButton.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    if (quantities[index] > 1) {
      quantities[index]--;
      updateNumberDisplay(index);
    }
  });
});

increaseButton.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    quantities[index]++;
    updateNumberDisplay(index);
  });
});

function updateNumberDisplay(index) {
  numberDisplay[index].textContent = quantities[index];
}



// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


const button = document.querySelectorAll('.removeButton');

function deleteitem(pizza) {
    axios.delete('/delete-item', { data: pizza })
        .then(res => {
            cartCounter.innerText = res.data.totalQty;

            // Remove the deleted item from the client-side view
            const deletedItem = document.querySelector(`[data-pizza-id="${pizza._id}"]`);
            if (deletedItem) {
                deletedItem.remove();
                console.log('Item removed from client-side view');
            }

            const pizzaPriceElement = document.querySelector('.amount'); // Select the element by class name or other suitable selector
            const totalPrice =res.data.totalPrice; // Calculate the total price
            console.log(pizzaPriceElement)
            console.log(totalPrice)
            // Update the content of the element
            pizzaPriceElement.textContent = `₹ ${totalPrice}`;
            
            new Noty({
                type: 'success',
                timeout: 1000,
                text: 'Item deleted successfully from cart',
                progressBar: false,
            }).show();
        })
        .catch(err => {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: 'Something went wrong',
                progressBar: false,
            }).show();
        });
}


button.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizzaData = JSON.parse(btn.dataset.pizza);
        let pizzaItem = pizzaData.item;
        let pizzaId = pizzaData._id; 

        // Call the deleteitem function with both pizzaItem and pizzaId
        deleteitem({ item: pizzaItem, _id: pizzaId });

    });
});

  

const sections = document.querySelectorAll('#features, .menu');

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  const scrollPosition = window.scrollY;

  sections.forEach((section) => {
    const sectionPosition = section.getBoundingClientRect();

    if (sectionPosition.top < windowHeight * 0.90) {
      section.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);

searchBox();

//scroll button
const scrollTop = document.querySelector(".scroll-top");

scrollTop.addEventListener("click", () => {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", (e) => {
  const scrollHeight = window.pageYOffset;

  if (scrollHeight > 300) {
    scrollTop.classList.add("show");
  } else {
    scrollTop.classList.remove("show");
  }
});




// Change order status

let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)

function updateStatus(order) {
   statuses.forEach((status) => {
       status.classList.remove('step-completed')
       status.classList.remove('current')
   })
   let stepCompleted = true;
   statuses.forEach((status) => {
      let dataProp = status.dataset.status
      if(stepCompleted) {
           status.classList.add('step-completed')
      }
      if(dataProp === order.status) {
           stepCompleted = false
          if(status.nextElementSibling) {
           status.nextElementSibling.classList.add('current')
          }
      }
   })

}



updateStatus(order);


// Socket
let socket = io()

// Join
if(order) {
   socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
   initAdmin(socket)
   socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
   const updatedOrder = { ...order }
   updatedOrder.updatedAt = moment().format()
   updatedOrder.status = data.status
   updateStatus(updatedOrder)
   new Noty({
       type: 'success',
       timeout: 1000,
       text: 'Order updated',
       progressBar: false,
   }).show();
})



 

