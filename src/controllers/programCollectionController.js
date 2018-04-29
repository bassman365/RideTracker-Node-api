'use strict';

const programCollectionController = (ProgramCollection) => {

  const postProgramCollections = ((req, res) => {
    const query = {};
    query.userId = req.decoded.id;

    ProgramCollection.find(query)
      .sort({createdAt: 'desc'})
      .exec((err, programCollections) => {
        if (err) {
          res.status(500);
          res.send(err);
        } else {
          if (programCollections && programCollections.length > 0) {
            res.status(413)
              .send({
                success: false,
                message: 'Unfortunately at this time we only support a single program collection'
              });
          } else {
            let programCollection = new ProgramCollection(req.body);
            programCollection.userId = req.decoded.id;
            programCollection.save();
            res.status(201);
            res.send(programCollection);
          }
        }
      });
  });

  const getProgramCollections = ((req, res) => {
    const query = {};
    query.userId = req.decoded.id;

    ProgramCollection.find(query)
      .sort({createdAt: 'desc'})
      .exec((err, programCollections) => {
        if (err) {
          res.status(500);
          res.send(err);
        } else {
          let returnProgramCollections = [];
          programCollections.forEach((programCollection) => {
            returnProgramCollections.push(programCollection.toJSON());
          });

          res.status(200).send({
            success: true,
            message: 'Such great collections',
            programCollections: returnProgramCollections
          });
        }
      });
  });

  const getProgramCollection = ((req, res) => {

    const returnProgramCollection = {
      name: req.programCollection.name,
      defautProgram: req.programCollection.defautProgram,
      programs: req.programCollection.programs
    };

    res.json(returnProgramCollection);
  });

  const putProgramCollection = ((req, res) => {
    req.programCollection.name = req.validatedProgramCollection.name;
    req.programCollection.programs = req.validatedProgramCollection.programs;
    req.programCollection.save((err) => {
      if (err) {
        res.status(500).send('Update Failed!');
      } else {
        res.json(req.validatedProgramCollection);
      }
    });
  });

  const deleteProgramCollection = ((req, res) => {
    req.programCollection.remove((err) => {
      if (err) {
        res.status(500).send('Failed to remove program collection');
      } else {
        res.status(204).send('Removed');
      }
    });
  });

  return {
    postProgramCollections: postProgramCollections,
    getProgramCollections: getProgramCollections,
    getProgramCollection: getProgramCollection,
    putProgramCollection: putProgramCollection,
    deleteProgramCollection: deleteProgramCollection
  };
};

module.exports = programCollectionController;
