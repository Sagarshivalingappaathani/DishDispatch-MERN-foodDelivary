import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'

export function initAdmin(socket) {
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []
    let markup

    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.name } - ${ menuItem.qty } pcs</p>
            `
        }).join('')
      }

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl mx-auto mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">

                <div class="col-span-1 md:col-span-1">
                    <p class="text-lg font-semibold text-green-600">${ order._id }</p>
                    <strong>Items:</strong>
                    <div>${ renderItems(order.items) }</div>
                </div>
                
                <div class="col-span-1 md:col-span-1 mt-5">
                    <div><strong class="mr-2">Name:</strong>${ order.customerId.name }</div>
                    <div><strong class="mr-2">Adress:</strong>${ order.address }</div>
                    <div><strong class="mr-2">Phone No:</strong>${ order.phone }</div>
                </div>
        
                <div class="col-span-1 md:col-span-1">
                    <div><strong class="mr-2">totalPrice:</strong>₹ ${ order.price}</div>
                    <div><strong>${ moment(order.createdAt).format('hh:mm A') }</strong></div>
                    <div class="${ order.paymentStatus ? 'text-green-600' : 'text-red-600' }">${ order.paymentStatus ? 'Paid' : 'Not Paid' }</div>
                </div>
        
                <div class="col-span-1 md:col-span-1">
                    <div class="relative">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        `
        }).join('')
    }
    
    // Socket
    socket.on('orderPlaced', (order) => {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'New order!',
            progressBar: false,
        }).show();
        orders.unshift(order)
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(orders)
    })
}