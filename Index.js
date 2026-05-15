const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const balances = {};

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const id = message.author.id;

  if (!balances[id]) balances[id] = 1000;

  if (message.content === '!balance') {
    message.reply(`💰 You have ${balances[id]} coins.`);
  }

  if (message.content.startsWith('!bet ')) {
    const amount = parseInt(message.content.split(' ')[1]);

    if (isNaN(amount) || amount <= 0)
      return message.reply('Invalid amount.');

    if (amount > balances[id])
      return message.reply('Not enough coins.');

    const win = Math.random() < 0.5;

    if (win) {
      balances[id] += amount;
      message.reply(`🎉 You won ${amount} coins!`);
    } else {
      balances[id] -= amount;
      message.reply(`💀 You lost ${amount} coins.`);
    }
  }
});

client.login(process.env.TOKEN);
