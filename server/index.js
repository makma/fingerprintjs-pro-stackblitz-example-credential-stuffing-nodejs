// server/index.js
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', '', '', {
  dialect: 'sqlite',
  storage: '.data/database.sqlite',
  logging: false,
});

const Visit = sequelize.define('visits', {
  visitorId: {
    type: Sequelize.STRING,
  },
  userName: {
    type: Sequelize.STRING,
  },
});

Visit.sync({ force: true });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const visitorLoginAttemptCountQueryResult = await Visit.findAndCountAll({
    where: {
      visitorId: req.body.visitorId,
      createdAt: {
        [Sequelize.Op.gt]: new Date(new Date() - 1 * 60 * 1000),
      },
    },
  });

  if (visitorLoginAttemptCountQueryResult.count > 4) {
    // do not try to perform login action
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        message:
          'You had more than 4 attempts during last minute. This login attempt was not performed.',
      })
    );
  } else {
    // try to perform login action
    await sequelize.sync();

    const visit = await Visit.create({
      visitorId: req.body.visitorId,
      userName: req.body.userName,
    });

    // dummy login action
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        message: 'Wrong password, try again, but do not stuff credentials!',
      })
    );
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
