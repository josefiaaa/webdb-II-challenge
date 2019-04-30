const knex = require('knex');
const router = require('express').Router();

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/Bears.db3'
    },
    useNullAsDefault: true,
    debug: true
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
    db('bears')
      .then(bear => {
        res.status(200).json(bear)
    })
      .catch(err => {
        console.log(err);
    });
});

router.get('/:id', (req, res) => {
    db('bears')
      .where({ id: req.params.id })
      .first()
      .then(bear => {
       if(bear) {
        res.status(200).json(bear);
       } else {
           res.status(404).json({ message: 'The bear you are looking for could not be found.' })
       }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    if(!req.body.name) {
        res.status(400).json({ message: 'Please provide a name for the bear.' })
    } else {
        db('bears')
         .insert(req.body, 'id')
         .then(ids => {
          db('bears')
            .where({ id: ids[0] })
            .first()
            .then(bear => {
              res.status(200).json(bear);
            })
            .catch(err => {
              res.status(500).json(err);
            });
        })
        .catch(err => {
          res.status(500).json(err);
        });
    }
});

router.put('/:id', (req, res) => {
    db('bears')
     .where({ id: req.params.id })
     .update(req.body)
     .then(count => {
         if(count > 0) {
             res.status(200).json({ message: `${count} record updated` })
         } else {
             res.status(404).json({ message: 'This bear does not exist.' })
         }
    })
    .catch(err => {
        res.status(500).json(err);
    }) 
});

router.delete('/:id', (req, res) => {
    db('bears')
     .where({ id: req.params.id })
     .del()
     .then(count => {
         if(count > 0) {
             res.status(200).json({ message: `${count} record deleted` })
         } else {
             res.status(404).json({ message: 'This bear does not exist.' })
         }
     })
     .catch(err => {
         res.status(500).json(err);
     });
});


module.exports = router;