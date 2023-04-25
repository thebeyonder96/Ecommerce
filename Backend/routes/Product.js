const express = require('express')
const router = express.Router()
const productModel = require('../models/productModel')
const { ObjectId } = require('mongodb');
// creating user
router.post('/create', async (req, res) => {
    const product = new productModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        categories: req.body.categories,

    })
    try {
        const savedProduct = await product.save()
        if (!savedProduct) return res.status(400).send("erroring in saving db")
        res.status(200).send(savedProduct)
    } catch (e) {
        console.log(e)
    }
})
// updating user
router.put('/update/:id', async (req, res) => {
    const id = req.params.id
    const updatedData = req.body
    console.log(id)
    const updatedProduct = await productModel.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
    )
    if (!updatedProduct) return res.status(404).send('Not updated user')
    res.send(updatedProduct)
})
// deleting product

router.post('/delete/:id', async (req, res) => {
    const id = req.params.id
    const deleteOne = await productModel.deleteOne({ _id: new ObjectId(id) })
    if (!deleteOne) return res.status(502).send("can't delete the product")
    res.status(200).send(deleteOne)
})

//getting every product
router.get('/every', async (req, res) => {
    const everyProduct = await productModel.find()
    if (!everyProduct) res.status(504).send("don't have products")
    res.send(everyProduct)
})

// getting one product
router.get('/unique/:id', async (req, res) => {
    const id = req.params.id
    const oneProduct = await productModel.findById(id)
    if (!oneProduct) res.status(504).send("don't have any products")
    res.send(oneProduct)
})



module.exports = router