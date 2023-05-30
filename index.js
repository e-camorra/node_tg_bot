const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5977607650:AAHPzi1LYzVV_4Vhb_2OlXnmPoy-W-9cnck';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;


  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'IDI NAHUI');
});

let userAnamnesis = null;
const chats = {};


let globalCount = null;


const questionsGenerator = (chatId, quest) => {
    try {
        let questionCount = globalCount;
        let q = quest[questionCount].map((element) => {
            return element
        });
        let buttons = quest[questionCount].map((element, index) => {
            variantCount = index + 1;
            return (
                { text: `Вариант ${variantCount}`, callback_data: `/q${questionCount + 1}_${variantCount}` }
            )
        })
        console.log(buttons)
        bot.sendMessage(chatId,
            `${q}`, questionTwo(buttons))
    } catch (e) { console.error(e) }
}



let aboutUs = ` это описание нашей компании, оно может быть очень длинным, или очень коротким, мы пока не определились:) `
const idBozhena = 606953393;



let endOfTest = (chatId) => {
    return (
        bot.sendMessage(chatId, `Спасибо за уделённое вами время. Ваши ответы на вопросы очень помогут нам в подборе индивидуального лечения для вас.`,
            endTest
        )
    )
}





const start = () => {

    bot.setMyCommands([
        { command: '/start', description: 'Запустить бота' },
        { command: '/about', description: 'Что умеет этот бот' },
        { command: '/anamnesis', description: 'Заполнить консультационную информацию' }
    ])


    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg);
        if (text === '/start') {
            console.log(userAnamnesis)
            return bot.sendPhoto(chatId, 'https://cdn.pixabay.com/photo/2020/05/26/12/56/image-5222934_960_720.jpg')
        }
        if (text === '/about') {
            return bot.sendMessage(chatId, `Привет ${msg.chat.first_name}, ${aboutUs}`)
        }
        if (text === '/anamnesis') {
            userAnamnesis = [];
            globalCount = 0;
            userAnamnesis.push([msg.chat.username])
            return questionsGenerator(chatId, questions)
        }
        return bot.sendMessage(chatId, `You sent me ${text}`)
    });






    bot.on('callback_query', async msg => {
        try {
            const data = msg.data;
            const chatId = msg.message.chat.id;
            const userName = msg.from.username;
            if (data === `/q${globalCount + 1}_1`) {
                userAnamnesis.push([`Вопрос №${globalCount + 1}`, `Ответ: 1`])
                globalCount++;
                if (globalCount < questions.length) {
                    return questionsGenerator(chatId, questions)
                } else {
                    endOfTest(chatId)
                }
            }
            if (data === `/q${globalCount + 1}_2`) {
                userAnamnesis.push([`Вопрос №${globalCount + 1}`, `Ответ: 2`])
                globalCount++;
                if (globalCount < questions.length) {
                    return questionsGenerator(chatId, questions)
                } else {
                    endOfTest(chatId)
                }
            }
            if (data === `/q${globalCount + 1}_3`) {
                userAnamnesis.push([`Вопрос №${globalCount + 1}`, `Ответ: 3`])
                globalCount++;
                if (globalCount < questions.length) {
                    return questionsGenerator(chatId, questions)
                } else {
                    endOfTest(chatId)
                }
            }
            if (data === '/endTest') {
                bot.sendMessage(chatId, `Данные успешно отправлены,дождитесь пока Божена свяжется с вами.`)
                bot.sendMessage(idBozhena, `${userAnamnesis}`)
            }
            if (data === '/cancel') {
                bot.sendMessage(chatId, `Нам очень жаль что вы передумали.`);
                userAnamnesis = null;
            }
            if (data === '/repeat') {
                await bot.sendMessage(chatId, `Давайте попробуем ещё раз.`)
                userAnamnesis = [];
                globalCount = 0;
                userAnamnesis.push([userName])
                await questionsGenerator(chatId, questions)
            }
        } catch (e) {
            console.error(e)
        }
    })
}

start()