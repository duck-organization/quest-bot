import { Command } from '@sapphire/framework';
import { AttachmentBuilder, MessageFlags } from 'discord.js';
import sharp from 'sharp';
import { emojis } from '#utils/emoji.js';

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const MAX_SIZE = 20 * 1024 * 1024;

function isSafeUrl(raw: string): boolean {
	let url: URL;
	try { url = new URL(raw); } catch { return false; }
	if (url.protocol !== 'https:') return false;
	const host = url.hostname;
	if (/^(localhost|127\.|0\.0\.0\.0|::1|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.)/.test(host)) return false;
	return true;
}

export class ToGifCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, { ...options, preconditions: ['devMode'] });
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder: any) =>
			builder
				.setName('togif')
				.setDescription('Convert a PNG, JPEG, or WEBP image URL to a GIF.')
				.addStringOption((option: any) =>
					option.setName('url').setDescription('The image URL to convert.').setRequired(true).setMaxLength(512),
				),
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const url = interaction.options.getString('url', true);

		if (!isSafeUrl(url)) {
			await interaction.reply({ content: `${emojis.rightArrow1} URL not valid, HTTPS required.`, flags: MessageFlags.Ephemeral });
			return;
		}

		await interaction.deferReply();

		let response: Response;
		try {
			response = await fetch(url);
		} catch {
			await interaction.editReply(`${emojis.rightArrow1} Failed to fetch the URL.`);
			return;
		}

		if (!isSafeUrl(response.url)) {
			await interaction.editReply(`${emojis.rightArrow1} Redirected to a blocked URL.`);
			return;
		}

		if (!response.ok) {
			await interaction.editReply(`${emojis.rightArrow1} Could not retrieve the image (HTTP ${response.status}).`);
			return;
		}

		const contentType = response.headers.get('content-type')?.split(';')[0].trim() ?? '';
		if (!ALLOWED_TYPES.has(contentType)) {
			await interaction.editReply(`${emojis.rightArrow1} Only PNG, JPEG, and WEBP images are supported.`);
			return;
		}

		const contentLength = response.headers.get('content-length');
		if (contentLength && parseInt(contentLength, 10) > MAX_SIZE) {
			await interaction.editReply(`${emojis.rightArrow1} Image exceeds the 20 MB size limit.`);
			return;
		}

		const arrayBuffer = await response.arrayBuffer();
		if (arrayBuffer.byteLength > MAX_SIZE) {
			await interaction.editReply(`${emojis.rightArrow1} Image exceeds the 20 MB size limit.`);
			return;
		}
		const inputBuffer = Buffer.from(arrayBuffer);

		let gifBuffer: Buffer;
		try {
			gifBuffer = await sharp(inputBuffer).gif().toBuffer();
		} catch {
			await interaction.editReply(`${emojis.rightArrow1} Failed to convert the image to GIF.`);
			return;
		}

		const attachment = new AttachmentBuilder(gifBuffer, { name: 'toGif.gif' });
		await interaction.editReply({ files: [attachment] });
	}
}
