import express from 'express';
import { faker } from '@faker-js/faker';

const app = express();
const port = 3000;

function generateUser() {
    return {
        userId: faker.datatype.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
    };
}

function* generateRandomUsers(max) {
    for (let i = 0; i < max; i++) {
        yield generateUser();
    }
}

app.use(express.json());
app.get('/root', (_req, res) => {
    res.status(200).send({ message: 'Fake server' });
});

app.post('/root', async (_req, res) => {
    const users = Array.from(
        generateRandomUsers(
            faker.datatype.number({
                min: 2,
                max: 50,
            }),
        ),
    );
    res.status(200).send(users);
});

app.listen(port, () => {
    console.log(`Fake server listening on port ${port}`);
});
