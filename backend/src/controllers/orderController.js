const orderModel = require('../models/orderModel');
const storeModel = require('../models/storeModel');
const db = require('../config/database');

exports.createOrder = async (req, res) => {
  const { items, shipping_address_id, payment_card_id, total_amount } = req.body;
  const buyer_id = req.user.id;
  if (!items || items.length === 0 || !shipping_address_id || !payment_card_id || !total_amount) {
    return res.status(400).json({ message: 'Data pesanan tidak lengkap.' });
  }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const orderData = { 
      buyer_id, 
      total_amount,
      shipping_address: `Address ID: ${shipping_address_id}`, 
      payment_method: 'payment_gateway',
      payment_details: `Card ID: ${payment_card_id}`,
      status: 'Processing'
    };
    const orderResult = await orderModel.createOrder(orderData, connection);
    const order_id = orderResult.insertId;
    for (const item of items) {
       const orderItemData = {
         order_id,
         product_id: item.id,
         store_id: item.store_id,
         quantity: item.quantity,
         price_per_item: item.price
       };
       await orderModel.createOrderItem(orderItemData, connection);
       await orderModel.decreaseStock(item.id, item.quantity, connection);
    }
    await connection.commit();
    res.status(201).json({ message: 'Pesanan berhasil dibuat!', orderId: order_id });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Gagal membuat pesanan.', error: error.message });
  } finally {
    connection.release();
  }
};

exports.getBuyerOrderHistory = async (req, res) => {
    try {
        const orders = await orderModel.findOrdersByBuyerId(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil riwayat pesanan.', error: error.message });
    }
};

exports.getSellerStoreOrders = async (req, res) => {
    try {
        const store = await orderModel.findStoreByUserId(req.user.id);
        if (!store) return res.status(404).json({ message: 'Toko tidak ditemukan.' });
        const orders = await orderModel.findOrdersByStoreId(store.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil pesanan toko.', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const { id: userId, role } = req.user;

    try {
        const order = await orderModel.findOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Pesanan tidak ditemukan." });
        }
        if (status === 'Completed' || status === 'Cancelled') {
            if (order.buyer_id != userId) {
                return res.status(403).json({ message: "Hanya pembeli yang bisa menyelesaikan atau membatalkan pesanan ini." });
            }
        } else if (status === 'Shipped') {
            const hasAccess = await orderModel.verifyOrderAccess(orderId, userId, 'seller');
            if (!hasAccess) {
                return res.status(403).json({ message: "Hanya penjual yang bisa mengirim pesanan ini." });
            }
        }
        await orderModel.updateStatus(orderId, status);
        res.json({ message: `Status pesanan berhasil diubah.` });

    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};
