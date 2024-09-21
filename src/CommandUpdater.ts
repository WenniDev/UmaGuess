import { Glob } from "bun";
import { Collection } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import type DiscordCommand from "./interfaces/discordCommand";

const commandsFoldersPath = path.join(__dirname, "commands");
const commandsFolders = fs.readdirSync(commandsFoldersPath);
const glob = new Glob("*.ts");

interface commandOptions {
	name: string,
	value: string
}


class CommandUpdater {

	commandListAsChoices: commandOptions[] = [];
	commands: Collection<string, DiscordCommand> = new Collection();

	async getAll(): Promise<
		Collection<string, DiscordCommand>
	> {
		let commands = new Collection<string, DiscordCommand>();

		for (const folder of commandsFolders) {
			const commandsPath = path.join(commandsFoldersPath, folder);
			const commandFolder = glob.scanSync(commandsPath);
			for (const file of commandFolder) {
				const filePath = path.join(commandsPath, file);
				const command = (await import(filePath)).default as DiscordCommand;
				if (!command) continue;
				if (!command?.data) continue;
				if (!command?.execute) continue;

				commands.set(command?.data.name, command);
			}
		}
		this.commands = commands;
		return commands;
	}

	async get(command: DiscordCommand): Promise<DiscordCommand> {
		const commandFolder = path.join(commandsFoldersPath, command.data.name)
		const commandFile = path.join(commandFolder, `${command.data.name}.ts`)

		const newCommand = (await import(commandFile)).default as DiscordCommand;
		if (!newCommand) throw new Error("no commands found");
		if (!newCommand.data) throw new Error("the command have no data");
		if (!newCommand.execute) throw new Error("the command have no function");
	
		this.commands = await this.getAll();
		return newCommand;
	}

	async getCommandAsChoices() {
		const commandsList = Array.from(this.commands.keys());

		let options: commandOptions[] = []

		commandsList.forEach(commandName => {
			options.push({ name: commandName, value: commandName})
		})

		return options;
	}

}


export default new CommandUpdater()


