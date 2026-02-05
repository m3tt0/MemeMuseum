import { Tag } from "../models/MemeMuseumDB.js";
import { httpErrorHandler } from "./httpUtils.js";

export function validateTagContent(content) {
    const normalized = content.trim().toLowerCase();
    const TAG_REGEX = /^[a-z0-9_-]{1,20}$/;

    if (!TAG_REGEX.test(normalized)) {
        throw httpErrorHandler(400, "Invalid tag format. Allowed: a-z 0-9 _ - (1 to 20 chars)");
    }

    return normalized;
}

export async function resolveTags(tagList, transaction) {
    const tagIds = [];

    for (const rawTag of tagList) {
        const normalized = validateTagContent(rawTag);

        let tag = await Tag.findOne({ where: { content: normalized }, transaction });

        if (!tag) {
            tag = await Tag.create({ content: normalized }, { transaction });
        }

        tagIds.push(tag.tagId);
    }

    return tagIds;
}
