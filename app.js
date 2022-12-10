const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');

const _apiId = 16364360;
const _apiHash = 'b72f7efd7a5a707f2072150a00a2027b';
const _stringSession = new StringSession("");

async function main()
{
    const client = new TelegramClient(_stringSession, _apiId, _apiHash, { connectionRetries: 5 });
    await client.start({
        phoneNumber: async () => await input.text("Номер телефона к которому привязан телеграм: "),
        password: async () => await input.text("Пароль от телеграма: "),
        phoneCode: async () => await input.text("Введите код из приложения: "),
        onError: (err) => console.log(err)
    });

    fs.writeFileSync('./session.txt', `${client.session.save()}`, { flag: 'a+' });

    let _channels = await client.getDialogs({ limit: 300, archived: 0 });
    _channels.forEach((channel) => {
        fs.writeFileSync('./channels.txt', `${channel.name} | ${channel.id}\n`, { flag: 'a+' });
    });
}

main();