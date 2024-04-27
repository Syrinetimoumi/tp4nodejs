const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate')
const Categorie = require('../models/categorie');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/add', async (req, res) => {
    try {
        const { nom, description } = req.body;
        const categorie = new Categorie({ nom, description });
        await categorie.save();
        res.redirect('/categories/liste'); 
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.get('/add', async (req, res) => {
    res.render('addCategorie');
})

router.get('/liste', async (req, res) => {
    try {
        const categories = await Categorie.find();
        res.render('listeCategories', { categories: categories });
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des catégories');
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const categorie = await Categorie.findById(req.params.id);
        res.render('editCategorie', { categorie: categorie });
    } catch (error) {
        res.status(404).send('Catégorie non trouvée');
    }
});


router.put('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description } = req.body;
        const updatedCategorie = await Categorie.findByIdAndUpdate(id, { nom, description }, { new: true });
        res.redirect('/categories/liste'); 
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description } = req.body;
        const updatedCategorie = await Categorie.findByIdAndUpdate(id, { nom, description }, { new: true });
        res.redirect('/categorie/liste'); 
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.post('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Categorie.findByIdAndDelete(id);
        res.redirect('/categorie/liste'); 
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Categorie.findByIdAndDelete(id);
        res.send('Catégorie supprimée avec succès');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
