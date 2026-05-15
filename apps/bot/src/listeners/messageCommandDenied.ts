import { Listener, type MessageCommandDeniedPayload, type UserError } from '@sapphire/framework';

export class MessageCommandDeniedListener extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, { ...options, event: 'messageCommandDenied' });
    }

    public override async run(error: UserError, { message }: MessageCommandDeniedPayload) {
        await message.reply({ content: error.message });
    }
}