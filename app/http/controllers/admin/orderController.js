const order = require("../../../models/order");

function orderController() {
    return {
        async index(req, res) {
            try {
                const orders = await order.find({ status: { $ne: 'completed' } })
                    .sort({ 'createdAt': -1 })
                    .populate('customerId', '-password')
                    .exec();

                if (req.xhr) {
                    return res.json(orders);
                } else {
                    return res.render('admin/orders');
                }
            } catch (err) {
                console.error(err);
                // Handle error here
            }
        }
    };
}

module.exports = orderController;
