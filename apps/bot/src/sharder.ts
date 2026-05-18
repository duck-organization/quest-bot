#!/usr/bin/env node
import process from 'node:process';
import 'dotenv/config';
import { ShardingManager } from 'discord.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const shardFile = join(__dirname, 'index.js');

const shardCountEnv = process.env.SHARD_COUNT;
let totalShards: number | 'auto' | undefined;
if (shardCountEnv) {
	if (shardCountEnv === 'auto') totalShards = 'auto';
	else {
		const parsed = Number(shardCountEnv);
		if (Number.isInteger(parsed) && parsed > 0) totalShards = parsed;
	}
}

if (totalShards !== undefined) {
	console.log(`Shard count: ${shardCountEnv}`);
} else {
	console.log('No shard count provided using what Discord recommends.');
}

const manager = new ShardingManager(shardFile, {
	token: process.env.DISCORD_TOKEN,
	...(totalShards ? { totalShards } : {}),
});

manager.on('shardCreate', (shard) => {
	console.log(`Launched shard ${shard.id}`);
});

void manager.spawn();
