import {
	Client,
	Events,
	GatewayIntentBits,
} from "discord.js";

import CommandUpdater from "./CommandUpdater";
import deployCommand from "./deploy_commands";

import logger from './logger'

const client = new Client({ intents: GatewayIntentBits.Guilds });

client.once(Events.ClientReady, async (c: Client) => {
	logger.info(`[init] Logged in as ${c.user?.tag}`);

	logger.info("[init] Loading commands");
	(client.commands = await CommandUpdater.getAll()).forEach((command) => {
		logger.debug(`Loaded command ${command.data.name}`);
	});

	logger.info("[init] Deploying commands");
	deployCommand(client.commands).then(() => {
		logger.debug(`Successfully deployed ${client.commands?.size} commands`);
	});
});


client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isAutocomplete()) return;

	const command = interaction.client.commands?.get(interaction.commandName);
	if (!command)
		return logger.info(
			`No command matching ${interaction.commandName} was found.`,
		);

	try {
		if (command.autocomplete)
			await command.autocomplete(interaction);
	} catch (error: any) {
		logger.error("Autocomplete failed")
	}
})

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands?.get(interaction.commandName);
	if (!command)
		return logger.info(
			`No command matching ${interaction.commandName} was found.`,
		);

	try {
		await command.execute(interaction);
		logger.info(`Command ${interaction.commandName} executed`);
	} catch (error: any) {
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
