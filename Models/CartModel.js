const mongoose = require('mongoose');



const cartItemSchema = new mongoose.Schema({

  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

  quantity: { type: Number, default: 1 }

});



const cartSchema = new mongoose.Schema({

  userEmail: { type: String, required: true },

  items: [cartItemSchema]

});



const Cart = mongoose.model('Cart', cartSchema);



module.exports = Cart;

