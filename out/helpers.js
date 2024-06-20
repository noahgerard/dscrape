"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAttachments = exports.normalizeMessages = void 0;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
function normalizeMessages(messages) {
    return messages.map((entry) => {
        const message = entry[1];
        return {
            id: message.id,
            createdTimestamp: message.createdTimestamp,
            content: message.content,
            embeds: message.embeds,
            attachments: message.attachments.map((attachment) => {
                return {
                    url: attachment.url,
                    filename: attachment.name
                };
            }),
        };
    });
}
exports.normalizeMessages = normalizeMessages;
function downloadAttachments(messages, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(options === null || options === void 0 ? void 0 : options.downloadPath)) {
            throw new Error("Download path is not defined.");
        }
        // Create the directory if it doesn't exist
        if (!fs_1.default.existsSync(options.downloadPath)) {
            fs_1.default.mkdirSync(options.downloadPath);
        }
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i][1];
            if ((options === null || options === void 0 ? void 0 : options.downloadMessageAttachments) && message.attachments.size > 0) {
                yield new Promise((resolve) => setTimeout(resolve, 100));
                for (let j = 0; j < message.attachments.size; j++) {
                    const attachment = message.attachments.at(j);
                    if (!attachment) {
                        continue;
                    }
                    /* if (attachment.name && !options.matchAttachmentName?.test(attachment.name)) {
                        continue;
                    } */
                    const url = attachment.url;
                    const filename = attachment.name;
                    yield (0, axios_1.default)({
                        method: "GET",
                        url: url,
                        responseType: "stream",
                    }).then((response) => {
                        response.data.pipe(fs_1.default.createWriteStream(`${options.downloadPath}/${message.id}-a${j}-${filename}`));
                    }).catch((error) => {
                        console.error(`Failed to download ${filename} (${message.id}): ${error}`);
                    });
                }
            }
            if ((options === null || options === void 0 ? void 0 : options.downloadEmbedAttachments) && message.embeds.length > 0) {
                // TODO: Implement downloading embed attachments
                /* for (let j = 0; j < message.embeds.length; j++) {
                    const embed = message.embeds[j];
                    const url = embed.image?.url || embed.image?.proxyURL;
    
                    if (!url) continue;
    
                    await axios({
                        method: "GET",
                        url: url,
                        responseType: "stream",
                    }).then((response) => {
                        response.data.pipe(fs.createWriteStream(`${options.downloadPath}/${message.id}-e${whatdoinamethislol}`));
                    }).catch((error) => {
                        console.error(`Failed to download ${url} (${message.id}): ${error}`);
                    });
                } */
            }
        }
    });
}
exports.downloadAttachments = downloadAttachments;
