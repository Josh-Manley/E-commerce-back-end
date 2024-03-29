const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  try {
    const productData = await Product.findAll({
      // be sure to include its associated Category and Tag data
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with that id' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  const product = await Product.bulkCreate([
    {
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
    },
  ]);
  res.status(200).json(product);

  //     .then(product => {
  //       // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  //       if (req.body.tagIds && req.body.tagIds.length) {
  //         const productTagIdArr = req.body.tagIds.map(tag_id => {
  //           return {
  //             product_id: product.id,
  //             tag_id,
  //           };
  //         });
  //         return ProductTag.bulkCreate(productTagIdArr)
  //           .then(() => product); // Return the product after creating product tags
  //       }
  //       // if no product tags, just respond
  //       return product; // Return the product
  //     })
  //     .then(product => res.status(200).json(product)) // Send the product as response
  //     .catch(err => {
  //       console.log(err);
  //       res.status(400).json(err);
  //     });
  // });
});

// update product
router.put('/:id', async (req, res) => {

  try {
    const productData = await Product.update(
      {
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (!productData) {
      res.status(404).json({ message: 'No product found with that id' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!productData) {
      res.status(404).json({ message: 'No Category found with that id' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
