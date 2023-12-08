const express = require("express")
const app = express()
const Sequelize = require("sequelize")
const cors = require('cors');
const http = require('http').createServer(app);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});
const commander = require('commander');



const sequelize = new Sequelize("rip_db", "root", "admin", {
    dialect: "mysql",
    host: "db",
    port: "3306",
    define: {
        timestamp: false
    }
})

app.use(express.json())
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

app.options('*', cors());


const Task = sequelize.define("employee", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },


    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    patronym: {
        type: Sequelize.STRING,
        allowNull: false
    },

    birth_date: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

app.post('/register/', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received registration request:', { username });
        // Хешируем пароль перед сохранением в базу данных
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя в базе данных
        const newUser = await User.create({
            username,
            password: hashedPassword,
        });

        // Генерируем JWT для нового пользователя
        const token = jwt.sign({ username }, '$2b$10$3HVhKA2xxrCTEm4BKZ5oM.', { expiresIn: '1h' });

        // Отправляем токен клиенту
        res.json({ token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/login/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Найдем пользователя в базе данных
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Проверим пароль
        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Генерируем JWT для пользователя
        const token = jwt.sign({ username }, '$2b$10$3HVhKA2xxrCTEm4BKZ5oM.', { expiresIn: '1h' });

        // Отправляем токен клиенту
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};



app.get("/", function(request, response) {

    Task.findAll({raw:true}).then(tasks=>{
        response.send(tasks)})
})

app.post("/", function(request, response) {

    Task.create({
        
        surname: request.body.surname,
        name: request.body.name,
        patronym: request.body.patronym,
        birth_date: request.body.birth_date,
    })
    response.send("Done")
})

app.put("/", function(request, response) {

    Task.update({
        surname: request.body.surname,
        name: request.body.name,
        patronym: request.body.patronym,
        birth_date: request.body.birth_date,}, {
        where: {
            id: request.body.id
        }})
    response.send("Done")
})

app.delete("/", function (request, response) {
    try {
        Task.destroy({
            where: {
                id: request.body.id,
            },
        });
        response.send("Done");
    } catch (error) {
        console.error(`Error deleting record with ID ${request.body.id}:`, error);
        response.status(500).send("Internal Server Error");
    }
});

module.exports = {
    clearDatabase: async (id) => {
        try {
            await Task.destroy({
                where: {
                    id: id,
                },
            });
            console.log(`Record with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting record with ID ${id}:`, error);
            throw error; 
        }
    }
};


io.on('connection', (socket) => {
    console.log('Пользователь подключен', socket.id);
    
    // Получение информации о комнате от клиента
    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`Пользователь присоединился к комнате ${room}`);
        
    });

    socket.on('chat message', (data) => {
        console.log('Сообщение от клиента:', data);

        // Рассылка сообщения только в комнату клиента
        console.log(io.sockets.emit('chat message', data.message));

    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключен');
    });
});

http.listen(3000, '0.0.0.0', () => {
    console.log('Сервер запущен на порту 3000');
});