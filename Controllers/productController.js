const express = require("express");

const ProDB = require("../Models/productsModel");

const Cart = require("../Models/CartModel");

// Add multiple products

const dataADD = async (req, res) => {
  try {
    const data = req.body; // Expecting an array of product objects

    await ProDB.insertMany(data);

    return res.status(201).json("Added Successfully");
  } catch (err) {
    return res.status(500).json({ error: "Failed to add data", details: err });
  }
};

// Get all products

const dataGET = async (req, res) => {
  try {
    const products = await ProDB.find();

    return res.status(200).json(products);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve products", details: err });
  }
};

// Get product by name

const getProductByName = async (req, res) => {
  try {
    const productName = req.params.name;

    const product = await ProDB.findOne({ name: productName });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve product", details: err });
  }
};

// Add product to cart using email

const addToCart = async (req, res) => {
  const { email, productId, quantity } = req.body;

  if (!email || !productId || quantity === undefined) {
    return res
      .status(400)
      .json({ message: "Email, productId, and quantity are required." });
  }

  try {
    let cart = await Cart.findOne({ userEmail: email });

    if (!cart) {
      // Create a new cart if none exists

      cart = new Cart({ userEmail: email, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update the existing item's quantity instead of adding it again

      cart.items[existingItemIndex].quantity = quantity; // Set to new quantity
    } else {
      cart.items.push({ productId, quantity }); // Add new item with specified quantity
    }

    await cart.save();

    return res
      .status(200)
      .json({ message: "Cart updated successfully.", cart });
  } catch (error) {
    console.error("Error updating cart:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

// Decrement quantity in user's cart using email

const removeFromCart = async (req, res) => {
  const { email, productId } = req.body;

  if (!email || !productId) {
    return res
      .status(400)
      .json({ message: "Email and productId are required." });
  }

  try {
    const cart = await Cart.findOne({ userEmail: email }); // Ensure userEmail is used here as well

    if (cart) {
      const productInCart = cart.items.find((item) =>
        item.productId.equals(productId)
      );

      if (productInCart) {
        if (productInCart.quantity > 1) {
          // Decrement quantity correctly

          productInCart.quantity -= 1;
        } else {
          // Remove the item if quantity is 1

          cart.items = cart.items.filter(
            (item) => !item.productId.equals(productId)
          );
        }

        await cart.save();

        return res.status(200).json({ success: true, cart });
      }
    }

    return res
      .status(404)
      .json({ success: false, message: "Product not found in cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

// Remove item completely from cart using email

// Remove item completely from cart using email

const removeCartItem = async (req, res) => {
  const { email, productId } = req.body;

  if (!email || !productId) {
    return res
      .status(400)
      .json({ message: "Email and productId are required." });
  }

  try {
    // Find the cart based on the email

    const cart = await Cart.findOne({ userEmail: email });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item with the matching productId

    const initialItemCount = cart.items.length;

    cart.items = cart.items.filter((item) => !item.productId.equals(productId));

    // If the length of the items array has not changed, the item was not found

    if (initialItemCount === cart.items.length) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Save the updated cart

    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);

    return res.status(500).json({ error: "Failed to remove item" });
  }
};

// Get cart items for a user using email

const getCartItems = async (req, res) => {
  const { email } = req.params;

  try {
    const cart = await Cart.findOne({ userEmail: email }); // Use the original email search

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart.items);
  } catch (error) {
    console.error("Error fetching cart items:", error);

    return res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

// Get product by ID

const getProductById = async (req, res) => {
  try {
    const productId = req.params.param;

    const product = await ProDB.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve product", details: err });
  }
};

// Exporting all controller functions

exports.getCartItems = getCartItems;

exports.removeCartItem = removeCartItem;

exports.removeFromCart = removeFromCart;

exports.getProductById = getProductById;

exports.dataADD = dataADD;

exports.dataGET = dataGET;

exports.getProductByName = getProductByName;

exports.addToCart = addToCart;
