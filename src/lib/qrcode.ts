import QRCode from 'qrcode';

export async function qrcode(message: string,) {
    await QRCode.toFile('./qrcode.png', message);
}
