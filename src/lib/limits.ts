import type { EntitlementManager } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const LIMITS_ENABLED = process.env.LIMITS === 'true';
export const QUEST_UNLIMITED_SKU_ID = '1501683352820777092';

export class LimitError extends Error {
  public constructor(message: string, public readonly showQuestUnlimitedPrompt = false) {
    super(message);
    this.name = 'LimitError';
  }
}

export async function hasQuestUnlimitedAccess(entitlements: EntitlementManager, guildId: string) {
  try {
    const guildEntitlements = await entitlements.fetch({
      guild: guildId,
      skus: [QUEST_UNLIMITED_SKU_ID],
      excludeEnded: true,
      excludeDeleted: true
    });

    return guildEntitlements.size > 0;
  } catch {
    return false;
  }
}

export function getQuestUnlimitedUrl(applicationId: string) {
  return `https://discord.com/application-directory/${applicationId}/store/${QUEST_UNLIMITED_SKU_ID}`;
}

export function getQuestUnlimitedPurchaseComponents(applicationId: string) {
  const purchaseButton = new ButtonBuilder()
    .setLabel('Upgrade to QuestUnlimited')
    .setStyle(ButtonStyle.Link)
    .setURL(getQuestUnlimitedUrl(applicationId));

  return [new ActionRowBuilder<ButtonBuilder>().addComponents(purchaseButton)];
}