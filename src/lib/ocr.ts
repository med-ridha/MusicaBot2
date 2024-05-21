import { Attachment } from "discord.js";
import Tesseract, { createWorker } from "tesseract.js";

const langs: Record<string, string> = {
    "afrikaans": "afr",
    "amharic": "amh",
    "arabic": "ara",
    "assamese": "asm",
    "azerbaijani": "aze",
    "azerbaijani cyrillic": "aze_cyrl",
    "belarusian": "bel",
    "bengali": "ben",
    "tibetan": "bod",
    "bosnian": "bos",
    "bulgarian": "bul",
    "catalan": "cat",
    "cebuano": "ceb",
    "czech": "ces",
    "chinese-simplified": "chi_sim",
    "chinese-traditional": "chi_tra",
    "cherokee": "chr",
    "welsh": "cym",
    "danish": "dan",
    "german": "deu",
    "dzongkha": "dzo",
    "greek": "ell",
    "english": "eng",
    "english middle": "enm",
    "esperanto": "epo",
    "estonian": "est",
    "basque": "eus",
    "persian": "fas",
    "finnish": "fin",
    "french": "fra",
    "german fraktur": "frk",
    "french middle": "frm",
    "irish": "gle",
    "galician": "glg",
    "greek ancient": "grc",
    "gujarati": "guj",
    "haitian": "hat",
    "hebrew": "heb",
    "hindi": "hin",
    "croatian": "hrv",
    "hungarian": "hun",
    "inuktitut": "iku",
    "indonesian": "ind",
    "icelandic": "isl",
    "italian": "ita",
    "italian-old": "ita_old",
    "javanese": "jav",
    "japanese": "jpn",
    "kannada": "kan",
    "georgian": "kat",
    "georgian-old": "kat_old",
    "kazakh": "kaz",
    "centralkhmer": "khm",
    "kirghiz": "kir",
    "korean": "kor",
    "kurdish": "kur",
    "lao": "lao",
    "latin": "lat",
    "latvian": "lav",
    "lithuanian": "lit",
    "malayalam": "mal",
    "marathi": "mar",
    "macedonian": "mkd",
    "maltese": "mlt",
    "malay": "msa",
    "burmese": "mya",
    "nepali": "nep",
    "dutch": "nld",
    "norwegian": "nor",
    "oriya": "ori",
    "panjabi": "pan",
    "polish": "pol",
    "portuguese": "por",
    "pushto": "pus",
    "romanian": "ron",
    "russian": "rus",
    "sanskrit": "san",
    "sinhala": "sin",
    "slovak": "slk",
    "slovenian": "slv",
    "spanish": "spa",
    "spanish old": "spa_old",
    "albanian": "sqi",
    "serbian": "srp",
    "serbian -latin": "srp_latn",
    "swahili": "swa",
    "swedish": "swe",
    "syriac": "syr",
    "tamil": "tam",
    "telugu": "tel",
    "tajik": "tgk",
    "tagalog": "tgl",
    "thai": "tha",
    "tigrinya": "tir",
    "turkish": "tur",
    "uighur": "uig",
    "ukrainian": "ukr",
    "urdu": "urd",
    "uzbek": "uzb",
    "uzbek -cyrillic": "uzb_cyrl",
    "vietnamese": "vie",
    "yiddish": "yid",
}
export async function scan(image: Attachment, lang: string): Promise<Tesseract.RecognizeResult | null> {
    try {
        if (lang in langs) {
            const worker = await createWorker(langs[lang])
            const ret = await worker.recognize(image.url);
            await worker.terminate();
            return ret;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error)
    }
    return null;
}

export function supportedLanguages(): string {
    let supported = "";
    for (let [key] of Object.entries(langs)) {
        supported += key + ", "
    }
    return supported;
}

