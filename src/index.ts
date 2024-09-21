import {
	Client,
	Events,
	GatewayIntentBits,
} from "discord.js";

import getCommands from "./getCommands";
import deployCommand from "./deploy_commands";

import logger from './logger'

const client = new Client({ intents: GatewayIntentBits.Guilds });

client.once(Events.ClientReady, async (c: Client) => {
	logger.info(`--- Logged in as ${c.user?.tag}`);

	logger.info("--- Loading commands");
	(client.commands = await getCommands()).forEach((command) => {
		logger.debug(`Loaded command ${command.data.name}`);
	});

	logger.info("--- Deploying commands");
	deployCommand(client.commands).then(() => {
		logger.debug(`Successfully deployed ${client.commands?.size} commands`);
	});
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands?.get(interaction.commandName);
	if (!command)
		return logger.error(
			`No command matching ${interaction.commandName} was found.`,
		);

	try {
		await command.execute(interaction);
		logger.info(`Command ${interaction.commandName} executed`);
	} catch (error) {
		logger.error(error);

		let msgError: any = {
			content: "There was an error while executing this command!",
			ephemeral: true,
		};

		await (interaction.replied || interaction.deferred
			? interaction.followUp(msgError)
			: interaction.reply(msgError));
	}
});

client.login(process.env.DISCORD_TOKEN);
