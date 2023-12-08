

const { clearDatabase } = require('./app.js');

const args = process.argv.slice(2); // Получаем аргументы командной строки, начиная с индекса 2
const recordId = parseInt(args[0]); // ID передается как первый аргумент

if (isNaN(recordId)) {
    console.error('Invalid record ID. Please provide a valid integer.');
    process.exit(1);
}

// Вызываем функцию для удаления записи
clearDatabase(recordId)
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        process.exit(1);
    });
