const knex = require('knex');
const router = require('express').Router();

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/lambda.sqlite3'
    },
    useNullAsDefault: true,
    debug: true
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
    db('zoos')
      .then(zoos => {
        res.status(200).json(zoos)
    })
      .catch(err => {
        console.log(err);
    });
});

router.get('/:id', (req, res) => {
    db('zoos')
      .where({ id: req.params.id })
      .first()
      .then(zoo => {
       if(zoo) {
        res.status(200).json(zoo);
       } else {
           res.status(404).json({ message: 'The zoo you are looking for could not be found.' })
       }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    if(!req.body.name) {
        res.status(400).json({ message: 'Please provide a name for the zoo.' })
    } else {
        db('zoos')
         .insert(req.body, 'id')
         .then(ids => {
          db('zoos')
            .where({ id: ids[0] })
            .first()
            .then(zoo => {
              res.status(200).json(zoo);
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
    db('zoos')
     .where({ id: req.params.id })
     .update(req.body)
     .then(count => {
         if(count > 0) {
             res.status(200).json({ message: `${count} record updated` })
         } else {
             res.status(404).json({ message: 'This Zoo does not exist.' })
         }
    })
    .catch(err => {
        res.status(500).json(err);
    }) 
});

router.delete('/:id', (req, res) => {
    db('zoos')
     .where({ id: req.params.id })
     .del()
     .then(count => {
         if(count > 0) {
             res.status(200).json({ message: `${count} record deleted` })
         } else {
             res.status(404).json({ message: 'This Zoo does not exist.' })
         }
     })
     .catch(err => {
         res.status(500).json(err);
     });
});


module.exports = router;