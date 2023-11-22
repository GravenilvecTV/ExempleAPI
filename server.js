// On importe fastify
const fastify = require('fastify')({logger: true})

// On importe knex pour requeter la base
const knex = require('knex');

// On recupere la config qui contient les identifiants à la base
const knexConfig = require('./config');

// Connexion à la base
const db = knex(knexConfig);

// Route pour récupérer tous les produits
fastify.get('/products', async (req, reply) => {
    try {
        const users = await db.select().from('produits');
        return users;
    } catch (error) {
        throw new Error(error);
    }
});

// Route pour récuperer un produit avec son numero
fastify.get('/product/:id', async (req, reply) => {
    const productId = parseInt(req.params.id);
    try {
        const product = await db('produits').where('id', productId).first();
        if (!product) {
            reply.code(404).send({ error: 'Produit non trouvé' });
            return;
        }
        reply.send(product);
    } catch (error) {
        reply.code(500).send({ error: 'Erreur lors de la récupération du produit' });
    }
});

// Ajouter un produit
fastify.post('/products', async (req, reply) => {
    const { nom, prix, stock } = req.body;

    try {
      // Insérer le nouveau produit dans la base de données
      const newProductId = await db('produits').insert({ nom, prix, stock });
  
      reply.code(201).send({message: "Le produit a été ajouté", id: newProductId[0]}); // Répondre avec le nouveau produit ajouté
    } catch (error) {
      reply.code(500).send({ error: 'Erreur lors de l\'ajout du produit' });
    }
});

// Modifier un produit avec son numero
fastify.put('/products/:id', async (req, reply) => {
    const productId = parseInt(req.params.id);
    const { nom, prix, stock } = req.body;

    try {
        const existingProduct = await db('produits').where('id', productId).first();

        if (!existingProduct) {
            reply.code(404).send({ error: 'Produit non trouvé' });
            return;
        }

        await db('produits').where('id', productId).update({ nom, prix, stock });

        const updatedProduct = await db('produits').where('id', productId).first();
        reply.send(updatedProduct);
    } catch (error) {
        reply.code(500).send({ error: 'Erreur lors de la mise à jour du produit' });
    }
});

// Supprimer un produit avec son numero
fastify.delete('/products/:id', async (req, reply) => {
    const productId = parseInt(req.params.id);

    try {
        const existingProduct = await db('produits').where('id', productId).first();

        if (!existingProduct) {
            reply.code(404).send({ error: 'Produit non trouvé' });
        return;
        }

        await db('produits').where('id', productId).del();

        reply.send({ message: 'Produit supprimé avec succès', deletedProduct: existingProduct });
    } catch (error) {
        reply.code(500).send({ error: 'Erreur lors de la suppression du produit' });
    }
});

// Lancement de l'API sur le port 3000
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
})