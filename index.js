// On importe fastify
const fastify = require('fastify')({logger: true})

// On importe knex pour requeter la base
const knex = require('knex');

// On recupere la config qui contient les identifiants à la base
const knexConfig = require('./config');

// Liste de produits 
let produits = [
    { id: 1, nom: 'Table', prix: 10 },
    { id: 2, nom: 'Chaise', prix: 20 },
    { id: 3, nom: 'TV', prix: 15 }
];

// Route pour récupérer tous les produits
fastify.get('/products', (req, reply) => {
    reply.send(produits);
});

// Route pour récuperer un produit avec son numero
fastify.get('/product/:id', (req, reply) => {
    const productId = parseInt(req.params.id);
    const product = produits.find(item => item.id === productId);
    if (!product) {
        reply.code(404).send({ error: 'Produit non trouvé' });
        return;
    }
    reply.send(product);
});

// Ajouter un produit
fastify.post('/products', (req, reply) => {
    const { nom, prix, stock } = req.body; // Supposons que les données du nouveau produit sont envoyées dans le corps de la requête
    const newProductId = produits.length + 1; // Générer un nouvel ID pour le produit
    const newProduct = { nom, prix, stock };
    produits.push(newProduct);
    reply.code(201).send(newProduct); // Répondre avec le nouveau produit ajouté
});

// Modifier un produit avec son numero
fastify.put('/products/:id', (req, reply) => {
    const productId = parseInt(req.params.id);
    const { nom, prix } = req.body; // Supposons que les données à mettre à jour sont envoyées dans le corps de la requête
    const index = produits.findIndex(item => item.id === productId);
    if (index === -1) {
        reply.code(404).send({ error: 'Produit non trouvé' });
        return;
    }
    produits[index] = { ...produits[index], nom, prix };
    reply.send(produits[index]);
});

// Supprimer un produit avec son numero
fastify.delete('/products/:id', (req, reply) => {
    const productId = parseInt(req.params.id);
    const index = produits.findIndex(item => item.id === productId);
    if (index === -1) {
        reply.code(404).send({ error: 'Produit non trouvé' });
        return;
    }
    const deletedProduct = produits.splice(index, 1);
    reply.send({ message: 'Produit supprimé avec succès', deletedProduct });
});

// Lancement de l'API sur le port 3000
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err
})